import React, { useState } from 'react';

interface GanttTask {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  progress: number; // 0-100
  dependencies?: string[]; // Task IDs
  assignee?: string;
  color?: string;
}

interface GanttProps {
  title?: string;
  tasks: GanttTask[];
  onTaskClick?: (task: GanttTask) => void;
  viewMode?: 'day' | 'week' | 'month';

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Gantt: React.FC<GanttProps> = ({
  title = 'Gantt Chart',
  tasks,
  onTaskClick,
  viewMode = 'week',
}) => {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const getDateRange = () => {
    if (tasks.length === 0) return { start: new Date(), end: new Date() };

    const dates = tasks.flatMap((task) => [
      new Date(task.startDate),
      new Date(task.endDate),
    ]);
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Add padding
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);

    return { start: minDate, end: maxDate };
  };

  const { start: startDate, end: endDate } = getDateRange();

  const getDaysBetween = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalDays = getDaysBetween(startDate, endDate);

  const getTaskPosition = (task: GanttTask) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);

    const startOffset = getDaysBetween(startDate, taskStart);
    const duration = getDaysBetween(taskStart, taskEnd);

    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;

    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

  const generateTimeScale = () => {
    const scales: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (viewMode === 'month') {
        scales.push(
          currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        );
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (viewMode === 'week') {
        scales.push(
          currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        );
        currentDate.setDate(currentDate.getDate() + 7);
      } else {
        scales.push(currentDate.getDate().toString());
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return scales;
  };

  const timeScales = generateTimeScale();

  return (
    <div className="card border border-zinc-200/60 dark:border-zinc-700 rounded-2xl p-6 my-4 overflow-x-auto shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-bold tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h3>
        <div className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400">
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </div>
      </div>

      <div className="min-w-[800px]">
        {/* Time scale header */}
        <div className="flex border-b border-zinc-200/60 dark:border-zinc-700/50 mb-4">
          <div className="w-48 flex-shrink-0 px-4 py-2 text-[11px] uppercase tracking-widest font-semibold text-zinc-400">
            Task Name
          </div>
          <div className="flex-1 relative">
            <div className="flex">
              {timeScales.map((scale, index) => (
                <div
                  key={index}
                  className="flex-1 px-2 py-2 text-center text-xs text-zinc-400 border-l border-zinc-700/30"
                >
                  {scale}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          {tasks.map((task) => {
            const position = getTaskPosition(task);
            const isHovered = hoveredTask === task.id;

            return (
              <div
                key={task.id}
                className="flex items-center group"
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                {/* Task name column */}
                <div className="w-48 flex-shrink-0 px-4 py-2">
                  <div className="text-white text-sm truncate">{task.name}</div>
                  {task.assignee && (
                    <div className="text-xs text-zinc-500 truncate">
                      {task.assignee}
                    </div>
                  )}
                </div>

                {/* Timeline column */}
                <div className="flex-1 relative h-12">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex">
                    {timeScales.map((_, index) => (
                      <div
                        key={index}
                        className="flex-1 border-l border-zinc-800/30"
                      />
                    ))}
                  </div>

                  {/* Task bar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-8"
                    style={position}
                  >
                    <div
                      onClick={() => onTaskClick?.(task)}
                      className={`
                        relative h-full rounded-lg overflow-hidden
                        ${task.color || 'bg-gradient-to-r from-orange-500 to-orange-600'}
                        cursor-pointer
                        transition-all duration-300
                        ${isHovered ? 'ring-2 ring-orange-400/60 scale-105 shadow-lg shadow-orange-500/20' : 'shadow-sm'}
                      `}
                    >
                      {/* Progress bar */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-orange-400/80 to-orange-600/90"
                        style={{ width: `${task.progress}%` }}
                      />

                      {/* Task label */}
                      <div className="absolute inset-0 flex items-center justify-center px-2">
                        <span className="text-white text-xs font-medium truncate">
                          {task.name}
                        </span>
                      </div>

                      {/* Hover tooltip */}
                      {isHovered && (
                        <div className="absolute top-full left-0 mt-2 z-50 w-max max-w-xs">
                          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-700 rounded-xl p-3 shadow-xl">
                            <div className="text-zinc-900 dark:text-white font-semibold mb-2">
                              {task.name}
                            </div>
                            <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-300">
                              <div>Start: {task.startDate}</div>
                              <div>End: {task.endDate}</div>
                              <div>Progress: {task.progress}%</div>
                              {task.assignee && <div>Assignee: {task.assignee}</div>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            No tasks to display
          </div>
        )}
      </div>
    </div>
  );
};

export default Gantt;

export const metadata = {
  name: 'gantt',
  category: 'data-display' as const,
  component: Gantt,
  description: 'Project timeline visualization with task dependencies and progress',
  tags: ['gantt', 'timeline', 'project', 'schedule', 'tasks', 'planning'],
  propTypes: {
    title: 'string',
    tasks: 'GanttTask[]',
    onTaskClick: '(task: GanttTask) => void',
    viewMode: "'day' | 'week' | 'month'",
  },
};
