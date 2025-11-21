import React, { useEffect, useRef } from 'react';
import { LearningSituationData, Language, Activity } from '../types';
import { TRANSLATIONS } from '../constants';
import { Users, Plus, Trash2, Check, X, Sparkles } from 'lucide-react';

// --- Helper Components (Defined outside to prevent re-render focus loss) ---

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({ value, className, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      className={`w-full bg-brand-bg/50 hover:bg-brand-bg focus:bg-white border-b-2 border-brand-blue/30 focus:border-brand-blue outline-none transition-colors resize-none overflow-hidden placeholder-gray-400 text-brand-dark py-1 px-1 ${className}`}
      {...props}
    />
  );
};

// --- Suggestion UI Component ---
interface SuggestionBoxProps {
    original: string | string[];
    suggestion: string | string[];
    onAccept: () => void;
    onReject: () => void;
    language: Language;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ original, suggestion, onAccept, onReject, language }) => {
    const t = TRANSLATIONS[language];
    
    // Helper to format lists for display
    const formatContent = (content: string | string[]) => {
        if (Array.isArray(content)) return content.join(', ');
        return content;
    };

    const suggestedText = formatContent(suggestion);
    const originalText = formatContent(original);

    // Don't show if identical (sanity check)
    if (suggestedText.trim() === originalText.trim()) return null;

    return (
        <div className="mt-2 mb-4 bg-amber-50 border border-amber-200 rounded-md p-3 relative group animate-fade-in">
            <div className="absolute -top-2.5 left-2 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center border border-amber-200 uppercase tracking-wider">
                <Sparkles size={10} className="mr-1" />
                {language === 'es' ? 'Sugerencia IA' : 'AA Proposamena'}
            </div>
            
            <div className="text-xs text-brand-dark/80 italic mb-2 mt-1 font-light">
                {suggestedText}
            </div>
            
            <div className="flex gap-2 justify-end">
                 <button 
                    onClick={onReject}
                    className="flex items-center bg-white border border-red-200 text-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase hover:bg-red-50 transition-colors"
                    title={language === 'es' ? 'Rechazar' : 'Baztertu'}
                >
                    <X size={12} className="mr-1" />
                    {language === 'es' ? 'Descartar' : 'Baztertu'}
                </button>
                <button 
                    onClick={onAccept}
                    className="flex items-center bg-brand-teal text-white px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-brand-teal/90 shadow-sm transition-all"
                    title={language === 'es' ? 'Aceptar' : 'Onartu'}
                >
                    <Check size={12} className="mr-1" />
                    {language === 'es' ? 'Aplicar' : 'Aplikatu'}
                </button>
            </div>
        </div>
    );
};

const SectionTitle = ({ number, title }: { number: string; title: string }) => (
  <div className="bg-brand-dark text-white font-bold p-2 text-sm mt-6 first:mt-0 print:bg-brand-dark print:text-white print:border-gray-400 uppercase tracking-wider flex items-center break-inside-avoid break-after-avoid">
    <div className="bg-brand-teal text-white w-6 h-6 flex items-center justify-center rounded-sm mr-3 text-xs font-black">{number}</div>
    {title}
  </div>
);

const FieldLabel = ({ text, className = "" }: { text: string; className?: string }) => (
  <div className={`font-bold text-brand-dark text-xs uppercase tracking-wide mb-2 border-b-2 border-brand-teal/20 pb-1 w-full ${className}`}>{text}</div>
);

// --- Main Component ---

