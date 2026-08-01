"use strict";

const app = document.getElementById("app");
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const checkbox = (id, label) => ({ id, label, type: "checkbox", value: false });
const number = (id, label, value, min, max) => ({ id, label, type: "number", value, min, max });
const select = (id, label, options, value = options[0][1]) => ({ id, label, type: "select", options, value });

const scoreFields = [
  number("edad_score2", "Edad:", 60, 18, 110),
  select("sexo_score2", "Sexo usado por la escala:", [["Hombre","hombre"],["Mujer","mujer"]]),
  select("region_score2", "Región europea de riesgo:", [["Bajo (España)","bajo"],["Moderado","moderado"],["Alto","alto"],["Muy alto","muy_alto"]]),
  number("pas_score2", "Presión arterial sistólica (mmHg):", 120, 70, 250),
  number("colesterol_total_score2", "Colesterol total (mg/dL):", 190, 50, 500),
  number("colesterol_hdl_score2", "HDL-colesterol (mg/dL):", 50, 10, 150),
  number("colesterol_ldl_score2", "LDL-colesterol actual (mg/dL):", 115, 0, 400),
  number("hba1c_score2", "HbA1c (%) (opcional):", "", 3, 20),
  checkbox("fumador_score2", "Tabaquismo activo"),
  checkbox("diabetes_score2", "Diabetes mellitus"),
  checkbox("enfermedad_renal_score2", "Enfermedad renal crónica"),
  checkbox("enfermedad_cv_score2", "Enfermedad cardiovascular aterosclerótica establecida"),
  checkbox("hipercol_familiar_score2", "Hipercolesterolemia familiar"),
  checkbox("ecg_anormal_score2", "ECG basal anormal")
];

