/*
"use client";


import { motion } from "framer-motion";
import { useUser } from '@clerk/nextjs';
import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  const { user } = useUser(); 
  const userName = user?.firstName || "there";

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now);

 

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return `Good Morning, ${userName} ☀️`;
    if (hour < 18) return `Good Afternoon, ${userName} 🌤️`;
    return `Good Evening, ${userName} 🌙`;
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex size-full flex-col gap-10 text-white"
    >
      <motion.div 
        whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        className="relative h-[300px] w-full rounded-[20px] overflow-hidden group shadow-lg border border-white/10 bg-black/30 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/50 via-black/40 to-sky-900/40 group-hover:from-purple-700/40 transition-all duration-300" />
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2"
          >
            <motion.p 
              whileHover={{ scale: 1.05 }}
              className="text-xl font-semibold text-white/80 lg:text-2xl"
            >
              {getGreeting()}
            </motion.p>
            <motion.h1 
              whileHover={{ scale: 1.05 }}
              className="text-4xl font-extrabold lg:text-7xl hover:text-sky-400 transition-colors duration-300"
            >
              {time}
            </motion.h1>
            <motion.p 
              whileHover={{ scale: 1.05 }}
              className="text-lg font-medium text-sky-300 lg:text-2xl hover:text-white transition-colors duration-300"
            >
              {date}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      <MeetingTypeList />
    </motion.section>
  );
};

export default Home;



*/


"use client";

import { motion } from "framer-motion";
import { useUser } from '@clerk/nextjs';
import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  const { user } = useUser(); 
  const userName = user?.firstName || "there";

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now);

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return `Good Morning, ${userName} ☀️`;
    if (hour < 18) return `Good Afternoon, ${userName} 🌤️`;
    return `Good Evening, ${userName} 🌙`;
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex size-full flex-col gap-10 text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/path/to/your/background-image.jpg')" }} 
    >
      <motion.div 
        whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        className="relative h-[300px] w-full rounded-[20px] overflow-hidden shadow-lg border border-white/10 bg-black/40 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/50 via-black/40 to-purple-900/50 group-hover:from-purple-700/40 transition-all duration-300" />
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11 relative z-10">          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2"
          >
            <motion.p 
              whileHover={{ scale: 1.05 }}
              className="text-xl font-semibold text-white/80 lg:text-2xl"
            >
              {getGreeting()}
            </motion.p>
            <motion.h1 
              whileHover={{ scale: 1.05 }}
              className="text-4xl font-extrabold lg:text-7xl hover:text-sky-400 transition-colors duration-300"
            >
              {time}
            </motion.h1>
            <motion.p 
              whileHover={{ scale: 1.05 }}
              className="text-lg font-medium text-sky-300 lg:text-2xl hover:text-white transition-colors duration-300"
            >
              {date}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      <MeetingTypeList />
    </motion.section>
  );
};

export default Home;


