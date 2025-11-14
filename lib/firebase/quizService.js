import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  writeBatch,
  doc,
  increment
} from 'firebase/firestore';
import { db } from './config.js';

// Collection name for quiz questions
const COLLECTION_NAME = 'quiz_questions';

export async function saveQuizQuestions(questions, metadata = {}) {
  if (!db) {
    console.warn('Firebase not initialized, cannot save questions');
    return false;
  }

  try {
    const batch = writeBatch(db);
    const questionsCollection = collection(db, COLLECTION_NAME);
    
    // Create a batch ID for this set of questions
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Validate and clean questions before saving
    const validQuestions = questions.filter((question, index) => {
      // Check if required fields exist and are valid
      if (!question || typeof question !== 'object') {
        console.warn(`Question at index ${index} is not a valid object`);
        return false;
      }

      // Validate question text
      if (!question.question || typeof question.question !== 'string' || question.question.trim() === '') {
        console.warn(`Question at index ${index} has invalid question text`);
        return false;
      }

      // Validate options
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        console.warn(`Question at index ${index} must have exactly 4 options`);
        return false;
      }

      // Validate each option
      const validOptions = question.options.every((option, optIndex) => {
        if (!option || typeof option !== 'object') return false;
        if (!option.id || !['a', 'b', 'c', 'd'].includes(option.id)) {
          console.warn(`Question ${index}, option ${optIndex}: Invalid option ID`);
          return false;
        }
        if (!option.text || typeof option.text !== 'string' || option.text.trim() === '') {
          console.warn(`Question ${index}, option ${optIndex}: Invalid option text`);
          return false;
        }
        return true;
      });

      if (!validOptions) {
        console.warn(`Question at index ${index} has invalid options`);
        return false;
      }

      // Validate correct answer
      if (!question.correctAnswer || !['a', 'b', 'c', 'd'].includes(question.correctAnswer)) {
        console.warn(`Question at index ${index} has invalid correct answer`);
        return false;
      }

      return true;
    });

    if (validQuestions.length === 0) {
      console.warn('No valid questions to save to Firebase');
      return false;
    }
    
    // Add documents to batch
    validQuestions.forEach((question, index) => {
      const docRef = doc(questionsCollection);
      
      // Clean and prepare question data for Firebase
      const questionData = {
        // Core question data
        id: question.id || `q_${Date.now()}_${index}`,
        category: question.category || 'Database Fundamentals',
        question: question.question.trim(),
        options: question.options.map(opt => ({
          id: opt.id,
          text: opt.text.trim()
        })),
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || 'No explanation provided',
        
        // Metadata
        metadata: {
          ...metadata,
          batchId: batchId,
          source: metadata.source || 'unknown',
          language: metadata.language || 'english',
          createdAt: serverTimestamp(),
          version: '1.0'
        },
        
        // Usage tracking
        usageCount: 0,
        lastUsed: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      batch.set(docRef, questionData);
    });

    await batch.commit();
    console.log(`✅ Saved ${validQuestions.length} valid questions to Firebase question bank (Batch: ${batchId})`);
    
    if (validQuestions.length < questions.length) {
      console.warn(`⚠️ Filtered out ${questions.length - validQuestions.length} invalid questions`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error saving questions to Firebase:', error);
    return false;
  }
}

export async function getQuizQuestions(count = 40, filters = {}) {
  if (!db) {
    console.warn('Firebase not initialized, cannot retrieve questions');
    return [];
  }

  try {
    const questionsCollection = collection(db, COLLECTION_NAME);
    
    // Build query based on available indexes
    let questionsQuery = query(questionsCollection);
    
    // Apply language filter if provided and if we have an index for it
    if (filters.language) {
      questionsQuery = query(questionsCollection, 
        where('metadata.language', '==', filters.language)
      );
    }
    
    // If no specific filters, get all questions and apply other filters in memory
    const querySnapshot = await getDocs(questionsQuery);
    
    if (querySnapshot.empty) {
      console.warn('No questions found in Firebase question bank');
      return [];
    }

    let allQuestions = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Additional in-memory filtering for complex conditions
      let includeQuestion = true;
      
      // Filter by source if specified
      if (filters.source && data.metadata?.source !== filters.source) {
        includeQuestion = false;
      }
      
      // Filter by category if specified
      if (filters.category && data.category !== filters.category) {
        includeQuestion = false;
      }
      
      // Filter by difficulty if specified
      if (filters.difficulty && data.metadata?.difficulty) {
        const questionDifficulties = Array.isArray(data.metadata.difficulty) 
          ? data.metadata.difficulty 
          : [data.metadata.difficulty];
        const filterDifficulties = Array.isArray(filters.difficulty)
          ? filters.difficulty
          : [filters.difficulty];
        
        const hasMatchingDifficulty = questionDifficulties.some(qd => 
          filterDifficulties.includes(qd)
        );
        
        if (!hasMatchingDifficulty) {
          includeQuestion = false;
        }
      }

      if (includeQuestion) {
        // Ensure the question data is properly structured
        const validatedQuestion = {
          id: data.id || doc.id,
          category: data.category || 'Database Fundamentals',
          question: data.question || '',
          options: Array.isArray(data.options) ? data.options : [],
          correctAnswer: data.correctAnswer || '',
          explanation: data.explanation || 'No explanation provided',
          metadata: data.metadata || {},
          firebaseDocId: doc.id
        };

        // Final validation before including
        if (validatedQuestion.question && 
            validatedQuestion.options.length === 4 &&
            ['a', 'b', 'c', 'd'].includes(validatedQuestion.correctAnswer)) {
          allQuestions.push(validatedQuestion);
        }
      }
    });

    if (allQuestions.length === 0) {
      console.warn('No questions matched the specified filters');
      return [];
    }

    // Improved random selection with Fisher-Yates shuffle
    const shuffledQuestions = [...allQuestions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(count, shuffledQuestions.length));
    
    console.log(`✅ Retrieved ${selectedQuestions.length} random questions from Firebase (${allQuestions.length} total available)`);
    
    // Update usage statistics for selected questions (non-blocking)
    if (selectedQuestions.length > 0) {
      updateUsageStatistics(selectedQuestions).catch(error => {
        console.warn('Non-critical error updating usage statistics:', error);
      });
    }
    
    return selectedQuestions;
  } catch (error) {
    console.error('❌ Error retrieving questions from Firebase:', error);
    return [];
  }
}

