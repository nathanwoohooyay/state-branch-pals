import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react';

interface VictoryScreenProps {
  totalLevels: number;
  onRestart: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ totalLevels, onRestart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8 animate-fade-in">
        <div className="relative">
          <Trophy className="w-20 h-20 mx-auto text-warning animate-pulse-glow" />
          <Sparkles className="w-8 h-8 absolute top-0 right-1/3 text-primary animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="w-6 h-6 absolute bottom-0 left-1/3 text-accent animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground glow-text-primary">
            Automaton Decoded!
          </h1>
          <p className="text-muted-foreground text-lg">
            You've mastered all {totalLevels} levels. You now understand how NFAs process strings through nondeterministic branching.
          </p>
        </div>

        <div className="game-card space-y-4">
          <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">What you learned</h3>
          <ul className="space-y-2 text-sm text-foreground text-left">
            <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span> NFAs can be in multiple states simultaneously</li>
            <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span> A string is accepted if ANY path reaches an accept state</li>
            <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span> ε-transitions allow state changes without reading input</li>
            <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span> Nondeterminism enables compact representations of complex languages</li>
          </ul>
        </div>

        <Button
          onClick={onRestart}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
          size="lg"
        >
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    </div>
  );
};

export default VictoryScreen;
