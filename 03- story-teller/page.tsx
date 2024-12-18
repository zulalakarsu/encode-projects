"use client";

import { useState, useEffect } from "react";
import { useChat } from "ai/react";

const genres = [
  { value: "Fantasy", label: "Fantasy", emoji: "🧙‍♂️", color: "bg-blue-500" },
  { value: "Mystery", label: "Mystery", emoji: "🔍", color: "bg-green-500" },
  { value: "Romance", label: "Romance", emoji: "❤️", color: "bg-red-500" },
  { value: "Sci-Fi", label: "Sci-Fi", emoji: "🚀", color: "bg-purple-500" },
];

const tones = [
  { value: "Happy", label: "Happy", emoji: "😊", color: "bg-yellow-500" },
  { value: "Sad", label: "Sad", emoji: "😢", color: "bg-blue-500" },
  { value: "Sarcastic", label: "Sarcastic", emoji: "😏", color: "bg-pink-500" },
  { value: "Funny", label: "Funny", emoji: "😂", color: "bg-purple-500" },
];

// const ageGroups = [
//   { value: "3-5", label: "Preschool (3-5)", emoji: "🎠", color: "bg-orange-500" },
//   { value: "6-8", label: "Early Reader (6-8)", emoji: "🌟", color: "bg-yellow-500" },
//   { value: "9-12", label: "Middle Grade (9-12)", emoji: "🚀", color: "bg-indigo-500" },
// ];

