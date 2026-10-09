import json
import os
import re

print("Avvio estrazione e compilazione enciclopedia clinica a 5 discipline...")

BASE_DIR = "/home/luca/cardio-thoracic-medterminal"
SRC_DATA = os.path.join(BASE_DIR, "src", "data")
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")

# Caricamento testi con layout preservato
with open(os.path.join(SCRIPTS_DIR, "cardio.txt"), "r", encoding="utf-8", errors="ignore") as f:
    raw_cardio = f.read()

with open(os.path.join(SCRIPTS_DIR, "pneumo.txt"), "r", encoding="utf-8", errors="ignore") as f:
    raw_pneumo = f.read()

with open(os.path.join(SCRIPTS_DIR, "vascolare.txt"), "r", encoding="utf-8", errors="ignore") as f:
    raw_vascolare = f.read()

cardio_pages = raw_cardio.split('\x0c')
pneumo_pages = raw_pneumo.split('\x0c')
vascolare_pages = raw_vascolare.split('\x0c')

print(f"Pagine caricate: Cardio={len(cardio_pages)}, Pneumo-Toracica={len(pneumo_pages)}, Vascolare={len(vascolare_pages)}")

def get_text_range(pages, start_page, end_page):
    """Estrae il testo integrale da start_page a end_page (1-based inclusivo)"""
    extracted = []
    for p in range(start_page - 1, min(end_page, len(pages))):
        clean_p = pages[p].strip()
        if clean_p:
            extracted.append(clean_p)
    return "\n\n".join(extracted)

