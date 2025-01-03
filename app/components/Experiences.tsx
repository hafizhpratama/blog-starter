"use client";

import { useRef, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Experience } from "../types";

const ExperienceCard = memo(({ exp }: { exp: Experience }) => (
  <div className="w-[280px] flex-shrink-0 snap-center sm:w-[340px]">
    <div
      className="h-full rounded-xl border border-neutral-200 bg-card
                p-6 transition-colors hover:border-neutral-300 dark:border-gray-700 
                dark:bg-gray-800 dark:hover:border-gray-600"
    >
      <div className="flex h-full flex-col">
        <div className="mb-4">
          <span className="text-4xl">{exp.emoji}</span>
        </div>
        <div className="flex-grow">
          <h3 className="mb-1 text-lg font-semibold">{exp.company}</h3>
          <p className="mb-1 text-sm font-medium">{exp.position}</p>
          <p className="mb-4 text-sm text-muted-foreground">{exp.period}</p>
          <p className="mb-6 text-sm text-muted-foreground">
            {exp.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {exp.technologies.map((tech: string, idx: number) => (
            <span
              key={idx}
              className="transform rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground transition-all hover:scale-105"
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
    <div className="mb-16 mt-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl italic sm:text-3xl">
            Work Experience
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="rounded-full p-2 transition-colors hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="rounded-full p-2 transition-colors hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 focus:outline-none"
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
