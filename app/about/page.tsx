'use client';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">About Think Tech DB Guru</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Think Tech DB Guru is dedicated to making database education accessible, engaging, 
              and effective for students, professionals, and anyone interested in mastering database concepts.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">📚 Comprehensive Coverage</h3>
                <p className="text-gray-600">
                  From database fundamentals to advanced topics like NoSQL, Big Data, 
                  and emerging technologies.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">🤖 AI-Powered Questions</h3>
                <p className="text-gray-600">
                  Dynamic quiz generation using advanced AI to create fresh, 
                  relevant questions for continuous learning.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">📊 Progress Tracking</h3>
                <p className="text-gray-600">
                  Monitor your learning journey with detailed statistics and 
                  performance analytics.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-orange-800 mb-3">🎯 Professional Standards</h3>
                <p className="text-gray-600">
                  University-level and certification-standard questions to 
                  prepare you for real-world challenges.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Technology Stack</h2>
            <p className="text-gray-600 mb-4">
              Our platform is built with modern technologies including:
            </p>
            <ul className="text-gray-600 mb-6 list-disc pl-6">
              <li><strong>Next.js 16</strong> - For fast, responsive user experience</li>
              <li><strong>Firebase</strong> - Secure cloud storage and real-time data</li>
              <li><strong>Ollama AI</strong> - Advanced AI for dynamic question generation</li>
              <li><strong>TypeScript</strong> - Type-safe development for reliability</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Commitment</h2>
            <p className="text-gray-600 mb-6">
              We are committed to providing high-quality, accurate, and up-to-date educational 
              content that helps learners achieve their database knowledge goals. Our platform 
              continuously evolves based on user feedback and the latest industry trends.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Get Started Today</h3>
              <p className="text-gray-600 mb-4">
                Ready to test your database knowledge? Start with our comprehensive 
                40-question quiz covering all major database topics.
              </p>
              <a 
                href="/quiz-english" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Learning →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}