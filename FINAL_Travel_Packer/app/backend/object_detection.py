from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageDraw, ImageFont
from transformers import pipeline
import io
import base64
import json
import logging
from typing import List, Dict

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the object detection model
detector = pipeline(
    model="google/owlv2-base-patch16-ensemble",
    task="zero-shot-object-detection"
)

@app.get("/")
async def root():
    """Root endpoint to check API status"""
    return {
        "status": "ok",
        "message": "Object Detection API is running",
        "endpoints": {
            "/": "This help message",
            "/detect": "POST endpoint for object detection"
        }
    }

@app.post("/detect")
async def detect_objects(request: Request):
    try:
        # Parse request body
        try:
            data = await request.json()
            logger.info("Received request data")
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")

        # Validate required fields
        if 'image' not in data or 'packingList' not in data:
            missing_fields = []
            if 'image' not in data: missing_fields.append('image')
            if 'packingList' not in data: missing_fields.append('packingList')
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )

        base64_image = data['image']
        label_list = data['packingList']
        
        logger.info(f"Processing labels: {label_list}")

        # Validate and convert base64 to image
        try:
            image_data = base64_image.split(',')[1]
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            logger.error(f"Image processing error: {e}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image data: {str(e)}"
            )
        
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        
        logger.info(f"Image loaded. Size: {image.size}")

        # Run detection
        try:
            predictions = detector(
                image,
                candidate_labels=label_list,
            )
            logger.debug(f"Raw predictions: {predictions}")
        except Exception as e:
            logger.error(f"Detection error: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Object detection failed: {str(e)}"
            )

        # Process results
        detected_items = []
        matched_items = set()
        
        # Create annotated image
        draw_image = image.copy()
        draw = ImageDraw.Draw(draw_image)
        
        try:
            font = ImageFont.truetype("arial.ttf", 16)
        except:
            font = ImageFont.load_default()

        # Process each prediction
        for prediction in predictions:
            if prediction["score"] >= 0.3:  # Confidence threshold
                box = prediction["box"]
                label = prediction["label"]
                score = prediction["score"]
                
                # Draw bounding box
                xmin, ymin, xmax, ymax = box.values()
                draw.rectangle(
                    ((xmin, ymin), (xmax, ymax)),
                    outline="red",
                    width=2
                )
                
                # Draw label
                label_text = f"{label}: {score:.2f}"
                text_bbox = draw.textbbox((xmin, ymin-20), label_text, font=font)
                draw.rectangle(text_bbox, fill="white")
                draw.text(
                    (xmin, ymin-20),
                    label_text,
                    fill="red",
                    font=font
                )

                # Store detection
                detected_items.append(f"{label} ({score:.2f})")
                
                # Check for matches with provided labels
                label_lower = label.lower()
                for target_label in label_list:
                    if (label_lower in target_label.lower() or 
                        target_label.lower() in label_lower):
                        matched_items.add(target_label)

        # Convert annotated image to base64
        buffered = io.BytesIO()
        draw_image.save(buffered, format="JPEG")
        encoded_image = base64.b64encode(buffered.getvalue()).decode()

        # Find missing items
        missing_items = [item for item in label_list if item not in matched_items]

        return {
            "success": True,
            "detected_items": detected_items,
            "matched_items": list(matched_items),
            "missing_items": missing_items,
            "annotated_image": encoded_image
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Server error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)