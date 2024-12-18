# Story Character Extractor App Using ts-playground  

## Overview  

This application extracts character details (names, descriptions, and personality traits) from uploaded `.txt` files and enables the creation of new AI-generated stories using those extracted characters. Built with **Next.js** and powered by **LlamaIndex** and **OpenAI**, the app features a RAG pipeline for text processing and character extraction.  

---

## Project Tasks  

- Build upon the **ts-playground** or create a new Next.js application from scratch.  
- Design a page with a file input field for `.txt` file uploads (e.g., books or stories).  
- Develop a button to extract characters (names, descriptions, and personalities) from the uploaded file.  
- Implement a **RAG pipeline** to extract and organize character information.  
- Display extracted character data in a user-friendly **table format** with an array of objects.  
- Optionally, modify `retrieveandquery.ts` to use **Structured Outputs** for easier response processing.  
- Integrate the project with a **story-telling app** to reuse extracted character descriptions and personalities for AI-generated stories.  

---

## How It Works  

<img width="1503" alt="Screenshot 2024-12-09 at 23 02 10" src="https://github.com/user-attachments/assets/b8c7086a-feed-433d-a333-9aeea9eccca6">

1. Users upload a `.txt` file containing story content.  
2. The backend processes the file to extract characters (name, description, personality).  
3. Results are displayed in a **text area** and organized into a table format.  
4. Users can use the extracted characters to generate new AI-powered stories.  

---

## Getting Started  

### 1. Clone the Repository  
```bash
git clone https://github.com/run-llama/ts-playground.git
cd ts-playground
```

### 2. Install Dependencies  
```bash
npm install
npm install ai @ai-sdk/openai
npm install openai
```

Run the following for package setup:  
```bash
pnpm install
pnpm run dev
```

### 3. Set Up OpenAI API Key  
Set your OpenAI key:  
```bash
export OPENAI_API_KEY="sk-..."
```

### 4. Update Libraries and Fix Vulnerabilities  
Update required libraries:  
```bash
npm update rimraf eslint glob
```
Fix vulnerabilities:  
```bash
npm audit fix --force
```

### 5. Replace the Following Files  
Update the project with these customized files:  
- `index.tsx`  
- `splitandembed.ts`  
- `retrieveandquery.ts`  
- `package.json`  

### 6. Run the Application  
```bash
npm run dev
```

### 7. Test the App  
1. Open `http://localhost:3000` in your browser.  
2. Click the **Browse** button and upload your `.txt` file.  
3. Click **Get Character Information** to process the file.  
4. View the results in the table format.  
5. Click **Reset** to start over.  

---

## Features  

1. **Text Document Processing**  
   Upload and process `.txt` files to analyze content.  

2. **Character Extraction**  
   Automatically detects and extracts:  
   - **Character names**  
   - **Physical descriptions**  
   - **Personality traits**  

3. **Story Generation**  
   Leverages extracted characters to generate new, AI-powered stories.  

4. **Vector Indexing**  
   Efficiently processes large documents using text chunking and embedding.  

5. **Interactive UI**  
   - User-friendly file upload interface.  
   - Displays results in a **responsive table** with real-time feedback.  

---

This project combines AI capabilities with an intuitive user experience to automate character extraction and story generation for text-based documents.  
