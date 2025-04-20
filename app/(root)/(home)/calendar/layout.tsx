import React from 'react';

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full">
      {children}
    </main>
  );
} 