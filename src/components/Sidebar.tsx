'use client'
import { GuessList } from './GuessList';
import { Guess } from '@/types';

interface SidebarProps {
  guesses: Guess[];
}

export const Sidebar: React.FC<SidebarProps> = ({ guesses }) => {
  return (
    <div className="h-screen bg-black overflow-y-auto">
        An ode to everytime you've asked "Is this our stop? Are we there yet?"
      <GuessList guesses={guesses} />
    </div>
  );
};
