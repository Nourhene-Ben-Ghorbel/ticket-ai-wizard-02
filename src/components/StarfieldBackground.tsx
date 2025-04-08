
import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  speed: number;
}

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const animationFrameId = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize the canvas to fill the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };
    
    // More professional star colors with blue tones
    const starColors = [
      '#ffffff', // White
      '#d8e8ff', // Soft light blue
      '#b3d1ff', // Light blue
      '#8ab8ff', // Medium blue
      '#e6ecf5'  // Very light blue-gray
    ];
    
    // Initialize stars with a more subtle, professional appearance
    const initStars = () => {
      stars.current = [];
      // Fewer stars for a cleaner look
      for (let i = 0; i < 150; i++) {
        const starColor = starColors[Math.floor(Math.random() * starColors.length)];
        const size = Math.random() * 1.8 + 0.4; // Smaller stars
        
        stars.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          opacity: Math.random() * 0.6 + 0.2, // More subtle opacity
          color: starColor,
          speed: Math.random() * 0.06 + 0.01 // Slightly slower movement
        });
      }
    };
    
    // Create a more subtle gradient background
    const drawBackground = () => {
      // More professional dark blue gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)'); // Darker center - slate-900
      gradient.addColorStop(1, 'rgba(8, 15, 30, 1)');     // Very dark blue edge
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    // Add subtle cosmic clouds
    const drawClouds = () => {
      for (let i = 0; i < 3; i++) { // Fewer clouds
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 120 + 50;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        // Professional blue cloud color
        const hue = Math.random() * 20 + 210; // Blue range
        gradient.addColorStop(0, `hsla(${hue}, 60%, 30%, 0.03)`); // Much more subtle
        gradient.addColorStop(1, `hsla(${hue}, 60%, 20%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the background gradient first
      drawBackground();
      
      // Draw subtle cosmic clouds
      drawClouds();
      
      // Draw stars
      stars.current.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // More subtle glow effect
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 1.5
        );
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = `${star.color}${Math.floor(star.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.shadowBlur = star.size * 1.5;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Occasional subtle twinkle
        if (Math.random() > 0.995) {
          star.opacity = Math.min(0.8, star.opacity + 0.2);
          setTimeout(() => {
            star.opacity = Math.max(0.2, star.opacity - 0.2);
          }, 100);
        }
        
        // Move star
        star.y += star.speed;
        
        // Reset position if star goes off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default StarfieldBackground;
