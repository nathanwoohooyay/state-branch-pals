import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface VictoryScreenProps {
  totalLevels: number;
  onRestart: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ totalLevels, onRestart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-8 animate-fade-in">
        <div className="space-y-3">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
            End of sequence
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
            Automaton decoded.
          </h1>
          <div className="rule-line" />
          <p className="text-muted-foreground leading-relaxed">
            You worked through all {totalLevels} levels. The mental model for tracking sets of active states under nondeterministic branching is yours.
          </p>
        </div>

        <div className="game-card space-y-3">
          <h3 className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
            Takeaways
          </h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-3"><span className="font-mono text-primary">01</span> An NFA can occupy multiple states at once.</li>
            <li className="flex gap-3"><span className="font-mono text-primary">02</span> A string is accepted if any path lands in F.</li>
            <li className="flex gap-3"><span className="font-mono text-primary">03</span> ε-transitions move between states without input.</li>
            <li className="flex gap-3"><span className="font-mono text-primary">04</span> Nondeterminism yields compact recognizers.</li>
          </ul>
        </div>

        <Button
          onClick={onRestart}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"
          size="lg"
        >
          <RotateCcw className="w-4 h-4" /> Run again
        </Button>
      </div>
    </div>
  );
};

export default VictoryScreen;
