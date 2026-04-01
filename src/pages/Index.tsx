import React, { useState } from 'react';
import TutorialScreen from '@/components/TutorialScreen';
import LevelScreen from '@/components/LevelScreen';
import VictoryScreen from '@/components/VictoryScreen';
import { levels } from '@/lib/levels';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GamePhase = 'title' | 'tutorial' | 'playing' | 'victory';

const Index = () => {
  const [phase, setPhase] = useState<GamePhase>('title');
  const [currentLevel, setCurrentLevel] = useState(0);

  const handleStartTutorial = () => setPhase('tutorial');
  const handleStartGame = () => {
    setCurrentLevel(0);
    setPhase('playing');
  };
  const handleNextLevel = () => {
    if (currentLevel >= levels.length - 1) {
      setPhase('victory');
    } else {
      setCurrentLevel(l => l + 1);
    }
  };
  const handleRestart = () => {
    setPhase('title');
    setCurrentLevel(0);
  };

  if (phase === 'title') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-primary">
                <Zap className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground glow-text-primary">
              Decode the<br />Automaton
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Learn how Nondeterministic Finite Automata work by solving puzzles and watching state machines come alive.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleStartTutorial}
              size="lg"
              className="w-full max-w-xs bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-lg"
            >
              Start Learning
            </Button>
            <Button
              onClick={handleStartGame}
              variant="outline"
              size="lg"
              className="w-full max-w-xs border-border text-foreground"
            >
              Skip to Puzzles
            </Button>
          </div>

          <p className="text-xs text-muted-foreground font-mono">
            {levels.length} levels • Interactive simulations • No prerequisites
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'tutorial') {
    return <TutorialScreen onStart={handleStartGame} />;
  }

  if (phase === 'playing') {
    return (
      <LevelScreen
        key={currentLevel}
        level={levels[currentLevel]}
        levelIndex={currentLevel}
        totalLevels={levels.length}
        onNext={handleNextLevel}
        isLast={currentLevel >= levels.length - 1}
      />
    );
  }

  return (
    <VictoryScreen
      totalLevels={levels.length}
      onRestart={handleRestart}
    />
  );
};

export default Index;
