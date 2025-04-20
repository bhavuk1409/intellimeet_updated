import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen bg-dark-1 bg-[url('/images/grid-pattern.png')] bg-fixed bg-center">
      <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-dark-1 via-dark-1/90 to-dark-1/70 -z-10"></div>
      
      <div className="fixed top-0 left-0 w-full z-50 glassmorphism2 backdrop-blur-xl px-6 py-4 border-b border-gray-1 border-opacity-10 lg:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-center size-10 rounded-ios-lg bg-gradient-to-br from-blue-1 via-purple-1 to-pink-1 shadow-ios">
              <div className="flex-center size-8 rounded-[8px] bg-white bg-opacity-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-1">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <path d="M16 13H8"/>
                  <path d="M16 17H8"/>
                  <path d="M10 9H8"/>
                </svg>
              </div>
            </div>
            <p className="text-xl font-semibold text-white bg-gradient-to-r from-white to-gray-3 inline-block text-transparent bg-clip-text">
              Meeting Summary
            </p>
          </div>
          
          <MobileNav />
        </div>
      </div>
      
      <section className="flex min-h-screen flex-1 flex-col px-6 pb-10 pt-28 sm:px-10">
        <div className="w-full ios-transition">
          {children}
        </div>
      </section>
    </main>
  );
} 