import React from 'react';
import { EducationalStage, Language } from '../types';
import { Baby, School, GraduationCap, BookOpen, Briefcase } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface StageSelectorProps {
  onSelect: (stage: EducationalStage) => void;
  language: Language;
}

const StageSelector: React.FC<StageSelectorProps> = ({ onSelect, language }) => {
  const t = TRANSLATIONS[language];

  const stages = [
    { id: EducationalStage.INFANTIL, icon: Baby, label: t.stageLabels["Infantil"] },
    { id: EducationalStage.PRIMARIA, icon: School, label: t.stageLabels["Primaria"] },
    { id: EducationalStage.ESO, icon: BookOpen, label: t.stageLabels["ESO"] },
    { id: EducationalStage.BACHILLERATO, icon: GraduationCap, label: t.stageLabels["Bachillerato"] },
    { id: EducationalStage.FP, icon: Briefcase, label: t.stageLabels["Formación Profesional"] },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3 tracking-tight uppercase">
          {t.selectStageTitle}
        </h2>
        <div className="h-1 w-24 bg-brand-main mx-auto mb-4"></div>
        <p className="text-brand-dark text-lg font-light opacity-80">
          {t.selectStageSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => onSelect(stage.id)}
            className="group relative bg-white p-8 border border-brand-border shadow-sm hover:shadow-2xl transition-all duration-300 text-left flex flex-col items-start overflow-hidden hover:border-brand-dark"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-border group-hover:bg-brand-dark transition-colors duration-300"></div>
            
            <div className="mb-6 p-3 bg-brand-light rounded-sm text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-colors duration-300">
              <stage.icon size={32} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-blue transition-colors mb-2 uppercase tracking-wide">
              {stage.label}
            </h3>
            
            <p className="text-sm text-gray-500 font-light">
              {t.officialDecree}
            </p>
            
            <div className="mt-auto pt-6 flex items-center text-brand-main text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              {t.accessBtn}
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StageSelector;