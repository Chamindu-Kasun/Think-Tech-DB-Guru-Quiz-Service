// app/api/get-questions/route.js
import { NextResponse } from 'next/server';
import { getQuizQuestions } from '@/lib/firebase/quizService.js';

export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count')) || 40;
    const language = searchParams.get('language') || null; // Don't default to 'english' to avoid index issues
    const source = searchParams.get('source') || null;

    // Create filters object, only add language filter if specified
    const filters = {};
    if (language) {
      filters.language = language;
    }
    if (source) {
      filters.source = source;
    }

    // Retrieve questions from Firebase
    const questions = await getQuizQuestions(count, filters);

    if (questions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No questions found in database',
        data: []
      }, { status: 404 });
    }

    // Format questions with only the specified fields
    const formattedQuestions = questions.map((question, index) => ({
      id: question.id || `q_${Date.now()}_${index}`,
      category: question.category || 'General',
      question: question.question || '',
      options: question.options || [],
      correctAnswer: question.correctAnswer || '',
      explanation: question.explanation || 'No explanation provided'
    }));

    return NextResponse.json({
      success: true,
      count: formattedQuestions.length,
      data: formattedQuestions
    });

  } catch (error) {
    console.error('❌ Error retrieving questions:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve questions from database',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const requestData = await request.json();
    const { count = 40, language = null, source = null } = requestData;

    // Create filters object, only add filters if specified
    const filters = {};
    if (language) {
      filters.language = language;
    }
    if (source) {
      filters.source = source;
    }

    // Retrieve questions from Firebase
    const questions = await getQuizQuestions(count, filters);

    if (questions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No questions found in database',
        data: []
      }, { status: 404 });
    }

    // Format questions with only the specified fields
    const formattedQuestions = questions.map((question, index) => ({
      id: question.id || `q_${Date.now()}_${index}`,
      category: question.category || 'General',
      question: question.question || '',
      options: question.options || [],
      correctAnswer: question.correctAnswer || '',
      explanation: question.explanation || 'No explanation provided'
    }));

    return NextResponse.json({
      success: true,
      count: formattedQuestions.length,
      data: formattedQuestions
    });

  } catch (error) {
    console.error('❌ Error retrieving questions:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve questions from database',
      error: error.message
    }, { status: 500 });
  }
}