interface DocumentPreviewProps {
  data: LearningSituationData;
  suggestions: Partial<LearningSituationData> | null;
  language: Language;
  isEditing?: boolean;
  onUpdate?: (newData: LearningSituationData) => void;
  onAcceptSuggestion?: (key: keyof LearningSituationData, value: any, activityIndex?: number, activityKey?: keyof Activity) => void;
  onRejectSuggestion?: (key: keyof LearningSituationData, activityIndex?: number, activityKey?: keyof Activity) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
    data, 
    suggestions,
    language, 
    isEditing = false, 
    onUpdate,
    onAcceptSuggestion,
    onRejectSuggestion
}) => {
  const t = TRANSLATIONS[language];

  // --- Update Handlers ---

  const handleChange = (field: keyof LearningSituationData, value: string) => {
    if (!onUpdate) return;
    onUpdate({ ...data, [field]: value });
  };

  const handleListChange = (field: keyof LearningSituationData, value: string) => {
    if (!onUpdate) return;
    // Keep empty lines to allow user to space things out if they want
    const list = value.split('\n'); 
    onUpdate({ ...data, [field]: list });
  };

  const handleActivityChange = (index: number, field: keyof Activity, value: string) => {
    if (!onUpdate) return;
    const newActivities = [...data.activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    onUpdate({ ...data, activities: newActivities });
  };

  const handleAddActivity = () => {
    if (!onUpdate) return;
    const newActivity: Activity = {
      description: "",
      sessions: "",
      grouping: "",
      resources: "",
      evaluableProducts: "",
      evalTools: ""
    };
    onUpdate({ ...data, activities: [...data.activities, newActivity] });
  };

  const handleRemoveActivity = (index: number) => {
    if (!onUpdate) return;
    const newActivities = data.activities.filter((_, i) => i !== index);
    onUpdate({ ...data, activities: newActivities });
  };

  // --- Render Helpers ---

  const renderEditableText = ({ 
    text, 
    field, 
    className = "",
    isHeader = false,
    placeholder = ""
  }: { 
    text: string; 
    field?: keyof LearningSituationData; 
    className?: string;
    isHeader?: boolean;
    placeholder?: string;
  }) => {
    // Check for suggestions on this field
    const hasSuggestion = isEditing && suggestions && field && suggestions[field] !== undefined;
    const suggestionValue = hasSuggestion ? suggestions![field] : null;

    if (isEditing && field && onUpdate) {
      return (
        <div className="w-full">
            <AutoResizeTextarea
                value={text}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                className={`${isHeader ? 'text-xl font-bold' : 'text-sm font-light'} ${className}`}
            />
            {hasSuggestion && onAcceptSuggestion && onRejectSuggestion && (
                <SuggestionBox 
                    original={text}
                    suggestion={suggestionValue as string}
                    language={language}
                    onAccept={() => onAcceptSuggestion(field, suggestionValue)}
                    onReject={() => onRejectSuggestion(field)}
                />
            )}
        </div>
      );
    }
    return <div className={`text-brand-black whitespace-pre-wrap leading-relaxed text-justify ${isHeader ? '' : 'text-sm font-light'} ${className}`}>{text || <span className="text-gray-300 italic text-xs opacity-50">Empty / Vacío</span>}</div>;
  };

  const renderEditableList = ({ 
    items, 
    field, 
    type = "bullet",
    placeholder = ""
  }: { 
    items: string[]; 
    field: keyof LearningSituationData; 
    type?: "bullet" | "striped";
    placeholder?: string;
  }) => {
    
    // Check for suggestions (Lists are treated as a whole block replacement for simplicity)
    const hasSuggestion = isEditing && suggestions && suggestions[field] !== undefined;
    const suggestionValue = hasSuggestion ? suggestions![field] : null;

    if (isEditing && onUpdate) {
        const joinedText = items.join('\n');
        return (
            <div className="w-full">
                <AutoResizeTextarea
                    value={joinedText}
                    onChange={(e) => handleListChange(field, e.target.value)}
                    className="text-sm font-light min-h-[6em]"
                    placeholder={placeholder || t.phList}
                />
                {hasSuggestion && onAcceptSuggestion && onRejectSuggestion && (
                    <SuggestionBox 
                        original={items}
                        suggestion={suggestionValue as string[]}
                        language={language}
                        onAccept={() => onAcceptSuggestion(field, suggestionValue)}
                        onReject={() => onRejectSuggestion(field)}
                    />
                )}
            </div>
        );
    }

    if (!items || items.length === 0) return <span className="text-gray-300 italic text-xs opacity-50">Empty / Vacío</span>;
    
    if (type === "striped") {
      return (
        <div className="flex flex-col w-full border border-brand-border rounded-sm overflow-hidden">
          {items.map((item, idx) => (
            <div key={idx} className="p-2 text-xs text-brand-black bg-white border-b border-brand-border last:border-0 even:bg-brand-light/50">
              {item}
            </div>
          ))}
        </div>
      );
    }

    return (
      <ul className="list-none w-full space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="relative pl-4 text-sm text-brand-black leading-snug">
             <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-brand-teal rounded-full"></span>
             {item}
          </li>
        ))}
      </ul>
    );
  };

  const renderActivityField = (index: number, field: keyof Activity, value: string, placeholder: string, className: string = "") => {
     const suggestion = isEditing && suggestions && suggestions.activities && suggestions.activities[index] 
        ? suggestions.activities[index]![field] 
        : undefined;

     return (
        <div className="w-full">
             {isEditing ? (
                <>
                    <AutoResizeTextarea
                        value={value}
                        onChange={(e) => handleActivityChange(index, field, e.target.value)}
                        className={className}
                        placeholder={placeholder}
                    />
                    {suggestion && onAcceptSuggestion && onRejectSuggestion && (
                        <SuggestionBox 
                            original={value}
                            suggestion={suggestion}
                            language={language}
                            onAccept={() => onAcceptSuggestion('activities', suggestion, index, field)}
                            onReject={() => onRejectSuggestion('activities', index, field)}
                        />
                    )}
                </>
             ) : (
                 <div className={`text-brand-black whitespace-pre-wrap leading-relaxed text-justify ${className.replace('text-xs', 'text-sm')}`}>{value}</div>
             )}
        </div>
     );
  };

  return (
    <div id="document-preview" className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none p-10 print:p-0 text-brand-black font-sans mb-12">
      {/* Main Table Border Container */}
      <div className={`border-4 ${isEditing ? 'border-brand-blue border-dashed' : 'border-brand-dark'} print:border-black transition-all duration-300`}>
        
        {/* Header: Unit & Situation Numbers */}
        <div className="bg-brand-dark text-white font-bold p-4 flex justify-between items-center print:bg-brand-dark print-color-adjust-exact uppercase tracking-widest border-b border-white break-inside-avoid">
          <div className="flex flex-col w-1/2">
            <span className="text-brand-teal text-xs">{t.docHeaderTitle}</span>
            <div className="flex items-center">
                <span className="text-lg mr-2">{t.progUnit}</span>
                {isEditing ? (
                    <input 
                        value={data.progUnitNumber} 
                        onChange={(e) => handleChange('progUnitNumber', e.target.value)}
                        className="bg-white/10 text-white border-none w-16 p-1 text-center text-lg font-bold focus:bg-white/20 outline-none"
                        placeholder="#"
                    />
                ) : (
                    <span className="text-lg">{data.progUnitNumber}</span>
                )}
            </div>
          </div>
          <div className="bg-brand-teal px-4 py-2 text-white text-sm font-bold rounded-sm shadow-sm flex items-center">
            <span className="mr-2">{t.saNumber}</span>
            {isEditing ? (
                 <input 
                    value={data.situationNumber} 
                    onChange={(e) => handleChange('situationNumber', e.target.value)}
                    className="bg-white/20 text-white border-none w-16 p-0 text-center font-bold focus:bg-white/30 outline-none"
                    placeholder="#"
                />
            ) : (
                <span>{data.situationNumber}</span>
            )}
          </div>
        </div>

        {/* 1. DATOS IDENTIFICATIVOS */}
        <SectionTitle number="1" title={t.sec1} />
        
        <div className="grid grid-cols-1 border-b border-brand-border">
          <div className="p-4 border-b border-brand-border bg-brand-light/30 break-inside-avoid">
            <FieldLabel text={t.fieldTitle} />
            {renderEditableText({
                text: data.title, 
                field: "title", 
                className: "text-2xl font-bold text-brand-main uppercase tracking-tight", 
                isHeader: true,
                placeholder: t.topicPlaceholder
            })}
          </div>
          <div className="grid grid-cols-3 border-b border-brand-border break-inside-avoid">
            <div className="col-span-2 p-3 border-r border-brand-border">
                <FieldLabel text={t.fieldArea} />
                {renderEditableText({ text: data.stageArea, field: "stageArea", placeholder: t.gradePlaceholder })}
            </div>
            <div className="p-3">
                <FieldLabel text={t.fieldTiming} />
                {renderEditableText({ text: data.timingRelation, field: "timingRelation", placeholder: "Ej: 2 semanas / 6 sesiones" })}
            </div>
          </div>
          
          <div className="p-4 border-b border-brand-border break-inside-avoid">
            <FieldLabel text={t.fieldGoal} />
            {renderEditableText({ text: data.descriptionGoal, field: "descriptionGoal", placeholder: t.phGoal })}
          </div>
          
          <div className="grid grid-cols-2 break-inside-avoid">
             <div className="p-4 border-r border-brand-border">
                <FieldLabel text={t.fieldLinks} />
                {renderEditableText({ text: data.linksOtherAreas, field: "linksOtherAreas", placeholder: t.phLinks })}
             </div>
             <div className="p-4">
                <FieldLabel text={t.fieldOds} />
                {renderEditableText({ text: data.odsChallenges, field: "odsChallenges", placeholder: t.phOds })}
             </div>
          </div>
        </div>

        {/* 2. CONEXIÓN CON ELEMENTOS CURRICULARES */}
        <SectionTitle number="2" title={t.sec2} />

        <div className="p-4 border-b border-brand-border bg-brand-light/30 break-inside-avoid">
          <FieldLabel text={t.fieldObj} />
          {renderEditableList({ items: data.stageObjectives, field: "stageObjectives", type: "bullet" })}
        </div>
        <div className="p-4 border-b border-brand-border break-inside-avoid">
          <FieldLabel text={t.fieldCompKey} />
          {isEditing ? (
              renderEditableList({ items: data.keyCompetenciesDescriptors, field: "keyCompetenciesDescriptors", type: "bullet", placeholder: "CCL1, CP2, STEM3..." })
          ) : (
            <div className="flex flex-wrap gap-2">
                {data.keyCompetenciesDescriptors.length > 0 ? data.keyCompetenciesDescriptors.map((k, i) => (
                    <span key={i} className="bg-brand-border text-brand-dark px-2 py-1 rounded text-xs font-bold">{k}</span>
                )) : <span className="text-gray-300 italic text-xs">Empty</span>}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 border-b border-brand-border break-inside-avoid">
          <div className="border-r border-brand-border p-4">
             <FieldLabel text={t.fieldCompSpec} className="text-center bg-brand-main text-white py-1 mb-3 border-none rounded-sm" />
             {renderEditableList({ items: data.specificCompetencies, field: "specificCompetencies", type: "striped" })}
          </div>
          <div className="p-4">
            <FieldLabel text={t.fieldCritEval} className="text-center bg-brand-main text-white py-1 mb-3 border-none rounded-sm" />
            {renderEditableList({ items: data.evaluationCriteria, field: "evaluationCriteria", type: "striped" })}
          </div>
        </div>
        
        <div className="p-4 border-b border-brand-border bg-brand-light/30 break-inside-avoid">
          <FieldLabel text={t.fieldBasicKnow} />
          {renderEditableList({ items: data.basicKnowledge, field: "basicKnowledge", type: "bullet" })}
        </div>

        {/* 3. METODOLOGÍA */}
        <SectionTitle number="3" title={t.sec3} />
        
        <div className="grid grid-cols-2 border-b border-brand-border break-inside-avoid">
          <div className="p-3 border-r border-b border-brand-border">
            <FieldLabel text={t.fieldMethod} />
            {renderEditableText({ text: data.method, field: "method", placeholder: t.phMethod })}
          </div>
          <div className="p-3 border-b border-brand-border">
            <FieldLabel text={t.fieldModels} />
            {renderEditableText({ text: data.pedagogicalModels, field: "pedagogicalModels", placeholder: t.phModels })}
          </div>
          <div className="p-3 border-r border-brand-border">
            <FieldLabel text={t.fieldTech} />
            {renderEditableText({ text: data.techniques, field: "techniques", placeholder: t.phTech })}
          </div>
          <div className="p-3">
            <FieldLabel text={t.fieldDua} />
            {renderEditableText({ text: data.didacticStrategies, field: "didacticStrategies", placeholder: t.phDua })}
          </div>
        </div>

        {/* 4. SECUENCIACIÓN */}
        <SectionTitle number="4" title={t.sec4} />
        
        {data.activities.map((activity, index) => (
          <div key={index} className="border-b border-brand-border break-inside-avoid group relative">
            <div className="bg-brand-dark text-white p-2 px-4 font-bold text-xs flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <span className="uppercase tracking-wider">{t.actLabel} {index + 1}</span>
                 {isEditing && (
                    <button 
                        onClick={() => handleRemoveActivity(index)}
                        className="text-red-300 hover:text-white hover:bg-red-600/50 p-1 rounded transition-all ml-2"
                        title={t.actRemove}
                    >
                        <Trash2 size={14} />
                    </button>
                  )}
              </div>
              <div className="flex items-center gap-2">
                {/* Sessions */}
                {isEditing ? (
                    <input 
                    value={activity.sessions} 
                    onChange={(e) => handleActivityChange(index, 'sessions', e.target.value)}
                    className="bg-white text-brand-dark px-2 py-0.5 rounded-sm text-[10px] font-bold w-24 text-right placeholder-gray-400"
                    placeholder="#"
                />
                ) : (
                    <span className="bg-white text-brand-dark px-2 py-0.5 rounded-sm text-[10px] font-bold">{activity.sessions}</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3">
              {/* Main Description Column */}
              <div className="col-span-2 p-4 border-r border-brand-border flex flex-col justify-between">
                <div className="w-full">
                    <FieldLabel text={t.actDesc} />
                    {renderActivityField(index, 'description', activity.description, t.phActDesc, "text-sm font-light min-h-[6em]")}
                </div>

                {/* Grouping Type - Moved Here */}
                <div className="mt-4 pt-3 border-t border-brand-border/50 flex flex-col justify-center">
                    <div className="flex items-center mb-1">
                        <span className="text-xs font-bold uppercase text-brand-main mr-3">{t.actGrouping}:</span>
                        {isEditing ? (
                            <input 
                            value={activity.grouping || ''} 
                            onChange={(e) => handleActivityChange(index, 'grouping', e.target.value)}
                            className="bg-brand-bg/50 border-b border-brand-blue/50 text-brand-blue px-2 py-1 rounded-sm text-xs font-bold w-full placeholder-gray-400 italic focus:bg-white outline-none"
                            placeholder={t.actGrouping}
                        />
                        ) : (
                        activity.grouping && (
                            <span className="bg-brand-blue text-white px-3 py-1 rounded-sm text-xs font-bold flex items-center shadow-sm">
                            <Users size={12} className="mr-2" />
                            {activity.grouping}
                            </span>
                        )
                        )}
                    </div>
                    {/* Grouping Suggestion */}
                     {isEditing && suggestions && suggestions.activities && suggestions.activities[index] && suggestions.activities[index]?.grouping && (
                        <SuggestionBox 
                            original={activity.grouping}
                            suggestion={suggestions.activities[index]!.grouping}
                            language={language}
                            onAccept={() => onAcceptSuggestion && onAcceptSuggestion('activities', suggestions.activities![index]!.grouping, index, 'grouping')}
                            onReject={() => onRejectSuggestion && onRejectSuggestion('activities', index, 'grouping')}
                        />
                    )}
                </div>

              </div>
              {/* Details Column */}
              <div className="col-span-1 p-3 space-y-3 bg-brand-bg">
                <div className="border-b border-gray-200 pb-2">
                  <FieldLabel text={t.actRes} />
                  {renderActivityField(index, 'resources', activity.resources, t.actRes, "text-xs font-light")}
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <FieldLabel text={t.actProd} />
                  {renderActivityField(index, 'evaluableProducts', activity.evaluableProducts, t.actProd, "text-xs font-light")}
                </div>
                <div>
                  <FieldLabel text={t.actTools} />
                  {renderActivityField(index, 'evalTools', activity.evalTools, t.actTools, "text-xs font-light")}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Activity Button */}
        {isEditing && (
            <div className="p-4 border-b border-brand-border bg-brand-light/20 flex justify-center print:hidden">
                <button
                    onClick={handleAddActivity}
                    className="flex items-center gap-2 text-brand-main font-bold uppercase text-xs tracking-widest hover:text-white hover:bg-brand-main transition-all border border-brand-main px-4 py-2 rounded-sm"
                >
                    <Plus size={16} />
                    {t.actAdd}
                </button>
            </div>
        )}

        {/* 5. EVALUACIÓN DOCENTE */}
        <SectionTitle number="5" title={t.sec5} />
        <div className="grid grid-cols-2 border-b border-brand-border break-inside-avoid">
             <div className="p-4 border-r border-brand-border">
                <FieldLabel text={t.fieldDesignEval} />
                {renderEditableText({ text: data.designEval, field: "designEval", placeholder: "..." })}
             </div>
             <div className="p-4">
                <FieldLabel text={t.fieldImplEval} />
                {renderEditableText({ text: data.implementationEval, field: "implementationEval", placeholder: "..." })}
             </div>
        </div>
        <div className="p-4 border-b border-brand-border bg-brand-light/30 break-inside-avoid">
          <FieldLabel text={t.fieldImprove} />
          {renderEditableText({ text: data.improvementProposal, field: "improvementProposal", placeholder: "..." })}
        </div>

        {/* 6. BIBLIOGRAFÍA */}
        <SectionTitle number="6" title={t.sec6} />
        <div className="p-4 break-inside-avoid">
          {renderEditableText({ text: data.bibliography, field: "bibliography", placeholder: "..." })}
        </div>
        
        <div className="p-4 bg-brand-dark text-white flex justify-between items-center text-xs print:bg-brand-dark print-color-adjust-exact break-inside-avoid">
            <span className="font-bold uppercase tracking-widest">Ikasnova Generator</span>
            <span className="opacity-80 font-light">{t.watermark}</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;