"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const { messages, isLoading, append } = useChat();
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [audioIsLoading, setAudioIsLoading] = useState(false);
  const [audio, setAudio] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewRecipe = () => {
    setImage(null);
    setAudio(null);
    setShowDetails(false);
    append({
      role: "user",
      content: "Give me a random recipe",
    });
  };

  if (detailsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">Generating recipe details...</p>
      </div>
    );
  }

  if (showDetails && image) {
    return (
      <div className="flex flex-col p-4 items-center gap-4 h-screen">
        <div className="max-w-2xl w-full relative">
          <button
            onClick={() => setShowDetails(false)}
            className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            ×
          </button>
          <img 
            src={`data:image/jpeg;base64,${image}`}
            className="w-full rounded-lg shadow-lg"
            alt="Generated recipe"
          />
          <textarea
            className="mt-4 w-full text-white bg-black h-64 p-4 rounded"
            value={messages[messages.length - 1].content}
            readOnly
          />
          <div className="flex flex-col justify-center mb-2 items-center">
            {audio && (
              <>
                <p className="text-white mt-4 mb-2">Listen to the recipe:</p>
                <audio controls src={audio} className="w-full"></audio>
              </>
            )}
            {audioIsLoading && (
              <p className="text-white mt-2">Audio is being generated...</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowDetails(false)}
          className="bg-blue-500 p-2 text-white rounded shadow-xl mt-4"
        >
          Back to Recipe
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch overflow-hidden">
      <div
        className="overflow-auto w-full mb-8"
        ref={messagesContainerRef}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-green-700 p-3 m-2 rounded-lg"
                : "bg-slate-700 p-3 m-2 rounded-lg"
            }`}
          >
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end pr-4">
            <span className="animate-pulse text-2xl">...</span>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 w-full max-w-md">
        <div className="flex flex-col justify-center mb-2 items-center">
          {messages.length === 0 && (
            <button
              className="bg-blue-500 p-2 text-white rounded shadow-xl"
              disabled={isLoading}
              onClick={handleNewRecipe}
            >
              Random Recipe
            </button>
          )}
          {messages.length > 0 && !isLoading && (
            <div className="flex gap-2">
              <button
                className="bg-blue-500 p-2 text-white rounded shadow-xl"
                disabled={isLoading}
                onClick={handleNewRecipe}
              >
                New Recipe
              </button>
              <button
                className="bg-blue-500 p-2 text-white rounded shadow-xl"
                disabled={isLoading}
                onClick={async () => {
                  setDetailsLoading(true);
                  try {
                    const [imageResponse, audioResponse] = await Promise.all([
                      fetch("api/images", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          message: messages[messages.length - 1].content,
                        }),
                      }),
                      fetch("/api/audio", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          message: messages[messages.length - 1].content,
                        }),
                      }),
                    ]);

                    const imageData = await imageResponse.json();
                    const audioBlob = await audioResponse.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);

                    setImage(imageData);
                    setAudio(audioUrl);
                    setShowDetails(true);
                  } catch (error) {
                    console.error('Failed to generate details:', error);
                  } finally {
                    setDetailsLoading(false);
                  }
                }}
              >
                Generate Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}