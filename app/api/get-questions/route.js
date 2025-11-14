import { NextResponse } from 'next/server';
import { getQuizQuestions } from '@/lib/firebase/quizService.js';

// Helper function to handle both GET and POST requests
async function handleQuestionRequest(params) {
  const { count = 40, language = null, source = null, category = null } = params;

  // Validate count parameter
  const validatedCount = Math.min(Math.max(parseInt(count) || 40, 1), 100); // Limit to 1-100 questions


  const filters = {};
  if (language && typeof language === 'string') {
    filters.language = language.trim();
  }
  if (source && typeof source === 'string') {
    filters.source = source.trim();
  }
  if (category && typeof category === 'string') {
    filters.category = category.trim();
  }


  // Retrieve questions from Firebase
  const questions = await getQuizQuestions(validatedCount, filters);

  if (questions.length === 0) {
    return {
      success: false,
      message: 'No questions found matching the specified criteria',
      data: [],
      count: 0
    };
  }

  // Format questions with consistent structure
  const formattedQuestions = questions.map((question, index) => {
    // Ensure options have the correct structure
    const validatedOptions = Array.isArray(question.options) 
      ? question.options.map(opt => ({
          id: opt?.id || 'a',
          text: opt?.text || 'Invalid option'
        }))
      : [
          { id: 'a', text: 'Option A' },
          { id: 'b', text: 'Option B' },
          { id: 'c', text: 'Option C' },
          { id: 'd', text: 'Option D' }
        ];

    return {
      id: question.id || `q_${Date.now()}_${index}`,
      category: question.category || 'Database Fundamentals',
      question: question.question || 'No question text available',
      options: validatedOptions,
      correctAnswer: ['a', 'b', 'c', 'd'].includes(question.correctAnswer) 
        ? question.correctAnswer 
        : 'a', // Default to 'a' if invalid
      explanation: question.explanation || 'No explanation provided'
    };
  });

  return {
    success: true,
    count: formattedQuestions.length,
    data: formattedQuestions,
    filters: Object.keys(filters).length > 0 ? filters : undefined
  };
}

export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    
    const params = {
      count: searchParams.get('count'),
      language: searchParams.get('language'),
      source: searchParams.get('source'),
      category: searchParams.get('category')
    };

    const result = await handleQuestionRequest(params);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ GET Error retrieving questions:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve questions from database',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    let requestData = {};
    
    try {
      requestData = await request.json();
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON in request body'
      }, { status: 400 });
    }

    const { count, language, source, category } = requestData;

    const params = {
      count: count,
      language: language,
      source: source,
      category: category
    };

    const result = await handleQuestionRequest(params);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ POST Error retrieving questions:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve questions from database',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
