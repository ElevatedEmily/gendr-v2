'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null); // Store profile picture
  const router = useRouter();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);

    // Fetch profile picture if authenticated
    const fetchProfile = async () => {
      if (status === 'authenticated') {
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const data = await res.json();
            setProfilePic(data.profile?.avatarUrl || '/default-avatar.png');
          } else {
            console.error('Failed to fetch profile picture');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [status]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <h1
            className="text-2xl font-bold text-pink-500 dark:text-pink-400 cursor-pointer"
            onClick={() => router.push('/dashboard')}
          >
            Gendr
          </h1>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Conditional Buttons for Logged-in Users */}
            {status === 'authenticated' && (
              <>
                <button
                  onClick={() => router.push('/profile')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Profile
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
                <img
                  src={profilePic || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
