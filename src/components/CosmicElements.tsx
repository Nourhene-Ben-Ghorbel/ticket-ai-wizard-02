
import React from 'react';
import { motion } from 'framer-motion';

export const GlowingOrb: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className, size = 70, color = "#4169e1" }) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-2xl opacity-60 ${className}`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.6, 0.75, 0.6],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        width: size,
        height: size,
        background: color,
      }}
    />
  );
};

export const ShootingStar: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <motion.div
      className={`absolute h-0.5 bg-gradient-to-r from-blue-300 via-white to-transparent ${className}`}
      initial={{ width: 0, opacity: 0 }}
      animate={{ 
        width: ["0%", "10%", "0%"],
        opacity: [0, 1, 0],
        x: ["0%", "100%"],
        y: ["0%", "100%"],
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        repeatDelay: Math.random() * 10 + 5,
      }}
    />
  );
};

export const Planet: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className, size = 40, color = "#6c47ff" }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, #121063)`,
        boxShadow: `0 0 20px rgba(108, 71, 255, 0.5)`,
      }}
    />
  );
};

export const Comet: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        x: ['-100%', '200%'],
        y: ['0%', '100%'],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatDelay: 15,
        ease: "easeInOut",
      }}
    >
      <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_5px_rgba(255,255,255,0.5)]" />
      <div className="absolute top-0 right-0 w-20 h-1 bg-gradient-to-l from-white via-blue-300 to-transparent transform -rotate-45 origin-left" />
    </motion.div>
  );
};

export const CosmicElements: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <GlowingOrb className="top-[15%] left-[10%]" color="#4169e1" size={100} />
      <GlowingOrb className="top-[60%] left-[80%]" color="#8a2be2" size={120} />
      <GlowingOrb className="top-[75%] left-[20%]" color="#3d28b9" size={80} />
      
      <Planet className="top-[8%] right-[15%]" size={30} />
      <Planet className="bottom-[20%] left-[8%]" size={20} color="#7047b8" />
      
      <ShootingStar className="top-[20%] left-[30%]" />
      <ShootingStar className="top-[40%] left-[70%]" />
      <ShootingStar className="top-[80%] left-[50%]" />
      
      <Comet className="top-[5%] left-[5%]" />
    </div>
  );
};

export default CosmicElements;
