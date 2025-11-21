import React, { useEffect, useRef } from 'react';
import { LearningSituationData, Language, Activity } from '../types';
import { TRANSLATIONS } from '../constants';
import { Users, Plus, Trash2, Check, X, Sparkles } from 'lucide-react';

// --- Helper Components ---

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
      className={`w-full bg-brand-bg/50 hover:bg-brand-bg focus:bg-white border-b border-transparent focus:border-brand-blue outline-none transition-colors resize-none overflow-hidden placeholder-gray-400 text-brand-dark py-0.5 px-1 ${className}`}
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
    const formatContent = (content: string | string[]) => {
        if (Array.isArray(content)) return content.join(', ');
        return content;
    };
    const suggestedText = formatContent(suggestion);
    const originalText = formatContent(original);
    if (suggestedText.trim() === originalText.trim()) return null;

    return (
        <div className="my-2 bg-amber-50 border border-amber-200 rounded p-2 relative group break-inside-avoid">
            <div className="text-[10px] text-amber-800 font-bold uppercase flex items-center mb-1">
                <Sparkles size={10} className="mr-1" />
                {language === 'es' ? 'Sugerencia IA' : 'AA Proposamena'}
            </div>
            <div className="text-xs text-brand-dark/80 italic mb-2 font-light leading-tight">
                {suggestedText}
            </div>
            <div className="flex gap-2 justify-end">
                 <button onClick={onReject} className="flex items-center bg-white border border-red-200 text-red-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase hover:bg-red-50">
                    <X size={10} className="mr-1" /> {language === 'es' ? 'No' : 'Ez'}
                </button>
                <button onClick={onAccept} className="flex items-center bg-brand-teal text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase hover:bg-brand-teal/90">
                    <Check size={10} className="mr-1" /> {language === 'es' ? 'Sí' : 'Bai'}
                </button>
            </div>
        </div>
    );
};

const SectionTitle = ({ number, title }: { number: string; title: string }) => (
  <div className="col-span-full bg-brand-dark text-white font-bold p-1.5 text-sm uppercase tracking-wider flex items-center break-after-avoid mt-4 first:mt-0">
    <div className="bg-brand-teal text-white w-5 h-5 flex items-center justify-center rounded-sm mr-2 text-xs font-black">{number}</div>
    {title}
  </div>
);

