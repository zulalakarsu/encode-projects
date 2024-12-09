"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";

const genres = [
  { value: "Fantasy", label: "Fantasy", emoji: "🧙‍♂️", color: "bg-blue-500" },
  { value: "Mystery", label: "Mystery", emoji: "🔍", color: "bg-green-500" },
  { value: "Romance", label: "Romance", emoji: "❤️", color: "bg-red-500" },
];

const tones = [
  { value: "Happy", label: "Happy", emoji: "😊", color: "bg-yellow-500" },
  { value: "Informative", label: "Informative", emoji: "💡", color: "bg-blue-500" },
  { value: "Funny", label: "Funny", emoji: "😂", color: "bg-pink-500" },
];

const ageGroups = [
  { value: "3-5", label: "Preschool (3-5)", emoji: "🎠", color: "bg-orange-500" },
  { value: "6-8", label: "Early Reader (6-8)", emoji: "🌟", color: "bg-yellow-500" },
  { value: "9-12", label: "Middle Grade (9-12)", emoji: "🚀", color: "bg-indigo-500" },
];

export default function Storyteller() {
  const [genre, setGenre] = useState<string>("Fantasy")
  const [tone, setTone] = useState<string>("Happy")
  const [story, setStory] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [voiceOption, setVoiceOption] = useState("default")
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [storyTitle, setStoryTitle] = useState<string>("")
  const [isExpanded, setIsExpanded] = useState(true);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [ageGroup, setAgeGroup] = useState<string>("6-8");
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const { messages, append, isLoading } = useChat()

  // Add a ref to track if audio is being generated
  const isGeneratingAudio = useRef(false);

  // Add loading state for chat
  const [isChatLoading, setChatLoading] = useState(false);

  const [audioState, setAudioState] = useState<{
    isLoading: boolean;
    isPlaying: boolean;
    audio: HTMLAudioElement | null;
  }>({
    isLoading: false,
    isPlaying: false,
    audio: null
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Update story and title when messages change
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        const content = lastMessage.content;
        const titleMatch = content.match(/TITLE:(.*)/);
        if (titleMatch) {
          const title = titleMatch[1].trim();
          const storyContent = content.replace(/TITLE:.*\n/, '').trim();
          setStoryTitle(title);
          setStory(storyContent);
        }
      }
    }
  }, [messages]);

  // Update handlePlayAudio to prevent multiple calls
  const handlePlayAudio = async () => {
    if (audioState.isLoading || !story) return;

    // If audio is already loaded, just play it
    if (audioRef.current) {
      audioRef.current.play();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
      return;
    }

    setAudioState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: story,
          tone: tone,
          ageGroup: ageGroup
        })
      });

      if (!response.ok) throw new Error('Audio generation failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
        URL.revokeObjectURL(audioUrl);
      };
      
      audioRef.current = audio;
      await audio.play();
      
      setAudioState({
        isLoading: false,
        isPlaying: true,
        audio: audio
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  // Update handleGenerateStory to properly reset audio states
  const handleGenerateStory = async () => {
    if (!genre || !tone || !ageGroup || isChatLoading) return;
    
    // Reset all states
    setStory("");
    setStoryTitle("");
    
    // Clean up existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    
    setAudioState({
      isLoading: false,
      isPlaying: false,
      audio: null
    });
    
    try {
      setChatLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Create a short ${genre} story suitable for children aged ${ageGroup} that is genuinely ${tone.toLowerCase()} in tone. 
            First, provide a title on a single line starting with "TITLE:", then follow with the story. 
            The story should be engaging, approximately 4-5 paragraphs long, and maintain a consistent ${tone.toLowerCase()} tone throughout.`
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      const content = data.content;
      
      // Parse title and story
      const titleMatch = content.match(/TITLE:(.*)/);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        const storyContent = content.replace(/TITLE:.*\n/, '').trim();
        setStoryTitle(title);
        setStory(storyContent);
      }

    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setChatLoading(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  // Clean up audio resources when story changes or component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }
      setAudioState({
        isLoading: false,
        isPlaying: false,
        audio: null
      });
    };
  }, [story]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-500 to-red-500 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800">AI Story Generator</h1>
          <p className="text-gray-600 mt-2">Create magical stories with AI</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-700">Choose a Genre:</h3>
          <div className="flex flex-wrap gap-4">
            {genres.map((item) => (
              <button
                key={item.value}
                onClick={() => setGenre(item.value)}
                className={`flex-1 min-w-[120px] flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 cursor-pointer transition-all ${
                  genre === item.value
                    ? `${item.color} border-purple-500 shadow-lg scale-105`
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl mb-2">{item.emoji}</span>
                <span className={genre === item.value ? 'text-white' : 'text-black'}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-700">Choose a Tone:</h3>
          <div className="flex flex-wrap gap-4">
            {tones.map((item) => (
              <button
                key={item.value}
                onClick={() => setTone(item.value)}
                className={`flex-1 min-w-[120px] flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 cursor-pointer transition-all ${
                  tone === item.value
                    ? `${item.color} border-purple-500 shadow-lg scale-105`
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl mb-2">{item.emoji}</span>
                <span className={tone === item.value ? 'text-white' : 'text-black'}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-700">Select Age Group:</h3>
          <div className="flex flex-wrap gap-4">
            {ageGroups.map((item) => (
              <button
                key={item.value}
                onClick={() => setAgeGroup(item.value)}
                className={`flex-1 min-w-[120px] flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 cursor-pointer transition-all ${
                  ageGroup === item.value
                    ? `${item.color} border-purple-500 shadow-lg scale-105`
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl mb-2">{item.emoji}</span>
                <span className={ageGroup === item.value ? 'text-white' : 'text-black'}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateStory}
          disabled={isChatLoading || !genre || !tone || !ageGroup}
          className={`w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 rounded-full transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isChatLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isChatLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Generating...</span>
            </div>
          ) : (
            'Generate Magical Story!'
          )}
        </button>

        {story && (
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-purple-800">
                  {storyTitle}
                </h3>
                
                {/* Simple Play/Stop Button */}
                <button
                  onClick={audioState.isPlaying ? handleStopAudio : handlePlayAudio}
                  disabled={audioState.isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full 
                    ${audioState.isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700'} 
                    text-white transition-all
                    ${audioState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {audioState.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <>
                      {audioState.isPlaying ? '⏹️ Stop' : '▶️ Play'}
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-3 py-1 rounded-full bg-purple-200 text-purple-800 hover:bg-purple-300"
                >
                  {isExpanded ? '▼' : '▲'}
                </button>
              </div>
              
              {isExpanded && (
                <div className="space-y-4">
                  <p className="text-black leading-relaxed">{story}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8 pt-4 border-t border-gray-200">
          <div className="text-center">
            <span className="text-4xl">✨</span>
            <p className="text-sm text-gray-500 mt-2">Powered by AI Magic</p>
          </div>
        </div>
      </div>
    </div>
  )
}