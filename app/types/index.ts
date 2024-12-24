export type Section = 'about' | 'projects' | 'articles' | 'games';

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  sourceCode: string;
  emoji: string;
}

export interface Game {
  title: string;
  description: string;
  tags: string[];
  link: string;
  sourceCode: string;
  emoji: string;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'other';
}
