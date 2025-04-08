
import React from 'react';
import { motion } from 'framer-motion';

export const GlowingOrb: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className, size = 70, color = "#8a6fff" }) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-2xl opacity-60 ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 0.8, 0.6],
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
        width: ["0%", "15%", "0%"],
        opacity: [0, 1, 0],
        x: ["0%", "100%"],
        y: ["0%", "100%"],
      }}
      transition={{
        duration: Math.random() * 2 + 2,
        repeat: Infinity,
        repeatDelay: Math.random() * 8 + 3,
      }}
    />
  );
};

export const Planet: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className, size = 40, color = "#8a6fff" }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, #2b1487)`,
        boxShadow: `0 0 30px rgba(138, 111, 255, 0.6)`,
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
        duration: 8,
        repeat: Infinity,
        repeatDelay: 12,
        ease: "easeInOut",
      }}
    >
      <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_8px_rgba(255,255,255,0.6)]" />
      <div className="absolute top-0 right-0 w-30 h-1 bg-gradient-to-l from-white via-blue-300 to-transparent transform -rotate-45 origin-left" />
    </motion.div>
  );
};

// Nouvel élément: Constellation
export const Constellation: React.FC<{
  className?: string;
  points?: number;
}> = ({ className, points = 5 }) => {
  // Générer des points aléatoires pour la constellation
  const starPoints = Array.from({ length: points }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1
  }));

  return (
    <div className={`absolute ${className}`} style={{ width: '150px', height: '150px' }}>
      {/* Étoiles */}
      {starPoints.map((point, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${point.size}px`,
            height: `${point.size}px`,
            boxShadow: '0 0 5px 2px rgba(255, 255, 255, 0.7)'
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random()
          }}
        />
      ))}
      
      {/* Lignes reliant les étoiles */}
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
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
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

// Nouvel élément: Nebula
export const Nebula: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className, color = "#c67aff", size = 200 }) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        width: size,
        height: size * 0.6,
        background: `radial-gradient(ellipse at center, ${color}33 0%, ${color}11 50%, transparent 100%)`,
        transform: 'rotate(15deg)',
      }}
    />
  );
};

export const CosmicElements: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <GlowingOrb className="top-[10%] left-[15%]" color="#965cff" size={140} />
      <GlowingOrb className="top-[60%] left-[80%]" color="#9f6eff" size={120} />
      <GlowingOrb className="top-[75%] left-[20%]" color="#7b5eff" size={100} />
      
      <Planet className="top-[8%] right-[15%]" size={35} color="#a78dff" />
      <Planet className="bottom-[20%] left-[8%]" size={20} color="#ca9aff" />
      
      <ShootingStar className="top-[20%] left-[30%]" />
      <ShootingStar className="top-[40%] left-[70%]" />
      <ShootingStar className="top-[80%] left-[50%]" />
      
      <Comet className="top-[5%] left-[5%]" />
      <Comet className="bottom-[15%] right-[10%]" />
      
      {/* Nouveaux éléments */}
      <Nebula className="top-[30%] left-[60%]" color="#8a5eff" size={300} />
      <Nebula className="bottom-[60%] right-[70%]" color="#c88aff" size={250} />
      
      <Constellation className="top-[45%] right-[25%]" points={6} />
      <Constellation className="bottom-[30%] left-[40%]" points={4} />
    </div>
  );
};

export default CosmicElements;