// Helper function to update usage statistics (non-blocking)
async function updateUsageStatistics(questions) {
  if (!db || questions.length === 0) return;

  try {
    const batch = writeBatch(db);
    const updatePromises = [];
    
    // Process in smaller batches to avoid Firebase limits
    const batchSize = 50;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batchQuestions = questions.slice(i, i + batchSize);
      
      batchQuestions.forEach(question => {
        if (question.firebaseDocId) {
          const docRef = doc(db, COLLECTION_NAME, question.firebaseDocId);
          batch.update(docRef, {
            usageCount: increment(1),
            lastUsed: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      });
      
      // Commit this batch
      if (batch._mutations.length > 0) {
        updatePromises.push(batch.commit());
      }
    }
    
    await Promise.all(updatePromises);
    console.log(`📊 Updated usage statistics for ${questions.length} questions`);
  } catch (error) {
    console.warn('Could not update usage statistics:', error);
    // Don't throw - this is non-critical
  }
}

// Additional utility functions
export async function getQuestionStats() {
  if (!db) return null;

  try {
    const questionsQuery = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(questionsQuery);
    
    const stats = {
      totalQuestions: querySnapshot.size,
      categories: {},
      sources: {},
      languages: {}
    };
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      
      // Count by category
      const category = data.category || 'Unknown';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
      
      // Count by source
      const source = data.metadata?.source || 'unknown';
      stats.sources[source] = (stats.sources[source] || 0) + 1;
      
      // Count by language
      const language = data.metadata?.language || 'unknown';
      stats.languages[language] = (stats.languages[language] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting question stats:', error);
    return null;
  }
}

export async function cleanupInvalidQuestions() {
  if (!db) return 0;

  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const batch = writeBatch(db);
    let deletedCount = 0;

    querySnapshot.forEach(doc => {
      const data = doc.data();
      
      // Criteria for invalid questions
      const isInvalid = 
        !data.question || 
        typeof data.question !== 'string' ||
        data.question.trim() === '' ||
        !Array.isArray(data.options) ||
        data.options.length !== 4 ||
        !['a', 'b', 'c', 'd'].includes(data.correctAnswer);

      if (isInvalid) {
        batch.delete(doc.ref);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      await batch.commit();
      console.log(`🧹 Cleaned up ${deletedCount} invalid questions`);
    }

    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up invalid questions:', error);
    return 0;
  }
}