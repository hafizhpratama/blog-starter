import { ExternalLink, Link2 } from 'lucide-react';
import { PROJECTS } from '../constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hafizh Pratama | Software Engineer',
  description: 'Explore my portfolio of web development projects, featuring work in React, Next.js, and modern web technologies.',
};

export default function ProjectsPage() {
  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-serif italic mb-12 text-center">
          Projects
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              className="rounded-xl p-6 transition-all hover:scale-105 transform
                bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                hover:border-gray-200 dark:hover:border-gray-600 
                shadow-sm hover:shadow-md"
            >
              <div className="text-4xl mb-4">{project.emoji}</div>
              <h3 className="text-xl font-semibold mb-3">
                {project.title}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 rounded-full text-sm
                      bg-gray-100 dark:bg-gray-700 
                      text-gray-700 dark:text-gray-300"
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
                    className="flex items-center hover:text-blue-500 transition-colors"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    <span className="text-sm">Source</span>
                  </a>
                 )}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-blue-500 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
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