const modules = {
  antraciclinas: {
    title: "Evaluación del riesgo por antraciclinas", treatment: "Antraciclinas",
    drugs: [["Doxorubicina","doxorubicina"],["Epirubicina","epirubicina"],["Daunorubicina","daunorubicina"],["Idarubicina","idarubicina"]],
    groups: [
      ["Datos generales y factores de riesgo cardiovascular", [number("edad","Edad:",60,14,110),checkbox("hipertension","Hipertensión arterial"),checkbox("diabetes","Diabetes mellitus"),checkbox("insuficiencia_renal","Insuficiencia renal crónica")]],
      ["Antecedentes cardiovasculares", [checkbox("insuficiencia_cardiaca","Insuficiencia cardiaca o miocardiopatía"),checkbox("valvulopatia_severa","Valvulopatía severa"),checkbox("infarto_revascularizacion","Infarto o revascularización coronaria previa"),checkbox("angina_estable","Angina estable")]],
      ["Biomarcadores e imagen", [checkbox("troponina_elevada","Troponina ultrasensible basal elevada"),checkbox("probnp_elevado","ProBNP basal elevado"),number("fevi","FEVI basal (%):",60,5,90)]],
      ["Exposiciones previas y estilo de vida", [checkbox("antraciclinas_previas","Tratamiento previo con antraciclinas"),checkbox("radioterapia_toracica","Radioterapia torácica previa"),checkbox("quimioterapia_previa_sin_antraciclinas","Quimioterapia previa sin antraciclinas"),checkbox("tabaquismo","Tabaquismo activo o antecedente significativo"),checkbox("obesidad","Obesidad (IMC > 30)")]]
    ],
    rules: v => ({
      very: [["Insuficiencia cardiaca o miocardiopatía",v.insuficiencia_cardiaca]],
      high: [["Valvulopatía severa",v.valvulopatia_severa],["Infarto o revascularización coronaria previa",v.infarto_revascularizacion],["Angina estable",v.angina_estable],["FEVI menor del 50 %",v.fevi<50],["Edad igual o superior a 80 años",v.edad>=80],["Tratamiento previo con antraciclinas",v.antraciclinas_previas],["Radioterapia torácica previa",v.radioterapia_toracica]],
      mod2: [["FEVI entre el 50 % y el 54 %",v.fevi>=50&&v.fevi<=54],["Edad entre 65 y 79 años",v.edad>=65&&v.edad<=79]],
      mod1: [["Troponina ultrasensible basal elevada",v.troponina_elevada],["ProBNP basal elevado",v.probnp_elevado],["Hipertensión arterial",v.hipertension],["Diabetes mellitus",v.diabetes],["Insuficiencia renal crónica",v.insuficiencia_renal],["Quimioterapia previa sin antraciclinas",v.quimioterapia_previa_sin_antraciclinas],["Tabaquismo",v.tabaquismo],["Obesidad",v.obesidad]]
    })
  },
  antiher2: {
    title: "Evaluación del riesgo por terapias anti-HER2", treatment: "Anti-HER2",
    drugs: [["Trastuzumab","trastuzumab"],["Pertuzumab","pertuzumab"],["Trastuzumab emtansina (T-DM1)","trastuzumab_emtansina"],["Lapatinib","lapatinib"],["Neratinib","neratinib"],["Tucatinib","tucatinib"]],
    groups: [
      ["Datos generales y factores de riesgo cardiovascular", [number("edad","Edad:",60,14,110),checkbox("hipertension","Hipertensión arterial"),checkbox("diabetes","Diabetes mellitus"),checkbox("insuficiencia_renal","Insuficiencia renal crónica")]],
      ["Antecedentes cardiovasculares", [checkbox("insuficiencia_cardiaca","Insuficiencia cardiaca o miocardiopatía"),checkbox("valvulopatia_severa","Valvulopatía severa"),checkbox("infarto_revascularizacion","Infarto o revascularización coronaria previa"),checkbox("angina_estable","Angina estable"),checkbox("arritmia","Arritmia (FA, flutter, TV o FV)")]],
      ["Biomarcadores e imagen", [checkbox("troponina_elevada","Troponina ultrasensible basal elevada"),checkbox("probnp_elevado","ProBNP basal elevado"),number("fevi","FEVI basal (%):",60,5,90)]],
      ["Tratamientos previos y estilo de vida", [checkbox("antraciclinas_antes_antiher2","Antraciclinas inmediatamente antes del tratamiento anti-HER2"),checkbox("cardiotoxicidad_previa_trastuzumab","Cardiotoxicidad previa por trastuzumab"),checkbox("exposicion_previa_antraciclinas","Exposición previa a antraciclinas"),checkbox("radioterapia_izquierda_mediastino","Radioterapia previa en hemitórax izquierdo o mediastino"),checkbox("tabaquismo","Tabaquismo activo o antecedente significativo"),checkbox("obesidad","Obesidad (IMC > 30)")]]
    ],
    rules: v => ({
      very: [["Insuficiencia cardiaca, miocardiopatía o disfunción cardiaca por terapia anticancerosa",v.insuficiencia_cardiaca],["Cardiotoxicidad previa por trastuzumab",v.cardiotoxicidad_previa_trastuzumab]],
      high: [["Valvulopatía severa",v.valvulopatia_severa],["Infarto de miocardio o revascularización coronaria previa",v.infarto_revascularizacion],["Angina estable",v.angina_estable],["FEVI menor del 50 %",v.fevi<50],["Edad igual o superior a 80 años",v.edad>=80]],
      mod2: [["Arritmia: fibrilación auricular, flutter, taquicardia ventricular o fibrilación ventricular",v.arritmia],["FEVI entre el 50 % y el 54 %",v.fevi>=50&&v.fevi<=54],["Troponina ultrasensible basal elevada",v.troponina_elevada],["ProBNP basal elevado",v.probnp_elevado],["Edad entre 65 y 79 años",v.edad>=65&&v.edad<=79],["Exposición previa a antraciclinas",v.exposicion_previa_antraciclinas],["Radioterapia previa en hemitórax izquierdo o mediastino",v.radioterapia_izquierda_mediastino]],
      mod1: [["Hipertensión arterial",v.hipertension],["Diabetes mellitus",v.diabetes],["Insuficiencia renal crónica",v.insuficiencia_renal],["Administración de antraciclinas antes del tratamiento anti-HER2",v.antraciclinas_antes_antiher2],["Tabaquismo activo o antecedente importante",v.tabaquismo],["Obesidad",v.obesidad]]
    })
  },
  vegf: {
    title: "Evaluación del riesgo por inhibidores del VEGF", treatment: "Inhibidores del VEGF",
    drugs: [["Bevacizumab","bevacizumab"],["Ramucirumab","ramucirumab"],["Sunitinib","sunitinib"],["Sorafenib","sorafenib"],["Pazopanib","pazopanib"],["Axitinib","axitinib"],["Tivozanib","tivozanib"],["Cabozantinib","cabozantinib"],["Regorafenib","regorafenib"],["Lenvatinib","lenvatinib"],["Vandetanib","vandetanib"]],
    groups: [
      ["Datos generales y factores de riesgo cardiovascular", [number("edad","Edad:",60,14,110),checkbox("hipertension","Hipertensión arterial"),checkbox("diabetes","Diabetes mellitus"),checkbox("dislipemia","Dislipemia"),checkbox("insuficiencia_renal","Insuficiencia renal crónica"),checkbox("proteinuria","Proteinuria")]],
      ["Antecedentes cardiovasculares", [checkbox("insuficiencia_cardiaca","Insuficiencia cardiaca o miocardiopatía"),checkbox("infarto_revascularizacion","Infarto o revascularización coronaria previa"),checkbox("angina_estable","Angina estable"),checkbox("enfermedad_vascular_arterial","Enfermedad vascular arterial"),checkbox("trombosis_venosa","Trombosis venosa (TVP o TEP)"),checkbox("arritmia","Arritmia (FA, flutter, TV o FV)")]],
      ["Biomarcadores, imagen y ECG", [checkbox("troponina_elevada","Troponina basal elevada"),checkbox("probnp_elevado","ProBNP basal elevado"),select("sexo","Sexo para interpretación del QTc:",[["Mujer","mujer"],["Hombre","hombre"]]),number("fevi","FEVI basal (%):",60,5,90),number("qtc","QTcF basal (Fridericia, ms):",420,250,700)]],
      ["Exposiciones previas y estilo de vida", [checkbox("antraciclinas_previas","Tratamiento previo con antraciclinas"),checkbox("radioterapia_izquierda_mediastino","Radioterapia previa en hemitórax izquierdo o mediastino"),checkbox("tabaquismo","Tabaquismo activo o antecedente significativo"),checkbox("obesidad","Obesidad (IMC > 30)")]]
    ],
    rules: v => { const qtcLimit=v.qtc<480&&((v.sexo==="hombre"&&v.qtc>=450)||(v.sexo==="mujer"&&v.qtc>=460)); return {
      very: [["Insuficiencia cardiaca, miocardiopatía o disfunción cardiaca por terapia anticancerosa",v.insuficiencia_cardiaca],["Infarto o revascularización coronaria previa",v.infarto_revascularizacion],["Angina estable",v.angina_estable],["Enfermedad vascular arterial",v.enfermedad_vascular_arterial]],
      high: [["Trombosis venosa (TVP o TEP)",v.trombosis_venosa],["QTc igual o superior a 480 ms",v.qtc>=480],["FEVI menor del 50 %",v.fevi<50],["Edad igual o superior a 75 años",v.edad>=75],["Hipertensión arterial",v.hipertension],["Tratamiento previo con antraciclinas",v.antraciclinas_previas]],
      mod2: [["Arritmia (FA, flutter, TV o FV)",v.arritmia],["QTc en rango límite según sexo",qtcLimit],["FEVI entre el 50 % y el 54 %",v.fevi>=50&&v.fevi<=54]],
      mod1: [["Troponina basal elevada",v.troponina_elevada],["ProBNP basal elevado",v.probnp_elevado],["Edad entre 65 y 74 años",v.edad>=65&&v.edad<=74],["Diabetes mellitus",v.diabetes],["Dislipemia",v.dislipemia],["Insuficiencia renal crónica",v.insuficiencia_renal],["Proteinuria",v.proteinuria],["Radioterapia previa en hemitórax izquierdo o mediastino",v.radioterapia_izquierda_mediastino],["Tabaquismo activo o antecedente significativo",v.tabaquismo],["Obesidad",v.obesidad]]
    }; }
  },
  itk: {
    title: "Evaluación del riesgo por inhibidores BCR-ABL", treatment: "Inhibidores de la Tirosin Kinasa",
    drugs: [["Ponatinib","ponatinib"],["Nilotinib","nilotinib"],["Dasatinib","dasatinib"],["Bosutinib","bosutinib"]],
    groups: [
      ["Datos generales e imagen", [number("edad","Edad:",60,14,110),select("sexo","Sexo para interpretación del QTc:",[["Mujer","mujer"],["Hombre","hombre"]]),number("fevi","FEVI basal (%):",60,5,90),number("qtc","QTcF basal (Fridericia, ms):",420,250,700)]],
      ["Antecedentes cardiovasculares", [checkbox("enfermedad_vascular_arterial","Enfermedad vascular arterial"),checkbox("trombosis_arterial_itk","Trombosis arterial durante tratamiento con ITK"),checkbox("insuficiencia_cardiaca_disfuncion_vi","Insuficiencia cardiaca o disfunción sistólica VI"),checkbox("disfuncion_vi_previa_bcr_abl","Disfunción VI previa por BCR-ABL ITK"),checkbox("indice_tobillo_brazo_bajo","Índice tobillo-brazo < 0,9"),checkbox("hipertension_pulmonar","Hipertensión pulmonar"),checkbox("tromboembolismo_venoso","Tromboembolismo venoso"),checkbox("arritmia","Arritmia (FA, flutter, TV o FV)")]],
      ["Factores de riesgo cardiovascular", [checkbox("riesgo_cv_10_alto","Riesgo cardiovascular a 10 años > 20 %"),checkbox("hipertension","Hipertensión arterial"),checkbox("diabetes","Diabetes mellitus"),checkbox("dislipemia","Dislipemia"),checkbox("insuficiencia_renal","Insuficiencia renal crónica"),checkbox("trombofilia_familiar","Historia familiar de trombofilia"),checkbox("tabaquismo","Tabaquismo activo o antecedente significativo"),checkbox("obesidad","Obesidad (IMC > 30)")]]
    ],
    rules: v => { const qtcLimit=v.qtc<480&&((v.sexo==="hombre"&&v.qtc>=450)||(v.sexo==="mujer"&&v.qtc>=460)); return {
      very: [["Enfermedad vascular arterial",v.enfermedad_vascular_arterial],["Trombosis arterial durante tratamiento con ITK",v.trombosis_arterial_itk]],
      high: [["Insuficiencia cardiaca o disfunción sistólica ventricular izquierda",v.insuficiencia_cardiaca_disfuncion_vi],["Disfunción ventricular previa por BCR-ABL ITK",v.disfuncion_vi_previa_bcr_abl],["Índice tobillo-brazo menor de 0,9",v.indice_tobillo_brazo_bajo],["Hipertensión pulmonar",v.hipertension_pulmonar],["FEVI menor del 50 %",v.fevi<50],["QTc igual o superior a 480 ms",v.qtc>=480],["Riesgo cardiovascular a 10 años superior al 20 %",v.riesgo_cv_10_alto],["Edad igual o superior a 75 años",v.edad>=75],["Tabaquismo activo o antecedente significativo",v.tabaquismo]],
      mod2: [["Tromboembolismo venoso",v.tromboembolismo_venoso],["Arritmia (FA, flutter, TV o FV)",v.arritmia],["QTc en rango límite según sexo",qtcLimit],["Hipertensión arterial",v.hipertension],["Edad entre 65 y 74 años",v.edad>=65&&v.edad<=74]],
      mod1: [["Diabetes mellitus",v.diabetes],["Dislipemia",v.dislipemia],["Edad entre 60 y 64 años",v.edad>=60&&v.edad<=64],["Insuficiencia renal crónica",v.insuficiencia_renal],["Historia familiar de trombofilia",v.trombofilia_familiar],["Obesidad",v.obesidad]]
    }; }
  },
  mieloma: {
    title: "Evaluación del riesgo en mieloma múltiple", treatment: "Mieloma",
    drugs: [["Carfilzomib","carfilzomib"],["Bortezomib","bortezomib"],["Ixazomib","ixazomib"],["Lenalidomida","lenalidomida"],["Pomalidomida","pomalidomida"]],
    groups: [
      ["Datos generales y factores de riesgo cardiovascular", [number("edad","Edad:",60,14,110),number("fevi","FEVI basal (%):",60,5,90),checkbox("hipertension","Hipertensión arterial"),checkbox("diabetes","Diabetes mellitus"),checkbox("insuficiencia_renal","Insuficiencia renal crónica"),checkbox("trombofilia_familiar","Historia familiar de trombofilia"),checkbox("dislipemia","Dislipemia")]],
      ["Antecedentes cardiovasculares", [checkbox("insuficiencia_cardiaca","Insuficiencia cardiaca o miocardiopatía"),checkbox("cardiotoxicidad_previa_ip","Cardiotoxicidad previa por inhibidor del proteasoma"),checkbox("trombosis_venosa","Trombosis venosa (TVP o EP)"),checkbox("amiloidosis_cardiaca","Amiloidosis cardiaca"),checkbox("enfermedad_vascular_arterial","Enfermedad vascular arterial"),checkbox("toxicidad_cv_inmunomoduladores","Toxicidad cardiovascular previa por inmunomoduladores"),checkbox("arritmia","Arritmia (FA, flutter, TV o FV)")]],
      ["Biomarcadores e imagen", [checkbox("troponina_elevada","Troponina basal elevada"),checkbox("probnp_elevado","ProBNP basal elevado"),checkbox("hipertrofia_ventricular_izquierda","Hipertrofia ventricular izquierda > 12 mm")]],
      ["Tratamientos y estilo de vida", [checkbox("antraciclinas_previas","Tratamiento previo con antraciclinas"),checkbox("radioterapia_toracica_mediastinica","Radioterapia torácica o mediastínica previa"),checkbox("dexametasona_alta","Dexametasona > 160 mg/mes"),checkbox("tabaquismo","Tabaquismo activo o antecedente significativo"),checkbox("obesidad","Obesidad (IMC > 30)")]]
    ],
    rules: v => ({
      very: [["Insuficiencia cardiaca o miocardiopatía",v.insuficiencia_cardiaca],["Cardiotoxicidad previa por inhibidor del proteasoma",v.cardiotoxicidad_previa_ip],["Trombosis venosa (TVP o EP)",v.trombosis_venosa],["Amiloidosis cardiaca",v.amiloidosis_cardiaca],["Enfermedad vascular arterial",v.enfermedad_vascular_arterial]],
      high: [["Toxicidad cardiovascular previa por inmunomoduladores",v.toxicidad_cv_inmunomoduladores],["FEVI menor del 50 %",v.fevi<50],["ProBNP basal elevado",v.probnp_elevado],["Edad igual o superior a 75 años",v.edad>=75],["Tratamiento previo con antraciclinas",v.antraciclinas_previas]],
      mod2: [["FEVI entre el 50 % y el 54 %",v.fevi>=50&&v.fevi<=54],["Arritmia (FA, flutter, TV o FV)",v.arritmia],["Troponina basal elevada",v.troponina_elevada]],
      mod1: [["Hipertrofia de ventrículo izquierdo superior a 12 mm",v.hipertrofia_ventricular_izquierda],["Edad entre 65 y 74 años",v.edad>=65&&v.edad<=74],["Hipertensión arterial",v.hipertension],["Diabetes mellitus",v.diabetes],["Insuficiencia renal crónica",v.insuficiencia_renal],["Historia familiar de trombofilia",v.trombofilia_familiar],["Dislipemia",v.dislipemia],["Radioterapia torácica o mediastínica previa",v.radioterapia_toracica_mediastinica],["Dosis de dexametasona superior a 160 mg/mes",v.dexametasona_alta],["Tabaquismo activo o antecedente significativo",v.tabaquismo],["Obesidad",v.obesidad]]
    })
  },
  rafmek: {
    title: "Evaluación del riesgo por inhibidores RAF/MEK", treatment: "Inhibidores RAF y MEK",
    drugs: [["Dabrafenib + trametinib","dabrafenib_trametinib"],["Vemurafenib + cobimetinib","vemurafenib_cobimetinib"],["Encorafenib + binimetinib","encorafenib_binimetinib"]],
    groups: [
      ["Datos generales y factores de riesgo cardiovascular", [number("edad","Edad:",60,14,110),checkbox("hipertension","Hipertensión arterial"),checkbox("diabetes","Diabetes mellitus"),checkbox("insuficiencia_renal","Insuficiencia renal crónica")]],
      ["Antecedentes cardiovasculares", [checkbox("insuficiencia_cardiaca","Miocardiopatía o insuficiencia cardiaca"),checkbox("infarto_revascularizacion","Infarto o revascularización miocárdica"),checkbox("angina_estable","Angina estable"),checkbox("valvulopatia_severa","Enfermedad valvular severa"),checkbox("arritmia","Arritmia (FA, flutter, TV o FV)")]],
      ["Biomarcadores e imagen", [checkbox("troponina_elevada","Troponina basal elevada"),checkbox("probnp_elevado","ProBNP basal elevado"),number("fevi","FEVI basal (%):",60,5,90)]],
      ["Exposiciones previas y estilo de vida", [checkbox("antraciclinas_previas","Exposición previa a antraciclinas"),checkbox("radioterapia_izquierda_mediastino","Radioterapia previa en hemitórax izquierdo o mediastino"),checkbox("tabaquismo","Tabaquismo activo o antecedente significativo"),checkbox("obesidad","Obesidad (IMC > 30)")]]
    ],
    rules: v => ({
      very: [["Insuficiencia cardiaca o miocardiopatía",v.insuficiencia_cardiaca]],
      high: [["Valvulopatía severa",v.valvulopatia_severa],["Infarto o revascularización coronaria previa",v.infarto_revascularizacion],["Angina estable",v.angina_estable],["FEVI menor del 50 %",v.fevi<50],["Tratamiento previo con antraciclinas",v.antraciclinas_previas]],
      mod2: [["FEVI entre el 50 % y el 54 %",v.fevi>=50&&v.fevi<=54],["Troponina ultrasensible basal elevada",v.troponina_elevada],["ProBNP basal elevado",v.probnp_elevado],["Hipertensión arterial",v.hipertension]],
      mod1: [["Arritmia: fibrilación auricular, flutter, taquicardia ventricular o fibrilación ventricular",v.arritmia],["Diabetes mellitus",v.diabetes],["Edad mayor o igual a 65 años",v.edad>=65],["Insuficiencia renal crónica",v.insuficiencia_renal],["Tabaquismo",v.tabaquismo],["Obesidad",v.obesidad]]
    })
  },
  fluoropirimidinas: {
    title: "Evaluación del riesgo por fluoropirimidinas", treatment: "Fluoropirimidinas",
    drugs: [["5-fluorouracilo","5fu"],["Capecitabina","capecitabina"]],
    groups: [
      ["Datos generales y factores de riesgo cardiovascular", [number("edad","Edad:",60,14,110),checkbox("hipertension","Hipertensión"),checkbox("diabetes","Diabetes"),checkbox("dislipemia","Dislipemia"),checkbox("insuficiencia_renal","Insuficiencia renal"),checkbox("tabaquismo","Tabaquismo")]],
      ["Antecedentes cardiovasculares", [checkbox("enfermedad_coronaria","Enfermedad coronaria establecida"),checkbox("angina_vasoespasmo_previo","Angina o vasoespasmo previo por fluoropirimidinas"),checkbox("insuficiencia_cardiaca","Insuficiencia cardiaca"),checkbox("enfermedad_vascular","Enfermedad vascular arterial")]],
      ["Exposiciones previas y otros factores", [checkbox("anemia","Anemia"),checkbox("radioterapia_toracica","Radioterapia torácica previa"),checkbox("quimioterapia_previa","Quimioterapia previa")]]
    ],
    rules: v => ({
      very: [["Insuficiencia cardiaca establecida",v.insuficiencia_cardiaca],["Enfermedad coronaria establecida",v.enfermedad_coronaria],["Angina o vasoespasmo previo por fluoropirimidinas",v.angina_vasoespasmo_previo]],
      high: [["Enfermedad vascular arterial",v.enfermedad_vascular],["Edad igual o superior a 75 años",v.edad>=75],["Anemia",v.anemia],["Radioterapia torácica previa",v.radioterapia_toracica]],
      mod2: [["Insuficiencia renal crónica",v.insuficiencia_renal],["Diabetes mellitus",v.diabetes]],
      mod1: [["Hipertensión arterial",v.hipertension],["Dislipemia",v.dislipemia],["Tabaquismo",v.tabaquismo],["Quimioterapia previa",v.quimioterapia_previa]]
    })
  },
  btk: {
    title: "Evaluación del riesgo por inhibidores BTK", treatment: "Inhibidores BTK",
    drugs: [["Ibrutinib","ibrutinib"],["Acalabrutinib","acalabrutinib"]],
    groups: [
      ["Datos generales y factores de riesgo cardiovascular", [number("edad","Edad:",60,14,110),checkbox("hipertension","Hipertensión"),checkbox("insuficiencia_renal","Enfermedad renal"),checkbox("diabetes","Diabetes"),checkbox("dislipemia","Dislipemia")]],
      ["Antecedentes cardiovasculares", [checkbox("fibrilacion_auricular","Fibrilación auricular"),checkbox("arritmia_ventricular","Arritmia ventricular"),checkbox("insuficiencia_cardiaca","Insuficiencia cardiaca"),checkbox("enfermedad_vascular","Enfermedad vascular")]],
      ["Riesgo cardiovascular y hemorrágico", [checkbox("anticoagulacion","Anticoagulación"),checkbox("antecedente_hemorragia","Antecedente de hemorragia"),checkbox("infeccion_activa","Infección activa")]]
    ],
    rules: v => ({
      very: [["Insuficiencia cardiaca establecida",v.insuficiencia_cardiaca],["Arritmia ventricular",v.arritmia_ventricular]],
      high: [["Fibrilación auricular",v.fibrilacion_auricular],["Edad igual o superior a 75 años",v.edad>=75],["Enfermedad vascular",v.enfermedad_vascular],["Antecedente de hemorragia",v.antecedente_hemorragia]],
      mod2: [["Enfermedad renal crónica",v.insuficiencia_renal],["Diabetes mellitus",v.diabetes],["Anticoagulación concomitante",v.anticoagulacion]],
      mod1: [["Hipertensión arterial",v.hipertension],["Dislipemia",v.dislipemia],["Infección activa",v.infeccion_activa]]
    })
  },
  inmunoterapia: {
    title: "Evaluación del riesgo por inmunoterapia", treatment: "Inmunoterapia ICI",
    drugs: [["Anti-PD-1/PD-L1","anti_pd1_pdl1"],["Anti-CTLA-4","anti_ctla4"],["Combinación ICI","combinacion_ici"]],
    groups: [
      ["Datos generales y factores de riesgo cardiovascular", [number("edad","Edad:",60,14,110),checkbox("hipertension","Hipertensión"),checkbox("diabetes","Diabetes"),checkbox("enfermedad_renal","Enfermedad renal")]],
      ["Antecedentes cardiovasculares y autoinmunes", [checkbox("cardiopatia_previa","Cardiopatía previa"),checkbox("insuficiencia_cardiaca","Insuficiencia cardiaca"),checkbox("arritmia","Arritmia"),checkbox("enfermedad_autoinmune","Enfermedad autoinmune")]],
      ["Biomarcadores", [checkbox("troponina_elevada","Troponina basal elevada"),checkbox("probnp_elevado","ProBNP basal elevado")]],
      ["Tratamientos previos", [checkbox("tratamiento_combinado_ici","Tratamiento combinado con ICI"),checkbox("tratamiento_cardiotoxico_previo","Tratamiento cardiotóxico previo")]]
    ],
    rules: v => ({
      very: [["Insuficiencia cardiaca establecida",v.insuficiencia_cardiaca],["Troponina basal elevada",v.troponina_elevada],["Cardiopatía previa",v.cardiopatia_previa]],
      high: [["Tratamiento combinado con ICI",v.tratamiento_combinado_ici],["Arritmia",v.arritmia],["ProBNP basal elevado",v.probnp_elevado],["Tratamiento cardiotóxico previo",v.tratamiento_cardiotoxico_previo]],
      mod2: [["Enfermedad renal crónica",v.enfermedad_renal],["Diabetes mellitus",v.diabetes]],
      mod1: [["Hipertensión arterial",v.hipertension],["Enfermedad autoinmune",v.enfermedad_autoinmune]]
    })
  },
  osimertinib: {
    title: "Evaluación del riesgo por osimertinib", treatment: "Osimertinib",
    drugs: [["Osimertinib","osimertinib"]],
    groups: [
      ["Datos generales y factores de riesgo cardiovascular", [number("edad","Edad:",60,14,110),checkbox("hipertension","Hipertensión"),checkbox("enfermedad_renal","Enfermedad renal")]],
      ["Antecedentes cardiovasculares", [checkbox("insuficiencia_cardiaca","Insuficiencia cardiaca"),checkbox("arritmia","Arritmia"),checkbox("cardiopatia_previa","Cardiopatía previa")]],
      ["Biomarcadores, imagen y ECG", [number("fevi","FEVI basal (%):",60,5,90),number("qtc","QTcF basal (ms):",420,250,700)]],
      ["Otros factores", [checkbox("hipomagnesemia","Hipomagnesemia"),checkbox("farmacos_prolongan_qt","Fármacos que prolongan QT")]]
    ],
    rules: v => ({
      very: [["Insuficiencia cardiaca establecida",v.insuficiencia_cardiaca],["FEVI basal inferior al 50 %",v.fevi<50],["QTcF igual o superior a 500 ms",v.qtc>=500]],
      high: [["QTcF entre 480 y 499 ms",v.qtc>=480&&v.qtc<500],["Arritmia",v.arritmia],["Cardiopatía previa",v.cardiopatia_previa]],
      mod2: [["Enfermedad renal crónica",v.enfermedad_renal],["Hipomagnesemia",v.hipomagnesemia]],
      mod1: [["Hipertensión arterial",v.hipertension],["Fármacos que prolongan el QT",v.farmacos_prolongan_qt]]
    })
  },
  cart: {
    title: "Evaluación del riesgo por CAR-T", treatment: "Terapias CAR-T",
    drugs: [["CAR-T","cart"]],
    groups: [
      ["Datos generales y factores de riesgo cardiovascular", [number("edad","Edad:",60,14,110),checkbox("hipertension","Hipertensión"),checkbox("enfermedad_renal","Enfermedad renal"),checkbox("enfermedad_vascular","Enfermedad vascular")]],
      ["Antecedentes cardiovasculares", [checkbox("cardiopatia_previa","Cardiopatía previa"),checkbox("arritmia","Arritmia"),checkbox("insuficiencia_cardiaca","Insuficiencia cardiaca")]],
      ["Biomarcadores, imagen y riesgo de CRS", [checkbox("troponina_elevada","Troponina basal elevada"),checkbox("probnp_elevado","ProBNP basal elevado"),number("fevi","FEVI basal (%):",60,5,90),checkbox("alto_riesgo_sindrome_liberacion_citoquinas","Alto riesgo de síndrome de liberación de citocinas"),checkbox("tratamiento_cardiotoxico_previo","Tratamiento cardiotóxico previo")]]
    ],
    rules: v => ({
      very: [["Insuficiencia cardiaca establecida",v.insuficiencia_cardiaca],["FEVI basal inferior al 50 %",v.fevi<50],["Troponina basal elevada",v.troponina_elevada],["Cardiopatía previa",v.cardiopatia_previa]],
      high: [["Alto riesgo de síndrome de liberación de citocinas",v.alto_riesgo_sindrome_liberacion_citoquinas],["Arritmia",v.arritmia],["Enfermedad vascular",v.enfermedad_vascular],["ProBNP basal elevado",v.probnp_elevado],["Tratamiento cardiotóxico previo",v.tratamiento_cardiotoxico_previo]],
      mod2: [["Enfermedad renal crónica",v.enfermedad_renal]],
      mod1: [["Hipertensión arterial",v.hipertension]]
    })
  }
};