# 1. CARDIOLOGIA MEDICA (Pagine 1 - 110 di cardio.txt)
cardio_medica_topics = [
    {
        "id": "crd-semeiotica",
        "title": "Semeiotica Cardiovascolare & Auscultazione",
        "category": "Semeiotica & Fisiopatologia",
        "badge": "CARDIO-MED",
        "icon": "Stethoscope",
        "highYieldSummary": {
            "definizione": "Valutazione clinica dell'attività cardiaca: auscultazione sistematica dei 5 focolai (Aortico II dx, Polmonare II sx, Erb III sx, Tricuspide IV-V parasternale sx, Mitrale V spazio emiclaveare sx). Analisi di toni fondamentali, clicks, schiocchi, soffi e dinamica dei polsi.",
            "segniCardine": "S1 (chiusura AV: aumentato in stenosi mitralica, ridotto in BAV1 e IM), S2 (chiusura semilunari: sdoppiamento fisiologico in inspirazione, sdoppiamento fisso nel DIA), S3 (galoppo protodiastolico da riempimento ventricolare rapido, fisiologico < 30 anni, patologico nello scompenso), S4 (galoppo telediastolico atriale contro ventricolo rigido da ipertrofia).",
            "diagnostica": "Auscultazione fonocardiografica, polso parvus et tardus (stenosi aortica), polso celere e scoccante di Corrigan (insufficienza aortica), polso paradosso (caduta PAS > 10 mmHg in inspirazione nel tamponamento).",
            "terapia": "Orientamento diagnostico differenziale immediato per valvulopatie, versamento pericardico, tamponamento e scompenso."
        },
        "examTraps": [
            "Il polso paradosso NON è una variazione della frequenza cardiaca, ma una caduta anomala della pressione arteriosa sistolica > 10 mmHg durante l'inspirazione spontanea (tipico del tamponamento cardiaco).",
            "S1 aumenta di intensità nella stenosi mitralica per il forte gradiente pressorio transmitralico che spalanca i lembi mobili prima della chiusura.",
            "Lo sdoppiamento FISSO di S2 (che non varia né in inspirazione né in espirazione) è il reperto patognomonico del Difetto Interatriale (DIA)."
        ],
        "clozeTokens": [
            "chiusura valvole atrio-ventricolari",
            "sdoppiamento fisso nel DIA",
            "riempimento ventricolare rapido protodiastolico",
            "contrazione atriale attiva telediastolica",
            "polso parvus et tardus",
            "caduta PAS maggiore di 10 mmHg"
        ],
        "linkedTools": {
            "quizIds": ["q-crd-01", "q-crd-02"],
            "oralStationId": 1,
            "calculatorId": None,
            "specialistTool": None,
            "audioKey": "s1-s2",
            "anatomy3dTarget": "heart"
        },
        "fullText": get_text_range(cardio_pages, 1, 14)
    },
    {
        "id": "crd-ipertensione",
        "title": "Ipertensione Arteriosa & Emergenze Ipertensive",
        "category": "Cardiologia Clinica",
        "badge": "CARDIO-MED",
        "icon": "Activity",
        "highYieldSummary": {
            "definizione": "Pressione arteriosa clinica persistentemente ≥ 140/90 mmHg (o ABPM medio 24h ≥ 130/80 mmHg). Emergenza ipertensiva: PAS ≥ 180 e/o PAD ≥ 120 mmHg associata a danno d'organo acuto minaccioso di vita (encefalopatia, dissezione aortica, SCA, EPA, insufficienza renale acuta).",
            "segniCardine": "Asintomatica nelle forme croniche ('killer silenzioso'); cefalea occipitale, deficit neurologici focali, dispnea acuta, dolore toracico o visivo nelle crisi ed emergenze.",
            "diagnostica": "Elettrocardiogramma (criteri di Sokolow-Lyon per ipertrofia ventricolare sinistra > 35 mm), esami ematochimici (creatinina, eGFR, sodio, potassio), esame urine per microalbuminuria, fundus oculi (stadiazione Keith-Wagener I-IV), EcoColorDoppler arterie renali se sospetto nefrovascolare.",
            "terapia": "Terapia cronica di prima linea: associazione fissa a basso dosaggio (ACEi o ARB + Calcioantagonista DHP o Tiazidico). Emergenza ipertensiva: ricovero in UTIC e farmaci EV titolabili (Labetalolo, Nitroprussiato di sodio, Urapidil, Nitroglicerina EV) con riduzione controllata della PAM di non oltre il 25% nella prima ora (eccetto nella dissezione aortica acuta dove PAS deve scendere < 120 mmHg in 20 minuti)."
        },
        "examTraps": [
            "Nell'emergenza ipertensiva la pressione NON deve mai essere abbattuta bruscamente a valori normali: un calo eccessivo oltre il 25% rischia di precipitare un ictus o un infarto renale da ipoperfusione acuta!",
            "Unica eccezione alla regola della riduzione graduale: la DISSEZIONE AORTICA ACUTA, in cui la PAS va abbattuta immediatamente sotto 120 mmHg (e FC < 60 bpm con beta-bloccanti EV) per arrestare la propagazione del flap intimale."
        ],
        "clozeTokens": [
            "danno d organo acuto",
            "riduzione controllata della PAM del 25 percento",
            "labetalolo e nitroprussiato EV",
            "dissezione aortica PAS minore di 120",
            "sokolow lyon maggiore di 35 mm"
        ],
        "linkedTools": {
            "quizIds": ["q-crd-03"],
            "oralStationId": 1,
            "calculatorId": None,
            "specialistTool": "pharma",
            "audioKey": None,
            "anatomy3dTarget": None
        },
        "fullText": get_text_range(cardio_pages, 15, 26)
    },
    {
        "id": "crd-ischemica-acuta",
        "title": "Sindromi Coronariche Acute (STEMI, NSTEMI & Angina Instabile)",
        "category": "Cardiopatia Ischemica",
        "badge": "CARDIO-MED",
        "icon": "Zap",
        "highYieldSummary": {
            "definizione": "Spettro clinico causato da instabilità e rottura o erosione di placca aterosclerotica con sovrapposizione trombotica intracoronarica acuta. STEMI: occlusione trombotica transmurale totale. NSTEMI / Angina Instabile: ischemia subendocardica da occlusione subtotale o embolizzazione distale.",
            "segniCardine": "Dolore toracico anginoso tipico oppressivo retrosternale/precordiale, irradiato a braccio sinistro, collo, mandibola o epigastrio, di durata > 20 minuti a riposo, non responsivo a nitroderivati sublinguali, associato a sintomi vegetativi (diaforesi fredda, nausea, vomito, angoscia di morte).",
            "diagnostica": "ECG 12 derivazioni entro 10 minuti dal primo contatto medico: sopraslivellamento del tratto ST al punto J in derivazioni contigue (≥ 1 mm, o ≥ 2-2.5 mm in V2-V3) o Blocco di Branca Sinistra di nuova insorgenza (criteri di Sgarbossa). Biomarcatori: Troponina cardiaca ad alta sensibilità (hs-cTnI o hs-cTnT) con curva cinetica di incremento/decremento (differenzia NSTEMI da Angina Instabile dove troponina è negativa).",
            "terapia": "STEMI: Riperfusione immediata! Coronarografia e Angioplastica Primaria (PCI) con stent medicato (DES) se tempo primo contatto-pallone ≤ 120 minuti; altrimenti Fibrinolisi EV entro 10 minuti e trasferimento. Terapia medica di supporto: ASA + inibitore P2Y12 (Ticagrelor o Prasugrel) per 12 mesi (DAPT) + anticoagulante (Eparina/Bivalirudina) + beta-bloccanti + statina ad alta intensità (Atorvastatina 80 mg)."
        },
        "examTraps": [
            "Il blocco di branca sinistra di NUOVA insorgenza in presenza di dolore toracico anginoso tipico equivale formalmente a uno STEMI ed è indicazione a coronarografia d'emergenza immediata!",
            "Nell'angina instabile i biomarcatori di miocardiocitolisi (Troponina) sono NEGATIVI: la positività anche minima della troponina con rialzo tipico trasforma la diagnosi in NSTEMI.",
            "Nei pazienti diabetici e anziani l'infarto miocardico può presentarsi in forma del tutto indolore (equivalenti anginosi: dispnea acuta isolata o sincope)."
        ],
        "clozeTokens": [
            "sopraslivellamento ST al punto J",
            "blocco di branca sinistra di nuova insorgenza",
            "tempo primo contatto pallone minore di 120 minuti",
            "troponina cardiaca ad alta sensibilita",
            "DAPT con ASA e Ticagrelor o Prasugrel",
            "criteri di Sgarbossa"
        ],
        "linkedTools": {
            "quizIds": ["q-crd-04", "q-crd-05", "q-crd-06"],
            "oralStationId": 1,
            "calculatorId": None,
            "specialistTool": "ecg",
            "audioKey": None,
            "anatomy3dTarget": "heart"
        },
        "fullText": get_text_range(cardio_pages, 27, 49)
    },
    {
        "id": "crd-scompenso",
        "title": "Scompenso Cardiaco Acuto & Cronico (HFrEF, HFmrEF, HFpEF)",
        "category": "Fisiopatologia & Terapia",
        "badge": "CARDIO-MED",
        "icon": "Heart",
        "highYieldSummary": {
            "definizione": "Sindrome clinica complessa caratterizzata da sintomi e segni tipici secondari ad anomalia strutturale o funzionale del cuore che determina elevate pressioni intracardiache o inadeguata gittata sistemica a riposo o da sforzo. Suddivisione ESC per Frazione d'Eiezione: HFrEF (ridotta ≤ 40%), HFmrEF (lievemente ridotta 41-49%), HFpEF (preservata ≥ 50%).",
            "segniCardine": "Dispnea da sforzo, ortopnea, dispnea parossistica notturna, astenia; segni di congestione sistemica: turgore venoso giugulare (TVG), reflusso epato-giugulare, epatomegalia da stasi, edemi declivi simmetrici malleolari/pretibiali; segni di congestione polmonare: rantoli crepitanti basali; reperto cardiaco: galoppo protodiastolico S3.",
            "diagnostica": "Biomarcatori natriuretici (BNP > 35 pg/ml o NT-proBNP > 125 pg/ml nelle forme croniche; cut-off per l'acuto: NT-proBNP > 300 pg/ml); Ecocardiogramma transtoracico (misura FE col metodo biplano di Simpson, volumi atriali e funzione diastolica E/e'); RX Torace (cardiomegalia, strie di Kerley B, ridistribuzione del flusso agli apici).",
            "terapia": "HFrEF: 'I 4 Pilastri Fondamentali' (Fantastic Four con riduzione provata di mortalità e ospedalizzazione): 1) ARNI (Sacubitril/Valsartan) o ACEi; 2) Beta-bloccante evidenza-based (Bisoprololo, Carvedilolo, Metoprololo succinato); 3) Antagonista Recettori Mineralcorticoidi MRA (Spironolattone o Eplerenone); 4) Inibitori SGLT2 (Dapagliflozin o Empagliflozin). Diuretici dell'ansa (Furosemide) titolati al bisogno contro la congestione. Terapia con dispositivi: ICD per profilassi morte improvvisa se FE ≤ 35% e CRT-D se QRS allargato > 130-150 ms con LBBB."
        },
        "examTraps": [
            "I diuretici dell'ansa (Furosemide) migliorano rapidamente i sintomi congestizi MA NON riducono la mortalità a lungo termine nello scompenso cardiaco a frazione d'eiezione ridotta!",
            "I 4 farmaci che hanno dimostrato riduzione della mortalità sono: ARNI/ACEi, Beta-bloccanti, MRA (Spironolattone) e SGLT2i (Dapagliflozin/Empagliflozin).",
            "Un valore normale di NT-proBNP ha un elevatissimo valore predittivo negativo: esclude quasi al 100% l'origine cardiogena della dispnea acuta in pronto soccorso."
        ],
        "clozeTokens": [
            "frazione d eiezione minore o uguale al 40 percento",
            "i 4 pilastri fantastici",
            "sacubitril valsartan ARNI",
            "inibitori SGLT2 dapagliflozin empagliflozin",
            "spironolattone ed eplerenone",
            "NT proBNP con elevato valore predittivo negativo"
        ],
        "linkedTools": {
            "quizIds": ["q-crd-07", "q-crd-08"],
            "oralStationId": 1,
            "calculatorId": None,
            "specialistTool": "flowchart",
            "audioKey": "s1-s2",
            "anatomy3dTarget": "heart"
        },
        "fullText": get_text_range(cardio_pages, 63, 80)
    },
    {
        "id": "crd-aritmie",
        "title": "Aritmologia Clinica & ECG (Fibrillazione Atriale, TV & Blocchi)",
        "category": "Elettrofisiologia",
        "badge": "CARDIO-MED",
        "icon": "Activity",
        "highYieldSummary": {
            "definizione": "Alterazioni della formazione e/o conduzione dell'impulso elettrico cardiaco. Tachiaritmie sopraventricolari (FA, Flutter, TPSV da rientro nodale), tachiaritmie ventricolari (TV monomorfe/polimorfe, Torsione di Punta, FV), bradiaritmie (malattia del nodo del seno, blocchi atrio-ventricolari BAV I-III).",
            "segniCardine": "Palpitazioni/cardiopalmo, astenia, lipotimia, sincope, arresto cardiocircolatorio. FA: polso 'completamente aritmico' (aritmia totale), deficit di polso (FC centrale auscultata > FC periferica radiale).",
            "diagnostica": "ECG standard a 12 derivazioni: FA con assenza di onde P, onde f caotiche e intervalli R-R irregolari; Flutter con onde F 'a dente di sega' a 300 bpm e conduzione AV fissa o variabile; TPSV con FC 150-220 bpm a complessi stretti regolari; TV con complessi QRS larghi > 120 ms regolari; BAV I con PR allungato > 0.20s costante; BAV II Mobitz 1 con allungamento progressivo del PR fino a un'onda P bloccata (Wenckebach); Mobitz 2 con onde P bloccate improvvisamente a intervallo PR fisso; BAV III con completa dissociazione atrio-ventricolare (onde P e QRS indipendenti).",
            "terapia": "FA: Prevenzione del tromboembolismo cerebrale con anticoagulanti orali diretti (DOAC: Apixaban, Rivaroxaban, Dabigatran, Edoxaban) calcolata sullo Score CHA2DS2-VASc (indicati se score ≥ 2 maschio, ≥ 3 femmina). Controllo della frequenza (Beta-bloccanti, Digitale) o del ritmo (Cardioversione elettrica o farmacologica con Amiodarone/Flecainide, ablazione transcatetere delle vene polmonari). TPSV acuta: manovre vagali seguite da bolo rapido di Adenosina EV. BAV avanzati (Mobitz 2 e BAV III): impianto di Pacemaker definitivo endocavitario."
        },
        "examTraps": [
            "Nel BAV di II grado Mobitz 2 il PR è costante e le onde P cadono improvvisamente: ha un elevatissimo rischio di progressione verso il BAV III ed è indicazione TASSATIVA a Pacemaker definitivo, a differenza del Mobitz 1 (Wenckebach) che è spesso benigno!",
            "Nei pazienti con FA lo score CHA2DS2-VASc include: Insufficienza cardiaca (1), Ipertensione (1), Età ≥ 75 anni (2 punti!), Diabete (1), Ictus/TIA pregresso (2 punti!), Vasculopatia (1), Età 65-74 (1), Sesso femminile (1).",
            "L'adenosina EV nelle TPSV blocca transitoriamente il nodo AV con emivita di pochi secondi: va iniettata in bolo rapidissimo seguito da flush di soluzione fisiologica."
        ],
        "clozeTokens": [
            "assenza di onde P e intervalli RR irregolari",
            "score CHA2DS2 VASc per anticoagulazione",
            "DOAC apixaban rivaroxaban dabigatran edoxaban",
            "BAV II grado Mobitz 2 indicazione a pacemaker",
            "adenosina in bolo rapido per TPSV",
            "onde F a dente di sega nel flutter"
        ],
        "linkedTools": {
            "quizIds": ["q-crd-09", "q-crd-10", "q-crd-11"],
            "oralStationId": 1,
            "calculatorId": "cha2ds2-vasc",
            "specialistTool": "ecg",
            "audioKey": "afib",
            "anatomy3dTarget": "heart"
        },
        "fullText": get_text_range(cardio_pages, 81, 166)
    }
]

