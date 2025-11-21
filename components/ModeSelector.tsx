

import React, { useRef } from 'react';
import { GenerationMode, Language } from '../types';
import { Bot, Pencil, ArrowLeft, Wand2, Upload, FileUp } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface ModeSelectorProps {
  onSelect: (mode: GenerationMode) => void;
  onBack: () => void;
  onFileUpload?: (file: File) => void;
  language: Language;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect, onBack, onFileUpload, language }) => {
  const t = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          if (onFileUpload) {
              onFileUpload(e.target.files[0]);
          }
      }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 animate-fade-in">
       <button 
            onClick={onBack} 
            className="mb-8 text-gray-500 hover:text-brand-dark transition-colors flex items-center text-sm font-bold uppercase tracking-widest hover:underline"
        >
            <ArrowLeft size={16} className="mr-2" />
            {t.changeBtn}
        </button>

      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3 tracking-tight uppercase">
          {t.selectModeTitle}
        </h2>
        <div className="h-1 w-24 bg-brand-main mx-auto mb-4"></div>
        <p className="text-brand-dark text-lg font-light opacity-80">
          {t.selectModeSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Auto Mode */}
        <button
          onClick={() => onSelect('auto')}
          className="group relative bg-white p-8 border-2 border-brand-border rounded-lg shadow-sm hover:shadow-2xl hover:border-brand-teal transition-all duration-300 text-left flex flex-col h-full"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wand2 size={80} className="text-brand-teal" />
            </div>
            
            <div className="mb-6 p-4 bg-brand-teal/10 text-brand-teal rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-colors">
              <Bot size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-teal transition-colors mb-3 uppercase tracking-tight">
              {t.modeAutoTitle}
            </h3>
            
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
              {t.modeAutoDesc}
            </p>
            
            <div className="mt-auto w-full bg-brand-teal text-white py-3 px-4 rounded text-center font-bold uppercase tracking-widest shadow-md group-hover:shadow-lg group-hover:scale-[1.02] transition-all">
              {t.modeAutoBtn}
            </div>
        </button>

        {/* Manual Mode */}
        <button
          onClick={() => onSelect('manual')}
          className="group relative bg-white p-8 border-2 border-brand-border rounded-lg shadow-sm hover:shadow-2xl hover:border-brand-blue transition-all duration-300 text-left flex flex-col h-full"
        >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Pencil size={80} className="text-brand-blue" />
            </div>

            <div className="mb-6 p-4 bg-brand-blue/10 text-brand-blue rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
              <Pencil size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-blue transition-colors mb-3 uppercase tracking-tight">
              {t.modeManualTitle}
            </h3>
            
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
              {t.modeManualDesc}
            </p>
            
            <div className="mt-auto w-full bg-brand-blue text-white py-3 px-4 rounded text-center font-bold uppercase tracking-widest shadow-md group-hover:shadow-lg group-hover:scale-[1.02] transition-all">
              {t.modeManualBtn}
            </div>
        </button>

        {/* Upload Mode */}
        <button
          onClick={handleFileClick}
          className="group relative bg-white p-8 border-2 border-brand-border rounded-lg shadow-sm hover:shadow-2xl hover:border-purple-500 transition-all duration-300 text-left flex flex-col h-full"
        >
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,image/jpeg,image/png,image/webp" 
                onChange={handleFileChange}
             />
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileUp size={80} className="text-purple-500" />
            </div>

            <div className="mb-6 p-4 bg-purple-100 text-purple-600 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Upload size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-brand-dark group-hover:text-purple-600 transition-colors mb-3 uppercase tracking-tight">
              {t.modeUploadTitle}
            </h3>
            
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
              {t.modeUploadDesc}
            </p>
            
            <div className="mt-auto w-full bg-purple-600 text-white py-3 px-4 rounded text-center font-bold uppercase tracking-widest shadow-md group-hover:shadow-lg group-hover:scale-[1.02] transition-all">
              {t.modeUploadBtn}
            </div>
        </button>

      </div>
    </div>
  );
};

export default ModeSelector;
