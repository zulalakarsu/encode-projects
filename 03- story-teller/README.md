# Story-Teller App: Building Our First Local AI Application  

## Overview  

This project aims to **build a local AI-powered story generation application** using Next.js. It allows users to create and manage custom characters and generate stories where these characters play a central role. Additionally, the project explores AI model performance in terms of memory retention, context window impact, and output quality.  

---

## Features  

1. **Character Management**  
   - Users can create, edit, and delete characters.  
   - Each character includes:  
     - **Name**  
     - **Description**  
     - **Personality**  

2. **Custom Story Generation**  
   - Generates engaging stories incorporating user-created characters.  
   - Prompts are customized to ensure characters' traits are part of the story.

3. **Character Role Summary**  
   - Summarizes each character's role and contribution to the generated story.  

4. **Model Experimentation**  
   - Compare outputs from different models.  
   - Evaluate:  
     - Memory retention of user-defined characters.  
     - Impact of context window sizes.  
     - Performance of varying model sizes (e.g., TinyLlama for small devices).  

5. **Local AI Application**  
   - The app is designed to run locally, showcasing the process of **Building Our First Local AI Application**.

---

## Setup Instructions  

### 1. Clone the Repository  
```bash
git clone https://github.com/zulalakarsu/encode-projects.git
cd encode-projects/03- story-teller
```

### 2. Update Base URL for Local API  
Edit the `route.ts` file to point to your local API port:  
```javascript
export const BASE_URL = "http://localhost:<your-port-number>";
```

### 3. Run Local API  
Ensure your API backend is running on the configured port.  

### 4. Install Dependencies  
```bash
npm install
npm install ai @ai-sdk/openai
```

### 5. Start the Project Locally  
```bash
npm run dev
```

Access the app at:  
```bash
http://localhost:3000
```

---

## How It Works  

1. **Create Characters**:  
   Use the table interface to add characters with names, descriptions, and personalities.  

2. **Generate Stories**:  
   Click **"Generate Story"** to create a story that integrates your custom characters.  

3. **Character Role Summary**:  
   After the story is generated, view each character's role in the story.  

4. **Experiment with Models**:  
   - Test various AI models for story generation.  
   - Adjust **context window sizes** to observe changes in model output and memory.  
   - Compare outputs between small and large models (e.g., **TinyLlama_TinyLlama-1.1B-Chat-v1.0**).  

---

## Key Experimentation Areas  

1. **AI Model Testing**:  
   Evaluate performance of multiple models to:  
   - Compare story generation quality.  
   - Analyze memory retention of user-defined characters.  

2. **Context Window Impact**:  
   Experiment with different context window sizes to observe how input length affects generated output.  

3. **Model Size Comparison**:  
   Test smaller models like **TinyLlama** for resource-constrained environments and compare them to larger models.  

4. **Local Deployment**:  
   Successfully run and test an AI-powered app locally, focusing on experimentation over overall story quality.  

---

## Aim  

The primary aim of this project is to **build and test a local AI application** that combines character management and story generation while allowing experimentation with model outputs and parameters.  


---