# 2. CARDIOCHIRURGIA (Pagine 111 - 126 e 167 - 185 di cardio.txt)
cardiochirurgia_topics = [
    {
        "id": "cch-stenosi-aortica",
        "title": "Chirurgia della Stenosi Aortica (SAVR vs TAVI)",
        "category": "Cardiochirurgia Valvolare",
        "badge": "CARDIOCHIRURGIA",
        "icon": "Heart",
        "highYieldSummary": {
            "definizione": "Ostruzione all'efflusso ventricolare sinistro per ispessimento e calcificazione progressiva dei lembi della valvola aortica (degenerativa senile o su valvola bicuspide congenita).",
            "segniCardine": "Triade clinica classica dello scompenso avanzato: Angina da discrepanza, Sincope da sforzo e Dispnea (quando compaiono i sintomi la mortalità a 2-3 anni senza intervento è > 50%). Soffio sistolico a diamante in crescendo-decrescendo al focolaio aortico irradiato ai vasi del collo/carotidi, S2 ipofonetico o assente, polso parvus et tardus.",
            "diagnostica": "Ecocardiografia Color-Doppler transtoracica (TTE): Criteri di Stenosi Aortica Severa: 1) Area Valvolare Aortica (AVA) < 1.0 cm2 (o indicizzata < 0.6 cm2/m2); 2) Gradiente pressorio medio transmitralico > 40 mmHg; 3) Velocità di picco transvalvolare > 4.0 m/s. Score di calcificazione alla TC.",
            "terapia": "Nei pazienti sintomatici o asintomatici con disfunzione ventricolare (FE < 50%): Trattamento chirurgico convenzionale con Sostituzione Valvolare Aortica a cielo aperto (SAVR con protesi meccanica o biologica) nei pazienti giovani (< 75 anni) e a basso rischio chirurgico; Impianto Transcatetere di Valvola Aortica (TAVI per via femorale percutanea) nei pazienti anziani (≥ 75 anni) o ad alto rischio chirurgico (STS / EuroSCORE II elevato)."
        },
        "examTraps": [
            "Nella stenosi aortica severa la comparsa della sincope da sforzo ha un significato prognostico gravissimo: la sopravvivenza media senza sostituzione valvolare scende a meno di 3 anni!",
            "Il trattamento medico farmacologico nella stenosi aortica severa sintomatica è solo palliativo: i vasodilatatori sono pericolosi perché possono provocare sincope da crollo della pressione!",
            "La TAVI è ormai indicata di prima scelta dai 75 anni in su o in chiunque abbia rischio operatorio STS/EuroSCORE II intermedio-alto."
        ],
        "clozeTokens": [
            "area valvolare aortica minore di 1 cm2",
            "gradiente pressorio medio maggiore di 40 mmHg",
            "velocita di picco maggiore di 4 m al secondo",
            "triade clinica angina sincope dispnea",
            "SAVR nei giovani e TAVI negli anziani",
            "polso parvus et tardus irradiato alle carotidi"
        ],
        "linkedTools": {
            "quizIds": ["q-cch-12", "q-cch-13"],
            "oralStationId": 2,
            "calculatorId": "euroscore-2",
            "specialistTool": "flowchart",
            "audioKey": "systolic-murmur",
            "anatomy3dTarget": "heart"
        },
        "fullText": get_text_range(cardio_pages, 120, 124) + "\n\n" + get_text_range(cardio_pages, 167, 173)
    },
    {
        "id": "cch-mitralica-endocardite",
        "title": "Chirurgia Mitralica, Protesi & Endocardite Infettiva",
        "category": "Cardiochirurgia Valvolare",
        "badge": "CARDIOCHIRURGIA",
        "icon": "Heart",
        "highYieldSummary": {
            "definizione": "Patologie strutturali della valvola mitrale (stenosi reumatica, insufficienza mitralica organica da prolasso/flail o funzionale secondaria a dilatazione ventricolare) e infezione microbica dell'endocardio valvolare.",
            "segniCardine": "Insufficienza Mitralica: soffio olosistolico all'apice irradiato al cavo ascellare. Endocardite: febbre persistente non spiegata, comparsa di nuovo soffio da rigurgito, splenomegalia, lesioni cutanee emboliche/immunologiche (noduli di Osler dolorosi polpastrelli, lesioni di Janeway eritematose palmo/pianta, macchie retiniche di Roth).",
            "diagnostica": "Ecocardiogramma Transesofageo (TEE): quantificazione del rigurgito mitralico (EROA ≥ 0.40 cm2 e volume rigurgitante ≥ 60 ml definiscono l'insufficienza severa). Criteri di Duke per Endocardite: 2 Criteri Maggiori (Emocolture positive per patogeni tipici + Evidenza ecocardiografica di vegetazione intracardiaca, ascesso perivalvolare o deiscenza protesica).",
            "terapia": "Insufficienza Mitralica: Riparazione valvolare chirurgica (anuloplastica protesica + resezione di lembo) preferita alla sostituzione; MitraClip percutanea se alto rischio chirurgico; Catetere di Inoue percutaneo per stenosi mitralica pura non calcifica. Protesi Meccaniche: richiedono anticoagulazione orale a vita con Warfarin (target INR 2.5-3.5); Protesi Biologiche: indicate sopra i 65-70 anni senza anticoagulazione a lungo termine. Indicazioni chirurgiche d'urgenza nell'endocardite: insufficienza acuta con edema polmonare, ascesso perivalvolare, infezione fungina non controllata, vegetazioni mobili > 10 mm dopo episodio embolico."
        },
        "examTraps": [
            "Le protesi meccaniche NON possono essere trattate con i nuovi anticoagulanti orali DOAC: il Warfarin (Coumadin) con monitoraggio periodico dell'INR rimane l'unico farmaco approvato!",
            "Nell'endocardite infettiva l'ecocardiogramma transesofageo (TEE) è notevolmente superiore a quello transtoracico (TTE) per individuare vegetazioni piccole < 5 mm e ascessi dell'anello valvolare.",
            "La riparazione valvolare mitralica (plastica) è sempre superiore alla sostituzione perché preserva l'apparato subvalvolare cordale e mantiene la contrattilità del ventricolo sinistro."
        ],
        "clozeTokens": [
            "soffio olosistolico irradiato all ascella",
            "criteri di Duke con emocolture ed ecocardiogramma",
            "protesi meccaniche solo con Warfarin a vita",
            "riparazione valvolare superiore alla sostituzione",
            "ascesso perivalvolare indicazione chirurgica d urgenza",
            "vegetazioni mobili maggiori di 10 mm"
        ],
        "linkedTools": {
            "quizIds": ["q-cch-14", "q-cch-15"],
            "oralStationId": 2,
            "calculatorId": "euroscore-2",
            "specialistTool": "pharma",
            "audioKey": "vsd-pansystolic",
            "anatomy3dTarget": "heart"
        },
        "fullText": get_text_range(cardio_pages, 108, 119) + "\n\n" + get_text_range(cardio_pages, 95, 102)
    },
    {
        "id": "cch-cabg-aorta",
        "title": "Bypass Aorto-Coronarico (CABG) & Chirurgia dell'Aorta Toracica",
        "category": "Chirurgia Coronarica & Vascolare Maggiore",
        "badge": "CARDIOCHIRURGIA",
        "icon": "Heart",
        "highYieldSummary": {
            "definizione": "Rivascolarizzazione miocardica chirurgica mediante confezionamento di ponti vascolari e chirurgia maggiore dell'aorta ascendente/arco per aneurismi e dissezione acuta di Stanford A.",
            "segniCardine": "Ischemia miocardica complessa; nella dissezione acuta di Tipo A: dolore toracico lacerante violentissimo a 'pugnalata' migrante al dorso, asimmetria dei polsi periferici, comparsa di soffio da insufficienza aortica acuta o tamponamento cardiaco da emotampone intrapericardico.",
            "diagnostica": "Coronarografia pre-operatoria e calcolo del Syntax Score; Angio-TC toraco-addominale con mezzo di contrasto gold standard assoluto per la dissezione (evidenziazione del flap intimale che separa il vero dal falso lume).",
            "terapia": "CABG: indicazione di classe I rispetto a PCI per stenosi del Tronco Comune > 50%, malattia trivasale con coinvolgimento di IVA prossimale soprattutto nei diabetici o con disfunzione ventricolare; Condotto di scelta assoluto: Arteria Mammaria Interna Sinistra (LIMA) anastomizzata sull'arteria interventricolare anteriore (IVA) per pervietà > 90% a 10 anni, integrata da arteria radiale o vena safena. Dissezione Stanford Tipo A: emergenza cardiochirurgica assoluta a cielo aperto (procedura di Bentall con sostituzione valvolare e dell'aorta ascendente e reimpianto coronarico, o conservazione della valvola tipo David)."
        },
        "examTraps": [
            "La LIMA (Arteria Mammaria Interna Sinistra) anastomizzata sull'IVA è il gold standard della chirurgia coronarica: garantisce una pervietà a 10-15 anni nettamente superiore a qualunque vena safena!",
            "La dissezione aortica di Stanford A ha una mortalità dell'1-2% ALL'ORA nelle prime 48 ore se non operata immediatamente a cielo aperto: è una delle emergenze cardiochirurgiche più letali in assoluto!"
        ],
        "clozeTokens": [
            "LIMA anastomizzata su interventricolare anteriore",
            "stenosi tronco comune maggiore del 50 percento",
            "dissezione aortica Stanford A emergenza immediata",
            "angio TC con evidenziazione del flap intimale",
            "procedura di Bentall",
            "dolore lacerante a pugnalata migrante al dorso"
        ],
        "linkedTools": {
            "quizIds": ["q-cch-16"],
            "oralStationId": 2,
            "calculatorId": "euroscore-2",
            "specialistTool": "imaging",
            "audioKey": None,
            "anatomy3dTarget": "aorta"
        },
        "fullText": get_text_range(cardio_pages, 55, 62) + "\n\n" + get_text_range(cardio_pages, 174, 185)
    }
]

