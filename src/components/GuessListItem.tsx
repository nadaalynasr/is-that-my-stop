// src/components/GuessListItem.tsx
import { Guess } from '@/types';
import { STATION_LINES } from '@/lib/martaLogic';

interface GuessListItemProps {
  guess: Guess;
}

const BADGE_STYLES: Record<string, { backgroundColor: string; color: string }> = {
  gold: { backgroundColor: '#facc15', color: '#ffffffff' },
  red: { backgroundColor: '#ef4444', color: '#ffffff' },
  blue: { backgroundColor: '#3b82f6', color: '#ffffff' },
  green: { backgroundColor: '#22c55e', color: '#ffffff' }
};

export const GuessListItem: React.FC<GuessListItemProps> = ({ guess }) => {
  const name = guess.station.properties?.STATION || 'Unknown';
  const lines = STATION_LINES[name] || ['ERROR'];

  return (
    <div className="flex items-center gap-3 py-2">
      {/* line badges */}
      <div className="flex flex-row gap-3 min-w-[200px]">
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
