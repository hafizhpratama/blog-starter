import { Project, Skill } from '../types';

export const PROJECTS: Project[] = [
  {
    title: 'Project One',
    description: 'A brief description of your first project and its impact.',
    tags: ['React', 'Node.js', 'MongoDB'],
    link: '#',
    sourceCode: '#',
    emoji: '🚀',
  },
  {
    title: 'Project Two',
    description:
      'Description of your second project, highlighting key features.',
    tags: ['TypeScript', 'Next.js', 'Tailwind'],
    link: '#',
    sourceCode: '#',
    emoji: '⚡',
  },
];

export const SKILLS: Skill[] = [
  { name: 'JavaScript', category: 'frontend' },
  { name: 'React', category: 'frontend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Python', category: 'backend' },
  { name: 'Docker', category: 'devops' },
  { name: 'AWS', category: 'devops' },
  { name: 'GraphQL', category: 'backend' },
];

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  email: 'mailto:your@email.com',
};
