'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useGetCalls } from '@/hooks/useGetCalls';
import { Call } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import Loader from './Loader';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MeetingCalendar.css'; // Import custom styles

// Create localizer for react-big-calendar
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Define event type for calendar
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
}

const MeetingCalendar = () => {
  const router = useRouter();
  const { upcomingCalls, isLoading } = useGetCalls();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  // Convert upcoming calls to calendar events
  const events = useMemo(() => {
    if (!upcomingCalls) return [];

    return upcomingCalls.map((call: Call) => {
      const startDate = new Date(call.state.startsAt || new Date());
      
      // Default meeting duration is 1 hour if not specified
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);

      return {
        id: call.id,
        title: call.state?.custom?.description || 'Untitled Meeting',
        start: startDate,
        end: endDate,
        resource: call,
      };
    });
  }, [upcomingCalls]);

  // Handle calendar navigation
  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  // Handle view change
  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  // Handle event selection
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      router.push(`/meeting/${event.id}`);
    },
    [router]
  );

  // Go to current date
  const goToToday = useCallback(() => {
    setDate(new Date());
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Upcoming Meetings</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className="bg-transparent border-white/20 text-white hover:bg-white/10"
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Today
        </Button>
      </div>

      <div className="flex-1 bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day', 'agenda']}
          defaultView={Views.MONTH}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          style={{ height: 700 }}
          className="text-white"
          dayPropGetter={() => ({
            style: {
              backgroundColor: 'rgba(17, 24, 39, 0.7)', 
              color: 'white',
            },
          })}
          eventPropGetter={() => ({
            style: {
              backgroundColor: '#3b82f6', 
              color: 'white',
              borderRadius: '4px',
            },
          })}
          components={{
            event: ({ event }) => (
              <div className="p-1 truncate">
                <span className="font-medium">{event.title}</span>
              </div>
            ),
            toolbar: (props) => (
              <div className="rbc-toolbar text-white mb-4">
                <span className="rbc-btn-group">
                  <button type="button" onClick={() => props.onNavigate('PREV')}>
                    Previous
                  </button>
                  <button type="button" onClick={() => props.onNavigate('TODAY')}>
                    Today
                  </button>
                  <button type="button" onClick={() => props.onNavigate('NEXT')}>
                    Next
                  </button>
                </span>
                <span className="rbc-toolbar-label">{props.label}</span>
                <span className="rbc-btn-group">
                  {['month', 'week', 'day', 'agenda'].map(value => (
                    <button
                      key={value}
                      type="button"
                      className={`${
                        value === props.view ? 'rbc-active' : ''
                      }`}
                      onClick={() => props.onView(value as View)}
                    >
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </button>
                  ))}
                </span>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default MeetingCalendar; 