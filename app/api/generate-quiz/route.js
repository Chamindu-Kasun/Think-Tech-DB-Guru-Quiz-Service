// app/api/generate-quiz/route.js
import { NextResponse } from 'next/server';
import { QuizOrchestrator } from '@/lib/services/quizOrchestrator.js';
import { dbTopics } from '@/lib/data/fallbackQuestions.js';

export async function POST(request) {
  let requestData = {};
  
  try {
    // Parse request body once
    requestData = await request.json();
  } catch (error) {
    console.error('Error parsing request JSON:', error);
  }

  const { topics = dbTopics, difficulty = ['beginner', 'intermediate', 'advanced'], language = 'english' } = requestData;
  const count = requestData.count || 40;

  try {
    const result = await QuizOrchestrator.generateQuiz({
      topics,
      difficulty,
      language,
      count
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Quiz generation failed:', error);
    
    // Return fallback questions with error information
    const fallbackQuiz = fallbackQuestions.slice(0, Math.min(count, fallbackQuestions.length));
    
    return NextResponse.json({
      quiz: fallbackQuiz,
      source: 'fallback',
      error: error.message,
      warning: 'All generation methods failed - using hardcoded fallback'
    });
  }
}

// Optional: Add GET method for health checking
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'Quiz generation API is running',
    available_sources: ['ollama', 'firebase', 'fallback']
  });
}