'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get('matchId');
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!matchId) {
      setError('Match ID is missing.');
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?matchId=${matchId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [matchId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, content: newMessage }),
      });
      if (!res.ok) {
        throw new Error('Failed to send message');
      }
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setNewMessage('');
    } catch (err) {
      setError(err.message || 'Failed to send message');
    }
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
        <p className="p-4 text-lg font-semibold">Chats</p>
      </div>
      <div className="w-3/4 flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex-grow overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <p
                className={`${
                  message.senderId === matchId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                } p-2 rounded`}
              >
                {message.content}
              </p>
            </div>
          ))}
        </div>
        <div className="p-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow border rounded p-2 mr-2"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