const FieldLabel = ({ text }: { text: string }) => (
  <div className="font-bold text-brand-dark text-[10px] uppercase tracking-wide mb-1 leading-none opacity-70">{text}</div>
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

  // --- Update Handlers (Same logic) ---
  const handleChange = (field: keyof LearningSituationData, value: string) => {
    if (!onUpdate) return;
    onUpdate({ ...data, [field]: value });
  };

  const handleListChange = (field: keyof LearningSituationData, value: string) => {
    if (!onUpdate) return;
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
    onUpdate({ ...data, activities: [...data.activities, { description: "", sessions: "", grouping: "", resources: "", evaluableProducts: "", evalTools: "" }] });
  };

  const handleRemoveActivity = (index: number) => {
    if (!onUpdate) return;
    onUpdate({ ...data, activities: data.activities.filter((_, i) => i !== index) });
  };

  // --- Render Helpers optimized for Density ---

  const renderText = (text: string, field?: keyof LearningSituationData, placeholder?: string, className: string = "text-xs") => {
    const hasSuggestion = isEditing && suggestions && field && suggestions[field] !== undefined;
    const suggestionValue = hasSuggestion ? suggestions![field] : null;

    if (isEditing && field && onUpdate) {
      return (
        <div className="w-full">
            <AutoResizeTextarea
                value={text}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                className={`font-light leading-tight ${className}`}
            />
            {hasSuggestion && (
                <SuggestionBox original={text} suggestion={suggestionValue as string} language={language} onAccept={() => onAcceptSuggestion?.(field, suggestionValue)} onReject={() => onRejectSuggestion?.(field)} />
            )}
        </div>
      );
    }
    return <div className={`whitespace-pre-wrap text-brand-black leading-snug text-justify ${className}`}>{text || <span className="opacity-20 italic">--</span>}</div>;
  };

  const renderList = (items: string[], field: keyof LearningSituationData, placeholder?: string) => {
    const hasSuggestion = isEditing && suggestions && suggestions[field] !== undefined;
    const suggestionValue = hasSuggestion ? suggestions![field] : null;

    if (isEditing && onUpdate) {
        return (
            <div className="w-full">
                <AutoResizeTextarea
                    value={items.join('\n')}
                    onChange={(e) => handleListChange(field, e.target.value)}
                    className="text-xs font-light leading-tight min-h-[4em]"
                    placeholder={placeholder || t.phList}
                />
                {hasSuggestion && (
                    <SuggestionBox original={items} suggestion={suggestionValue as string[]} language={language} onAccept={() => onAcceptSuggestion?.(field, suggestionValue)} onReject={() => onRejectSuggestion?.(field)} />
                )}
            </div>
        );
    }
    if (!items || items.length === 0) return <span className="opacity-20 italic text-xs">--</span>;
    return (
      <ul className="list-none space-y-1 m-0 p-0">
        {items.map((item, idx) => (
          <li key={idx} className="relative pl-3 text-[11px] text-brand-black leading-tight">
             <span className="absolute left-0 top-1.5 w-1 h-1 bg-brand-dark rounded-full"></span>
             {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div id="document-preview" className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none p-10 print:p-0 text-brand-black font-sans mb-12">
      
      {/* Modern Grid Table Structure */}
      <div className={`modern-table-grid ${isEditing ? 'border-brand-blue border-dashed' : ''} bg-white`}>
        
        {/* HEADER */}
        <div className="col-span-full bg-brand-dark text-white p-3 flex justify-between items-center print-color-adjust-exact border-b border-white break-inside-avoid">
          <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-widest text-brand-teal font-bold">{t.docHeaderTitle}</span>
             <div className="flex items-baseline mt-1">
                <span className="text-sm font-bold uppercase mr-2">{t.progUnit}:</span>
                {isEditing ? <input value={data.progUnitNumber} onChange={(e) => handleChange('progUnitNumber', e.target.value)} className="bg-white/10 text-white w-10 text-center font-bold text-sm" /> : <span className="text-lg font-bold">{data.progUnitNumber}</span>}
             </div>
          </div>
          <div className="flex items-center bg-brand-teal/20 px-3 py-1 rounded border border-brand-teal/50">
             {isEditing ? <input value={data.situationNumber} onChange={(e) => handleChange('situationNumber', e.target.value)} className="bg-transparent text-white w-10 text-center font-bold text-lg" /> : <span className="text-xl font-bold text-white">{data.situationNumber}</span>}
          </div>
        </div>

        {/* SECTION 1: ID DATA */}
        <SectionTitle number="1" title={t.sec1} />
        
        <div className="col-span-full p-2 border-b border-brand-border break-inside-avoid bg-gray-50">
            <FieldLabel text={t.fieldTitle} />
            {renderText(data.title, "title", t.topicPlaceholder, "text-lg font-bold uppercase text-brand-main")}
        </div>
        
        <div className="col-span-full grid grid-cols-4 break-inside-avoid">
            <div className="col-span-3 modern-cell">
                <FieldLabel text={t.fieldArea} />
                {renderText(data.stageArea, "stageArea", t.gradePlaceholder)}
            </div>
            <div className="col-span-1 modern-cell border-r-0">
                <FieldLabel text={t.fieldTiming} />
                {renderText(data.timingRelation, "timingRelation")}
            </div>
        </div>

        <div className="col-span-full modern-cell border-r-0 break-inside-avoid">
            <FieldLabel text={t.fieldGoal} />
            {renderText(data.descriptionGoal, "descriptionGoal", t.phGoal)}
        </div>

        <div className="col-span-full grid grid-cols-2 break-inside-avoid">
             <div className="modern-cell">
                 <FieldLabel text={t.fieldLinks} />
                 {renderText(data.linksOtherAreas, "linksOtherAreas", t.phLinks)}
             </div>
             <div className="modern-cell border-r-0">
                 <FieldLabel text={t.fieldOds} />
                 {renderText(data.odsChallenges, "odsChallenges", t.phOds)}
             </div>
        </div>

        {/* SECTION 2: CURRICULUM */}
        <SectionTitle number="2" title={t.sec2} />

        <div className="col-span-full modern-cell border-r-0 break-inside-avoid">
            <FieldLabel text={t.fieldObj} />
            {renderList(data.stageObjectives, "stageObjectives")}
        </div>
        
        <div className="col-span-full modern-cell border-r-0 break-inside-avoid">
             <FieldLabel text={t.fieldCompKey} />
             {isEditing ? renderList(data.keyCompetenciesDescriptors, "keyCompetenciesDescriptors") : (
                 <div className="flex flex-wrap gap-1">{data.keyCompetenciesDescriptors.map((k, i) => <span key={i} className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-[10px] font-bold">{k}</span>)}</div>
             )}
        </div>

        <div className="col-span-full grid grid-cols-2 break-inside-avoid">
            <div className="modern-cell bg-brand-light/20">
                <div className="bg-brand-main text-white text-[10px] font-bold px-2 py-1 uppercase mb-2 text-center">{t.fieldCompSpec}</div>
                {renderList(data.specificCompetencies, "specificCompetencies")}
            </div>
            <div className="modern-cell border-r-0 bg-brand-light/20">
                <div className="bg-brand-main text-white text-[10px] font-bold px-2 py-1 uppercase mb-2 text-center">{t.fieldCritEval}</div>
                {renderList(data.evaluationCriteria, "evaluationCriteria")}
            </div>
        </div>
        
        <div className="col-span-full modern-cell border-r-0 break-inside-avoid">
            <FieldLabel text={t.fieldBasicKnow} />
            {renderList(data.basicKnowledge, "basicKnowledge")}
        </div>

        {/* SECTION 3: METHODOLOGY */}
        <SectionTitle number="3" title={t.sec3} />
        
        <div className="col-span-full grid grid-cols-2 break-inside-avoid">
             <div className="modern-cell">
                <FieldLabel text={t.fieldMethod} />
                {renderText(data.method, "method", t.phMethod)}
             </div>
             <div className="modern-cell border-r-0">
                <FieldLabel text={t.fieldModels} />
                {renderText(data.pedagogicalModels, "pedagogicalModels", t.phModels)}
             </div>
             <div className="modern-cell border-b-0">
                <FieldLabel text={t.fieldTech} />
                {renderText(data.techniques, "techniques", t.phTech)}
             </div>
             <div className="modern-cell border-r-0 border-b-0">
                <FieldLabel text={t.fieldDua} />
                {renderText(data.didacticStrategies, "didacticStrategies", t.phDua)}
             </div>
        </div>
        
        {/* SECTION 4: SEQUENCING */}
        <SectionTitle number="4" title={t.sec4} />

        <div className="col-span-full">
            {data.activities.map((activity, index) => (
                <div key={index} className="border border-brand-border mb-2 break-inside-avoid shadow-sm">
                    {/* Activity Header */}
                    <div className="bg-gray-100 px-2 py-1 border-b border-brand-border flex justify-between items-center">
                         <div className="flex items-center gap-2">
                             <span className="text-xs font-bold uppercase text-brand-dark">{t.actLabel} {index + 1}</span>
                             {isEditing && <button onClick={() => handleRemoveActivity(index)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>}
                         </div>
                         <div className="flex items-center gap-2 text-[10px]">
                             <span className="font-bold text-brand-main uppercase">{t.actGrouping}:</span>
                             {isEditing ? <input value={activity.grouping} onChange={(e) => handleActivityChange(index, 'grouping', e.target.value)} className="bg-white border border-gray-300 w-20 px-1" /> : <span>{activity.grouping}</span>}
                             <span className="text-gray-300">|</span>
                             <span className="font-bold text-brand-main uppercase">Sesiones:</span>
                             {isEditing ? <input value={activity.sessions} onChange={(e) => handleActivityChange(index, 'sessions', e.target.value)} className="bg-white border border-gray-300 w-10 px-1 text-center" /> : <span>{activity.sessions}</span>}
                         </div>
                    </div>
                    {/* Activity Body */}
                    <div className="grid grid-cols-3">
                         <div className="col-span-2 p-2 border-r border-brand-border">
                            <FieldLabel text={t.actDesc} />
                            {isEditing ? (
                                <>
                                <AutoResizeTextarea value={activity.description} onChange={(e) => handleActivityChange(index, 'description', e.target.value)} className="text-xs" placeholder={t.phActDesc} />
                                {suggestions?.activities?.[index]?.description && <SuggestionBox original={activity.description} suggestion={suggestions.activities[index]!.description} language={language} onAccept={() => onAcceptSuggestion?.('activities', suggestions.activities![index]!.description, index, 'description')} onReject={() => onRejectSuggestion?.('activities', index, 'description')} />}
                                </>
                            ) : (
                                <div className="text-[11px] text-justify leading-tight">{activity.description}</div>
                            )}
                         </div>
                         <div className="col-span-1 grid grid-rows-3">
                            <div className="p-1 border-b border-brand-border bg-gray-50/50">
                                <FieldLabel text={t.actRes} />
                                {isEditing ? <AutoResizeTextarea value={activity.resources} onChange={(e) => handleActivityChange(index, 'resources', e.target.value)} className="text-[10px]" /> : <div className="text-[10px] leading-tight">{activity.resources}</div>}
                            </div>
                            <div className="p-1 border-b border-brand-border bg-gray-50/50">
                                <FieldLabel text={t.actProd} />
                                {isEditing ? <AutoResizeTextarea value={activity.evaluableProducts} onChange={(e) => handleActivityChange(index, 'evaluableProducts', e.target.value)} className="text-[10px]" /> : <div className="text-[10px] leading-tight">{activity.evaluableProducts}</div>}
                            </div>
                             <div className="p-1 bg-gray-50/50">
                                <FieldLabel text={t.actTools} />
                                {isEditing ? <AutoResizeTextarea value={activity.evalTools} onChange={(e) => handleActivityChange(index, 'evalTools', e.target.value)} className="text-[10px]" /> : <div className="text-[10px] leading-tight">{activity.evalTools}</div>}
                            </div>
                         </div>
                    </div>
                </div>
            ))}
            {isEditing && <div className="text-center p-2 print:hidden"><button onClick={handleAddActivity} className="text-brand-main text-xs font-bold uppercase border border-brand-main px-3 py-1 rounded hover:bg-brand-main hover:text-white transition"><Plus size={12} className="inline mr-1"/> {t.actAdd}</button></div>}
        </div>

        {/* SECTION 5: EVALUATION */}
        <SectionTitle number="5" title={t.sec5} />
        <div className="col-span-full grid grid-cols-3 break-inside-avoid">
            <div className="modern-cell">
                <FieldLabel text={t.fieldDesignEval} />
                {renderText(data.designEval, "designEval", "...", "text-[10px]")}
            </div>
            <div className="modern-cell">
                <FieldLabel text={t.fieldImplEval} />
                {renderText(data.implementationEval, "implementationEval", "...", "text-[10px]")}
            </div>
            <div className="modern-cell border-r-0">
                <FieldLabel text={t.fieldImprove} />
                {renderText(data.improvementProposal, "improvementProposal", "...", "text-[10px]")}
            </div>
        </div>

        {/* SECTION 6: BIBLIOGRAPHY */}
        <SectionTitle number="6" title={t.sec6} />
        <div className="col-span-full modern-cell border-r-0 border-b-0 break-inside-avoid">
            {renderText(data.bibliography, "bibliography", "...", "text-[10px]")}
        </div>

      </div>
    </div>
  );
};

export default DocumentPreview;