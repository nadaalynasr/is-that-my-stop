// lines & stations for graph logic
export const STATION_LINES: Record<string, string[]> = {
  'Airport': ['gold', 'red'],
  'College Park': ['gold', 'red'],
  'East Point': ['gold', 'red'],
  'Lakewood/Ft. McPherson': ['gold', 'red'],
  'Oakland City': ['gold', 'red'],
  'West End': ['gold', 'red'],
  'Garnett': ['gold', 'red'],
  'Five Points': ['gold', 'red', 'blue', 'green'], // The Hub
  'Peachtree Center': ['gold', 'red'],
  'Civic Center': ['gold', 'red'],
  'North Avenue': ['gold', 'red'],
  'Midtown': ['gold', 'red'],
  'Arts Center': ['gold', 'red'],
  'Lindbergh Center': ['gold', 'red'],
  'Lenox': ['gold'],
  'Brookhaven': ['gold'],
  'Chamblee': ['gold'],
  'Doraville': ['gold'],
  'Buckhead': ['red'],
  'Medical Center': ['red'],
  'Dunwoody': ['red'],
  'Sandy Springs': ['red'],
  'North Springs': ['red'],
  'Dome/GWCC/Philips Arena': ['blue', 'green'],
  'Vine City': ['blue', 'green'],
  'Ashby': ['blue', 'green'],
  'West Lake': ['blue'],
  'Hamilton E. Holmes': ['blue'],
  'Bankhead': ['green'],
  'Georgia State': ['blue', 'green'],
  'King Memorial': ['blue', 'green'],
  'Inman Park': ['blue', 'green'],
  'Edgewood/Candler Park': ['blue', 'green'],
  'East Lake': ['blue'],
  'Decatur': ['blue'],
  'Avondale': ['blue'],
  'Kensington': ['blue'],
  'Indian Creek': ['blue']
};

// NEIGHBORS FOR DISTANCE LOGIC
// Key: Station Name
// Value is the list of neighbor names.
export const NETWORK_GRAPH: Record<string, string[]> = {
  'Airport': ['College Park'],
  'College Park': ['Airport', 'East Point'],
  'East Point': ['College Park', 'Lakewood/Ft. McPherson'],
  'Lakewood/Ft. McPherson': ['East Point', 'Oakland City'],
  'Oakland City': ['Lakewood/Ft. McPherson', 'West End'],
  'West End': ['Oakland City', 'Garnett'],
  'Garnett': ['West End', 'Five Points'],
  'Five Points': ['Garnett', 'Peachtree Center', 'Dome/GWCC/Philips Arena', 'Georgia State'], // Transfer Point
  'Peachtree Center': ['Five Points', 'Civic Center'],
  'Civic Center': ['Peachtree Center', 'North Avenue'],
  'North Avenue': ['Civic Center', 'Midtown'],
  'Midtown': ['North Avenue', 'Arts Center'],
  'Arts Center': ['Midtown', 'Lindbergh Center'],
  'Lindbergh Center': ['Arts Center', 'Lenox', 'Buckhead'], // Split Point
  
  // Gold Branch
  'Lenox': ['Lindbergh Center', 'Brookhaven'],
  'Brookhaven': ['Lenox', 'Chamblee'],
  'Chamblee': ['Brookhaven', 'Doraville'],
  'Doraville': ['Chamblee'],

  // Red Branch
  'Buckhead': ['Lindbergh Center', 'Medical Center'],
  'Medical Center': ['Buckhead', 'Dunwoody'],
  'Dunwoody': ['Medical Center', 'Sandy Springs'],
  'Sandy Springs': ['Dunwoody', 'North Springs'],
  'North Springs': ['Sandy Springs'],

  // Blue/Green West
  'Hamilton E. Holmes': ['West Lake'],
  'West Lake': ['Hamilton E. Holmes', 'Ashby'],
  'Bankhead': ['Ashby'],
  'Ashby': ['West Lake', 'Bankhead', 'Vine City'],
  'Vine City': ['Ashby', 'Dome/GWCC/Philips Arena'],
  'Dome/GWCC/Philips Arena': ['Vine City', 'Five Points'],

  // Blue/Green East
  'Georgia State': ['Five Points', 'King Memorial'],
  'King Memorial': ['Georgia State', 'Inman Park'],
  'Inman Park': ['King Memorial', 'Edgewood/Candler Park'],
  'Edgewood/Candler Park': ['Inman Park', 'East Lake'],
  'East Lake': ['Edgewood/Candler Park', 'Decatur'],
  'Decatur': ['East Lake', 'Avondale'],
  'Avondale': ['Decatur', 'Kensington'],
  'Kensington': ['Avondale', 'Indian Creek'],
  'Indian Creek': ['Kensington']
};

// ALGORITHM: BFS for Shortest Path

export const getStopsDistance = (startName: string, endName: string): number => {
  if (startName === endName) return 0;

  const queue: [string, number][] = [[startName, 0]];
  const visited = new Set<string>([startName]);

  while (queue.length > 0) {
    const [current, distance] = queue.shift()!;

    if (current === endName) return distance;

    const neighbors = NETWORK_GRAPH[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, distance + 1]);
      }
    }
  }
  return 99; // Error: Not connected
};