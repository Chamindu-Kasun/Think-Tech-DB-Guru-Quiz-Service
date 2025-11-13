import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="mb-4">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Think-Tech
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">
                Database Guru
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master database concepts with structured assessment questions.
          </p>
        </header>

        {/* Assessment Types */}
        <main className="max-w-2xl mx-auto">
          {/* Database Assessment */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-800">
                <svg
                  className="w-10 h-10 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Database Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Comprehensive evaluation covering SQL queries, database
                design, normalization principles, ER modeling, and advanced
                database concepts.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                40 carefully curated questions
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                40-minute timed assessment
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Detailed performance analytics
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Comprehensive explanations
              </div>
            </div>

            <Link
              href="/quiz-english"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              Begin Assessment
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © Think Tech - Database Mastery Platform.
          </p>
        </footer>
      </div>
    </div>
  );
}