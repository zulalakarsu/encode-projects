import sys
from transformers import pipeline
from PIL import Image, ImageDraw
import json
from io import BytesIO
import base64

def detect_animals(image_bytes, labels):
    # Initialize both detectors
    owlv2_checkpoint = "google/owlv2-base-patch16-ensemble"
    clip_checkpoint = "openai/clip-vit-large-patch14"
    
    object_detector = pipeline(model=owlv2_checkpoint, task="zero-shot-object-detection")
    classifier = pipeline(model=clip_checkpoint, task="zero-shot-image-classification")
    
    # Convert bytes to PIL Image
    image = Image.open(BytesIO(image_bytes))
    
    # Get object detection predictions
    det_predictions = object_detector(
        image,
        candidate_labels=labels,
    )
    
    # Get classification predictions
    class_predictions = classifier(
        image,
        candidate_labels=labels,
    )
    
    # Draw boxes from object detection
    draw = ImageDraw.Draw(image)
    for prediction in det_predictions:
        box = prediction["box"]
        label = prediction["label"]
        score = prediction["score"]

        xmin, ymin, xmax, ymax = box.values()
        draw.rectangle((xmin, ymin, xmax, ymax), outline="red", width=1)
        draw.text((xmin, ymin), f"{label}: {round(score,2)}", fill="black")
    
    # Convert the annotated image to base64
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    # Format classification results
    formatted_classifications = []
    for i, pred in enumerate(class_predictions, 1):
        formatted_classifications.append({
            "label": pred["label"],
            "score": pred["score"],
            "rank": i
        })
    
    return {
        "object_detections": det_predictions,
        "classifications": formatted_classifications,
        "annotated_image": img_str
    }

if __name__ == "__main__":
    # This allows for command line testing
    filename = sys.argv[1]
    with open(filename, 'rb') as f:
        image_bytes = f.read()
    
    labels = ["cat", "dog", "bird", "horse", "cow", "sheep", "elephant", "zebra", 
              "giraffe", "lion", "tiger", "bear", "monkey", "deer", "rabbit"]
    
    result = detect_animals(image_bytes, labels)
    print(json.dumps(result)) 