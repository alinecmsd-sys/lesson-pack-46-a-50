
export interface VocabularyItem {
  english: string;
  portuguese: string;
}

export interface PhraseItem {
  english: string;
  portuguese: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface Exercise {
  portuguese: string;
  correctAnswer: string;
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  vocabulary: {
    title: string;
    items: VocabularyItem[];
  }[];
  phrases: PhraseItem[];
  explanation?: string;
  dialogue: DialogueLine[];
  exercises: Exercise[];
}

export enum AppTab {
  VOCABULARY = 'vocabulary',
  PHRASES = 'phrases',
  GRAMMAR = 'grammar',
  EXERCISES = 'exercises',
  DIALOGUE = 'dialogue'
}
