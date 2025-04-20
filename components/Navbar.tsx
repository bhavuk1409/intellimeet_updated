import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';

import MobileNav from './MobileNav';

const Navbar = () => {
  return (
    <nav className="fixed z-50 w-full glassmorphism2 backdrop-blur-lg py-4 px-6 lg:px-10 border-b border-gray-1 border-opacity-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 ios-transition">
        <div className="flex-center size-10 rounded-ios-lg bg-gradient-to-br from-white via-white to-white shadow-ios ios-fill">
            <div className="size-8 flex-center rounded-[8px] bg-white bg-opacity-90">
              <Image
                src="/icons/intellimeet-logo.png"
                width={22}
                height={22}
                alt="Intellimeet logo"
                className="size-6"
              />
            </div>
          </div>
          <p className="text-xl font-semibold text-white max-sm:hidden ios-gradient-text">
            Intellimeet
          </p>
        </Link>
        
        <div className="flex items-center gap-5">
          <SignedIn>
            <div className="bg-dark-3 p-1 rounded-full ios-shadow">
              <UserButton 
                afterSignOutUrl="/sign-in" 
                appearance={{
                  elements: {
                    avatarBox: "size-9",
                  }
                }}
              />
            </div>
          </SignedIn>

          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