# 3. PNEUMOLOGIA MEDICA (Pagine 1 - 57 di pneumo.txt)
pneumologia_topics = [
    {
        "id": "pnm-pfr-ega",
        "title": "Semeiotica Respiratoria, PFR (Spirometria) & EGA",
        "category": "Fisiopatologia Respiratoria",
        "badge": "PNEUMO",
        "icon": "Wind",
        "highYieldSummary": {
            "definizione": "Valutazione strumentale della funzione polmonare e degli scambi gassosi mediante prove spirometriche, pletismografiche ed emogasanalisi arteriosa.",
            "segniCardine": "Dispnea, cianosi centrale (se Hb ridotta > 5 g/dl), respiro paradosso; fremito vocale tattile (FVT) aumentato negli addensamenti ed abolito nei versamenti/PNX; auscultazione: murmure vescicolare fisiologico, rumori secchi (ronchi e sibili) o umidi (rantoli crepitanti).",
            "diagnostica": "Spirometria: FEV1 (volume espiratorio forzato al 1° secondo), FVC (capacità vitale forzata); Indice di Tiffeneau (FEV1/FVC) < 70% definisce il DEFICIT OSTRUTTIVO; Test di reversibilità con Salbutamolo positivo se FEV1 aumenta di > 12% E > 200 ml rispetto al basale. Pletismografia: misura il Volume Residuo (VR) e la Capacità Polmonare Totale (TLC); TLC < 80% definisce il DEFICIT RESTRITTIVO. DLCO: ridotta in enfisema e fibrosi, normale nell'asma. Emogasanalisi (EGA): pH normale 7.35-7.45, PaO2 normale 80-100 mmHg, PaCO2 normale 35-45 mmHg, HCO3- 22-26 mmol/L; Insufficienza Respiratoria Tipo 1 (ipossiemica: PaO2 < 60 mmHg con PaCO2 normale/bassa) vs Tipo 2 (ipercapnica: PaCO2 > 45 mmHg).",
            "terapia": "Ossigenoterapia mirata: nei pazienti normocapnici target SaO2 94-98%; nei pazienti con ipercapnia cronica (BPCO avanzata) target SaO2 tassativo 88-92% (per evitare di spegnere il drive respiratorio ipossico e provocare narcosi da CO2)."
        },
        "examTraps": [
            "Il test di reversibilità con broncodilatatore (Salbutamolo 400 mcg) richiede entrambi i criteri: incremento di FEV1 di almeno il 12% E di almeno 200 ml rispetto al valore pre-broncodilatatore!",
            "Un indice di Tiffeneau < 70% diagnostica un deficit ostruttivo MA non dice la gravità: la severità si calcola esclusivamente sulla percentuale del FEV1 post-broncodilatatore rispetto al teorico!",
            "Nella BPCO grave somministrare ossigeno ad alti flussi per portare la saturazione al 100% è un errore gravissimo che può mandare il paziente in coma ipercapnico da soppressione del drive ipossico."
        ],
        "clozeTokens": [
            "indice di Tiffeneau minore del 70 percento",
            "test reversibilita aumento 12 percento e 200 ml",
            "deficit restrittivo con TLC minore di 80 percento",
            "DLCO ridotta in enfisema e fibrosi",
            "target SaO2 tassativo 88 92 percento nella BPCO",
            "insufficienza respiratoria tipo 1 e tipo 2"
        ],
        "linkedTools": {
            "quizIds": ["q-pnm-17", "q-pnm-18"],
            "oralStationId": 3,
            "calculatorId": None,
            "specialistTool": "pfr",
            "audioKey": "wheezing",
            "anatomy3dTarget": "lungs"
        },
        "fullText": get_text_range(pneumo_pages, 1, 9) + "\n\n" + get_text_range(pneumo_pages, 48, 56)
    },
    {
        "id": "pnm-asma-bpco",
        "title": "Asma Bronchiale, BPCO & Infezioni Polmonari (CAP)",
        "category": "Pneumologia Clinica",
        "badge": "PNEUMO",
        "icon": "Wind",
        "highYieldSummary": {
            "definizione": "Patologie croniche delle vie aeree: Asma (infiammazione cronica variabile, iperreattività bronchiale ed ostruzione reversibile) e BPCO (ostruzione bronchiale persistente non completamente reversibile correlata al fumo con enfisema e bronchite cronica). Polmonite acquisita in comunità (CAP): infezione acuta del parenchima polmonare.",
            "segniCardine": "Asma: tosse secca, dispnea accessionale notturna/mattutina, respiro sibilante ('fischi nel petto'). BPCO: tosse produttiva cronica, dispnea da sforzo progressiva, espirazione prolungata, torace a botte (Pink Puffer enfisematoso magro con dispnea vs Blue Bloater bronchitico pletorico cianotico edematoso). CAP: febbre alta con brivido, tosse con espettorato rugginoso, dolore toracico pleuritico trafittivo, rantoli crepitanti inspiratori.",
            "diagnostica": "Asma: Test di provocazione bronchiale alla Metacolina (positivo se calo FEV1 ≥ 20% a concentrazioni PD20 < 16 mg/ml). BPCO: Spirometria post-broncodilatatore con Tiffeneau < 70%; classificazione GOLD (stadi 1-4 per FEV1 e gruppi A, B, E per sintomi e riacutizzazioni). CAP: RX Torace con addensamento lobare e broncogramma aereo; Score di gravità CURB-65 per indicazione a ricovero.",
            "terapia": "Asma (Step GINA): terapia di fondo con ICS-Formoterolo al bisogno (Step 1-2) o continuativo (Step 3-5), LAMA, biologici anti-IgE (Omalizumab) o anti-IL5 (Mepolizumab). BPCO: LAMA (Tiotropio) + LABA; tripla terapia inalatoria (LAMA + LABA + ICS) nei fenotipi con eosinofili ematici ≥ 300/µl o riacutizzatori frequenti. CAP: terapia antibiotica empirica con Amoxicillina/Clavulanato + Macrolide (Azitromicina) o fluorochinolone respiratorio (Levofloxacina)."
        },
        "examTraps": [
            "Nella CAP atipica da Mycoplasma o Legionella l'RX torace mostra infiltrati interstiziali reticolo-nodulari che risparmiano l'interstizio alveolare puro e creano una marcata discrepanza tra obiettività povera e radiologia marcata!",
            "Lo score CURB-65 valuta: Confusione (1), Urea > 7 mmol/L (1), Frequenza respiratoria ≥ 30/min (1), Pressione < 90/60 mmHg (1), Età ≥ 65 anni (1). Se score ≥ 2 è indicato ricovero ospedaliero!",
            "Nel trattamento della BPCO gli steroidi inalatori (ICS) NON vanno dati in monoterapia: aumentano il rischio di polmonite e sono indicati solo in combinazione tripla nei pazienti con frequenti riacutizzazioni ed eosinofilia."
        ],
        "clozeTokens": [
            "test alla metacolina con calo FEV1 maggiore del 20 percento",
            "score CURB 65 per indicazione al ricovero",
            "tripla terapia con LAMA LABA ed ICS",
            "legionella con iponatriemia ed antigene urinario",
            "broncogramma aereo nell addensamento lobare",
            "discrepanza tra clinica e radiologia nella CAP atipica"
        ],
        "linkedTools": {
            "quizIds": ["q-pnm-19", "q-pnm-20", "q-pnm-21"],
            "oralStationId": 3,
            "calculatorId": "curb-65",
            "specialistTool": "pharma",
            "audioKey": "crackles",
            "anatomy3dTarget": "lungs"
        },
        "fullText": get_text_range(pneumo_pages, 10, 19) + "\n\n" + get_text_range(pneumo_pages, 37, 47)
    },
    {
        "id": "pnm-tbc-sarcoidosi",
        "title": "Tubercolosi (TBC), Sarcoidosi & Interstiziopatie (IPF)",
        "category": "Malattie Granulomatose & Interstiziali",
        "badge": "PNEUMO",
        "icon": "Wind",
        "highYieldSummary": {
            "definizione": "Patologie granulomatose e fibrosanti polmonari: Tubercolosi (infezione da Mycobacterium tuberculosis), Sarcoidosi (malattia multisistemica con granulomi non caseosi) e Fibrosi Polmonare Idiopatica (pneumopatia fibrosante progressiva ad eziologia ignota).",
            "segniCardine": "TBC: tosse persistente > 3 settimane, emottisi, febbre serotina, sudorazioni notturne profuse, calo ponderale. Sarcoidosi: tosse stizzosa, Sindrome di Löfgren (eritema nodoso pretibiale, artrite caviglie, adenopatia ilare bilaterale); Sindrome di Heerfordt (uveite, parotite, paralisi facciale del VII). IPF: dispnea da sforzo ingravescente, tosse secca cronica, dita a bacchetta di tamburo (ippocratismo digitale), rantoli inspiratori crepitanti 'a velcro' tipo strappo di cellophane alle basi.",
            "diagnostica": "TBC: microscopia diretta Ziehl-Neelsen su espettorato (3 campioni), coltura Loewenstein-Jensen, test molecolare GeneXpert PCR, test Mantoux e IGRA Quantiferon. Sarcoidosi: RX Torace con stadi di Scadding: Stadio 0 (normale), Stadio I (linfoadenopatia ilare bilaterale BHL isolata), Stadio II (BHL + infiltrati polmonari), Stadio III (infiltrati polmonari isolati senza BHL), Stadio IV (fibrosi polmonare irreversibile); dosaggio ACE sierico elevato e BAL con rapporto CD4/CD8 > 3.5. IPF: HRCT torace con pattern UIP tipico (honeycombing subpleurico e basale, reticolazioni, bronchiectasie da trazione) senza necessità di biopsia.",
            "terapia": "TBC: Schema standard 'RIPE' (Rifampicina, Isoniazide, Pirazinamide, Etambutolo per 2 mesi; seguiti da Rifampicina + Isoniazide per altri 4 mesi). Sarcoidosi: forme asintomatiche Stadio I solo monitoraggio (risoluzione spontanea nell'80%); forme sintomatiche o polmonari avanzate: Corticosteroidi sistemici (Prednisone 0.5-1 mg/kg). IPF: Farmaci antifibrotici orali (Nintedanib o Pirfenidone) che rallentano la progressione del declino di FVC."
        },
        "examTraps": [
            "Cosa si intende per STADIO ZERO della Sarcoidosi? Presenza di manifestazioni cliniche extra-toraciche (es. eritema nodoso, uveite) in ASSENZA di anomalie alla radiografia del torace!",
            "I granulomi della Sarcoidosi sono NON CASEOSI (privi di necrosi centrale), a differenza di quelli della Tubercolosi che presentano necrosi caseosa tipica!",
            "L'etambutolo nella terapia della TBC richiede monitoraggio oftalmologico per il rischio di neurite ottica retrobulbare con alterazione della visione dei colori (rosso-verde)."
        ],
        "clozeTokens": [
            "stadio zero della sarcoidosi RX torace normale",
            "granulomi non caseosi nella sarcoidosi",
            "sindrome di Lofgren eritema nodoso e BHL",
            "terapia RIPE rifampicina isoniazide pirazinamide etambutolo",
            "rantoli crepitanti a velcro nella fibrosi polmonare",
            "pattern UIP alla HRCT con honeycombing",
            "farmaci antifibrotici nintedanib e pirfenidone"
        ],
        "linkedTools": {
            "quizIds": ["q-pnm-22", "q-pnm-23", "q-pnm-24"],
            "oralStationId": 3,
            "calculatorId": None,
            "specialistTool": "imaging",
            "audioKey": "crackles",
            "anatomy3dTarget": "lungs"
        },
        "fullText": get_text_range(pneumo_pages, 20, 36)
    }
]

