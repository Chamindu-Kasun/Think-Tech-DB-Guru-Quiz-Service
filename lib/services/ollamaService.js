// lib/services/ollamaService.js
import { OLLAMA_CONFIG, PROMPT_TEMPLATES } from '@/lib/config/ollama.js';

export class OllamaService {
  static async healthCheck() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_CONFIG.HEALTH_CHECK_TIMEOUT);

    try {
      const response = await fetch(`${OLLAMA_CONFIG.BASE_URL}/api/tags`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Ollama health check failed: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      throw new Error(`Ollama server not responding: ${error.message}`);
    }
  }

  static async generateQuizQuestions(count, language, difficulty, topics) {
    const difficultyStr = Array.isArray(difficulty) ? difficulty.join(', ') : difficulty;
    const prompt = PROMPT_TEMPLATES.QUIZ_GENERATION(count, language, difficultyStr, topics);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_CONFIG.TIMEOUT);

    try {
      const response = await fetch(`${OLLAMA_CONFIG.BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OLLAMA_CONFIG.MODEL,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Ollama request timed out');
      }
      throw error;
    }
  }
}

// Helper function to extract JSON from text response
export function extractQuestionsFromText(text) {
  if (!text || typeof text !== 'string') return null;
  
  const cleaned = text.replace(/```json|```/gi, '').trim();
  
  // Try to find JSON array in the text
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      // Continue to next parsing attempt
    }
  }
  
  // Try parsing the entire cleaned text
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    if (parsed?.quiz && Array.isArray(parsed.quiz)) return parsed.quiz;
  } catch {
    return null;
  }
  
  return null;
}