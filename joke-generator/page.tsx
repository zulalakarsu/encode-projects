"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const { messages, append } = useChat();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [topic, setTopic] = useState("work");
  const [tone, setTone] = useState("witty");
  const [jokeType, setJokeType] = useState("pun");
  const [temperature, setTemperature] = useState(1);

  const topics = ["work", "people", "animals", "food", "television", "sports", "technology"];
  const tones = ["witty", "sarcastic", "silly", "dark", "goofy", "clean"];
  const jokeTypes = ["pun", "knock-knock", "story", "one-liner", "riddle", "wordplay"];

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleGenerateJoke = () => {
    append({
      role: "user",
      content: `Generate a ${tone} ${jokeType} joke about ${topic}`,
    }, { options: { temperature } });
  };

  const formatMessage = (content: string) => {
    if (!content.includes('EVALUATION:')) return content;

    const [joke, evaluation] = content.split('EVALUATION:');
    return (
      <div className="flex flex-col gap-2">
        <div className="text-lg">{joke.trim()}</div>
        <div className="mt-4 p-3 bg-slate-800 rounded-lg">
          <h3 className="font-bold text-yellow-400 mb-2">Joke Evaluation:</h3>
          <div className="text-sm text-gray-300">
            {evaluation.trim()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="topic" className="text-white">Select a Topic:</label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-2 rounded bg-slate-700 text-white"
          >
            {topics.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tone" className="text-white">Select Tone:</label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="p-2 rounded bg-slate-700 text-white"
          >
            {tones.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="jokeType" className="text-white">Select Joke Type:</label>
          <select
            id="jokeType"
            value={jokeType}
            onChange={(e) => setJokeType(e.target.value)}
            className="p-2 rounded bg-slate-700 text-white"
          >
            {jokeTypes.map((t) => (
              <option key={t} value={t}>
                {t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="temperature" className="text-white">
            Creativity Level: {temperature.toFixed(2)}
          </label>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Conservative</span>
            <input
              type="range"
              id="temperature"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="flex-grow h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <span>Creative</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Lower values produce more predictable jokes, higher values produce more creative but potentially chaotic results
          </div>
        </div>

        <button
          onClick={handleGenerateJoke}
          className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors mt-4"
        >
          Generate Joke
        </button>
      </div>

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
            <div className="font-bold mb-2">
              {m.role === "user" ? "User: " : "AI: "}
            </div>
            {typeof m.content === 'string' && formatMessage(m.content)}
          </div>
        ))}
      </div>
    </div>
  );
}