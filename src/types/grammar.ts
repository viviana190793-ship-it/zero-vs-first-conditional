/**
 * Type definitions for Grammar Quest: Zero vs. First Conditional
 */

export type ConditionalType = 'zero' | 'first';

export type GameScreen = 
  | 'welcome' 
  | 'learn' 
  | 'game1' 
  | 'game2' 
  | 'game3' 
  | 'classroom_view' 
  | 'certificate';

export interface UserProgress {
  playerName: string;
  knowledgeCheckCompleted: boolean;
  game1Completed: boolean;
  game2Completed: boolean;
  game3Completed: boolean;
  game1Stars: number;
  game2Stars: number;
  game3Stars: number;
  totalScore: number;
  unlockedItems: string[];
}

export type EducationalTheme = 'classroom_rules' | 'study_habits' | 'future_teaching';

export interface EducationalThemeInfo {
  id: EducationalTheme;
  title: string;
  spanishTitle: string;
  description: string;
  conditionalFocus: string;
  image: string;
  icon: string;
  examples: {
    sentence: string;
    type: 'zero' | 'first';
    explanation: string;
  }[];
}

export interface MatchPair {
  id: string;
  sentence: string;
  category: ConditionalType;
  categoryLabel: string;
  theme?: EducationalTheme;
  themeLabel?: string;
  explanation: string;
}

export interface SortItem {
  id: string;
  sentence: string;
  correctCategory: ConditionalType;
  context: string;
  theme?: EducationalTheme;
  explanation: string;
}

export interface TrueFalseQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  theme?: EducationalTheme;
  explanation: string;
}

export interface FillBlankQuestion {
  id: string;
  sentenceParts: [string, string]; // e.g. ["If students", "regularly, they improve their skills."]
  options: string[];
  correctAnswer: string;
  conditionalType: ConditionalType;
  theme?: EducationalTheme;
  themeLabel?: string;
  explanation: string;
  hint: string;
}

export interface ErrorCorrectionQuestion {
  id: string;
  originalSentence: string;
  errorPart: string;
  options: string[];
  correctOption: string;
  correctedSentence: string;
  theme?: EducationalTheme;
  themeLabel?: string;
  explanation: string;
  hint: string;
}

export interface EscapeRiddle {
  id: string;
  prompt: string;
  clue: string;
  theme?: EducationalTheme;
  themeLabel?: string;
  options: {
    codeDigit: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface SentenceBuilderChallenge {
  id: string;
  conditionalType: ConditionalType;
  targetSentence: string;
  scrambledWords: string[];
  explanation: string;
  hasComma: boolean;
  teachingTip: string;
}

export interface ClassroomDilemma {
  id: string;
  title: string;
  situation: string;
  options: {
    text: string;
    conditionalType: ConditionalType;
    isBestChoice: boolean;
    feedback: string;
  }[];
  unlockedItem: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
}

export interface ClassroomItem {
  id: string;
  name: string;
  category: string;
  description: string;
  teacherNote: string;
  icon: string;
  position: {
    top: string;
    left: string;
  };
}
