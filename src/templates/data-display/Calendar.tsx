import React, { useState } from 'react';

type CalendarView = 'month' | 'week' | 'day';

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  color?: string;
}

interface CalendarProps {
  title?: string;
  events?: CalendarEvent[];
  view?: CalendarView;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  minDate?: Date;
  maxDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  title = 'Calendar',
  events = [],
  view: _view = 'month',
  selectedDate,
  onDateSelect,
  onEventClick,
  minDate,
  maxDate,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [selected, setSelected] = useState<Date | null>(selectedDate || null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter((event) => event.date === dateStr);
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isSameDay = (date1: Date | null, date2: Date): boolean => {
    if (!date1) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    return isSameDay(new Date(), date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    setSelected(date);
    onDateSelect?.(date);
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dayEvents = getEventsForDate(date);
          const isSelected = isSameDay(selected, date);
          const isCurrentDay = isToday(date);
          const isDisabled = isDateDisabled(date);

          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                aspect-square p-1 rounded-lg
                transition-all duration-200
                ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-800/50'}
                ${isSelected ? 'bg-blue-600 text-white' : 'text-gray-200'}
                ${isCurrentDay && !isSelected ? 'border-2 border-blue-500' : ''}
              `}
            >
              <div className="flex flex-col h-full">
                <div className={`text-sm text-center ${isSelected ? 'font-bold' : ''}`}>
                  {date.getDate()}
                </div>
                {dayEvents.length > 0 && (
                  <div className="flex-1 flex items-end justify-center gap-0.5 pb-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        className={`w-1.5 h-1.5 rounded-full ${
                          event.color || 'bg-blue-400'
                        }`}
                        title={event.title}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-dark border border-gray-700/50 rounded-2xl p-6 my-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-semibold text-white">
          {title}
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="text-lg font-semibold text-white min-w-[180px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {renderMonthView()}

      {selected && (
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="text-sm text-gray-400 mb-2">
            Selected: {selected.toLocaleDateString()}
          </div>
          {getEventsForDate(selected).length > 0 && (
            <div className="space-y-2">
              {getEventsForDate(selected).map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="p-3 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${event.color || 'bg-blue-400'}`} />
                    <span className="text-white text-sm">{event.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;

export const metadata = {
  name: 'calendar',
  category: 'data-display' as const,
  component: Calendar,
  description: 'Interactive calendar with event support and date selection',
  tags: ['calendar', 'date', 'events', 'schedule', 'picker'],
  propTypes: {
    title: 'string',
    events: 'CalendarEvent[]',
    view: "'month' | 'week' | 'day'",
    selectedDate: 'Date',
    onDateSelect: '(date: Date) => void',
    onEventClick: '(event: CalendarEvent) => void',
    minDate: 'Date',
    maxDate: 'Date',
  },
};
