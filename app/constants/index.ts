
import { Experience, Game, Project, Skill } from '../types';

export const PROJECTS: Project[] = [
  {
    title: 'IntentJS',
    description: 'It is like Laravel, But for NodeJS.  A refreshing take on traditional nodejs frameworks, change the way you build your products. Intent is an open-source framework with focus on productivity and developer experience.',
    tags: ['IntentJS'],
    link: 'https://tryintent.com/docs/installation',
    sourceCode: '',
    emoji: '💻',
  },
  {
    title: 'Jobseeker HRMS & HRIS',
    description: 'Seamlessly handles recruitment, candidate management, attendance tracking, employee administration, and payroll processing.',
    tags: ['React', 'Next.js', 'Tailwind'],
    link: 'https://testing.hrms-jobseeker.software/',
    sourceCode: '',
    emoji: '💼',
  },
  {
    title: 'Swift Commerce',
    description:
      'eCommerce boilerplate project built on top of Magento, tailored to meet the common requirements of businesses in Southeast Asia.',
    tags: ['PHP', 'Magento', 'MySQL', 'GraphQL'],
    link: 'https://www.getswift.asia/',
    sourceCode: '',
    emoji: '🛍️',
  },
  {
    title: 'Swift PWA',
    description:
      'Swift PWA is a cutting-edge Progressive Web Application (PWA) boilerplate designed to build high-performance eCommerce storefronts. It is built from the ground up using Next.js and connects seamlessly to Magento as the backend via GraphQL APIs.',
    tags: ['PHP', 'Magento', 'MySQL', 'GraphQL', 'Tailwind', 'PWA'],
    link: 'https://pwa.getswift.asia/',
    sourceCode: '',
    emoji: '🛍️',
  },
  {
    title: 'Next.js Boilerplate',
    description:
      'Explore a world of possibilities with BlackPepper. From beautifully crafted dashboards to seamless authentication, our platform offers a wealth of examples to ignite your creativity and guide your journey towards building exceptional applications.',
    tags: ['Next.js', 'Shadcn UI', 'Tailwind'],
    link: 'https://blackpepper-app.vercel.app/',
    sourceCode: '',
    emoji: '💻',
  },
  {
    title: 'Finsavvy',
    description:
      'Discover the power of financial mastery with FinSavvy – the ultimate companion for conquering your financial goals. Streamline your finances, gain valuable insights, and take control of your money like never before.',
    tags: ['React.js', 'Shadcn UI', 'Tailwind', 'Supabase', 'PWA'],
    link: 'https://finsavvy-tool.vercel.app/',
    sourceCode: '',
    emoji: '💸',
  },
];

export const SKILLS: Skill[] = [
  { name: 'JavaScript', category: 'frontend' },
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend'},
  { name: 'Node.js', category: 'backend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'PHP', category: 'backend' },
  { name: 'Laravel', category: 'backend'},
  { name: 'Go', category: 'backend' },
  { name: 'Docker', category: 'devops' },
  { name: 'AWS', category: 'devops' },
  { name: 'MySQL', category: 'other'},
  { name: 'MongoDB', category: 'other'},
  { name: 'GraphQL', category: 'backend' },
  { name: 'PWA', category: 'frontend'}
];

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/hfzhpratama',
  linkedin: 'https://linkedin.com/in/hafizhpratama',
  email: 'mailto:hafizhpratama99@email.com',
  github: 'https://github.com/hafizhpratama',
};

export const GAMES: Game[] = [
  {
    title: 'Rock, Paper, Scissors',
    description: 'The familiar game of Rock, Paper, Scissors is played like this: at the same time, two players display one of three symbols: a rock, paper, or scissors. A rock beats scissors, scissors beat paper by cutting it, and paper beats rock by covering it.',
    tags: ['Next.js'],
    link: 'games/rock-paper-scissors',
    sourceCode: '',
    emoji: '✊🏻✋🏻✌🏻',
  },
  {
    title: 'Slot Machine',
    description: 'A slot machine, fruit machine (British English), poker machine or pokies is a gambling machine that creates a game of chance for its customers.',
    tags: ['Next.js'],
    link: 'games/slot-machine',
    sourceCode: '',
    emoji: '🎰',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    company: "Jobseeker Company",
    position: "Software Engineer",
    period: "Mar 2024 - Present",
    description: "",
    technologies: ["React", "Next.js", "TypeScript", "AWS"],
    emoji: "💼",
  },
  {
    company: "Surplus Indonesia",
    position: "Software Engineer",
    period: "Mar 2023 - Mar 2024",
    description: "Driving innovation at Surplus Indonesia as a software engineer, building solutions that cut costs and scale impact!",
    technologies: ["Laravel","Node.js", "Express", "MySQL", "Docker", "AWS"],
    emoji: "🌱"
  },
  {
    company: "SIRCLO",
    position: "Associate Software Engineer",
    period: "Mar 2021 - Mar 2023",
    description: "Led a team at Sirclo, streamlining dev, delivering core solutions, and launching a multi-seller feature!",
    technologies: ["PHP", "Magento", "MySQL", "GraphQL", "AWS", "Laravel"],
    emoji: "🛍️"
  },
  {
    company: "Hukumonline.com",
    position: "Software Engineer Internship",
    period: "Oct 2020 - Jan 2021",
    description: "At Hukumonline, I drove digital transformation, launching key sites and innovating CMS with API integration!",
    technologies: ["PHP", "MySQL", "WordPress"],
    emoji: "⚖️"
  }
] as const;
