export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-16 w-96 h-96 bg-pink-300 dark:bg-pink-700 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 dark:bg-blue-700 rounded-full opacity-30 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl p-8 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg backdrop-blur-md">
        <header className="w-full mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gendr</h1>
          <nav>
            <a
              href="/signup"
              className="px-4 py-2 bg-blue-500 dark:bg-blue-700 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-800 transition text-white"
            >
              Sign Up
            </a>
            <a
              href="/login"
              className="ml-4 px-4 py-2 bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition text-white"
            >
              Log In
            </a>
          </nav>
        </header>

        <main className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">
            Welcome to Gendr 💕
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Meet gender queer people who share your interests and values. Gendr
            is designed to help you connect and build meaningful relationships.
            Sign up now and join the fun!
          </p>
          <div className="flex space-x-4 justify-center">
            <a
              href="/signup"
              className="px-6 py-3 bg-pink-500 dark:bg-pink-700 text-white font-semibold rounded-lg hover:bg-pink-600 dark:hover:bg-pink-800 transition"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-6 py-3 bg-blue-500 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-800 transition"
            >
              Log In
            </a>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-gray-400 dark:text-gray-500 text-sm">
        © {new Date().getFullYear()} Gendr. All rights reserved.
      </footer>
    </div>
  );
}
