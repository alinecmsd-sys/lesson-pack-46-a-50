
import React, { useState } from 'react';
import { Exercise } from '../types';

interface ExerciseListProps {
  exercises: Exercise[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  const [answers, setAnswers] = useState<string[]>(new Array(exercises.length).fill(''));
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const normalize = (text: string) => text.toLowerCase().replace(/[.,!?;]/g, '').trim();

  const isCorrect = (index: number) => {
    return normalize(answers[index]) === normalize(exercises[index].correctAnswer);
  };

  const checkAll = () => {
    setShowResults(true);
  };

  const reset = () => {
    setAnswers(new Array(exercises.length).fill(''));
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Tradução: Português para Inglês</h3>
        <p className="text-sm text-slate-500 mb-6">Traduza as frases abaixo e clique em verificar.</p>
        
        <div className="space-y-8">
          {exercises.map((ex, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-medium">{idx + 1}. {ex.portuguese}</span>
                {showResults && (
                  <span className={isCorrect(idx) ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {isCorrect(idx) ? '✓ Correto' : '✗ Incorreto'}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={answers[idx]}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                className={`w-full p-3 rounded-lg border transition-all ${
                  showResults
                    ? isCorrect(idx)
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Sua resposta em inglês..."
              />
              {showResults && !isCorrect(idx) && (
                <p className="text-sm text-slate-600 mt-1 italic">Resposta sugerida: {ex.correctAnswer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={checkAll}
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Verificar Respostas
          </button>
          {showResults && (
            <button
              onClick={reset}
              className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors"
            >
              Refazer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;
