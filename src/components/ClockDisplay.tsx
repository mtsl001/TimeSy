'use client';

import { useState, useEffect } from 'react';

interface ClockDisplayProps {
  time: string;
  date: string;
  isDigital?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isLiveMode?: boolean;
  timezone?: string; // Add timezone prop
}

export function ClockDisplay({ time, date, isDigital = true, size = 'md', isLiveMode = false, timezone }: ClockDisplayProps) {
  const [seconds, setSeconds] = useState(new Date().getSeconds());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(() => {
        const now = new Date();
        setSeconds(now.getSeconds());
        setCurrentTime(now);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  const analogSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  if (!isDigital) {
    // Get timezone-specific time for analog clock
    const displayTime = timezone && isLiveMode ? 
      new Date(currentTime.toLocaleString("en-US", {timeZone: timezone})) : 
      currentTime;
    
    return (
      <div className="flex flex-col items-center justify-center">
        <div className={`relative ${analogSizeClasses[size]}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Clock face */}
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="white"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-300"
            />
            
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const x1 = 100 + Math.cos(angle) * 85;
              const y1 = 100 + Math.sin(angle) * 85;
              const x2 = 100 + Math.cos(angle) * 75;
              const y2 = 100 + Math.sin(angle) * 75;
              
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate-600"
                />
              );
            })}
            
            {/* Second hand */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="20"
              stroke="#ef4444"
              strokeWidth="1"
              strokeLinecap="round"
              transform={`rotate(${isLiveMode ? displayTime.getSeconds() * 6 - 90 : getSecondRotation()} 100 100)`}
            />
            
            {/* Hour hand */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="50"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-slate-900"
              transform={`rotate(${getHourRotationFromTime(displayTime)} 100 100)`}
            />
            
            {/* Minute hand */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-slate-700"
              transform={`rotate(${getMinuteRotationFromTime(displayTime)} 100 100)`}
            />
            
            {/* Center dot */}
            <circle
              cx="100"
              cy="100"
              r="4"
              fill="currentColor"
              className="text-slate-900"
            />
          </svg>
        </div>
        
        <div className="text-center mt-0.5">
          <div className="text-xs text-slate-500">
            {date}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center">
        <div className={`font-mono font-semibold ${sizeClasses[size]}`}>
          {isLiveMode ? 
            currentTime.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }) : 
            time
          }
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          {date}
        </div>
      </div>
    </div>
  );
}

function getSecondRotation(): number {
  const now = new Date();
  return now.getSeconds() * 6 - 90;
}

function getHourRotationFromTime(date: Date): number {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return (hours % 12) * 30 + minutes * 0.5 - 90;
}

function getMinuteRotationFromTime(date: Date): number {
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return minutes * 6 + seconds * 0.1 - 90;
}

function getHourRotation(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours % 12) * 30 + minutes * 0.5 - 90;
}

function getMinuteRotation(time: string): number {
  const [_, minutes] = time.split(':').map(Number);
  return minutes * 6 - 90;
}