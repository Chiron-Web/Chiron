'use client';
import { createContext, useContext, useState } from 'react';

const ClassificationContext = createContext();

export const ClassificationProvider = ({ children }) => {
  const [classificationResult, setClassificationResult] = useState(null);
  const [submittedText, setSubmittedText] = useState('');

  return (
    <ClassificationContext.Provider value={{ classificationResult, setClassificationResult, submittedText, setSubmittedText }}>
      {children}
    </ClassificationContext.Provider>
  );
};

export const useClassification = () => useContext(ClassificationContext);
