'use client';

import { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';

export default function SwipePage() {
  const [profiles, setProfiles] = useState<any[]>([]); // List of profiles for swiping
  const [currentIndex, setCurrentIndex] = useState(0); // Current profile index
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/swipe');
        if (res.ok) {
          const data = await res.json();
          setProfiles(data.profiles || []);
        } else {
          console.error('Failed to fetch profiles:', res.statusText);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSwipe = (direction: string, profileId: number) => {
    console.log(`Swiped ${direction} on profile ${profileId}`);
    // You can add a call to the backend to record the swipe action (like/dislike)
  };

  const handleCardLeftScreen = (profileId: number) => {
    console.log(`Profile ${profileId} left the screen`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>No profiles available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Swipe Profiles</h1>
      <div className="relative w-full max-w-md h-[600px]">
        {profiles.map((profile, index) => (
          <TinderCard
            key={profile.id}
            onSwipe={(dir) => handleSwipe(dir, profile.id)}
            onCardLeftScreen={() => handleCardLeftScreen(profile.id)}
            preventSwipe={['up', 'down']}
          >
            <div
              className="absolute w-full h-full bg-white rounded-xl shadow-lg p-6"
              style={{
                backgroundImage: `url(${profile.images[0]?.url || '/default-avatar.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-xl">
                <h2 className="text-white text-xl font-bold">{profile.name}</h2>
                <p className="text-gray-300">{profile.age} years old</p>
                <p className="text-gray-400">{profile.bio}</p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}
