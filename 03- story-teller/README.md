# Story-Teller App Using Text Generation WebUI  

## Overview  

This project is a **Next.js** application designed for dynamic **story generation** using user-created characters and integrating AI models via the **Text Generation WebUI API**. The app allows users to manage characters, customize story parameters, and evaluate outputs from various AI models locally.

---

## Table of Contents  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Running the Application](#running-the-application)  
- [Features](#features)  
- [Usage](#usage)  
- [Error Handling](#error-handling)  

---

## Prerequisites  

Before you begin, ensure you have the following:  
- Basic knowledge of **bash commands** (Linux/Mac) or **Command Prompt** (Windows).  
- **Node.js** and **npm** installed on your machine.  
- An OpenAI API Key.  
- **Text Generation WebUI** installed and running.  

---

## Installation  

### Step 1: Set Up the Project  

1. Create a new project directory:  
   ```bash
   mkdir my-projects  
   cd my-projects  
   ```

2. Create a new Next.js application:  
   ```bash
   npx create-next-app@latest story-telling-app  
   cd story-telling-app  
   ```

3. Accept all default options during setup.  

---

### Step 2: Install Dependencies  

1. Update dependencies to fix warnings:  
   ```bash
   npm update eslint  
   npm update rimraf  
   npm update glob  
   ```

2. Install required libraries:  
   ```bash
   npm install ai @ai-sdk/openai  
   npm install lucide-react  
   ```

3. Set up your OpenAI API Key:  
   - Create a `.env.local` file in the root directory:  
     ```bash
     touch .env.local  
     ```
   - Add your OpenAI API key:  
     ```bash
     OPENAI_API_KEY=your_openai_api_key_here  
     ```

---

### Step 3: Integrate Project Files  

Replace the default Next.js files with the project components:  

1. **Replace `page.tsx`**:  
   - Download the provided `page.tsx` from the GitHub repository and place it in `app/page.tsx`.  

2. **Create API Routes**:  
   - Navigate to the `app` folder and create the following structure:  
     ```
     app/
     └── api/
         └── chat/
             └── route.ts
     ```  
   - Add the provided `route.ts` file in the `chat` directory.  

3. **Optional**: Replace the `global.css` file to include additional UI styling.  

---

## Running the Application  

### 1. Run the Text Generation WebUI  

- Start the **Text Generation WebUI** with the API server enabled.  
- Open your browser and navigate to:  
  ```bash
  http://127.0.0.1:7860  
  ```
- Confirm that the API server is accepting requests and a model is loaded in the **Model Tab**.  
- Verify the following in the **Session Tab**:  
  - **API** is selected.  
  - **OpenAI** is enabled.  

### 2. Run Your Local API  

Ensure your API endpoint is active on port **5000** (or another specified port).  

### 3. Start the Next.js App  

Run the development server:  
```bash
npm run dev  
```

Navigate to:  
```bash
http://localhost:3000  
```

---

## Features  

### **Character Management**  
- Create, edit, and delete characters.  
- Define attributes such as:  
  - **Name**  
  - **Description**  
  - **Personality**  

### **Custom Story Generation**  
- Generate AI-powered stories with user-created characters.  
- Customize the following parameters:  
  - **Genre**: Fantasy, Mystery, Romance, Sci-Fi  
  - **Tone**: Happy, Sad, Sarcastic, Funny  

### **Dynamic Summaries**  
- After the story is generated, view a summary of each character's role and contribution.

### **Real-Time Text Generation**  
- Integrate and test AI models using **Text Generation WebUI**.  
- Stream-based story delivery for better real-time performance.  

### **Model Experimentation**  
- Test different AI models (e.g., **TinyLlama**).  
- Evaluate context window sizes and model memory retention.  

---

## Usage  

### 1. Add Characters  
- Click the "Add Character" button.  
- Enter the character’s name, description, and personality.  

### 2. Edit/Delete Characters  
- Edit: Click the **pencil icon**.  
- Delete: Click the **trash icon**.  

### 3. Customize Story Parameters  
- Select a genre and tone for the story.  

### 4. Generate a Story  
- Click the **"Generate Story"** button.  
- Wait for the AI model to generate the story with your custom characters.  

### 5. View Results  
- Review the generated story and summaries of the characters' roles.  

---

## Final Steps  

1. Test the application to ensure it works as expected.  
2. Experiment with different models in the Text Generation WebUI.  
3. Enjoy creating custom stories powered by AI!  

---

## Aim  

The primary aim of this project is to **build and test a local AI application** that combines character management and story generation while allowing experimentation with model outputs and parameters.  


