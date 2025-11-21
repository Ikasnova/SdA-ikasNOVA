import React from 'react';
import { EducationalStage, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface StageSelectorProps {
  onSelect: (stage: EducationalStage) => void;
  language: Language;
}

const StageSelector: React.FC<StageSelectorProps> = ({ onSelect, language }) => {
  const t = TRANSLATIONS[language];

  const stages = [
    { id: EducationalStage.INFANTIL, color: 'bg-brand-teal', label: t.stageLabels["Infantil"] },
    { id: EducationalStage.PRIMARIA, color: 'bg-brand-blue', label: t.stageLabels["Primaria"] },
    { id: EducationalStage.ESO, color: 'bg-brand-main', label: t.stageLabels["ESO"] },
    { id: EducationalStage.BACHILLERATO, color: 'bg-brand-dark', label: t.stageLabels["Bachillerato"] },
    { id: EducationalStage.FP, color: 'bg-brand-black', label: t.stageLabels["Formación Profesional"] },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-dark mb-1 tracking-tight uppercase">
          {t.selectStageTitle}
        </h2>
        <div className="h-1 w-12 bg-brand-teal mx-auto mb-3"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => onSelect(stage.id)}
            className="group bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center flex flex-col overflow-hidden border border-gray-200 hover:border-gray-300 rounded-sm"
          >
            {/* Colored Band */}
            <div className={`h-2 w-full ${stage.color}`}></div>
            
            <div className="p-4 flex items-center justify-center h-full">
              <h3 className="text-xs md:text-sm font-bold text-brand-dark group-hover:text-brand-blue transition-colors uppercase tracking-tight">
                {stage.label}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StageSelector;