# 4. CHIRURGIA TORACICA (Pagine 58 - 89 di pneumo.txt)
toracica_topics = [
    {
        "id": "cht-neoplasie-tnm",
        "title": "Tumori del Polmone, Stadiazione TNM & Chirurgia",
        "category": "Oncologia Chirurgica Toracica",
        "badge": "TORACICA",
        "icon": "Layers",
        "highYieldSummary": {
            "definizione": "Neoplasie polmonari maligne: Carcinoma Non a Piccole Cellule (NSCLC: Adenocarcinoma 40%, Squamoso/Epidermoide 30%, Grandi Cellule 10%) e Carcinoma a Piccole Cellule (SCLC / Microcitoma 15%, neuroendocrino e metastatico precocemente).",
            "segniCardine": "Tosse cronica di nuova insorgenza o modificata, emottisi, calo ponderale, dispnea; sindromi da invasione locoregionale: Sindrome della Vena Cava Superiore (edema a mantellina, turgore giugulare), Sindrome di Pancoast (tumore del solco superiore con distruzione I-II costa, dolore all'arto superiore e Sindrome di Horner: miosi, ptosi, enoftalmo, anidrosi omolaterale per lesione della catena simpatica stellata).",
            "diagnostica": "TC torace con mdc + PET-TC total body per stadiazione metabolica. Biopsia tissutale (broncoscopia con EBUS-TBNA per stadiazione linfonodi mediastinici N2/N3; agobiopsia percutanea TC-guidata). Profilazione molecolare obbligatoria (EGFR, ALK, ROS1, PD-L1). Stadiazione TNM 8ª edizione: T (T1 ≤ 3 cm, T2 3-5 cm, T3 5-7 cm o invasione parete/nervo frenico, T4 > 7 cm o invasione mediastino/cuore/grossi vasi/carena/diaframma); N (N0 linfonodi liberi, N1 ilari omolaterali, N2 mediastinici omolaterali o sottocarenali, N3 mediastinici controlaterali o sovraclaveari); M (M1a pleura/versamento, M1b metastasi extra-toracica singola, M1c multiple).",
            "terapia": "Stadi iniziali resecabili (Stadio I, II, alcuni IIIA N1): Lobectomia polmonare con linfoadenectomia mediastinica radicale (VATS mini-invasiva video-assistita di prima scelta o RATS robotica vs toracotomia). Criteri di operabilità funzionale: FEV1 post-operatorio predetto (ppo-FEV1) e DLCO post-operatoria predetta (ppo-DLCO) devono essere > 30-40% del valore teorico. Stadi localmente avanzati (N2 non resecabile, IIIB, IIIC): Chemio-immunoterapia o chemioradioterapia concomitante seguita da immunoterapia (Durvalumab). Stadio IV metastatico: terapia sistemica guidata dalle alterazioni molecolari (Inibitori tirosin-chinasici TKI anti-EGFR Osimertinib, anti-ALK Alectinib, o Immunoterapia anti-PD1 Pembrolizumab)."
        },
        "examTraps": [
            "La presenza di linfonodi mediastinici N2 controlaterali o sovraclaveari N3 rende il tumore polmonare NON OPERABILE chirurgicamente: il trattamento è solo radio-chemioterapico e immunoterapico!",
            "Nella valutazione pre-operatoria per lobectomia o pneumonectomia il ppo-FEV1 (FEV1 post-operatorio predetto) deve essere TASSATIVAMENTE superiore al 30-40% del valore teorico per evitare insufficienza respiratoria fatale post-resezione!",
            "La sindrome di Pancoast provoca la sindrome di Bernard-Horner omolaterale per compressione e infiltrazione del ganglio stellato simpatico cervicale: la triade è miosi, ptosi ed enoftalmo con anidrosi facciale."
        ],
        "clozeTokens": [
            "sindrome di Horner con miosi ptosi enoftalmo",
            "sindrome di Pancoast per tumore solco superiore",
            "stadiazione linfonodi N2 omolaterali ed N3 controlaterali",
            "criteri operabilita funzionale ppoFEV1 maggiore del 30 percento",
            "lobectomia VATS con linfoadenectomia radicale",
            "sindrome vena cava superiore con edema a mantellina"
        ],
        "linkedTools": {
            "quizIds": ["q-cht-25", "q-cht-26"],
            "oralStationId": 4,
            "calculatorId": None,
            "specialistTool": "tnm",
            "audioKey": None,
            "anatomy3dTarget": "lungs"
        },
        "fullText": get_text_range(pneumo_pages, 58, 72)
    },
    {
        "id": "cht-pleura-pnx",
        "title": "Patologia della Pleura, Criteri di Light & Pneumotorace (PNX)",
        "category": "Chirurgia Toracica d'Urgenza",
        "badge": "TORACICA",
        "icon": "Layers",
        "highYieldSummary": {
            "definizione": "Affezioni dello spazio pleurico: Versamento pleurico (accumulo patologico di liquido pleurico trasudatizio o essudatizio) e Pneumotorace (PNX: presenza di aria nel cavo pleurico con collabimento del parenchima polmonare).",
            "segniCardine": "Versamento: dispnea, dolore pleuritico che regredisce all'aumentare della raccolta liquida, FVT abolito, ottusità plessica basale con linea parabolica di Damoiseau-Ellis, murmure vescicolare assente. PNX: dolore toracico trafittivo improvviso 'a pugnalata' monolaterale esacerbato dagli atti respiratori, dispnea acuta, FVT abolito, iperfonesi timpanica plessica, silenzio respiratorio omolaterale; PNX Iperteso: ipotensione, turgore giugulare, tachicardia marcata, deviazione controlaterale della trachea.",
            "diagnostica": "Toracentesi diagnostica con analisi del liquido pleurico: **Criteri di Light** (differenziano Essudato da Trasudato; basta 1 solo criterio per definire un ESSUDATO): 1) Rapporto Proteine pleura / Proteine siero > 0.5; 2) Rapporto LDH pleura / LDH siero > 0.6; 3) LDH pleura > 2/3 del limite normale superiore del siero. Empiema pleurico definito da pus franco o liquido torbido con pH < 7.20 e glucosio < 40 mg/dl. PNX: RX Torace in espirazione o TC (iperdiafania con visualizzazione della linea sottile della pleura viscerale che delimita il polmone collabito).",
            "terapia": "Versamento pleurico: toracentesi evacuativa; Empiema pleurico: posizionamento TASSATIVO di tubo di drenaggio toracico di grosso calibro collegato a valvola ad acqua (Bulau) e toilette chirurgica videotoracoscopica (VATS). PNX Spontaneo Primitivo piccolo (< 2 cm e pz asintomatico): osservazione e ossigenoterapia; PNX grande (> 2 cm o sintomatico): drenaggio toracico nel **triangolo di sicurezza** (V spazio intercostale linea ascellare media). PNX Iperteso: **Emergenza Medica Immediata!** Decompressione d'urgenza con agocannula di grosso calibro (14-16G) inserita nel II spazio intercostale linea emiclaveare, seguita immediatamente dal posizionamento di tubo di drenaggio toracico."
        },
        "examTraps": [
            "Nel Pneumotorace Iperteso l'RX torace è CONTROINDICATA prima del trattamento: è una diagnosi puramente clinica d'emergenza in cui attendere la lastra può portare all'arresto cardiaco per shock ostruttivo!",
            "I Criteri di Light definiscono un ESSUDATO quando è presente anche UNO SOLO dei 3 criteri: proteine pleura/siero > 0.5, LDH pleura/siero > 0.6, o LDH pleurico > 2/3 del normale!",
            "Un liquido pleurico con pH < 7.20 in corso di polmonite (versamento parapneumonico complicato / empiema) impone TASSATIVAMENTE il posizionamento immediato di tubo di drenaggio pleurico, la sola terapia antibiotica non è sufficiente!"
        ],
        "clozeTokens": [
            "criteri di Light rapporto proteine pleura siero maggiore 0.5",
            "rapporto LDH pleura siero maggiore 0.6",
            "pneumotorace iperteso decompressione immediata con ago nel II spazio",
            "triangolo di sicurezza V spazio linea ascellare media",
            "pH minore di 7.20 indicazione immediata a drenaggio pleurico",
            "fremito vocale tattile abolito nel versamento e nel PNX"
        ],
        "linkedTools": {
            "quizIds": ["q-cht-27", "q-cht-28"],
            "oralStationId": 4,
            "calculatorId": "light-criteria",
            "specialistTool": "imaging",
            "audioKey": None,
            "anatomy3dTarget": "lungs"
        },
        "fullText": get_text_range(pneumo_pages, 73, 89)
    }
]

