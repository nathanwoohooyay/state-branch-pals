import React, { useState, useMemo, useEffect } from 'react';
import { Level } from '@/lib/nfa-types';
import NFAGraph from './NFAGraph';
import SimulationViewer from './SimulationViewer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, Eye } from 'lucide-react';

interface LevelScreenProps {
  level: Level;
  onNext: () => void;
  onBack: () => void;
  isLast: boolean;
  levelIndex: number;
  totalLevels: number;
}

const LevelScreen: React.FC<LevelScreenProps> = ({
  level, onNext, onBack, isLast, levelIndex, totalLevels,
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showSim, setShowSim] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Shuffled order: array of original indices in display order
  const order = useMemo(() => {
    const arr = level.options.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id, shuffleSeed]);

  // Reset state when level changes
  useEffect(() => {
    setSelected([]);
    setSubmitted(false);
    setShowSim(false);
  }, [level.id]);

  const isCorrect = useMemo(() => {
    if (!submitted) return false;
    const sortedSel = [...selected].sort();
    const sortedCorr = [...level.correctAnswers].sort();
    return sortedSel.length === sortedCorr.length && sortedSel.every((v, i) => v === sortedCorr[i]);
  }, [submitted, selected, level.correctAnswers]);

  const toggleOption = (idx: number) => {
    if (submitted) return;
    if (level.challengeType === 'multiple-choice') {
      setSelected([idx]);
    } else {
      setSelected(prev =>
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
      );
    }
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    setSubmitted(true);
  };

  const handleRetry = () => {
    setSelected([]);
    setSubmitted(false);
    setShowSim(false);
    setShuffleSeed(s => s + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Level {levelIndex + 1} of {totalLevels}
            </p>
            <h2 className="text-2xl font-bold text-foreground mt-1">{level.title}</h2>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalLevels }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === levelIndex ? 'bg-primary scale-125' : i < levelIndex ? 'bg-primary/50' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-muted-foreground text-sm">{level.description}</p>

        {/* NFA Graph */}
        <div className="game-card">
          <NFAGraph nfa={level.nfa} positions={level.nodePositions} />
        </div>

        {/* Question */}
        <div className="game-card space-y-4">
          <h3 className="text-lg font-semibold text-foreground">{level.question}</h3>
          {level.challengeType === 'select-all' && (
            <p className="text-xs text-muted-foreground">Select all that apply</p>
          )}

          <div className="grid gap-2">
            {order.map((i, displayIdx) => {
              const opt = level.options[i];
              const isSelected = selected.includes(i);
              const isCorrectOption = level.correctAnswers.includes(i);
              let optionClass = 'border-border hover:border-primary/50';
              
              if (submitted) {
                if (isCorrectOption) optionClass = 'border-success bg-success/10';
                else if (isSelected && !isCorrectOption) optionClass = 'border-destructive bg-destructive/10';
              } else if (isSelected) {
                optionClass = 'border-primary bg-primary/10';
              }

              return (
                <button
                  key={i}
                  onClick={() => toggleOption(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 font-mono text-sm ${optionClass}`}
                  disabled={submitted}
                >
                  <span className="text-muted-foreground mr-3">{String.fromCharCode(65 + displayIdx)}.</span>
                  <span className="text-foreground">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {submitted && (
          <div className={`game-card animate-slide-up ${isCorrect ? 'border-success/30' : 'border-destructive/30'}`}>
            <div className="flex items-center gap-3 mb-3">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm font-mono uppercase tracking-[0.2em] text-success">Accepted</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span className="text-sm font-mono uppercase tracking-[0.2em] text-destructive">Rejected</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{level.explanation}</p>
            
            {!showSim && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSim(true)}
                className="mt-4 gap-2 border-border"
              >
                <Eye className="w-4 h-4" /> Watch Simulation
              </Button>
            )}
          </div>
        )}

        {/* Simulation */}
        {showSim && (
          <div className="game-card animate-fade-in">
            <h3 className="text-sm font-mono text-muted-foreground mb-4">
              Simulating "{level.exampleInput}"
            </h3>
            <SimulationViewer
              nfa={level.nfa}
              positions={level.nodePositions}
              input={level.exampleInput}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" /> {levelIndex === 0 ? 'Home' : 'Previous Level'}
          </Button>
          <div className="flex gap-3">
          {submitted && !isCorrect && (
            <Button variant="outline" onClick={handleRetry} className="border-border">
              Try Again
            </Button>
          )}
          {!submitted && (
            <Button
              onClick={handleSubmit}
              disabled={selected.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"
            >
              Submit
            </Button>
          )}
          {submitted && isCorrect && (
            <Button
              onClick={onNext}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-none"
            >
              {isLast ? 'Finish' : 'Next level'} <ChevronRight className="w-4 h-4" />
            </Button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelScreen;
