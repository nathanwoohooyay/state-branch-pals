import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import NFAGraph from './NFAGraph';
import SimulationViewer from './SimulationViewer';
import { ChevronRight, Zap, Play } from 'lucide-react';

const tutorialNFA = {
  states: ['q0', 'q1'],
  alphabet: ['a', 'b'],
  transitions: {
    q0: { a: ['q0'], b: ['q0', 'q1'] },
    q1: {},
  },
  startState: 'q0',
  acceptStates: ['q1'],
};

const tutorialPositions = [
  { id: 'q0', x: 150, y: 150 },
  { id: 'q1', x: 380, y: 150 },
];

const tutorialSteps = [
  {
    title: 'What is an NFA?',
    content: 'A Nondeterministic Finite Automaton (NFA) is a machine that reads a string of symbols and decides whether to accept or reject it.',
    highlight: 'It has states, transitions, a start state, and accept states.',
  },
  {
    title: 'States & Transitions',
    content: 'Each circle is a state. Arrows show transitions — when the machine reads a symbol, it follows the matching arrow.',
    highlight: 'The double circle marks an accept state.',
  },
  {
    title: 'Nondeterminism',
    content: 'The key difference from a DFA: an NFA can follow MULTIPLE transitions at once! When reading "b" from q0, it goes to BOTH q0 and q1 simultaneously.',
    highlight: 'Think of it as exploring all possible paths at the same time.',
  },
  {
    title: 'Acceptance',
    content: 'A string is accepted if ANY path through the machine ends in an accept state. Even if most paths fail, one success is enough!',
    highlight: 'Let\'s see it in action...',
  },
];

interface TutorialScreenProps {
  onStart: () => void;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({ onStart }) => {
  const [step, setStep] = useState(0);
  const [showSim, setShowSim] = useState(false);

  const isLastStep = step === tutorialSteps.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary mb-4">
            <Zap className="w-6 h-6" />
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Tutorial</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            {tutorialSteps[step].title}
          </h2>
        </div>

        <div className="game-card animate-slide-up">
          <NFAGraph nfa={tutorialNFA} positions={tutorialPositions} />
        </div>

        <div className="game-card space-y-3 animate-slide-up">
          <p className="text-foreground leading-relaxed">
            {tutorialSteps[step].content}
          </p>
          <p className="text-primary font-medium text-sm">
            {tutorialSteps[step].highlight}
          </p>
        </div>

        {isLastStep && !showSim && (
          <div className="flex justify-center animate-fade-in">
            <Button onClick={() => setShowSim(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="w-4 h-4" /> Run Example
            </Button>
          </div>
        )}

        {showSim && (
          <div className="game-card animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Processing "aab"</h3>
            <SimulationViewer
              nfa={tutorialNFA}
              positions={tutorialPositions}
              input="aab"
              autoPlay
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {tutorialSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/40' : 'w-4 bg-border'
                }`}
              />
            ))}
          </div>

          {!isLastStep ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              variant="outline"
              className="gap-2 border-border"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={onStart}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
            >
              Start Game <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Need this import for the Play icon used above
import { Play } from 'lucide-react';

export default TutorialScreen;
