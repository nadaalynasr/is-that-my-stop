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
    <div className="flex items-center gap-3 py-2">
      {/* line badges */}
      <div 
      className="flex flex-row gap-3 min-w-[250px]">
        {lines.map((line) => (
          <div
            key={line}
            className="uppercase font-bold text-xs px-3 py-1.5 rounded-md"
            style={BADGE_STYLES[line]}
          >
            {line}
          </div>
        ))}
      </div>

      {/* station name */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-base leading-tight">
          {name}
        </div>
        <div 
          className="text-xs font-medium mt-0.5" 
          style={{ color: guess.proximity.color }}
        >
          {guess.proximity.text}
        </div>
      </div>

      {/* stop away count */}
      <div className="text-right flex-shrink-0 min-w-[60px]">
        <span className="text-2xl font-bold text-gray-400 block leading-none">
          {guess.distance}
        </span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
          Stops
        </span>
      </div>
    </div>
  );
};
