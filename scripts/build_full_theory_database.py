import json
import os

print("Building complete encyclopedic 5-branch theory database...")

BASE_DIR = "/home/luca/cardio-thoracic-medterminal"
SRC_DATA = os.path.join(BASE_DIR, "src", "data")

# Load questions to map links
with open(os.path.join(SRC_DATA, "questions.json"), "r", encoding="utf-8") as f:
    questions = json.load(f)

# 5 Main Branches
branches = [
    {
        "id": "cardio-medica",
        "name": "Cardiologia Medica",
        "badge": "CARDIO-MED",
        "color": "rose",
        "icon": "Heart",
        "description": "Semeiotica cardiaca, diagnostica strumentale, aritmie ed ECG, sindromi coronariche, scompenso cardiaco, ipertensione, miocarditi e farmacologia.",
        "topics": [
            {
                "id": "crd-semeiotica",
                "title": "Semeiotica Cardiovascolare, Toni, Soffi & Polsi",
                "category": "Semeiotica & Fisiopatologia",
                "anatomy3dTarget": "heart-valves",
                "audioKey": "s1-s2",
                "videoEmbed": "aR_c2v-p5r0",
                "highYieldSummary": {
                    "definizione": "Valutazione clinica dell'attività cardiaca: auscultazione dei 4 focolai (Aortico, Polmonare, Tricuspidale, Mitralico) + focolaio di Erb; analisi dei toni, clicks, soffi e caratterizzazione dei polsi arteriosi e venosi.",
                    "segniCardine": "S1 (chiusura AV), S2 (chiusura semilunari Ao-Po), S3 (riempimento rapido ventricolare passivo protodiastolico), S4 (contrazione atriale attiva telediastolica contro ventricolo rigido).",
                    "diagnostica": "Auscultazione fonocardiografica, polso parvus et tardus (stenosi aortica), polso scoccante di Corrigan (insufficienza aortica), polso paradosso (tamponamento cardiaco).",
                    "terapia": "Orientamento differenziale preliminare per valvulopatie, pericardite, tamponamento e scompenso."
                },
                "clozeTokens": [
                    "chiusura valvole atrio-ventricolari",
                    "riempimento ventricolare rapido protodiastolico",
                    "contrazione atriale attiva telediastolica",
                    "parvus et tardus",
                    "celere e scoccante di Corrigan",
                    "polso paradosso nel tamponamento"
                ],
                "examTraps": [
                    "S1 aumenta nella stenosi mitralica per elevato gradiente pressorio AV che proietta i lembi mobili con violenza.",
                    "S3 è fisiologico nei giovani < 30 anni e gravidanza, ma patologico (galoppo da scompenso) sopra i 40 anni.",
                    "Il polso paradosso NON è una variazione di frequenza cardiaca, ma una caduta anomala della pressione sistolica > 10 mmHg in inspirazione (tamponamento cardiaco)."
                ],
                "fullText": """### TONI CARDIACI E AUSCULTAZIONE (Dispense 2FAST)
#### Toni Fondamentali
* **S1 (Tono Sistolico):** Generato dalla chiusura delle valvole atrioventricolari (Mitrale e Tricuspide). È vibrato, sordo e precede la sistole ventricolare.
  * *Aumento di intensità:* Stenosi mitralica (lembi distesi al massimo e chiusura a elevata velocità), pervietà del dotto arterioso, aritmie ipercinetiche.
  * *Diminuzione di intensità:* BAV di I grado (allungamento della diastole, valvole galleggianti che si chiudono lentamente), insufficienza mitralica (lembi incontinenti), calcificazioni, scompenso cardiaco severo.
  * *Sdoppiamento ampio:* RBBB, sindromi da pre-eccitazione, anomalia di Ebstein.
  * *Sdoppiamento paradosso:* LBBB, stenosi mitralica severa.
* **S2 (Tono Diastolico):** Generato dalla chiusura delle valvole semilunari (Aortica e Polmonare). È più breve e acuto.
  * Fisiologicamente si sdoppia in INSPIRAZIONE perché l'aumentato ritorno venoso al cuore destro ritarda la chiusura della valvola polmonare (P2 ritardato).
  * *Sdoppiamento fisso (non varia col respiro):* Difetto del setto interatriale (DIA).
* **Toni Aggiunti:**
  * **S3 (Galoppo Protodiastolico):** Bassa frequenza, si ascolta all'apice in decubito laterale sinistro. Generato dalla decelerazione del sangue durante il riempimento rapido ventricolare passivo. Patologico sopra i 40 anni (scompenso cardiaco).
  * **S4 (Galoppo Telediastolico / Presistolico):** Generato dalla contrazione atriale attiva contro un ventricolo rigido e poco compliante (ipertrofia da ipertensione o stenosi aortica). Mai presente in Fibrillazione Atriale!

#### Polsi Arteriosi Tipici
* **Polso Parvus et Tardus:** Ampiezza ridotta e salita lenta dell'onda sfigmica -> Patognomonico di Stenosi Aortica Severa.
* **Polso Celere e Scoccante (di Corrigan):** Ampiezza elevata e rapido collasso diastolico -> Tipico di Insufficienza Aortica cronica.
* **Polso Paradosso:** Caduta della PAS > 10 mmHg in inspirazione -> Tamponamento Cardiaco e Pericardite costrittiva.""",
                "linkedQuestionIds": ["q-crd-22", "q-crd-24", "q-crd-27"]
            },
            {
                "id": "crd-aritmie-ecg",
                "title": "Elettrocardiografia & Aritmie (FA, Flutter, TPSV & TV/FV)",
                "category": "Elettrofisiologia & Aritmie",
                "anatomy3dTarget": "heart-conduction",
                "audioKey": "afib",
                "videoEmbed": "O_bJ7B-5dJc",
                "highYieldSummary": {
                    "definizione": "Anomalie di generazione o conduzione dell'impulso elettrico cardiaco: bradiaritmie (BAV 1-2-3, blocchi di branca) e tachiaritmie (FA, Flutter, TPSV da rientro, TV, FV).",
                    "segniCardine": "Palpitazioni, cardiopalmo ritmico o irregolare, dispnea, lipotimia, sincope, arresto cardiocircolatorio.",
                    "diagnostica": "ECG a 12 derivazioni + Holter ECG 24-48h + Studio Elettrofisiologico endocavitario (SEF).",
                    "terapia": "FA: Score CHA2DS2-VASc per anticoagulazione DOAC; Rate vs Rhythm control; Adenosina per TPSV; Defibrillazione non sincronizzata 200J per FV."
                },
                "clozeTokens": [
                    "flutter atriale comune antiorario istmo-dipendente",
                    "adenosina emivita ultra-breve minore di 10 secondi",
                    "defibrillazione non sincronizzata per fibrillazione ventricolare",
                    "CHA2DS2-VASc per anticoagulazione orale",
                    "blocco atrioventricolare di terzo grado"
                ],
                "examTraps": [
                    "Il Flutter Atriale COMUNE è quello antiorario istmo cavo-tricuspidale dipendente (onde negative in DII, DIII, aVF), non la forma oraria!",
                    "La FV si tratta con defibrillazione NON sincronizzata: non esiste onda R su cui sincronizzare la scarica!",
                    "L'adenosina ha un'emivita inferiore a 10 secondi e va data in bolo rapidissimo seguito da flush di fisiologica."
                ],
                "fullText": """### ELETTROCARDIOGRAFIA ED ARITMIE (Dispense 2FAST)
#### Blocchi Atrio-Ventricolari (BAV)
* **BAV I grado:** PR > 0.20 secondi costante; ogni onda P è seguita da un QRS. Spesso asintomatico e benigno.
* **BAV II grado:**
  * *Mobitz 1 (Luciani-Wenckebach):* Allungamento progressivo del PR finché un'onda P non è condotta. Sede nodale, prognosi favorevole.
  * *Mobitz 2:* Mancata conduzione improvvisa di un'onda P senza allungamento del PR. Sede sotto-nodale (fascicolare), alto rischio di blocco totale: richiede Pacemaker (PMK)!
* **BAV III grado (Completo):** Dissociazione atrio-ventricolare completa. Ritmo di scappamento nodale (QRS stretto 40-50 bpm) o ventricolare (QRS largo 20-30 bpm). Sindrome di Morgagni-Adams-Stokes. Indicazione assoluta a PMK definitivo.

#### Fibrillazione Atriale (FA) & Flutter
* **Fibrillazione Atriale:**
  * Attività atriale caotica e disorganizzata (350-600 bpm), assenza di onde P, risposte ventricolari totalmente irregolari ('irregolarmente irregolare').
  * *Stratificazione Tromboembolica (CHA2DS2-VASc):* Congestive HF (+1), Hypertension (+1), Age $\ge$ 75 (+2), Diabetes (+1), Stroke/TIA pregressi (+2), Vascular disease (+1), Age 65-74 (+1), Sex Category donna (+1). Indicazione a DOAC (Apixaban, Rivaroxaban, Edoxaban, Dabigatran) se score $\ge$ 2 nell'uomo o $\ge$ 3 nella donna.
* **Flutter Atriale:**
  * Circuito di macro-rientro nell'atrio destro. Forma comune: antiorario istmo cavo-tricuspidale dipendente con onde F a 'dente di sega' negative nelle derivazioni inferiori (DII, DIII, aVF). Frequenza atriale fissa a 300 bpm, conduzione 2:1 a 150 bpm. Terapia definitiva: ablazione transcatetere a radiofrequenza dell'istmo cavo-tricuspidale.""",
                "linkedQuestionIds": ["q-crd-21", "q-crd-25", "q-crd-30"]
            },
            {
                "id": "crd-ischemia-sca",
                "title": "Cardiopatia Ischemica, STEMI, NSTEMI & MINOCA",
                "category": "Cardiopatia Ischemica",
                "anatomy3dTarget": "coronary-arteries",
                "audioKey": "tachycardia",
                "videoEmbed": "O_bJ7B-5dJc",
                "highYieldSummary": {
                    "definizione": "Spettro di sindromi cliniche causate da discrepanza tra apporto e consumo di O2 miocardico per aterosclerosi coronarica: dalla Sindrome Coronarica Cronica (CCS) alla Sindrome Coronarica Acuta (STEMI, NSTEMI, Angina Instabile).",
                    "segniCardine": "Dolore toracico oppressivo retrosternale > 20 min irradiato a braccio sx, collo o epigastrio, non modificato dagli atti respiratori o dalla posizione.",
                    "diagnostica": "ECG a 12 derivazioni entro 10 min + Troponina hs ad alta sensibilità con cinetica 0h/1-2h + Coronarografia.",
                    "terapia": "STEMI: PCI primaria entro 120 min + DAPT (Aspirina + Ticagrelor/Prasugrel) + Eparina; NSTEMI stratificazione con GRACE score; MINOCA con CMR."
                },
                "clozeTokens": [
                    "sopraslivellamento ST al punto J",
                    "PCI primaria entro 120 minuti",
                    "coronaria destra in DII DIII aVF",
                    "angina instabile come sindrome acuta",
                    "doppia antiaggregazione piastrinica DAPT"
                ],
                "examTraps": [
                    "L'Angina Instabile è una sindrome coronarica ACUTA, NON cronica!",
                    "Nello STEMI inferiore (DII, DIII, aVF) registrare sempre V3R e V4R per escludere infarto del ventricolo destro (controindicati nitrati e diuretici!).",
                    "Il dolore pleuritico aumenta con il respiro; il dolore ischemico da infarto NON risente degli atti respiratori."
                ],
                "fullText": """### CARDIOPATIA ISCHEMICA (Dispense 2FAST)
#### Derivazioni ECG e Coronaria Colpevole
* **Anteriore / Settale (V1 - V4):** Arteria Discendente Anteriore (IVA).
* **Laterale alto (DI, aVL) & Laterale basso (V5 - V6):** Ramo Circonflesso (Cx) o Ramo Diagonale.
* **Inferiore (DII, DIII, aVF):** Arteria Coronaria Destra (RCA) nell'85-90% dei casi o Circonflessa dominante. Spesso associato a bradicardia o BAV da ischemia del nodo AV.
* **Posteriore (V7 - V9):** Sottoslivellamento speculare con onde R alte in V1-V3.
* **Ventricolo Destro (V3R, V4R):** Sopraslivellamento ST associato a STEMI inferiore; richiede espansione con liquidi, vietati vasodilatatori.

#### Riperfusione d'Urgenza
* PCI Primaria (Angioplastica percutanea con stent a rilascio di farmaco DES) entro 120 minuti dal primo contatto medico.
* Se tempo stimato > 120 min: Fibrinolisi sistemica (TNK-tPA Tenecteplase) entro 10 minuti, seguita da trasferimento immediato in centro Hub.""",
                "linkedQuestionIds": ["q-crd-19", "q-crd-28", "q-crd-29"]
            },
            {
                "id": "crd-scompenso",
                "title": "Scompenso Cardiaco (HFrEF, HFmrEF, HFpEF) & Shock Cardiogeno",
                "category": "Insufficienza Cardiaca",
                "anatomy3dTarget": "heart-chambers",
                "audioKey": "s1-s2",
                "videoEmbed": "kLwZ5VqKk4s",
                "highYieldSummary": {
                    "definizione": "Sindrome clinica caratterizzata da sintomi (dispnea, ortopnea, astenia) e segni (edemi, turgore giugulare, S3) causati da anomalie strutturali o funzionali che aumentano le pressioni di riempimento o riducono la portata cardiaca.",
                    "segniCardine": "Ortopnea, dispnea parossistica notturna, terzo tono S3 (galoppo protodiastolico), rantoli crepitanti basali, epatomegalia e reflusso epato-giugulare.",
                    "diagnostica": "Ecocardiogramma (HFrEF FE <= 40%, HFmrEF FE 41-49%, HFpEF FE >= 50%) + BNP > 35 pg/mL o NT-proBNP > 125 pg/mL.",
                    "terapia": "I 4 Pilastri salvavita (riducono mortalità in HFrEF): 1) ARNI (Sacubitril/Valsartan) o ACE-i; 2) Beta-bloccante; 3) MRA (Spironolattone); 4) SGLT2-inibitore (Dapagliflozin/Empagliflozin). Furosemide per decongestione sintomatica."
                },
                "clozeTokens": [
                    "quattro pilastri dello scompenso cardiaco",
                    "ARNI sacubitril valsartan",
                    "spironolattone riduce la mortalità",
                    "furosemide non riduce la mortalità",
                    "shock cardiogeno con cardiac index minore di 2.2"
                ],
                "examTraps": [
                    "I diuretici dell'ansa (furosemide) alleviano i sintomi ma NON riducono la mortalità globale!",
                    "La legge di Laplace dimostra che l'ipertrofia concentrica riduce lo stress di parete compensando l'aumento di pressione.",
                    "Nello shock cardiogeno: CI < 2.2 L/min/m² e PCWP > 18 mmHg ('Freddo e Bagnato')."
                ],
                "fullText": """### SCOMPENSO CARDIACO (Dispense 2FAST)
#### I 4 Pilastri Farmacologici ESC ('The Fantastic Four')
1. **ARNI (Sacubitril/Valsartan):** Inibitore della neprilisina + bloccante recettore AT1. Aumenta i peptidi natriuretici endogeni e blocca il sistema RAA. Riconosciuto farmaco di prima scelta al posto degli ACE-i.
2. **Beta-Bloccanti:** Bisoprololo, Carvedilolo, Metoprololo succinato, Nebivololo. Riducono la tossicità delle catecolamine e la morte improvvisa aritmica.
3. **MRA (Antagonisti Mineralcorticoidi):** Spironolattone, Eplerenone. Inibiscono il rimodellamento fibrotico guidato dall'aldosterone. Riducono mortalità e riospedalizzazioni.
4. **SGLT2-inibitori:** Dapagliflozin o Empagliflozin. Beneficio emodinamico e metabolico indipendente dalla presenza di diabete.

#### Shock Cardiogeno
* Definizione emodinamica: Cardiac Index < 2.2 L/min/m² associato a PCWP > 18 mmHg (congestione capillare polmonare).
* Trattamento: Inotropi (Dobutamina), vasopressori (Noradrenalina per garantire la perfusione coronarica), supporto meccanico con contropulsatore IABP o Impella.""",
                "linkedQuestionIds": ["q-crd-20", "q-crd-23", "q-crd-26"]
            }
        ]
    },
    {
        "id": "cardiochirurgia",
        "name": "Cardiochirurgia",
        "badge": "CARDIO-CHIR",
        "color": "amber",
        "icon": "Activity",
        "description": "Chirurgia valvolare aortica (SAVR vs TAVI), chirurgia mitralica (plastica vs sostituzione, catetere di Inoue), rivascolarizzazione miocardica CABG, chirurgia dell'aorta ascendente ed endocardite infettiva.",
        "topics": [
            {
                "id": "cch-aorta-tavi",
                "title": "Stenosi Aortica Severa, SAVR & TAVI",
                "category": "Chirurgia Valvolare Aortica",
                "anatomy3dTarget": "aortic-valve",
                "audioKey": "systolic-murmur",
                "videoEmbed": "Z8f07Fh7J1E",
                "highYieldSummary": {
                    "definizione": "Indicazioni e tecniche di sostituzione della valvola aortica calcifica: chirurgia a cielo aperto (SAVR con protesi meccanica o biologica) vs impianto transcatetere TAVI.",
                    "segniCardine": "Stenosi severa: Area < 1.0 cm², Gradiente medio > 40 mmHg, Vmax > 4.0 m/s; comparsa di sintomi (angina, sincope, dispnea).",
                    "diagnostica": "Ecocardiogramma Doppler transtoracico e transesofageo + Angio-TC cuore e vasi iliaci per planning TAVI.",
                    "terapia": "SAVR in pazienti giovani (< 75 anni) a basso rischio; TAVI in pazienti >= 75 anni, fragili o ad alto rischio (Edwards SAPIEN vs Medtronic Evolut)."
                },
                "clozeTokens": [
                    "area valvolare minore di 1 cm quadro",
                    "gradiente medio maggiore di 40 mmHg",
                    "valvola Edwards SAPIEN in pericardio bovino e cromo-cobalto",
                    "TAVI preferita sopra i 75 anni",
                    "protesi meccanica richiede anticoagulazione a vita con Warfarin"
                ],
                "examTraps": [
                    "La valvola Edwards SAPIEN è in pericardio BOVINO su scheletro in cromo-cobalto, non porcina!",
                    "Le protesi meccaniche durano a vita ma richiedono Warfarin a vita (INR target 2-3); le biologiche non richiedono anticoagulazione ma degenerano dopo 10-15 anni.",
                    "L'aorta a porcellana controindica formalmente la chirurgia open SAVR (impossibile clampare l'aorta)."
                ],
                "fullText": """### CARDIOCHIRURGIA AORTICA: SAVR VS TAVI (Dispense 2FAST)
#### Criteri di Scelta tra SAVR e TAVI (Linee Guida ESC/EACTS)
* **SAVR (Surgical Aortic Valve Replacement):**
  * Pazienti giovani (< 75 anni) a basso rischio chirurgico (STS-PROM / EuroSCORE II < 4%).
  * Scelta protesi meccanica (bivalva in carbonio pirolitico: durata illimitata, indicata < 60-65 anni, richiede Warfarin a vita target INR 2.0-3.0) vs biologica (pericardio bovino/porcino: indicata > 65 anni).
* **TAVI (Transcatheter Aortic Valve Implantation):**
  * Pazienti anziani ($\ge$ 75 anni) o con alto rischio chirurgico (EuroSCORE II > 8%), fragilità clinica, aorta a porcellana o pregresso CABG con LIMA pervia.
  * Accesso transfemorale prima scelta.
  * *Edwards SAPIEN:* 3 cuspidi in pericardio bovino su stent in cromo-cobalto espandibile su palloncino.
  * *Medtronic CoreValve / Evolut:* pericardio porcino su stent autoespandibile in Nitinolo.""",
                "linkedQuestionIds": ["q-cch-31", "q-cch-34"]
            },
            {
                "id": "cch-mitrale-endocardite",
                "title": "Chirurgia Mitralica, Catetere di Inoue & Endocardite Infettiva",
                "category": "Chirurgia Valvolare & Infezioni",
                "anatomy3dTarget": "heart-valves",
                "audioKey": "vsd-pansystolic",
                "videoEmbed": "kLwZ5VqKk4s",
                "highYieldSummary": {
                    "definizione": "Trattamento chirurgico della stenosi mitralica (valvuloplastica percutanea con catetere di Inoue vs sostituzione) e dell'insufficienza mitralica (plastica riparativa vs sostituzione); indicazioni chirurgiche d'urgenza in corso di endocardite.",
                    "segniCardine": "Stenosi mitralica: rullio diastolico con schiocco di apertura. Insufficienza mitralica: soffio olosistolico apicale. Endocardite: vegetazioni valvolari con febbre ed embolie settiche.",
                    "diagnostica": "Ecocardiogramma transesofageo (TEE), score di Wilkins per valvuloplastica percutanea, criteri di Duke.",
                    "terapia": "Plastica mitralica gold standard nell'insufficienza degenerativa; Catetere di Inoue per via transvenosa femorale e transettale; Chirurgia d'urgenza in endocardite per scompenso acuto o vegetazioni > 10 mm."
                },
                "clozeTokens": [
                    "catetere di Inoue attraverso la vena femorale",
                    "plastica riparativa mitralica gold standard",
                    "vegetazioni maggiori di 10 millimetri nell'endocardite",
                    "criteri di Duke per endocardite infettiva"
                ],
                "examTraps": [
                    "Il catetere di Inoue entra dalla vena femorale e richiede la puntura transettale dell'atrio per raggiungere la mitrale, non entra per via arteriosa!",
                    "Nell'insufficienza mitralica degenerativa il gold standard è la PLASTICA RIPARATIVA, non la sostituzione con protesi!",
                    "Indicazione all'intervento urgente in endocardite: embolizzazione ricorrente con vegetazione > 10 mm o scompenso emodinamico refrattario."
                ],
                "fullText": """### CHIRURGIA MITRALICA ED ENDOCARDITE (Dispense 2FAST)
#### Valvuloplastica Percutanea con Catetere di Inoue
* Accesso tramite la **Vena Femorale Comune** -> Vena Cava Inferiore -> Atrio Destro -> Puntura transettale del setto interatriale con ago di Brockenbrough -> Atrio Sinistro -> Gonfiaggio del palloncino sull'orifizio mitralico.
* Indicata per score di Wilkins $\le$ 8 (lembi mobili, scarse calcificazioni, apparato sottovalvolare conservato) e assenza di trombi in atrio sinistro.

#### Plastica Mitralica vs Sostituzione
* Nell'insufficienza mitralica degenerativa primitiva (prolasso/Barlow), la **plastica riparativa** (resezioni del lembo, neocorde in PTFE, anello protesico di annuloplastica) è il gold standard assoluto, con mortalità perioperatoria nettamente inferiore alla sostituzione protesica.

#### Endocardite Infettiva: Indicazioni Chirurgiche d'Urgenza
1. Scompenso cardiaco acuto severo da rottura valvolare o rigurgito massivo.
2. Infezione non controllata (ascesso dell'anulus, pseudoaneurisma, fistola, miceti).
3. Prevenzione dell'embolizzazione sistemica: vegetazioni persistenti > 10 mm dopo episodio embolico, o vegetazioni isolate > 15-20 mm.""",
                "linkedQuestionIds": ["q-cch-32", "q-cch-33", "q-cch-35"]
            }
        ]
    },
    {
        "id": "pneumo",
        "name": "Pneumologia",
        "badge": "PNEUMO",
        "color": "cyan",
        "icon": "Wind",
        "description": "Semeiotica respiratoria, PFR e spirometria, BPCO ed enfisema, asma bronchiale GINA, polmoniti comunitarie, tubercolosi, sarcoidosi e interstiziopatie.",
        "topics": [
            {
                "id": "pnm-semeiotica-pfr",
                "title": "Semeiotica Respiratoria, Volumi & Prove di Funzionalità (PFR)",
                "category": "Fisiopatologia Respiratoria",
                "anatomy3dTarget": "lungs-airways",
                "audioKey": "crackles",
                "videoEmbed": "JqCqM-WlGts",
                "highYieldSummary": {
                    "definizione": "Esame obiettivo del torace (ispezione, palpazione FVT, percussione, auscultazione) e valutazione funzionale dei volumi statici e dinamici mediante spirometria, pletismografia e diffusione del monossido di carbonio (DLCO).",
                    "segniCardine": "Murmure ridotto nell'enfisema; ottusità con FVT aumentato nella polmonite lobare consolidata; ottusità con FVT abolito nel versamento pleurico; rumori secchi (sibili, ronchi); rumori umidi (rantoli a velcro nella fibrosi).",
                    "diagnostica": "Indice di Tiffeneau post-BD (VEMS/CVF < 0.70 definisce ostruzione); Capacità Funzionale Residua (CFR) punto di equilibrio toraco-polmonare; Indice di Enfisema = VR/CPT (> 35%).",
                    "terapia": "Diagnosi differenziale tra patologia ostruttiva (BPCO, asma), restrittiva (interstiziopatie) e mista."
                },
                "clozeTokens": [
                    "indice di Tiffeneau post broncodilatatore minore di 0.70",
                    "capacita funzionale residua punto di equilibrio toraco-polmonare",
                    "indice di enfisema VR su CPT",
                    "fremito vocale tattile aumentato nella polmonite consolidata",
                    "fremito vocale tattile abolito nel versamento pleurico"
                ],
                "examTraps": [
                    "Il punto di equilibrio elastico toraco-polmonare si raggiunge alla CFR (Capacità Funzionale Residua), non alla CPT o CV!",
                    "L'indice di enfisema è VR/CPT (Volume Residuo / Capacità Polmonare Totale), non VR/CVF!",
                    "Nel consolidamento polmonare l'FVT è AUMENTATO, mentre nel versamento pleurico l'FVT è RIDOTTO/ABOLITO."
                ],
                "fullText": """### SEMEIOTICA RESPIRATORIA E PFR (Dispense 2FAST)
#### Esame Obiettivo Comparativo
* **Polmonite Lobare Consolidata:** Ottusità alla percussione, FVT AUMENTATO (il parenchima solido conduce meglio le vibrazioni dei bronchi pervi), soffio bronchiale patologico e rantoli crepitanti.
* **Versamento Pleurico:** Ottusità alla percussione con linea di Damoiseau-Ellis, FVT ABOLITO (il liquido interposto scherma le vibrazioni), murmure vescicolare assente.
* **Pneumotorace (PNX):** Iperfonoresi timpanica alla percussione, FVT ABOLITO, murmure assente.
* **Enfisema Polmonare:** Iperfonoresi, coste orizzontali, diametro AP aumentato (torace a botte), murmure vescicolare marcatamente RIDOTTO/OVATTATO, toni cardiaci parafonici.

#### Volumi Polmonari e Pletismografia
* **Capacità Funzionale Residua (CFR):** Volume polmonare a fine espirazione tranquilla. Corrisponde al punto di perfetto equilibrio del sistema toraco-polmonare a pressione transmurale zero.
* **Indice di Enfisema = VR / CPT:** Percentuale di volume intrappolato che non può essere espirato. Valore patologico > 30-35%.""",
                "linkedQuestionIds": ["q-pnm-04", "q-pnm-05", "q-pnm-06", "q-pnm-09"]
            },
            {
                "id": "pnm-asma-bpco",
                "title": "Asma Bronchiale, BPCO & Infezioni Polmonari (CAP)",
                "category": "Patologia Ostruttiva & Infettiva",
                "anatomy3dTarget": "lungs-airways",
                "audioKey": "wheezing",
                "videoEmbed": "f8q5iZ3eLso",
                "highYieldSummary": {
                    "definizione": "Patologie infiammatorie delle vie aeree: Asma (ostruzione reversibile con iperreattività bronchiale), BPCO (ostruzione cronica irreversibile correlata al fumo, fenotipi Pink Puffer ed enfisema vs Blue Bloater bronchitico), e Polmoniti acquisite in comunità (CAP).",
                    "segniCardine": "Asma: tosse secca notturna, sibili espiratori musicali. BPCO: dispnea da sforzo, tosse cronica con espettorato. CAP Tipica: febbre alta con brivido, espettorato rugginoso pneumococcico. CAP Atipica: tosse secca, infiltrato interstiziale senza risparmio.",
                    "diagnostica": "Test al salbutamolo (reversibilità) vs Test alla metacolina (iperreattività/provocazione); Rx Torace per consolidamento lobare vs interstiziale.",
                    "terapia": "Asma: GINA SMART con ICS-Formoterolo; BPCO: LAMA + LABA (+ ICS se eosinofili >= 300); CAP: Amoxicillina/Clavulanato + Macrolide o Ceftriaxone."
                },
                "clozeTokens": [
                    "test alla metacolina per la reattivita bronchiale",
                    "test al salbutamolo per la reversibilita",
                    "CAP atipica con pattern interstiziale senza risparmio",
                    "espettorato rugginoso nello Streptococcus pneumoniae",
                    "GINA SMART con ICS formoterolo"
                ],
                "examTraps": [
                    "Il salbutamolo serve a valutare la reversibilità, NON la reattività bronchiale (che si valuta invece con metacolina o mannitolo)!",
                    "Nella CAP atipica l'interstizio polmonare è il bersaglio primario: NON c'è risparmio dell'interstizio!",
                    "L'espettorato rugginoso è tipico e patognomonico dello Streptococcus pneumoniae."
                ],
                "fullText": """### ASMA, BPCO E POLMONITI (Dispense 2FAST)
#### Asma: Reversibilità vs Reattività
* **Test di Reversibilità:** Somministrazione di 400 mcg di Salbutamolo. Positivo se FEV1 aumenta $\ge$ 12% E $\ge$ 200 mL.
* **Test di Provocazione Bronchiale (Reattività):** Metacolina (stimolo colinergico diretto sui recettori M3) o Mannitolo inalatorio. Valuta la presenza di iperreattività bronchiale aspecifica quando la spirometria basale è normale.

#### Polmoniti Comunitarie (CAP)
* **CAP Tipica Pneumococcica (*S. pneumoniae*):** Febbre con brivido scuotente, tosse produttiva con espettorato rugginoso (color mattone/ruggine), consolidamento lobare uniforme con broncogramma aereo all'Rx torace. Spesso preceduta da infezione da virus dell'influenza di Tipo A.
* **CAP Atipica (*Mycoplasma*, *Chlamydia*, *Legionella*):** Colpisce frequentemente giovani e piccole comunità/epidemie, manifestazioni sistemiche, tosse secca, discrepanza clinico-radiologica con interessamento interstiziale reticolare bilaterale (nessun risparmio dell'interstizio).""",
                "linkedQuestionIds": ["q-pnm-01", "q-pnm-02", "q-pnm-08", "q-pnm-10", "q-pnm-11"]
            },
            {
                "id": "pnm-sarcoidosi-tbc",
                "title": "Sarcoidosi, Interstiziopatie & Tubercolosi (TBC)",
                "category": "Malattie Granulomatose & Interstiziali",
                "anatomy3dTarget": "lungs-airways",
                "audioKey": "crackles",
                "videoEmbed": "k4H7R2bQjYs",
                "highYieldSummary": {
                    "definizione": "Patologie granulomatose polmonari e sistemiche: Sarcoidosi (granulomi epitelioidi non caseificanti), Tubercolosi da Mycobacterium tuberculosis (necrosi caseosa ed escavazioni apicali), e Alveolite allergica estrinseca.",
                    "segniCardine": "Sarcoidosi: stadi radiologici 0-IV di Scadding (Stadio 0 Rx normale con manifestazioni extratoraciche; Stadio I adenopatia ilare bilaterale); Sindrome di Löfgren ed Heerfordt. TBC: febbricola serotina, emottisi, caverne apicali. BAL con CD4/CD8 elevato nella sarcoidosi vs CD8 elevato nell'alveolite allergica.",
                    "diagnostica": "Rx torace con caverne apicali nella TBC; Mantoux e QuantiFERON IGRA; BAL con immunofenotipizzazione linfocitaria; Biopsia tissutale.",
                    "terapia": "TBC: quadruplice schema RIPE per 2 mesi (Rifampicina, Isoniazide, Pirazinamide, Etambutolo) + 4 mesi RI; Sarcoidosi: cortisonici sistemici solo se sintomatica o impegno d'organo nobile."
                },
                "clozeTokens": [
                    "stadio zero della sarcoidosi con manifestazioni extratoraciche",
                    "granulomi non caseificanti",
                    "rapporto CD4 su CD8 aumentato nel BAL della sarcoidosi",
                    "rapporto CD8 aumentato nella polmonite da ipersensibilita",
                    "terapia RIPE nella tubercolosi"
                ],
                "examTraps": [
                    "Stadio 0 della Sarcoidosi: Rx torace perfettamente NORMALE con sole manifestazioni extratoraciche accertate!",
                    "Nel BAL della Sarcoidosi prevalgono i CD4+ (CD4/CD8 > 3.5), mentre nell'Alveolite Allergica Estrinseca (Polmone dell'agricoltore) prevalgono i CD8+ (rapporto invertito < 1.0)!",
                    "La TBC post-primaria da riattivazione predilige gli apici polmonari ed escava caverne tubercolari."
                ],
                "fullText": """### SARCOIDOSI E TUBERCOLOSI (Dispense 2FAST)
#### Stadiazione Radiologica di Scadding nella Sarcoidosi
* **Stadio 0:** Rx del torace normale in presenza di sarcoidosi accertata istologicamente in sede extra-toracica (cute, occhi, fegato, milza).
* **Stadio I:** Linfoadenopatia ilare bilaterale isolata (BHL).
* **Stadio II:** Linfoadenopatia ilare bilaterale + infiltrati parenchimali polmonari.
* **Stadio III:** Infiltrati parenchimali diffusi senza linfoadenopatia ilare.
* **Stadio IV:** Fibrosi polmonare irreversibile con distorsione bronchiale e quadro a favo d'api (honeycombing).

#### Analisi del BAL: Sarcoidosi vs Alveolite Allergica
* **Sarcoidosi:** Prevalenza di linfociti T helper **CD4+** con rapporto **CD4/CD8 > 3.5**.
* **Alveolite Allergica Estrinseca (Polmonite da Ipersensibilità):** Prevalenza marcata di linfociti T citotossici **CD8+** con rapporto **CD4/CD8 invertito (< 1.0)**.""",
                "linkedQuestionIds": ["q-pnm-03", "q-pnm-07", "q-pnm-12"]
            }
        ]
    },
    {
        "id": "toracica",
        "name": "Chirurgia Toracica",
        "badge": "TORACICA",
        "color": "blue",
        "icon": "Layers",
        "description": "Neoplasie polmonari NSCLC e SCLC, stadiazione TNM e chirurgia (lobectomia, VATS), patologia pleurica (criteri di Light, empiema, mesotelioma), e pneumotorace spontaneo e iperteso.",
        "topics": [
            {
                "id": "tor-neoplasie-chirurgia",
                "title": "Tumori del Polmone, Stadiazione TNM & Chirurgia Toracica",
                "category": "Oncologia Chirurgica Toracica",
                "anatomy3dTarget": "lungs-airways",
                "audioKey": "crackles",
                "videoEmbed": "JqCqM-WlGts",
                "highYieldSummary": {
                    "definizione": "Neoplasie primitive polmonari (NSCLC adenocarcinoma e squamocellulare vs SCLC microcitoma neuroendocrino) e criteri di resecabilità chirurgica e valutazione funzionale respiratoria preoperatoria.",
                    "segniCardine": "Tumori centrali: tosse stizzosa, emoftoe, atelettasia, stridore monomanuale (il dolore pleuritico acuto è invece tipico dei tumori periferici con invasione della pleura parietale). Tumore di Pancoast: Sindrome di Claude Bernard-Horner (ptosi, miosi, enoftalmo, anidrosi).",
                    "diagnostica": "TC Torace-Addome con mdc + PET-TC con 18-FDG + Broncoscopia EBUS-TBNA per stadiazione linfonodale mediastinica. Valutazione funzionale: ppoFEV1 e ppoDLCO > 40% per lobectomia.",
                    "terapia": "Lobectomia polmonare con linfoadenectomia mediastinica radicale in VATS/RATS (gold standard per stadi resecabili I-II)."
                },
                "clozeTokens": [
                    "dolore pleuritico tipico dei tumori periferici",
                    "lobectomia polmonare con linfoadenectomia mediastinica",
                    "ppoFEV1 e ppoDLCO maggiori del 40%",
                    "tumore di Pancoast con sindrome di Horner",
                    "microcitoma a piccole cellule neuroendocrino"
                ],
                "examTraps": [
                    "Il dolore pleuritico trafittivo NON è un sintomo tipico d'esordio dei tumori centrali, ma dei tumori periferici che infiltrano la pleura parietale!",
                    "La resecabilità richiede il calcolo dei valori predetti post-operatori (ppoFEV1 e ppoDLCO > 40%), non solo il valore basale!",
                    "Il tumore di Pancoast (apicale) invade il simpatico cervicale causando la triade di Claude Bernard-Horner (ptosi, miosi, enoftalmo)."
                ],
                "fullText": """### TUMORI POLMONARI E CHIRURGIA TORACICA (Dispense 2FAST)
#### Istotipi e Sede Clinica
* **Carcinoma Squamocellulare / Epidermoide:** Tipicamente centrale, ilare, associato al fumo, frequente necrosi centrale ed escavazione, ipercalcemia paraneoplastica da PTHrP. Sintomi: tosse, emoftoe, atelettasia lobare.
* **Adenocarcinoma:** Tipicamente periferico, anche in non fumatori, associato a mutazioni driver (EGFR, ALK, KRAS). Può causare dolore pleuritico precoce per infiltrazione della pleura parietale.
* **SCLC (Microcitoma):** Centrale, neuroendocrino ad alto grado, marcata tendenza a metastatizzare precocemente. Chirurgia raramente indicata (trattamento chemioterapico e radioterapico).

#### Criteri di Resecabilità Funzionale
* Spirometria e DLCO preoperatorie con calcolo di:
  $$\\text{ppoFEV1} = \\text{FEV1 pre-op} \\times \\left(1 - \\frac{\\text{segmenti resecati}}{19}\\right)$$
* Se ppoFEV1 > 40% e ppoDLCO > 40%: paziente candidabile a lobectomia. Se < 40%: test CPET da sforzo con misurazione del VO2 max (sicuro se > 15 mL/kg/min).
* **Intervento di Scelta:** Lobectomia polmonare anatomica con linfoadenectomia mediastinica radicale sistematica (approccio VATS mininvasivo o toracotomia).""",
                "linkedQuestionIds": ["q-tor-14", "q-tor-16"]
            },
            {
                "id": "tor-pleura-pnx",
                "title": "Patologia della Pleura, Criteri di Light & Pneumotorace (PNX)",
                "category": "Chirurgia Pleurica & Emergenze",
                "anatomy3dTarget": "lungs-airways",
                "audioKey": "wheezing",
                "videoEmbed": "f8q5iZ3eLso",
                "highYieldSummary": {
                    "definizione": "Patologie del cavo pleurico: versamento pleurico (differenziazione tra trasudato ed essudato secondo i criteri di Light, empiema), mesotelioma da asbesto, e pneumotorace spontaneo vs iperteso a tensione.",
                    "segniCardine": "Versamento: ottusità plessica con FVT abolito e silenzio auscultatorio. PNX Iperteso: shock ostruttivo, ipotensione, turgore giugulare, deviazione tracheale controlaterale e iperfonoresi timpanica. Mesotelioma: dolore toracico sordo continuo profondo e dispnea da versamento recidivante.",
                    "diagnostica": "Criteri di Light (proteine pleura/siero > 0.5 o LDH > 0.6 o LDH pleura > 2/3 limite siero); Rx torace; TC ad alta risoluzione (HRCT) per bronchiectasie e noduli.",
                    "terapia": "PNX iperteso: decompressione immediata con ago di grosso calibro (14-16G) senza attendere la radiografia! Toracentesi al bordo superiore della costa sottostante per evitare il fascio intercostale."
                },
                "clozeTokens": [
                    "criteri di Light per essudato pleurico",
                    "decompressione immediata con ago nel PNX iperteso",
                    "mesotelioma pleurico correlato ad asbesto",
                    "toracentesi al bordo superiore della costa sottostante",
                    "HRCT per diagnosi di bronchiectasie"
                ],
                "examTraps": [
                    "Nel PNX iperteso NON si attende mai l'esecuzione della radiografia del torace: è una diagnosi clinica e richiede decompressione immediata con ago!",
                    "La toracentesi si esegue al bordo SUPERIORE della costa sottostante, mai al bordo inferiore dove decorre il fascio vascolo-nervoso intercostale!",
                    "Il mesotelioma pleurico esordisce tipicamente con dolore toracico sordo continuo profondo associato a versamento siero-ematico."
                ],
                "fullText": """### PLEURA, CRITERI DI LIGHT E PNEUMOTORACE (Dispense 2FAST)
#### Criteri di Light per Versamento Pleurico
Un versamento è classificato come **ESSUDATO** se presenta almeno uno dei seguenti 3 parametri:
1. Rapporto Proteine pleuriche / Proteine sieriche > 0.5.
2. Rapporto LDH pleurico / LDH sierico > 0.6.
3. LDH pleurico > 2/3 del limite superiore della norma sierica del laboratorio (generalmente > 200 U/L).
*Se nessuno dei tre criteri è presente, il versamento è un **TRASUDATO** (es. Scompenso cardiaco congestizio, Cirrosi epatica con ascite, Sindrome nefrosica).*

#### Pneumotorace Iperteso (Emergenza Vitale)
* Meccanismo a valvola unidirezionale: l'aria entra nel cavo pleurico in inspirazione ma non può uscire in espirazione.
* Conseguenze emodinamiche: la pressione positiva collassa il polmone, sposta il mediastino dal lato opposto, comprime la vena cava superiore e inferiore e azzera il ritorno venoso -> Shock ostruttivo e arresto cardiaco.
* **Comportamento Corretto:** Decompressione immediata con ago di grosso calibro (14-16G) al II spazio intercostale emiclaveare o V spazio ascellare, trasformandolo in PNX aperto, seguita da posizionamento di tubo di drenaggio toracico collegato a valvola ad acqua (Pleurevac).""",
                "linkedQuestionIds": ["q-tor-13", "q-tor-15", "q-tor-17"]
            }
        ]
    },
    {
        "id": "vascolare",
        "name": "Chirurgia Vascolare",
        "badge": "VASCOLARE",
        "color": "emerald",
        "icon": "Zap",
        "description": "Aneurismi aortici e periferici, complicanze EVAR ed endoleak I-V, dissezione aortica Stanford A/B, arteriopatia periferica AOCP e ABI, ischemia acuta d'arto 6P/Fogarty, patologia carotidea e flebologia.",
        "topics": [
            {
                "id": "vsc-aneurismi-endoleak",
                "title": "Aneurismi Aortici (AAA), EVAR & Classificazione Endoleak",
                "category": "Chirurgia Aortica & Endovascolare",
                "anatomy3dTarget": "abdominal-aorta",
                "audioKey": "systolic-murmur",
                "videoEmbed": "Z8f07Fh7J1E",
                "highYieldSummary": {
                    "definizione": "Dilatazione permanente che interessa tutte e 3 le tonache vascolari con diametro > 3 cm o > 50% rispetto al calibro normale. Colpisce l'aorta sottorenale nel 95% dei casi. Riparazione open con Dacron vs EVAR.",
                    "segniCardine": "Massa pulsante addominale indolente; rottura (triade: dolore violento addominale/lombare, massa pulsante, shock ipovolemico); rottura retroperitoneale nell'80% dei casi.",
                    "diagnostica": "Ecocolordoppler per screening; Angio-TC con mdc gold standard pre-operatorio (valutazione colletto prossimale, calibro, assi iliaci).",
                    "terapia": "Indicazione a riparazione chirurgica: diametro >= 5.5 cm nell'uomo, >= 5.0 cm nella donna, o crescita rapida > 1 cm/anno o sintomatico. Endoleak Tipo I-V post-EVAR."
                },
                "clozeTokens": [
                    "diametro maggiore o uguale a 5.5 cm nell'uomo",
                    "diametro maggiore o uguale a 5.0 cm nella donna",
                    "interessa tutte e tre le tonache vascolari",
                    "rottura retroperitoneale nell'aneurisma sottorenale",
                    "endoleak di tipo 2 il piu comune da arterie lombari",
                    "endoleak di tipo 1 difetto di sigillo al colletto"
                ],
                "examTraps": [
                    "La definizione di aneurisma vero richiede il coinvolgimento di TUTTE E TRE LE TONACHE (intima, media, avventizia) con incremento > 50% o diametro > 3 cm.",
                    "La rottura dell'AAA sottorenale avviene molto più frequentemente nello spazio RETROPERITONEALE (tamponamento parziale) rispetto alla rottura libera intraperitoneale.",
                    "L'Endoleak più frequente in assoluto è il Tipo II (da collaterali lombari o IMA); il Tipo I (al colletto) e il Tipo III (strutturale) sono i più pericolosi ad alto rischio di rottura."
                ],
                "fullText": """### ANEURISMI AORTICI ED ENDOLEAK (Dispense 2FAST)
#### Indicazioni all'Intervento di Riparazione (Linee Guida ESVS)
* Diametro massimo $\ge$ 5.5 cm nell'uomo.
* Diametro massimo $\ge$ 5.0 cm nella donna (minor calibro basale e maggior rischio di rottura a parità di dimensioni).
* Crescita rapida dell'aneurisma: > 10 mm in 1 anno o > 5 mm in 6 mesi.
* Qualsiasi aneurisma sintomatico (dolore lombare persistente o dolorabilità alla palpazione) o fissurato.

#### Classificazione Completa degli Endoleak post-EVAR
* **Tipo I (Difetto di sigillo agli estremi):** IA prossimale al colletto aortico; IB distale alle arterie iliache. Flusso sistemico ad alta pressione. Emergenza di reintervento (estensioni, ballooning o cuffie aggiuntive).
* **Tipo II (Rifornimento retrogrado da vasi collaterali - IL PIÙ COMUNE):** Sostenuto da flusso retrogrado dall'Arteria Mesenterica Inferiore (IMA) o dalle arterie lombari pervieti. Rappresenta fino all'80% degli endoleak. A bassa pressione; si monitora e si tratta (embolizzazione) solo se la sacca aneurismatica cresce nel tempo.
* **Tipo III (Fallimento strutturale della protesi):** Disconnessione modulare tra i moduli protesici o lacerazione del tessuto di copertura. Alta pressione -> Trattamento immediato.
* **Tipo IV (Porosità del graft):** Trasudazione attraverso la trama protesica nelle prime 48 ore; autolimitante.
* **Tipo V (Endotensione):** Aumento della pressione della sacca e del suo diametro senza evidenza di flusso o stravaso di contrasto all'Angio-TC.""",
                "linkedQuestionIds": ["q-vsc-39", "q-vsc-40", "q-vsc-43", "q-vsc-48"]
            },
            {
                "id": "vsc-aocp-ischemia-acuta",
                "title": "AOCP, Indice ABI & Ischemia Acuta d'Arto (Le 6 P & Fogarty)",
                "category": "Patologia Arteriosa Periferica",
                "anatomy3dTarget": "peripheral-arteries",
                "audioKey": "systolic-murmur",
                "videoEmbed": "kLwZ5VqKk4s",
                "highYieldSummary": {
                    "definizione": "Arteriopatia cronica periferica (AOCP) da aterosclerosi vs Ischemia acuta d'arto (ALI) da embolia cardiogena o trombosi locale in situ.",
                    "segniCardine": "AOCP: claudicatio intermittens (stadi Leriche-Fontaine I-IV). Ischemia critica: dolore a riposo notturno e ulcere/gangrena. Ischemia Acuta: le 6 P (Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia).",
                    "diagnostica": "Indice Caviglia-Braccio (ABI): normale 0.9-1.3; moderata 0.4-0.7; severa/ischemia critica < 0.4-0.5; incomprimibile > 1.4 nel diabetico. Ecocolordoppler e Angio-TC.",
                    "terapia": "AOCP: esercizio fisico guidato, antiaggreganti, statine; rivascolarizzazione percutanea PTA/stent o bypass in vena safena autologa. Ischemia acuta: eparina sodica EV immediata 5000 UI + embolectomia chirurgica d'urgenza con Catetere di Fogarty."
                },
                "clozeTokens": [
                    "indice ABI minore di 0.50 per arteriopatia severa",
                    "valori di ABI maggiori di 1.4 nel diabetico per calcificazioni",
                    "le sei P dell'ischemia acuta",
                    "catetere di Fogarty a palloncino per embolectomia",
                    "classificazione di Leriche-Fontaine da uno a quattro"
                ],
                "examTraps": [
                    "ABI > 1.40 NON indica arterie sane, ma arterie rigide e non comprimibili per sclerosi calcifica della media di Mönckeberg, frequente nei diabetici!",
                    "Il Catetere di Fogarty serve per l'embolectomia nell'ischemia ACUTA d'arto, non per la TEA carotidea o l'aneurisma aortico!",
                    "Nel piede diabetico ischemico l'elastocompressione è ASSOLUTAMENTE CONTROINDICATA."
                ],
                "fullText": """### AOCP ED ISCHEMIA ACUTA D'ARTO (Dispense 2FAST)
#### Stadiazione di Leriche-Fontaine dell'AOCP
* **Stadio I:** Asintomatico (presenza di lesione stenotica con polsi periferici ridotti ma nessun sintomo clinico).
* **Stadio II (Claudicatio Intermittens):**
  * *IIa:* Claudicatio non invalidante (autonomia di marcia libera > 200 metri).
  * *IIb:* Claudicatio invalidante (autonomia di marcia severamente ridotta < 200 metri).
* **Stadio III:** Dolore ischemico continuo a riposo (prevalentemente notturno a piedi orizzontali; migliora a gamba declive).
* **Stadio IV:** Presenza di lesioni trofiche, necrosi e gangrena (secca o umida).
*(Stadi III e IV costituiscono la condizione di Ischemia Critica d'Arto).*

#### Interpretazione dell'Ankle-Brachial Index (ABI)
* $\\text{ABI} = \\frac{\\text{PAS alla caviglia (tibiale post/pedidia)}}{\\text{PAS al braccio (omerale)}}$
* **0.91 - 1.30:** Normale.
* **0.70 - 0.90:** Ostruzione lieve.
* **0.40 - 0.70:** Ostruzione moderata (corrisponde tipicamente allo stadio II).
* **< 0.40 - 0.50:** Arteriopatia severa / Ischemia critica con elevato rischio di perdita dell'arto.
* **> 1.40:** Arterie rigide, calcificate e non comprimibili (sclerosi di Mönckeberg tipica del diabetico).

#### Ischemia Acuta d'Arto e Catetere di Fogarty
* **Quadro Clinico delle '6 P':**
  1. *Pain* (dolore acuto violento);
  2. *Pallor* (pallore cereo cutaneo);
  3. *Pulselessness* (scomparsa immediata dei polsi a valle);
  4. *Paresthesia* (deficit sensitivo precoce);
  5. *Paralysis* (deficit motorio: segno di danno muscolare avanzato);
  6. *Poikilothermia* (arto ghiacciato alla palpazione).
* **Trattamento d'urgenza:** Bolo di eparina EV (5000 UI) immediato + Embolectomia chirurgica d'urgenza mediante **Catetere a palloncino di Fogarty** attraverso arteriotomia femorale o poplitea.""",
                "linkedQuestionIds": ["q-vsc-37", "q-vsc-38", "q-vsc-46"]
            },
            {
                "id": "vsc-carotidi-flebologia",
                "title": "Stenosi Carotidea, Furto Succlavia, Dissezione Aortica & Flebologia (TVP)",
                "category": "Tronchi Sovraortici & Vene",
                "anatomy3dTarget": "carotid-arteries",
                "audioKey": "systolic-murmur",
                "videoEmbed": "O_bJ7B-5dJc",
                "highYieldSummary": {
                    "definizione": "Patologie carotidee e vascolari cerebrali (TEA vs CAS), sindrome da furto della succlavia, dissezione aortica acuta (Stanford A vs B), e patologia venosa (insufficienza venosa cronica, prova di Trendelenburg, TVP e score di Wells).",
                    "segniCardine": "Carotidi: TIA con amaurosi fugace o emisindrome controlaterale. Furto della succlavia: vertigini ed atassia da sforzo dell'arto. Dissezione: dolore lacerante migrante interscapolare. Flebologia: segno di Homans nella TVP; vena femorale mediale ad arteria femorale nel triangolo di Scarpa.",
                    "diagnostica": "Ecocolordoppler TSA (criteri NASCET TEA per stenosi > 70% o > 50% sintomatico con rischio chirurgo < 3%); Angio-TC per dissezione aortica e flap intimale; Ecocolordoppler venoso CUS per TVP.",
                    "terapia": "TEA carotidea in sintomatici; Stanford A emergenza cardiochirurgica open vs Stanford B medica/TEVAR; TVP terapia con anticoagulanti orali DOAC o eparina."
                },
                "clozeTokens": [
                    "dissezione aortica di tipo A emergenza cardiochirurgica",
                    "dissezione aortica di tipo B trattata con terapia medica",
                    "sindrome da furto della succlavia con vertigini",
                    "TEA indicata se rischio operatorio minore del 3%",
                    "vena femorale comune decorre medialmente",
                    "manovra di Trendelenburg prima clino e poi orto",
                    "segno di Homans nella TVP"
                ],
                "examTraps": [
                    "La dissezione aortica di Tipo A coinvolge l'aorta ascendente ed è un'emergenza cardiochirurgica immediata a cielo aperto; la Tipo B coinvolge l'aorta discendente ed è trattata inizialmente con terapia medica o TEVAR se complicata!",
                    "Nella sindrome da furto della succlavia il sintomo neurologico più frequente in assoluto è la VERTIGINE (da insufficienza vertebro-basilare per inversione del flusso nell'arteria vertebrale omolaterale)!",
                    "La vena femorale comune decorre MEDIALMENTE rispetto all'arteria femorale comune nel triangolo di Scarpa (regola NAV da laterale a mediale: Nervo, Arteria, Vena)!",
                    "La prova di Trendelenburg per le varici prevede che il paziente venga posto prima in clinostatismo (svuotamento), si applica il laccio e poi si alza in ortostatismo."
                ],
                "fullText": """### CAROTIDI, FURTO DELLA SUCCLAVIA, DISSEZIONE E FLEBOLOGIA (Dispense 2FAST)
#### Dissezione Aortica: Classificazione di Stanford
* **Stanford Tipo A:** Coinvolge l'Aorta Ascendente (indipendentemente dal punto di ingresso o dall'estensione all'arco/discendente). È una letale emergenza cardiochirurgica assoluta (mortalità 1-2% all'ora nelle prime 48h per rottura intrapericardica con tamponamento cardiaco, insufficienza aortica acuta massiva, infarto da dissezione degli osti coronarici o ictus). Richiede **riparazione immediata a cielo aperto**.
* **Stanford Tipo B:** Origina distalmente alla succlavia sinistra e coinvolge l'aorta toracica discendente e addominale. Terapia iniziale: medica in terapia subintensiva (controllo pressorio rigoroso e FC con beta-bloccante EV target PAS 100-120 mmHg). Trattamento con TEVAR solo nelle forme complicate (rottura, ischemia viscerale/degli arti).

#### Stenosi Carotidea e Criteri NASCET
* **Paziente Sintomatico (TIA o ictus negli ultimi 6 mesi):** TEA indicata per stenosi 70-99% (massimo beneficio) o 50-69%, a condizione che il rischio operatorio del centro sia < 6%.
* **Paziente Asintomatico:** TEA indicata per stenosi 60-99% se aspettativa di vita > 5 anni e rischio perioperatorio < 3%.
* **Occlusione al 100%:** La TEA è CONTROINDICATA (rischio emorragico da riperfusione e impossibilità tecnica di stappare la carotide interna intracranica trombizzata).

#### Sindrome da Furto della Succlavia
* Stenosi od occlusione dell'arteria succlavia a monte dell'emergenza dell'arteria vertebrale.
* Durante il lavoro dell'arto superiore omolaterale, l'aumentata richiesta vascolare abbassa la pressione distale e provoca l'inversione retrograda del flusso nell'arteria vertebrale, che risucchia sangue dal poligono di Willis/tronco basilare verso il braccio.
* Sintomo principale: **vertigini**, atassia, instabilità dell'equilibrio e diplopia scatenati dall'esercizio dell'arto superiore.

#### Flebologia & TVP
* **Anatomia Venosa:** La Vena Grande Safena origina anteriormente al malleolo mediale alla caviglia; la Vena Femorale Comune decorre **MEDIALMENTE** rispetto all'arteria femorale nel triangolo di Scarpa.
* **Manovra di Rima-Trendelenburg:** Paziente prima in clinostatismo con arto sollevato per svuotare le vene -> applicazione del laccio alla coscia -> passaggio in ortostatismo. Valuta l'incontinenza dell'ostio safeno-femorale e delle vene perforanti.
* **Trombosi Venosa Profonda (TVP):** Triade di Virchow (stasi, danno endoteliale, ipercoagulabilità); Segno di Homans (dolore al polpaccio alla dorsiflessione passiva del piede); Score di Wells per TVP; Trattamento con anticoagulanti orali DOAC (Rivaroxaban, Apixaban) per prevenire l'embolia polmonare.""",
                "linkedQuestionIds": ["q-vsc-36", "q-vsc-41", "q-vsc-42", "q-vsc-44", "q-vsc-45", "q-vsc-47"]
            }
        ]
    }
]

theory_out = os.path.join(SRC_DATA, "theory.json")
with open(theory_out, "w", encoding="utf-8") as f:
    json.dump({"modules": branches}, f, ensure_ascii=False, indent=2)

print(f"Saved complete 5-branch theory database to {theory_out}")
