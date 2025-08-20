
"use client";

import { createContext, useContext } from 'react';

type ExplanationContextType = {
  handleExplain: (concept: string) => void;
};

// Create a context to hold the handleExplain function.
// This avoids prop-drilling it down through multiple layers.
export const ExplanationContext = createContext<ExplanationContextType>({ handleExplain: () => {} });

// Custom hook to easily access the context
export const useExplanation = () => useContext(ExplanationContext);
