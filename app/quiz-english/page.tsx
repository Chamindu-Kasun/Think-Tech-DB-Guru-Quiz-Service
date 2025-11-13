'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { QuizLockContext } from '@/context/QuizLockContext';
import QuizComponent from '@/components/QuizComponent';

const QUIZ_DURATION_SECONDS = 10 * 60 * 4; // 40 minutes

export default function EnglishQuizPage() {
  const { setLocked: setGlobalLocked } = useContext(QuizLockContext);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // timer & navigation lock
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [locked, setLocked] = useState(false);
  const timerIdRef = useRef<number | null>(null);

  // signal to force QuizComponent to complete (increment to trigger)
  const [autoCompleteSignal, setAutoCompleteSignal] = useState(0);

  const clearTimer = () => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    setRemainingSeconds(0);
    setLocked(false);
    setGlobalLocked(false); // update global state
  };

  const startTimer = (seconds = QUIZ_DURATION_SECONDS) => {
    clearTimer();
    setRemainingSeconds(seconds);
    setLocked(true);
    setGlobalLocked(true); // update global state

    timerIdRef.current = window.setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearTimer();
          // on time up: unlock global flag after auto-complete
          setGlobalLocked(false);
          // force complete signal
          setAutoCompleteSignal(s => s + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateWithGemini = async (count = 40) => {
    setLoading(true);
    setError(null);
    setQuestions([]); // clear while loading
    clearTimer();
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'english', count }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error ?? 'Failed to generate quiz');
      if (!payload?.quiz || !Array.isArray(payload.quiz)) throw new Error('Invalid quiz format from API');
      const qs = payload.quiz.slice(0, 40);
      setQuestions(qs);
      // start timer only when we have questions
      if (qs.length > 0) startTimer(QUIZ_DURATION_SECONDS);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  // load on mount (40 questions)
  useEffect(() => {
    generateWithGemini(40);
    // cleanup on unmount
    return () => {
      clearTimer();
      setGlobalLocked(false);
    };
  }, []);


  // helper: format seconds to mm:ss
  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // called when user clicks "New Quiz" from completed screen
  const handleRequestNewQuiz = () => {
    generateWithGemini(40);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto mb-4 flex items-center gap-3">
        {loading ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-sm">Loading questions...</span>
          </div>
        ) : (
          <div className="text-sm text-slate-600 dark:text-slate-300">Questions loaded: {questions.length}</div>
        )}

        <button onClick={() => generateWithGemini(40)} className="ml-auto px-3 py-2 border rounded-md text-sm">
          Refresh
        </button>

        {error && <div className="text-sm text-red-500 ml-3">{error}</div>}
      </div>

      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 mx-auto text-indigo-600" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Generating quiz questions…</p>
            </div>
          </div>
        ) : (
          <QuizComponent
            title="Database Design & Development"
            questions={questions}
            onComplete={handleRequestNewQuiz} // page will fetch a new quiz only when user requests
            autoCompleteSignal={autoCompleteSignal}
            remainingSeconds={remainingSeconds}
            isLocked={locked}
          />
        )}
      </div>
    </div>
  );
}