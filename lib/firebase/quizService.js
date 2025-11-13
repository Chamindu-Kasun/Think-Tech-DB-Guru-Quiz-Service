// lib/firebase/quizService.js
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

/**
 * Save multiple quiz questions to Firebase question bank
 * @param {Array} questions - Array of quiz questions
 * @param {Object} metadata - Additional metadata (topics, difficulty, language, etc.)
 * @returns {Promise<boolean>} - Success status
 */
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
    const validQuestions = questions.filter(question => {
      // Check if required fields exist and are not undefined
      return (
        question && 
        typeof question.question === 'string' &&
        question.question.trim() !== '' &&
        Array.isArray(question.options) &&
        question.options.length === 4 &&
        typeof question.correctAnswer === 'string' &&
        question.correctAnswer.trim() !== ''
      );
    });

    if (validQuestions.length === 0) {
      console.warn('No valid questions to save to Firebase');
      return false;
    }
    
    validQuestions.forEach((question, index) => {
      const docRef = doc(questionsCollection);
      
      // Clean and validate each field to prevent undefined values
      const questionData = {
        // Keep original question data structure with proper validation
        id: question.id || `q_${Date.now()}_${index}`,
        category: question.category || 'General',
        question: question.question || '',
        options: question.options || [],
        correctAnswer: question.correctAnswer || '',
        explanation: question.explanation || 'No explanation provided',
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

/**
 * Retrieve random quiz questions from Firebase question bank
 * @param {number} count - Number of questions to retrieve (default: 40)
 * @param {Object} filters - Optional filters for language, source, etc.
 * @returns {Promise<Array>} - Array of quiz questions
 */
export async function getQuizQuestions(count = 40, filters = {}) {
  if (!db) {
    console.warn('Firebase not initialized, cannot retrieve questions');
    return [];
  }

  try {
    let questionsQuery = collection(db, COLLECTION_NAME);
    
    // For now, avoid complex queries that require composite indexes
    // Get all questions first, then filter in memory for simplicity
    const querySnapshot = await getDocs(questionsQuery);
    let allQuestions = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Apply filters in memory to avoid index requirements
      let includeQuestion = true;
      
      if (filters.language && data.metadata?.language && data.metadata.language !== filters.language) {
        includeQuestion = false;
      }
      
      if (filters.source && data.metadata?.source && data.metadata.source !== filters.source) {
        includeQuestion = false;
      }
      
      if (includeQuestion) {
        allQuestions.push({
          id: data.id,
          category: data.category,
          question: data.question,
          options: data.options,
          correctAnswer: data.correctAnswer,
          explanation: data.explanation,
          metadata: data.metadata,
          firebaseDocId: doc.id
        });
      }
    });

    if (allQuestions.length === 0) {
      console.warn('No questions found in Firebase question bank');
      return [];
    }

    // Randomly shuffle and select the requested count
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
    
    console.log(`✅ Retrieved ${selectedQuestions.length} random questions from Firebase (${allQuestions.length} total available)`);
    
    // Update usage statistics for selected questions (optional, don't fail on error)
    try {
      if (selectedQuestions.length > 0) {
        const batch = writeBatch(db);
        
        for (const question of selectedQuestions) {
          const docRef = doc(db, COLLECTION_NAME, question.firebaseDocId);
          batch.update(docRef, {
            usageCount: increment(1),
            lastUsed: serverTimestamp()
          });
        }
        
        await batch.commit();
      }
    } catch (updateError) {
      console.warn('Could not update usage statistics:', updateError);
      // Don't fail the whole operation for stats
    }
    
    return selectedQuestions;
  } catch (error) {
    console.error('❌ Error retrieving questions from Firebase:', error);
    return [];
  }
}

/**
 * Update usage count for questions (track which ones are used)
 * @param {Array} questionIds - Array of Firebase document IDs
 * @returns {Promise<boolean>} - Success status
 */
export async function updateQuestionUsage(questionIds) {
  if (!db || !questionIds.length) {
    return false;
  }

  try {
    const batch = writeBatch(db);
    
    questionIds.forEach((id) => {
      const docRef = doc(db, COLLECTION_NAME, id);
      batch.update(docRef, {
        usageCount: increment(1),
        lastUsed: serverTimestamp()
      });
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error updating question usage:', error);
    return false;
  }
}

/**
 * Get statistics about the question database
 * @returns {Promise<Object>} - Statistics object
 */
export async function getQuizStatistics() {
  if (!db) {
    return { total: 0, byTopic: {}, byDifficulty: {}, byLanguage: {} };
  }

  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const stats = {
      total: querySnapshot.size,
      byTopic: {},
      byDifficulty: {},
      byLanguage: {},
      bySource: {}
    };

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const metadata = data.metadata || {};

      // Count by language
      const lang = metadata.language || 'unknown';
      stats.byLanguage[lang] = (stats.byLanguage[lang] || 0) + 1;

      // Count by source
      const source = metadata.source || 'unknown';
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;

      // Count by topics
      if (metadata.topics && Array.isArray(metadata.topics)) {
        metadata.topics.forEach(topic => {
          stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
        });
      }

      // Count by difficulty
      if (metadata.difficulty && Array.isArray(metadata.difficulty)) {
        metadata.difficulty.forEach(diff => {
          stats.byDifficulty[diff] = (stats.byDifficulty[diff] || 0) + 1;
        });
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting quiz statistics:', error);
    return { total: 0, byTopic: {}, byDifficulty: {}, byLanguage: {} };
  }
}


// export async function clearOldQuestions(maxAge = 30) {
//   if (!db) {
//     return 0;
//   }

//   try {
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - maxAge);

//     const q = query(
//       collection(db, COLLECTION_NAME),
//       where('createdAt', '<', cutoffDate),
//       where('usageCount', '==', 0) // Only delete unused questions
//     );

//     const querySnapshot = await getDocs(q);
//     const batch = writeBatch(db);

//     querySnapshot.forEach((doc) => {
//       batch.delete(doc.ref);
//     });

//     await batch.commit();
//     return querySnapshot.size;
//   } catch (error) {
//     console.error('Error clearing old questions:', error);
//     return 0;
//   }
// }