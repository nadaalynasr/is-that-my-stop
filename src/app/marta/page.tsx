'use client';
import { useState, useRef } from 'react';
import { Map } from '@/components/Map';
import { SearchBar } from '@/components/Searchbar';
import features from './data/features.json';
import routes from './data/routes.json';
import { StationFeature, RouteFeature } from '@/types';
import mapboxgl from 'mapbox-gl';

export default function AtlantaGamePage() {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // force TypeScript to recognize the data types
  const stations = (features as any).features as StationFeature[];
  const railRoutes = routes as RouteFeature[];


  //TODO: Doesn't work yet.
  const handleStationClick = (station: StationFeature) => {
    console.log('Clicked:', station.properties.STATION || station.properties.name);
    // Fly to the clicked station
    if (station.geometry.type === 'Point') {
      mapRef.current?.flyTo({
        center: station.geometry.coordinates as [number, number],
        zoom: 14,
      });
    }
  };

  const handleSearchSelect = (station: StationFeature) => {
    console.log('Selected from search:', station.properties.STATION || station.properties.name);
    // Fly to the station 
    if (station.geometry.type === 'Point') {
      mapRef.current?.flyTo({
        center: station.geometry.coordinates as [number, number],
        zoom: 14,
      });
    }
  };

  const setMapRef = (map: mapboxgl.Map) => {
    mapRef.current = map;
  };

  return (
    <div className="flex h-screen w-8/12 bg-black">
      {/* The Map Container
        - flex-1: Takes up all available space
        - relative: Needed for positioning
      */}
      <div className="flex-1 relative">
        <div className="absolute top-1/8 left-1/2 transform -translate-x-1/2 z-10 w-full">
          <SearchBar stations={stations} onStationSelect={handleSearchSelect} />
        </div>
        <MapContainer stations={stations} routes={railRoutes} setMapRef={setMapRef} onStationClick={handleStationClick} />
      </div>
    </div>
  );
}

// Extract map into a component with ref management
function MapContainer({ stations, routes, setMapRef, onStationClick }: {
  stations: StationFeature[];
  routes: RouteFeature[];
  setMapRef: (map: mapboxgl.Map) => void;
  onStationClick: (station: StationFeature) => void;
}) {
  return (
    <Map
      stations={stations}
      routes={routes}
      center={[-84.3880, 33.7490]} // Atlanta Center [Lon, Lat]
      zoom={11}
      onStationClick={onStationClick}
      getStationColor={(station) => '#ffffff'}
      setMapRef={setMapRef}
    />
  );
}
