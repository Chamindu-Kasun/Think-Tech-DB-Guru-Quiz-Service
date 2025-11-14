// lib/config/ollama.js
export const OLLAMA_CONFIG = {
  BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  MODEL: process.env.OLLAMA_MODEL || 'phi3mini',
  TIMEOUT: 60000000, 
  HEALTH_CHECK_TIMEOUT: 5000000, 
};

export const PROMPT_TEMPLATES = {
  QUIZ_GENERATION: (count, language, difficultyStr, topics) => `
You are an expert database instructor creating multiple-choice questions (MCQs) for students learning database systems.

Generate ${count} high-quality, conceptually correct, and exam-standard MCQs in ${language}.
Questions must follow a professional style like university-level or certification-style (e.g., Oracle, DBMS courses).

Each question must:
1. Be relevant to database systems and their practical applications.
2. Have exactly four options labeled "a", "b", "c", "d".
3. Contain exactly one correct answer.
4. Include a short, accurate explanation.
5. Cover different ${difficultyStr}-level concepts.
6. Use clear and precise database terminology.

### Topics to Cover:
${Array.isArray(topics) ? topics.join(', ') : topics}

### Expected JSON Output Format:
[
  {
    "id": "q1",
    "category": "SQL | Normalization | ER Modeling | etc.",
    "question": "string",
    "options": [
      { "id": "a", "text": "string" },
      { "id": "b", "text": "string" },
      { "id": "c", "text": "string" },
      { "id": "d", "text": "string" }
    ],
    "correctAnswer": "a" | "b" | "c" | "d",
    "explanation": "string"
  }
]

IMPORTANT: Only return the JSON array. Do not include any markdown formatting, commentary, or explanations outside the JSON.

Example:
[
  {
    "id": "q_sample_1",
    "category": "SQL",
    "question": "Which SQL keyword is used to remove duplicate rows from the result set?",
    "options": [
      { "id": "a", "text": "REMOVE" },
      { "id": "b", "text": "DELETE" },
      { "id": "c", "text": "DISTINCT" },
      { "id": "d", "text": "UNIQUE" }
    ],
    "correctAnswer": "c",
    "explanation": "DISTINCT eliminates duplicate rows from the query result set."
  }
]`
};