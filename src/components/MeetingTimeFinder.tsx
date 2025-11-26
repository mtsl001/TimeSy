'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Play, Pause } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TimezoneCard } from '@/lib/timezone';
import { 
  formatTimeInTimezone, 
  isBusinessHours,
  getBusinessHoursOverlap 
} from '@/lib/timezone';

interface MeetingTimeFinderProps {
  timezones: TimezoneCard[];
  selectedTime?: Date;
  isLiveMode: boolean;
  onTimeSelect: (time: Date) => void;
}

export function MeetingTimeFinder({ 
  timezones, 
  selectedTime, 
  isLiveMode, 
  onTimeSelect 
}: MeetingTimeFinderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(Math.floor(new Date().getMinutes() / 30) * 30);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeTimezones = timezones.filter(tz => tz.isActive);

  useEffect(() => {
    if (isLiveMode) {
      setCurrentTime(new Date());
      setSelectedHour(new Date().getHours());
      setSelectedMinute(Math.floor(new Date().getMinutes() / 30) * 30);
    } else if (selectedTime) {
      setCurrentTime(selectedTime);
      setSelectedHour(selectedTime.getHours());
      setSelectedMinute(Math.floor(selectedTime.getMinutes() / 30) * 30);
    }
  }, [isLiveMode, selectedTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isLiveMode) {
      interval = setInterval(() => {
        setSelectedHour((prev) => {
          setSelectedMinute((prevMinute) => {
            const nextMinute = prevMinute + 30;
            if (nextMinute >= 60) {
              const nextHour = (prev + 1) % 24;
              const newTime = new Date(currentTime);
              newTime.setHours(nextHour, 0, 0, 0);
              setCurrentTime(newTime);
              onTimeSelect(newTime);
              return 0;
            } else {
              const newTime = new Date(currentTime);
              newTime.setHours(prev, nextMinute, 0, 0);
              setCurrentTime(newTime);
              onTimeSelect(newTime);
              return nextMinute;
            }
          });
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isLiveMode, currentTime, onTimeSelect]);

  const handleTimeChange = (hour: number, minute: number = 0) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    const newTime = new Date(currentTime);
    newTime.setHours(hour, minute, 0, 0);
    setCurrentTime(newTime);
    onTimeSelect(newTime);
  };

  const handleSliderChange = (value: number) => {
    const totalSteps = 48; // 24 hours * 2 (30-min intervals)
    const hour = Math.floor(value / 2);
    const minute = (value % 2) * 30;
    handleTimeChange(hour, minute);
  };

  const getOverlapForTime = (hour: number, minute: number): number => {
    const testDate = new Date(currentTime);
    testDate.setHours(hour, minute, 0, 0);
    return getBusinessHoursOverlap(activeTimezones.map(tz => tz.timezone), testDate);
  };

  const getOverlapColor = (overlap: number, total: number): string => {
    const percentage = (overlap / total) * 100;
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const formatHour = (hour: number): string => {
    return formatTime(hour, 0);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header with Selected Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Explorer
              </h3>
              <p className="text-sm text-slate-500 mt-1">Find the perfect meeting time across timezones</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {formatTime(selectedHour, selectedMinute)}
              </div>
              <div className="text-sm text-slate-500">
                {getOverlapForTime(selectedHour, selectedMinute)} of {activeTimezones.length} in business hours
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isLiveMode}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPlaying ? "Pause time animation" : "Play time animation to cycle through hours"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Visual Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">Business Hours Overlap</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-500">High</span>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-slate-500">Medium</span>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-slate-500">Low</span>
            </div>
          </div>
          
          <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden">
            {Array.from({ length: 48 }, (_, step) => {
              const hour = Math.floor(step / 2);
              const minute = (step % 2) * 30;
              const overlap = getOverlapForTime(hour, minute);
              const color = getOverlapColor(overlap, activeTimezones.length);
              const isSelected = hour === selectedHour && minute === selectedMinute;
              
              return (
                <div
                  key={step}
                  className={`absolute h-full cursor-pointer transition-all ${color} ${
                    isSelected ? 'ring-2 ring-blue-500 z-10' : ''
                  } hover:opacity-80`}
                  style={{
                    left: `${(step / 48) * 100}%`,
                    width: `${100 / 48}%`
                  }}
                  onClick={() => handleTimeChange(hour, minute)}
                  title={`${formatTime(hour, minute)} - ${overlap}/${activeTimezones.length} timezones in business hours`}
                >
                  {isSelected && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      {overlap}/{activeTimezones.length}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Hour labels */}
          <div className="flex justify-between mt-2">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} className="text-xs text-slate-500">
                {formatHour(i * 4)}
              </span>
            ))}
          </div>
        </div>

        {/* Slider Control */}
        <div className="space-y-4">
          <Slider
            value={[selectedHour * 2 + (selectedMinute / 30)]}
            onValueChange={([value]) => handleSliderChange(value)}
            max={47}
            min={0}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-sm text-slate-500">
            <span>12:00 AM</span>
            <span>6:00 AM</span>
            <span>12:00 PM</span>
            <span>6:00 PM</span>
            <span>11:00 PM</span>
          </div>
        </div>

        {/* Timezone Grid */}
        <div>
          <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Timezone Details
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {activeTimezones.map((tz) => {
              const testTime = new Date(currentTime);
              testTime.setHours(selectedHour, selectedMinute, 0, 0);
              const time = formatTimeInTimezone(testTime, tz.timezone);
              const isBusiness = isBusinessHours(testTime, tz.timezone);
              
              return (
                <div key={tz.id} className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <div className="text-xs font-medium mb-1">{tz.city}</div>
                  <div className="text-xs text-slate-500 mb-2">{tz.country}</div>
                  <div className="text-sm font-mono font-medium mb-2">{time}</div>
                  <Badge variant={isBusiness ? "default" : "secondary"} className="text-xs">
                    {isBusiness ? "Work" : "Off"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}