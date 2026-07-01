'use strict';

const AppState = {
  currentFile: null,
  ocrText: '',
  reportType: 'Unknown',
  patientInfo: {},
  parameters: [],
  healthScore: 0,
  analysisReady: false,
  chatHistory: [],
  animationsEnabled: true,
  charts: { pie: null, bar: null, radar: null, score: null }
};


const REFERENCE_RANGES = {
  // CBC
  'Hemoglobin':          { min: 12.0, max: 17.5, unit: 'g/dL',   category: 'CBC' },
  'RBC':                 { min: 4.0,  max: 6.2,  unit: 'M/µL',   category: 'CBC' },
  'WBC':                 { min: 4.0,  max: 11.0, unit: 'K/µL',   category: 'CBC' },
  'Platelets':           { min: 150,  max: 400,  unit: 'K/µL',   category: 'CBC' },
  'HCT':                 { min: 36,   max: 52,   unit: '%',       category: 'CBC' },
  'Hematocrit':          { min: 36,   max: 52,   unit: '%',       category: 'CBC' },
  'PCV':                 { min: 36,   max: 52,   unit: '%',       category: 'CBC' },
  'MCV':                 { min: 80,   max: 100,  unit: 'fL',      category: 'CBC' },
  'MCH':                 { min: 27,   max: 33,   unit: 'pg',      category: 'CBC' },
  'MCHC':                { min: 32,   max: 36,   unit: 'g/dL',   category: 'CBC' },
  'RDW':                 { min: 11.5, max: 14.5, unit: '%',       category: 'CBC' },
  'Neutrophils':         { min: 40,   max: 75,   unit: '%',       category: 'CBC' },
  'Lymphocytes':         { min: 20,   max: 45,   unit: '%',       category: 'CBC' },
  'Monocytes':           { min: 2,    max: 10,   unit: '%',       category: 'CBC' },
  'Eosinophils':         { min: 1,    max: 6,    unit: '%',       category: 'CBC' },
  'Basophils':           { min: 0,    max: 1,    unit: '%',       category: 'CBC' },
  // Blood Sugar / Diabetes
  'Fasting Blood Sugar': { min: 70,   max: 100,  unit: 'mg/dL',  category: 'Diabetes' },
  'Blood Sugar':         { min: 70,   max: 140,  unit: 'mg/dL',  category: 'Diabetes' },
  'Random Blood Sugar':  { min: 70,   max: 140,  unit: 'mg/dL',  category: 'Diabetes' },
  'Glucose':             { min: 70,   max: 140,  unit: 'mg/dL',  category: 'Diabetes' },
  'HbA1c':              { min: 4.0,  max: 5.7,  unit: '%',       category: 'Diabetes' },
  'Fasting Glucose':     { min: 70,   max: 100,  unit: 'mg/dL',  category: 'Diabetes' },
  'PP Blood Sugar':      { min: 70,   max: 140,  unit: 'mg/dL',  category: 'Diabetes' },
  // Lipid Profile
  'Total Cholesterol':   { min: 0,    max: 200,  unit: 'mg/dL',  category: 'Lipid' },
  'Cholesterol':         { min: 0,    max: 200,  unit: 'mg/dL',  category: 'Lipid' },
  'LDL':                 { min: 0,    max: 130,  unit: 'mg/dL',  category: 'Lipid' },
  'HDL':                 { min: 40,   max: 999,  unit: 'mg/dL',  category: 'Lipid' },
  'Triglycerides':       { min: 0,    max: 150,  unit: 'mg/dL',  category: 'Lipid' },
  'VLDL':                { min: 0,    max: 30,   unit: 'mg/dL',  category: 'Lipid' },
  // Thyroid
  'TSH':                 { min: 0.4,  max: 4.0,  unit: 'µIU/mL', category: 'Thyroid' },
  'T3':                  { min: 0.8,  max: 2.0,  unit: 'ng/mL',  category: 'Thyroid' },
  'T4':                  { min: 5.1,  max: 14.1, unit: 'µg/dL',  category: 'Thyroid' },
  'Free T3':             { min: 2.0,  max: 4.4,  unit: 'pg/mL',  category: 'Thyroid' },
  'Free T4':             { min: 0.8,  max: 1.8,  unit: 'ng/dL',  category: 'Thyroid' },
  // Vitamins
  'Vitamin D':           { min: 30,   max: 100,  unit: 'ng/mL',  category: 'Vitamins' },
  'Vitamin D3':          { min: 30,   max: 100,  unit: 'ng/mL',  category: 'Vitamins' },
  'Vitamin B12':         { min: 200,  max: 900,  unit: 'pg/mL',  category: 'Vitamins' },
  'Folate':              { min: 4.0,  max: 20.0, unit: 'ng/mL',  category: 'Vitamins' },
  'Folic Acid':          { min: 4.0,  max: 20.0, unit: 'ng/mL',  category: 'Vitamins' },
  // Kidney
  'Creatinine':          { min: 0.6,  max: 1.3,  unit: 'mg/dL',  category: 'KFT' },
  'Urea':                { min: 15,   max: 45,   unit: 'mg/dL',  category: 'KFT' },
  'Blood Urea Nitrogen': { min: 7,    max: 20,   unit: 'mg/dL',  category: 'KFT' },
  'BUN':                 { min: 7,    max: 20,   unit: 'mg/dL',  category: 'KFT' },
  'Uric Acid':           { min: 2.4,  max: 7.0,  unit: 'mg/dL',  category: 'KFT' },
  'eGFR':               { min: 60,   max: 999,  unit: 'mL/min',  category: 'KFT' },
  // Liver
  'SGOT':                { min: 0,    max: 40,   unit: 'U/L',     category: 'LFT' },
  'SGPT':                { min: 0,    max: 40,   unit: 'U/L',     category: 'LFT' },
  'AST':                 { min: 0,    max: 40,   unit: 'U/L',     category: 'LFT' },
  'ALT':                 { min: 0,    max: 40,   unit: 'U/L',     category: 'LFT' },
  'Alkaline Phosphatase':{ min: 44,   max: 147,  unit: 'U/L',     category: 'LFT' },
  'ALP':                 { min: 44,   max: 147,  unit: 'U/L',     category: 'LFT' },
  'GGT':                 { min: 0,    max: 60,   unit: 'U/L',     category: 'LFT' },
  'Total Bilirubin':     { min: 0.1,  max: 1.2,  unit: 'mg/dL',  category: 'LFT' },
  'Bilirubin':           { min: 0.1,  max: 1.2,  unit: 'mg/dL',  category: 'LFT' },
  'Direct Bilirubin':    { min: 0,    max: 0.3,  unit: 'mg/dL',  category: 'LFT' },
  'Indirect Bilirubin':  { min: 0.2,  max: 0.9,  unit: 'mg/dL',  category: 'LFT' },
  'Total Protein':       { min: 6.0,  max: 8.3,  unit: 'g/dL',   category: 'LFT' },
  'Albumin':             { min: 3.5,  max: 5.0,  unit: 'g/dL',   category: 'LFT' },
  'Globulin':            { min: 2.0,  max: 3.5,  unit: 'g/dL',   category: 'LFT' },
  // Minerals
  'Calcium':             { min: 8.5,  max: 10.5, unit: 'mg/dL',  category: 'Minerals' },
  'Phosphorus':          { min: 2.5,  max: 4.5,  unit: 'mg/dL',  category: 'Minerals' },
  'Magnesium':           { min: 1.7,  max: 2.2,  unit: 'mg/dL',  category: 'Minerals' },
  'Sodium':              { min: 136,  max: 145,  unit: 'mEq/L',  category: 'Minerals' },
  'Potassium':           { min: 3.5,  max: 5.0,  unit: 'mEq/L',  category: 'Minerals' },
  'Chloride':            { min: 98,   max: 107,  unit: 'mEq/L',  category: 'Minerals' },
  'Iron':                { min: 60,   max: 170,  unit: 'µg/dL',  category: 'Minerals' },
  'Ferritin':            { min: 12,   max: 300,  unit: 'ng/mL',  category: 'Minerals' },
  'TIBC':                { min: 240,  max: 450,  unit: 'µg/dL',  category: 'Minerals' },
  // CRP / Inflammatory
  'CRP':                 { min: 0,    max: 5.0,  unit: 'mg/L',   category: 'Inflammatory' },
  'ESR':                 { min: 0,    max: 20,   unit: 'mm/hr',  category: 'Inflammatory' },
};


