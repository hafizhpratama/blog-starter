import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Mail, Twitter, Linkedin, Github, LucideIcon } from 'lucide-react';
import { EXPERIENCES, SKILLS, SOCIAL_LINKS } from './constants';

// Lazy load the ExperienceSection component
const ExperienceSection = dynamic(() => import('./components/Experiences'), {
  loading: () => <div className="animate-pulse h-96 bg-accent rounded-lg" />,
  ssr: false
});

// Optimize social links rendering
const SocialLink = ({ Icon, href, name }: { Icon: LucideIcon; href: string; name: string }) => (
  <a
    href={href}
    aria-label={name}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-full hover:bg-accent transition-colors"
  >
    <Icon className="w-6 h-6" />
  </a>
);

// Optimize skill badge rendering
const SkillBadge = ({ name }: { name: string }) => (
  <span className="px-4 py-2 rounded-full text-sm transition-all hover:scale-105 transform bg-accent text-accent-foreground">
    {name}
  </span>
);

export default function AboutPage() {
  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-12">
            <div role="img" aria-label="developer emoji" className="text-7xl sm:text-8xl mb-8">
              🧑🏻‍💻
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif italic mb-8">
              Hello, I&apos;m Hafizh Pratama
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto text-muted-foreground">
              Building efficient solutions with precision and purpose, driven by a passion for innovation and engineering excellence.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-6 mb-12">
              <SocialLink Icon={Twitter} href={SOCIAL_LINKS.twitter} name="twitter" />
              <SocialLink Icon={Linkedin} href={SOCIAL_LINKS.linkedin} name="linkedin" />
              <SocialLink Icon={Mail} href={SOCIAL_LINKS.email} name="email" />
              <SocialLink Icon={Github} href={SOCIAL_LINKS.github} name="github" />
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif italic mb-8">
              Skills & Technologies
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {SKILLS.map((skill, index) => (
                <SkillBadge key={index} name={skill.name} />
              ))}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <Suspense fallback={<div className="animate-pulse h-96 bg-accent rounded-lg" />}>
          <ExperienceSection experiences={EXPERIENCES} />
        </Suspense>
      </div>
    </main>
  );
}