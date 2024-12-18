# AI Joke Generator  

## Overview  
The **AI Joke Generator** is a fun and customizable Next.js application that allows users to generate jokes based on specific parameters. Users can select the topic, tone, type of joke, and creativity level (temperature) for tailored results. Additionally, the app evaluates the joke's humor, appropriateness, and originality for added insights.

---

## Table of Contents  
- [Features](#features)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [How It Works](#how-it-works)  
- [Usage](#usage)  
- [Example Output](#example-output)  
- [Technical Details](#technical-details)  

---

## Features  

- **Custom Joke Generation**:  
  Users can customize the joke with the following parameters:  
  - **Topics**: Work, people, animals, food, television, sports, technology.  
  - **Tones**: Witty, sarcastic, silly, dark, goofy, clean.  
  - **Joke Types**: Pun, knock-knock, story, one-liner, riddle, wordplay.  
  - **Temperature**: Adjust creativity levels (lower = predictable, higher = creative but chaotic).  

- **Joke Evaluation**:  
  The AI analyzes the generated joke for:  
  - Humor Level  
  - Appropriateness  
  - Originality  
  - Tone alignment  

- **User-Friendly Interface**:  
  Simple input fields and a display section for joke generation and evaluation.  

---

## Prerequisites  

To run this project locally, ensure you have the following:  
1. **Node.js** and **npm** installed.  
2. **OpenAI API Key** for AI integrations.  

---

## Installation  

### Step 1: Set Up the Project  

1. Open your terminal or command prompt.  
2. Create a new project directory:  
   ```bash
   mkdir my-projects  
   cd my-projects  
   ```

3. Create a new Next.js project:  
   ```bash
   npx create-next-app@latest ai-joke-app  
   cd ai-joke-app  
   ```

4. Choose the default options when prompted:  
   - TypeScript: Yes/No (optional)  
   - ESLint: Yes  
   - Tailwind CSS: No  
   - App Router: Yes  

---

### Step 2: Install Dependencies  

1. Install required libraries:  
   ```bash
   npm install ai @ai-sdk/openai  
   ```

2. Set up the OpenAI API key:  
   - Create a `.env.local` file in the project root directory:  
     ```bash
     touch .env.local  
     ```  
   - Add your OpenAI API key:  
     ```bash
     OPENAI_API_KEY=your_openai_api_key_here  
     ```

---

### Step 3: Add Project Files  

1. Replace the `page.tsx` file:  
   - Download `page.tsx` from the repository and replace the default file in `app/page.tsx`.  

2. Create API Routes:  
   - Navigate to the `app` folder and create the following structure:  
     ```
     app/
     └── api/
         └── chat/
             └── route.ts
     ```  
   - Add the provided `route.ts` file to `api/chat`.  

---

### Step 4: Run the Project  

1. Start the development server:  
   ```bash
   npm run dev  
   ```

2. Open your browser and navigate to:  
   ```bash
   http://localhost:3000  
   ```

---

## How It Works  

1. Users select the desired **parameters** for the joke:  
   - **Topic**: Work, animals, etc.  
   - **Tone**: Sarcastic, witty, etc.  
   - **Joke Type**: Riddle, pun, etc.  
   - **Temperature**: Adjust creativity.  

2. Upon clicking **"Generate Joke"**, the app sends a request to the API.  

3. The API generates the joke and evaluates it based on the following criteria:  
   - Humor Level  
   - Appropriateness  
   - Originality  
   - Tone alignment  

4. Both the joke and the evaluation are displayed on the screen.

---

## Usage  

1. **Customize Parameters**:  
   - Select options for **topic**, **tone**, and **joke type**.  
   - Adjust the **temperature** slider for creativity.  

2. **Generate Joke**:  
   - Click the **"Generate Joke"** button to fetch the AI-generated joke.  

3. **View Evaluation**:  
   - Review the AI evaluation for humor level, appropriateness, and originality.  

4. **Reset**:  
   - Modify parameters and generate new jokes.  

---

## Example Output  

**Input Parameters**:  
- Topic: **Work**  
- Tone: **Sarcastic**  
- Joke Type: **Riddle**  
- Creativity Level: **2.0**  

**Output**:  
```  
Why did the scarecrow become a successful manager?  
Because he was outstanding in his field!  

Joke Evaluation:  
- Humor Level: 7  
- Appropriateness: 9  
- Originality: 8  
- Alignment with requested tone: 9  
```  

