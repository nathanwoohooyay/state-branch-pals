export interface NFATransition {
  [symbol: string]: string[]; // symbol -> array of target states
}

export interface NFA {
  states: string[];
  alphabet: string[];
  transitions: { [state: string]: NFATransition };
  startState: string;
  acceptStates: string[];
}

export interface NFANodePosition {
  id: string;
  x: number;
  y: number;
}

export type ChallengeType = 'multiple-choice' | 'select-all';

export interface Level {
  id: number;
  title: string;
  description: string;
  nfa: NFA;
  nodePositions: NFANodePosition[];
  challengeType: ChallengeType;
  question: string;
  options: string[];
  correctAnswers: number[]; // indices into options
  explanation: string;
  exampleInput: string; // string to demo simulation
}
