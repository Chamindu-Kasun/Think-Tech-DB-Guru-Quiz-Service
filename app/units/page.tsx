'use client';
import Link from 'next/link';
import { useState } from 'react';
import { dbUnits, getUnitsByDifficulty } from '@/lib/data/units.js';

export default function UnitsPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  
  const filteredUnits = selectedDifficulty === 'All' 
    ? dbUnits 
    : getUnitsByDifficulty(selectedDifficulty);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="mb-4">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              📚 Database Learning
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">
                Units
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Choose a unit to practice targeted quiz questions and master specific database concepts.
          </p>

          {/* Difficulty Filter */}
          <div className="flex justify-center gap-2 flex-wrap">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDifficulty === difficulty
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </header>

        {/* Units Grid */}
        <main className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <Link
                key={unit.id}
                href={`/units/${unit.id}`}
                className="group block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-center mb-4">
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${unit.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {unit.icon}
                  </div>
                  
                  {/* Difficulty Badge */}
                  <div className="flex justify-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(unit.difficulty)}`}>
                      {unit.difficulty}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    {unit.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {unit.description}
                  </p>
                </div>

                {/* Topics */}
                <div className="space-y-2 mb-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Topics:</p>
                  <div className="flex flex-wrap gap-1">
                    {unit.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                    {unit.topics.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        +{unit.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <div className={`bg-gradient-to-r ${unit.color} text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:shadow-lg transition-all`}>
                    Start Quiz →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredUnits.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No units found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try selecting a different difficulty level.
              </p>
            </div>
          )}
        </main>

        {/* Stats Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{dbUnits.length}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Total Units</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{getUnitsByDifficulty('Beginner').length}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Beginner</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600">{getUnitsByDifficulty('Intermediate').length}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Intermediate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">{getUnitsByDifficulty('Advanced').length}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Advanced</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Want a Mixed Challenge?</h3>
            <p className="text-blue-100 mb-6">
              Try our comprehensive database quiz with questions from all units
            </p>
            <Link
              href="/quiz-english"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Take Full Quiz 🚀
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}