'use client';

import { useState, useEffect } from 'react';
import { WorldClock } from '@/components/WorldClock';
import { MeetingTimeFinder } from '@/components/MeetingTimeFinder';
import { Footer } from '@/components/Footer';
import { TimezoneCard, DEFAULT_TIMEZONES, decodeTimezonesFromURL, encodeTimezonesToURL } from '@/lib/timezone';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Share2, Clock, Users, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  const [timezones, setTimezones] = useState<TimezoneCard[]>(DEFAULT_TIMEZONES);
  const [selectedTime, setSelectedTime] = useState<Date | undefined>();
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [showAnalog, setShowAnalog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isTimeFocused, setIsTimeFocused] = useState(false);

  // Load timezones from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const encoded = urlParams.get('data');
      
      if (encoded) {
        try {
          const { timezones: loadedTimezones, selectedTime: loadedTime } = decodeTimezonesFromURL(encoded);
          setTimezones(loadedTimezones);
          if (loadedTime) {
            setSelectedTime(loadedTime);
            setIsLiveMode(false);
          }
        } catch (error) {
          console.error('Failed to load timezones from URL:', error);
        }
      }
    }
  }, []);

  const handleShare = () => {
    const encoded = encodeTimezonesToURL(timezones, selectedTime);
    const url = `${window.location.origin}?data=${encoded}`;
    
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Share link copied to clipboard!');
      setShowShareDialog(true);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleExportScreenshot = async () => {
    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      // Get the main content area
      const element = document.getElementById('main-content');
      if (!element) {
        toast.error('Could not find content to export');
        return;
      }

      // Create canvas from the element
      const canvas = await html2canvas(element, {
        backgroundColor: '#f8fafc',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `timesynx-${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('Screenshot exported successfully!');
        }
      });
    } catch (error) {
      console.error('Screenshot export failed:', error);
      toast.error('Failed to export screenshot');
    }
  };

  const handleTimezoneChange = (id: string, updates: Partial<TimezoneCard>) => {
    setTimezones(prev => prev.map(tz => 
      tz.id === id ? { ...tz, ...updates } : tz
    ));
  };

  const handleReorder = (newOrder: TimezoneCard[]) => {
    setTimezones(newOrder);
  };

  const handleTimeFocusChange = (focused: boolean) => {
    setIsTimeFocused(focused);
    if (!focused) {
      setSelectedTime(undefined);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Time Synx</h1>
              </div>
              <span className="text-sm text-slate-500 hidden sm:inline">Global Time Zone Converter</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isTimeFocused ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeFocusChange(!isTimeFocused)}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-2 h-2 rounded-full ${isTimeFocused ? "bg-green-500" : "bg-slate-400"}`}></div>
                    {isTimeFocused ? "Time Focused" : "Live Time"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isTimeFocused ? "Switch to live time updates" : "Freeze time to select a specific moment"}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy share link and export screenshot</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
        {/* Meeting Time Finder Section */}
        <section className="min-h-96">
          <MeetingTimeFinder
            timezones={timezones.filter(tz => tz.isActive)}
            selectedTime={selectedTime}
            isLiveMode={!isTimeFocused}
            onTimeSelect={(time) => {
              setSelectedTime(time);
              setIsTimeFocused(true);
            }}
          />
        </section>

        {/* World Clock Section */}
        <section className="min-h-80">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">World Clock</h2>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-slate-500">Digital</span>
                <Switch
                  checked={showAnalog}
                  onCheckedChange={setShowAnalog}
                  size="sm"
                />
                <span className="text-sm text-slate-500">Analog</span>
              </div>
            </div>
          </div>
          
          <WorldClock
            timezones={timezones}
            selectedTime={selectedTime}
            isLiveMode={!isTimeFocused}
            showAnalog={showAnalog}
            onToggleAnalog={() => setShowAnalog(!showAnalog)}
            onTimezoneChange={handleTimezoneChange}
            onReorder={handleReorder}
            onTimeSelect={(time) => {
              setSelectedTime(time);
              setIsTimeFocused(true);
            }}
          />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Share Your Time Setup</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Share link copied to clipboard! You can now share this with your team members.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowShareDialog(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={handleExportScreenshot}
                className="flex-1"
              >
                Export as Screenshot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
}