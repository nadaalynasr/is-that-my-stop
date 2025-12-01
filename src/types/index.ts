import { Feature, Point, LineString, FeatureCollection } from 'geojson';

export interface StationProperties {
  id?: number;
  name?: string;
  alternate_names?: string[];
  lines?: string[];
  order?: number;
  OBJECTID?: number;
  STATION?: string;
  Station_Code?: string;
  Web_address?: string;
  Parking_Spaces?: number;
  Parking?: string;
  Street?: string;
  City?: string;
  Zip?: number;
  GlobalID?: string;
  LABEL?: string;
}

export interface StationFeature extends Feature<Point, StationProperties> {
  id: number;
}

export interface RouteProperties {
  line: string;
  color: string;
}

export interface RouteFeature extends Feature<LineString, RouteProperties> {}

export interface Line {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Lines {
  [lineId: string]: Line;
}

export interface Guess {
  station: StationFeature;
  distance: number;
  proximity: ProximityLevel;
}

export interface ProximityLevel {
  level: 'correct' | 'hot' | 'warm' | 'cold' | 'freezing';
  color: string;
  text: string;
}

export interface GameState {
  targetStation: StationFeature | null;
  guesses: Guess[];
  gameWon: boolean;
  guessedStationIds: Set<number>;
}

export interface CityConfig {
  name: string;
  slug: string;
  center: [number, number];
  zoom: number;
  bounds: [[number, number], [number, number]];
}