# 5. CHIRURGIA VASCOLARE (Pagine 1 - 32 di vascolare.txt)
vascolare_topics = [
    {
        "id": "vsc-aaa",
        "title": "Aneurismi Aorta Addominale (AAA) & Classificazione Endoleak",
        "category": "Chirurgia Aortica & Endovascolare",
        "badge": "VASCOLARE",
        "icon": "Activity",
        "highYieldSummary": {
            "definizione": "Dilatazione permanente e localizzata dell'aorta addominale con diametro trasverso ≥ 30 mm (oltre il 50% del diametro normale). Sede sottorenale nel 90-95% dei casi. Rischio di rottura spontanea correlato alla legge di Laplace (tensione = pressione × raggio).",
            "segniCardine": "Totalmente asintomatico nella grande maggioranza dei casi (riscontro accidentale all'ecografia); massa addominale pulsante espansibile non dolente alla palpazione profonda ombelicale. Triade della rottura acuta: dolore addominale/lombare violento improvviso, massa addominale pulsante e shock ipovolemico/emorragico grave con ipotensione.",
            "diagnostica": "Ecografia dell'aorta addominale (gold standard per screening e follow-up delle dimensioni); Angio-TC dell'aorta toraco-addominale con mdc (esame pre-operatorio indispensabile per pianificare la riparazione chirurgica, valutare il colletto aortico e l'estensione alle iliache).",
            "terapia": "Indicazioni alla riparazione chirurgica/endovascolare: diametro trasverso ≥ 5.5 cm nell'uomo (≥ 5.0 cm nella donna), tasso di accrescimento rapido > 1.0 cm/anno (> 0.5 cm in 6 mesi), o presenza di sintomi (dolore lombare o addominale = imminente rottura). Tecniche: 1) Riparazione a cielo aperto (Open Repair con clampaggio aortico e sostituzione protesica in Dacron lineare o biforcata); 2) Riparazione endovascolare (EVAR mediante rilascio percutaneo di endoprotesi coperta per via femorale bilaterale)."
        },
        "examTraps": [
            "Nella sorveglianza post-EVAR gli Endoleak di Tipo I (mancato sigillo alle estremità prossimale o distale) e di Tipo III (disconnessione o rottura strutturale tra i moduli dell'endoprotesi) sono EMERGENZE che richiedono trattamento immediato per elevato rischio di rottura aortica!",
            "L'Endoleak di Tipo II (rifornimento retrogrado da arterie lombari o arteria mesenterica inferiore) è il più frequente in assoluto e inizialmente si monitora nel tempo perché spesso si trombizza spontaneamente.",
            "L'aneurisma popliteo è fortemente associato all'AAA (nel 50% dei pz con aneurisma popliteo è presente anche un AAA): ha soglia chirurgica di 2 cm e la sua complicanza tipica non è la rottura ma la trombosi acuta con embolizzazione periferica (Blue Toe Syndrome)."
        ],
        "clozeTokens": [
            "diametro maggiore o uguale a 5.5 cm nell uomo",
            "legge di Laplace tensione pressione raggio",
            "EVAR riparazione endovascolare",
            "endoleak di tipo I mancato sigillo al colletto",
            "endoleak di tipo II rifornimento retrogrado da lombari",
            "aneurisma popliteo soglia chirurgica 2 cm e blue toe syndrome"
        ],
        "linkedTools": {
            "quizIds": ["q-vsc-29", "q-vsc-30"],
            "oralStationId": 5,
            "calculatorId": None,
            "specialistTool": "imaging",
            "audioKey": None,
            "anatomy3dTarget": "aorta"
        },
        "fullText": get_text_range(vascolare_pages, 1, 7)
    },
    {
        "id": "vsc-aocp-ischemia",
        "title": "AOCP (Leriche-Fontaine & ABI) & Ischemia Acuta (Le 6 P & Fogarty)",
        "category": "Arteriopatie Periferiche",
        "badge": "VASCOLARE",
        "icon": "Activity",
        "highYieldSummary": {
            "definizione": "Patologie arteriose ostruttive degli arti inferiori: AOCP cronica (stenosi aterosclerotiche progressive dell'asse aorto-iliaco e femoro-popliteo-tibiale) ed Ischemia Acuta d'Arto (interruzione improvvisa della perfusione da embolia cardiogena o trombosi locale).",
            "segniCardine": "AOCP: **Stadiazione di Leriche-Fontaine**: Stadio I (asintomatico con deficit di polsi); Stadio II (Claudicatio intermittens: IIa marcia libera > 200 m, IIb marcia < 200 m); Stadio III (Dolore ischemico continuo a riposo, esacerbato da clino e migliorato a gamba declive); Stadio IV (Lesioni trofiche, ulcere ischemiche e gangrena). Ischemia Acuta: Sindrome drammatica delle **'6 P'**: 1. Pain (dolore lancinante); 2. Pallor (pallore cutaneo cereo); 3. Pulselessness (assenza di polsi a valle); 4. Paresthesia (deficit sensitivo precoce); 5. Paralysis (deficit motorio delle dita/piede: segno di gravità estrema); 6. Poikilothermia (arto ghiacciato alla palpazione).",
            "diagnostica": "AOCP: **Ankle-Brachial Index (ABI)**: rapporto tra PAS alla caviglia e PAS omerale: 0.91-1.30 Normale; 0.70-0.90 Ostruzione lieve; 0.40-0.70 Ostruzione moderata (Stadio II); < 0.40 Arteriopatia severa / Ischemia Critica (Stadi III-IV con alto rischio di perdita d'arto); > 1.40 Arterie rigide calcificate non comprimibili (sclerosi di Mönckeberg nel diabetico). EcoColorDoppler arterioso ed Angio-TC. Ischemia acuta: diagnosi clinica immediata.",
            "terapia": "AOCP: Terapia medica (statine, cardioaspirina o clopidogrel, cilostazolo, cammino controllato); Rivascolarizzazione endovascolare (angioplastica PTA e stent) o chirurgica con Bypass (femoro-popliteo o femoro-distale) indicata nello Stadio IIb invalidante e obbligatoria negli Stadi III e IV per salvataggio d'arto. Ischemia Acuta: **Emergenza Chirurgica Immediata!** Bolo di eparina sodica EV (5000 UI) immediato + **Embolectomia con Catetere a palloncino di Fogarty** per arteriotomia femorale o poplitea entro 4-6 ore."
        },
        "examTraps": [
            "Un indice ABI > 1.40 NON significa che le arterie siano perfettamente pervie: indica arterie calcificate non comprimibili (sclerosi della media di Mönckeberg tipica dei pazienti diabetici ed uremici) e richiede la misurazione della pressione all'alluce (Toe-Brachial Index)!",
            "Nell'ischemia acuta d'arto la comparsa della PARALISI motoria (una delle 6P) è un segno di sofferenza ischemica muscolare avanzata gravissima: superate le 6 ore il danno diventa irreversibile!",
            "La sindrome di Leriche è caratterizzata dalla triade: claudicatio bilaterale a natiche e cosce, assenza dei polsi femorali e disfunzione erettile/impotenza nel maschio per occlusione della biforcazione aorto-iliaca."
        ],
        "clozeTokens": [
            "stadiazione di Leriche Fontaine stadi I IV",
            "indice ABI minore di 0.90 patologico e minore di 0.40 ischemia critica",
            "sclerosi di Monckeberg con ABI maggiore di 1.40",
            "le 6 P pain pallor pulselessness paresthesia paralysis poikilothermia",
            "embolectomia d urgenza con catetere a palloncino di Fogarty",
            "bolo di eparina 5000 UI immediato"
        ],
        "linkedTools": {
            "quizIds": ["q-vsc-31", "q-vsc-32"],
            "oralStationId": 5,
            "calculatorId": None,
            "specialistTool": "flowchart",
            "audioKey": None,
            "anatomy3dTarget": "aorta"
        },
        "fullText": get_text_range(vascolare_pages, 8, 25)
    },
    {
        "id": "vsc-carotidi-flebologia",
        "title": "Stenosi Carotidea (NASCET/TEA), Furto Succlavia & TVP",
        "category": "Tronchi Sovraortici & Sistema Venoso",
        "badge": "VASCOLARE",
        "icon": "Activity",
        "highYieldSummary": {
            "definizione": "Patologie carotidee e venose: Stenosi della biforcazione carotidea interna (principale causa vascolare di TIA e ictus ischemico), Sindrome da furto della succlavia e patologia venosa profonda (TVP ed insufficienza venosa cronica).",
            "segniCardine": "Stenosi Carotidea: TIA con amaurosi fugace monoculare transitoria ('una tenda che cala sull'occhio'), emiparesi o emiipoestesia controlaterale facio-brachio-crurale, afasia di Broca (se emisfero dominante sinistro). Furto della succlavia: vertigini, atassia e diplopia scatenate dal lavoro dell'arto superiore omolaterale. TVP: edema monolaterale asimmetrico dell'arto inferiore, calore, dolore al polpaccio esacerbato dalla dorsiflessione passiva del piede (**Segno di Homans**). Insufficienza venosa: vene varicose, edema serotino, iperpigmentazione perimalleolare, prova di Trendelenburg positiva.",
            "diagnostica": "Carotidi: EcoColorDoppler TSA (criteri NASCET basati sulla velocità di picco sistolico PSV e rapporto ICA/CCA) + Angio-TC dei vasi del collo per pianificazione operatoria. TVP: EcoColorDoppler con CUS (Compression Ultrasound: mancata comprimibilità della vena); D-dimero ad alto valore predittivo negativo; Score di Wells per TVP.",
            "terapia": "Carotidi: **Tromboendoarteriectomia Carotidea (TEA)** indicata in: 1) Pazienti Sintomatici (TIA o ictus negli ultimi 6 mesi) con stenosi 70-99% (massimo beneficio) o 50-69% se rischio chirurgico < 6%; 2) Pazienti Asintomatici con stenosi 60-99% se aspettativa di vita > 5 anni e rischio chirurgico < 3%. L'occlusione al 100% è CONTROINDICAZIONE alla TEA. Stenting carotideo (CAS) riservato a colli ostili o ri-stenosi. TVP: Terapia anticoagulante immediata con Eparina a basso peso molecolare (EBPM) seguita da DOAC orali (Rivaroxaban, Apixaban) per almeno 3-6 mesi per prevenire la letale complicanza dell'Embolia Polmonare (EP)."
        },
        "examTraps": [
            "Nella stenosi carotidea l'occlusione totale al 100% della carotide interna è una CONTROINDICAZIONE TASSATIVA alla chirurgia (TEA): non si può disobstruire un vaso trombizzato cronicamente fino al poligono di Willis e il tentativo provoca emorragia cerebrale massiva da iperafflusso!",
            "Nella sindrome da furto della succlavia il sintomo neurologico più frequente in assoluto sono le VERTIGINI da ipoperfusione vertebro-basilare quando il braccio fa sforzo!",
            "Nel triangolo di Scarpa la vena femorale comune decorre MEDIALMENTE rispetto all'arteria femorale comune (regola mnemotecnica NAV da laterale a mediale: Nervo, Arteria, Vena)!",
            "La manovra di Trendelenburg per le varici safeniche prevede di svuotare prima le vene sollevando l'arto a paziente sdraiato (clinostatismo), posizionare il laccio e POI far alzare il paziente in ortostatismo."
        ],
        "clozeTokens": [
            "criteri NASCET per TEA carotidea",
            "stenosi 70 99 percento sintomatica massima indicazione",
            "occlusione al 100 percento controindicazione alla TEA",
            "furto della succlavia con vertigini da sforzo del braccio",
            "segno di Homans nella TVP",
            "vena femorale mediale ad arteria nel triangolo di Scarpa",
            "manovra di Trendelenburg prima clino e poi orto"
        ],
        "linkedTools": {
            "quizIds": ["q-vsc-33", "q-vsc-34"],
            "oralStationId": 5,
            "calculatorId": "wells-dvt",
            "specialistTool": "imaging",
            "audioKey": None,
            "anatomy3dTarget": "aorta"
        },
        "fullText": get_text_range(vascolare_pages, 26, 32)
    }
]