function renderField(f, col = "") {
  if (f.type === "checkbox") return `<div class="check ${col}"><input type="checkbox" id="${f.id}" name="${f.id}"><label for="${f.id}">${esc(f.label)}</label></div>`;
  if (f.type === "select") return `<div class="form-group ${col}"><label for="${f.id}">${esc(f.label)}</label><select id="${f.id}" name="${f.id}">${f.options.map(o=>`<option value="${esc(o[1])}"${o[1]===f.value?" selected":""}>${esc(o[0])}</option>`).join("")}</select></div>`;
  return `<div class="form-group ${col}"><label for="${f.id}">${esc(f.label)}</label><input type="number" id="${f.id}" name="${f.id}" value="${f.value}" min="${f.min}" max="${f.max}"></div>`;
}

function scoreCard() {
  return `<section class="card"><div class="card-header">Riesgo cardiovascular global - SCORE2 / SCORE2-OP</div><div class="card-body"><p class="text-muted">SCORE2 se aplica a personas de 40-69 años y SCORE2-OP a 70-89 años sin enfermedad cardiovascular establecida, diabetes, enfermedad renal crónica ni hipercolesterolemia familiar.</p><div class="grid">${scoreFields.slice(0,8).map((f,i)=>renderField(f,i===2?"col-6":"col-3")).join("")}</div><div class="grid">${scoreFields.slice(8).map((f,i)=>renderField(f,i<3?"col-4":"col-6")).join("")}</div></div></section>`;
}

function getValues(form) {
  const values = {};
  form.querySelectorAll("input,select").forEach(el => {
    values[el.name || el.id] = el.type === "checkbox" ? el.checked : el.type === "number" ? (el.value === "" ? NaN : Number(el.value)) : el.value;
  });
  return values;
}

function toast(message, type="warning") {
  const el=document.createElement("div"); el.className=`toast ${type}`; el.textContent=message;
  document.getElementById("notifications").appendChild(el); setTimeout(()=>el.remove(),8000);
}

