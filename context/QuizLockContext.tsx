'use client';

import { createContext, useState, ReactNode } from 'react';

interface QuizLockContextType {
  locked: boolean;
  setLocked: (locked: boolean) => void;
}

const defaultValue: QuizLockContextType = {
  locked: false,
  setLocked: () => {},
};

export const QuizLockContext = createContext<QuizLockContextType>(defaultValue);

interface QuizLockProviderProps {
  children: ReactNode;
}

export function QuizLockProvider({ children }: QuizLockProviderProps) {
  const [locked, setLocked] = useState(false);

  return (
    <QuizLockContext.Provider value={{ locked, setLocked }}>
      {children}
    </QuizLockContext.Provider>
  );
}