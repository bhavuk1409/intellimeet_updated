import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'IntelliMeet',
  description: 'Video meeting platform with intelligent features',
};

const RootLayout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main className="relative min-h-screen bg-dark-1 bg-[url('/images/grid-pattern.png')] bg-fixed bg-center">
      <Navbar />

      <div className="flex">
        <Sidebar />
        
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-10 pt-28 max-md:pb-14 sm:px-10">
          <div className="w-full rounded-ios-lg overflow-hidden ios-transition">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
