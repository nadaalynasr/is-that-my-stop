// src/hooks/useGame.ts
import { useState, useCallback } from 'react';
import { getStopsDistance } from '@/lib/martaLogic';
import { StationFeature, ProximityLevel, Guess, GameState } from '@/types';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    targetStation: null,
    guesses: [],
    gameWon: false,
    guessedStationIds: new Set<number>()
  });

  const setTargetStation = useCallback((station: StationFeature) => {
    setGameState(prev => ({ ...prev, targetStation: station }));
  }, []);

  const makeGuess = useCallback((station: StationFeature) => {
    setGameState(prev => {
      if (prev.targetStation === null) return prev; // Early return if no target set

      // Check for duplicate
      if (prev.guessedStationIds.has(station.id)) {
        return { ...prev};
      }

      // get station names
      const guessName = station.properties.STATION!;
      const targetName = prev.targetStation.properties.STATION!;

      // calculate stops using the graph
      const stops = getStopsDistance(guessName, targetName);

      // game rules for proximity
      let proximity: ProximityLevel;

      if (stops === 0) {
        proximity = { level: 'correct', color: '#22c55e', text: 'Correct' };
      } else if (stops === 1) {
        proximity = { level: 'hot', color: '#ef4444', text: 'Hot' };
      } else if (stops <= 3) {
        proximity = { level: 'warm', color: '#f97316', text: 'Warm' };
      } else if (stops <= 5) {
        proximity = { level: 'cold', color: '#3b82f6', text: 'Cold' };
      } else {
        proximity = { level: 'freezing', color: '#8b5cf6', text: 'Freezing' };
      }

      const newGuess: Guess = {
        station,
        distance: stops, // distance determined by stops !
        proximity
      };

      return {
        ...prev,
        guesses: [...prev.guesses, newGuess],
        guessedStationIds: new Set([...prev.guessedStationIds, station.id]),
        gameWon: stops === 0 || prev.gameWon,
      };
    });
  }, []);

  return { gameState, makeGuess, setTargetStation };
}
