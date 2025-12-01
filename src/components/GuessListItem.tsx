// src/components/GuessListItem.tsx
import { Guess } from '@/types';
import { STATION_LINES } from '@/lib/martaLogic';

interface GuessListItemProps {
  guess: Guess;
}

const BADGE_STYLES: Record<string, { backgroundColor: string; color: string, borderRadius?: string, padding?: string, margin?: string }> = {
  gold: { backgroundColor: '#facc15', color: '#ffffffff', borderRadius:'7px', padding:'5px', margin:'2px' },
  red: { backgroundColor: '#ef4444', color: '#ffffff', borderRadius:'7px', padding:'5px', margin: '2px' },
  blue: { backgroundColor: '#3b82f6', color: '#ffffff', borderRadius:'7px', padding:'5px', margin:'2px'   },
  green: { backgroundColor: '#22c55e', color: '#ffffff', borderRadius:'7px', padding:'5px', margin:'2px'  }
};

export const GuessListItem: React.FC<GuessListItemProps> = ({ guess }) => {
  const name = guess.station.properties?.STATION || 'Unknown';
  const lines = STATION_LINES[name] || ['ERROR'];

  return (
    <button className="flex w-full items-center rounded px-2 py-1 text-sm">
      {/* line badges */}
      {lines.map((line) => (
        <div
          key={line}
          className="capitalize -mr-0.5 h-5 w-5 object-contain"
          style={BADGE_STYLES[line]}
        >
          {line}
        </div>
      ))}

      {/* station name and proximity */}
      <span className="ml-2.5 max-w-md truncate">{name}</span>

      <span className="ml-auto whitespace-nowrap font-sans font-light text-gray-500">{guess.distance} stops away</span>
    </button>
  );
};
