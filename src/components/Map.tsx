'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { StationFeature, RouteFeature } from '../types';

// Connect to your token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapProps {
  stations: StationFeature[];
  routes: RouteFeature[];
  center: [number, number];
  zoom: number;
  onStationClick: (station: StationFeature) => void;
  getStationColor: (station: StationFeature) => string;
}

export const Map: React.FC<MapProps> = ({
  stations,
  routes,
  center,
  zoom,
  onStationClick,
  getStationColor
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Map!!
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11', 
      center: [center[0], center[1]],
      zoom: zoom,
      projection: 'mercator' as any 
    });

    // Load mapbox style 
    map.current.on('load', () => {
      if (!map.current) return;

      // Adding the route lines
      
      // add data from geojson
      map.current.addSource('transit-lines', {
        type: 'geojson',
        data: routes as any 
      });


      //  Add layer for train lines
      map.current.addLayer({
        id: 'lines-core',
        type: 'line',
        source: 'transit-lines',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': ['concat', '#', ['get', 'route_color']],
          'line-width': 3,
          'line-opacity': 0.5,
        }
      });

      //  -- ADD STATIONS -- 
      
      // Convert stations array to geojson object
      const stationGeoJSON = {
        type: 'FeatureCollection',
        features: stations.map(s => ({
          ...s,
          properties: {
            ...s.properties,
            //  embed the dynamic color into the data so Mapbox can read it
            dynamicColor: getStationColor(s)
          }
        }))
      };

      map.current.addSource('stations', {
        type: 'geojson',
        data: stationGeoJSON as any
      });

      map.current.addLayer({
        id: 'station-points',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-radius': 6,
          'circle-color': ['get', 'dynamicColor'], // Read color from data
          'circle-stroke-width': 0.5,
          'circle-stroke-color': 'black'
        }
      });

      // -- ETC MISC -- 
      

      // Change cursor to pointer when hovering over a station
      map.current.on('mouseenter', 'station-points', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'station-points', () => {
        map.current!.getCanvas().style.cursor = '';
      });
    });
  }, [center, zoom]); // Run once on mount

  // Handle Updates 
  useEffect(() => {
    if (!map.current || !map.current.getSource('stations')) return;

    // Update the data source with new colors
    const source = map.current.getSource('stations') as mapboxgl.GeoJSONSource;
    
    const updatedData = {
      type: 'FeatureCollection',
      features: stations.map(s => ({
        ...s,
        properties: {
          ...s.properties,
          dynamicColor: getStationColor(s)
        }
      }))
    };

    source.setData(updatedData as any);
  }, [stations, getStationColor]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg shadow-2xl bg-black" />;
};
