'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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
    company: "Jobseeker Company",
    position: "Software Engineer",
    period: "Mar 2024 - Present",
    description: "",
    technologies: ["React", "Next.js", "TypeScript", "AWS"],
    logo: "/logo_jobseeker.png"
  },
  {
    company: "Surplus Indonesia",
    position: "Software Engineer",
    period: "Mar 2023 - Mar 2024",
    description: "Driving innovation at Surplus Indonesia as a software engineer, building solutions that cut costs and scale impact!",
    technologies: ["Laravel","Node.js", "Express", "MySQL", "Docker", "AWS"],
    logo: "/logo_surplus.jpg"
  },
  {
    company: "SIRCLO",
    position: "Associate Software Engineer",
    period: "Mar 2021 - Mar 2023",
    description: "Led a team at Sirclo, streamlining dev, delivering core solutions, and launching a multi-seller feature!",
    technologies: ["PHP", "Magento", "MySQL", "GraphQL", "AWS", "Laravel"],
    logo: "/logo_sirclo.png"
  },
  {
    company: "Hukumonline.com",
    position: "Software Engineer Internship",
    period: "Oct 2020 - Jan 2021",
    description: "At Hukumonline, I drove digital transformation, launching key sites and innovating CMS with API integration!",
    technologies: ["PHP", "MySQL", "WordPress"],
    logo: "/logo_ho.png"
  }
];

export default function ExperienceSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mt-24 mb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif italic">
            Work Experience
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll('left')}
              className="flex items-center justify-center w-8 h-8 rounded-full
                bg-background border border-neutral-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600
                hover:bg-accent transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex items-center justify-center w-8 h-8 rounded-full
                bg-background border border-neutral-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600
                hover:bg-accent transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory
            scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800
            scrollbar-track-transparent"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[280px] sm:w-[340px] snap-center"
            >
              <div className="h-full bg-card rounded-xl border border-neutral-200
                dark:bg-gray-800 dark:border-gray-700 p-6 hover:border-neutral-300 
                dark:hover:border-gray-600 transition-colors">
                <div className="flex flex-col h-full">
                  <div className="mb-4 h-12 flex">
                    <Image
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      width={64}
                      height={64}
                      className="object-contain" 
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-1">{exp.company}</h3>
                    <p className="font-medium text-sm mb-1">{exp.position}</p>
                    <p className="text-sm text-muted-foreground mb-4">{exp.period}</p>
                    
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