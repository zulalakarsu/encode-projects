interface WeatherData {
  temperature: number;
  conditions: string;
  forecast: Array<{
    date: string;
    temperature: number;
    conditions: string;
  }>;
}

export default async function generatePackingList(weatherData: WeatherData, activities: string[]) {
  // Calculate trip duration from forecast
  const duration = weatherData.forecast.length;

  // Analyze weather patterns
  const temperatures = weatherData.forecast.map(day => day.temperature);
  const conditions = weatherData.forecast.map(day => day.conditions.toLowerCase());
  
  const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const hasRain = conditions.some(c => c.includes('rain') || c.includes('shower'));
  const hasSnow = conditions.some(c => c.includes('snow'));
  const hasSun = conditions.some(c => c.includes('sunny') || c.includes('clear'));

  const prompt = `Generate a comprehensive packing list for a ${duration}-day trip with the following details:

Weather Analysis:
- Average temperature: ${avgTemp.toFixed(1)}°C
- Temperature range: ${minTemp}°C to ${maxTemp}°C
- Weather conditions: ${conditions.join(', ')}
${hasRain ? '- Expect rainfall' : ''}
${hasSnow ? '- Expect snow' : ''}
${hasSun ? '- Expect sunny periods' : ''}

Daily Forecast:
${weatherData.forecast.map(day => 
  `${day.date}: ${day.temperature}°C, ${day.conditions}`
).join('\n')}

Activities: ${activities.join(', ')}

Generate a detailed packing list as a JSON array of objects. Each item should have:
1. "item": The name of the item
2. "category": One of [Clothing, Toiletries, Electronics, Documents, Miscellaneous]
3. "essential": boolean indicating if it's a must-have item
4. "quantity": number of units needed based on trip duration
5. "reason": brief explanation of why this item is recommended

Consider:
- Weather-appropriate clothing
- Activity-specific gear
- Basic travel essentials
- Personal care items
- Electronics and chargers
- Travel documents
- Emergency items

Format the response as a JSON object with an "items" array.`;

  const response = await fetch('/api/generate-packing-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, weatherData, activities }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate packing list');
  }

  return response.json();
} 