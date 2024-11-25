'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
    MapPinIcon,
    HeartIcon,
    BoltIcon,
    SparklesIcon,
  } from '@heroicons/react/24/outline';
  

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [status]);

  if (status === 'loading') return <div>Loading...</div>;

  const features = [
    {
      title: 'Location',
      href: '/location',
      description: 'Find people near you.',
      icon: <MapPinIcon className="w-12 h-12 text-pinkTrans group-hover:scale-110 group-hover:text-blueTrans transition-transform duration-300" />,
    },
    {
      title: 'Swipe',
      href: '/swipe',
      description: 'Swipe to connect with others.',
      icon: <HeartIcon className="w-12 h-12 text-pinkTrans group-hover:scale-110 group-hover:text-blueTrans transition-transform duration-300" />,
    },
    {
      title: 'Speed-Dater',
      href: '/speed-dater',
      description: 'Engage in speed dates.',
      icon: <BoltIcon className="w-12 h-12 text-pinkTrans group-hover:scale-110 group-hover:text-blueTrans transition-transform duration-300" />,
    },
    {
      title: 'Interests',
      href: '/interests',
      description: 'Find matches based on interests.',
      icon: <SparklesIcon className="w-12 h-12 text-pinkTrans group-hover:scale-110 group-hover:text-blueTrans transition-transform duration-300" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pinkTrans via-blueTrans to-whiteTrans dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300 animate-gradient">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">
        Welcome to Gendr, {session?.user.name || 'User'}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-12">
        Explore features to connect and meet others.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full px-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            onClick={() => router.push(feature.href)}
            className="group cursor-pointer p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition text-center border-4 border-pinkTrans dark:border-pink-600"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {feature.title}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
