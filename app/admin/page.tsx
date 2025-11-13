'use client';

import { useState, useEffect } from 'react';
import { getQuizStatistics } from '@/lib/firebase/quizService';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statistics = await getQuizStatistics();
      setStats(statistics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading Firebase statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Firebase Connection Error
            </h2>
            <p className="text-red-600 dark:text-red-300">{error}</p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              Make sure Firebase is configured in your .env.local file
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your Firebase question database and view statistics
          </p>
          <button
            onClick={loadStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Stats
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats?.total || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Questions
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Object.keys(stats?.byTopic || {}).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Topics Covered
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Object.keys(stats?.byLanguage || {}).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Languages
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats?.bySource?.ollama || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              AI Generated
            </div>
          </div>
        </div>

        {/* Statistics Tables */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Questions by Topic
            </h2>
            <div className="space-y-2">
              {Object.entries(stats?.byTopic || {})
                .sort(([,a], [,b]) => b - a)
                .map(([topic, count]) => (
                <div key={topic} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Questions by Language
            </h2>
            <div className="space-y-2">
              {Object.entries(stats?.byLanguage || {})
                .sort(([,a], [,b]) => b - a)
                .map(([language, count]) => (
                <div key={language} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{language}</span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Questions by Difficulty
            </h2>
            <div className="space-y-2">
              {Object.entries(stats?.byDifficulty || {})
                .sort(([,a], [,b]) => b - a)
                .map(([difficulty, count]) => (
                <div key={difficulty} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{difficulty}</span>
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Questions by Source
            </h2>
            <div className="space-y-2">
              {Object.entries(stats?.bySource || {})
                .sort(([,a], [,b]) => b - a)
                .map(([source, count]) => (
                <div key={source} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{source}</span>
                  <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-sm">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Firebase Status */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Firebase Status
          </h2>
          {stats?.total > 0 ? (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Connected and operational
            </div>
          ) : (
            <div className="flex items-center text-yellow-600 dark:text-yellow-400">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              Connected but no questions stored yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}