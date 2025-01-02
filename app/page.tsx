import { Suspense, memo } from 'react';
import dynamic from 'next/dynamic';
import { Mail, Twitter, Linkedin, Github, type LucideIcon } from 'lucide-react';
import { EXPERIENCES, SKILLS, SOCIAL_LINKS } from './constants';

const ExperienceSection = dynamic(
  () => import('./components/Experiences').then(mod => mod.default),
  {
    loading: () => <SkeletonLoader className="h-96" />,
    ssr: true
  }
);

const SocialLink = memo(({ Icon, href, name }: { 
  Icon: LucideIcon; 
  href: string; 
  name: string; 
}) => (
  <a
    href={href}
    aria-label={name}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-full hover:bg-accent transition-colors duration-200"
  >
    <Icon className="w-6 h-6" aria-hidden="true" />
  </a>
));
SocialLink.displayName = 'SocialLink';

const SkillBadge = memo(({ name }: { name: string }) => (
  <span className="px-4 py-2 rounded-full text-sm bg-accent text-accent-foreground hover:scale-105 transform transition-transform duration-200">
    {name}
  </span>
));
SkillBadge.displayName = 'SkillBadge';

const SkeletonLoader = memo(({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-accent rounded-lg ${className}`} />
));
SkeletonLoader.displayName = 'SkeletonLoader';

const HeroSection = memo(() => (
  <div className="mb-12">
    <div 
      role="img" 
      aria-label="developer emoji" 
      className="text-7xl sm:text-8xl mb-8"
    >
      🧑🏻‍💻
    </div>
    <h1 className="text-4xl sm:text-5xl font-serif italic mb-8">
      Hello, I&apos;m Hafizh Pratama
    </h1>
    <p className="text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto text-muted-foreground">
      Building efficient solutions with precision and purpose, driven by a passion 
      for innovation and engineering excellence.
    </p>
    
    <div className="flex justify-center space-x-6 mb-12">
      {[
        { Icon: Twitter, href: SOCIAL_LINKS.twitter, name: 'twitter' },
        { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, name: 'linkedin' },
        { Icon: Mail, href: SOCIAL_LINKS.email, name: 'email' },
        { Icon: Github, href: SOCIAL_LINKS.github, name: 'github' }
      ].map(({ Icon, href, name }) => (
        <SocialLink key={name} Icon={Icon} href={href} name={name} />
      ))}
    </div>
  </div>
));
HeroSection.displayName = 'HeroSection';

const SkillsSection = memo(() => (
  <div>
    <h2 className="text-2xl sm:text-3xl font-serif italic mb-8">
      Skills & Technologies
    </h2>
    <div className="flex flex-wrap justify-center gap-3">
      {SKILLS.map(({ name }, index) => (
        <SkillBadge key={`${name}-${index}`} name={name} />
      ))}
    </div>
  </div>
));
SkillsSection.displayName = 'SkillsSection';


export default function HomePage() {
  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <HeroSection />
          <SkillsSection />
        </div>

        <section aria-label="Work Experience">
          <Suspense fallback={<SkeletonLoader className="h-96" />}>
            <ExperienceSection experiences={EXPERIENCES} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}