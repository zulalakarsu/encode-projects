# **Animal Classification API**

This project provides a **full-stack application** for classifying animals in images using machine learning. The frontend is built with **Next.js** and **React**, while the backend includes a Python server for image detection and API endpoints written in **TypeScript**. 

---

## **Table of Contents**
1. [Setup Instructions](#setup-instructions)  
2. [Project Structure](#project-structure)  
3. [Run the Project](#run-the-project)  
4. [API Endpoints](#api-endpoints)  
5. [Testing the Application](#testing-the-application)  

---

## **Setup Instructions**

Follow these steps to set up and run the project:

### **1. Initialize the Project**
Run the following commands to clone and set up the project:

```bash
git clone https://github.com/zulalakarsu/encode-projects.git
cd encode-projects/05-animal-detector
npm install
```

### **2. Install Python Dependencies**
Navigate to the `python-backend` folder and install Python libraries:

```bash
cd python-backend
pip install -r requirements.txt
```

---

## **Project Structure**

The project is organized into a clear separation of concerns:

```bash
05-animal-detector/
├── api/                      # API Routes
│   ├── classify/
│   │   └── route.ts          # Main API route for animal classification
│   └── agent.ts              # Logic for interacting with ML models
│
├── components/ui/            # Reusable UI Components
│   ├── button.tsx            # Button component
│   ├── card.tsx              # Card component
│   └── input.tsx             # Input field for image uploads
│
├── python-backend/           # Python server for image detection
│   ├── detect.py             # Performs animal detection
│   ├── server.py             # Python FastAPI server
│   └── requirements.txt      # Python dependencies
│
├── components.json           # Component metadata
├── layout.tsx                # Main layout for the application
├── page.tsx                  # Home page for uploading images
└── README.md                 # Documentation
```

---

## **Run the Project**

To run both the **frontend** and the **backend**, follow these steps:

### **1. Start the Python Backend**
Navigate to the `python-backend` folder and run:

```bash
cd python-backend
uvicorn server:app --reload
```

The backend server will run at `http://localhost:8000`.

### **2. Start the Next.js Frontend**
In the root folder, start the Next.js server:

```bash
npm run dev
```

The frontend will run at `http://localhost:3000`.

---

## **API Endpoints**

1. **`POST /api/classify`**  
   - Accepts an image and sends it for classification.  
   - Returns the animal name detected.

2. **Python Server Endpoint**:  
   - **`POST /detect`**  
     Processes the image and detects the animal.  

---

## **Testing the Application**

1. Visit **`http://localhost:3000`** in your browser.  
2. Use the input field to **upload an image** (e.g., an animal image).  
3. The app will:
   - Send the image to the backend for detection.  
   - Return the animal classification result.  

---

## **Future Improvements**
- Improve classification accuracy with Hugging Face CLIP or similar models.  
- Expand detection capabilities for more animal species.  
- Add error handling for unsupported file types.  


