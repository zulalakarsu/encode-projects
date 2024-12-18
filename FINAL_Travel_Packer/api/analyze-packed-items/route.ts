import { NextResponse } from 'next/server';
import identifyPackedItems from '@/app/utils/identifyPackedItems';

export async function POST(request: Request) {
  try {
    console.log('Received request to analyze packed items');
    
    // Ensure the request can be parsed as JSON
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const data = await request.json();
    console.log('Request data:', {
      hasImage: !!data.image,
      imageLength: data.image?.length,
      packingListLength: data.packingList?.length,
    });

    if (!data.image || !data.packingList) {
      console.error('Missing required fields:', {
        hasImage: !!data.image,
        hasPackingList: !!data.packingList
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(data.packingList)) {
      console.error('Invalid packing list format:', typeof data.packingList);
      return NextResponse.json(
        { error: 'Packing list must be an array' },
        { status: 400 }
      );
    }

    try {
      const result = await identifyPackedItems(data.image, data.packingList);
      console.log('Analysis result:', {
        detectedCount: result.detectedItems.length,
        missingCount: result.missingItems.length,
      });

      return NextResponse.json(result);
    } catch (error) {
      console.error('Error processing image:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid image data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in analyze-packed-items route:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to analyze packed items' },
      { status: 500 }
    );
  }
} 