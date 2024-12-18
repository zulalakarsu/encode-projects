interface PackingListResult {
  detectedItems: string[];
  missingItems: string[];
  feedback: string;
  detectedObjects: Array<{
    label: string;
    score: number;
  }>;
}

async function identifyPackedItems(
  imageData: string,
  packingList: string[]
): Promise<PackingListResult> {
  try {
    console.log('Sending request with packing list length:', packingList.length);

    const requestBody = {
      image: imageData,
      packingList: packingList
    };

    const response = await fetch('http://localhost:8000/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseClone = response.clone();
    
    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      const textResponse = await responseClone.text();
      console.error('Error parsing JSON response:', error);
      throw new Error(`Invalid response: ${textResponse}`);
    }

    if (!response.ok) {
      console.error('Backend error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData
      });
      throw new Error(`Failed to analyze image: ${JSON.stringify(responseData)}`);
    }

    if (!responseData.success) {
      throw new Error(responseData.detail || 'Detection failed');
    }

    return {
      detectedItems: responseData.matched_items,
      missingItems: responseData.missing_items,
      feedback: generateFeedback(
        responseData.detected_items, 
        responseData.matched_items, 
        responseData.missing_items
      ),
      detectedObjects: responseData.detected_items.map((item: string) => {
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