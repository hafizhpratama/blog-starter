import { Mail, Twitter, Linkedin, Github } from 'lucide-react';
import { SKILLS, SOCIAL_LINKS } from './constants';
import ExperienceSection from './components/Experiences';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hafizh Pratama | Software Engineer',
  description: 'Welcome to the portfolio of Hafizh Pratama, a software engineer specializing in web development and modern technologies.',
};

export default function AboutPage() {
  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-12">
            <div className="text-7xl sm:text-8xl mb-8">🧑🏻‍💻</div>
            <h1 className="text-4xl sm:text-5xl font-serif italic mb-8">
              Hello, I&apos;m Hafizh Pratama
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto text-muted-foreground">
              Building efficient solutions with precision and purpose, driven by a passion for innovation and engineering excellence.
            </p>
            <div className="flex justify-center space-x-6 mb-12">
              {[
                { Icon: Twitter, href: SOCIAL_LINKS.twitter, name: "twitter" },
                { Icon: Linkedin, href: SOCIAL_LINKS.linkedin, name: "linkedin" },
                { Icon: Mail, href: SOCIAL_LINKS.email, name: "email" },
                { Icon: Github, href: SOCIAL_LINKS.github, name: "github"}
              ].map(({ Icon, href, name }, index) => (
                <a
                  key={index}
                  href={href}
                  aria-label={name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full hover:bg-accent transition-colors"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif italic mb-8">
              Skills & Technologies
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {SKILLS.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm transition-all hover:scale-105 transform
                    bg-accent text-accent-foreground"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <ExperienceSection />
      </div>
    </main>
  );
}