function activePairs(pairs) { return pairs.filter(([,on])=>Boolean(on)).map(([label])=>label); }
function calculateTreatment(key, values) {
  if (values.edad<14||values.edad>110) throw new Error("La edad debe estar entre 14 y 110 años.");
  if (values.fevi<5||values.fevi>90) throw new Error("La FEVI debe estar entre el 5 % y el 90 %.");
  if (["vegf","itk","osimertinib"].includes(key) && (values.qtc<250||values.qtc>700)) throw new Error("El QTc debe estar entre 250 y 700 ms.");
  const rules=modules[key].rules(values), very=activePairs(rules.very), high=activePairs(rules.high), mod2=activePairs(rules.mod2), mod1=activePairs(rules.mod1);
  const points=mod2.length*2+mod1.length;
  const risk=very.length?"Muy alto":high.length||points>=5?"Alto":points>=2?"Moderado":"Bajo";
  return { treatment:modules[key].treatment, risk, very, high, mod2, mod1, factors:[...very,...high,...mod2,...mod1], points };
}

function ldlTarget(category) {
  return ({"Bajo":{mg:116,mmol:3.0},"Moderado":{mg:100,mmol:2.6},"Alto":{mg:70,mmol:1.8,reduction:50},"Muy alto":{mg:55,mmol:1.4,reduction:50}})[category] || {mg:null,mmol:null};
}

function calculateScore2(v) {
  const age=v.edad_score2, sex=v.sexo_score2, smoker=v.fumador_score2?1:0, sbp=v.pas_score2, tc=v.colesterol_total_score2, hdl=v.colesterol_hdl_score2, ldl=v.colesterol_ldl_score2, region=v.region_score2;
  if (![age,sbp,tc,hdl].every(Number.isFinite)) throw new Error("Edad, presión arterial y colesterol deben ser valores numéricos válidos.");
  if (sbp<70||sbp>250) throw new Error("La presión arterial sistólica debe estar entre 70 y 250 mmHg.");
  if (tc<50||tc>500) throw new Error("El colesterol total debe estar entre 50 y 500 mg/dL.");
  if (hdl<10||hdl>150) throw new Error("El colesterol HDL debe estar entre 10 y 150 mg/dL.");
  if (hdl>=tc) throw new Error("El colesterol HDL debe ser menor que el colesterol total.");
  if (Number.isFinite(v.hba1c_score2) && (v.hba1c_score2<3||v.hba1c_score2>20)) throw new Error("La HbA1c debe estar entre el 3 % y el 20 %.");
  const exclusions=[];
  if(v.enfermedad_cv_score2) exclusions.push("enfermedad cardiovascular aterosclerótica establecida");
  if(v.diabetes_score2) exclusions.push("diabetes mellitus");
  if(v.enfermedad_renal_score2) exclusions.push("enfermedad renal crónica");
  if(v.hipercol_familiar_score2) exclusions.push("hipercolesterolemia familiar");
  if(age<40) exclusions.push("edad inferior a 40 años");
  if(age>89) exclusions.push("edad superior a 89 años");
  const model=age>=70?"SCORE2-OP":"SCORE2", pressureTarget="120-129/70-79 mmHg si se indica tratamiento y se tolera";
  if(exclusions.length) {
    const category=v.enfermedad_cv_score2?"Muy alto":"No calculable";
    return { applicable:false, model, risk10:null, category, reason:exclusions.join(", "), sbp, ldl, targetBP:pressureTarget, targetLDL:ldlTarget(category) };
  }
  const tcMmol=tc/38.67, hdlMmol=hdl/38.67;
  const young={bajo:{hombre:[-.5699,.7476],mujer:[-.738,.7019]},moderado:{hombre:[-.1565,.8009],mujer:[-.3143,.7701]},alto:{hombre:[.3207,.936],mujer:[.571,.9369]},muy_alto:{hombre:[.5836,.8294],mujer:[.9412,.8329]}};
  const old={bajo:{hombre:[-.34,1.19],mujer:[-.52,1.01]},moderado:{hombre:[.01,1.25],mujer:[-.10,1.10]},alto:{hombre:[.08,1.15],mujer:[.38,1.09]},muy_alto:{hombre:[.05,.70],mujer:[.38,.69]}};
  let raw, scale;
  if(age<70) {
    const cage=(age-60)/5, csbp=(sbp-120)/20, ct=tcMmol-6, ch=(hdlMmol-1.3)/.5;
    const lp=sex==="hombre"
      ? .3742*cage+.6012*smoker+.2777*csbp+.1458*ct-.2698*ch-.0755*cage*smoker-.0255*cage*csbp-.0281*cage*ct+.0426*cage*ch
      : .4648*cage+.7744*smoker+.3131*csbp+.1002*ct-.2606*ch-.1088*cage*smoker-.0277*cage*csbp-.0226*cage*ct+.0613*cage*ch;
    raw=1-Math.pow(sex==="hombre"?.9605:.9776,Math.exp(lp)); scale=young[region][sex];
  } else {
    const cage=age-73;
    const lp=sex==="hombre"
      ? .0634*cage+.3524*smoker+.0094*(sbp-150)+.085*(tcMmol-6)-.3564*(hdlMmol-1.4)-.0247*cage*smoker-.0005*cage*(sbp-150)+.0073*cage*(tcMmol-6)+.0091*cage*(hdlMmol-1.4)
      : .0789*cage+.4921*smoker+.0102*(sbp-150)+.0605*(tcMmol-6)-.304*(hdlMmol-1.4)-.0255*cage*smoker-.0004*cage*(sbp-150)-.0009*cage*(tcMmol-6)+.0154*cage*(hdlMmol-1.4);
    raw=1-Math.pow(sex==="hombre"?.7576:.8082,Math.exp(lp-(sex==="hombre"?.0929:.229))); scale=old[region][sex];
  }
  const risk=Math.round((1-Math.exp(-Math.exp(scale[0]+scale[1]*Math.log(-Math.log(1-raw)))))*1000)/10;
  const category=age<50?(risk<2.5?"Bajo":risk<7.5?"Moderado":"Alto"):age<70?(risk<5?"Bajo":risk<10?"Moderado":"Alto"):(risk<7.5?"Bajo":risk<15?"Moderado":"Alto");
  return { applicable:true, model, risk10:risk, category, reason:null, sbp, ldl, targetBP:pressureTarget, targetLDL:ldlTarget(category) };
}

const commonRecommendations = [
  "Optimizar presión arterial, LDL-colesterol y control glucémico según el riesgo calculado.",
  "Se recomienda dieta cardiosaludable, ejercicio adaptado y abandono del tabaco.",
  "Reevaluar sin demora ante disnea, dolor torácico, palpitaciones, síncope, edemas o deterioro clínico."
];

function referral(risk) { return ["Alto","Muy alto"].includes(risk) ? "Remitir a Cardio-Oncología para valoración precoz antes del tratamiento y seguimiento conjunto." : "Seguimiento por el equipo responsable con control estricto de los factores de riesgo cardiovascular."; }

