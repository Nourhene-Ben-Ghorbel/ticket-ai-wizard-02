
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
    
    // Colors for the stars with brighter palette
    const starColors = [
      '#ffffff', // White
      '#6ec6ff', // Light blue
      '#c0a9ff', // Light purple
      '#ffd6e0', // Light pink
      '#ffedaa'  // Light yellow
    ];
    
    // Initialize stars with more variety and brighter appearance
    const initStars = () => {
      stars.current = [];
      // Increase the star count for a more vibrant sky
      for (let i = 0; i < 250; i++) {
        const starColor = starColors[Math.floor(Math.random() * starColors.length)];
        const size = Math.random() * 2.5 + 0.5; // Slightly larger stars
        
        stars.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          opacity: Math.random() * 0.7 + 0.3, // Higher base opacity
          color: starColor,
          speed: Math.random() * 0.08 + 0.01 // Some stars move faster
        });
      }
    };
    
    // Create radial gradient for a more vibrant background
    const drawBackground = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5
      );
      gradient.addColorStop(0, 'rgba(30, 15, 60, 0.2)'); // Center: lighter purple, more transparent
      gradient.addColorStop(1, 'rgba(10, 5, 30, 0.5)');  // Edge: darker purple, more opaque
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    // Add some cosmic clouds
    const drawClouds = () => {
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 150 + 50;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        // Random cosmic cloud color
        const hue = Math.random() * 60 + 220; // Blue to purple range
        gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.05)`);
        gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0)`);
        
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
      
      // Draw cosmic clouds
      drawClouds();
      
      // Draw stars
      stars.current.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Create a glow effect
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 2
        );
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = `${star.color}${Math.floor(star.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.shadowBlur = star.size * 2;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Occasional twinkle effect
        if (Math.random() > 0.99) {
          star.opacity = Math.min(1, star.opacity + 0.3);
          setTimeout(() => {
            star.opacity = Math.max(0.3, star.opacity - 0.3);
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
