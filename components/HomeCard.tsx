'use client';

import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ className, img, title, description, handleClick }: HomeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: 1.02,
        transition: { duration: 0.3 }
      });
    } else {
      controls.start({
        scale: 1,
        transition: { duration: 0.3 }
      });
    }
  }, [isHovered, controls]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'bg-orange-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer group relative overflow-hidden',
        className
      )}
      onClick={handleClick}
    >
      {/* Dynamic Background Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:14px_14px] opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
      
      {/* Interactive Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated Particles System */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-2 rounded-full bg-white/20"
            initial={{ 
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
              opacity: 0
            }}
            animate={{ 
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </div>
      
      {/* Decorative Corner Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content Container with Enhanced Layout */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="flex-center glassmorphism size-12 rounded-[10px] group-hover:bg-white/20 transition-all duration-300 relative"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="flex-center"
          >
            <Image src={img} alt="meeting" width={27} height={27} className="group-hover:scale-110 transition-transform duration-300" />
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-2"
        >
          <motion.h1 
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold group-hover:text-white transition-colors duration-300"
          >
            {title}
          </motion.h1>
          <motion.p 
            whileHover={{ scale: 1.05 }}
            className="text-lg font-normal group-hover:text-white/90 transition-colors duration-300"
          >
            {description}
          </motion.p>
        </motion.div>
      </div>

      {/* Enhanced Border Effects */}
      <div className="absolute inset-0 rounded-[14px] border border-white/10 group-hover:border-white/20 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Interactive Hover Indicator */}
      <motion.div 
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ x: 20 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </motion.div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-[14px] shadow-[0_0_20px_rgba(255,255,255,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Ripple Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute bg-white/10 rounded-full"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={isHovered ? { scale: 2, opacity: 0 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="size-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs text-white/70">Active</span>
      </div>
    </motion.section>
  );
};

export default HomeCard;