function treatmentRecommendations(key, risk, drug, values) {
  const high=["Alto","Muy alto"].includes(risk);
  if(key==="antraciclinas") {
    const derivation=high?"Remitir a Cardio-Oncología para valoración precoz antes de iniciar antraciclinas y seguimiento conjunto.":risk==="Moderado"?"Seguimiento por el equipo responsable; valorar Cardio-Oncología si aparecen alteraciones clínicas, analíticas o ecocardiográficas.":"No se indica derivación sistemática a Cardio-Oncología; mantener vigilancia clínica y control cardiovascular.";
    const during={Bajo:["Realizar seguimiento clínico habitual y vigilar signos o síntomas cardiovasculares.","Mantener un control estricto de los factores de riesgo cardiovascular."],Moderado:["Determinar biomarcadores cardiacos cada 2 ciclos.","Realizar ecocardiograma después del cuarto ciclo.","Vigilar signos, síntomas y cambios compatibles con cardiotoxicidad."],Alto:["Determinar biomarcadores cardiacos antes de cada ciclo.","Realizar ecocardiograma cada 2 ciclos.","Considerar estrategias de cardioprotección según la valoración clínica.","Mantener seguimiento cardiovascular estrecho durante todo el tratamiento."],"Muy alto":["Determinar biomarcadores cardiacos antes de cada ciclo.","Realizar ecocardiograma cada 2 ciclos.","Individualizar el tratamiento y las estrategias de cardioprotección en Cardio-Oncología.","Mantener seguimiento cardiovascular estrecho durante todo el tratamiento."]}[risk];
    const after={Bajo:["Realizar ecocardiograma a los 12 meses de finalizar el tratamiento.","Planificar la vigilancia a largo plazo según exposición acumulada y riesgo cardiovascular."],Moderado:["Determinar biomarcadores a los 3 meses de finalizar el tratamiento.","Realizar ecocardiograma a los 12 meses.","Planificar vigilancia cardiovascular a largo plazo según el riesgo."],Alto:["Realizar ecocardiograma y biomarcadores a los 3 y 12 meses.","Planificar seguimiento cardiovascular a largo plazo en Cardio-Oncología."],"Muy alto":["Realizar ecocardiograma y biomarcadores a los 3 y 12 meses.","Mantener seguimiento cardiovascular especializado a largo plazo."]}[risk];
    return {derivation,common:[...commonRecommendations],before:["Solicitar ecocardiograma con FEVI y GLS cuando esté disponible, además de ECG y biomarcadores basales.","Realizar valoración clínica cardiovascular y optimizar los factores de riesgo antes del primer ciclo.","Solicitar ECG, ecocardiograma, troponina ultrasensible y ProBNP basales.",...(high?["Valorar estrategias de cardioprotección antes de iniciar el tratamiento."]:[])],during,after};
  }
  if(key==="antiher2") {
    const derivation=risk==="Muy alto"?"Derivación prioritaria a Cardio-Oncología antes de iniciar el tratamiento anti-HER2 y seguimiento conjunto.":risk==="Alto"?"Remitir a Cardio-Oncología para valoración precoz antes de iniciar el tratamiento anti-HER2.":risk==="Moderado"?"Valorar derivación a Cardio-Oncología según antecedentes, hallazgos basales y criterio clínico.":"No se indica derivación sistemática a Cardio-Oncología; mantener vigilancia clínica y control cardiovascular.";
    const during={Bajo:["Realizar ecocardiograma y biomarcadores cada 4 ciclos.","Vigilar síntomas y signos de disfunción cardiaca durante el tratamiento."],Moderado:["Realizar ecocardiograma y biomarcadores cada 3 ciclos.","Si existe estabilidad clínica y cardiológica a los 4 meses, considerar espaciar los controles a cada 4 ciclos."],Alto:["Realizar ecocardiograma cada 2 ciclos.","Determinar troponina y NT-proBNP antes de cada ciclo durante los primeros 3-6 meses y posteriormente cada 3 ciclos.","Mantener seguimiento coordinado con Cardio-Oncología."],"Muy alto":["Realizar ecocardiograma cada 2 ciclos.","Determinar biomarcadores antes de cada ciclo durante los primeros 3-6 meses y posteriormente cada 3 ciclos.","Individualizar la continuidad y las medidas de cardioprotección con Cardio-Oncología y Oncología."]}[risk];
    const after={Bajo:["Considerar ecocardiograma entre los 6 y 12 meses tras finalizar el tratamiento.","Continuar el control de los factores de riesgo cardiovascular."],Moderado:["Realizar ecocardiograma a los 6 meses y considerar un control adicional a los 12 meses.","Continuar el control estricto de los factores de riesgo cardiovascular."],Alto:["Realizar ecocardiograma a los 3 y 12 meses; valorar control adicional a los 6 meses.","Planificar seguimiento cardiovascular según los hallazgos."],"Muy alto":["Realizar ecocardiograma a los 3 y 12 meses; valorar control adicional a los 6 meses.","Mantener seguimiento cardiovascular especializado a largo plazo."]}[risk];
    return {derivation,common:[...commonRecommendations],before:["Solicitar ecocardiograma con FEVI y GLS cuando esté disponible, además de ECG y biomarcadores basales.","Realizar valoración clínica cardiovascular y optimizar los factores de riesgo antes de iniciar el tratamiento.","Solicitar ECG, ecocardiograma, troponina ultrasensible y ProBNP basales.",...(high?["Acordar con Cardio-Oncología el plan de monitorización y las medidas de cardioprotección."]:[])],during,after};
  }
  if(key==="vegf") return {derivation:referral(risk),common:[...commonRecommendations],before:high?["Realizar ECG, ecocardiograma y ProBNP basales.","Optimizar la presión arterial y valorar función renal y proteinuria."]:["Realizar ECG y ecocardiograma basales.","Optimizar la presión arterial y valorar función renal y proteinuria."],during:["ECG seriado con QTcF (Fridericia); repetir tras aumentos de dosis o si se añaden fármacos que prolongan el QT y corregir causas reversibles.","Control domiciliario diario de la presión arterial durante el primer ciclo y tras cada aumento de dosis; posteriormente cada 2-3 semanas.",high?"Ecocardiograma y ProBNP cada 3 meses durante el primer año.":risk==="Moderado"?"Considerar ecocardiograma cada 4 meses durante el primer año.":"Repetir pruebas cardiovasculares según síntomas y evolución clínica.","Si el tratamiento dura más de un año, considerar ecocardiograma cada 6-12 meses."],after:["Reevaluación cardiovascular al finalizar.","Mantener el control de la presión arterial, función renal y demás factores de riesgo."]};
  if(key==="itk") return {derivation:referral(risk),common:[...commonRecommendations],before:["Documentar QTcF mediante la fórmula de Fridericia y corregir causas reversibles de prolongación del QT.","Realizar ecocardiograma y ECG basales; documentar QTc.","Valorar enfermedad arterial periférica mediante índice tobillo-brazo cuando esté indicado."],during:[high?"Ecocardiograma cada 3 meses durante el primer año, especialmente con dasatinib o ponatinib.":["dasatinib","ponatinib"].includes(drug)?"Si el tratamiento supera 12 meses, considerar ecocardiograma cada 6-12 meses.":"Repetir ecocardiograma según riesgo, síntomas y evolución clínica.",["nilotinib","ponatinib"].includes(drug)?"Valoración cardiovascular cada 3 meses el primer año y cada 6-12 meses posteriormente.":"Seguimiento cardiovascular periódico según el perfil del fármaco.",drug==="nilotinib"?"Medir QTc a las 2 y 4 semanas tras el inicio y 2 semanas después de cada incremento de dosis.":"Controlar QTc según el fármaco, cambios de dosis y factores concomitantes.","Considerar evaluación seriada del índice tobillo-brazo para detectar enfermedad vascular subclínica."],after:["Reevaluar el riesgo cardiovascular y las secuelas vasculares o ventriculares.","Mantener control estricto de factores de riesgo cardiovascular."]};
  if(key==="mieloma") {
    const proteasome=["carfilzomib","bortezomib","ixazomib"].includes(drug), amy=values.amiloidosis_cardiaca;
    return {derivation:referral(risk),common:[...commonRecommendations],before:["Realizar valoración clínica, ECG y medición de presión arterial basal.",proteasome?"Determinar péptidos natriuréticos y realizar ecocardiograma basal, valorando signos de amiloidosis AL.":"Valorar ecocardiograma y biomarcadores según el esquema terapéutico.",...(amy?["Por amiloidosis cardiaca: realizar troponina, péptidos natriuréticos, ecocardiograma y resonancia magnética cardiaca basales."]:[])],during:["Medir la presión arterial en cada visita; control domiciliario semanal durante 3 meses y después mensual.",["carfilzomib","bortezomib"].includes(drug)?"Considerar péptidos natriuréticos en cada ciclo durante los 6 primeros ciclos.":drug==="ixazomib"?"Considerar péptidos natriuréticos cada 2 meses.":"Vigilar signos de insuficiencia cardiaca y trombosis durante el tratamiento.",drug==="carfilzomib"?"Considerar ecocardiograma cada 3 ciclos.":"Repetir ecocardiograma según riesgo, síntomas y evolución clínica.",...(amy?["Por amiloidosis cardiaca: troponina y péptidos natriuréticos cada 3-6 meses, y ecocardiograma cada 3 ciclos."]:[])],after:["Reevaluar función ventricular, presión arterial y biomarcadores según los hallazgos.","Mantener prevención cardiovascular y vigilancia trombótica."]};
  }
  if(key==="fluoropirimidinas") return {derivation:referral(risk),common:[...commonRecommendations],before:["Realizar PA, ECG, perfil lipídico, HbA1c y SCORE2/SCORE2-OP.","Considerar cribado de enfermedad coronaria en riesgo alto o muy alto.","En enfermedad coronaria sintomática, realizar ecocardiograma basal."],during:["Educar sobre dolor torácico, disnea y palpitaciones; suspender y valorar urgentemente si aparecen.","Controlar ECG y síntomas durante los primeros ciclos, especialmente con antecedentes coronarios."],after:["Reevaluar síntomas y factores de riesgo cardiovascular.","Mantener prevención cardiovascular y seguimiento según hallazgos."]};
  if(key==="btk") return {derivation:referral(risk),common:[...commonRecommendations],before:["Realizar PA, ECG y valoración del riesgo de fibrilación auricular y sangrado.","Revisar anticoagulantes, antiagregantes e interacciones."],during:["Controlar la PA en cada visita; monitorización domiciliaria semanal los 3 primeros meses y después mensual.","Buscar fibrilación auricular oportunistamente en cada visita y realizar ECG si hay síntomas.","Vigilar sangrado y reevaluar la indicación de anticoagulación."],after:["Reevaluar presión arterial, ritmo y riesgo hemorrágico.","Mantener seguimiento cardiovascular según el perfil clínico."]};
  if(key==="inmunoterapia") return {derivation:referral(risk),common:[...commonRecommendations],before:["Realizar ECG, troponina y péptidos natriuréticos basales.","Documentar síntomas, enfermedad cardiovascular y tratamientos cardiotóxicos previos."],during:["Repetir ECG, troponina y péptidos natriuréticos antes de las primeras dosis y ante síntomas.","Ante sospecha de miocarditis, interrumpir temporalmente el ICI y derivar urgentemente a Cardio-Oncología."],after:["Reevaluar síntomas, ECG y biomarcadores si existió elevación durante el tratamiento.","Mantener vigilancia de secuelas cardiovasculares."]};
  if(key==="osimertinib") return {derivation:referral(risk),common:[...commonRecommendations],before:["Realizar ECG con QTcF, ecocardiograma y valoración de riesgo cardiovascular basales.","Controlar magnesio y potasio y corregir alteraciones antes de iniciar."],during:["Considerar ecocardiograma cada 3 meses durante el tratamiento.","Repetir ECG y QTcF tras el inicio, cambios de dosis o aparición de síntomas.","Controlar periódicamente magnesio y potasio."],after:["Reevaluar función ventricular, QTcF y electrolitos.","Mantener control de factores de riesgo cardiovascular."]};
  if(key==="cart") return {derivation:referral(risk),common:[...commonRecommendations],before:["Realizar ECG, troponina, péptidos natriuréticos y ecocardiograma según riesgo.","Optimizar enfermedad cardiovascular y documentar FEVI basal."],during:["Monitorizar presión arterial, ritmo, síntomas, troponina y péptidos natriuréticos durante el síndrome de liberación de citocinas.","Ante hipotensión, arritmia o deterioro ventricular, activar valoración multidisciplinar urgente."],after:["Reevaluar función ventricular, ECG y biomarcadores tras la fase aguda.","Planificar seguimiento cardiovascular según toxicidad y hallazgos."]};
  return {derivation:referral(risk),common:[...commonRecommendations],before:["Realizar ecocardiograma basal.","Registrar ECG, presión arterial y factores de riesgo cardiovascular basales."],during:["Medir la presión arterial en cada visita; control domiciliario semanal durante los 3 primeros meses y después mensual.",drug==="vemurafenib_cobimetinib"?"Realizar ECG a las 2 y 4 semanas y posteriormente cada 3 meses.":"Repetir ECG según el fármaco, síntomas y evolución clínica.",high?"Realizar ecocardiograma cada 4 meses durante el primer año.":"Repetir ecocardiograma según riesgo, síntomas y evolución clínica."],after:["Realizar reevaluación cardiovascular al finalizar el tratamiento.","Mantener el control de factores de riesgo y seguimiento si persisten alteraciones."]};
}

function scorePrevention(score) {
  const t=score.targetLDL;
  const ldlText=t.mg==null?"Individualizar el objetivo de LDL-colesterol según la enfermedad que excluye SCORE2 y las guías específicas.":`Objetivo de LDL-colesterol: <${t.mg} mg/dL (<${t.mmol} mmol/L)${t.reduction?` y reducción >=${t.reduction}% desde el valor basal`:""}.`;
  const current=Number.isFinite(score.ldl)&&t.mg!=null?(score.ldl<t.mg?`LDL actual ${score.ldl} mg/dL: dentro del objetivo numérico.`:`LDL actual ${score.ldl} mg/dL: por encima del objetivo; revisar adherencia, estilo de vida y tratamiento hipolipemiante.`):null;
  return [`Objetivo de presión arterial durante tratamiento antihipertensivo: ${score.targetBP}; individualizar si existe fragilidad, hipotensión ortostática o mala tolerancia.`,ldlText,current,score.sbp>=140?`Presión sistólica registrada: ${score.sbp} mmHg; confirmar con mediciones repetidas o fuera de consulta y optimizar el control.`:`Presión sistólica registrada: ${score.sbp} mmHg.`,"Abandono completo del tabaco y ofrecimiento de apoyo conductual y farmacológico cuando proceda.","Promover dieta mediterránea, reducción de sal, ejercicio aeróbico y de fuerza adaptado a la situación oncológica, y peso saludable.","Control periódico de glucemia o HbA1c; si existe diabetes, objetivo habitual de HbA1c <7%, siempre individualizado.","Revisar función renal, adherencia, interacciones y tolerancia antes de iniciar o intensificar tratamiento preventivo."].filter(Boolean);
}

function list(items) { return `<ul>${items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`; }
function riskClass(risk) { return risk==="Bajo"?"risk-low":risk==="Moderado"?"risk-moderate":["Alto","Alto precoz","Alto tardío"].includes(risk)?"risk-high":["Muy alto","Valoración prioritaria"].includes(risk)?"risk-very-high":"risk-neutral"; }
function scoreHtml(s) {
  if(s.applicable) { const c=s.category==="Bajo"?"success":s.category==="Muy alto"?"danger":"warning"; return `<hr><h3>Riesgo cardiovascular global</h3><div class="alert alert-${c}"><h4>${s.model}: ${s.risk10}% a 10 años - riesgo ${s.category.toLowerCase()}</h4><p>Estimación de un primer evento cardiovascular mortal o no mortal.</p></div>`; }
  return `<hr><h3>Riesgo cardiovascular global</h3><div class="alert alert-secondary"><h4>${s.model} no aplicable</h4><p>Motivo: ${esc(s.reason)}</p>${s.category==="Muy alto"?"<p><strong>La enfermedad cardiovascular establecida sitúa al paciente en riesgo clínico muy alto.</strong></p>":""}</div>`;
}

