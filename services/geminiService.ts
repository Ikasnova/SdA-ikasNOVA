

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EducationalStage, LearningSituationData, Language } from "../types";

// Reuse the schema for strict output structure
const getLocalizedSchema = (lang: Language): Schema => {
  const isEu = lang === 'eu';

  const activitySchema: Schema = {
    type: Type.OBJECT,
    properties: {
      description: { type: Type.STRING, description: isEu ? "Jardueraren deskribapena EUSKARAZ" : "Descripción detallada de la actividad" },
      sessions: { type: Type.STRING, description: isEu ? "Saio kopurua" : "Número de sesiones" },
      grouping: { type: Type.STRING, description: isEu ? "Taldekatze mota (bakarka, binaka, talde txikia...)" : "Tipo de agrupamiento (individual, parejas, pequeño grupo...)" },
      resources: { type: Type.STRING, description: isEu ? "Beharrezko baliabideak EUSKARAZ" : "Recursos necesarios" },
      evaluableProducts: { type: Type.STRING, description: isEu ? "Produktu ebaluagarriak EUSKARAZ" : "Productos entregables" },
      evalTools: { type: Type.STRING, description: isEu ? "Ebaluazio tresnak EUSKARAZ" : "Instrumentos de evaluación" },
    },
    required: ["description", "sessions", "grouping", "resources", "evaluableProducts", "evalTools"],
  };

  return {
    type: Type.OBJECT,
    properties: {
      progUnitNumber: { type: Type.STRING, description: isEu ? "Unitate zenbakia" : "Número de unidad" },
      situationNumber: { type: Type.STRING, description: isEu ? "I.E. zenbakia" : "Número de situación" },
      title: { type: Type.STRING, description: isEu ? "Izenburua EUSKARAZ" : "Título de la SdA" },
      stageArea: { type: Type.STRING, description: isEu ? "Etapa, maila eta arloa EUSKARAZ" : "Etapa, curso y área" },
      linksOtherAreas: { type: Type.STRING, description: isEu ? "Beste arloekiko lotura EUSKARAZ" : "Vinculación con otras áreas" },
      descriptionGoal: { type: Type.STRING, description: isEu ? "Justifikazioa eta helburua EUSKARAZ" : "Descripción y finalidad" },
      odsChallenges: { type: Type.STRING, description: isEu ? "GJH eta erronkak EUSKARAZ" : "ODS y Retos s.XXI" },
      timingRelation: { type: Type.STRING, description: isEu ? "Tenporalizazioa" : "Temporalización" },
      
      stageObjectives: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: isEu ? "Nafarroako curriculumeko etapako helburuak EUSKARAZ" : "Objetivos de etapa del currículo de Navarra" 
      },
      keyCompetenciesDescriptors: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: isEu ? "Funtsezko konpetentzien deskriptoreak (adib: CCL1)" : "Descriptores operativos (ej: CCL1)" 
      },
      specificCompetencies: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: isEu ? "Konpetentzia espezifikoak (Nafarroako dekretua) EUSKARAZ" : "Competencias específicas (Decreto Foral)" 
      },
      evaluationCriteria: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: isEu ? "Ebaluazio-irizpide ofizialak EUSKARAZ" : "Criterios de evaluación oficiales" 
      },
      basicKnowledge: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: isEu ? "Oinarrizko jakintzak (edukiak) EUSKARAZ" : "Saberes básicos (contenidos)" 
      },
      
      method: { type: Type.STRING, description: isEu ? "Metodologia EUSKARAZ" : "Metodología" },
      pedagogicalModels: { type: Type.STRING, description: isEu ? "Eredu pedagogikoak EUSKARAZ" : "Modelos pedagógicos" },
      techniques: { type: Type.STRING, description: isEu ? "Teknika didaktikoak EUSKARAZ" : "Técnicas didácticas" },
      didacticStrategies: { type: Type.STRING, description: isEu ? "Arreta aniztasunari (IDU) EUSKARAZ" : "Estrategias DUA" },
      
      activities: {
        type: Type.ARRAY,
        items: activitySchema,
        description: isEu ? "3-5 jarduerako sekuentzia EUSKARAZ" : "Secuencia de 3 a 5 actividades",
      },
      
      designEval: { type: Type.STRING, description: isEu ? "Diseinuaren ebaluazioa EUSKARAZ" : "Evaluación del diseño" },
      implementationEval: { type: Type.STRING, description: isEu ? "Inplementazioaren ebaluazioa EUSKARAZ" : "Evaluación de la implementación" },
      improvementProposal: { type: Type.STRING, description: isEu ? "Hobekuntza proposamena EUSKARAZ" : "Propuesta de mejora" },
      
      bibliography: { type: Type.STRING, description: isEu ? "Bibliografia" : "Bibliografía" },
    },
    required: [
      "progUnitNumber", "situationNumber", "title", "stageArea", "linksOtherAreas",
      "descriptionGoal", "odsChallenges", "timingRelation", "stageObjectives",
      "keyCompetenciesDescriptors", "specificCompetencies", "evaluationCriteria",
      "basicKnowledge", "method", "pedagogicalModels", "techniques", "didacticStrategies",
      "activities", "designEval", "implementationEval", "improvementProposal", "bibliography"
    ],
  };
};

