import axios from "axios";

interface WeatherData {
  temperature: number;
  conditions: string;
  forecast: Array<{
    date: string;
    temperature: number;
    conditions: string;
  }>;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export default async function fetchWeather(destination: string, dates: DateRange): Promise<WeatherData> {
  try {
    const response = await axios.post('/api/weather', {
      destination,
      dates
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch weather data');
    }
    throw error;
  }
} 