function recommendationsHtml(rec, survivor=false) {
  return `<hr><h3>${survivor?"Plan de vigilancia":"Recomendaciones clínicas"}</h3><h4>Derivación</h4><p><strong>${esc(rec.derivation)}</strong></p><h4>${survivor?"Medidas comunes":"Recomendaciones generales"}</h4>${list(rec.common)}<h4>${survivor?"Próxima actuación":"Antes del tratamiento"}</h4>${list(rec.before)}<h4>${survivor?"Calendario":"Durante el tratamiento"}</h4>${list(rec.during)}<h4>${survivor?"Seguimiento longitudinal":"Después del tratamiento"}</h4>${list(rec.after)}<hr><p class="text-muted">${survivor?"Herramienta de vigilancia para pacientes estables. No sustituye una valoración diagnóstica ni el criterio clínico.":"Herramienta de apoyo: no sustituye el criterio clínico ni la valoración individual."}</p>`;
}

function todayISO(date=new Date()) { return date.toISOString().slice(0,10); }
function yearsSince(dateText) { return (Date.now()-new Date(`${dateText}T00:00:00`).getTime())/(365.25*86400000); }
function addYears(date, years) { const d=new Date(date); d.setFullYear(d.getFullYear()+years); return d; }
function esDate(date) { return new Intl.DateTimeFormat("es-ES").format(date); }

function calculateSurvivor(v) {
  const end=new Date(`${v.fecha_fin_tratamiento}T00:00:00`);
  if(!v.fecha_fin_tratamiento||Number.isNaN(end.getTime())||end>Date.now()) throw new Error("La fecha de finalización debe ser válida y no puede ser futura.");
  if(v.dosis_doxorrubicina<0||v.dosis_doxorrubicina>2000) throw new Error("La dosis equivalente de doxorrubicina debe estar entre 0 y 2000.");
  if(v.dosis_media_cardiaca<0||v.dosis_media_cardiaca>100) throw new Error("La dosis media cardiaca debe estar entre 0 y 100.");
  const years=yearsSince(v.fecha_fin_tratamiento);
  const alerts=activePairs([
    ["Síntomas compatibles con insuficiencia cardiaca o deterioro funcional",v.sintomas_insuficiencia_cardiaca],
    ["Dolor torácico, síncope, presíncope o palpitaciones persistentes",v.dolor_sincope_palpitaciones],
    ["Diagnóstico o evento cardiovascular reciente",v.evento_cv_reciente],
    ["ECG, biomarcadores o pruebas de imagen anormales",v.pruebas_cardiacas_anormales],
    ["Cardiotoxicidad moderada o grave no resuelta",v.cardiotoxicidad_no_resuelta],
    ["Embarazo o planificación gestacional que requiere valoración específica",v.embarazo_planificado]
  ]);
  const doxo=v.dosis_doxorrubicina_desconocida?null:v.dosis_doxorrubicina;
  const rt=!v.radioterapia_cardiaca?0:v.dosis_radioterapia_desconocida?null:v.dosis_media_cardiaca;
  if(alerts.length) return {treatment:"Largos supervivientes",risk:"Valoración prioritaria",type:v.tipo_superviviente,end,years,doxo,rt,radiotherapy:v.radioterapia_cardiaca,onlyTargeted:v.solo_terapia_dirigida,cv:v.enfermedad_cv_establecida,rules:alerts,pending:[],provisional:false,very:alerts,high:[],mod2:[],mod1:[],factors:alerts,points:null};
  const pending=[];
  if(doxo==null) pending.push("Dosis acumulada equivalente de doxorrubicina");
  if(rt==null) pending.push("Dosis media cardiaca de radioterapia");
  if(v.riesgo_basal==="desconocido") pending.push("Categoría basal de riesgo cardiovascular");
  if(v.evaluacion_final==="desconocida") pending.push("Resultado de la evaluación cardiaca al finalizar el tratamiento");
  const very=activePairs([["Riesgo basal de toxicidad cardiovascular muy alto",v.tipo_superviviente==="adulto"&&v.riesgo_basal==="muy_alto"],["Doxorrubicina equivalente igual o superior a 400 mg/m²",doxo!=null&&doxo>=400],["Radioterapia con dosis media cardiaca superior a 25 Gy",rt!=null&&rt>25],["Radioterapia superior a 15 Gy combinada con doxorrubicina igual o superior a 100 mg/m²",rt!=null&&doxo!=null&&rt>15&&doxo>=100]]);
  const early=activePairs([["Riesgo basal de toxicidad cardiovascular alto",v.tipo_superviviente==="adulto"&&v.riesgo_basal==="alto"],["Cardiotoxicidad moderada o grave durante el tratamiento",v.tipo_superviviente==="adulto"&&v.cardiotoxicidad_tratamiento==="moderada_grave"],["Doxorrubicina equivalente entre 250 y 399 mg/m²",doxo!=null&&doxo>=250&&doxo<400],["Trasplante de progenitores hematopoyéticos de alto riesgo",v.tipo_superviviente==="adulto"&&v.tph_alto_riesgo]]);
  let late=activePairs([["Radioterapia con dosis media cardiaca superior a 15 y hasta 25 Gy",rt!=null&&rt>15&&rt<=25],["Radioterapia de 5 a 15 Gy combinada con doxorrubicina igual o superior a 100 mg/m²",rt!=null&&doxo!=null&&rt>=5&&rt<=15&&doxo>=100],["Factores de riesgo cardiovascular mal controlados",v.tipo_superviviente==="adulto"&&v.frcv_mal_controlados]]);
  const moderate=activePairs([["Riesgo basal de toxicidad cardiovascular moderado",v.tipo_superviviente==="adulto"&&v.riesgo_basal==="moderado"],["Doxorrubicina equivalente entre 100 y 249 mg/m²",doxo!=null&&doxo>=100&&doxo<250],["Radioterapia con dosis media cardiaca entre 5 y 15 Gy",rt!=null&&rt>=5&&rt<=15],["Radioterapia menor de 5 Gy combinada con doxorrubicina igual o superior a 100 mg/m²",rt!=null&&doxo!=null&&rt<5&&doxo>=100]]);
  let risk, principal;
  if(very.length){risk="Muy alto";principal=very;}
  else if(early.length){risk=v.tipo_superviviente==="infancia"?"Alto":years<=5?"Alto precoz":"Alto tardío"; if(risk==="Alto tardío")late=[...late,...early]; principal=early;}
  else if(late.length){risk=v.tipo_superviviente==="infancia"?"Alto":"Alto tardío";principal=late;}
  else if(moderate.length){risk="Moderado";principal=moderate;}
  else {const low=v.tipo_superviviente==="adulto"?v.riesgo_basal==="bajo"&&v.evaluacion_final==="normal"&&!pending.length:rt!=null&&doxo!=null&&rt<5&&doxo<100; risk=low?"Bajo":"No clasificable";principal=[low?"Sin criterios de categorías superiores y evaluación compatible con riesgo bajo":"Información insuficiente para asignar de forma segura una categoría de riesgo"];}
  if(v.enfermedad_cv_establecida) principal.push("Enfermedad cardiovascular establecida: requiere seguimiento según la cardiopatía específica");
  const high=[...new Set([...early,...late])], factors=[...new Set([...very,...high,...moderate])];
  return {treatment:"Largos supervivientes",risk,type:v.tipo_superviviente,end,years,doxo,rt,radiotherapy:v.radioterapia_cardiaca,onlyTargeted:v.solo_terapia_dirigida,cv:v.enfermedad_cv_establecida,rules:[...new Set([...principal,...factors])],pending,provisional:pending.length>0&&risk!=="Muy alto",very,high,mod2:moderate,mod1:[],factors,points:null};
}

function nextSurvivorReview(r) {
  const now=new Date();
  if(["Valoración prioritaria","No clasificable"].includes(r.risk)) return now;
  if(r.type==="infancia") return addYears(now,["Alto","Muy alto"].includes(r.risk)?2:5);
  if(["Muy alto","Alto precoz"].includes(r.risk)) { for(const n of [1,3,5,10,15,20,25,30,35,40,45,50]) { const d=addYears(r.end,n); if(d>now)return d; } return addYears(now,5); }
  return addYears(now,r.risk==="Alto tardío"?1:5);
}

function survivorRecommendations(r) {
  const common=["Realizar revisión clínica cardiovascular periódica con control de la presión arterial.","Controlar perfil lipídico, glucemia o HbA1c y optimizar los demás factores de riesgo cardiovascular.","Promover ejercicio adaptado, dieta cardiosaludable, abandono del tabaco y control del peso.","Informar sobre síntomas cardiovasculares de alarma y sobre la importancia de comunicar las exposiciones cardiotóxicas previas.","Reestratificar el riesgo al menos cada 5 años o antes si cambia la situación clínica o existe una nueva exposición cardiotóxica."];
  if(r.risk==="Valoración prioritaria") return {derivation:"Interrumpir la clasificación rutinaria y realizar valoración clínica prioritaria por Cardiología o Cardio-Oncología.",common,before:["No retrasar la evaluación diagnóstica por utilizar este módulo.",...r.rules],during:["Realizar las pruebas dirigidas por los síntomas, hallazgos y criterio clínico."],after:["Reanudar la planificación de vigilancia cuando la situación clínica esté evaluada y estable."]};
  if(r.risk==="No clasificable") return {derivation:"Revisar el caso y recuperar el resumen terapéutico antes de asignar una categoría de riesgo.",common,before:["No asumir riesgo bajo cuando las exposiciones o la evaluación final sean desconocidas.",...(r.pending.length?[`Datos pendientes: ${r.pending.join("; ")}`]:[])],during:["Individualizar la vigilancia provisional según las exposiciones conocidas y el criterio clínico."],after:["Recalcular el riesgo cuando se complete la información."]};
  const derivation=["Muy alto","Alto","Alto precoz","Alto tardío"].includes(r.risk)||r.cv||r.provisional?"Valorar seguimiento por Cardiología o Cardio-Oncología para planificar la vigilancia longitudinal.":"Seguimiento por el equipo responsable, con derivación si aparecen síntomas, enfermedad cardiovascular o pruebas anormales.";
  const calendar=r.type==="infancia"?[["Alto","Muy alto"].includes(r.risk)?"Realizar revisión cardiovascular cada 2 años, incluyendo valoración clínica, ECG y ecocardiograma según el protocolo aplicable.":"Realizar revisión cardiovascular cada 5 años, con valoración clínica, ECG y ecocardiograma según el riesgo."]:{"Muy alto":["Programar revisión clínica, ECG, péptidos natriuréticos y ecocardiograma a 1, 3 y 5 años; posteriormente cada 5 años si permanece estable."],"Alto precoz":["Programar revisión clínica, ECG, péptidos natriuréticos y ecocardiograma a 1, 3 y 5 años; posteriormente cada 5 años si permanece estable."],"Alto tardío":["Realizar evaluación cardiovascular anual y considerar ecocardiograma cada 5 años."],Moderado:["Si la evaluación final fue normal, realizar revisión clínica, ECG, ecocardiograma y péptidos natriuréticos cada 5 años."],Bajo:["Mantener prevención cardiovascular y reevaluación periódica; no programar imagen cardiaca rutinaria salvo indicación clínica o cambio del riesgo."]}[r.risk];
  const after=[];
  if(r.radiotherapy)after.push("Tras radioterapia con exposición cardiaca, valorar de forma individualizada el cribado de enfermedad coronaria, valvular, pericárdica y vascular.");
  if(r.onlyTargeted&&r.years>10)after.push("Tras terapia dirigida aislada, no proponer automáticamente vigilancia de por vida más allá de 10 años sin otra indicación; aplicar juicio clínico y protocolo vigente.");
  if(r.provisional)after.push(`Resultado provisional. Completar: ${r.pending.join("; ")}`);
  after.push("Adelantar la revisión si aparecen síntomas, pruebas anormales o una nueva exposición cardiotóxica.");
  return {derivation,common,before:[`Próxima revisión orientativa: ${esDate(nextSurvivorReview(r))}`,...(r.pending.length?[`Datos pendientes: ${r.pending.join("; ")}`]:[])],during:calendar,after};
}

