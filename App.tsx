
import React, { useState } from 'react';
import { lessons } from './data/lessons';
import { AppTab, Lesson } from './types';
import AudioButton from './components/AudioButton';
import ExerciseList from './components/ExerciseList';

const App: React.FC = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VOCABULARY);

  const currentLesson = lessons[currentLessonIndex];

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setActiveTab(AppTab.VOCABULARY);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      setActiveTab(AppTab.VOCABULARY);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Fluent English</h1>
              <p className="text-xs text-slate-500 font-medium">Nível Intermediário</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handlePrevLesson}
              disabled={currentLessonIndex === 0}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="px-3 py-1 bg-slate-100 rounded-md flex items-center">
              <span className="text-sm font-bold text-slate-700">Lição {currentLesson.id}</span>
            </div>
            <button 
              onClick={handleNextLesson}
              disabled={currentLessonIndex === lessons.length - 1}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 shadow-inner">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">{currentLesson.subtitle}</h2>
          <p className="text-blue-100 opacity-90">Lição {currentLesson.id} • Tópico Intermediário</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto w-full px-4 -mt-6">
        <nav className="flex bg-white rounded-xl shadow-lg p-1 gap-1 overflow-x-auto">
          {[
            { id: AppTab.VOCABULARY, label: 'Vocabulário' },
            { id: AppTab.PHRASES, label: 'Frases' },
            { id: AppTab.GRAMMAR, label: 'Gramática' },
            { id: AppTab.DIALOGUE, label: 'Diálogo' },
            { id: AppTab.EXERCISES, label: 'Exercícios' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AppTab)}
              className={`flex-1 min-w-[100px] py-3 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
        
        {activeTab === AppTab.VOCABULARY && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {currentLesson.vocabulary.map((section, idx) => (
              <section key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                  <h3 className="text-lg font-bold text-slate-800">{section.title}</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {section.items.map((item, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <AudioButton text={item.english} />
                        <div>
                          <p className="text-lg font-bold text-slate-900">{item.english}</p>
                          <p className="text-slate-500">{item.portuguese}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {activeTab === AppTab.PHRASES && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {currentLesson.phrases.map((phrase, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
                <AudioButton text={phrase.english} />
                <div>
                  <p className="text-lg font-bold text-slate-900 mb-1">{phrase.english}</p>
                  <p className="text-slate-600">{phrase.portuguese}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === AppTab.GRAMMAR && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="bg-yellow-100 text-yellow-700 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                </span>
                Explicação Gramatical
              </h3>
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {currentLesson.explanation || 'Esta lição foca na prática direta de vocabulário e expressões situacionais.'}
              </div>
            </div>
          </div>
        )}

        {activeTab === AppTab.DIALOGUE && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Prática de Listening</h3>
                <AudioButton text={currentLesson.dialogue.map(d => `${d.speaker}: ${d.text}`).join(' ')} size="lg" />
              </div>
              <div className="space-y-6">
                {currentLesson.dialogue.map((line, idx) => (
                  <div key={idx} className={`flex gap-4 ${line.speaker === 'A' ? 'flex-row' : 'flex-row-reverse text-right'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${line.speaker === 'A' ? 'bg-blue-500' : 'bg-indigo-500'}`}>
                      {line.speaker}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-md ${line.speaker === 'A' ? 'bg-blue-50 rounded-tl-none' : 'bg-indigo-50 rounded-tr-none'}`}>
                      <p className="text-slate-800 font-medium">{line.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center text-sm text-slate-500 italic">
                Pressione o botão de áudio acima para ouvir o diálogo completo.
              </p>
            </div>
          </div>
        )}

        {activeTab === AppTab.EXERCISES && (
          <div className="animate-in fade-in duration-300">
            <ExerciseList exercises={currentLesson.exercises} />
          </div>
        )}

      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-slate-400 text-sm">
          <span>&copy; 2024 Fluent English App</span>
          <div className="flex gap-4">
            <button className="hover:text-blue-600">Suporte</button>
            <button className="hover:text-blue-600">Configurações</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
