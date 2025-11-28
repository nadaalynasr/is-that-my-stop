'use client';
import { Map } from '@/components/Map';
import features from './data/features.json';
import routes from './data/routes.json';
import { StationFeature, RouteFeature } from '@/types';

export default function AtlantaGamePage() {
  // force TypeScript to recognize the data types
  const stations = (features as any).features as StationFeature[];
  const railRoutes = routes as RouteFeature[];

  return (
    <div className="flex h-screen w-full bg-black">
      {/* The Map Container 
        - flex-1: Takes up all available space
        - relative: Needed for positioning
      */}
      <div className="flex-1 relative">
        <Map
          stations={stations}
          routes={railRoutes}
          center={[-84.3880, 33.7490]} // Atlanta Center [Lon, Lat]
          zoom={11}
          
          // DUMMY INTERACTION: Just logs the name for now
          onStationClick={(station) => {
            console.log('Clicked:', station.properties.name);
          }}
          
          // DUMMY COLOR: Makes every station white for now
          getStationColor={(station) => {
            return '#ffffff';
          }}
        />
      </div>
    </div>
  );
}