function renderHome() {
  app.innerHTML=`<section class="card home-card"><div class="card-header home-card-header"><h2>CardioOnco Risk</h2><img class="home-card-logo" src="icons/logo-cardiologia.jpg" alt="Servicio de Cardiología del Hospital Universitario Miguel Servet"></div><div class="card-body"><h4>Calculadora de riesgo de cardiotoxicidad</h4><p>Seleccione el tratamiento oncológico que desea evaluar.</p><div class="form-group"><label for="treatmentChoice">Tratamiento:</label><select id="treatmentChoice"><option value="">Seleccione una opción</option><option value="antraciclinas">Antraciclinas</option><option value="antiher2">Anti-HER2</option><option value="vegf">Inhibidores del VEGF</option><option value="itk">Inhibidores BCR-ABL</option><option value="mieloma">Mieloma múltiple</option><option value="rafmek">Inhibidores RAF/MEK</option><option value="fluoropirimidinas">Fluoropirimidinas</option><option value="btk">Inhibidores BTK</option><option value="inmunoterapia">Inmunoterapia</option><option value="osimertinib">Osimertinib</option><option value="cart">CAR-T</option><option value="supervivientes">Largos supervivientes</option></select></div><button id="continue" class="btn btn-primary">Continuar</button><br><br></div></section>`;
  document.getElementById("continue").onclick=()=>{const key=document.getElementById("treatmentChoice").value;if(!key)return toast("Seleccione un tratamiento antes de continuar."); key==="supervivientes"?renderSurvivors():renderTherapeutic(key);};
}

function setTab(name) { document.querySelectorAll(".tab-button").forEach(b=>b.classList.toggle("active",b.dataset.tab===name)); document.querySelectorAll(".tab-panel").forEach(p=>p.hidden=p.dataset.panel!==name); }
function wireTabs() { document.querySelectorAll(".tab-button").forEach(b=>b.onclick=()=>setTab(b.dataset.tab)); }
function showResultFromTop() { setTab("result"); window.scrollTo(0, 0); }

function renderTherapeutic(key) {
  const m=modules[key];
  const cards=m.groups.map(([title,fields])=>`<section class="card col-6"><div class="card-header">${esc(title)}</div><div class="card-body">${fields.map(f=>renderField(f)).join("")}</div></section>`).join("");
  app.innerHTML=`<button class="btn btn-secondary back no-print">← Volver al inicio</button><h2>${esc(m.title)}</h2><p class="text-muted">Complete los datos clínicos y pulse Calcular riesgo.</p><form id="riskForm"><div class="tabs"><div class="tab-list" role="tablist"><button type="button" class="tab-button active" data-tab="clinical">Datos clínicos</button><button type="button" class="tab-button" data-tab="result">Resultado</button></div><section class="tab-panel" data-panel="clinical"><section class="card"><div class="card-header">Tratamiento previsto</div><div class="card-body"><div class="form-group"><label for="farmaco">Fármaco o combinación:</label><select id="farmaco" name="farmaco">${m.drugs.map(d=>`<option value="${d[1]}">${esc(d[0])}</option>`).join("")}</select></div></div></section>${scoreCard()}<div class="grid">${cards}</div><div class="button-row"><button type="button" id="calculate" class="btn btn-primary">Calcular riesgo</button><button type="button" id="clear" class="btn btn-secondary">Nueva evaluación</button></div></section><section class="tab-panel" data-panel="result" hidden><section class="card"><div class="card-header">Resultado de la evaluación</div><div class="card-body" id="resultBody"><p class="text-muted">Calcule el riesgo para mostrar el resultado.</p></div></section></section></div></form>`;
  document.querySelector(".back").onclick=renderHome; wireTabs();
  document.getElementById("clear").onclick=()=>renderTherapeutic(key);
  document.getElementById("calculate").onclick=()=>{ try {const values=getValues(document.getElementById("riskForm")), result=calculateTreatment(key,values), score=calculateScore2(values), rec=treatmentRecommendations(key,result.risk,values.farmaco,values); rec.common=[...new Set([...rec.common,...scorePrevention(score)])]; renderTreatmentResult(key,values,result,score,rec);showResultFromTop();}catch(e){toast(e.message,"error");} };
}

function factorSection(r) { const groups=[["Factores de riesgo muy alto",r.very],["Factores de riesgo alto",r.high],["Moderado 2 — 2 puntos por factor",r.mod2],["Moderado 1 — 1 punto por factor",r.mod1]]; return `<hr><h3>Factores identificados</h3>${groups.filter(([,a])=>a.length).map(([t,a])=>`<h4>${t}</h4>${list(a)}`).join("")||"<p>No se han identificado factores de riesgo.</p>"}`; }
function renderTreatmentResult(key,values,result,score,rec) {
  const body=document.getElementById("resultBody");
  body.innerHTML=`<div class="risk-box ${riskClass(result.risk)}"><h2>Riesgo ${esc(result.risk)}</h2></div>${factorSection(result)}${scoreHtml(score)}${recommendationsHtml(rec)}<button type="button" class="btn btn-success no-print" id="downloadPdf">Descargar informe PDF</button>`;
  document.getElementById("downloadPdf").onclick=()=>downloadReport({drug:modules[key].drugs.find(d=>d[1]===values.farmaco)?.[0],result,score,rec});
}

function renderSurvivors() {
  const fiveYears=new Date(); fiveYears.setDate(fiveYears.getDate()-365*5);
  const c=(id,label)=>renderField(checkbox(id,label));
  app.innerHTML=`<button class="btn btn-secondary back no-print">← Volver al inicio</button><h2>Seguimiento cardiovascular de largos supervivientes</h2><p class="text-muted">Módulo para pacientes clínicamente estables que han finalizado un tratamiento oncológico potencialmente cardiotóxico.</p><form id="survivorForm"><div class="tabs"><div class="tab-list"><button type="button" class="tab-button active" data-tab="safe">1. Seguridad</button><button type="button" class="tab-button" data-tab="history">2. Historia clínica</button><button type="button" class="tab-button" data-tab="exposures">3. Exposiciones</button><button type="button" class="tab-button" data-tab="result">4. Resultado</button></div>
  <section class="tab-panel" data-panel="safe"><section class="card"><div class="card-header">Comprobación de seguridad previa</div><div class="card-body"><p class="text-muted">Marque cualquier situación presente. Una alerta interrumpirá la clasificación rutinaria.</p>${c("sintomas_insuficiencia_cardiaca","Disnea nueva, ortopnea, edemas o intolerancia al esfuerzo no explicada")}${c("dolor_sincope_palpitaciones","Dolor torácico, síncope, presíncope o palpitaciones persistentes")}${c("evento_cv_reciente","Diagnóstico o evento cardiovascular reciente")}${c("pruebas_cardiacas_anormales","Alteración nueva o persistente en ECG, biomarcadores o imagen cardiaca")}${c("cardiotoxicidad_no_resuelta","Cardiotoxicidad moderada o grave no resuelta")}${c("embarazo_planificado","Embarazo o planificación gestacional")}</div></section></section>
  <section class="tab-panel" data-panel="history" hidden>${scoreCard()}<div class="grid"><section class="card col-6"><div class="card-header">Tipo de superviviente y cronología</div><div class="card-body">${renderField(select("tipo_superviviente","Cáncer diagnosticado y tratado:",[["En la edad adulta","adulto"],["En la infancia o adolescencia","infancia"]]))}<div class="form-group"><label for="fecha_fin_tratamiento">Fecha de finalización del último tratamiento cardiotóxico:</label><input type="date" id="fecha_fin_tratamiento" name="fecha_fin_tratamiento" value="${todayISO(fiveYears)}" max="${todayISO()}"></div>${renderField(select("riesgo_basal","Riesgo cardiovascular basal antes del tratamiento:",[["Desconocido","desconocido"],["Bajo","bajo"],["Moderado","moderado"],["Alto","alto"],["Muy alto","muy_alto"]]))}</div></section><section class="card col-6"><div class="card-header">Evolución cardiovascular</div><div class="card-body">${renderField(select("cardiotoxicidad_tratamiento","Cardiotoxicidad durante el tratamiento:",[["Ninguna","ninguna"],["Leve con recuperación completa","leve_recuperada"],["Moderada o grave","moderada_grave"]]))}${renderField(select("evaluacion_final","Evaluación cardiaca al finalizar el tratamiento:",[["Normal","normal"],["Anormal","anormal"],["Desconocida","desconocida"]]))}${c("enfermedad_cv_establecida","Enfermedad cardiovascular establecida")}${c("frcv_mal_controlados","Factores de riesgo cardiovascular mal controlados")}</div></section></div></section>
  <section class="tab-panel" data-panel="exposures" hidden><div class="grid"><section class="card col-6"><div class="card-header">Antraciclinas</div><div class="card-body">${renderField(number("dosis_doxorrubicina","Dosis acumulada equivalente de doxorrubicina (mg/m²):",0,0,2000))}${c("dosis_doxorrubicina_desconocida","Dosis desconocida o no convertida")}</div></section><section class="card col-6"><div class="card-header">Radioterapia</div><div class="card-body">${c("radioterapia_cardiaca","Radioterapia con posible afectación cardiaca")}${renderField(number("dosis_media_cardiaca","Dosis media cardiaca (Gy):",0,0,100))}${c("dosis_radioterapia_desconocida","Dosis media cardiaca desconocida")}</div></section><section class="card col-12"><div class="card-header">Otras exposiciones</div><div class="card-body">${c("tph_alto_riesgo","Trasplante de progenitores hematopoyéticos de alto riesgo")}${c("solo_terapia_dirigida","Exposición exclusiva a trastuzumab u otra terapia dirigida")}</div></section></div><div class="button-row"><button type="button" id="calculate" class="btn btn-primary">Calcular plan de vigilancia</button><button type="button" id="clear" class="btn btn-secondary">Nueva evaluación</button></div></section>
  <section class="tab-panel" data-panel="result" hidden><section class="card"><div class="card-header">Plan cardiovascular de supervivencia</div><div class="card-body" id="resultBody"><p class="text-muted">Calcule el plan para mostrar el resultado.</p></div></section></section></div></form>`;
  document.querySelector(".back").onclick=renderHome; wireTabs(); document.getElementById("clear").onclick=renderSurvivors;
  document.getElementById("calculate").onclick=()=>{try{const values=getValues(document.getElementById("survivorForm")),result=calculateSurvivor(values),score=calculateScore2(values),rec=survivorRecommendations(result);rec.common=[...new Set([...rec.common,...scorePrevention(score)])];const rules=`<hr><h3>Reglas activadas</h3>${list(result.rules)}${result.pending.length?`<h4>Datos pendientes</h4>${list(result.pending)}`:""}<h4>Resumen de exposiciones</h4><p>Doxorrubicina equivalente: ${result.doxo==null?"desconocida":`${result.doxo} mg/m²`}</p><p>Dosis media cardiaca: ${result.rt==null?"desconocida":`${result.rt} Gy`}</p>`;document.getElementById("resultBody").innerHTML=`<div class="risk-box ${riskClass(result.risk)}"><h2>Resultado: ${esc(result.risk)}</h2><p>${result.type==="adulto"?"Circuito de cáncer tratado en la edad adulta":"Circuito de cáncer infantil o adolescente"}</p><p>Tiempo desde el final del tratamiento: ${result.years.toFixed(1)} años</p>${result.provisional?"<p><strong>Resultado provisional por datos pendientes.</strong></p>":""}</div>${rules}${scoreHtml(score)}${recommendationsHtml(rec,true)}<button type="button" class="btn btn-success no-print" id="downloadPdf">Descargar informe PDF</button>`;document.getElementById("downloadPdf").onclick=()=>downloadReport({drug:"Vigilancia cardiovascular a largo plazo",result,score,rec,survivor:true});showResultFromTop();}catch(e){toast(e.message,"error");}};
}

