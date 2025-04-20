import React from 'react';
import MeetingCalendar from '@/components/MeetingCalendar';

const CalendarPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white p-4 md:p-6">
      <MeetingCalendar />
    </section>
  );
};

export default CalendarPage; 