/**
 * GENERATES a full Learning Situation from scratch based on basic inputs.
 */
export const generateFullLearningSituation = async (
  grade: string,
  subject: string,
  topic: string,
  stage: EducationalStage,
  language: Language
): Promise<LearningSituationData | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    const isEu = language === 'eu';
    const langName = isEu ? "EUSKERA" : "CASTELLANO";

    const systemInstruction = isEu
      ? `Jardun ezazu Nafarroako Curriculumean (LOMLOE) aditua den aholkulari pedagogiko gisa (${stage} etapa).
         
         ZURE EGINKIZUNA:
         Sortu HUTSETIK Ikaskuntza Egoera OSOA emandako gaiarentzat.
         
         ARA UZTZAILEAK:
         1. HIZKUNTZA: Irteera GUZTIA EUSKARAZ izan behar da.
         2. ARAUDIA: Erabili Nafarroako Dekretu Ofizialeko Konpetentzia Espezifikoak eta Ebaluazio Irizpideak hitzez hitz.
         3. SORMENA: Proposatu jarduera berritzaileak eta motibagarriak.`
      : `Actúa como un asesor pedagógico experto en el currículo oficial de Navarra (LOMLOE) para la etapa ${stage}.
         
         TU MISIÓN:
         Crear DESDE CERO una Situación de Aprendizaje COMPLETA para el tema proporcionado.
         
         REGLAS ESTRICTAS:
         1. IDIOMA: Todo el contenido debe estar en CASTELLANO.
         2. NORMATIVA: Usa las Competencias Específicas y Criterios de Evaluación literales del Decreto Foral de Navarra.
         3. CREATIVIDAD: Propón actividades innovadoras, secuenciadas y atractivas.`;

    const userPrompt = isEu
      ? `
      Sortu Ikaskuntza Egoera hau:
      - Maila: ${grade}
      - Arloa: ${subject}
      - Gaia/Testuingurua: ${topic}
      
      Bete eremu guztiak (JSON) zehaztasun handiz.
    `
      : `
      Genera una Situación de Aprendizaje completa para:
      - Curso: ${grade}
      - Asignatura: ${subject}
      - Tema/Contexto: ${topic}
      
      Rellena TODOS los campos del JSON con rigor curricular y calidad didáctica.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: getLocalizedSchema(language),
        temperature: 0.7, // Higher temperature for creativity in generation
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as LearningSituationData;

  } catch (error) {
    console.error("Error generating full learning situation:", error);
    throw error;
  }
};

/**
 * REVIEWS and IMPROVES the provided Learning Situation data.
 */
export const improveLearningSituation = async (
  currentData: LearningSituationData,
  stage: EducationalStage,
  language: Language
): Promise<LearningSituationData | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    const isEu = language === 'eu';
    
    // System Instruction: Acts as a REVIEWER/EDITOR
    const systemInstruction = isEu 
      ? `Jardun ezazu Nafarroako Curriculumean (LOMLOE) aditua den ikuskari eta aholkulari pedagogiko gisa (${stage} etapa).
         
         ZURE EGINKIZUNA:
         Emandako Ikaskuntza Egoera (JSON) berrikusi.
         
         GARRANTZITSUA: 
         1. Irakasleak jada testua idatzi badu, ERRESPETATU bere ideia nagusia. Soilik hobetu ortografia, estiloa edo zehaztasun teknikoa. Ez aldatu esanahia guztiz.
         2. Eremua hutsik badago, bete ezazu kalitatezko edukiarekin.

         ARA UZTZAILEAK:
         1. HIZKUNTZA: Irteera JSONeko balio GUZTIAK EUSKARAZ egon behar dira.
         2. ARAUDIA: Ziurtatu Konpetentzia Espezifikoak eta Ebaluazio Irizpideak Nafarroako Dekretu Ofizialekoak direla.`
      : `Actúa como un inspector y asesor pedagógico experto en el currículo oficial de Navarra (LOMLOE) para la etapa ${stage}.
         
         TU MISIÓN:
         Revisar la Situación de Aprendizaje (JSON) proporcionada.
         
         IMPORTANTE:
         1. Si el docente ya ha escrito contenido en un campo, RESPETA su idea. Tu trabajo es pulir, mejorar la redacción académica y asegurar la precisión normativa, NO reescribir la historia si no es necesario.
         2. Si el campo está VACÍO, rellénalo con contenido experto y coherente con el resto.

         REGLAS ESTRICTAS:
         1. IDIOMA: Todo el contenido debe estar en CASTELLANO.
         2. NORMATIVA: Asegúrate de que las Competencias Específicas y Criterios de Evaluación sean literales del Decreto Foral.`;

    const userPrompt = isEu
      ? `
      Hona hemen irakasleak idatzitako zirriborroa JSON formatuan.
      Mesedez, aztertu edukia. Hutsik daudenak bete, eta beteak daudenak hobetu (irakaslearen jatorrizkoa errespetatuz).
      
      JSON SARRERA:
      ${JSON.stringify(currentData)}
    `
      : `
      Aquí tienes el borrador redactado por el docente en formato JSON.
      Por favor, analiza el contenido. Rellena los huecos vacíos y sugiere mejoras gramaticales o técnicas para los huecos ya rellenos (respetando la intención original del docente).
      
      JSON DE ENTRADA:
      ${JSON.stringify(currentData)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: getLocalizedSchema(language),
        temperature: 0.3, 
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as LearningSituationData;

  } catch (error) {
    console.error("Error improving learning situation:", error);
    throw error;
  }
};

