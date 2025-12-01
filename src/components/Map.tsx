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
  setMapRef?: (map: mapboxgl.Map) => void;
}

export const Map: React.FC<MapProps> = ({
  stations,
  routes,
  center,
  zoom,
  onStationClick,
  getStationColor,
  setMapRef
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Map!!
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      config: {
        basemap: {
          showPedestrianRoads: false,
          showPointOfInterestLabels: false,
          showRoadLabels: false,
          showTransitLabels: false,
          font: "Barlow",
          show3dObjects: false,
          showLandmarkIconLabels: false,
          theme: "faded"
        }
      },
      center: [center[0], center[1]],
      zoom: zoom,
      bearing: 0.00,
      pitch: 0.00,
      projection: 'mercator' as any
    });

    // Load mapbox style
    map.current.on('load', () => {
      if (!map.current) return;

      // Set map ref if callback provided
      if (setMapRef) {
        setMapRef(map.current);
      }

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

      // Add labels for guessed stations
      map.current.addLayer({
        id: 'station-labels',
        type: 'symbol',
        source: 'stations',
        layout: {
          'text-field': ['get', 'STATION'],
          'text-justify': 'center',
          'text-size': 12,
          'text-offset': [0, -1.2], // Position above the circle
        },
        paint: {
          'text-color': '#000000'
        },
        filter: ['!=', ['get', 'dynamicColor'], '#ffffff'] // Only show labels for guessed stations
      });

      // -- ETC MISC -- 
      

      // Change cursor to pointer when hovering over a station
      map.current.on('mouseenter', 'station-points', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'station-points', () => {
        map.current!.getCanvas().style.cursor = '';
      });

      // Add click handler for stations
      map.current.on('click', 'station-points', (e) => {
        if (e.features && e.features.length > 0) {
          const clickedStation = e.features[0] as unknown as StationFeature;
          onStationClick(clickedStation);
        }
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
