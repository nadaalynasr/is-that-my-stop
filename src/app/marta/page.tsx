'use client';
import { useRef, useEffect } from 'react';
import { Map } from '@/components/Map';
import { SearchBar } from '@/components/Searchbar';
import { Sidebar } from '@/components/Sidebar';
import { useGame } from '@/hooks/useGame';
import features from './data/features.json';
import routes from './data/routes.json';
import { StationFeature, RouteFeature, GameState } from '@/types';
import { getStationFillColor } from '@/lib/martaLogic';
import mapboxgl from 'mapbox-gl';

export default function AtlantaGamePage() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { gameState, makeGuess, setTargetStation } = useGame();

  // force TypeScript to recognize the data types
  const stations = (features as any).features as StationFeature[];
  const railRoutes = routes as RouteFeature[];

  useEffect(() => {
    const target = stations[Math.floor(Math.random() * stations.length)];
    setTargetStation(target);
    console.log('Target station set to:', target.properties?.STATION);
  }, [stations, setTargetStation]);

  const handleStationClick = (station: StationFeature) => {
    makeGuess(station);
    // Fly to the station
    if (station.geometry.type === 'Point') {
      mapRef.current?.flyTo({
        center: station.geometry.coordinates as [number, number],
        zoom: 14,
      });
      // Zoom back out after 3 seconds
      setTimeout(() => {
        mapRef.current?.flyTo({
          center: station.geometry.coordinates as [number, number],
          zoom: 11,
        });
      }, 3000);
    }
  };

  const handleSearchSelect = (station: StationFeature) => {
    makeGuess(station);
    // Fly to the station
    if (station.geometry.type === 'Point') {
      mapRef.current?.flyTo({
        center: station.geometry.coordinates as [number, number],
        zoom: 14,
      });
      // Zoom back out after 3 seconds
      setTimeout(() => {
        mapRef.current?.flyTo({
          center: station.geometry.coordinates as [number, number],
          zoom: 12,
        });
      }, 2500);
    }
  };

  const setMapRef = (map: mapboxgl.Map) => {
    mapRef.current = map;
  };

  return (
    <div>
      <div className="flex h-screen">

        {/* MAP CONTAINER */}
        <div className ="w-8/12 relative">
          <MapContainer stations={stations} routes={railRoutes} setMapRef={setMapRef} onStationClick={handleStationClick} gameState={gameState} />
            <div className="absolute top-1/12 left-1/2 transform -translate-x-1/2 z-10 w-full">
              <SearchBar stations={stations} onStationSelect={handleSearchSelect} />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-4/12">
          <Sidebar guesses={gameState.guesses}/>
        </div>


      </div>
    </div>
  );
}

// Extract map into a component with ref management
function MapContainer({ stations, routes, setMapRef, onStationClick, gameState }: {
  stations: StationFeature[];
  routes: RouteFeature[];
  setMapRef: (map: mapboxgl.Map) => void;
  onStationClick: (station: StationFeature) => void;
  gameState: GameState;
}) {
  return (
    <Map
      stations={stations}
      routes={routes}
      center={[-84.3880, 33.7490]} // Atlanta Center [Lon, Lat]
      zoom={11}
      onStationClick={onStationClick}
      getStationColor={(station) => {
        const stationName = station.properties?.STATION || '';
        if (gameState.guessedStationIds.has(station.id)) {
          return getStationFillColor(stationName);
        }
        return '#ffffff';
      }}
      setMapRef={setMapRef}
    />
  );
}
