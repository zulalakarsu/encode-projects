// Import required Next.js server components
import { NextRequest, NextResponse } from 'next/server'
import { fetchAnimalInfo } from '../agent'

export async function POST(req: NextRequest) {
  // Extract the image file from the incoming form data
  const formData = await req.formData()
  const image = formData.get('image') as File

  // Validate that an image was provided
  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  try {
    // Prepare the image data to send to the Python backend
    const pythonFormData = new FormData()
    pythonFormData.append('file', image)
    
    // Send the image to the Python backend for object detection
    const detectionResponse = await fetch('http://localhost:8000/detect', {
      method: 'POST',
      body: pythonFormData,
    })
    
    // Parse the detection results
    const detectionData = await detectionResponse.json()
    
    // If no animals were detected, return a default response
    if (!detectionData.predictions.length) {
      return NextResponse.json({
        animal: "Unknown",
        description: "No animal detected in the image",
        isDangerous: false,
      })
    }

    // Get the highest confidence prediction
    const topPrediction = detectionData.predictions[0]
    // Fetch additional information about the detected animal
    const animalInfo = await fetchAnimalInfo(topPrediction.label)

    // Return the complete response with all animal information
    return NextResponse.json({
      animal: topPrediction.label,           // Name of the detected animal
      description: animalInfo.description,    // Description of the animal
      isDangerous: animalInfo.dangerous,      // Whether the animal is dangerous
      confidence: topPrediction.score,        // Detection confidence score
      annotatedImage: detectionData.annotated_image,  // Image with detection boxes
      relatedAnimals: animalInfo.relatedAnimals      // List of similar animals
    })
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'An error occurred during classification' },
      { status: 500 }
    )
  }
}

