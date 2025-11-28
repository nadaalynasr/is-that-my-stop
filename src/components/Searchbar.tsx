'use client'
import React, { useEffect, useRef, useState, useMemo } from "react"
import Fuse from 'fuse.js'
import { StationFeature } from '@/types'

interface SearchBarProps {
  stations: StationFeature[];
  onStationSelect: (station: StationFeature) => void;
  initialTerm?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ stations, onStationSelect, initialTerm }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => new Fuse(stations, {
    keys: [
      { name: 'properties.name', weight: 0.7 },
      { name: 'properties.STATION', weight: 0.7 },
      { name: 'properties.LABEL', weight: 0.5 },
      { name: 'properties.Station_Code', weight: 0.3 }
    ],
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.3,
    distance: 10,
  }), [stations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      const results = fuse.search(query).slice(0, 1);
      if (results[0]) {
        onStationSelect(results[0].item);
        setQuery(''); // Clear the input
        inputRef.current?.blur();
      }
    }
  };

  useEffect(() => {
    if (initialTerm && inputRef.current) {
      inputRef.current.value = initialTerm;
      setQuery(initialTerm);
    }
  }, [initialTerm]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={query}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder="Search for a MARTA station..."
      className="flex rounded-full border-2 border-blue-500/50 overflow-hidden max-w-2xl mx-auto px-12 py-8 text-2xl h-24 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );
};
