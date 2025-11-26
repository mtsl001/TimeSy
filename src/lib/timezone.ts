import { format, addHours, differenceInHours, isValid } from 'date-fns';

export interface TimezoneInfo {
  id: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  offset: string;
  isDST: boolean;
}

export interface TimezoneCard {
  id: string;
  timezone: string;
  city: string;
  country: string;
  name: string;
  isActive: boolean;
  isBase: boolean;
}

// Predefined timezone data for major cities
export const DEFAULT_TIMEZONES: TimezoneCard[] = [
  {
    id: '1',
    timezone: 'America/New_York',
    city: 'New York',
    country: 'USA',
    name: 'New York',
    isActive: true,
    isBase: true
  },
  {
    id: '2',
    timezone: 'Europe/London',
    city: 'London',
    country: 'UK',
    name: 'London',
    isActive: true,
    isBase: false
  },
  {
    id: '3',
    timezone: 'Asia/Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    name: 'Tokyo',
    isActive: true,
    isBase: false
  },
  {
    id: '4',
    timezone: 'Asia/Kolkata',
    city: 'New Delhi',
    country: 'India',
    name: 'India',
    isActive: true,
    isBase: false
  },
  {
    id: '5',
    timezone: 'America/Los_Angeles',
    city: 'Los Angeles',
    country: 'USA',
    name: 'Los Angeles',
    isActive: false,
    isBase: false
  },
  {
    id: '6',
    timezone: 'Europe/Paris',
    city: 'Paris',
    country: 'France',
    name: 'Paris',
    isActive: false,
    isBase: false
  }
];

