'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('/api/matches');
        if (!res.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <div>Loading matches...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
        {matches.map((match) => {
          const otherUser =
            match.user1.id === match.currentUserId ? match.user2 : match.user1;
          return (
            <div
              key={match.id}
              className="p-4 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => router.push(`/messages?matchId=${match.id}`)}
            >
              <div className="flex items-center">
                <img
                  src={otherUser.avatarUrl || '/default-avatar.png'}
                  alt={otherUser.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-lg font-semibold">{otherUser.name || 'Anonymous'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-3/4 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p>Select a match to start chatting.</p>
      </div>
    </div>
  );
}
