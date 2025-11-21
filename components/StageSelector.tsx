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
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2 tracking-tight uppercase">
          {t.selectStageTitle}
        </h2>
        <div className="h-1 w-16 bg-brand-teal mx-auto mb-4"></div>
        <p className="text-brand-dark text-sm md:text-base font-light opacity-80 max-w-2xl mx-auto">
          {t.selectStageSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => onSelect(stage.id)}
            className="group relative bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left flex flex-col overflow-hidden border border-gray-100 hover:border-gray-300"
          >
            {/* Colored Band */}
            <div className={`h-2 w-full ${stage.color}`}></div>
            
            <div className="p-4 flex flex-col h-full justify-between">
              <h3 className="text-sm md:text-base font-bold text-brand-dark group-hover:text-brand-blue transition-colors uppercase tracking-tight leading-tight">
                {stage.label}
              </h3>
              
              <div className="mt-3 pt-3 border-t border-gray-100 w-full flex justify-between items-end">
                 <span className="text-[10px] text-gray-400 leading-tight font-light">
                    {t.officialDecree}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${stage.color} opacity-20 group-hover:opacity-100 transition-opacity`}></span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StageSelector;