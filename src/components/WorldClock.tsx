'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Settings, Sun, Moon, Cloud, Wind, Droplets } from 'lucide-react';
import { TimezoneCard } from '@/lib/timezone';
import { formatTimeInTimezone, formatDateInTimezone, getTimezoneOffsetString, isBusinessHours, TIMEZONE_DATABASE } from '@/lib/timezone';
import { getWeatherData, getSunTimes } from '@/lib/weather';
import { TimezoneSelector } from './TimezoneSelector';
import { ClockDisplay } from './ClockDisplay';

interface WorldClockProps {
  timezones: TimezoneCard[];
  selectedTime?: Date;
  isLiveMode: boolean;
  showAnalog: boolean;
  onToggleAnalog: () => void;
  onTimezoneChange: (id: string, updates: Partial<TimezoneCard>) => void;
  onReorder: (newOrder: TimezoneCard[]) => void;
  onTimeSelect: (time: Date) => void;
}

function TimezoneCardComponent({ 
  timezone, 
  currentTime, 
  isLiveMode, 
  baseTimezone,
  showAnalog,
  onToggle,
  onChange,
  onEdit 
}: {
  timezone: TimezoneCard;
  currentTime: Date;
  isLiveMode: boolean;
  baseTimezone: TimezoneCard;
  showAnalog: boolean;
  onToggle: () => void;
  onChange: (updates: Partial<TimezoneCard>) => void;
  onEdit: () => void;
}) {
  const time = formatTimeInTimezone(currentTime, timezone.timezone);
  const date = formatDateInTimezone(currentTime, timezone.timezone);
  const offset = getTimezoneOffsetString(currentTime, timezone.timezone, baseTimezone.timezone);
  const isBusiness = isBusinessHours(currentTime, timezone.timezone);
  const isNight = !isBusiness && (parseInt(time.split(':')[0]) >= 18 || parseInt(time.split(':')[0]) < 6);
  const isBaseTimezone = timezone.id === baseTimezone.id;
  
  // Get weather and sun times
  const weather = getWeatherData(timezone.city);
  const sunTimes = getSunTimes(currentTime, timezone.timezone);

  return (
    <div className={`relative ${isBaseTimezone ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Card className={`p-2.5 h-48 w-44 flex flex-col transition-all hover:shadow-lg ${
        !timezone.isActive ? 'opacity-50' : ''
      } ${isNight ? 'bg-slate-800 text-white' : 'bg-white'}`}>
        
        {/* Header - Country and Controls */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <MapPin className="h-2.5 w-2.5 text-slate-500 flex-shrink-0" />
            <span className="text-xs text-slate-500 truncate">{timezone.country}</span>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <Switch
              checked={timezone.isActive}
              onCheckedChange={onToggle}
              size="sm"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-4 w-4 p-0"
            >
              <Settings className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>

        {/* City Name - Centered */}
        <div className="text-center mb-0.5">
          <h3 className="font-semibold text-sm truncate">{timezone.city}</h3>
        </div>

        {/* Clock Display - Centered */}
        <div className="flex-1 flex items-center justify-center py-0.5">
          <ClockDisplay
            time={time}
            date={date}
            isDigital={!showAnalog}
            size="xs"
            isLiveMode={isLiveMode}
            timezone={timezone.timezone}
          />
        </div>

        {/* Status and Offset */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">{offset}</span>
          <div className="flex items-center gap-1">
            {isBusiness ? (
              <Badge variant="default" className="text-xs px-1.5 py-0.5">Work</Badge>
            ) : (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Off</Badge>
            )}
            {isNight ? (
              <Moon className="h-3 w-3 text-slate-400" />
            ) : (
              <Sun className="h-3 w-3 text-yellow-500" />
            )}
          </div>
        </div>

        {/* Weather and Sun Times */}
        <div className="border-t pt-1.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-1">
              <span className="text-sm">{weather.icon}</span>
              <span className="font-medium text-xs">{weather.temperature}°</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3 text-slate-400" />
              <span className="text-slate-500 text-xs">{weather.windSpeed}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Sun className="h-3 w-3 text-yellow-500" />
              <span className="text-xs">{sunTimes.sunrise}</span>
            </div>
            <div className="flex items-center gap-1">
              <Moon className="h-3 w-3 text-blue-400" />
              <span className="text-xs">{sunTimes.sunset}</span>
            </div>
          </div>
        </div>

        {/* Timezone Identifier */}
        <div className="text-xs text-slate-400 text-center mt-1 truncate">
          {timezone.timezone}
        </div>
      </Card>
    </div>
  );
}

export function WorldClock({ 
  timezones, 
  selectedTime, 
  isLiveMode, 
  showAnalog,
  onToggleAnalog,
  onTimezoneChange, 
  onReorder,
  onTimeSelect 
}: WorldClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingTimezone, setEditingTimezone] = useState<string | null>(null);

  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    } else if (selectedTime) {
      setCurrentTime(selectedTime);
    }
  }, [isLiveMode, selectedTime]);

  const handleTimezoneEdit = (timezoneId: string, updates: Partial<TimezoneCard>) => {
    onTimezoneChange(timezoneId, updates);
    setEditingTimezone(null);
  };

  const baseTimezone = timezones.find(tz => tz.isBase) || timezones[0];

  return (
    <div className="space-y-6">
      {/* Timezone Cards */}
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {timezones.slice(0, 6).map((timezone) => (
            <TimezoneCardComponent
              key={timezone.id}
              timezone={timezone}
              currentTime={currentTime}
              isLiveMode={isLiveMode}
              baseTimezone={baseTimezone}
              showAnalog={showAnalog}
              onToggle={() => onTimezoneChange(timezone.id, { isActive: !timezone.isActive })}
              onChange={(updates) => handleTimezoneEdit(timezone.id, updates)}
              onEdit={() => setEditingTimezone(timezone.id)}
            />
          ))}
        </div>
      </div>

      {/* Timezone Editor Dialog */}
      {editingTimezone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Change Timezone</h3>
            <TimezoneSelector
              currentTimezone={timezones.find(tz => tz.id === editingTimezone)?.timezone || ''}
              onSelect={(timezone) => {
                const selectedTz = TIMEZONE_DATABASE.find(tz => tz.timezone === timezone);
                if (selectedTz) {
                  handleTimezoneEdit(editingTimezone, {
                    timezone: selectedTz.timezone,
                    city: selectedTz.city,
                    country: selectedTz.country,
                    name: selectedTz.city
                  });
                }
              }}
              onClose={() => setEditingTimezone(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}