
import React from 'react';
import { motion } from 'framer-motion';

export const GlowingOrb: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className, size = 70, color = "#3b82f6" }) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-2xl opacity-30 ${className}`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.4, 0.3],
      }}
      transition={{
        duration: 8,
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
      className={`absolute h-0.5 bg-gradient-to-r from-blue-200 via-white to-transparent ${className}`}
      initial={{ width: 0, opacity: 0 }}
      animate={{ 
        width: ["0%", "15%", "0%"],
        opacity: [0, 0.7, 0],
        x: ["0%", "100%"],
        y: ["0%", "100%"],
      }}
      transition={{
        duration: Math.random() * 2 + 2,
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
}> = ({ className, size = 40, color = "#1e40af" }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, #0f172a)`,
        boxShadow: `0 0 20px rgba(59, 130, 246, 0.4)`,
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
        opacity: [0, 0.7, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatDelay: 15,
        ease: "easeInOut",
      }}
    >
      <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_5px_rgba(219,234,254,0.5)]" />
      <div className="absolute top-0 right-0 w-20 h-0.5 bg-gradient-to-l from-white via-blue-200 to-transparent transform -rotate-45 origin-left" />
    </motion.div>
  );
};

// Constellation with blue theme
export const Constellation: React.FC<{
  className?: string;
  points?: number;
}> = ({ className, points = 5 }) => {
  // Generate random points for the constellation
  const starPoints = Array.from({ length: points }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5
  }));

  return (
    <div className={`absolute ${className}`} style={{ width: '150px', height: '150px' }}>
      {/* Stars */}
      {starPoints.map((point, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${point.size}px`,
            height: `${point.size}px`,
            boxShadow: '0 0 3px 1px rgba(219, 234, 254, 0.7)'
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random()
          }}
        />
      ))}
      
      {/* Lines connecting the stars */}
      <svg className="absolute inset-0 w-full h-full">
        {starPoints.map((point, i) => {
          if (i < starPoints.length - 1) {
            const nextPoint = starPoints[i + 1];
            return (
              <motion.line
                key={i}
                x1={`${point.x}%`}
                y1={`${point.y}%`}
                x2={`${nextPoint.x}%`}
                y2={`${nextPoint.y}%`}
                stroke="rgba(219, 234, 254, 0.2)"
                strokeWidth="0.3"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

// Professional blue nebula
export const Nebula: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className, color = "#3b82f6", size = 200 }) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.1, 0.15, 0.1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        width: size,
        height: size * 0.6,
        background: `radial-gradient(ellipse at center, ${color}22 0%, ${color}11 50%, transparent 100%)`,
        transform: 'rotate(15deg)',
      }}
    />
  );
};

export const CosmicElements: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <GlowingOrb className="top-[10%] left-[15%]" color="#60a5fa" size={140} />
      <GlowingOrb className="top-[60%] left-[80%]" color="#3b82f6" size={120} />
      <GlowingOrb className="top-[75%] left-[20%]" color="#2563eb" size={100} />
      
      <Planet className="top-[8%] right-[15%]" size={25} color="#60a5fa" />
      <Planet className="bottom-[20%] left-[8%]" size={15} color="#93c5fd" />
      
      <ShootingStar className="top-[15%] left-[30%]" />
      <ShootingStar className="top-[40%] left-[70%]" />
      
      <Comet className="top-[5%] left-[5%]" />
      
      <Nebula className="top-[30%] left-[60%]" color="#3b82f6" size={250} />
      <Nebula className="bottom-[60%] right-[70%]" color="#60a5fa" size={200} />
      
      <Constellation className="top-[45%] right-[25%]" points={6} />
      <Constellation className="bottom-[30%] left-[40%]" points={4} />
    </div>
  );
};

export default CosmicElements;
