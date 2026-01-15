import React, { useState, useEffect } from 'react';
import type { JobStatus } from '../types/api.types';

interface TypingIndicatorProps {
  status?: JobStatus | null;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ status }) => {
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { icon: '📨', text: 'Request queued', color: 'from-blue-500 to-blue-600', status: 'queued' },
    { icon: '🤔', text: 'Understanding user intent', color: 'from-purple-500 to-purple-600', status: 'processing' },
    { icon: '🔍', text: 'Discovering components', color: 'from-indigo-500 to-indigo-600', status: 'processing' },
    { icon: '🎨', text: 'Designing layout', color: 'from-pink-500 to-pink-600', status: 'processing' },
    { icon: '⚙️', text: 'Configuring properties', color: 'from-orange-500 to-orange-600', status: 'processing' },
    { icon: '✨', text: 'Applying styles', color: 'from-cyan-500 to-cyan-600', status: 'processing' },
    { icon: '🔧', text: 'Optimizing structure', color: 'from-green-500 to-green-600', status: 'processing' },
    { icon: '🚀', text: 'Finalizing component', color: 'from-violet-500 to-violet-600', status: 'processing' },
  ];

  useEffect(() => {
    if (status === 'queued') {
      // Keep at stage 0 (Request queued) when in queue
      setCurrentStage(0);
      return;
    }

    if (status === 'processing') {
      // Start at stage 2 (Discovering components) and cycle through processing stages
      setCurrentStage(2);

      // Rotate through processing stages only (stages 2-7)
      const interval = setInterval(() => {
        setCurrentStage((prev) => {
          // Cycle from stage 2 to 7, then back to 2
          if (prev >= 7) return 2;
          return prev + 1;
        });
      }, 1200); // Faster rotation for smoother experience

      return () => clearInterval(interval);
    }
  }, [status]);

  const stage = stages[currentStage];

  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${stage.color} flex items-center justify-center animate-pulse shadow-lg`}>
        <span className="text-sm">{stage.icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium animate-fade-in">
          {stage.text}
        </span>
        <div className="flex gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-bounce-dot"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce-dot"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 animate-bounce-dot"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
