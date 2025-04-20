'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex-center size-10 rounded-full bg-dark-3 cursor-pointer sm:hidden ios-transition hover:bg-dark-4">
            <Image
              src="/icons/hamburger.svg"
              width={20}
              height={20}
              alt="menu"
              className="cursor-pointer sm:hidden"
            />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-1 backdrop-blur-xl p-0">
          <div className="px-6 py-5 border-b border-gray-1 border-opacity-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex-center size-10 rounded-ios-lg bg-gradient-to-br from-blue-1 via-purple-1 to-pink-1 shadow-ios ios-fill">
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
              <p className="text-xl font-semibold text-white ios-gradient-text">
                Intellimeet
              </p>
            </Link>
          </div>
          <div className="flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-4 p-6 pt-8 text-white">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        className={cn(
                          'flex gap-4 items-center p-4 rounded-ios ios-transition',
                          {
                            'bg-gradient-to-r from-blue-1 to-blue-2': isActive,
                            'hover:bg-dark-4': !isActive,
                          }
                        )}
                      >
                        <div className={cn(
                          'flex-center size-10 rounded-full ios-transition',
                          {
                            'bg-white bg-opacity-20 ios-fill': isActive,
                            'bg-dark-3': !isActive
                          }
                        )}>
                          <div className={cn(
                            'flex-center size-8 rounded-full',
                            {
                              'bg-white bg-opacity-10': isActive,
                              'bg-gradient-to-br from-blue-1/10 to-purple-1/10': !isActive
                            }
                          )}>
                            <Image
                              src={item.imgURL}
                              alt={item.label}
                              width={20}
                              height={20}
                              className={cn({
                                'animate-ios-bounce': isActive
                              })}
                            />
                          </div>
                        </div>
                        <p className={cn(
                          "text-base font-medium ios-transition",
                          {
                            'font-semibold': isActive,
                            'text-gray-1': !isActive,
                          }
                        )}>
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
