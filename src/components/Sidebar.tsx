'use client'
import { GuessList } from './GuessList';
import { Guess } from '@/types';

interface SidebarProps {
  guesses: Guess[];
}

export const Sidebar: React.FC<SidebarProps> = ({ guesses }) => {
  return (
    <div className="h-screen bg-black overflow-y-auto">
      {/* header */}
      <div className='flex flex-col center-items text-center'>
        <h1> Is This My Stop? </h1>
        <p style={{margin: '10px'}}> An ode to everytime you've asked <br/> "Is this our stop?" and "Are we getting off here?"</p>
      </div>

      {/* Guesses */}
      <div>
        <div className='flex flex-row'>
          <h2>Guessed Stops:</h2>
        </div>

        <GuessList guesses={guesses} />
      </div>

    </div>
  );
};
