"use client";

import { useRef, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Experience } from "../types";

const ExperienceCard = memo(({ exp }: { exp: Experience }) => (
  <div className="flex-shrink-0 w-[280px] sm:w-[340px] snap-center">
    <div
      className="h-full bg-card rounded-xl border border-neutral-200
                dark:bg-gray-800 dark:border-gray-700 p-6 hover:border-neutral-300 
                dark:hover:border-gray-600 transition-colors"
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <span className="text-4xl">{exp.emoji}</span>
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
          {exp.technologies.map((tech: string, idx: number) => (
            <span
              key={idx}
              className="px-4 py-2 rounded-full text-sm transition-all hover:scale-105 transform bg-accent text-accent-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
));

ExperienceCard.displayName = "ExperienceCard";

const ExperienceSection = memo(function ExperienceSection({
  experiences,
}: {
  experiences: Experience[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div className="mt-24 mb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif italic">
            Work Experience
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar focus:outline-none"
          tabIndex={0}
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {experiences.map((exp) => (
            <ExperienceCard key={exp.company} exp={exp} />
          ))}
        </div>
      </div>
    </div>
  );
});

export default ExperienceSection;
