'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-5">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex gap-4 items-center p-4 rounded-ios ios-transition',
                {
                  'bg-gradient-to-r from-blue-1 to-blue-2': isActive,
                  'hover:bg-dark-4 hover:translate-x-1': !isActive,
                }
              )}
            >
              <div className={cn(
                'flex-center size-10 rounded-full ios-transition',
                {
                  'bg-white bg-opacity-20': isActive,
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
                    width={22}
                    height={22}
                    className={cn({
                      'animate-ios-bounce': isActive
                    })}
                  />
                </div>
              </div>
              <p className={cn(
                "text-base font-medium max-lg:hidden ios-transition",
                {
                  'font-semibold': isActive,
                  'text-gray-1': !isActive,
                }
              )}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
