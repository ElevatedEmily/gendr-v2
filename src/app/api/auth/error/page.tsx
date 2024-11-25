'use client';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
        <p className="text-gray-700 mt-4">
          Something went wrong during login. Please try again or contact support.
        </p>
        <a
          href="/login"
          className="mt-6 inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}
