'use client';

import { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

// Track if mermaid has been initialized
let mermaidInitialized = false;

export function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const uniqueId = useId().replace(/:/g, '');

  useEffect(() => {
    // Initialize mermaid only once
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      });
      mermaidInitialized = true;
    }

    const renderChart = async () => {
      if (!chart) return;

      try {
        // Generate unique ID for this diagram
        const id = `mermaid-${uniqueId}-${Math.random().toString(36).slice(2, 9)}`;

        // Render the diagram
        const result = await mermaid.render(id, chart);
        setSvg(result.svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError('Failed to render diagram');
      }
    };

    renderChart();
  }, [chart, uniqueId]);

  if (error) {
    return (
      <div className="my-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-1 shadow-lg">
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-200 dark:border-amber-800">
            <span className="text-amber-500">⚠️</span>
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Diagram Error</span>
          </div>
          <pre className="overflow-x-auto text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">{chart}</pre>
        </div>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-1 shadow-lg">
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 animate-pulse"></span>
              <span className="w-3 h-3 rounded-full bg-slate-300 animate-pulse delay-75"></span>
              <span className="w-3 h-3 rounded-full bg-slate-300 animate-pulse delay-150"></span>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 ml-2">Loading...</span>
          </div>
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm">Rendering diagram...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-1 shadow-lg">
      <div className="rounded-xl bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
          </div>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 ml-2">Flowchart</span>
        </div>
        <div
          className="flex justify-center overflow-x-auto [&_svg]:max-w-full [&_.node_rect]:fill-blue-50 [&_.node_rect]:stroke-blue-300 dark:[&_.node_rect]:fill-blue-900/30 dark:[&_.node_rect]:stroke-blue-600 [&_.edgeLabel]:bg-white dark:[&_.edgeLabel]:bg-slate-800 [&_text]:fill-slate-700 dark:[&_text]:fill-slate-200 [&_.flowchart-link]:stroke-slate-400 dark:[&_.flowchart-link]:stroke-slate-500"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}

// Pre component that detects mermaid code blocks
export function MermaidPre({ children, ...props }: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }) {
  // Check if this is a mermaid code block
  const childElement = children as React.ReactElement;

  if (
    childElement?.props?.className === 'language-mermaid' ||
    childElement?.props?.['data-language'] === 'mermaid'
  ) {
    const code = childElement?.props?.children;
    if (typeof code === 'string') {
      return <Mermaid chart={code.trim()} />;
    }
  }

  // Default pre rendering
  return <pre {...props}>{children}</pre>;
}
