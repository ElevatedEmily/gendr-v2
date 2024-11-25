import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">Welcome to Gendr</h1>
      <button
        onClick={() => signIn()}
        className="mt-5 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Get Started
      </button>
    </div>
  );
}
