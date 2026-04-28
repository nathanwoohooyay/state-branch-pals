import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import NFAGraph from './NFAGraph';
import SimulationViewer from './SimulationViewer';
import { ChevronRight, ChevronLeft, Play, BookOpen } from 'lucide-react';

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
    content: 'A Nondeterministic Finite Automaton (NFA) is a theoretical model of computation - a machine that reads a string of symbols and decides whether to accept or reject it.',
    highlight: 'It is one of the foundational models in the Theory of Computation.',
    showGraph: false,
  },
  {
    title: 'Formal Definition',
    content: 'An NFA is defined as a 5-tuple: M = (Q, Σ, δ, q₀, F) where:',
    highlight: 'Q = finite set of states, Σ = input alphabet, δ = transition function (Q × Σ → P(Q)), q₀ = start state, F ⊆ Q = set of accept states.',
    details: [
      { label: 'Q (States)', value: 'A finite set of states the machine can be in' },
      { label: 'Σ (Alphabet)', value: 'The set of input symbols (e.g., {a, b} or {0, 1})' },
      { label: 'δ (Transitions)', value: 'Maps (state, symbol) → set of states (can be empty!)' },
      { label: 'q₀ (Start)', value: 'The initial state where computation begins' },
      { label: 'F (Accept)', value: 'States where the machine accepts the input' },
    ],
    showGraph: false,
  },
  {
    title: 'NFA vs DFA',
    content: 'A DFA (Deterministic FA) has exactly one transition per symbol per state. An NFA can have zero, one, or multiple transitions - this is nondeterminism.',
    highlight: 'Key insight: NFAs and DFAs recognize exactly the same class of languages (regular languages), but NFAs can be exponentially more compact.',
    showGraph: false,
  },
  {
    title: 'States & Transitions',
    content: 'Each circle is a state. Arrows show transitions - when the machine reads a symbol, it follows the matching arrow(s). The double circle marks an accept state.',
    highlight: 'In this NFA: Q = {q0, q1}, Σ = {a, b}, q₀ = q0, F = {q1}.',
    showGraph: true,
  },
  {
    title: 'Nondeterminism',
    content: 'The key feature: an NFA can follow MULTIPLE transitions at once! When reading "b" from q0, it goes to BOTH q0 and q1 simultaneously. Think of it as exploring all possible paths at the same time.',
    highlight: 'δ(q0, b) = {q0, q1} - two states at once!',
    showGraph: true,
  },
  {
    title: 'Acceptance Condition',
    content: 'A string w is accepted if there EXISTS at least one sequence of transitions from q₀ on w that ends in a state in F. Even if most paths fail, one successful path is enough!',
    highlight: 'Formally: w ∈ L(M) iff ∃ a computation path ending in F.',
    showGraph: true,
  },
  {
    title: 'ε-Transitions',
    content: 'NFAs can also have ε-transitions (epsilon transitions) - transitions that occur WITHOUT reading any input symbol. The machine can "jump" between states for free.',
    highlight: 'ε-closure(q) = the set of all states reachable from q via ε-transitions alone.',
    showGraph: false,
  },
  {
    title: 'Key Theorems',
    content: 'Important results you\'ll explore in the puzzles:',
    highlight: 'Every NFA has an equivalent DFA (subset construction). Regular languages are closed under union, concatenation, and Kleene star - all provable via NFA constructions.',
    details: [
      { label: 'Subset Construction', value: 'Convert NFA → DFA by tracking sets of states' },
      { label: 'Union (L₁ ∪ L₂)', value: 'New start state with ε-transitions to both NFAs' },
      { label: 'Concatenation (L₁·L₂)', value: 'ε-transitions from accept states of L₁ to start of L₂' },
      { label: 'Kleene Star (L*)', value: 'ε from accept states back to start; start state accepts ε' },
    ],
    showGraph: false,
  },
  {
    title: 'Let\'s See It In Action',
    content: 'Watch how the NFA processes the string "aab". Notice how after reading "b", the machine is in BOTH q0 and q1 - that\'s nondeterminism at work.',
    highlight: 'Ready to try the puzzles?',
    showGraph: true,
    showSim: true,
  },
];

interface TutorialScreenProps {
  onStart: () => void;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({ onStart }) => {
  const [step, setStep] = useState(0);
  const [showSim, setShowSim] = useState(false);

  const current = tutorialSteps[step];
  const isLastStep = step === tutorialSteps.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary mb-4">
            <BookOpen className="w-6 h-6" />
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Tutorial</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            {current.title}
          </h2>
        </div>

        {current.showGraph && (
          <div className="game-card animate-slide-up">
            <NFAGraph nfa={tutorialNFA} positions={tutorialPositions} />
          </div>
        )}

        <div className="game-card space-y-3 animate-slide-up" key={step}>
          <p className="text-foreground leading-relaxed">
            {current.content}
          </p>

          {current.details && (
            <div className="space-y-2 mt-3">
              {current.details.map((d, i) => (
                <div key={i} className="flex gap-3 items-start text-sm">
                  <span className="font-mono text-primary font-semibold whitespace-nowrap min-w-[140px]">{d.label}</span>
                  <span className="text-muted-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-primary font-medium text-sm mt-2">
            {current.highlight}
          </p>
        </div>

        {isLastStep && !showSim && current.showSim && (
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

          <div className="flex gap-2">
            {step > 0 && (
              <Button
                onClick={() => { setStep(s => s - 1); setShowSim(false); }}
                variant="outline"
                className="gap-2 border-border"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            )}
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
    </div>
  );
};

export default TutorialScreen;
