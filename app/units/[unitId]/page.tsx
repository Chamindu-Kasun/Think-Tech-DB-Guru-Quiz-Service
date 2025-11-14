'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuizLockContext } from '@/context/QuizLockContext';
import QuizComponent from '@/components/QuizComponent';
import { getUnitById } from '@/lib/data/units.js';
import Link from 'next/link';

const QUIZ_DURATION_SECONDS = 20 * 60; // 20 minutes for unit quiz

export default function UnitQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { setLocked: setGlobalLocked } = useContext(QuizLockContext);

  const unitId = params.unitId;
  const unit = getUnitById(unitId);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // timer & navigation lock
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [locked, setLocked] = useState(false);
  const timerIdRef = useRef<number | null>(null);

  // signal to force QuizComponent to complete (increment to trigger)
  const [autoCompleteSignal, setAutoCompleteSignal] = useState(0);

  // Redirect if unit not found
  useEffect(() => {
    if (!unit) {
      router.push('/units');
    }
  }, [unit, router]);

  const clearTimer = () => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    setRemainingSeconds(0);
    setLocked(false);
    setGlobalLocked(false);
  };

  const startTimer = (seconds = QUIZ_DURATION_SECONDS) => {
    clearTimer();
    setRemainingSeconds(seconds);
    setLocked(true);
    setGlobalLocked(true);

    timerIdRef.current = window.setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearTimer();
          setGlobalLocked(false);
          setAutoCompleteSignal(s => s + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateUnitQuiz = async (count = 20) => {
    if (!unit) return;
    
    setLoading(true);
    setError(null);
    setQuestions([]);
    clearTimer();
    
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          language: 'english', 
          count,
          topics: unit.topics, // Focus on this unit's topics
          unitId: unit.id,
          unitTitle: unit.title
        }),
      });
      
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error ?? 'Failed to generate unit quiz');
      if (!payload?.quiz || !Array.isArray(payload.quiz)) throw new Error('Invalid quiz format from API');
      
      const qs = payload.quiz.slice(0, count);
      setQuestions(qs);
      
      if (qs.length > 0) startTimer(QUIZ_DURATION_SECONDS);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  // Load quiz on mount
  useEffect(() => {
    if (unit) {
      generateUnitQuiz(20);
    }
    
    return () => {
      clearTimer();
      setGlobalLocked(false);
    };
  }, [unit]);

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const handleRequestNewQuiz = () => {
    generateUnitQuiz(20);
  };

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Unit Not Found</h2>
          <Link 
            href="/units"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Units
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* Unit Header */}
      <div className="max-w-3xl mx-auto mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <Link 
            href="/units"
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Units
          </Link>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            unit.difficulty === 'Beginner' ? 'text-green-600 bg-green-100' :
            unit.difficulty === 'Intermediate' ? 'text-yellow-600 bg-yellow-100' :
            'text-red-600 bg-red-100'
          }`}>
            {unit.difficulty}
          </span>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${unit.color} rounded-xl flex items-center justify-center text-xl text-white`}>
            {unit.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {unit.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{unit.description}</p>
          </div>
        </div>

        {/* Topics */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Focus Areas:</p>
          <div className="flex flex-wrap gap-2">
            {unit.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <span>📝</span>
            <span>20 Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>20 Minutes</span>
          </div>
          {remainingSeconds > 0 && (
            <div className="flex items-center gap-1 text-blue-600">
              <span>🕐</span>
              <span>Time Left: {formatTime(remainingSeconds)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Controls */}
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm">Loading unit questions...</span>
            </div>
          ) : (
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Questions loaded: {questions.length}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => generateUnitQuiz(20)} 
            className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            New Quiz
          </button>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}
      </div>

      {/* Quiz Component */}
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 mx-auto text-indigo-600" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Generating {unit.title} quiz questions…
              </p>
            </div>
          </div>
        ) : (
          <QuizComponent
            title={unit.title}
            questions={questions}
            onComplete={handleRequestNewQuiz}
            autoCompleteSignal={autoCompleteSignal}
            remainingSeconds={remainingSeconds}
            isLocked={locked}
          />
        )}
      </div>

      {/* Unit Navigation */}
      <div className="max-w-3xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Continue Learning
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/units"
              className="flex-1 bg-white dark:bg-gray-800 text-center px-4 py-3 rounded-lg border hover:shadow-md transition-all"
            >
              📚 Browse All Units
            </Link>
            <Link
              href="/quiz-english"
              className="flex-1 bg-blue-600 text-white text-center px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🎯 Take Full Quiz
            </Link>
            <Link
              href="/blog"
              className="flex-1 bg-indigo-600 text-white text-center px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              📖 Read Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}