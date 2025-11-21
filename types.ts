
export enum EducationalStage {
  INFANTIL = "Infantil",
  PRIMARIA = "Primaria",
  ESO = "ESO",
  BACHILLERATO = "Bachillerato",
  FP = "Formación Profesional"
}

export type Language = 'es' | 'eu';

export type GenerationMode = 'auto' | 'manual' | 'upload';

export interface Activity {
  description: string;
  sessions: string;
  grouping: string;
  resources: string;
  evaluableProducts: string;
  evalTools: string;
}

export interface LearningSituationData {
  // Header
  progUnitNumber: string;
  situationNumber: string;

  // 1. Datos identificativos
  title: string;
  stageArea: string;
  linksOtherAreas: string;
  descriptionGoal: string;
  odsChallenges: string;
  timingRelation: string;

  // 2. Conexión con elementos curriculares
  stageObjectives: string[]; 
  keyCompetenciesDescriptors: string[]; 
  specificCompetencies: string[]; 
  evaluationCriteria: string[]; 
  basicKnowledge: string[]; 

  // 3. Metodología
  method: string;
  pedagogicalModels: string;
  techniques: string;
  didacticStrategies: string;

  // 4. Secuenciación (Array of activities, usually 3-5)
  activities: Activity[];

  // 5. Evaluación práctica docente
  designEval: string;
  implementationEval: string;
  improvementProposal: string;

  // 6. Bibliografía
  bibliography: string;
}

export const createEmptyLearningSituation = (
  grade: string, 
  subject: string, 
  topic: string
): LearningSituationData => {
  // Create 3 empty activities structure
  const emptyActivities: Activity[] = Array(3).fill(null).map(() => ({
    description: "",
    sessions: "",
    grouping: "",
    resources: "",
    evaluableProducts: "",
    evalTools: ""
  }));

  return {
    progUnitNumber: "",
    situationNumber: "",
    title: topic ? `${topic}` : "",
    stageArea: grade && subject ? `${grade} - ${subject}` : "",
    linksOtherAreas: "",
    descriptionGoal: "",
    odsChallenges: "",
    timingRelation: "",
    stageObjectives: [],
    keyCompetenciesDescriptors: [],
    specificCompetencies: [],
    evaluationCriteria: [],
    basicKnowledge: [],
    method: "",
    pedagogicalModels: "",
    techniques: "",
    didacticStrategies: "",
    activities: emptyActivities,
    designEval: "",
    implementationEval: "",
    improvementProposal: "",
    bibliography: ""
  };
};