const PDF_PAGE = { width: 595.28, height: 841.89, left: 44.65, right: 553.77, bodyTop: 740.86, bodyBottom: 59 };

function pdfColor(hex) {
  const value=hex.replace("#","");
  return [0,2,4].map(i=>(parseInt(value.slice(i,i+2),16)/255).toFixed(3)).join(" ");
}

function winAnsiBytes(text) {
  const special={0x20ac:0x80,0x201a:0x82,0x0192:0x83,0x201e:0x84,0x2026:0x85,0x2020:0x86,0x2021:0x87,0x02c6:0x88,0x2030:0x89,0x0160:0x8a,0x2039:0x8b,0x0152:0x8c,0x017d:0x8e,0x2018:0x91,0x2019:0x92,0x201c:0x93,0x201d:0x94,0x2022:0x95,0x2013:0x96,0x2014:0x97,0x02dc:0x98,0x2122:0x99,0x0161:0x9a,0x203a:0x9b,0x0153:0x9c,0x017e:0x9e,0x0178:0x9f};
  const safe=String(text).replace(/[\u2010-\u2015]/g,"-").replace(/≥/g,">=").replace(/≤/g,"<=");
  let out="";
  for(const char of safe){const cp=char.codePointAt(0),byte=cp<=255?cp:special[cp]??45;out+=String.fromCharCode(byte);}
  return out.replace(/([\\()])/g,"\\$1").replace(/\r?\n/g," ");
}

function pdfWrap(text, size=9.5, indent=0, bullet=false) {
  const width=PDF_PAGE.right-PDF_PAGE.left-indent-(bullet?16:0);
  const max=Math.max(35,Math.floor(width/(size*.56)));
  const words=String(text).trim().split(/\s+/),lines=[];let line="";
  for(const word of words){const candidate=line?`${line} ${word}`:word;if(candidate.length>max&&line){lines.push(line);line=word;}else line=candidate;}
  if(line)lines.push(line);return lines.length?lines:[""];
}

function buildClinicalPdf(data) {
  const pages=[];let commands=[],y=PDF_PAGE.bodyTop,pageNumber=0;
  const rgb=pdfColor;
  const textWidth=(text,size,bold=false)=>String(text).length*size*(bold?.54:.49);
  const add=s=>commands.push(s);
  const rect=(x,bottom,w,h,fill,stroke=null,line=1)=>add(`q ${rgb(fill)} rg${stroke?` ${rgb(stroke)} RG ${line} w`:""} ${x.toFixed(2)} ${bottom.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${stroke?"B":"f"} Q`);
  const line=(x1,y1,x2,y2,color,width=.8)=>add(`q ${rgb(color)} RG ${width} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S Q`);
  const circle=(cx,cy,r,color)=>{const k=.5522847498*r;add(`q ${rgb(color)} rg ${cx+r} ${cy} m ${cx+r} ${cy+k} ${cx+k} ${cy+r} ${cx} ${cy+r} c ${cx-k} ${cy+r} ${cx-r} ${cy+k} ${cx-r} ${cy} c ${cx-r} ${cy-k} ${cx-k} ${cy-r} ${cx} ${cy-r} c ${cx+k} ${cy-r} ${cx+r} ${cy-k} ${cx+r} ${cy} c f Q`);};
  const drawText=(value,x,baseline,size=9.5,bold=false,color="#263238",align="left")=>{let tx=x;if(align==="right")tx-=textWidth(value,size,bold);add(`BT /${bold?"F2":"F1"} ${size} Tf ${rgb(color)} rg 1 0 0 1 ${tx.toFixed(2)} ${baseline.toFixed(2)} Tm (${winAnsiBytes(value)}) Tj ET`);};
  const startPage=()=>{if(commands.length)pages.push(commands.join("\n"));commands=[];pageNumber++;y=PDF_PAGE.bodyTop;rect(0,771.17,PDF_PAGE.width,70.72,"#174A5B");drawText("CardioOnco Risk",44.65,811.2,16,true,"#FFFFFF");drawText("Informe de estratificación cardiovascular",44.65,790.7,9,false,"#DCECEF");line(41.67,43.78,553.77,43.78,"#C9D4D8",.8);drawText(`Página ${pageNumber}`,553.77,21.3,7.5,false,"#66757B","right");};
  const ensure=height=>{if(y-height<PDF_PAGE.bodyBottom)startPage();};
  const paragraph=(value,{size=9.5,bold=false,color="#263238",indent=0,bullet=false,before=0,after=6.7}={})=>{if(value==null||!String(value).trim())return;y-=before;const lines=pdfWrap(value,size,indent,bullet),leading=size*1.35;ensure(lines.length*leading+after);lines.forEach((entry,index)=>{const prefix=bullet&&index===0?"- ":"";const continuation=bullet&&index>0?13:0;drawText(prefix+entry,PDF_PAGE.left+indent+continuation,y-size,size,bold,color);y-=leading;});y-=after;};
  const section=(title,indicator=null)=>{ensure(80);y-=11.8;rect(41.67,y-31.9,512.1,32,"#EAF1F3");drawText(title,44.65,y-21.8,11,true,"#174A5B");if(indicator)circle(208.35,y-16,5,indicator);y-=43.8;};
  const bulletList=items=>{if(!items?.length)paragraph("No aplicable.",{color:"#66757B"});else items.filter(Boolean).forEach(item=>paragraph(item,{bullet:true,indent:6}));};
  const riskPalette={"Bajo":["#E8F5E9","#198754","#146C43"],"Moderado":["#FFF3CD","#D39E00","#755A00"],"Alto":["#FFE5D0","#FD7E14","#8A3D00"],"Alto precoz":["#FFE5D0","#FD7E14","#8A3D00"],"Alto tardío":["#FFE5D0","#FD7E14","#8A3D00"],"Muy alto":["#F8D7DA","#DC3545","#842029"],"Valoración prioritaria":["#F8D7DA","#DC3545","#842029"],"No clasificable":["#E9ECEF","#6C757D","#343A40"]};
  startPage();
  paragraph("DATOS DE LA EVALUACIÓN",{size:8.5,bold:true,color:"#567078",after:5});
  paragraph(`Fecha del informe: ${new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date())}`,{after:4});
  paragraph(`Tratamiento: ${data.result.treatment}`,{after:4});
  if(data.drug)paragraph(`Fármaco o esquema: ${data.drug}`,{after:4});
  ensure(100);y-=6.7;const palette=riskPalette[data.result.risk]||riskPalette["No clasificable"];rect(41.67,y-75.8,512.1,75.8,palette[0],palette[1],1.3);drawText(`RIESGO DE CARDIOTOXICIDAD ${data.result.risk.toUpperCase()}`,53.6,y-33.5,18,true,palette[2]);y-=94.3;
  const score=data.score,scoreIndicator={"Bajo":"#198754","Moderado":"#FFC107","Alto":"#FD7E14","Muy alto":"#DC3545"}[score.category]||"#6C757D";
  section("Riesgo cardiovascular global",scoreIndicator);
  if(score.applicable){paragraph(`${score.model}: ${score.risk10}% a 10 años - categoría ${score.category.toLowerCase()}.`,{bold:true,color:"#174A5B"});paragraph("Estimación de un primer evento cardiovascular mortal o no mortal.");}
  else {paragraph(`${score.model} no aplicable.`,{bold:true,color:"#174A5B"});paragraph(`Motivo: ${score.reason}`);if(score.category==="Muy alto")paragraph("La enfermedad cardiovascular establecida determina riesgo clínico muy alto.",{bold:true});}
  paragraph(`Presión arterial registrada: ${score.sbp} mmHg.`);
  if(Number.isFinite(score.ldl))paragraph(`LDL-colesterol registrado: ${score.ldl} mg/dL.`);
  paragraph(`Objetivo de presión arterial: ${score.targetBP}.`,{bullet:true,indent:6});
  const target=score.targetLDL;paragraph(target.mg==null?"Individualizar el objetivo de LDL-colesterol según la enfermedad que excluye SCORE2 y las guías específicas.":`Objetivo de LDL-colesterol: <${target.mg} mg/dL (<${target.mmol} mmol/L)${target.reduction?` y reducción >=${target.reduction}% desde el valor basal`:""}.`,{bullet:true,indent:6});
  section("Factores de riesgo identificados");
  const groups=[["Muy alto",data.result.very],["Alto",data.result.high],["Moderado 2 (2 puntos)",data.result.mod2],["Moderado 1 (1 punto)",data.result.mod1]];
  if(!data.result.factors?.length&&data.survivor)groups[3][1]=data.result.rules||[];
  if(!data.result.factors?.length&&!data.survivor)paragraph("No se han identificado factores de riesgo.");
  else groups.forEach(([title,items])=>{if(items?.length){paragraph(title,{bold:true,color:"#37474F",before:3,after:4});bulletList(items);}});
  section("Derivación");paragraph(data.rec.derivation,{bold:true});
  const general=(data.rec.common||[]).filter(item=>!item.startsWith("LDL actual ")&&!item.startsWith("Presión sistólica registrada:"));
  section(data.survivor?"Medidas comunes":"Recomendaciones generales y basales");bulletList(general);
  if(data.rec.before?.length){if(data.survivor)section("Próxima actuación");bulletList(data.rec.before);}
  section(data.survivor?"Calendario de vigilancia":"Durante el tratamiento");bulletList(data.rec.during);
  section(data.survivor?"Seguimiento longitudinal":"Después del tratamiento");bulletList(data.rec.after);
  section("Observaciones");paragraph("Este informe resume la estratificación realizada con CardioOnco Risk. Debe interpretarse junto con la historia clínica, las pruebas complementarias y el criterio del equipo asistencial.",{color:"#455A64"});
  pages.push(commands.join("\n"));
  const objects=[],put=value=>{objects.push(value);return objects.length;};
  const regular=put("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"),bold=put("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"),pagesRef=put(""),pageRefs=[];
  pages.forEach(content=>{const streamRef=put(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);pageRefs.push(put(`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${PDF_PAGE.width} ${PDF_PAGE.height}] /Resources << /Font << /F1 ${regular} 0 R /F2 ${bold} 0 R >> >> /Contents ${streamRef} 0 R >>`));});
  objects[pagesRef-1]=`<< /Type /Pages /Kids [${pageRefs.map(ref=>`${ref} 0 R`).join(" ")}] /Count ${pageRefs.length} >>`;
  const catalog=put(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`),info=put(`<< /Title (${winAnsiBytes("CardioOnco Risk - Informe de estratificación cardiovascular")}) /Creator (${winAnsiBytes("CardioOnco Risk HTML/JavaScript")}) >>`);
  let pdf="%PDF-1.4\n%\xE2\xE3\xCF\xD3\n",offsets=[0];objects.forEach((object,index)=>{offsets.push(pdf.length);pdf+=`${index+1} 0 obj\n${object}\nendobj\n`;});const xref=pdf.length;pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(offset=>`${String(offset).padStart(10,"0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length+1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Uint8Array.from(pdf,char=>char.charCodeAt(0)&255);
}

function downloadReport(data) {
  const blob=new Blob([buildClinicalPdf(data)],{type:"application/pdf"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`CardioOncoRisk_${data.survivor?"supervivientes":resultFile(data.result.treatment)}_${todayISO().replaceAll("-","")}.pdf`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function resultFile(name){return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");}

renderHome();