// Extended timezone database with 20,000+ cities (simplified version)
export const TIMEZONE_DATABASE = [
  // North America
  { timezone: 'America/New_York', city: 'New York', country: 'USA' },
  { timezone: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA' },
  { timezone: 'America/Chicago', city: 'Chicago', country: 'USA' },
  { timezone: 'America/Denver', city: 'Denver', country: 'USA' },
  { timezone: 'America/Phoenix', city: 'Phoenix', country: 'USA' },
  { timezone: 'America/Toronto', city: 'Toronto', country: 'Canada' },
  { timezone: 'America/Vancouver', city: 'Vancouver', country: 'Canada' },
  { timezone: 'America/Mexico_City', city: 'Mexico City', country: 'Mexico' },
  
  // Europe
  { timezone: 'Europe/London', city: 'London', country: 'UK' },
  { timezone: 'Europe/Paris', city: 'Paris', country: 'France' },
  { timezone: 'Europe/Berlin', city: 'Berlin', country: 'Germany' },
  { timezone: 'Europe/Rome', city: 'Rome', country: 'Italy' },
  { timezone: 'Europe/Madrid', city: 'Madrid', country: 'Spain' },
  { timezone: 'Europe/Amsterdam', city: 'Amsterdam', country: 'Netherlands' },
  { timezone: 'Europe/Stockholm', city: 'Stockholm', country: 'Sweden' },
  { timezone: 'Europe/Moscow', city: 'Moscow', country: 'Russia' },
  
  // Asia
  { timezone: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan' },
  { timezone: 'Asia/Shanghai', city: 'Shanghai', country: 'China' },
  { timezone: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'China' },
  { timezone: 'Asia/Singapore', city: 'Singapore', country: 'Singapore' },
  { timezone: 'Asia/Kolkata', city: 'New Delhi', country: 'India' },
  { timezone: 'Asia/Dubai', city: 'Dubai', country: 'UAE' },
  { timezone: 'Asia/Seoul', city: 'Seoul', country: 'South Korea' },
  { timezone: 'Asia/Bangkok', city: 'Bangkok', country: 'Thailand' },
  
  // Oceania
  { timezone: 'Australia/Sydney', city: 'Sydney', country: 'Australia' },
  { timezone: 'Australia/Melbourne', city: 'Melbourne', country: 'Australia' },
  { timezone: 'Pacific/Auckland', city: 'Auckland', country: 'New Zealand' },
  
  // South America
  { timezone: 'America/Sao_Paulo', city: 'São Paulo', country: 'Brazil' },
  { timezone: 'America/Buenos_Aires', city: 'Buenos Aires', country: 'Argentina' },
  { timezone: 'America/Lima', city: 'Lima', country: 'Peru' },
  
  // Africa
  { timezone: 'Africa/Cairo', city: 'Cairo', country: 'Egypt' },
  { timezone: 'Africa/Lagos', city: 'Lagos', country: 'Nigeria' },
  { timezone: 'Africa/Johannesburg', city: 'Johannesburg', country: 'South Africa' },
];

export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatTimeInTimezone(date: Date, timezone: string, format24h: boolean = false): string {
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

export function formatDateInTimezone(date: Date, timezone: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    return 'Invalid Date';
  }
}

export function getTimezoneOffset(date: Date, timezone: string): number {
  try {
    const targetDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    return (targetDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  } catch (error) {
    return 0;
  }
}

export function getTimezoneOffsetString(date: Date, timezone: string, baseTimezone: string): string {
  const targetOffset = getTimezoneOffset(date, timezone);
  const baseOffset = getTimezoneOffset(date, baseTimezone);
  const diff = targetOffset - baseOffset;
  
  if (diff === 0) return 'Same time';
  
  const sign = diff > 0 ? '+' : '';
  const hours = Math.abs(diff);
  const minutes = (hours % 1) * 60;
  
  if (minutes === 0) {
    return `${sign}${hours}h`;
  } else {
    return `${sign}${Math.floor(hours)}h ${minutes}m`;
  }
}

export function isBusinessHours(date: Date, timezone: string): boolean {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: '2-digit',
      hour12: false
    };
    const hour = parseInt(new Intl.DateTimeFormat('en-US', options).format(date));
    return hour >= 9 && hour < 17;
  } catch (error) {
    return false;
  }
}

export function getBusinessHoursOverlap(timezones: string[], date: Date): number {
  const activeCount = timezones.filter(tz => isBusinessHours(date, tz)).length;
  return activeCount;
}

export function findBestMeetingTime(timezones: string[], date: Date): { start: number; end: number; overlap: number }[] {
  const bestTimes: { start: number; end: number; overlap: number }[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const testDate = new Date(date);
    testDate.setHours(hour, 0, 0, 0);
    
    const overlap = getBusinessHoursOverlap(timezones, testDate);
    
    if (overlap >= 2) { // At least 2 timezones in business hours
      bestTimes.push({
        start: hour,
        end: hour + 1,
        overlap
      });
    }
  }
  
  // Find consecutive hours and group them
  const groupedTimes: { start: number; end: number; overlap: number }[] = [];
  let currentGroup = bestTimes[0];
  
  for (let i = 1; i < bestTimes.length; i++) {
    if (bestTimes[i].start === currentGroup.end) {
      currentGroup.end = bestTimes[i].end;
      currentGroup.overlap = Math.min(currentGroup.overlap, bestTimes[i].overlap);
    } else {
      groupedTimes.push(currentGroup);
      currentGroup = bestTimes[i];
    }
  }
  
  if (currentGroup) {
    groupedTimes.push(currentGroup);
  }
  
  // Sort by overlap (highest first) and duration (longest first)
  return groupedTimes.sort((a, b) => {
    const overlapDiff = b.overlap - a.overlap;
    if (overlapDiff !== 0) return overlapDiff;
    return (b.end - b.start) - (a.end - a.start);
  }).slice(0, 3); // Return top 3 best times
}

export function encodeTimezonesToURL(timezones: TimezoneCard[], selectedTime?: Date): string {
  const data = {
    timezones: timezones.map(tz => ({
      tz: tz.timezone,
      city: tz.city,
      country: tz.country,
      name: tz.name,
      active: tz.isActive,
      base: tz.isBase
    })),
    selectedTime: selectedTime?.toISOString()
  };
  
  return btoa(JSON.stringify(data));
}

export function decodeTimezonesFromURL(encoded: string): { timezones: TimezoneCard[]; selectedTime?: Date } {
  try {
    const data = JSON.parse(atob(encoded));
    return {
      timezones: data.timezones.map((tz: any, index: number) => ({
        id: String(index + 1),
        timezone: tz.tz,
        city: tz.city,
        country: tz.country,
        name: tz.name,
        isActive: tz.active,
        isBase: tz.base
      })),
      selectedTime: data.selectedTime ? new Date(data.selectedTime) : undefined
    };
  } catch (error) {
    return { timezones: DEFAULT_TIMEZONES };
  }
}