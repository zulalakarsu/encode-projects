This joke generator app is created using NextJS using npx create-next-app my-joke-app 
Necesarry route.ts file was created under the api/chat folders 

Users can set certain parameters such as topic, tone, type and temperature. Also a feature is added to make AI evaluate if the generated jokes. Options are:

const topics = ["work", "people", "animals", "food", "television", "sports", "technology"];
const tones = ["witty", "sarcastic", "silly", "dark", "goofy", "clean"];
const jokeTypes = ["pun", "knock-knock", "story", "one-liner", "riddle", "wordplay"];
  
AI prompt is created on the route.ts file as: 
    temperature: options?.temperature ?? 1,
    messages: [
      {
        role: 'system',
        content: `You are a comedian and joke critic. First generate a ${jokeType} joke about ${topic} with a ${tone} tone. 
        Then, on a new line after "EVALUATION:", provide a brief analysis of the joke considering:
        - Humor Level (1-10)
        - Appropriateness (1-10)
        - Originality (1-10)
        - Alignment with requested tone
        Keep the evaluation concise and professional.`,
      },

After configuring the parameters, users can click a button to generate the joke on the same display. 

Example input & output: 

Select a Topic: Work
Select Tone:Sarcastic
Select Joke Type: Riddle
Creativity Level: 2.00 (Creative)
Lower values produce more predictable jokes, higher values produce more creative but potentially chaotic results

User: Generate a witty pun joke about work
AI: 
Why did the scarecrow become a successful manager? Because he was outstanding in his field!
Joke Evaluation:
- Humor Level: 7  
- Appropriateness: 9  
- Originality: 8  
- Alignment with requested tone: 9