export default function Storyteller() {
  const [genre, setGenre] = useState<string>("Fantasy");
  const [tone, setTone] = useState<string>("Happy");
  const [story, setStory] = useState<string>("");
  const [isChatLoading, setChatLoading] = useState(false);
  const [storyTitle, setStoryTitle] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editingCharacter, setEditingCharacter] = useState({
    name: "",
    description: "",
    personality: "",
  });
  const [characters, setCharacters] = useState<{
    name: string;
    description: string;
    personality: string;
  }[]>([]);
  const [characterSummaries, setCharacterSummaries] = useState<{
    [key: string]: string;
  }>({});
  const [isEditingStory, setIsEditingStory] = useState(false);

  const { messages } = useChat();

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

  const handleGenerateStory = async () => {
    if (!genre || !tone || isChatLoading) return;

    // Reset states
    setStory("");
    setStoryTitle("");
    setCharacterSummaries({});

    try {
      setChatLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Create a ${genre} story that is ${tone.toLowerCase()} in tone with the following characters: ${
              characters.length > 0 
                ? characters.map(char => 
                    `${char.name} (Description: ${char.description}, Personality: ${char.personality})`
                  ).join(", ")
                : "Create your own characters"
            }. 
            First, provide a title on a single line starting with "TITLE:", then follow with the story. 
            After the story, provide a brief summary of each character's role starting with "CHARACTER_SUMMARY:".
            The story should be engaging, approximately 3 sentences long, and maintain a consistent ${tone.toLowerCase()} tone throughout.`
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      const content = data.content;

      // Parse title, story, and character summaries
      const titleMatch = content.match(/TITLE:(.*?)(?=\n)/);
      const summaryMatch = content.match(/CHARACTER_SUMMARY:([\s\S]*?)$/);
      
      if (titleMatch) {
        const title = titleMatch[1].trim();
        let storyContent = content
          .replace(/TITLE:.*\n/, '')
          .replace(/CHARACTER_SUMMARY:[\s\S]*$/, '')
          .trim();
        
        setStoryTitle(title);
        setStory(storyContent);

        // Parse character summaries if they exist
        if (summaryMatch) {
          const summaryText = summaryMatch[1].trim();
          const summaries: { [key: string]: string } = {};
          
          // Split summaries by character name and store them
          characters.forEach(char => {
            const charSummaryMatch = summaryText.match(
              new RegExp(`${char.name}:([^]*?)(?=\\n\\n|$)`)
            );
            if (charSummaryMatch) {
              summaries[char.name] = charSummaryMatch[1].trim();
            }
          });
          
          setCharacterSummaries(summaries);
        }
      }

    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editIndex !== null) {
      setEditingCharacter((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setEditingCharacter((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const startEditing = (index: number) => {
    setEditIndex(index);
    setEditingCharacter(characters[index]);
  };

  const saveEdit = () => {
    if (editIndex !== null) {
      const updatedCharacters = characters.map((character, i) =>
        i === editIndex ? editingCharacter : character
      );
      setCharacters(updatedCharacters);
      setEditIndex(null);
      setEditingCharacter({ name: "", description: "", personality: "" });
    }
  };

  const updateExistingStory = async () => {
    if (!genre || !tone || isChatLoading) return;

    try {
      setChatLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Here's an existing story with title "${storyTitle}":

            ${story}

            Please update this story to incorporate the following characters: ${
              characters.length > 0 
                ? characters.map(char => 
                    `${char.name} (Description: ${char.description}, Personality: ${char.personality})`
                  ).join(", ")
                : "Create your own characters"
            }. 
            
            Keep the same genre (${genre}) and ${tone.toLowerCase()} tone, but modify the story to include these characters.
            First, provide a title on a single line starting with "TITLE:", then follow with the story. 
            After the story, provide a brief summary of each character's role starting with "CHARACTER_SUMMARY:".
            The story should be engaging, approximately 3 sentences long.`
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Failed to update story');
      }

      const data = await response.json();
      const content = data.content;

      // Parse title, story, and character summaries
      const titleMatch = content.match(/TITLE:(.*?)(?=\n)/);
      const summaryMatch = content.match(/CHARACTER_SUMMARY:([\s\S]*?)$/);
      
      if (titleMatch) {
        const title = titleMatch[1].trim();
        let storyContent = content
          .replace(/TITLE:.*\n/, '')
          .replace(/CHARACTER_SUMMARY:[\s\S]*$/, '')
          .trim();
        
        setStoryTitle(title);
        setStory(storyContent);

        // Parse character summaries if they exist
        if (summaryMatch) {
          const summaryText = summaryMatch[1].trim();
          const summaries: { [key: string]: string } = {};
          
          // Split summaries by character name and store them
          characters.forEach(char => {
            const charSummaryMatch = summaryText.match(
              new RegExp(`${char.name}:([^]*?)(?=\\n\\n|$)`)
            );
            if (charSummaryMatch) {
              summaries[char.name] = charSummaryMatch[1].trim();
            }
          });
          
          setCharacterSummaries(summaries);
        }
      }

    } catch (error) {
      console.error('Error updating story:', error);
    } finally {
      setChatLoading(false);
      setIsEditingStory(false);
    }
  };

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
          <h3 className="text-xl font-semibold text-purple-700">Story Characters:</h3>
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2 text-left">Name</th>
                  <th className="border-b p-2 text-left">Description</th>
                  <th className="border-b p-2 text-left">Personality</th>
                  <th className="border-b p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {characters.map((character, index) => (
                  <tr key={index}>
                    <td className="border-b p-2 text-gray-800">
                      {editIndex === index ? (
                        <input
                          type="text"
                          name="name"
                          value={editingCharacter.name}
                          onChange={handleCharacterChange}
                          className="w-full p-1 border rounded text-black"
                        />
                      ) : (
                        character.name
                      )}
                    </td>
                    <td className="border-b p-2 text-gray-800">
                      {editIndex === index ? (
                        <input
                          type="text"
                          name="description"
                          value={editingCharacter.description}
                          onChange={handleCharacterChange}
                          className="w-full p-1 border rounded text-black"
                        />
                      ) : (
                        character.description
                      )}
                    </td>
                    <td className="border-b p-2 text-gray-800">
                      {editIndex === index ? (
                        <input
                          type="text"
                          name="personality"
                          value={editingCharacter.personality}
                          onChange={handleCharacterChange}
                          className="w-full p-1 border rounded text-black"
                        />
                      ) : (
                        character.personality
                      )}
                    </td>
                    <td className="border-b p-2">
                      <div className="flex gap-2">
                        {editIndex === index ? (
                          <button
                            onClick={saveEdit}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditing(index)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const newCharacters = characters.filter((_, i) => i !== index);
                            setCharacters(newCharacters);
                          }}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Character Form */}
            <div className="mt-4 space-y-2">
              <input
                type="text"
                name="name"
                placeholder="Character Name"
                value={editingCharacter.name}
                onChange={handleCharacterChange}
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="text"
                name="description"
                placeholder="Character Description"
                value={editingCharacter.description}
                onChange={handleCharacterChange}
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="text"
                name="personality"
                placeholder="Character Personality"
                value={editingCharacter.personality}
                onChange={handleCharacterChange}
                className="w-full p-2 border rounded text-black"
              />
              <button
                onClick={() => {
                  if (editingCharacter.name && editingCharacter.description && editingCharacter.personality) {
                    if (editIndex !== null) {
                      // If editing, update existing character
                      const updatedCharacters = characters.map((character, i) =>
                        i === editIndex ? editingCharacter : character
                      );
                      setCharacters(updatedCharacters);
                      setEditIndex(null);
                    } else {
                      // If adding new character
                      setCharacters([...characters, editingCharacter]);
                    }
                    setEditingCharacter({ name: "", description: "", personality: "" });
                  }
                }}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                {editIndex !== null ? 'Save' : 'Add Character'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateStory}
          disabled={isChatLoading || !genre || !tone}
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
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-3 py-1 rounded-full bg-purple-200 text-purple-800 hover:bg-purple-300"
                  >
                    {isExpanded ? '▼' : '▲'}
                  </button>
                  {isExpanded && (
                    <button
                      onClick={() => setIsEditingStory(true)}
                      className="px-4 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Edit Story
                    </button>
                  )}
                </div>
              </div>
              
              {isExpanded && (
                <div className="space-y-4">
                  <p className="text-black leading-relaxed">{story}</p>
                  
                  {/* Character Summaries Section */}
                  {Object.keys(characterSummaries).length > 0 && (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-xl font-semibold text-purple-700 mb-4">
                        Character Roles in the Story
                      </h4>
                      <div className="space-y-3">
                        {characters.map((char) => (
                          characterSummaries[char.name] && (
                            <div key={char.name} className="bg-purple-50 rounded-lg p-4">
                              <h5 className="font-semibold text-purple-800 mb-2">
                                {char.name}
                              </h5>
                              <p className="text-gray-700">
                                {characterSummaries[char.name]}
                              </p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Story Update Button */}
                  {isEditingStory && (
                    <div className="mt-6 border-t pt-4">
                      <button
                        onClick={updateExistingStory}
                        disabled={isChatLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isChatLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Updating Story...</span>
                          </div>
                        ) : (
                          'Update Story with Character Changes'
                        )}
                      </button>
                    </div>
                  )}
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