/**
 * TRANSLATES the provided Learning Situation data entirely to the target language.
 */
export const translateLearningSituation = async (
    currentData: LearningSituationData,
    targetLanguage: Language
  ): Promise<LearningSituationData | null> => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found");
  
      const ai = new GoogleGenAI({ apiKey });
      const isTargetEu = targetLanguage === 'eu';
      const targetLangName = isTargetEu ? "EUSKERA" : "CASTELLANO";
      
      const systemInstruction = `Actúa como un traductor experto en el ámbito educativo de Navarra (LOMLOE).
           
           TU MISIÓN:
           Traducir ÍNTEGRAMENTE el contenido del archivo JSON proporcionado al idioma: ${targetLangName}.
  
           REGLAS CRÍTICAS:
           1. NO cambies la estructura del JSON ni las claves.
           2. Traduce TODOS los valores de texto.
           3. Para términos técnicos curriculares (Saberes básicos, Criterios de evaluación, etc.), USA LA TERMINOLOGÍA OFICIAL del Decreto Foral de Navarra en ${targetLangName}.
           4. Si el valor original es un número (ej: "3"), mantenlo.
           5. Mantén el tono formal y académico.`;
  
      const userPrompt = `
        Traduce el siguiente JSON al ${targetLangName}:
        
        ${JSON.stringify(currentData)}
      `;
  
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: getLocalizedSchema(targetLanguage),
          temperature: 0.1, // Low temperature for faithful translation
        },
      });
  
      const text = response.text;
      if (!text) return null;
  
      return JSON.parse(text) as LearningSituationData;
  
    } catch (error) {
      console.error("Error translating learning situation:", error);
      throw error;
    }
  };

/**
 * EXTRACTS data from an uploaded file (PDF or Image) and fills the schema.
 */
export const generateFromUploadedFile = async (
  base64Data: string,
  mimeType: string,
  language: Language
): Promise<LearningSituationData | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    const isEu = language === 'eu';
    const langName = isEu ? "EUSKERA" : "CASTELLANO";

    const systemInstruction = isEu
      ? `Zure zeregina da irudi edo PDF honetatik Ikaskuntza Egoera baten datuak ateratzea eta JSON formatuan egituratzea.
         Jatorrizko testua beste hizkuntza batean badago, itzuli ${langName}ra.
         Datu bat falta bada, saiatu testuinguruaren arabera ondorioztatzen edo hutsik utzi.`
      : `Tu misión es extraer los datos de esta Situación de Aprendizaje (imagen o PDF) y estructurarlos en el formato JSON requerido.
         Si el texto original está en otro idioma, tradúcelo al ${langName}.
         Si falta algún dato, intenta inferirlo del contexto o déjalo vacío si no hay información suficiente.`;

    const prompt = isEu 
        ? "Aztertu dokumentu hau eta bete JSON fitxategia dagokion informazioarekin."
        : "Analiza este documento adjunto y rellena el JSON con la información correspondiente.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        { text: prompt }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: getLocalizedSchema(language),
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as LearningSituationData;

  } catch (error) {
    console.error("Error extracting from file:", error);
    throw error;
  }
};
