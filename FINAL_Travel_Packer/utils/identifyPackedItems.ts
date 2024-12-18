interface PackingListResult {
  detectedItems: string[];
  missingItems: string[];
  feedback: string;
  detectedObjects: Array<{
    label: string;
    score: number;
  }>;
}

interface DetectionResult {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

async function identifyPackedItems(
  imageData: string,
  packingList: string[]
): Promise<PackingListResult> {
  try {
    console.log('Sending request with packing list length:', packingList.length);

    // Create request body
    const requestBody = {
      image: imageData,
      packingList: packingList
    };

    // Make request to Python backend
    const response = await fetch('http://localhost:8000/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    let errorText;
    try {
      const responseData = await response.json();
      errorText = JSON.stringify(responseData);
    } catch (e) {
      errorText = await response.text();
    }

    if (!response.ok) {
      console.error('Backend error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to analyze image: ${errorText}`);
    }

    const result = JSON.parse(errorText);
    console.log('Backend response:', result);

    if (!result.success) {
      throw new Error(result.detail || 'Detection failed');
    }

    return {
      detectedItems: result.matched_items,
      missingItems: result.missing_items,
      feedback: generateFeedback(result.detected_items, result.matched_items, result.missing_items),
      detectedObjects: result.detected_items.map((item: string) => {
        const [label, scoreStr] = item.split(' (');
        return {
          label,
          score: parseFloat(scoreStr.replace(')', ''))
        };
      })
    };
  } catch (error) {
    console.error('Error in item detection:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze packed items: ${error.message}`);
    }
    throw new Error('Failed to analyze packed items');
  }
}

function generateFeedback(
  allDetected: string[],
  matchedItems: string[],
  missingItems: string[]
): string {
  let feedback = '';

  if (allDetected.length === 0) {
    feedback = 'No objects were detected in the image. Please ensure items are clearly visible and try again.';
  } else if (matchedItems.length === 0) {
    feedback = `Objects detected:\n${allDetected.join('\n')}\n\n` +
               'None of the detected objects matched your packing list.';
  } else {
    feedback += `Objects detected in the image:\n${allDetected.join('\n')}\n\n`;
    feedback += `Matched items from your packing list:\n${
      matchedItems.length > 0 ? matchedItems.join('\n') : 'No items matched.'
    }\n\n`;
    feedback += `Missing items:\n${missingItems.length > 0 ? missingItems.join('\n') : 'None!'}`;
  }

  return feedback;
}

export default identifyPackedItems;