const PARAM_PATTERNS = [
  // Common patterns: "Parameter Name : value unit" or "Parameter Name value unit"
  { name: 'Hemoglobin',          pattern: /hem[og]+lobin[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'RBC',                 pattern: /r\.?b\.?c\.?(?:\s*count)?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'WBC',                 pattern: /(?:w\.?b\.?c\.?|total\s+leukocyte\s+count|tlc)[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Platelets',           pattern: /platelets?(?:\s+count)?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'HCT',                 pattern: /h\.?c\.?t\.?[\s|:][\s]*([0-9]+\.?[0-9]*)/i },
  { name: 'Hematocrit',          pattern: /hematocrit[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'PCV',                 pattern: /p\.?c\.?v\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'MCV',                 pattern: /m\.?c\.?v\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'MCH',                 pattern: /m\.?c\.?h\.?(?!c)[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'MCHC',                pattern: /m\.?c\.?h\.?c\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'RDW',                 pattern: /r\.?d\.?w\.?(?:[\s\-]?c?v?)?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Neutrophils',         pattern: /neutrophils?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Lymphocytes',         pattern: /lymphocytes?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Monocytes',           pattern: /monocytes?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Eosinophils',         pattern: /eosinophils?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Basophils',           pattern: /basophils?[\s:]+([0-9]+\.?[0-9]*)/i },
  // Blood Sugar
  { name: 'Fasting Blood Sugar', pattern: /fasting[\s]+blood[\s]+(?:sugar|glucose)[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Fasting Glucose',     pattern: /fasting[\s]+glucose[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Random Blood Sugar',  pattern: /random[\s]+blood[\s]+(?:sugar|glucose)[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Blood Sugar',         pattern: /blood[\s]+(?:sugar|glucose)[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'PP Blood Sugar',      pattern: /p\.?p\.?[\s]+(?:blood[\s]+)?(?:sugar|glucose)[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'HbA1c',               pattern: /hb[\s]?a1c[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Glucose',             pattern: /\bglucose\b[\s:]+([0-9]+\.?[0-9]*)/i },
  // Lipid
  { name: 'Total Cholesterol',   pattern: /total[\s]+cholesterol[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Cholesterol',         pattern: /cholesterol[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'LDL',                 pattern: /l\.?d\.?l\.?(?:[\s\-]?cholesterol)?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'HDL',                 pattern: /h\.?d\.?l\.?(?:[\s\-]?cholesterol)?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Triglycerides',       pattern: /triglycerides?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'VLDL',                pattern: /v\.?l\.?d\.?l\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  // Thyroid
  { name: 'TSH',                 pattern: /t\.?s\.?h\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Free T3',             pattern: /free[\s]+t3[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Free T4',             pattern: /free[\s]+t4[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'T3',                  pattern: /\bt3\b[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'T4',                  pattern: /\bt4\b[\s:]+([0-9]+\.?[0-9]*)/i },
  // Vitamins
  { name: 'Vitamin D',           pattern: /vitamin[\s]+d[\s:3]*[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Vitamin B12',         pattern: /vitamin[\s]+b[\s]?12[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Folate',              pattern: /folate[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Folic Acid',          pattern: /folic[\s]+acid[\s:]+([0-9]+\.?[0-9]*)/i },
  // Kidney
  { name: 'Creatinine',          pattern: /creatinine[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Blood Urea Nitrogen', pattern: /blood[\s]+urea[\s]+nitrogen[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'BUN',                 pattern: /b\.?u\.?n\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Urea',                pattern: /\burea\b[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Uric Acid',           pattern: /uric[\s]+acid[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'eGFR',               pattern: /e\.?g\.?f\.?r\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  // Liver
  { name: 'SGOT',                pattern: /s\.?g\.?o\.?t\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'SGPT',                pattern: /s\.?g\.?p\.?t\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'AST',                 pattern: /\bast\b[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'ALT',                 pattern: /\balt\b[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Alkaline Phosphatase',pattern: /alkaline[\s]+phosphatase[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'ALP',                 pattern: /\balp\b[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'GGT',                 pattern: /\bggt\b[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Total Bilirubin',     pattern: /total[\s]+bilirubin[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Direct Bilirubin',    pattern: /direct[\s]+bilirubin[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Indirect Bilirubin',  pattern: /indirect[\s]+bilirubin[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Bilirubin',           pattern: /\bbilirubin\b[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Total Protein',       pattern: /total[\s]+protein[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Albumin',             pattern: /albumin[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Globulin',            pattern: /globulin[\s:]+([0-9]+\.?[0-9]*)/i },
  // Minerals
  { name: 'Calcium',             pattern: /calcium[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Phosphorus',          pattern: /phosphorus[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Magnesium',           pattern: /magnesium[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Sodium',              pattern: /sodium[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Potassium',           pattern: /potassium[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Chloride',            pattern: /chloride[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Ferritin',            pattern: /ferritin[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'TIBC',                pattern: /t\.?i\.?b\.?c\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'Iron',                pattern: /\biron\b(?!\s+binding)[\s:]+([0-9]+\.?[0-9]*)/i },
  // Inflammatory
  { name: 'CRP',                 pattern: /c\.?r\.?p\.?[\s:]+([0-9]+\.?[0-9]*)/i },
  { name: 'ESR',                 pattern: /e\.?s\.?r\.?[\s:]+([0-9]+\.?[0-9]*)/i },
];

function cleanOCRText(rawText) {
  if (!rawText) return '';

  let text = rawText;

  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  text = text.replace(/[^\S\n]+/g, ' '); 
  text = text.replace(/[•●▪◦‣∙·]+/g, ' '); 
  text = text.replace(/[|]{2,}/g, ' '); 
  text = text.replace(/[_]{3,}/g, ' '); 
  text = text.replace(/[-]{3,}/g, ' '); 
  text = text.replace(/[~^`]+/g, '');   
  text = text.replace(/[\u2018\u2019]/g, "'"); 
  text = text.replace(/[\u201C\u201D]/g, '"');
  text = text.replace(/\u00A0/g, ' '); 
  text = text.replace(/[\u2236\uFF1A]/g, ':'); 
  text = text.replace(/\s*:\s*/g, ' : ');
  text = text.replace(/\s*\|\s*/g, ' | ');

  const rawLines = text.split('\n').map(l => l.trim());
  const mergedLines = [];
  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i];
    if (!line) { mergedLines.push(''); continue; }
    mergedLines.push(line);
  }
  text = mergedLines.join('\n');

  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/ {2,}/g, ' ');
  text = text.split('\n').map(l => l.trim()).join('\n');

  return text.trim();
}

function flattenForFieldSearch(text) {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .join(' \n ');
}


function detectReportType(text) {
  const t = text.toLowerCase();
  if (/hb\s*a1c|glycated|glycosylated|diabetes|blood\s+sugar/.test(t)) return 'Diabetes / HbA1c';
  if (/thyroid|tsh|t3|t4/.test(t)) return 'Thyroid Function Test';
  if (/lipid|cholesterol|ldl|hdl|triglyceride/.test(t)) return 'Lipid Profile';
  if (/vitamin\s+d|vitamin\s+b12|folate|folic/.test(t)) return 'Vitamin Panel';
  if (/hemoglobin|rbc|wbc|platelet|hematocrit|cbc|complete\s+blood/.test(t)) return 'CBC Report';
  if (/liver|sgot|sgpt|bilirubin|ast|alt|lft/.test(t)) return 'Liver Function Test (LFT)';
  if (/creatinine|urea|kidney|kft|gfr|uric\s+acid/.test(t)) return 'Kidney Function Test (KFT)';
  if (/urine|urea|protein\s+creatinine|specific\s+gravity|ph\s+[0-9]/.test(t)) return 'Urine Analysis';
  if (/ecg|electrocardiogram/.test(t)) return 'ECG Report';
  if (/x.ray|xray|radiograph/.test(t)) return 'X-Ray Report';
  if (/mri|magnetic\s+resonance/.test(t)) return 'MRI Report';
  if (/prescription|rx|tablet|capsule/.test(t)) return 'Prescription';
  return 'Pathology Report';
}


function cleanFieldValue(val) {
  if (!val) return val;
  let v = val;
  v = v.replace(/[^A-Za-z0-9&\.\-'’,\s]/g, ' '); // strip stray symbols/garbage
  v = v.replace(/\s{2,}/g, ' ').trim();
  v = v.replace(/^[\.\-,\s]+|[\.\-,\s]+$/g, '');
  return v;
}

function isPlausibleName(val) {
  if (!val) return false;
  if (val.length < 2 || val.length > 60) return false;
  if (/^[0-9\s\-\/\.]+$/.test(val)) return false; // pure numeric/date
  if (/\b(hospital|laboratory|lab|clinic|centre|center|diagnostic|pathology|report|patient|doctor|reg(?:istration)?\s*no|id\s*no)\b/i.test(val)) return false;
  return true;
}

function extractLabeledField(text, labelPatterns, opts = {}) {
  const { maxWords = 6, allowDigits = false } = opts;
  // value chars: letters, spaces, dots; optionally digits (for IDs/dates)
  const valueCharClass = allowDigits ? `[A-Za-z0-9&\\.\\-'’,\\s]` : `[A-Za-z\\.\\-'’\\s]`;
  for (const label of labelPatterns) {
    // Pattern: LABEL [:|-] VALUE   (value stops at newline, or at next known field label, or at 2+ spaces)
    const re = new RegExp(
      label + `\\s*[:\\-]\\s*(${valueCharClass}{2,80}?)(?:\\n|\\s{2,}|$|(?=\\b(?:age|gender|sex|patient|name|doctor|dr\\.?|hospital|lab|clinic|date|id|no\\.?|report|ref|consultant|centre|center)\\b))`,
      'i'
    );
    const m = text.match(re);
    if (m && m[1]) {
      const candidate = cleanFieldValue(m[1]);
      const wordCount = candidate.split(/\s+/).filter(Boolean).length;
      if (candidate && wordCount <= maxWords) return candidate;
    }
  }
  return null;
}

function extractPatientInfo(rawText) {
  const info = {
    name: 'Not Found',
    age: 'Not Found',
    gender: 'Not Found',
    patientId: 'Not Found',
    hospital: 'Not Found',
    doctor: 'Not Found',
    date: 'Not Found',
    reportNo: 'Not Found'
  };

  const cleaned = cleanOCRText(rawText);
  const text = flattenForFieldSearch(cleaned);
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);

  let name = extractLabeledField(text, [
    'patient\\s*name',
    'name\\s+of\\s+patient',
    'patient(?!\\s*id)',   // "Patient :" alone (not "Patient ID")
    '\\bname\\b(?!\\s*of\\s*(?:doctor|physician|hospital|lab))',
  ], { maxWords: 5 });

  if (name && /^dr\.?\s/i.test(name)) name = null;
  if (name && !isPlausibleName(name)) name = null;
  if (name) info.name = name;

  let doctor = extractLabeledField(text, [
    'ref(?:erred|erring)?\\.?\\s*(?:by)?\\s*doctor',
    'referred\\s+by',
    'consultant\\s*(?:doctor)?',
    'ordering\\s+physician',
    'doctor\\s*name',
    '\\bdoctor\\b',
    '\\bphysician\\b',
  ], { maxWords: 5 });

  if (doctor) {
    doctor = doctor.replace(/^dr\.?\s*/i, '').trim();
    if (isPlausibleName(doctor)) {
      info.doctor = 'Dr. ' + doctor;
    }
  }
  
  if (info.doctor === 'Not Found') {
    for (const line of lines) {
      const m = line.match(/\bdr\.?\s+([A-Za-z\.\s]{2,40})/i);
      if (m && m[1]) {
        const candidate = cleanFieldValue(m[1]);
        if (isPlausibleName(candidate) && candidate.toLowerCase() !== (info.name || '').toLowerCase()) {
          info.doctor = 'Dr. ' + candidate;
          break;
        }
      }
    }
  }

  /* ---------- AGE ---------- */
  let age = extractLabeledField(text, [
    'age\\s*/\\s*gender',
    'age\\s*/\\s*sex',
    '\\bage\\b',
  ], { maxWords: 4, allowDigits: true });

  if (age) {
    const ageNumMatch = age.match(/(\d{1,3})\s*(y(?:ears?|rs?)?|m(?:onths?)?)?/i);
    if (ageNumMatch) {
      const num = ageNumMatch[1];
      const unit = /m/i.test(ageNumMatch[2] || '') ? 'months' : 'years';
      info.age = `${num} ${unit}`;
    }
  }
  if (info.age === 'Not Found') {
    const m = text.match(/(\d{1,3})\s*(?:years?|yrs?|y\.?o\.?)\b/i);
    if (m) info.age = `${m[1]} years`;
  }

  /* ---------- GENDER ---------- */
  let gender = extractLabeledField(text, [
    'gender',
    'sex',
  ], { maxWords: 1 });

  if (!gender) {
    // Combined "Age/Gender : 32/M" or "32 Y / M" style fields
    const combo = text.match(/\b\d{1,3}\s*(?:y(?:ears?|rs?)?)?\s*\/\s*([MF](?:ale|emale)?)\b/i);
    if (combo) gender = combo[1];
  }
  if (gender) {
    const g = gender.trim().toLowerCase();
    if (g.startsWith('m')) info.gender = 'Male';
    else if (g.startsWith('f')) info.gender = 'Female';
  }

  /* ---------- PATIENT ID ---------- */
  let patientId = extractLabeledField(text, [
    'patient\\s*id',
    '\\bpid\\b',
    'patient\\s*no\\.?',
    'patient\\s*number',
    'reg(?:istration)?\\.?\\s*no\\.?',
    'uhid',
    'mrn',
  ], { maxWords: 3, allowDigits: true });
  if (patientId) info.patientId = cleanFieldValue(patientId).replace(/\s+/g, '');

  /* ---------- HOSPITAL / LAB ---------- */
  let hospital = extractLabeledField(text, [
    'hospital\\s*name',
    'lab(?:oratory)?\\s*name',
    '\\bhospital\\b',
    '\\blaboratory\\b',
    '\\bclinic\\b',
    'diagnostic\\s*centre',
    'diagnostic\\s*center',
    '\\bcentre\\b',
    '\\bcenter\\b',
  ], { maxWords: 8 });

  if (hospital) {
    hospital = cleanFieldValue(hospital);
    if (hospital.length >= 3) info.hospital = hospital;
  }

  // Fallback: known major Indian diagnostic chains, scanned anywhere in text
  if (info.hospital === 'Not Found') {
    const knownChains = [
      'Apollo Diagnostics', 'Apollo Hospitals', 'Dr Lal PathLabs', 'Dr. Lal PathLabs',
      'SRL Diagnostics', 'Thyrocare', 'Max Healthcare', 'Fortis Healthcare', 'Fortis',
      'AIIMS', 'Metropolis Healthcare', 'Metropolis', 'Redcliffe Labs', 'Redcliffe',
      'Healthians', 'Medanta',
    ];
    for (const chain of knownChains) {
      const re = new RegExp(chain.replace(/\s+/g, '\\s+'), 'i');
      if (re.test(cleaned)) { info.hospital = chain; break; }
    }
  }

  // Fallback: first few lines often contain the letterhead/hospital name
  if (info.hospital === 'Not Found') {
    for (const line of lines.slice(0, 6)) {
      if (/hospital|diagnostic|lab|clinic|path|healthcare/i.test(line)) {
        const candidate = cleanFieldValue(line);
        if (candidate.length >= 3 && candidate.length <= 60) {
          info.hospital = candidate.substring(0, 60);
          break;
        }
      }
    }
  }

  /* ---------- DATE ---------- */
  let date = extractLabeledField(text, [
    'report(?:ed)?\\s*(?:on|date)',
    'collection\\s*date',
    '\\bdate\\b',
  ], { maxWords: 3, allowDigits: true });
  if (date) {
    const dm = date.match(/(\d{1,4}[\-\/\.]\d{1,2}[\-\/\.]\d{1,4})/);
    if (dm) info.date = dm[1];
  }
  if (info.date === 'Not Found') {
    const dm = text.match(/(\d{1,2}[\-\/\.]\d{1,2}[\-\/\.]\d{2,4})/) || text.match(/(\d{2,4}[\-\/\.]\d{1,2}[\-\/\.]\d{1,2})/);
    if (dm) info.date = dm[1];
  }

  /* ---------- REPORT NUMBER ---------- */
  let reportNo = extractLabeledField(text, [
    'report\\s*(?:no|number|id)\\.?',
    'lab\\s*ref(?:erence)?\\.?\\s*(?:no)?',
    'accession\\s*(?:no)?\\.?',
    'bill\\s*(?:no)?\\.?',
    'order\\s*(?:no|id)?\\.?',
    'sid\\s*no\\.?',
  ], { maxWords: 3, allowDigits: true });
  if (reportNo) info.reportNo = cleanFieldValue(reportNo).replace(/\s+/g, '');

  return info;
}


function extractParameters(rawText) {
  const found = [];
  const seen = new Set();
  const text = cleanOCRText(rawText);

  for (const { name, pattern } of PARAM_PATTERNS) {
    if (seen.has(name)) continue;
    const match = text.match(pattern);
    if (match && match[1]) {
      const value = parseFloat(match[1]);
      if (!isNaN(value)) {
        const ref = REFERENCE_RANGES[name];
        if (ref) {

          const widePlausibleMax = ref.max === 999 ? ref.min * 10 : ref.max * 5 + 50;
          if (value < 0 || value > widePlausibleMax) continue;

          const status = classifyStatus(value, ref.min, ref.max);
          const deviation = calcDeviation(value, ref.min, ref.max);
          found.push({ name, value, unit: ref.unit, min: ref.min, max: ref.max, status, deviation, category: ref.category });
          seen.add(name);
        }
      }
    }
  }

  if (Object.keys(REFERENCE_RANGES).length) {
    const lines = text.split('\n');
    const aliasMap = buildAliasMap();

    for (const line of lines) {
      const lower = line.toLowerCase();
      for (const paramName of Object.keys(REFERENCE_RANGES)) {
        if (seen.has(paramName)) continue;
        const aliases = aliasMap[paramName] || [paramName.toLowerCase()];
        for (const alias of aliases) {
          if (!lower.includes(alias)) continue;
          // Find the first plausible numeric token after the alias position
          const idx = lower.indexOf(alias);
          const rest = line.slice(idx + alias.length);
          const numMatch = rest.match(/([0-9]+\.?[0-9]*)/);
          if (numMatch) {
            const value = parseFloat(numMatch[1]);
            const ref = REFERENCE_RANGES[paramName];
            if (!isNaN(value) && ref) {
              const widePlausibleMax = ref.max === 999 ? ref.min * 10 : ref.max * 5 + 50;
              if (value < 0 || value > widePlausibleMax) continue;
              const status = classifyStatus(value, ref.min, ref.max);
              const deviation = calcDeviation(value, ref.min, ref.max);
              found.push({ name: paramName, value, unit: ref.unit, min: ref.min, max: ref.max, status, deviation, category: ref.category });
              seen.add(paramName);
            }
          }
          break;
        }
      }
    }
  }

  return found;
}

function buildAliasMap() {
  return {
    'Hemoglobin': ['hemoglobin', 'haemoglobin', 'hb '],
    'RBC': ['rbc', 'red blood cell'],
    'WBC': ['wbc', 'white blood cell', 'total leukocyte', 'tlc'],
    'Platelets': ['platelet'],
    'HCT': ['hct'],
    'Hematocrit': ['hematocrit', 'haematocrit'],
    'PCV': ['pcv', 'packed cell volume'],
    'MCV': ['mcv'],
    'MCH': ['mch'],
    'MCHC': ['mchc'],
    'RDW': ['rdw'],
    'Neutrophils': ['neutrophil'],
    'Lymphocytes': ['lymphocyte'],
    'Monocytes': ['monocyte'],
    'Eosinophils': ['eosinophil'],
    'Basophils': ['basophil'],
    'Fasting Blood Sugar': ['fasting blood sugar', 'fasting sugar'],
    'Fasting Glucose': ['fasting glucose'],
    'Random Blood Sugar': ['random blood sugar'],
    'Blood Sugar': ['blood sugar'],
    'Glucose': ['glucose'],
    'PP Blood Sugar': ['pp blood sugar', 'post prandial'],
    'HbA1c': ['hba1c', 'hb a1c', 'glycated hemoglobin'],
    'Total Cholesterol': ['total cholesterol'],
    'Cholesterol': ['cholesterol'],
    'LDL': ['ldl'],
    'HDL': ['hdl'],
    'Triglycerides': ['triglyceride'],
    'VLDL': ['vldl'],
    'TSH': ['tsh'],
    'T3': ['t3'],
    'T4': ['t4'],
    'Free T3': ['free t3'],
    'Free T4': ['free t4'],
    'Vitamin D': ['vitamin d'],
    'Vitamin D3': ['vitamin d3'],
    'Vitamin B12': ['vitamin b12', 'vit b12'],
    'Folate': ['folate'],
    'Folic Acid': ['folic acid'],
    'Creatinine': ['creatinine'],
    'Urea': ['urea'],
    'Blood Urea Nitrogen': ['blood urea nitrogen'],
    'BUN': ['bun'],
    'Uric Acid': ['uric acid'],
    'eGFR': ['egfr'],
    'SGOT': ['sgot'],
    'SGPT': ['sgpt'],
    'AST': ['ast'],
    'ALT': ['alt'],
    'Alkaline Phosphatase': ['alkaline phosphatase'],
    'ALP': ['alp'],
    'GGT': ['ggt'],
    'Total Bilirubin': ['total bilirubin'],
    'Direct Bilirubin': ['direct bilirubin'],
    'Indirect Bilirubin': ['indirect bilirubin'],
    'Bilirubin': ['bilirubin'],
    'Total Protein': ['total protein'],
    'Albumin': ['albumin'],
    'Globulin': ['globulin'],
    'Calcium': ['calcium'],
    'Phosphorus': ['phosphorus'],
    'Magnesium': ['magnesium'],
    'Sodium': ['sodium'],
    'Potassium': ['potassium'],
    'Chloride': ['chloride'],
    'Iron': ['iron'],
    'Ferritin': ['ferritin'],
    'TIBC': ['tibc'],
    'CRP': ['crp'],
    'ESR': ['esr'],
  };
}

function classifyStatus(val, min, max) {
  const range = max - min;
  const borderlineMargin = range * 0.1;
  if (val < min) {
    if (min - val <= borderlineMargin) return 'borderline';
    return 'low';
  }
  if (val > max) {
    if (val - max <= borderlineMargin) return 'borderline';
    return 'high';
  }
  return 'normal';
}

function calcDeviation(val, min, max) {
  if (max === 999) max = val * 2; 
  const mid = (min + max) / 2;
  const range = (max - min) / 2 || 1;
  const pct = Math.min(100, Math.abs((val - mid) / range) * 50);
  return Math.round(pct);
}


function calcHealthScore(parameters) {
  if (!parameters.length) return 0;
  let score = 100;
  for (const p of parameters) {
    if (p.status === 'high' || p.status === 'low') score -= 8;
    else if (p.status === 'borderline') score -= 3;
  }
  return Math.max(0, Math.min(100, score));
}

function getRiskLevel(score) {
  if (score >= 80) return { label: 'Healthy', cls: 'healthy' };
  if (score >= 60) return { label: 'Moderate Risk', cls: 'moderate' };
  if (score >= 40) return { label: 'High Risk', cls: 'high' };
  return { label: 'Critical', cls: 'critical' };
}


function generateAnalysis(parameters, patientInfo, reportType) {
  const abnormal = parameters.filter(p => p.status === 'high' || p.status === 'low');
  const borderline = parameters.filter(p => p.status === 'borderline');
  const normal = parameters.filter(p => p.status === 'normal');
  const score = calcHealthScore(parameters);
  const risk = getRiskLevel(score);

  let html = '';

  // Overview
  html += `<h4>📋 Report Overview</h4>`;
  html += `<p>Report Type: <strong>${reportType}</strong>. `;
  if (patientInfo.name && patientInfo.name !== 'Not Found') {
    html += `Patient: <strong>${patientInfo.name}</strong>`;
    if (patientInfo.age !== 'Not Found') html += `, Age ${patientInfo.age}`;
    if (patientInfo.gender !== 'Not Found') html += `, ${patientInfo.gender}`;
    html += '. ';
  }
  html += `Total parameters detected: <strong>${parameters.length}</strong>. Health Score: <strong>${score}/100</strong> — Risk Level: <span class="${risk.cls === 'healthy' ? 'highlight-good' : risk.cls === 'critical' ? 'highlight-bad' : 'highlight-warn'}">${risk.label}</span>.</p>`;

  // Normal Values
  if (normal.length) {
    html += `<h4>✅ Normal Values</h4>`;
    html += `<p>${normal.map(p => `<span class="highlight-good">${p.name}</span> (${p.value} ${p.unit})`).join(', ')} — all within healthy reference ranges.</p>`;
  }

  // Abnormal Values
  if (abnormal.length) {
    html += `<h4>🔴 Abnormal Values Requiring Attention</h4>`;
    for (const p of abnormal) {
      const direction = p.status === 'high' ? 'elevated above' : 'below';
      const limit = p.status === 'high' ? `upper limit ${p.max} ${p.unit}` : `lower limit ${p.min} ${p.unit}`;
      html += `<p><span class="highlight-bad">${p.name}</span>: ${p.value} ${p.unit} — <em>${direction}</em> normal range (${limit}). `;
      html += getParamExplanation(p.name, p.status) + '</p>';
    }
  }

  // Borderline Values
  if (borderline.length) {
    html += `<h4>🟡 Borderline Values</h4>`;
    for (const p of borderline) {
      html += `<p><span class="highlight-warn">${p.name}</span>: ${p.value} ${p.unit} — borderline, close to the ${p.value < p.min ? 'lower' : 'upper'} limit of normal (${p.min}–${p.max} ${p.unit}). Monitor closely.</p>`;
    }
  }

  // Possible Impact
  if (abnormal.length) {
    html += `<h4>⚕️ Possible Health Impact</h4>`;
    html += `<ul>`;
    for (const p of abnormal) {
      html += `<li>${getHealthImpact(p.name, p.status)}</li>`;
    }
    html += `</ul>`;
  }

  // Doctor Advice
  html += `<h4>👨‍⚕️ Doctor Consultation Advice</h4>`;
  if (abnormal.length > 3) {
    html += `<p class="highlight-bad">Multiple abnormal parameters detected. <strong>Prompt medical consultation is strongly recommended.</strong></p>`;
  } else if (abnormal.length > 0) {
    html += `<p class="highlight-warn">Some values are outside normal ranges. <strong>Consult your physician</strong> to review these findings and determine next steps.</p>`;
  } else if (borderline.length > 0) {
    html += `<p>Most values are within normal ranges. However, borderline values should be monitored. Consider a follow-up test in 3–6 months.</p>`;
  } else {
    html += `<p class="highlight-good">All detected parameters are within normal limits. Continue maintaining a healthy lifestyle.</p>`;
  }

  return html;
}

function getParamExplanation(name, status) {
  const map = {
    'Hemoglobin': {
      low: 'May indicate anemia (iron-deficiency, vitamin deficiency, or blood loss). Common symptoms include fatigue, weakness, and pallor.',
      high: 'May indicate polycythemia, dehydration, or living at high altitude. Can increase blood clot risk.'
    },
    'WBC': {
      low: 'Leukopenia — may indicate bone marrow suppression, viral infections, or autoimmune conditions.',
      high: 'Leukocytosis — may indicate bacterial infection, inflammation, stress response, or leukemia in rare cases.'
    },
    'Platelets': {
      low: 'Thrombocytopenia — increased bleeding risk. May be due to viral infections, bone marrow issues, or autoimmune conditions.',
      high: 'Thrombocytosis — may increase clotting risk. Can be reactive (infection/inflammation) or primary (bone marrow disorder).'
    },
    'HbA1c': {
      high: 'Elevated HbA1c indicates poorly controlled blood glucose over the past 2-3 months. Values above 6.5% suggest diabetes.',
      low: 'Unusually low HbA1c can indicate hemolytic anemia or misleading values due to certain hemoglobin variants.'
    },
    'TSH': {
      high: 'Elevated TSH suggests hypothyroidism — the thyroid gland may not be producing enough hormones.',
      low: 'Low TSH suggests hyperthyroidism — the thyroid may be overactive, causing rapid metabolism.'
    },
    'LDL': {
      high: 'Elevated LDL ("bad" cholesterol) increases risk of arterial plaque buildup, heart disease, and stroke.',
      low: 'Very low LDL is generally favorable but can occasionally be associated with malnutrition or rare conditions.'
    },
    'HDL': {
      low: 'Low HDL ("good" cholesterol) increases cardiovascular risk. HDL helps remove excess cholesterol from arteries.',
      high: 'High HDL is generally protective against cardiovascular disease.'
    },
    'Triglycerides': {
      high: 'Elevated triglycerides can increase risk of pancreatitis and cardiovascular disease. Often related to diet, obesity, or diabetes.',
      low: 'Very low triglycerides are uncommon and may indicate malnutrition or malabsorption.'
    },
    'Creatinine': {
      high: 'Elevated creatinine may indicate reduced kidney function. Should be evaluated with eGFR for full kidney assessment.',
      low: 'Low creatinine can reflect decreased muscle mass, pregnancy, or low protein diet.'
    },
    'SGOT': {
      high: 'Elevated AST/SGOT can indicate liver damage, muscle injury, or heart problems.',
    },
    'SGPT': {
      high: 'Elevated ALT/SGPT is a more specific indicator of liver cell damage or liver disease.',
    },
    'Vitamin D': {
      low: 'Vitamin D deficiency can cause bone weakness, fatigue, muscle pain, and immune dysfunction.',
      high: 'Vitamin D toxicity (rare) can cause hypercalcemia, nausea, and kidney issues.'
    },
    'Vitamin B12': {
      low: 'B12 deficiency can cause megaloblastic anemia, neurological damage, and fatigue.',
      high: 'Very high B12 may indicate liver disease, myeloproliferative disorder, or excessive supplementation.'
    },
  };
  const entry = map[name];
  if (entry) {
    if (status === 'high' && entry.high) return entry.high;
    if ((status === 'low' || status === 'borderline') && entry.low) return entry.low;
  }
  return `Value is outside the normal reference range. Please consult your physician for detailed evaluation.`;
}

function getHealthImpact(name, status) {
  const impacts = {
    'Hemoglobin': 'Low hemoglobin can cause chronic fatigue, reduced work capacity, and breathlessness.',
    'WBC': 'Abnormal WBC can affect immunity and the body\'s ability to fight infections.',
    'Platelets': 'Abnormal platelet counts affect blood clotting and can lead to bleeding or clot formation.',
    'HbA1c': 'Uncontrolled blood sugar increases risk of nerve damage, kidney disease, and eye complications.',
    'TSH': 'Thyroid dysfunction affects metabolism, energy, weight, mood, and heart rate.',
    'LDL': 'High LDL promotes arterial plaque formation, increasing heart attack and stroke risk.',
    'Triglycerides': 'High triglycerides are a risk factor for pancreatitis and cardiovascular events.',
    'Creatinine': 'Elevated creatinine may signal declining kidney function requiring monitoring.',
    'SGPT': 'Elevated liver enzymes suggest ongoing liver stress requiring dietary and lifestyle changes.',
    'SGOT': 'Elevated liver enzymes may reflect hepatocellular damage or systemic illness.',
    'Vitamin D': 'Deficiency weakens bones, impairs immunity, and increases fatigue and depression risk.',
    'Vitamin B12': 'Deficiency can lead to irreversible neurological damage if untreated.',
  };
  return impacts[name] || `Abnormal ${name} requires evaluation to determine underlying cause and appropriate intervention.`;
}


function generateRecommendations(parameters) {
  const abnormal = parameters.filter(p => p.status === 'high' || p.status === 'low');
  const abnormalNames = abnormal.map(p => p.name.toLowerCase());

  const hasAnemia = abnormalNames.some(n => ['hemoglobin', 'rbc'].includes(n));
  const hasDiabetes = abnormalNames.some(n => ['fasting blood sugar', 'hba1c', 'random blood sugar', 'blood sugar'].includes(n));
  const hasLipid = abnormalNames.some(n => ['ldl', 'cholesterol', 'triglycerides', 'total cholesterol'].includes(n));
  const hasLowVitD = parameters.find(p => p.name === 'Vitamin D' && (p.status === 'low' || p.status === 'borderline'));
  const hasLowB12 = parameters.find(p => p.name === 'Vitamin B12' && (p.status === 'low' || p.status === 'borderline'));
  const hasLiver = abnormalNames.some(n => ['sgot', 'sgpt', 'ast', 'alt', 'bilirubin'].includes(n));
  const hasKidney = abnormalNames.some(n => ['creatinine', 'urea', 'bun', 'uric acid'].includes(n));
  const hasThyroid = abnormalNames.some(n => ['tsh', 't3', 't4'].includes(n));
  const hasLowHDL = parameters.find(p => p.name === 'HDL' && p.status === 'low');

  const cards = [];

  // Foods to Eat
  const eatItems = [];
  if (hasAnemia) eatItems.push('Lean red meat, spinach, lentils, and beans (rich in iron)', 'Citrus fruits to improve iron absorption', 'Eggs and dairy for B12');
  if (hasDiabetes) eatItems.push('Whole grains, oats, and brown rice (low glycemic index)', 'Leafy greens, beans, and non-starchy vegetables', 'Berries, apples, and low-GI fruits');
  if (hasLipid || hasLowHDL) eatItems.push('Oily fish (salmon, mackerel) for omega-3 fatty acids', 'Olive oil, avocado, and nuts (healthy fats)', 'Oats and soluble fiber-rich foods');
  if (hasLowVitD) eatItems.push('Fatty fish, egg yolks, and fortified dairy for Vitamin D', 'Safe sun exposure (15–20 min daily)');
  if (hasLowB12) eatItems.push('Meat, poultry, fish, eggs, and dairy for Vitamin B12', 'B12-fortified cereals and nutritional yeast');
  if (hasLiver) eatItems.push('Cruciferous vegetables (broccoli, cauliflower) for liver detox', 'Turmeric and garlic for liver protection', 'Adequate water (2–3 liters/day)');
  if (hasKidney) eatItems.push('Low-potassium fruits (apples, berries, grapes)', 'White rice, pasta, and white bread (lower in potassium/phosphorus)', 'Plenty of water to flush kidneys (if not restricted by doctor)');
  if (!eatItems.length) eatItems.push('Balanced diet with fruits, vegetables, whole grains, and lean protein', 'Seasonal fruits and green vegetables daily', 'Sufficient hydration — at least 8 glasses of water daily');

  cards.push({ icon: '🥗', title: 'Foods to Eat', subtitle: 'Recommended for your report', items: eatItems, dotClass: 'green' });

  // Foods to Avoid
  const avoidItems = [];
  if (hasDiabetes) avoidItems.push('Sugary beverages, sweets, white bread, and refined carbohydrates', 'Fruit juices and high-GI foods (potatoes, white rice)', 'Processed snacks and fast food');
  if (hasLipid) avoidItems.push('Saturated fats (red meat, full-fat dairy, butter)', 'Trans fats (fried foods, packaged snacks, margarine)', 'Excessive dietary cholesterol (organ meats, egg yolks in excess)');
  if (hasLiver) avoidItems.push('Alcohol and alcohol-containing products', 'High-fat and fried foods that stress the liver', 'Paracetamol/NSAIDs without medical supervision');
  if (hasKidney) avoidItems.push('High-potassium foods (bananas, oranges, potatoes) if potassium is elevated', 'Excessive protein (red meat, poultry) to reduce kidney workload', 'Salt and high-sodium processed foods');
  if (!avoidItems.length) avoidItems.push('Ultra-processed foods, junk food, and fast food', 'Excessive sugar, salt, and saturated fats', 'Alcohol and smoking');

  cards.push({ icon: '🚫', title: 'Foods to Avoid', subtitle: 'Based on your report findings', items: avoidItems, dotClass: 'red' });

  // Exercise
  const exerciseItems = [];
  if (hasAnemia) {
    exerciseItems.push('Light to moderate exercise — walking, yoga, stretching', 'Avoid intense workouts until hemoglobin normalizes', 'Rest adequately between activities');
  } else if (hasDiabetes) {
    exerciseItems.push('30 minutes of brisk walking 5 days/week', 'Resistance training 2–3 times/week improves insulin sensitivity', 'Monitor blood sugar before and after exercise');
  } else if (hasLipid) {
    exerciseItems.push('Aerobic exercise (walking, jogging, cycling) 30–45 min/day', 'HIIT (High-Intensity Interval Training) can help raise HDL', '5 days/week of moderate-intensity exercise');
  } else {
    exerciseItems.push('30–45 minutes of moderate exercise at least 5 days/week', 'Mix of cardio (walking, cycling) and strength training', 'Include flexibility and balance exercises');
  }

  cards.push({ icon: '🏃', title: 'Exercise & Activity', subtitle: 'Movement plan for your health', items: exerciseItems, dotClass: 'green' });

  // Sleep
  cards.push({ icon: '😴', title: 'Sleep & Rest', subtitle: 'Recovery and restoration', items: [
    '7–9 hours of quality sleep every night',
    'Maintain a consistent sleep schedule (same bedtime/wake time)',
    'Avoid screens (phones, TV) 1 hour before sleep',
    'Keep bedroom cool, dark, and quiet for optimal sleep quality',
    ...(hasThyroid ? ['Thyroid imbalances can affect sleep — consult your doctor if sleep is disrupted'] : []),
  ], dotClass: 'yellow' });

  // Water Intake
  const waterItems = ['Drink 2.5–3 liters of water daily (about 8–10 glasses)'];
  if (hasKidney) waterItems.push('Adequate hydration is especially important to support kidney function', 'Avoid dehydration — it can worsen kidney parameters');
  if (hasLiver) waterItems.push('Water helps flush toxins — maintain good hydration throughout the day');
  waterItems.push('Avoid sugary drinks and artificial juices — opt for plain water or herbal teas');
  cards.push({ icon: '💧', title: 'Hydration', subtitle: 'Daily water intake targets', items: waterItems, dotClass: 'green' });

  // Lifestyle
  const lifeItems = [];
  lifeItems.push('Quit smoking if applicable — smoking worsens almost all chronic conditions');
  if (hasDiabetes) lifeItems.push('Monitor blood glucose daily with a glucometer', 'Maintain a regular meal schedule — avoid skipping meals');
  if (hasThyroid) lifeItems.push('Take thyroid medication (if prescribed) at the same time every day', 'Avoid excessive iodine or goitrogens without medical guidance');
  lifeItems.push('Manage stress through meditation, deep breathing, or yoga', 'Limit alcohol consumption (max 1 unit/day for women, 2 for men)', 'Regular health check-ups every 6–12 months');
  cards.push({ icon: '🌿', title: 'Lifestyle Changes', subtitle: 'Healthy habits to adopt', items: lifeItems, dotClass: 'green' });

  // Doctor Advice
  const doctorItems = [];
  if (abnormal.length > 3) {
    doctorItems.push('URGENT: Multiple abnormal values detected — consult a physician as soon as possible');
  } else if (abnormal.length > 0) {
    doctorItems.push('Schedule a physician appointment within 1–2 weeks to review abnormal findings');
  } else {
    doctorItems.push('Annual health check-up is recommended even with normal values');
  }
  if (hasDiabetes) doctorItems.push('Consult an endocrinologist or diabetologist for diabetes management');
  if (hasThyroid) doctorItems.push('Thyroid specialist (endocrinologist) evaluation recommended');
  if (hasLiver) doctorItems.push('Hepatologist or gastroenterologist evaluation for liver findings');
  if (hasKidney) doctorItems.push('Nephrologist evaluation if kidney parameters remain elevated');
  doctorItems.push('Bring this report to your appointment for physician review');
  cards.push({ icon: '👨‍⚕️', title: 'Doctor Consultation', subtitle: 'Medical guidance', items: doctorItems, dotClass: 'yellow' });

  // Follow-up Tests
  const followItems = [];
  if (hasDiabetes) followItems.push('Repeat fasting blood sugar and HbA1c in 3 months');
  if (hasLipid) followItems.push('Repeat lipid profile in 3–6 months after lifestyle changes');
  if (hasAnemia) followItems.push('Repeat CBC and iron studies in 4–6 weeks after treatment');
  if (hasThyroid) followItems.push('Repeat thyroid function test (TSH) in 6–8 weeks');
  if (hasLiver) followItems.push('Repeat liver function tests (LFT) in 4–6 weeks');
  if (hasKidney) followItems.push('Repeat kidney function tests (KFT) and urine analysis in 4 weeks');
  if (!followItems.length) followItems.push('Routine blood panel in 6–12 months for ongoing health tracking');
  cards.push({ icon: '🔬', title: 'Follow-up Tests', subtitle: 'Recommended next investigations', items: followItems, dotClass: 'yellow' });

  return cards;
}


const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

function showToast(type, title, msg, duration = 4000) {
  const container = $('toastContainer');
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

function showLoading(text = 'Processing…') {
  $('loadingText').textContent = text;
  $('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
  $('loadingOverlay').classList.add('hidden');
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}


function switchTab(tabId) {
  $$('.tab-panel').forEach(p => p.classList.remove('active'));
  $$('.sidebar-item').forEach(b => b.classList.remove('active'));
  const panel = $(`tab-${tabId}`);
  if (panel) panel.classList.add('active');
  const btn = document.querySelector(`.sidebar-item[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
}

function initTabNavigation() {
  $$('.sidebar-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (!AppState.analysisReady && tab !== 'upload' && tab !== 'ocr') {
        showToast('info', 'No Report Loaded', 'Please upload and analyze a report first.');
        return;
      }
      switchTab(tab);
    });
  });
}


function initUpload() {
  const zone = $('uploadZone');
  const fileInput = $('fileInput');

  // Drag events
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // Click to browse
  $('browseBtnMain').addEventListener('click', () => fileInput.click());
  zone.addEventListener('click', (e) => {
    if (!e.target.closest('button')) fileInput.click();
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
    fileInput.value = '';
  });

  // Replace / Remove
  $('btnReplaceFile').addEventListener('click', () => fileInput.click());
  $('btnRemoveFile').addEventListener('click', resetUpload);

  // Analyze button
  $('btnAnalyze').addEventListener('click', runAnalysis);
}

function handleFile(file) {
  const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowed.includes(file.type) && !['pdf','png','jpg','jpeg'].includes(ext)) {
    showToast('error', 'Unsupported File', 'Please upload a PDF, PNG, JPG, or JPEG file.');
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    showToast('error', 'File Too Large', 'Maximum file size is 20 MB. Please compress your file.');
    return;
  }

  AppState.currentFile = file;
  AppState.analysisReady = false;

  // Show file preview card
  $('filePreviewCard').classList.remove('hidden');
  $('uploadZone').style.display = 'none';
  $('previewFileName').textContent = file.name;
  $('previewFileSize').textContent = formatFileSize(file.size);
  $('previewFileType').textContent = ext.toUpperCase();

  const thumbWrap = $('fileThumbWrap');
  $('filePreviewImg').classList.add('hidden');
  $('pdfThumb').classList.add('hidden');

  if (file.type === 'application/pdf' || ext === 'pdf') {
    $('pdfThumb').classList.remove('hidden');
  } else {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = $('filePreviewImg');
      img.src = e.target.result;
      img.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  // Show OCR progress and hide analyze button
  $('ocrProgressWrap').classList.remove('hidden');
  $('analyzeBtnWrap').classList.add('hidden');

  // Start OCR automatically
  startOCR(file);
}

function resetUpload() {
  AppState.currentFile = null;
  AppState.ocrText = '';
  $('filePreviewCard').classList.add('hidden');
  $('uploadZone').style.display = '';
  resetOcrProgress();
}

function resetOcrProgress() {
  $('ocrProgressBar').style.width = '0%';
  $('ocrPct').textContent = '0%';
  $('ocrLabel').textContent = 'Initializing OCR Engine…';
  ['step1','step2','step3','step4','step5'].forEach(id => {
    const el = $(id);
    el.classList.remove('done','active');
  });
}

function setStep(idx, state) {
  const steps = ['step1','step2','step3','step4','step5'];
  if (idx >= 0 && idx < steps.length) {
    const el = $(steps[idx]);
    el.classList.remove('done','active');
    el.classList.add(state);
  }
}

function completeStepsBefore(idx) {
  for (let i = 0; i < idx; i++) setStep(i, 'done');
}

async function startOCR(file) {
  resetOcrProgress();
  setStep(0, 'active');
  $('ocrLabel').textContent = 'Loading OCR engine…';

  try {
    // Convert PDF page or image to image data for Tesseract
    let imageSource;
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      imageSource = await readFileAsDataURL(file);
    } else {
      imageSource = await readFileAsDataURL(file);
    }

    setStep(0, 'done'); setStep(1, 'active');
    $('ocrLabel').textContent = 'Reading document…';
    updateProgress(20);

    // Run Tesseract OCR
    const result = await Tesseract.recognize(
      imageSource,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const prog = Math.round(20 + m.progress * 50);
            updateProgress(prog);
            if (m.progress > 0.3 && m.progress < 0.6) {
              setStep(1, 'done'); setStep(2, 'active');
              $('ocrLabel').textContent = 'Extracting text from document…';
            }
          }
        }
      }
    );

    setStep(2, 'done'); setStep(3, 'active');
    $('ocrLabel').textContent = 'Analyzing medical parameters…';
    updateProgress(75);

    const text = result.data.text;

    if (!text || text.trim().length < 20) {
      showToast('warning', 'Limited OCR Result', 'The text extracted is minimal. Results may be incomplete.');
    }

    AppState.ocrText = text;

    await sleep(400);
    setStep(3, 'done'); setStep(4, 'active');
    $('ocrLabel').textContent = 'Generating analysis…';
    updateProgress(90);

    await sleep(400);
    setStep(4, 'done');
    $('ocrLabel').textContent = 'OCR complete — ready to analyze!';
    updateProgress(100);

    // Show analyze button
    $('analyzeBtnWrap').classList.remove('hidden');
    $('ocrProgressWrap').classList.add('hidden');

    showToast('success', 'OCR Complete', 'Text extracted successfully. Click "Analyze Report" to continue.');

  } catch (err) {
    console.error('OCR Error:', err);
    showToast('error', 'OCR Failed', 'Could not read the document. Please try a clearer image or different file.');
    $('ocrLabel').textContent = 'OCR failed. Please try again.';
    $('analyzeBtnWrap').classList.remove('hidden');
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function updateProgress(pct) {
  $('ocrProgressBar').style.width = pct + '%';
  $('ocrPct').textContent = pct + '%';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }


async function runAnalysis() {
  if (!AppState.ocrText && !AppState.currentFile) {
    showToast('error', 'No Report', 'Please upload a file first.');
    return;
  }

  showLoading('Analyzing your report…');

  await sleep(200);

  try {
    const text = AppState.ocrText;

    // Extract patient info
    AppState.patientInfo = extractPatientInfo(text);

    // Detect report type
    AppState.reportType = detectReportType(text);

    // Extract parameters
    AppState.parameters = extractParameters(text);

    // Calculate score
    AppState.healthScore = calcHealthScore(AppState.parameters);

    // Update all UI sections
    updateOCRTab(text);
    updatePatientUI();
    updateParametersTab();
    updateDashboard();
    renderCharts();
    updateAnalysisTab();
    updateRecommendationsTab();
    updateChatContext();

    AppState.analysisReady = true;

    // Save to history
    saveToHistory({
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      reportType: AppState.reportType,
      score: AppState.healthScore,
      fileName: AppState.currentFile ? AppState.currentFile.name : 'Unknown',
      patientName: AppState.patientInfo.name,
      ocrText: text,
      parameters: AppState.parameters,
      patientInfo: AppState.patientInfo,
    });

    hideLoading();
    switchTab('dashboard');
    showToast('success', 'Analysis Complete', `Found ${AppState.parameters.length} parameters. Health Score: ${AppState.healthScore}/100`);

  } catch (err) {
    console.error('Analysis error:', err);
    hideLoading();
    showToast('error', 'Analysis Failed', 'An error occurred during analysis. Please try again.');
  }
}

function updateOCRTab(text) {
  $('ocrTextDisplay').textContent = text || 'No text could be extracted from this document.';
  $('ocrDetectedType').textContent = AppState.reportType;
}

function updatePatientUI() {
  const p = AppState.patientInfo;
  $('displayPatientName').textContent = p.name || 'Not Found';
  $('displayAge').textContent = p.age || 'Not Found';
  $('displayGender').textContent = p.gender || 'Not Found';
  $('displayPatientId').textContent = p.patientId || 'Not Found';
  $('displayHospital').textContent = p.hospital || 'Not Found';
  $('displayDoctor').textContent = p.doctor || 'Not Found';
  $('displayDate').textContent = p.date || 'Not Found';
  $('displayReportNo').textContent = p.reportNo || 'Not Found';
  $('reportTypeBadge').textContent = AppState.reportType;
  $('dashboardSubtitle').textContent = `Analysis results for ${p.name !== 'Not Found' ? p.name : 'the uploaded report'} — ${AppState.reportType}`;
  $('lastUploadTime').textContent = `Last analyzed: ${new Date().toLocaleString()}`;
}

function updateParametersTab() {
  renderParamsTable(AppState.parameters, 'all', '');
  initParamsSearch();
}

function renderParamsTable(params, filter = 'all', search = '') {
  const tbody = $('paramsTableBody');
  let filtered = params;

  if (filter !== 'all') {
    if (filter === 'abnormal') {
      filtered = params.filter(p => p.status === 'high' || p.status === 'low');
    } else {
      filtered = params.filter(p => p.status === filter);
    }
  }

  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  if (!filtered.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6"><div class="empty-state"><p>No parameters found matching your criteria.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const statusLabel = p.status === 'high' ? 'High' : p.status === 'low' ? 'Low' : p.status === 'borderline' ? 'Borderline' : 'Normal';
    const barColor = p.status === 'normal' ? 'var(--color-normal)' : p.status === 'borderline' ? 'var(--color-border-ln)' : p.status === 'high' ? 'var(--color-abnormal)' : 'var(--color-low)';
    const deviation = p.deviation || 0;
    const range = p.max === 999 ? `≥ ${p.min}` : `${p.min} – ${p.max}`;

    return `<tr>
      <td class="param-name">${p.name}</td>
      <td class="param-value" style="color:${barColor}">${p.value}</td>
      <td>${p.unit}</td>
      <td>${range} ${p.unit}</td>
      <td><span class="status-pill ${p.status}">${statusLabel}</span></td>
      <td>
        <div class="deviation-bar-wrap">
          <div class="deviation-bar-track">
            <div class="deviation-bar-fill" style="width:${Math.min(100, deviation)}%;background:${barColor}"></div>
          </div>
          <span class="deviation-text">${deviation}%</span>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function initParamsSearch() {
  const searchInput = $('paramSearch');
  const filterTabs = $$('.filter-tab');
  let currentFilter = 'all';

  searchInput.addEventListener('input', () => {
    renderParamsTable(AppState.parameters, currentFilter, searchInput.value);
  });

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderParamsTable(AppState.parameters, currentFilter, searchInput.value);
    });
  });
}

function updateDashboard() {
  const params = AppState.parameters;
  const score = AppState.healthScore;
  const risk = getRiskLevel(score);

  // Score number
  $('scoreNumber').textContent = score;

  // Risk badge
  const badge = $('riskBadge');
  badge.textContent = risk.label;
  badge.className = `risk-badge ${risk.cls}`;

  // Stats
  const normal = params.filter(p => p.status === 'normal').length;
  const borderline = params.filter(p => p.status === 'borderline').length;
  const abnormal = params.filter(p => p.status === 'high' || p.status === 'low').length;
  $('statNormal').textContent = normal;
  $('statBorderline').textContent = borderline;
  $('statAbnormal').textContent = abnormal;

  // Abnormal list
  const list = $('abnormalList');
  const abnParams = params.filter(p => p.status !== 'normal');
  if (!abnParams.length) {
    list.innerHTML = `<div class="empty-state-small">🎉 All detected parameters are within normal ranges!</div>`;
  } else {
    list.innerHTML = abnParams.map(p => {
      const cls = p.status === 'borderline' ? 'border-ln' : p.status;
      const icon = p.status === 'high' ? '📈' : p.status === 'low' ? '📉' : '⚠️';
      const range = p.max === 999 ? `≥ ${p.min}` : `${p.min}–${p.max}`;
      return `<div class="abnormal-item ${cls}">
        <span class="abnormal-item-icon">${icon}</span>
        <div class="abnormal-item-body">
          <div class="abnormal-item-name">${p.name}</div>
          <div class="abnormal-item-value">${p.value} ${p.unit} (Normal: ${range} ${p.unit}) — <strong>${p.status.toUpperCase()}</strong></div>
        </div>
      </div>`;
    }).join('');
  }
}

function renderCharts() {
  renderScoreGauge();
  renderPieChart();
  renderBarChart();
  renderRadarChart();
}

function chartDefaults() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    textColor: isDark ? '#94A3B8' : '#475569',
    gridColor: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.06)',
  };
}

function destroyChart(key) {
  if (AppState.charts[key]) {
    AppState.charts[key].destroy();
    AppState.charts[key] = null;
  }
}

function renderScoreGauge() {
  destroyChart('score');
  const score = AppState.healthScore;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : score >= 40 ? '#EF4444' : '#B91C1C';
  const ctx = $('scoreGauge').getContext('2d');
  AppState.charts.score = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: [color, 'rgba(0,0,0,0.06)'],
        borderWidth: 0,
        circumference: 270,
        rotation: 225,
      }]
    },
    options: {
      cutout: '75%',
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { animateRotate: AppState.animationsEnabled, duration: 1200 },
    }
  });
}

function renderPieChart() {
  destroyChart('pie');
  const params = AppState.parameters;
  const n = params.filter(p => p.status === 'normal').length;
  const b = params.filter(p => p.status === 'borderline').length;
  const a = params.filter(p => p.status === 'high' || p.status === 'low').length;

  if (!params.length) return;

  const { textColor } = chartDefaults();
  const ctx = $('pieChart').getContext('2d');
  AppState.charts.pie = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Normal', 'Borderline', 'Abnormal'],
      datasets: [{
        data: [n, b, a],
        backgroundColor: ['rgba(16,185,129,0.85)', 'rgba(245,158,11,0.85)', 'rgba(239,68,68,0.85)'],
        borderWidth: 2,
        borderColor: 'transparent',
      }]
    },
    options: {
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, font: { size: 12 }, padding: 12 }
        }
      },
      animation: { duration: AppState.animationsEnabled ? 1000 : 0 },
    }
  });
}

function renderBarChart() {
  destroyChart('bar');
  const params = AppState.parameters.slice(0, 12); // Show up to 12 params
  if (!params.length) return;

  const { textColor, gridColor } = chartDefaults();

  // Normalize values to % of range for display
  const labels = params.map(p => p.name.length > 12 ? p.name.substring(0, 10) + '…' : p.name);
  const values = params.map(p => {
    // Percentage within range (0% = min, 100% = max)
    if (p.max === 999) return Math.min(100, (p.value / (p.min * 2)) * 100);
    const range = p.max - p.min;
    return Math.min(150, Math.max(0, ((p.value - p.min) / range) * 100));
  });
  const colors = params.map(p => {
    if (p.status === 'normal') return 'rgba(16,185,129,0.75)';
    if (p.status === 'borderline') return 'rgba(245,158,11,0.75)';
    return 'rgba(239,68,68,0.75)';
  });

  const ctx = $('barChart').getContext('2d');
  AppState.charts.bar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '% within Reference Range',
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 130,
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 11 }, callback: v => v + '%' },
        },
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 10 }, maxRotation: 45 },
        }
      },
      animation: { duration: AppState.animationsEnabled ? 1000 : 0 },
    }
  });
}

function renderRadarChart() {
  destroyChart('radar');
  const params = AppState.parameters.slice(0, 8);
  if (!params.length) return;

  const { textColor, gridColor } = chartDefaults();
  const labels = params.map(p => p.name.length > 10 ? p.name.substring(0, 8) + '…' : p.name);
  const values = params.map(p => {
    if (p.status === 'normal') return 90 + Math.random() * 10;
    if (p.status === 'borderline') return 60 + Math.random() * 15;
    return 20 + Math.random() * 30;
  });

  const ctx = $('radarChart').getContext('2d');
  AppState.charts.radar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: 'Health Status',
        data: values,
        fill: true,
        backgroundColor: 'rgba(37,99,235,0.15)',
        borderColor: 'rgba(37,99,235,0.8)',
        pointBackgroundColor: 'rgba(37,99,235,0.9)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      }]
    },
    options: {
      scales: {
        r: {
          min: 0, max: 100,
          grid: { color: gridColor },
          ticks: { display: false },
          pointLabels: { color: textColor, font: { size: 10 } },
        }
      },
      plugins: { legend: { display: false } },
      animation: { duration: AppState.animationsEnabled ? 1000 : 0 },
    }
  });
}

function updateAnalysisTab() {
  $('analysisReportType').textContent = AppState.reportType;
  $('aiAnalysisContent').innerHTML = generateAnalysis(AppState.parameters, AppState.patientInfo, AppState.reportType);

  // Abnormal Breakdown
  const abnormal = AppState.parameters.filter(p => p.status === 'high' || p.status === 'low');
  const content = $('abnormalBreakdownContent');

  if (!abnormal.length) {
    content.innerHTML = `<div class="empty-state-small">✅ No abnormal values found in this report.</div>`;
    return;
  }

  content.innerHTML = abnormal.map(p => {
    const icon = p.status === 'high' ? '📈' : '📉';
    const badgeCls = p.status === 'high' ? 'high' : 'low';
    const explanation = getParamExplanation(p.name, p.status);
    const range = p.max === 999 ? `≥ ${p.min}` : `${p.min}–${p.max}`;
    return `<div class="abnormal-breakdown-item">
      <div class="abd-param-name">
        ${icon} ${p.name}
        <span class="status-pill ${badgeCls}">${p.status.toUpperCase()}</span>
      </div>
      <div class="abd-param-val">Your value: <strong>${p.value} ${p.unit}</strong> &nbsp;|&nbsp; Normal: ${range} ${p.unit}</div>
      <div class="abd-param-explanation">${explanation}</div>
    </div>`;
  }).join('');
}

function updateRecommendationsTab() {
  const grid = $('recoGrid');
  const empty = $('recoEmpty');
  const cards = generateRecommendations(AppState.parameters);

  if (empty) empty.classList.add('hidden');

  // Remove old cards (not the empty placeholder)
  $$('.reco-card-dynamic').forEach(el => el.remove());

  for (const card of cards) {
    const el = document.createElement('div');
    el.className = 'glass-card reco-card reco-card-dynamic';
    el.innerHTML = `
      <div class="reco-card-header">
        <div class="reco-card-icon">${card.icon}</div>
        <div>
          <div class="reco-card-title">${card.title}</div>
          <div class="reco-card-subtitle">${card.subtitle}</div>
        </div>
      </div>
      <div class="reco-items">
        ${card.items.map(item => `<div class="reco-item"><div class="reco-dot ${card.dotClass || ''}"></div><span>${item}</span></div>`).join('')}
      </div>`;
    grid.appendChild(el);
  }
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const CHAT_MODEL = 'google/gemini-2.5-flash';

function buildReportContext() {
  if (!AppState.analysisReady) return '';
  const p = AppState.patientInfo;
  const params = AppState.parameters;

  let ctx = `UPLOADED MEDICAL REPORT CONTEXT:\n`;
  ctx += `Report Type: ${AppState.reportType}\n`;
  if (p.name !== 'Not Found') ctx += `Patient: ${p.name}`;
  if (p.age !== 'Not Found') ctx += `, Age: ${p.age}`;
  if (p.gender !== 'Not Found') ctx += `, Gender: ${p.gender}`;
  ctx += `\nHealth Score: ${AppState.healthScore}/100\n\n`;

  ctx += `DETECTED PARAMETERS:\n`;
  for (const param of params) {
    const range = param.max === 999 ? `≥${param.min}` : `${param.min}-${param.max}`;
    ctx += `- ${param.name}: ${param.value} ${param.unit} (Normal: ${range}) — STATUS: ${param.status.toUpperCase()}\n`;
  }

  const abnormal = params.filter(p => p.status !== 'normal');
  if (abnormal.length) {
    ctx += `\nABNORMAL/BORDERLINE VALUES:\n`;
    for (const p of abnormal) {
      ctx += `- ${p.name}: ${p.value} ${p.unit} (${p.status})\n`;
    }
  }

  return ctx;
}

function updateChatContext() {
  $('chatOnlineStatus').textContent = 'Ready — Report loaded';
  $('chatOnlineStatus').className = 'chat-online active';
}

async function sendChatMessage(userMsg) {
  if (!userMsg.trim()) return;

  appendChatBubble('user', userMsg);
  $('chatInput').value = '';
  $('chatInput').style.height = 'auto';

  const typingEl = showTypingIndicator();

  // Build messages
  const systemPrompt = `You are HealthLens AI, a professional medical report assistant. You ONLY answer questions based on the patient's uploaded medical report data provided below. 

${buildReportContext()}

STRICT RULES:
1. ONLY use the data from the report above. Never invent or assume values.
2. If a question cannot be answered from the report data, say: "This cannot be determined from the uploaded medical report."
3. Explain medical terms in simple, easy-to-understand language.
4. Be professional, empathetic, and precise.
5. Always remind the user to consult a doctor for medical decisions.
6. Keep answers concise (3-5 sentences) unless a detailed explanation is requested.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...AppState.chatHistory.slice(-10), // Last 10 messages for context
    { role: 'user', content: userMsg }
  ];

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'HealthLens AI',
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages,
        max_tokens: 600,
        temperature: 0.3,
      })
    });

    typingEl.remove();

    if (!response.ok) {
      // Fallback to local analysis if API fails
      const localReply = generateLocalChatReply(userMsg);
      appendChatBubble('assistant', localReply);
      AppState.chatHistory.push({ role: 'user', content: userMsg }, { role: 'assistant', content: localReply });
      return;
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || generateLocalChatReply(userMsg);

    appendChatBubble('assistant', reply);
    AppState.chatHistory.push({ role: 'user', content: userMsg }, { role: 'assistant', content: reply });

  } catch (err) {
    typingEl.remove();
    // Fallback to local reply
    const localReply = generateLocalChatReply(userMsg);
    appendChatBubble('assistant', localReply);
    AppState.chatHistory.push({ role: 'user', content: userMsg }, { role: 'assistant', content: localReply });
  }
}

function generateLocalChatReply(userMsg) {
  if (!AppState.analysisReady) {
    return "Please upload and analyze a medical report first, then I can answer your questions based on your actual report data.";
  }

  const msg = userMsg.toLowerCase();
  const params = AppState.parameters;
  const abnormal = params.filter(p => p.status === 'high' || p.status === 'low');
  const score = AppState.healthScore;

  // Summary
  if (msg.includes('summar') || msg.includes('overview') || msg.includes('explain my report')) {
    const risk = getRiskLevel(score);
    return `Based on your ${AppState.reportType}, I detected ${params.length} parameter(s). Your health score is ${score}/100 — ${risk.label}. ${abnormal.length ? `There are ${abnormal.length} abnormal value(s): ${abnormal.map(p => `${p.name} (${p.value} ${p.unit}, ${p.status})`).join(', ')}.` : 'All detected parameters are within normal range.'} ${abnormal.length > 2 ? 'I recommend consulting a physician promptly.' : ''}`;
  }

  // Abnormal values
  if (msg.includes('abnormal') || msg.includes('out of range') || msg.includes('high') || msg.includes('low')) {
    if (!abnormal.length) return "Based on your uploaded report, all detected parameters are within normal reference ranges. Your results look healthy!";
    return `The following values are outside normal range in your report:\n\n${abnormal.map(p => {
      const range = p.max === 999 ? `≥${p.min}` : `${p.min}–${p.max}`;
      return `• ${p.name}: ${p.value} ${p.unit} (Normal: ${range}) — ${p.status.toUpperCase()}`;
    }).join('\n')}\n\nPlease consult your doctor to understand the clinical significance of these findings.`;
  }

  // Doctor
  if (msg.includes('doctor') || msg.includes('consult') || msg.includes('physician')) {
    if (abnormal.length > 2) return `Yes, based on your report, prompt medical consultation is recommended. You have ${abnormal.length} abnormal values: ${abnormal.map(p => p.name).join(', ')}. Please see a doctor soon.`;
    if (abnormal.length > 0) return `Your report shows ${abnormal.length} abnormal value(s). I recommend scheduling an appointment with your physician within 1–2 weeks to review these findings.`;
    return "Your detected parameters appear within normal ranges. However, regular annual check-ups with your doctor are always recommended for preventive care.";
  }

  // Diet
  if (msg.includes('diet') || msg.includes('eat') || msg.includes('food') || msg.includes('banana') || msg.includes('milk')) {
    return generateDietReply(abnormal);
  }

  // Exercise
  if (msg.includes('exercise') || msg.includes('gym') || msg.includes('workout') || msg.includes('sport')) {
    const hasAnemia = abnormal.some(p => p.name.toLowerCase().includes('hemoglobin'));
    if (hasAnemia) return "Based on your report, your hemoglobin is low (anemia). I recommend light exercise such as walking or yoga until it normalizes. Avoid intense gym workouts. Consult your doctor before starting any new exercise regimen.";
    if (abnormal.length === 0) return "Your report values look healthy! Regular moderate exercise (30 minutes/day, 5 days/week) is beneficial. Include both cardio and strength training for optimal health.";
    return "Based on your report, moderate exercise is generally beneficial, but please check with your doctor first given your abnormal findings. Light walking and yoga are generally safe.";
  }

  // Specific parameter questions
  for (const param of params) {
    if (msg.includes(param.name.toLowerCase())) {
      const range = param.max === 999 ? `≥${param.min}` : `${param.min}–${param.max}`;
      const explanation = getParamExplanation(param.name, param.status);
      return `Your ${param.name} is ${param.value} ${param.unit}. The normal range is ${range} ${param.unit}. Status: ${param.status.toUpperCase()}. ${explanation}`;
    }
  }

  // Score
  if (msg.includes('score') || msg.includes('health score')) {
    const risk = getRiskLevel(score);
    return `Your overall health score based on the uploaded report is ${score}/100 — ${risk.label}. This is calculated from ${params.length} detected parameter(s), with ${abnormal.length} abnormal value(s).`;
  }

  return "This cannot be determined from the uploaded medical report. I can only answer questions based on the values extracted from your report. Please ask about specific parameters, your health score, diet recommendations, or whether you should see a doctor.";
}

function generateDietReply(abnormal) {
  const names = abnormal.map(p => p.name.toLowerCase());
  let reply = "Based on your report:\n\n";

  if (names.some(n => ['hemoglobin', 'rbc', 'iron', 'ferritin'].includes(n))) {
    reply += "• Eat iron-rich foods: spinach, lentils, lean red meat, fortified cereals.\n• Pair with Vitamin C (citrus) to improve absorption.\n• Avoid tea/coffee with meals.\n";
  }
  if (names.some(n => ['fasting blood sugar', 'hba1c', 'blood sugar'].includes(n))) {
    reply += "• Avoid sugar, white bread, refined carbs, and sweet drinks.\n• Eat whole grains, legumes, leafy greens, and low-GI fruits.\n• Eat small, frequent meals throughout the day.\n";
  }
  if (names.some(n => ['ldl', 'cholesterol', 'triglycerides'].includes(n))) {
    reply += "• Avoid fried foods, saturated fats, and trans fats.\n• Include oily fish, olive oil, nuts, and oats.\n• Limit red meat and processed foods.\n";
  }
  if (names.some(n => ['vitamin d', 'vitamin d3'].includes(n))) {
    reply += "• Eat fatty fish, egg yolks, and fortified dairy for Vitamin D.\n• Get 15–20 minutes of sunlight daily.\n";
  }
  if (names.some(n => ['vitamin b12'].includes(n))) {
    reply += "• Include eggs, meat, fish, and dairy for B12.\n• Consider B12 supplements after consulting your doctor.\n";
  }
  if (!reply.includes('•')) {
    reply += "• Maintain a balanced diet with fruits, vegetables, whole grains, and lean proteins.\n• Stay hydrated (8–10 glasses of water daily).\n• Avoid processed foods, excess sugar, and alcohol.";
  }

  reply += "\n\nAlways consult your doctor or a registered dietitian for personalized dietary advice.";
  return reply;
}

function appendChatBubble(role, text) {
  const messages = $('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-message ${role === 'user' ? 'user-message' : 'assistant-message'}`;
  div.innerHTML = `<div class="chat-bubble">${text.replace(/\n/g, '<br>')}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
  const messages = $('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-message assistant-message typing-msg';
  div.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function initChat() {
  const input = $('chatInput');
  const sendBtn = $('chatSendBtn');

  const send = () => {
    if (!AppState.analysisReady) {
      showToast('info', 'No Report Loaded', 'Please upload and analyze a report before chatting.');
      return;
    }
    const msg = input.value.trim();
    if (msg) sendChatMessage(msg);
  };

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(120, input.scrollHeight) + 'px';
  });

  // Prompt chips
  $('promptChips').addEventListener('click', e => {
    const chip = e.target.closest('.prompt-chip');
    if (chip) {
      input.value = chip.dataset.prompt;
      send();
    }
  });

  // Clear chat
  $('btnClearChat').addEventListener('click', () => {
    const messages = $('chatMessages');
    // Keep welcome message only
    const welcome = $('welcomeChatMsg');
    messages.innerHTML = '';
    if (welcome) messages.appendChild(welcome);
    AppState.chatHistory = [];
    showToast('success', 'Chat Cleared', 'Conversation history has been reset.');
  });
}

function saveToHistory(entry) {
  let history = getHistory();
  entry.id = Date.now();
  history.unshift(entry);
  if (history.length > 20) history = history.slice(0, 20); // Keep last 20
  localStorage.setItem('vitalscan_history', JSON.stringify(history));
  renderHistory();
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('vitalscan_history') || '[]');
  } catch { return []; }
}

function renderHistory() {
  const list = $('historyList');
  const history = getHistory();

  if (!history.length) {
    list.innerHTML = `<div class="empty-state-small">No reports in history yet.</div>`;
    return;
  }

  list.innerHTML = history.map(entry => {
    const risk = getRiskLevel(entry.score || 0);
    return `<div class="history-item" data-id="${entry.id}">
      <div class="history-item-header">
        <span class="history-item-type">${entry.reportType || 'Report'}</span>
        <span class="history-item-date">${entry.date} ${entry.time || ''}</span>
      </div>
      <div class="history-item-score">${entry.score || 0}<span style="font-size:14px;color:var(--text-muted)">/100</span></div>
      <div class="history-item-file">📄 ${entry.fileName || 'Unknown'}</div>
      <div class="history-item-file" style="margin-top:2px">👤 ${entry.patientName || 'Not Found'}</div>
      <div class="history-item-actions">
        <button class="history-btn-load" data-id="${entry.id}">📂 Load</button>
        <button class="history-btn-del" data-id="${entry.id}">🗑</button>
      </div>
    </div>`;
  }).join('');

  // Load handler
  list.querySelectorAll('.history-btn-load').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      loadFromHistory(id);
    });
  });

  // Delete handler
  list.querySelectorAll('.history-btn-del').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteFromHistory(parseInt(btn.dataset.id));
    });
  });
}

function loadFromHistory(id) {
  const history = getHistory();
  const entry = history.find(h => h.id === id);
  if (!entry) return;

  AppState.ocrText = entry.ocrText || '';
  AppState.reportType = entry.reportType || 'Unknown';
  AppState.parameters = entry.parameters || [];
  AppState.patientInfo = entry.patientInfo || {};
  AppState.healthScore = entry.score || 0;
  AppState.analysisReady = true;

  updateOCRTab(AppState.ocrText);
  updatePatientUI();
  updateParametersTab();
  updateDashboard();
  renderCharts();
  updateAnalysisTab();
  updateRecommendationsTab();
  updateChatContext();

  closeHistoryPanel();
  switchTab('dashboard');
  showToast('success', 'Report Loaded', `Loaded: ${entry.reportType}`);
}

function deleteFromHistory(id) {
  let history = getHistory();
  history = history.filter(h => h.id !== id);
  localStorage.setItem('vitalscan_history', JSON.stringify(history));
  renderHistory();
  showToast('info', 'Deleted', 'Report removed from history.');
}

function openHistoryPanel() {
  renderHistory();
  $('historyOverlay').classList.remove('hidden');
  $('historyPanel').classList.remove('hidden');
}

function closeHistoryPanel() {
  $('historyOverlay').classList.add('hidden');
  $('historyPanel').classList.add('hidden');
}

/* ───────────────────────────────────────────
  SETTINGS
─────────────────────────────────────────── */
function initSettings() {
  const darkToggle = $('darkModeToggle');
  const animToggle = $('animationsToggle');

  // Load saved preferences
  const savedTheme = localStorage.getItem('vitalscan_theme') || 'light';
  const savedAccent = localStorage.getItem('vitalscan_accent') || 'blue';
  const savedAnim = localStorage.getItem('vitalscan_anim') !== 'false';

  applyTheme(savedTheme);
  applyAccent(savedAccent);
  AppState.animationsEnabled = savedAnim;
  darkToggle.checked = savedTheme === 'dark';
  animToggle.checked = savedAnim;

  // Mark active swatch
  $$('.color-swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.color === savedAccent);
  });

  darkToggle.addEventListener('change', () => {
    const theme = darkToggle.checked ? 'dark' : 'light';
    applyTheme(theme);
    localStorage.setItem('vitalscan_theme', theme);
    $('themeToggle').setAttribute('data-theme', theme);
    renderCharts(); // Re-render with new colors
  });

  animToggle.addEventListener('change', () => {
    AppState.animationsEnabled = animToggle.checked;
    localStorage.setItem('vitalscan_anim', animToggle.checked);
  });

  $('colorSwatches').addEventListener('click', e => {
    const swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    const color = swatch.dataset.color;
    applyAccent(color);
    localStorage.setItem('vitalscan_accent', color);
    $$('.color-swatch').forEach(s => s.classList.toggle('active', s === swatch));
  });

  $('btnClearHistory').addEventListener('click', () => {
    localStorage.removeItem('vitalscan_history');
    showToast('success', 'History Cleared', 'All report history has been deleted.');
    renderHistory();
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = $('darkModeToggle');
  if (toggle) toggle.checked = theme === 'dark';
}

function applyAccent(color) {
  document.documentElement.setAttribute('data-accent', color === 'blue' ? '' : color);
  if (color === 'blue') document.documentElement.removeAttribute('data-accent');
}

function initPanels() {
  // History
  $('btnHistory').addEventListener('click', openHistoryPanel);
  $('closeHistoryBtn').addEventListener('click', closeHistoryPanel);
  $('historyOverlay').addEventListener('click', closeHistoryPanel);

  // Settings
  $('btnSettings').addEventListener('click', openSettingsPanel);
  $('closeSettingsBtn').addEventListener('click', closeSettingsPanel);
  $('settingsOverlay').addEventListener('click', closeSettingsPanel);

  // Theme toggle in topnav
  $('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('vitalscan_theme', next);
    const darkToggle = $('darkModeToggle');
    if (darkToggle) darkToggle.checked = next === 'dark';
    renderCharts();
  });
}

function openSettingsPanel() {
  $('settingsOverlay').classList.remove('hidden');
  $('settingsPanel').classList.remove('hidden');
}

function closeSettingsPanel() {
  $('settingsOverlay').classList.add('hidden');
  $('settingsPanel').classList.add('hidden');
}

/* ───────────────────────────────────────────
  PDF EXPORT
─────────────────────────────────────────── */
async function exportPDF() {
  if (!AppState.analysisReady) {
    showToast('warning', 'No Report', 'Please upload and analyze a report before exporting.');
    return;
  }

  showLoading('Generating PDF…');

  await sleep(300);

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const p = AppState.patientInfo;
    const params = AppState.parameters;
    const score = AppState.healthScore;
    const risk = getRiskLevel(score);
    const W = 210; // A4 width
    let y = 0;

    // ─── Header ───
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, W, 36, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('HealthLens AI', 14, 16);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Health Report Analyzer', 14, 24);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 31);
    y = 46;

    // ─── Report Type ───
    doc.setTextColor(37, 99, 235);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(AppState.reportType, W / 2, y, { align: 'center' });
    y += 10;

    // ─── Patient Details ───
    doc.setFillColor(247, 249, 255);
    doc.roundedRect(10, y, W - 20, 42, 3, 3, 'F');
    doc.setDrawColor(200, 215, 255);
    doc.roundedRect(10, y, W - 20, 42, 3, 3, 'S');
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Patient Information', 16, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);

    const col1 = 16, col2 = 80, col3 = 145;
    doc.text(`Name: ${p.name || 'Not Found'}`, col1, y + 17);
    doc.text(`Age: ${p.age || 'Not Found'}`, col2, y + 17);
    doc.text(`Gender: ${p.gender || 'Not Found'}`, col3, y + 17);
    doc.text(`Patient ID: ${p.patientId || 'Not Found'}`, col1, y + 25);
    doc.text(`Doctor: ${p.doctor || 'Not Found'}`, col2, y + 25);
    doc.text(`Date: ${p.date || 'Not Found'}`, col3, y + 25);
    doc.text(`Hospital: ${p.hospital || 'Not Found'}`, col1, y + 33);
    doc.text(`Report No: ${p.reportNo || 'Not Found'}`, col2, y + 33);
    y += 52;

    // ─── Health Score ───
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Overall Health Score', 14, y);
    y += 8;

    const scoreColor = score >= 80 ? [16, 185, 129] : score >= 60 ? [245, 158, 11] : [239, 68, 68];
    doc.setFillColor(...scoreColor);
    doc.roundedRect(14, y, 40, 14, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`${score}/100`, 34, y + 9, { align: 'center' });

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Risk Level: ${risk.label}`, 62, y + 9);

    // Progress bar
    const barX = 100, barW = 96, barH = 6;
    doc.setFillColor(230, 235, 245);
    doc.roundedRect(barX, y + 5, barW, barH, 2, 2, 'F');
    doc.setFillColor(...scoreColor);
    doc.roundedRect(barX, y + 5, (score / 100) * barW, barH, 2, 2, 'F');
    y += 24;

    // ─── Parameter Summary Stats ───
    const n = params.filter(p => p.status === 'normal').length;
    const b = params.filter(p => p.status === 'borderline').length;
    const ab = params.filter(p => p.status === 'high' || p.status === 'low').length;
    doc.setFillColor(240, 245, 255);
    doc.roundedRect(14, y, 55, 20, 2, 2, 'F');
    doc.setFillColor(253, 246, 236);
    doc.roundedRect(75, y, 55, 20, 2, 2, 'F');
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(136, y, 55, 20, 2, 2, 'F');

    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.setTextColor(16, 185, 129); doc.text(String(n), 41, y + 12, { align: 'center' });
    doc.setTextColor(245, 158, 11); doc.text(String(b), 102, y + 12, { align: 'center' });
    doc.setTextColor(239, 68, 68); doc.text(String(ab), 163, y + 12, { align: 'center' });

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    doc.setTextColor(100, 120, 150);
    doc.text('Normal', 41, y + 17, { align: 'center' });
    doc.text('Borderline', 102, y + 17, { align: 'center' });
    doc.text('Abnormal', 163, y + 17, { align: 'center' });
    y += 30;

    // ─── Parameters Table ───
    if (params.length > 0) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('Detected Parameters', 14, y);
      y += 8;

      // Table header
      doc.setFillColor(37, 99, 235);
      doc.rect(14, y, W - 28, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
      doc.text('Parameter', 16, y + 5.5);
      doc.text('Value', 82, y + 5.5);
      doc.text('Unit', 102, y + 5.5);
      doc.text('Normal Range', 122, y + 5.5);
      doc.text('Status', 168, y + 5.5);
      y += 10;

      // Table rows
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
      let rowY = y;
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        if (rowY > 265) {
          doc.addPage();
          rowY = 20;
        }

        const bgColor = i % 2 === 0 ? [248, 250, 255] : [255, 255, 255];
        doc.setFillColor(...bgColor);
        doc.rect(14, rowY - 1, W - 28, 8, 'F');

        const statusColors = { normal: [16,185,129], borderline: [245,158,11], high: [239,68,68], low: [59,130,246] };
        const sc = statusColors[param.status] || [100,100,100];
        const range = param.max === 999 ? `≥${param.min}` : `${param.min}–${param.max}`;
        const statusLabel = param.status.charAt(0).toUpperCase() + param.status.slice(1);

        doc.setTextColor(15, 23, 42); doc.text(param.name.substring(0, 24), 16, rowY + 4);
        doc.setTextColor(...sc); doc.setFont('helvetica','bold'); doc.text(String(param.value), 82, rowY + 4);
        doc.setFont('helvetica','normal'); doc.setTextColor(71, 85, 105);
        doc.text(param.unit, 102, rowY + 4);
        doc.text(`${range} ${param.unit}`, 122, rowY + 4);
        doc.setTextColor(...sc); doc.setFont('helvetica','bold');
        doc.text(statusLabel, 168, rowY + 4);
        doc.setFont('helvetica','normal');
        rowY += 8;

        // Light separator line
        doc.setDrawColor(220, 228, 245); doc.line(14, rowY - 1, W - 14, rowY - 1);
      }
      y = rowY + 5;
    }

    // ─── AI Analysis Summary ───
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.text('AI Medical Summary', 14, y);
    y += 8;

    const summaryText = generatePlainTextAnalysis(params, p, AppState.reportType);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const splitSummary = doc.splitTextToSize(summaryText, W - 28);
    for (const line of splitSummary) {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, 14, y);
      y += 5;
    }

    // ─── Footer ───
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 285, W, 12, 'F');
      doc.setTextColor(200, 215, 255);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
      doc.text('HealthLens AI — Professional Health Report Analyzer', 14, 291);
      doc.text(`Page ${i} of ${totalPages}`, W - 14, 291, { align: 'right' });
      doc.text('⚠ For informational purposes only. Not a substitute for professional medical advice.', W / 2, 294, { align: 'center' });
    }

    const safeFileName = (AppState.currentFile ? AppState.currentFile.name.replace(/\.[^.]+$/, '') : 'vitalscan') + '_report.pdf';
    doc.save(safeFileName);
    hideLoading();
    showToast('success', 'PDF Exported', 'Your health report has been saved.');

  } catch (err) {
    console.error('PDF error:', err);
    hideLoading();
    showToast('error', 'PDF Export Failed', 'Could not generate PDF. Please try again.');
  }
}

function generatePlainTextAnalysis(parameters, patientInfo, reportType) {
  const abnormal = parameters.filter(p => p.status === 'high' || p.status === 'low');
  const normal = parameters.filter(p => p.status === 'normal');
  const score = calcHealthScore(parameters);
  const risk = getRiskLevel(score);

  let text = `Report Type: ${reportType}. Health Score: ${score}/100 (${risk.label}). `;
  text += `Total parameters: ${parameters.length} — Normal: ${normal.length}, Abnormal: ${abnormal.length}. `;

  if (normal.length) {
    text += `Normal values: ${normal.map(p => `${p.name} (${p.value} ${p.unit})`).join(', ')}. `;
  }
  if (abnormal.length) {
    text += `Abnormal values requiring attention: ${abnormal.map(p => `${p.name} ${p.value} ${p.unit} (${p.status})`).join(', ')}. `;
    text += `Recommendation: Consult a physician for evaluation of abnormal findings.`;
  } else {
    text += `All detected parameters are within normal reference ranges. Continue maintaining a healthy lifestyle.`;
  }

  return text;
}

/* ───────────────────────────────────────────
  OCR COPY BUTTON
─────────────────────────────────────────── */
function initOcrCopy() {
  $('btnCopyOcr').addEventListener('click', () => {
    const text = $('ocrTextDisplay').textContent;
    if (!text || text.includes('Extracted text will appear')) {
      showToast('warning', 'Nothing to Copy', 'Please upload a report first.');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast('success', 'Copied', 'OCR text copied to clipboard.');
    }).catch(() => {
      showToast('error', 'Copy Failed', 'Could not access clipboard.');
    });
  });
}

/* ───────────────────────────────────────────
  INITIALIZATION
─────────────────────────────────────────── */
function init() {
  initTabNavigation();
  initUpload();
  initChat();
  initSettings();
  initPanels();
  initOcrCopy();

  // PDF export button (sidebar)
  $('btnExportPdf').addEventListener('click', exportPDF);

  // Initialize params search for empty state
  initParamsSearch();

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('vitalscan_theme') || 'light';
  applyTheme(savedTheme);

  // Render history
  renderHistory();

  console.log('HealthLens AI — initialized.');
}

document.addEventListener('DOMContentLoaded', init);