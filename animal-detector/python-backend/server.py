from fastapi import FastAPI, UploadFile, File
from detect import detect_animals
import uvicorn

app = FastAPI()

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    labels = ["cat", "dog", "bird", "horse", "cow", "sheep", "elephant", "zebra", 
              "giraffe", "lion", "tiger", "bear", "monkey", "deer", "rabbit"]
    
    result = detect_animals(contents, labels)
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 