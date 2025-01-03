import { ExternalLink, Link2 } from "lucide-react";
import { PROJECTS } from "../constants";
import { defaultMetadata } from "../metadata";

export const metadata = defaultMetadata;

export default function ProjectsPage() {
  return (
    <main className="px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center font-serif text-3xl italic sm:text-4xl">
          Projects
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              className="transform rounded-xl border border-neutral-200 bg-white
                p-6 shadow-sm transition-all hover:scale-105 hover:border-gray-200
                hover:shadow-md dark:border-gray-700 
                dark:bg-gray-800 dark:hover:border-gray-600"
            >
              <div className="mb-4 text-4xl">{project.emoji}</div>
              <h3 className="mb-3 text-xl font-semibold">{project.title}</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                {project.description}
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="rounded-full bg-gray-100 px-3 py-1
                      text-sm text-gray-700 
                      dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex space-x-6">
                {project.sourceCode && (
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center transition-colors hover:text-blue-500"
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    <span className="text-sm">Source</span>
                  </a>
                )}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center transition-colors hover:text-blue-500"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span className="text-sm">Demo</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
