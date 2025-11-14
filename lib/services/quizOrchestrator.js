import { OllamaService, extractQuestionsFromText } from '@/lib/services/ollamaService.js';
import { getQuizQuestions, saveQuizQuestions } from '@/lib/firebase/quizService.js';
import { fallbackQuestions } from '@/lib/data/fallbackQuestions.js';

export class QuizOrchestrator {
  static async generateQuiz(requestData = {}) {
    const {
      topics = [],
      difficulty = ['beginner', 'intermediate', 'advanced'],
      language = 'english',
      count = 40
    } = requestData;

    try {
      // Try Ollama first
      console.log('Attempting to generate questions via Ollama...');
      const ollamaQuestions = await this.tryOllamaGeneration(count, language, difficulty, topics);
      
      if (ollamaQuestions) {
        await this.saveToFirebase(ollamaQuestions, { topics, difficulty, language, source: 'ollama' });
        return {
          quiz: ollamaQuestions,
          source: 'ollama'
        };
      }
    } catch (error) {
      console.error('Ollama generation failed:', error.message);
    }

    // Try Firebase fallback
    try {
      console.log('Trying Firebase fallback...');
      const firebaseQuestions = await getQuizQuestions(count, { language });
      
      if (firebaseQuestions.length > 0) {
        console.log(`Retrieved ${firebaseQuestions.length} questions from Firebase`);
        return {
          quiz: firebaseQuestions,
          source: 'firebase',
          warning: 'Using saved questions from Firebase'
        };
      }
    } catch (error) {
      console.error('Firebase fallback failed:', error.message);
    }

    // Final fallback to hardcoded questions
    console.log('Using hardcoded fallback questions');
    return {
      quiz: fallbackQuestions.slice(0, Math.min(count, fallbackQuestions.length)),
      source: 'fallback',
      warning: 'Using hardcoded fallback questions'
    };
  }

  static async tryOllamaGeneration(count, language, difficulty, topics) {
    // Check if Ollama is available
    await OllamaService.healthCheck();
    
    // Generate questions via Ollama
    const text = await OllamaService.generateQuizQuestions(count, language, difficulty, topics);
    const cleanText = text.replace(/```json|```/gi, '').trim();

    // Parse the response
    const questions = extractQuestionsFromText(cleanText);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Failed to parse questions from Ollama response');
    }

    console.log(`Successfully generated ${questions.length} questions via Ollama`);
    return questions;
  }

  static async saveToFirebase(questions, metadata) {
    try {
      await saveQuizQuestions(questions, metadata);
      console.log('Successfully saved questions to Firebase');
    } catch (error) {
      console.warn('Failed to save questions to Firebase:', error.message);
    }
  }
}