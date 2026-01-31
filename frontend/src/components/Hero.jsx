import React, { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 190;

const Hero = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const FRAME_DURATION = 1000 / 30; // 30fps for smooth animation

  useEffect(() => {
    // Preload all images from public folder
    const loadImages = async () => {
      const imagePromises = [];

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNumber = String(i).padStart(4, '0');
        // Load from public folder - works in both dev and production
        img.src = `/HeroAnimations/${frameNumber}.jpg`;

        const promise = new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load frame ${frameNumber}`));
        });

        imagePromises.push(promise);
        imagesRef.current[i - 1] = img;
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
    <div
      ref={containerRef}
      className="relative w-full bg-gray-100 border border-gray-300 overflow-hidden"
      style={{ aspectRatio: '16/9', minHeight: '300px', maxHeight: '70vh' }}
    >
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-10 h-10 border-3 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Animated product showcase"
      />
    </div>
  );
};

export default Hero;