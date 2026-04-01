import { NFA } from './nfa-types';

export interface SimulationStep {
  symbol: string | null; // null for initial step
  activeStates: Set<string>;
}

export function simulateNFA(nfa: NFA, input: string): SimulationStep[] {
  const steps: SimulationStep[] = [];
  let currentStates = new Set<string>([nfa.startState]);
  currentStates = epsilonClosure(nfa, currentStates);
  
  steps.push({ symbol: null, activeStates: new Set(currentStates) });

  for (const symbol of input) {
    const nextStates = new Set<string>();
    for (const state of currentStates) {
      const trans = nfa.transitions[state]?.[symbol];
      if (trans) {
        for (const t of trans) nextStates.add(t);
      }
    }
    currentStates = epsilonClosure(nfa, nextStates);
    steps.push({ symbol, activeStates: new Set(currentStates) });
  }

  return steps;
}

function epsilonClosure(nfa: NFA, states: Set<string>): Set<string> {
  const closure = new Set(states);
  const stack = [...states];
  while (stack.length > 0) {
    const state = stack.pop()!;
    const epsTrans = nfa.transitions[state]?.['ε'];
    if (epsTrans) {
      for (const t of epsTrans) {
        if (!closure.has(t)) {
          closure.add(t);
          stack.push(t);
        }
      }
    }
  }
  return closure;
}

export function isAccepted(nfa: NFA, input: string): boolean {
  const steps = simulateNFA(nfa, input);
  const finalStates = steps[steps.length - 1].activeStates;
  return nfa.acceptStates.some(s => finalStates.has(s));
}
