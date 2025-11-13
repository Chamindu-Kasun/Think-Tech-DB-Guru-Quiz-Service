'use client';

import { useState, useEffect, useCallback } from 'react';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
}

interface QuizComponentProps {
  title: string;
  questions: QuizQuestion[];
  onComplete: () => void;
  autoCompleteSignal: number;
  remainingSeconds: number;
  isLocked: boolean;
}

export default function QuizComponent({
  title,
  questions,
  onComplete,
  autoCompleteSignal,
  remainingSeconds,
  isLocked
}: QuizComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanations, setShowExplanations] = useState(false);

  // Reset state when new questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      setScore(0);
      setShowExplanations(false);
    }
  }, [questions]);

  // Handle auto-complete when timer runs out
  useEffect(() => {
    if (autoCompleteSignal > 0) {
      handleSubmitQuiz();
    }
  }, [autoCompleteSignal]);

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmitQuiz = useCallback(() => {
    if (questions.length === 0) return;
    
    let correctCount = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setShowResults(true);
  }, [questions, selectedAnswers]);

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const answered = Object.keys(selectedAnswers).length;
    return questions.length > 0 ? (answered / questions.length) * 100 : 0;
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">No questions available</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quiz Complete!</h2>
          <div className="text-6xl font-bold mb-4">
            <span className={score >= questions.length * 0.8 ? 'text-green-600' : score >= questions.length * 0.6 ? 'text-yellow-600' : 'text-red-600'}>
              {score}/{questions.length}
            </span>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {Math.round((score / questions.length) * 100)}% Score
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showExplanations ? 'Hide' : 'Show'} Explanations
          </button>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            New Quiz
          </button>
        </div>

        {showExplanations && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Answer Explanations</h3>
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="border rounded-lg p-4 dark:border-gray-700">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Q{index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">{question.question}</p>
                      <div className="space-y-2">
                        {question.options.map(option => {
                          const isUserChoice = userAnswer === option.id;
                          const isCorrectAnswer = option.id === question.correctAnswer;
                          
                          return (
                            <div
                              key={option.id}
                              className={`p-2 rounded text-sm ${
                                isCorrectAnswer
                                  ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-100'
                                  : isUserChoice && !isCorrect
                                  ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-100'
                                  : 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {option.id.toUpperCase()}) {option.text}
                              {isCorrectAnswer && ' ✓'}
                              {isUserChoice && !isCorrect && ' ✗'}
                            </div>
                          );
                        })}
                      </div>
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      isCorrect ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <div className="flex items-center gap-4">
          {isLocked && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg dark:bg-red-900 dark:text-red-100">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{formatTime(remainingSeconds)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Object.keys(selectedAnswers).length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium dark:bg-blue-900 dark:text-blue-100">
            {currentIndex + 1}
          </span>
          <div className="flex-1">
            <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </p>
            {currentQuestion.category && (
              <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs dark:bg-gray-700 dark:text-gray-300">
                {currentQuestion.category}
              </span>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 ml-11">
          {currentQuestion.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
              disabled={showResults}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedAnswers[currentQuestion.id] === option.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              <span className="inline-block w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mr-3 text-center leading-8 dark:bg-gray-700 dark:text-gray-300">
                {option.id.toUpperCase()}
              </span>
              <span className="text-gray-900 dark:text-white">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}