"use client";

import Image from "next/image";
import { useState } from 'react';
import TripDetailsForm from './components/TripDetailsForm';
import PackingList from './components/PackingList';
import ImageUpload from './components/ImageUpload';
import fetchWeather from './utils/fetchWeather';
import generatePackingList from './utils/generatePackingList';
import identifyPackedItems from './utils/identifyPackedItems';

interface PackingItem {
  item: string;
  category: string;
  essential: boolean;
  quantity: number;
  reason: string;
}

interface WeatherData {
  temperature: number;
  conditions: string;
  forecast: Array<{
    date: string;
    temperature: number;
    conditions: string;
  }>;
}

export default function Home() {
  const [packingList, setPackingList] = useState<PackingItem[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingItems, setMissingItems] = useState<string[]>([]);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [detectedObjects, setDetectedObjects] = useState<Array<{
    label: string;
    score: number;
  }>>([]);

  const handleTripDetailsSubmit = async (tripDetails: {
    destination: string;
    dates: {
      startDate: string;
      endDate: string;
    };
    activities: string[];
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const weather = await fetchWeather(tripDetails.destination, tripDetails.dates);
      setWeatherData(weather);
      const generatedList = await generatePackingList(weather, tripDetails.activities);
      setPackingList(generatedList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (image: File) => {
    try {
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(image);
      });

      const result = await identifyPackedItems(
        base64Image,
        packingList.map(item => item.item)
      );

      // Update state with results
      setMissingItems(result.missingItems);
      setDetectedItems(result.detectedItems);
      setDetectedObjects(result.detectedObjects);
    } catch (error) {
      console.error('Error in image upload:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze image');
    }
  };

  const handleAnalysisComplete = (result: {
    detectedItems: string[];
    missingItems: string[];
    feedback: string;
  }) => {
    setMissingItems(result.missingItems);
    setDetectedItems(result.detectedItems);
    if (result.detectedItems.length === 0) {
      setError('No items were detected in the image. Please ensure items are clearly visible.');
    } else {
      setError(`Detected items: ${result.detectedItems.join(', ')}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Travel Packing Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Plan your trip, pack smart, travel confidently
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Trip Details
              </h2>
              <TripDetailsForm 
                onSubmit={handleTripDetailsSubmit} 
                isLoading={isLoading}
              />
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md">
                  {error}
                </div>
              )}
            </div>

            {weatherData && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Weather Forecast
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                    <h3 className="font-semibold mb-2">Current Weather</h3>
                    <p>{weatherData.temperature}°C - {weatherData.conditions}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Forecast</h3>
                    {weatherData.forecast.map((day) => (
                      <div 
                        key={day.date} 
                        className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between items-center"
                      >
                        <span className="font-medium">
                          {new Date(day.date).toLocaleDateString(undefined, {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'numeric'
                          })}
                        </span>
                        <span className="font-medium">
                          {day.temperature}°C - {day.conditions}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Upload and Check Your Items
              </h2>
              <ImageUpload 
                onUpload={handleImageUpload}
                packingList={packingList}
                detectedObjects={detectedObjects}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Your Packing List
            </h2>
            {packingList.length > 0 ? (
              <PackingList 
                items={packingList}
                missingItems={missingItems}
                detectedItems={detectedItems}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Submit your trip details to generate a packing list
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
