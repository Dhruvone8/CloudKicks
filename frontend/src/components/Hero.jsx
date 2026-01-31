import React, { useEffect, useRef, useState } from "react";

// Import all hero animation frames using Vite's glob import
const heroFrames = import.meta.glob('../assets/HeroAnimations/*.jpg', { eager: true, import: 'default' });

// Sort frames by filename to ensure correct order
const sortedFramePaths = Object.keys(heroFrames).sort();
const frameUrls = sortedFramePaths.map(path => heroFrames[path]);

const Hero = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const TOTAL_FRAMES = frameUrls.length;
  const FRAME_DURATION = 1000 / 30; // 30fps for smooth animation

  useEffect(() => {
    if (TOTAL_FRAMES === 0) {
      console.error('No hero animation frames found');
      return;
    }

    // Preload all images
    const loadImages = async () => {
      const imagePromises = [];

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = frameUrls[i];

        const promise = new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = reject;
        });

        imagePromises.push(promise);
        imagesRef.current[i] = img;
      }

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading hero animation frames:', error);
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Function to resize canvas and draw
    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (currentTime) => {
      if (currentTime - lastFrameTimeRef.current >= FRAME_DURATION) {
        const currentFrame = imagesRef.current[frameIndexRef.current];

        if (currentFrame && canvas.width && canvas.height) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Calculate dimensions to cover the canvas while maintaining aspect ratio
          const imgRatio = currentFrame.width / currentFrame.height;
          const canvasRatio = canvas.width / canvas.height;

          let drawWidth, drawHeight, offsetX, offsetY;

          if (canvasRatio > imgRatio) {
            // Canvas is wider than image ratio - fit to width
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            // Canvas is taller than image ratio - fit to height
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
          }

          ctx.drawImage(currentFrame, offsetX, offsetY, drawWidth, drawHeight);
        }

        frameIndexRef.current = (frameIndexRef.current + 1) % TOTAL_FRAMES;
        lastFrameTimeRef.current = currentTime;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [imagesLoaded]);

  return (
    <section ref={containerRef} className="hero-fullscreen" aria-label="Hero banner">
      {!imagesLoaded && (
        <div className="hero-loader">
          <div className="hero-loader-spinner"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`hero-canvas-fullscreen ${imagesLoaded ? 'loaded' : ''}`}
        aria-label="Animated product showcase"
      />
    </section>
  );
};

export default Hero;