import React, { useState, useEffect, useCallback } from 'react';
import { NFA } from '@/lib/nfa-types';
import { simulateNFA, SimulationStep } from '@/lib/nfa-engine';
import NFAGraph from './NFAGraph';
import { NFANodePosition } from '@/lib/nfa-types';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface SimulationViewerProps {
  nfa: NFA;
  positions: NFANodePosition[];
  input: string;
  autoPlay?: boolean;
  onComplete?: () => void;
}

const SimulationViewer: React.FC<SimulationViewerProps> = ({
  nfa, positions, input, autoPlay = false, onComplete,
}) => {
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const s = simulateNFA(nfa, input);
    setSteps(s);
    setCurrentStep(0);
    setPlaying(autoPlay);
  }, [nfa, input, autoPlay]);

  useEffect(() => {
    if (!playing || currentStep >= steps.length - 1) {
      if (playing && currentStep >= steps.length - 1) {
        setPlaying(false);
        onComplete?.();
      }
      return;
    }
    const timer = setTimeout(() => setCurrentStep(s => s + 1), 900);
    return () => clearTimeout(timer);
  }, [playing, currentStep, steps.length, onComplete]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setPlaying(false);
  }, []);

  const step = steps[currentStep];
  const isAccepted = step && nfa.acceptStates.some(s => step.activeStates.has(s));
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="space-y-4">
      <NFAGraph
        nfa={nfa}
        positions={positions}
        activeStates={step?.activeStates}
      />
      
      {/* Input display */}
      <div className="flex items-center justify-center gap-1 font-mono text-lg">
        <span className="text-muted-foreground mr-2">Input:</span>
        {input.split('').map((char, i) => (
          <span
            key={i}
            className={`w-8 h-8 flex items-center justify-center rounded border transition-all duration-200 ${
              i < currentStep
                ? 'bg-primary/20 border-primary text-primary'
                : i === currentStep && currentStep > 0
                ? 'bg-primary/30 border-primary text-primary scale-110 font-bold'
                : 'border-border text-muted-foreground'
            }`}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Active states */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Active states: </span>
        <span className="font-mono text-primary">
          {step ? `{${[...step.activeStates].join(', ')}}` : '{}'}
        </span>
        {step?.activeStates.size === 0 && (
          <span className="text-destructive ml-2">(dead: no active states)</span>
        )}
      </div>

      {/* Result */}
      {isLastStep && steps.length > 0 && (
        <div className={`text-center font-semibold animate-fade-in ${isAccepted ? 'text-success' : 'text-destructive'}`}>
          {isAccepted ? '✓ String Accepted!' : '✗ String Rejected'}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={reset}
          className="border-border"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPlaying(!playing)}
          disabled={isLastStep}
          className="border-border"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentStep(s => Math.min(s + 1, steps.length - 1))}
          disabled={isLastStep}
          className="border-border"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
        <span className="text-xs text-muted-foreground ml-2">
          Step {currentStep}/{steps.length - 1}
        </span>
      </div>
    </div>
  );
};

export default SimulationViewer;
