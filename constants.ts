import { Language } from "./types";

export const TRANSLATIONS = {
  es: {
    appTitle: "Asistente de Situaciones de Aprendizaje",
    footerText: "Herramienta de apoyo docente. Complete los campos y utilice la IA para validar la coherencia normativa y enriquecer el contenido.",
    navHome: "Inicio",
    navDownload: "Descargar PDF",
    navGenerating: "Generando PDF...",
    navChecking: "Analizando con IA...",
    navCheck: "Comprobar con IA",
    navTranslate: "Traducir al Euskera",
    navTranslating: "Traduciendo...",

    // Stage Selector
    selectStageTitle: "Selección de Etapa Educativa",
    selectStageSubtitle: "Seleccione la etapa para comenzar a diseñar su Situación de Aprendizaje",
    officialDecree: "Decreto Foral Navarra",
    accessBtn: "Acceder",
    stageLabels: {
      "Infantil": "Educación Infantil",
      "Primaria": "Educación Primaria",
      "ESO": "E.S.O.",
      "Bachillerato": "Bachillerato",
      "Formación Profesional": "Formación Profesional"
    },

    // Input Form
    configTitle: "Datos Iniciales",
    selectedStage: "Etapa seleccionada:",
    changeBtn: "Cambiar",
    gradeLabel: "Curso / Nivel",
    gradePlaceholder: "Ej: 3º Primaria",
    subjectLabel: "Área / Materia",
    subjectPlaceholder: "Ej: Matemáticas",
    topicLabel: "Temática / Contexto",
    topicPlaceholder: "Título o idea principal...",
    generateBtn: "Comenzar a Rellenar", // Changed from Auto-generate
    loadingBtn: "Iniciando editor...",

    // Document Preview
    previewTitle: "Editor de Situación de Aprendizaje",
    regenerateBtn: "Restaurar original", // Changed logic context
    docHeaderTitle: "Comunidad Foral de Navarra",
    progUnit: "Unidad de Programación Nº",
    saNumber: "SdA Nº",
    
    // Sections
    sec1: "Datos identificativos",
    sec2: "Conexión con los elementos curriculares",
    sec3: "Metodología",
    sec4: "Secuenciación competencial de actividades",
    sec5: "Evaluación de la práctica docente",
    sec6: "Bibliografía y webgrafía",

    // Fields & Placeholders
    fieldTitle: "Título de la Situación de Aprendizaje",
    fieldArea: "Etapa, área, materia o ámbito",
    fieldTiming: "Temporalización",
    fieldGoal: "Descripción y finalidad de los aprendizajes (Justificación)",
    phGoal: "Describa aquí la justificación de la situación de aprendizaje y su finalidad...",
    
    fieldLinks: "Vinculación con otras áreas (Interdisciplinariedad)",
    phLinks: "Relación con otras materias...",
    
    fieldOds: "Conexión con ODS y retos s. XXI",
    phOds: "Indique los ODS y retos vinculados...",
    
    fieldObj: "Objetivos de etapa",
    fieldCompKey: "Descriptores operativos de las competencias clave",
    fieldCompSpec: "Competencias específicas",
    fieldCritEval: "Criterios de evaluación",
    fieldBasicKnow: "Saberes básicos",
    phList: "Escriba cada elemento en una línea nueva...",

    fieldMethod: "Método",
    phMethod: "Ej: Aprendizaje Basado en Proyectos...",
    
    fieldModels: "Modelos pedagógicos",
    phModels: "Ej: Constructivismo, Flipped Classroom...",
    
    fieldTech: "Técnicas",
    phTech: "Técnicas concretas a utilizar...",
    
    fieldDua: "Estrategias didácticas (DUA)",
    phDua: "Medidas de atención a la diversidad...",

    // Activity
    actLabel: "Actividad",
    actDesc: "Descripción",
    phActDesc: "Describa el desarrollo de la actividad...",
    actGrouping: "Agrupamiento",
    actRes: "Recursos",
    actProd: "Productos",
    actTools: "Instrumentos Eval.",
    actAdd: "Añadir Actividad",
    actRemove: "Eliminar",

    fieldDesignEval: "Evaluación del diseño",
    fieldImplEval: "Evaluación de la implementación",
    fieldImprove: "Propuesta de mejora",
    
    watermark: "Documento de trabajo docente"
  },
  eu: {
    appTitle: "Ikaskuntza Egoeren Laguntzailea",
    footerText: "Irakasleentzako laguntza-tresna. Bete eremuak eta erabili AA edukia balioztatzeko eta aberasteko.",
    navHome: "Hasiera",
    navDownload: "PDF Deskargatu",
    navGenerating: "PDF sortzen...",
    navChecking: "AA Analizatzen...",
    navCheck: "AA-rekin Egiaztatu",
    navTranslate: "Gaztelaniara itzuli",
    navTranslating: "Itzultzen...",

    // Stage Selector
    selectStageTitle: "Hezkuntza Etaparen Hautaketa",
    selectStageSubtitle: "Hautatu etapa zure Ikaskuntza Egoera diseinatzen hasteko",
    officialDecree: "Nafarroako Foru Dekretua",
    accessBtn: "Sartu",
    stageLabels: {
      "Infantil": "Haur Hezkuntza",
      "Primaria": "Lehen Hezkuntza",
      "ESO": "D.B.H.",
      "Bachillerato": "Batxilergoa",
      "Formación Profesional": "Lanbide Heziketa"
    },

    // Input Form
    configTitle: "Hasierako Datuak",
    selectedStage: "Hautatutako etapa:",
    changeBtn: "Aldatu",
    gradeLabel: "Maila / Ikasturtea",
    gradePlaceholder: "Adib: LH 3. maila",
    subjectLabel: "Arloa / Ikasgaia",
    subjectPlaceholder: "Adib: Matematika",
    topicLabel: "Gaia / Testuingurua",
    topicPlaceholder: "Izenburua edo ideia nagusia...",
    generateBtn: "Hasi Betetzen",
    loadingBtn: "Editorea irekitzen...",

    // Document Preview
    previewTitle: "Ikaskuntza Egoeraren Editorea",
    regenerateBtn: "Jatorrizkoa berreskuratu",
    docHeaderTitle: "Nafarroako Foru Komunitatea",
    progUnit: "Programazio Unitatea Zk.",
    saNumber: "I.E. Zk.",

    // Sections
    sec1: "Identifikazio datuak",
    sec2: "Curriculum-elementuekiko lotura",
    sec3: "Metodología",
    sec4: "Jardueren sekuentziazio konpetentziala",
    sec5: "Irakas-jardunaren ebaluazioa",
    sec6: "Bibliografia eta webgrafia",

    // Fields & Placeholders
    fieldTitle: "Ikaskuntza Egoeraren Izenburua",
    fieldArea: "Etapa, arloa, irakasgaia edo eremua",
    fieldTiming: "Tenporalizazioa",
    fieldGoal: "Ikaskuntzen deskribapena eta helburua (Justifikazioa)",
    phGoal: "Deskribatu hemen justifikazioa eta helburua...",
    
    fieldLinks: "Beste arlo batzuekiko lotura (Interdisziplinaritatea)",
    phLinks: "Beste ikasgai batzuekiko lotura...",
    
    fieldOds: "GJHekiko eta XXI. mendeko erronkekiko lotura",
    phOds: "Adierazi lotutako GJHak eta erronkak...",
    
    fieldObj: "Etapako helburuak",
    fieldCompKey: "Funtsezko konpetentzien deskriptore operatiboak",
    fieldCompSpec: "Konpetentzia espezifikoak",
    fieldCritEval: "Ebaluazio-irizpideak",
    fieldBasicKnow: "Oinarrizko jakintzak",
    phList: "Idatzi elementu bakoitza lerro berri batean...",

    fieldMethod: "Metodoa",
    phMethod: "Adib: Proiektuetan Oinarritutako Ikaskuntza...",
    
    fieldModels: "Eredu pedagogikoak",
    phModels: "Adib: Konstruktibismoa...",
    
    fieldTech: "Teknikak",
    phTech: "Erabiliko diren teknikak...",
    
    fieldDua: "Estrategia didaktikoak (IDU)",
    phDua: "Aniztasunari erantzuteko neurriak...",

    // Activity
    actLabel: "Jarduera",
    actDesc: "Deskribapena",
    phActDesc: "Deskribatu jardueraren garapena...",
    actGrouping: "Taldekatzea",
    actRes: "Baliabideak",
    actProd: "Produktuak",
    actTools: "Ebal. Tresnak",
    actAdd: "Gehitu Jarduera",
    actRemove: "Ezabatu",

    fieldDesignEval: "Diseinuaren ebaluazioa",
    fieldImplEval: "Inplementazioaren ebaluazioa",
    fieldImprove: "Hobekuntza-proposamena",

    watermark: "Irakaslearen lan-dokumentua"
  }
};