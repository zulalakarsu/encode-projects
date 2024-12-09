# Animal Classification API

This project provides an API for classifying animals in images using machine learning models. The API is built with TypeScript and Express, allowing users to send images and receive classification results.

1. Setup the project

npx create-next-app animal-detector
cd animal-detector

2. Install dependencies

npm install ai @ai-sdk/openai openai llamaindex
npm install axios

3. Follow the project structure 

## Project Structure
my-project/
├── classify/
│ └── route.ts # Main API route for animal classification
├── agent.ts # Handles interactions with the machine learning models
├── detect.py # Python script for animal detection
├── page.tsx # React component for the frontend interface
├── package.json # Project metadata and dependencies
└── node_modules/ # Installed dependencies

4. Run 

npm run dev

5. Go to your browser

http://localhost:3000/

6. Upload an image and test