# Assemblaggio delle 5 Discipline Ufficiali
modules = [
    {
        "id": "cardio-medica",
        "name": "Cardiologia Medica",
        "badge": "CARDIO-MED",
        "color": "rose",
        "icon": "Heart",
        "description": "Semeiotica cardiaca, ipertensione ed emergenze, sindromi coronariche acute (STEMI/NSTEMI), scompenso cardiaco HFrEF e HFpEF, miopericarditi, aritmologia clinica ed ECG.",
        "topics": cardio_medica_topics
    },
    {
        "id": "cardiochirurgia",
        "name": "Cardiochirurgia",
        "badge": "CARDIOCHIRURGIA",
        "color": "red",
        "icon": "Heart",
        "description": "Chirurgia valvolare aortica (SAVR vs TAVI), riparazione e sostituzione mitralica, protesi meccaniche vs biologiche, bypass aorto-coronarico (CABG) e chirurgia dell'aorta toracica.",
        "topics": cardiochirurgia_topics
    },
    {
        "id": "pneumologia",
        "name": "Pneumologia",
        "badge": "PNEUMO",
        "color": "cyan",
        "icon": "Wind",
        "description": "Semeiotica respiratoria, PFR (Spirometria, Tiffeneau, reversibilità e volumi), emogasanalisi (EGA), asma bronchiale, BPCO, polmoniti (CAP/HAP), tubercolosi e sarcoidosi.",
        "topics": pneumologia_topics
    },
    {
        "id": "chirurgia-toracica",
        "name": "Chirurgia Toracica",
        "badge": "TORACICA",
        "color": "emerald",
        "icon": "Layers",
        "description": "Neoplasie polmonari maligne (NSCLC/SCLC), biomarker e stadiazione TNM 8ª, operabilità funzionale (ppo-FEV1), versamento pleurico (Criteri di Light) e pneumotorace (PNX).",
        "topics": toracica_topics
    },
    {
        "id": "chirurgia-vascolare",
        "name": "Chirurgia Vascolare",
        "badge": "VASCOLARE",
        "color": "amber",
        "icon": "Activity",
        "description": "Aneurismi aorta addominale (AAA & EVAR), AOCP (Leriche-Fontaine & ABI), ischemia acuta d'arto (6P & Fogarty), stenosi carotidea (NASCET & TEA), furto succlavia e TVP.",
        "topics": vascolare_topics
    }
]

total_chars = sum(len(t['fullText']) for m in modules for t in m['topics'])
total_topics = sum(len(m['topics']) for m in modules)

print(f"\n=======================================================")
print(f"COMPILAZIONE COMPLETATA CON SUCCESSO!")
print(f"Discipline: {len(modules)}")
print(f"Capitoli Totali: {total_topics}")
print(f"Caratteri totali testo integrale estratto: {total_chars}")
print(f"=======================================================")

output_path = os.path.join(SRC_DATA, "theory.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump({"modules": modules}, f, ensure_ascii=False, indent=2)

print(f"Salvato con successo in {output_path}")
