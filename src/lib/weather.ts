// Weather and sun times utility functions

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface SunTimes {
  sunrise: string;
  sunset: string;
}

// Mock weather data for demonstration (in production, this would call a real weather API)
export function getWeatherData(city: string): WeatherData {
  const mockWeatherData: Record<string, WeatherData> = {
    'New York': {
      temperature: 22,
      condition: 'Partly Cloudy',
      icon: '⛅',
      humidity: 65,
      windSpeed: 12
    },
    'London': {
      temperature: 18,
      condition: 'Rainy',
      icon: '🌧️',
      humidity: 80,
      windSpeed: 15
    },
    'Tokyo': {
      temperature: 26,
      condition: 'Clear',
      icon: '☀️',
      humidity: 55,
      windSpeed: 8
    },
    'New Delhi': {
      temperature: 35,
      condition: 'Hot',
      icon: '🌞',
      humidity: 40,
      windSpeed: 10
    },
    'Los Angeles': {
      temperature: 24,
      condition: 'Sunny',
      icon: '☀️',
      humidity: 50,
      windSpeed: 6
    },
    'Paris': {
      temperature: 20,
      condition: 'Cloudy',
      icon: '☁️',
      humidity: 70,
      windSpeed: 11
    }
  };

  return mockWeatherData[city] || {
    temperature: 20,
    condition: 'Unknown',
    icon: '🌡️',
    humidity: 60,
    windSpeed: 10
  };
}

// Calculate approximate sunrise and sunset times based on date and timezone
export function getSunTimes(date: Date, timezone: string): SunTimes {
  // This is a simplified calculation - in production, you'd use a proper astronomy API
  const hour = date.getHours();
  const month = date.getMonth() + 1; // 1-12
  
  // Base sunrise/sunset times (would vary by latitude and season in real implementation)
  let sunriseHour = 6;
  let sunsetHour = 18;
  
  // Seasonal adjustments (simplified)
  if (month >= 3 && month <= 5) { // Spring
    sunriseHour = 5;
    sunsetHour = 19;
  } else if (month >= 6 && month <= 8) { // Summer
    sunriseHour = 4;
    sunsetHour = 20;
  } else if (month >= 9 && month <= 11) { // Fall
    sunriseHour = 6;
    sunsetHour = 18;
  } else { // Winter
    sunriseHour = 7;
    sunsetHour = 17;
  }
  
  // Format times in the target timezone
  const sunriseDate = new Date(date);
  sunriseDate.setHours(sunriseHour, 0, 0, 0);
  
  const sunsetDate = new Date(date);
  sunsetDate.setHours(sunsetHour, 0, 0, 0);
  
  return {
    sunrise: formatTimeInTimezone(sunriseDate, timezone, false),
    sunset: formatTimeInTimezone(sunsetDate, timezone, false)
  };
}

// Helper function to format time in timezone (reused from timezone.ts)
function formatTimeInTimezone(date: Date, timezone: string, format24h: boolean = false): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: !format24h
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    return 'Invalid Timezone';
  }
}