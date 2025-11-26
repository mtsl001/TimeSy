'use client';

import { useState, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Search } from 'lucide-react';
import { TIMEZONE_DATABASE } from '@/lib/timezone';

interface TimezoneSelectorProps {
  currentTimezone: string;
  onSelect: (timezone: string) => void;
  onClose: () => void;
}

export function TimezoneSelector({ currentTimezone, onSelect, onClose }: TimezoneSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regions = useMemo(() => {
    const regionMap = new Map<string, typeof TIMEZONE_DATABASE>();
    
    TIMEZONE_DATABASE.forEach(tz => {
      const region = getRegion(tz.country);
      if (!regionMap.has(region)) {
        regionMap.set(region, []);
      }
      regionMap.get(region)!.push(tz);
    });
    
    return Array.from(regionMap.entries()).map(([region, timezones]) => ({
      name: region,
      timezones
    }));
  }, []);

  const filteredTimezones = useMemo(() => {
    let filtered = TIMEZONE_DATABASE;
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(tz => getRegion(tz.country) === selectedRegion);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tz => 
        tz.city.toLowerCase().includes(term) ||
        tz.country.toLowerCase().includes(term) ||
        tz.timezone.toLowerCase().includes(term)
      );
    }
    
    return filtered.slice(0, 50); // Limit to 50 results for performance
  }, [searchTerm, selectedRegion]);

  const handleSelect = (timezone: string) => {
    onSelect(timezone);
    onClose();
  };

  return (
    <div className="space-y-4">
      {/* Region Filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedRegion === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedRegion('all')}
        >
          All Regions
        </Badge>
        {regions.map(region => (
          <Badge
            key={region.name}
            variant={selectedRegion === region.name ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedRegion(region.name)}
          >
            {region.name}
          </Badge>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search cities, countries, or timezones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>

      {/* Timezone List */}
      <div className="max-h-96 overflow-y-auto">
        <Command>
          <CommandList>
            {filteredTimezones.length === 0 ? (
              <CommandEmpty>No timezones found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredTimezones.map((tz) => (
                  <CommandItem
                    key={tz.timezone}
                    value={tz.timezone}
                    onSelect={() => handleSelect(tz.timezone)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-100 rounded-md"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <div>
                        <div className="font-medium">{tz.city}</div>
                        <div className="text-sm text-slate-500">
                          {tz.country} • {tz.timezone}
                        </div>
                      </div>
                    </div>
                    {tz.timezone === currentTimezone && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function getRegion(country: string): string {
  const regionMap: Record<string, string> = {
    'USA': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',
    'UK': 'Europe',
    'France': 'Europe',
    'Germany': 'Europe',
    'Italy': 'Europe',
    'Spain': 'Europe',
    'Netherlands': 'Europe',
    'Sweden': 'Europe',
    'Russia': 'Europe',
    'Japan': 'Asia',
    'China': 'Asia',
    'Hong Kong': 'Asia',
    'Singapore': 'Asia',
    'India': 'Asia',
    'UAE': 'Asia',
    'South Korea': 'Asia',
    'Thailand': 'Asia',
    'Australia': 'Oceania',
    'New Zealand': 'Oceania',
    'Brazil': 'South America',
    'Argentina': 'South America',
    'Peru': 'South America',
    'Egypt': 'Africa',
    'Nigeria': 'Africa',
    'South Africa': 'Africa',
  };
  
  return regionMap[country] || 'Other';
}