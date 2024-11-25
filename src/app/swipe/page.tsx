'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaHeart } from 'react-icons/fa';

export default function SwipePage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradientPosition, setGradientPosition] = useState(50);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/swipe');
        if (res.ok) {
          const data = await res.json();
          setProfiles(data.profiles || []);
        } else {
          console.error('Failed to fetch profiles:', res.statusText);
          setError('Failed to load profiles.');
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const screenWidth = window.innerWidth;
    const cursorX = e.clientX;

    const positionPercentage = (cursorX / screenWidth) * 100;
    setGradientPosition(positionPercentage);
  };

  const getLightModeGradient = () => {
    const pinkIntensity = Math.max(0, 100 - gradientPosition);
    const blueIntensity = Math.max(0, gradientPosition);

    return `linear-gradient(to right, rgba(255, 182, 193, ${pinkIntensity / 100}) 0%, rgba(173, 216, 230, ${blueIntensity / 100}) 100%)`;
  };

  const handleDrag = (event: any, info: any) => {
    setRotation(info.offset.x / 20);

    const screenWidth = window.innerWidth;
    const triggerWidth = screenWidth / 10;
    const cardCenterX = info.point.x;
    const cardWidth = cardRef.current?.offsetWidth || 0;

    if (
      !isSwiping &&
      (cardCenterX - cardWidth / 2 <= triggerWidth || cardCenterX + cardWidth / 2 >= screenWidth - triggerWidth)
    ) {
      setIsSwiping(true);
      const direction = cardCenterX > screenWidth / 2 ? 'right' : 'left';
      handleSwipe(direction);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    console.log(`Swiped ${direction} on profile ${profiles[currentIndex]?.id}`);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, profiles.length - 1));
      setRotation(0);
      setIsSwiping(false);
    }, 300);
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    console.log(`Button swipe ${direction}`);
    setIsSwiping(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, profiles.length - 1));
      setRotation(0);
      setIsSwiping(false);
    }, 300);
  };

  const calculateDragConstraints = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const cardWidth = cardRef.current?.offsetWidth || 0;

    return {
      top: 0, // Prevent moving above the top of the screen
      bottom: screenHeight - (cardRef.current?.offsetHeight || 0), // Prevent moving below the screen
      left: -screenWidth * 0.75 + cardWidth / 2, // Allow movement 3/4th of the screen width to the left
      right: screenWidth * 0.75 - cardWidth / 2, // Allow movement 3/4th of the screen width to the right
    };
  };

  const orbStyles = {
    pink: {
      width: `${50 + gradientPosition}%`,
      height: `${50 + gradientPosition}%`,
      opacity: `${0.3 + (100 - gradientPosition) / 300}`,
    },
    blue: {
      width: `${50 + (100 - gradientPosition)}%`,
      height: `${50 + (100 - gradientPosition)}%`,
      opacity: `${0.3 + gradientPosition / 300}`,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <p className="text-white text-lg font-bold">No more profiles available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center min-h-screen overflow-hidden transition-all duration-500 dark:text-gray-100"
      onMouseMove={handleMouseMove}
      style={{
        background: document.documentElement.classList.contains('dark')
          ? 'linear-gradient(to bottom, #1a202c, #2d3748, #1a202c)'
          : getLightModeGradient(),
      }}
    >
      {/* Trigger Areas */}
      <div
        className="absolute top-0 left-0 h-full bg-transparent z-20 pointer-events-none"
        style={{ width: '10%' }}
      ></div>
      <div
        className="absolute top-0 right-0 h-full bg-transparent z-20 pointer-events-none"
        style={{ width: '10%' }}
      ></div>

      {/* Dark Mode Orbs */}
      {document.documentElement.classList.contains('dark') && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-16 left-16 rounded-full blur-3xl bg-pink-700"
            style={orbStyles.pink}
          ></div>
          <div
            className="absolute bottom-20 right-20 rounded-full blur-3xl bg-blue-700"
            style={orbStyles.blue}
          ></div>
        </div>
      )}

      {/* Swipeable Cards */}
      <div className="flex items-center justify-center flex-grow z-10">
        {profiles[currentIndex] && (
          <motion.div
            key={profiles[currentIndex]?.id}
            ref={cardRef}
            className="relative w-[550px] h-[750px] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col justify-end cursor-grab"
            style={{
              backgroundImage: `url(${profiles[currentIndex]?.firstImage || '/default-avatar.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            drag
            dragConstraints={calculateDragConstraints()}
            dragElastic={{ top: 0.3, bottom: 0.3, left: 0.75, right: 0.75 }} // Dynamically set constraints
            onDrag={handleDrag}
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="bg-black bg-opacity-60 p-6 text-white">
              <h2 className="text-3xl font-bold">{profiles[currentIndex]?.name}</h2>
              <p className="text-xl">{profiles[currentIndex]?.age} years old</p>
              <p className="text-md mt-2">{profiles[currentIndex]?.bio}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Swipe Buttons */}
      <div className="absolute bottom-20 flex justify-center w-full space-x-6 z-10">
        <button
          onClick={() => handleButtonSwipe('left')}
          className="p-4 bg-pink-500 rounded-full shadow-md hover:bg-pink-600 transition text-white"
        >
          <FaTimes size={30} />
        </button>
        <button
          onClick={() => handleButtonSwipe('right')}
          className="p-4 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition text-white"
        >
          <FaHeart size={30} />
        </button>
      </div>
    </div>
  );
}
