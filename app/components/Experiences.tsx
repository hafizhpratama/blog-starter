'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
  technologies: string[];
  logo: string;
}

const experiences: Experience[] = [
  {
    company: 'Company One',
    position: 'Senior Frontend Developer',
    period: '2022 - Present',
    description:
      'Led the development of multiple web applications using React and Next.js. Implemented modern UI/UX designs and improved application performance.',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    logo: '👨‍💻',
  },
  {
    company: 'Company Two',
    position: 'Full Stack Developer',
    period: '2020 - 2022',
    description:
      'Developed and maintained full-stack applications. Worked with microservices architecture and implemented CI/CD pipelines.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'Docker'],
    logo: '⚡',
  },
  {
    company: 'Company Three',
    position: 'Software Engineer',
    period: '2018 - 2020',
    description:
      'Built scalable backend services and REST APIs. Collaborated with cross-functional teams to deliver high-quality software solutions.',
    technologies: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    logo: '🚀',
  },
];

export default function ExperienceSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Width of card + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mt-24 mb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif italic">
            Work Experience
          </h2>

          {/* Navigation buttons in top right */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full
                bg-background border border-neutral-200 dark:border-neutral-800
                hover:bg-accent transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full
                bg-background border border-neutral-200 dark:border-neutral-800
                hover:bg-accent transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory
            scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800
            scrollbar-track-transparent"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {experiences.map((exp, index) => (
            <div key={index} className="flex-shrink-0 w-80 snap-center">
              <div
                className="h-full bg-card rounded-xl border border-neutral-200 
                dark:border-neutral-800 p-6 hover:border-neutral-300 
                dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <span className="text-4xl">{exp.logo}</span>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-serif italic mb-1">
                      {exp.company}
                    </h3>
                    <p className="font-medium text-sm mb-1">{exp.position}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exp.period}
                    </p>

                    <p className="text-sm text-muted-foreground mb-6">
                      {exp.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full
                          bg-accent text-accent-foreground
                          transition-transform hover:scale-105"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
