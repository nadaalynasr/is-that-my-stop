import { Guess } from '@/types';
import { GuessListItem } from './GuessListItem';

interface GuessListProps {
  guesses: Guess[];
}

export const GuessList: React.FC<GuessListProps> = ({ guesses }) => {
  // sort closest stops at the top
  const sortedGuesses = [...guesses].sort((a, b) => a.distance - b.distance);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
      {sortedGuesses.map((guess) => (
        <GuessListItem key={guess.station.id} guess={guess} />
      ))}
    </div>
  );
};