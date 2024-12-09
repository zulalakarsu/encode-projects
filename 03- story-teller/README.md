AI Story Telling app 
This web application generates short stories based on custom characters, genres, and tones. Built with React and NextJS
You can also generate the audio and listen to the generated story. 

Genres:
 Fantasy
 Mystery
 Romance

Tones
 Happy
 Informative
 Funny
 
 AgeGroups = [
  { value: "3-5", label: "Preschool (3-5)", emoji: "🎠", color: "bg-orange-500" },
  { value: "6-8", label: "Early Reader (6-8)", emoji: "🌟", color: "bg-yellow-500" },
  { value: "9-12", label: "Middle Grade (9-12)", emoji: "🚀", color: "bg-indigo-500" },


Installation
1. Open terminal 
2. Create a new folder 
3. Create a new NextJS project using the following command:

npx create-next-app@latest story-telling-app

4. Open the new folder

5. Install dependencies 

npm install ai @ai-sdk/openai
npm install ai openai
Note: Add your OPEN API KEY to a local envirnoment or .env.local file in the root of the project

6. Start the development server:
npm run dev

7. Navigate to http://localhost:3000 


