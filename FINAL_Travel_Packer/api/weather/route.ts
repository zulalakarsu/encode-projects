import { NextResponse } from 'next/server';
import axios from 'axios';

interface WeatherDateRange {
  startDate: string;
  endDate: string;
}

function isValidDateFormat(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateStr);
}

function isValidDestination(destination: string): boolean {
  // Basic validation: non-empty string with only letters, spaces, and commas
  const regex = /^[a-zA-Z\s,]+$/;
  return regex.test(destination) && destination.length > 0;
}

function formatDate(date: string): string {
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch (error) {
    throw new Error(`Invalid date format: ${date}`);
  }
}

function validateDates(dates: WeatherDateRange) {
  if (!dates.startDate || !dates.endDate) {
    throw new Error('Start date and end date are required');
  }

  if (!isValidDateFormat(dates.startDate) || !isValidDateFormat(dates.endDate)) {
    throw new Error('Dates must be in YYYY-MM-DD format');
  }

  const start = new Date(dates.startDate);
  const end = new Date(dates.endDate);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14); // WeatherAPI supports up to 14 days forecast

  if (start > end) {
    throw new Error('Start date must be before end date');
  }

  if (end > maxDate) {
    throw new Error('Forecast is only available for the next 14 days');
  }
}

export async function POST(request: Request) {
  try {
    const { destination, dates } = await request.json();

    // Validate input parameters
    if (!destination) {
      return NextResponse.json(
        { error: 'Destination is required' },
        { status: 400 }
      );
    }

    if (!isValidDestination(destination)) {
      return NextResponse.json(
        { error: 'Invalid destination format' },
        { status: 400 }
      );
    }

    try {
      validateDates(dates);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid dates' },
        { status: 400 }
      );
    }

    const API_KEY = process.env.WEATHER_API_KEY;
    if (!API_KEY) {
      throw new Error('Weather API key is not configured');
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(destination)}&days=14&aqi=no`;
    
    const response = await axios.get(url);
    const data = response.data;

    // Convert dates to consistent format for comparison
    const start = formatDate(dates.startDate);
    const end = formatDate(dates.endDate);

    // Calculate number of days needed (inclusive of both start and end dates)
    const startDate = new Date(start);
    const endDate = new Date(end);
    const daysNeeded = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Ensure we have enough days in the forecast
    if (!data.forecast?.forecastday || data.forecast.forecastday.length < daysNeeded) {
      throw new Error(`Unable to get forecast for the full date range. Requested: ${daysNeeded} days`);
    }

    // Filter and map forecast data with inclusive end date
    const relevantForecast = data.forecast.forecastday
      .filter((day: any) => {
        const forecastDate = day.date;
        // Use <= to include the end date
        return forecastDate >= start && forecastDate <= end;
      })
      .map((day: any) => ({
        date: day.date,
        temperature: day.day.avgtemp_c ?? null,
        conditions: day.day.condition?.text ?? 'Unknown conditions'
      }));

    // Verify we have all requested days
    if (relevantForecast.length !== daysNeeded) {
      console.warn(`Expected ${daysNeeded} days but got ${relevantForecast.length} days in forecast`);
    }

    // Log for debugging
    console.log('Date range:', { 
      start, 
      end, 
      daysNeeded, 
      receivedDays: relevantForecast.length,
      forecastDates: relevantForecast.map((f: { date: string }) => f.date)
    });

    return NextResponse.json({
      temperature: data.current?.temp_c ?? null,
      conditions: data.current?.condition?.text ?? 'Unknown conditions',
      forecast: relevantForecast
    });
  } catch (error) {
    console.error('Weather API error:', error);

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500;
      const errorMessage = error.response?.data?.error?.message 
        ?? error.message 
        ?? 'Failed to fetch weather data';

      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 