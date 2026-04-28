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
  const handlePrevLevel = () => {
    if (currentLevel <= 0) {
      setPhase('title');
    } else {
      setCurrentLevel(l => l - 1);
    }
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
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-10 animate-fade-in">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Zap className="w-4 h-4" strokeWidth={2.5} />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                CS / Theory of Computation
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold text-foreground leading-[1.05] tracking-tight">
              Decode the<br />Automaton.
            </h1>
            <div className="rule-line" />
            <p className="text-muted-foreground text-base leading-relaxed max-w-md">
              An interactive primer on Nondeterministic Finite Automata. Read the formalism, then trace strings through state machines until the intuition clicks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleStartTutorial}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6"
            >
              Start the primer
            </Button>
            <Button
              onClick={handleStartGame}
              variant="outline"
              size="lg"
              className="border-border text-foreground rounded-none px-6"
            >
              Skip to puzzles
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground font-mono tracking-wider">
            {String(levels.length).padStart(2, '0')} LEVELS  ·  INTERACTIVE SIMULATIONS  ·  NO PREREQUISITES
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
        onBack={handlePrevLevel}
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
