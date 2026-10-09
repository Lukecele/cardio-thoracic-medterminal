import json
import os

BASE_DIR = "/home/luca/cardio-thoracic-medterminal"
SRC_DATA = os.path.join(BASE_DIR, "src", "data")

print("Building rich medical theory database...")

# Load questions to link their IDs
questions_path = os.path.join(SRC_DATA, "questions.json")
with open(questions_path, "r", encoding="utf-8") as f:
    questions = json.load(f)

print(f"Loaded {len(questions)} questions for cross-referencing")

theory_data = {
    "modules": [
        {
            "id": "cardio",
            "name": "Cardiologia",
            "icon": "Heart",
            "description": "Semeiotica cardiaca, SCA, aritmie, scompenso cardiaco, valvulopatie, ipertensione e farmacologia.",
            "topics": [
                {
                    "id": "cardio-semeiotica",
                    "title": "Semeiotica Cardiovascolare & Auscultazione",
                    "category": "Semeiotica & Fisiopatologia",
                    "anatomy3dTarget": "heart-valves",
                    "audioEffect": "cardiac-s1-s2",
                    "videoEmbed": "aR_c2v-p5r0",
                    "highYieldSummary": {
                        "definizione": "Valutazione clinica dell'attività cardiaca tramite fonocardiografia, toni cardiaci, soffi e caratterizzazione dei polsi arteriosi.",
                        "segniCardine": "S1 (chiusura mitro-tricuspidale), S2 (chiusura semilunari Ao-Po), Toni aggiunti S3 (riempimento rapido ventricolare) ed S4 (contrazione atriale).",
                        "diagnostica": "Auscultazione nei 4 focolai (Aortico II dx, Polmonare II sx, Tricuspidale IV-V parasternale sx, Mitralico V spazio linea emiclaveare) + Focolaio di Erb (III sx).",
                        "terapia": "Orientamento diagnostico differenziale per valvulopatie, scompenso e tamponamento."
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
                        "S1 aumenta di intensità nella stenosi mitralica per aumentato gradiente AV e chiusura violenta dei lembi mobili.",
                        "S3 può essere fisiologico nei giovani sotto i 30 anni, atleti e gravidanza, ma è rigorosamente patologico (galoppo da scompenso) sopra i 40 anni.",
                        "Il polso paradosso NON è una variazione di frequenza, ma una caduta anomala della pressione arteriosa sistolica > 10 mmHg durante l'inspirazione (tamponamento cardiaco)."
                    ],
                    "fullText": """### TONI CARDIACI E AUSCULTAZIONE (Dispense 2FAST)
#### Toni Fondamentali
* **S1 (Tono Sistolico):** Generato dalla chiusura delle valvole atrioventricolari (Mitrale e Tricuspide). È vibrato, sordo e precede la sistole ventricolare.
  * *Aumento di intensità:* Stenosi mitralica (lembi distesi al massimo e chiusura a elevata velocità), pervietà del dotto arterioso, aritmie ipercinetiche.
  * *Diminuzione di intensità:* BAV di I grado (allungamento della diastole, valvole galleggianti che si chiudono lentamente), insufficienza mitralica (lembi incontinenti), scompenso cardiaco severo.
  * *Sdoppiamento ampio:* RBBB, sindromi da pre-eccitazione, anomalia di Ebstein.
  * *Sdoppiamento paradosso:* LBBB, stenosi mitralica severa.
* **S2 (Tono Diastolico):** Generato dalla chiusura delle valvole semilunari (Aortica e Polmonare). È più breve e acuto.
  * Fisiologicamente si sdoppia in INSPIRAZIONE perché l'aumentato ritorno venoso al cuore destro ritarda la chiusura della valvola polmonare (P2 ritardato).
  * *Sdoppiamento fisso (non varia col respiro):* Difetto del setto interatriale (DIA).
* **Toni Aggiunti:**
  * **S3 (Galoppo Protosistolico/Protodiastolico):** Bassa frequenza, si ascolta all'apice in decubito laterale sinistro. Generato dalla decelerazione del sangue durante il riempimento rapido ventricolare passivo.
  * **S4 (Galoppo Telediastolico / Presistolico):** Generato dalla contrazione atriale attiva contro un ventricolo rigido e poco compliante (ipertrofia ventricolare da ipertensione o stenosi aortica). Mai presente in Fibrillazione Atriale!

#### Polsi Arteriosi Tipici
* **Polso Parvus et Tardus:** Ampiezza ridotta e salita lenta dell'onda sfigmica -> Patognomonico di Stenosi Aortica Severa.
* **Polso Celere e Scoccante (di Corrigan / a martello d'acqua):** Ampiezza elevata e rapido collasso diastolico -> Tipico di Insufficienza Aortica cronica.
* **Polso Paradosso:** Caduta della PAS > 10 mmHg in inspirazione -> Tamponamento Cardiaco e Pericardite costrittiva.""",
                    "linkedQuestionIds": ["q-cardio-12", "q-cardio-22", "q-cardio-26"]
                },
                {
                    "id": "cardio-ischemia-sca",
                    "title": "Sindrome Coronarica Acuta (STEMI & NSTEMI)",
                    "category": "Cardiopatia Ischemica",
                    "anatomy3dTarget": "coronary-arteries",
                    "audioEffect": "cardiac-ischemia-monitor",
                    "videoEmbed": "O_bJ7B-5dJc",
                    "highYieldSummary": {
                        "definizione": "Spettro di sindromi cliniche causate da improvvisa riduzione della perfusione miocardica per rottura/erosione di placca aterosclerotica e trombosi coronarica sovrapposta.",
                        "segniCardine": "Dolore toracico oppressivo retrosternale > 20 min, irradiato al braccio sx, mandibola o epigastrio, non modificato dagli atti respiratori o dalla digitopressione.",
                        "diagnostica": "ECG 12 derivazioni entro 10 minuti dal primo contatto medico + Troponina cardiaca ad alta sensibilità (hs-cTnI o hs-cTnT) con cinetica a 0h/1-2h.",
                        "terapia": "STEMI: PCI primaria entro 120 min (o fibrinolisi entro 10 min se PCI > 120 min). DAPT (Aspirina + Ticagrelor/Prasugrel) + Eparina non frazionata + Statina ad alta intensità."
                    },
                    "clozeTokens": [
                        "sopraslivellamento del tratto ST",
                        "PCI primaria entro 120 minuti",
                        "arteria discendente anteriore",
                        "coronaria destra in DII, DIII, aVF",
                        "doppia antiaggregazione piastrinica DAPT",
                        "MINOCA con coronarie sane"
                    ],
                    "examTraps": [
                        "Il dolore toracico pleuritico o pericarditico aumenta con l'inspirazione ed è puntorio; il dolore ischemico da infarto è oppressivo, gravativo, a sbarra e NON risente degli atti del respiro.",
                        "STEMI inferiore (DII, DIII, aVF): sempre indagare le derivazioni destre (V3R, V4R) per escludere infarto del ventricolo destro! In tal caso i nitrati sono CONTROINDICATI per rischio di grave ipotensione da crollo del precarico.",
                        "MINOCA (Myocardial Infarction with Non-Obstructive Coronary Arteries): infarto confermato da troponina ma coronarografia che mostra coronarie normali o stenosi < 50%; richiede risonanza magnetica cardiaca (CMR) per la diagnosi differenziale."
                    ],
                    "fullText": """### SINDROMI CORONARICHE ACUTE (Dispense 2FAST)
#### Classificazione Elettrocardiografica
1. **STEMI (ST-Elevation Myocardial Infarction):**
   * Occlusione trombotica transmurale completa della coronaria (trombo rosso/bianco occludente).
   * Criteri ECG: sopraslivellamento ST al punto J in almeno 2 derivazioni contigue:
     * V2-V3: ≥ 2.5 mm negli uomini < 40 anni, ≥ 2.0 mm negli uomini ≥ 40 anni, ≥ 1.5 mm nelle donne.
     * Altre derivazioni: ≥ 1.0 mm (0.1 mV).
     * Nuovo Blocco di Branca Sinistro (LBBB) insorto contestualmente al dolore toracico = equivalente STEMI!
   * Correlazione anatomica e derivazioni:
     * **Anteriore/Settale:** V1-V4 -> Discendente Anteriore (IVA).
     * **Laterale alto:** DI, aVL -> Ramo Diagonale o Marginale Ottuso.
     * **Inferiore:** DII, DIII, aVF -> Coronaria Destra (RCA) o Circonflessa.
     * **Posteriore:** Sottoslivellamento ST speculare in V1-V3 con onde R alte (confermare con V7-V9).
2. **NSTEMI / Angina Instabile:**
   * Ischemia subendocardica senza occlusione transmurale persistente.
   * ECG: sottoslivellamento ST orizzontale o discendente, inversione delle onde T, o tracciato normale.
   * Distinzione: NSTEMI presenta rialzo e caduta delle troponine; Angina instabile ha troponine rigorosamente negative.

#### Gestione Terapeutica Iper-Rapida
* **STEMI:** Il tempo è muscolo! PCI primaria percutanea entro 120 minuti dal contatto medico.
* Se tempo previsto per PCI > 120 min: Fibrinolisi sistemica (Alteplase/Tenecteplase) entro 10 minuti, seguita da trasferimento immediato per coronarografia.
* **Farmacoterapia acuta:**
  * Aspirina 150-300 mg bolo masticabile + Inibitore P2Y12 (Ticagrelor 180 mg o Prasugrel 60 mg; Clopidogrel solo se controindicati).
  * Anticoagulazione: Eparina non frazionata (UFN) bolo EV 70-100 UI/kg durante la procedura.
  * Nitrati sublinguali (solo se PAS > 90 mmHg e no infarto ventricolo destro).""",
                    "linkedQuestionIds": ["q-cardio-09", "q-cardio-29"]
                },
                {
                    "id": "cardio-scompenso",
                    "title": "Scompenso Cardiaco & Shock Cardiogeno",
                    "category": "Insufficienza Cardiaca",
                    "anatomy3dTarget": "heart-chambers",
                    "audioEffect": "cardiac-s3-gallop",
                    "videoEmbed": "kLwZ5VqKk4s",
                    "highYieldSummary": {
                        "definizione": "Sindrome clinica caratterizzata da sintomi tipici (dispnea, astenia, edemi) e segni causati da un'anomalia strutturale o funzionale cardiaca che determina elevate pressioni intracardiache o inadeguata portata.",
                        "segniCardine": "Dispnea da sforzo, ortopnea, dispnea parossistica notturna, turgore delle vene giugulari, reflusso epato-giugulare, terzo tono S3 (galoppo), rantoli crepitanti basali.",
                        "diagnostica": "Ecocardiogramma transtoracico (misura FE: HFrEF ≤ 40%, HFmrEF 41-49%, HFpEF ≥ 50%) + BNP > 35 pg/mL o NT-proBNP > 125 pg/mL.",
                        "terapia": "I 'Quattro Pilastri' salvavita (riducono la mortalità in HFrEF): 1) ARNI (Sacubitril/Valsartan) o ACE-inibitore; 2) Beta-bloccante; 3) MRA (Spironolattone/Eplerenone); 4) SGLT2i (Dapagliflozin/Empagliflozin). Furosemide per il controllo dei fluidi."
                    },
                    "clozeTokens": [
                        "frazione di eiezione ridotta HFrEF minore del 40%",
                        "quattro pilastri che riducono la mortalità",
                        "ARNI sacubitril valsartan",
                        "spironolattone riduce la mortalità",
                        "shock cardiogeno con cardiac index minore di 2.2",
                        "legge di Laplace"
                    ],
                    "examTraps": [
                        "I diuretici dell'ansa (Furosemide) sono fondamentali per i sintomi congestizi MA NON riducono la mortalità globale a lungo termine!",
                        "I 4 farmaci che riducono la mortalità in HFrEF sono: ARNI/ACE-i, Beta-bloccanti, Spironolattone/Eplerenone, SGLT2-inibitori.",
                        "Shock cardiogeno emodinamico (Diamond-Forrester IV): Cardiac Index < 2.2 L/min/m² e PCWP > 18 mmHg. È uno stato 'freddo e bagnato' (ipoperfusione + congestione)."
                    ],
                    "fullText": """### SCOMPENSO CARDIACO (Dispense 2FAST)
#### Fisiopatologia e Legge di Laplace
* Tensione di parete (Stress di parete) = $\\sigma = \\frac{P \\times r}{2 \\times h}$
  * $P$ = pressione intraventricolare; $r$ = raggio della cavità ventricolare; $h$ = spessore della parete.
  * La dilatazione ventricolare (aumento del raggio $r$) aumenta lo stress di parete e peggiora il consumo di ossigeno e l'efficienza contrattile.
  * L'ipertrofia concentrica (aumento dello spessore $h$) agisce come meccanismo di compenso per ridurre lo stress di parete secondo Laplace.

#### Trattamento Farmacologico secondo Linee Guida ESC
1. **Inibitori SRAA / Neprilisina:**
   * **ARNI (Sacubitril/Valsartan):** Prima scelta in sostituzione dell'ACE-inibitore. Aumenta i peptidi natriuretici inibendo la neprilisina e blocca il recettore AT1 dell'angiotensina II.
   * ACE-inibitori (Ramipril, Enalapril) se ARNI non tollerato o controindicato.
2. **Beta-Bloccanti:** Bisoprololo, Carvedilolo, Metoprololo succinato, Nebivololo. Riducono la tossicità simpatica e la morte aritmica.
3. **Antagonisti dei Recettori dei Mineralcorticoidi (MRA):** Spironolattone, Eplerenone. Bloccano l'azione pro-fibrotica dell'aldosterone; riducono la mortalità del 30%.
4. **Inibitori di SGLT2:** Dapagliflozin o Empagliflozin. Migliorano l'emodinamica renale e il metabolismo miocardico indipendentemente dalla presenza di diabete.
5. **Diuretici dell'ansa:** Furosemide / Torasemide per alleviare i sintomi e i segni di congestione (edemi, rantoli).""",
                    "linkedQuestionIds": ["q-cardio-10", "q-cardio-14", "q-cardio-24"]
                },
                {
                    "id": "cardio-valvulopatie",
                    "title": "Valvulopatie (Stenosi Aortica, Insufficienza, TAVI)",
                    "category": "Valvulopatie",
                    "anatomy3dTarget": "aortic-valve",
                    "audioEffect": "aortic-stenosis-murmur",
                    "videoEmbed": "Z8f07Fh7J1E",
                    "highYieldSummary": {
                        "definizione": "Patologie a carico dell'apparato valvolare cardiaco che causano ostacolo al flusso (stenosi) o rigurgito anomalo (insufficienza).",
                        "segniCardine": "Stenosi Aortica: triade Angina, Sincope da sforzo, Dispnea. Soffio sistolico eiettivo a diamante irradiato ai vasi del collo con polso parvus et tardus.",
                        "diagnostica": "Ecocardiogramma Doppler transtoracico. Stenosi aortica severa: Area valvolare < 1.0 cm² (o < 0.6 cm²/m²), Gradiente medio > 40 mmHg, Vmax > 4.0 m/s.",
                        "terapia": "SAVR (Sostituzione valvolare chirurgica) in pz giovani (< 75 anni) a basso rischio chirurgico; TAVI (Impianto transcatetere di valvola aortica) in pz ≥ 75 anni o ad alto rischio/inoperabili (es. Edwards SAPIEN in cromo-cobalto o Medtronic CoreValve in nitinolo)."
                    },
                    "clozeTokens": [
                        "area valvolare minore di 1 cm quadro",
                        "gradiente medio maggiore di 40 mmHg",
                        "velocità di picco maggiore di 4 metri al secondo",
                        "TAVI transcatetere nei pazienti ad alto rischio",
                        "valvola Edwards SAPIEN in pericardio bovino e cromo-cobalto",
                        "soffio di Austin Flint nell'insufficienza aortica"
                    ],
                    "examTraps": [
                        "La comparsa dei sintomi nella stenosi aortica muta radicalmente la prognosi: senza intervento, la sopravvivenza media è di 2 anni dall'insorgenza dello scompenso, 3 anni dalla sincope, 5 anni dall'angina!",
                        "Valvola Edwards SAPIEN: pericardio BOVINO montato su frame in CROMO-COBALTO espandibile su palloncino.",
                        "Soffio di Graham Steell: soffio diastolico da insufficienza polmonare secondaria a grave ipertensione polmonare cronica (frequente nella stenosi mitralica serrata)."
                    ],
                    "fullText": """### VALVULOPATIE (Dispense 2FAST)
#### Stenosi Valvolare Aortica (AS)
* **Eziologia:** Degenerativo-calcifica dell'anziano (la più frequente nei paesi occidentali), valvola aortica bicuspide congenita (sintomi tipici verso i 40-60 anni), reumatica.
* **Criteri Ecocardiografici di Stenosi Aortica Severa:**
  * Area Valvolare Aortica (AVA): < 1.0 cm² (indicizzata < 0.6 cm²/m²).
  * Gradiente pressorio medio: > 40 mmHg.
  * Velocità massima di picco (Vmax): > 4.0 m/s.
  * Ratio di velocità adimensionale (DVI): < 0.25.
* **Opzioni Chirurgiche ed Interventistiche:**
  * **SAVR (Surgical Aortic Valve Replacement):** Indicata nei pazienti < 75 anni con basso rischio operatorio (STS-PROM / EuroSCORE II < 4%).
  * **TAVI (Transcatheter Aortic Valve Implantation):** Indicata nei pazienti ≥ 75 anni, o con comorbidità severe, fragilità, aorta a porcellana, pregresso CABG con pervietà dell'arteria mammaria interna.
  * *Dispositivi TAVI:* Edwards SAPIEN (3 lembi in pericardio bovino montati su scheletro metallico in cromo-cobalto espandibile tramite palloncino); Medtronic Evolut (lembi in pericardio porcino montati su stent autoespandibile in lega a memoria di forma Nitinolo nickel-titanio).""",
                    "linkedQuestionIds": ["q-cardio-13", "q-cardio-15", "q-cardio-26"]
                }
            ]
        },
        {
            "id": "pneumo",
            "name": "Pneumologia & Chirurgia Toracica",
            "icon": "Wind",
            "description": "Semeiotica polmonare, PFR, BPCO, Asma, Polmoniti, TBC, Sarcoidosi, Neoplasie e patologia pleurica.",
            "topics": [
                {
                    "id": "pneumo-semeiotica-pfr",
                    "title": "Semeiotica Respiratoria & Prove di Funzionalità (PFR)",
                    "category": "Fisiopatologia Respiratoria",
                    "anatomy3dTarget": "lungs-airways",
                    "audioEffect": "lung-crackles-wheeze",
                    "videoEmbed": "JqCqM-WlGts",
                    "highYieldSummary": {
                        "definizione": "Valutazione dell'apparato respiratorio mediante esame obiettivo toracico (ispezione, palpazione FVT, percussione, auscultazione) e misurazione dei volumi polmonari statici e dinamici tramite spirometria e pletismografia.",
                        "segniCardine": "Murmure vescicolare ridotto nell'enfisema; Rumori secchi continui (ronchi e sibili nell'asma/BPCO); Rumori umidi discontinui (crepitii tele-inspiratori a velcro nella fibrosi, rantoli a medie/grandi bolle nelle bronchiectasie e nell'EPA).",
                        "diagnostica": "Spirometria globale: Indice di Tiffeneau (VEMS/CVF < 70% definisce ostruzione irreversibile). Pletismografia: VR (Volume Residuo), CPT (Capacità Polmonare Totale), CFR (Capacità Funzionale Residua). Indice di Enfisema = VR/CPT (> 35%).",
                        "terapia": "Inquadramento diagnostico differenziale tra deficit ostruttivo, restrittivo e misto."
                    },
                    "clozeTokens": [
                        "indice di Tiffeneau VEMS su CVF minore di 0.70",
                        "capacità funzionale residua punto di equilibrio toraco-polmonare",
                        "indice di enfisema VR su CPT",
                        "rumori secchi sibili espiratori",
                        "rantoli a velcro nella fibrosi polmonare",
                        "ottusità alla percussione nel versamento pleurico"
                    ],
                    "examTraps": [
                        "Il punto di equilibrio elastico del sistema toraco-polmonare si raggiunge alla Capacità Funzionale Residua (CFR): la retrazione elastica del polmone verso l'interno e l'espansione della gabbia verso l'esterno si equivalgono esattamente a pressione transmurale zero.",
                        "L'indice di enfisema è il rapporto VR/CPT (Volume Residuo su Capacità Polmonare Totale), non VR/CVF!",
                        "Nell'enfisema il murmure vescicolare è marcatamente RIDOTTO/OVATTATO per distruzione dei setti alveolari e iperinflazione, NON aumentato."
                    ],
                    "fullText": """### SEMEIOTICA E PROVE DI FUNZIONALITÀ RESPIRATORIA (Dispense 2FAST)
#### Esame Obiettivo del Torace
* **Ispezione:** Torace a botte (aumento del diametro antero-posteriore, coste orizzontalizzate, angolo epigastrico ottuso nell'enfisema). Segno di Hoover (restringimento paradosso della base toracica in inspirazione).
* **Palpazione (FVT - Fremito Vocale Tattile):**
  * *Aumentato:* Addensamento polmonare a bronchi pervi (polmonite lobare consolidata).
  * *Diminuito o assente:* Interposizione aerea o liquida (pneumotorace, versamento pleurico massivo, enfisema grave, atelettasia da ostruzione bronchiale).
* **Percussione:**
  * *Ottusità:* Presenza di liquidi o solidi (versamento pleurico, polmonite consolidata, neoplasia).
  * *Iperfonoresi (suono timpanico):* Eccesso di aria (enfisema polmonare, pneumotorace).
* **Auscultazione:**
  * Murmure vescicolare: suono dolce, frusciante, prevalentemente inspiratorio.
  * **Rumori secchi (continui):** generati dal passaggio di aria attraverso vie aeree stenosate (broncospasmo, edema mucoso).
    * *Sibili:* alta frequenza, musicali, prevalentemente espiratori (asma bronchiale, BPCO).
    * *Stridore:* suono aspro laringo-tracheale inspiratorio da ostruzione delle vie aeree superiori.
  * **Rumori umidi (discontinui):** generati dalla rottura di bolle d'aria o apertura improvvisa di vie collassate.
    * *Crepitii fini (a velcro):* tele-inspiratori, tipici delle interstiziopatie / fibrosi polmonare idiopatica (IPF).

#### Volumi Polmonari e PFR
* **Capacità Funzionale Residua (CFR = VR + VRE):** È il volume presente a fine espirazione tranquilla; corrisponde al perfetto punto di equilibrio del sistema toraco-polmonare.
* **Indice di Enfisema = VR / CPT:** Esprime la frazione di volume polmonare totale che non può essere espirata per intrappolamento aereo (air trapping). Fisiologico < 25-30%, marcatamente aumentato nell'enfisema.""",
                    "linkedQuestionIds": ["q-pneumo-05", "q-pneumo-06", "q-pneumo-07"]
                },
                {
                    "id": "pneumo-asma-polmoniti",
                    "title": "Asma Bronchiale & Polmoniti (CAP Tipica vs Atipica)",
                    "category": "Patologia Infettiva & Ostruttiva",
                    "anatomy3dTarget": "bronchial-tree",
                    "audioEffect": "asthma-wheezing",
                    "videoEmbed": "f8q5iZ3eLso",
                    "highYieldSummary": {
                        "definizione": "Asma: malattia infiammatoria cronica eterogenea con iperreattività bronchiale e ostruzione variabile reversibile. Polmoniti (CAP): infezioni acute del parenchima polmonare acquisite in comunità.",
                        "segniCardine": "Asma: tosse secca notturna, dispnea accessionale, sibili espiratori, senso di costrizione toracica. CAP Tipica: febbre alta con brivido scuotente, tosse produttiva con espettorato rugginoso, dolore toracico puntorio. CAP Atipica: esordio insidioso, sintomi sistemici (cefalea, mialgie), tosse secca stizzosa.",
                        "diagnostica": "Asma: Test di reversibilità al salbutamolo (+12% e +200 mL di FEV1); Test di provocazione con metacolina/mannitolo per iperreattività. CAP: Rx torace (infiltrato lobare compatto con broncogramma aereo nella tipica vs infiltrato interstiziale/reticolare nella atipica).",
                        "terapia": "Asma: Strategia GINA SMART con ICS-Formoterolo al bisogno (step 1-2) o continuativo (step 3-5). CAP: Amoxicillina/Acido Clavulanico o Cefalosporina III gen + Macrolide (es. Azitromicina) per coprire i patogeni atipici intracellulari."
                    },
                    "clozeTokens": [
                        "test alla metacolina per la reattività bronchiale",
                        "test al salbutamolo per la reversibilità",
                        "CAP atipica con pattern interstiziale senza risparmio",
                        "espettorato rugginoso nello Streptococcus pneumoniae",
                        "score di CURB-65 per il ricovero",
                        "GINA SMART con budesonide formoterolo"
                    ],
                    "examTraps": [
                        "Il test al salbutamolo valuta la REVERSIBILITÀ, mentre i test di provocazione bronchiale (metacolina, mannitolo, sforzo) valutano l'IPERREATTIVITÀ bronchiale!",
                        "Nella CAP atipica (Mycoplasma, Chlamydia, Legionella) l'interstizio polmonare è il target primario: NON c'è affatto 'risparmio dell'interstizio'!",
                        "L'espettorato rugginoso (color mattone) è tipico e patognomonico dello Streptococcus pneumoniae nella fase di epatizzazione rossa."
                    ],
                    "fullText": """### ASMA BRONCHIALE & POLMONITI (Dispense 2FAST)
#### Diagnosi Funzionale dell'Asma
* **Test di Reversibilità:** Eseguito dopo spirometria basale con somministrazione di 4 puff di Salbutamolo (400 mcg). Positivo se incremento del FEV1 ≥ 12% E ≥ 200 mL dopo 15-20 minuti.
* **Test di Provocazione Bronchiale (Reattività):** Indicato quando la spirometria basale è normale.
  * Stimoli diretti: Metacolina (agonista colinergico muscarinico sui recettori M3). Calcolo della PD20 (dose provocativa che riduce il FEV1 del 20%).
  * Stimoli indiretti: Mannitolo per via inalatoria (osmolarità), test da sforzo fisico (iperventilazione).

#### Polmoniti Acquisite in Comunità (CAP)
* **CAP Tipica (Pneumococcica):**
  * Patogeno: *Streptococcus pneumoniae* (Diplococco Gram positivo capsulato). Spesso preceduta da infezione virale (es. Virus Influenzale di Tipo A).
  * Clinica: insorgenza iperacuta, febbre alta > 38.5°C con brivido scuotente, tosse produttiva con espettorato rugginoso (da stravaso eritrocitario).
  * E.O.: ottusità plessica circoscritta, aumento del FVT, soffio bronchiale patologico, rantoli crepitanti di inizio e fine risoluzione.
  * Rx Torace: consolidamento lobare/segmentario omogeneo con broncogramma aereo.
* **CAP Atipica:**
  * Patogeni: *Mycoplasma pneumoniae* (frequente in giovani e piccole comunità/epidemie scolastiche), *Chlamydophila pneumoniae*, *Legionella pneumophila*.
  * Clinica: esordio subacuto, febbre modesta, tosse secca e insistente, manifestazioni sistemiche (astenia, artralgie, mialgie, faringite, diarrea e iposodiemia da SIADH nella Legionella).
  * Discrepanza clinico-radiologica: E.O. toracico quasi muto ma Rx con evidenti infiltrati interstiziali reticolo-nodulari bilaterali.""",
                    "linkedQuestionIds": ["q-pneumo-01", "q-pneumo-02", "q-pneumo-25"]
                },
                {
                    "id": "pneumo-sarcoidosi-tbc",
                    "title": "Sarcoidosi, Interstiziopatie & Tubercolosi",
                    "category": "Malattie Granulomatose & Interstiziali",
                    "anatomy3dTarget": "thoracic-lymph-nodes",
                    "audioEffect": "lung-velcro-crackles",
                    "videoEmbed": "k4H7R2bQjYs",
                    "highYieldSummary": {
                        "definizione": "Sarcoidosi: malattia granulomatosa sistemica ad eziologia sconosciuta con granulomi epitelioidi non caseificanti. TBC: infezione cronica granulomatosa da Mycobacterium tuberculosis con necrosi caseosa centrale.",
                        "segniCardine": "Sarcoidosi: linfoadenopatia ilare bilaterale asintomatica, eritema nodoso, artralgie. Sindrome di Löfgren (adenopatia ilare bilaterale + eritema nodoso + artrite caviglie). Sindrome di Heerfordt (febbre uveo-parotidea + paralisi facciale VII). TBC: tosse persistente > 3 settimane, emottisi, febbricola serotina, sudorazioni notturne profuse, calo ponderale.",
                        "diagnostica": "Sarcoidosi: Rx torace con stadi di Scadding (Stadio 0: Rx torace normale con solo interessamento extratoracico; Stadio I: adenopatia ilare bilaterale isolata; Stadio II: adenopatia + infiltrati; Stadio III: solo infiltrati; Stadio IV: fibrosi). BAL: linfocitosi con rapporto CD4/CD8 elevato > 3.5. TBC: Mantoux, test IGRA (QuantiFERON), esame colturale su terreno di Lowenstein-Jensen ed esame microscopico con colorazione di Ziehl-Neelsen.",
                        "terapia": "Sarcoidosi: cortisonici sistemici (Prednisone) solo in caso di sintomi, stadio II-III evolutivo o localizzazioni d'organo nobili (cardiaca, oculare, SNC). TBC: quadruplice terapia per 2 mesi (Rifampicina, Isoniazide, Pirazinamide, Etambutolo) seguita da duplice terapia per 4 mesi (Rifampicina + Isoniazide)."
                    },
                    "clozeTokens": [
                        "stadio zero della sarcoidosi con manifestazioni extratoraciche",
                        "granulomi non caseificanti",
                        "rapporto CD4 su CD8 aumentato nel BAL della sarcoidosi",
                        "rapporto CD8 aumentato nella polmonite da ipersensibilità",
                        "sindrome di Lofgren con eritema nodoso",
                        "terapia RIPE nella tubercolosi"
                    ],
                    "examTraps": [
                        "Stadio 0 della Sarcoidosi: anomalie radiografiche toraciche TOTALMENTE ASSENTI con sole manifestazioni extra-toraciche (cute, occhi, fegato, milza).",
                        "Nel BAL: Sarcoidosi ha prevalenza di CD4+ (CD4/CD8 > 3.5); l'Alveolite Allergica Estrinseca (Polmone dell'agricoltore) ha prevalenza di CD8+ (CD4/CD8 invertito < 1.0).",
                        "La sindrome di Heerfordt associa: febbre, tumefazione parotidea bilaterale, uveite anteriore e paralisi del nervo facciale periferico (VII paio)."
                    ],
                    "fullText": """### SARCOIDOSI E TUBERCOLOSI (Dispense 2FAST)
#### Sarcoidosi: Stadi Radiologici di Scadding
* **Stadio 0:** Rx del torace perfettamente normale in presenza di sarcoidosi accertata istologicamente in sede extra-toracica (es. cute, linfonodi periferici, fegato).
* **Stadio I:** Linfoadenopatia ilare bilaterale (BHL) e mediastinica isolata, senza infiltrati parenchimali polmonari. Prognosi eccellente (risoluzione spontanea nell'80% dei casi).
* **Stadio II:** Linfoadenopatia ilare bilaterale ASSOCIATA a infiltrati polmonari parenchimali (pattern reticolo-micronodulare).
* **Stadio III:** Infiltrati parenchimali polmonari diffusi SENZA ingrandimento linfonodale ilare evidente (linfonodi regrediti).
* **Stadio IV:** Fibrosi polmonare irreversibile con distorsione dell'architettura bronchiale, bronchiectasie da trazione e quadro a 'favo d'api' (honeycombing).

#### Analisi del Liquido di Lavaggio Bronco-Alveolare (BAL)
* Nella **Sarcoidosi:** Linfocitosi marcata (spesso > 30-50% delle cellule totali) con netto predominio dei linfociti T helper **CD4+**. Il rapporto **CD4/CD8 è > 3.5** (ha valore fortemente suggestivo se associato al quadro clinico).
* Nell'**Alveolite Allergica Estrinseca (Polmonite da Ipersensibilità):** Linfocitosi ancor più elevata con marcato predominio dei linfociti T citotossici/soppressori **CD8+**, con conseguente **inversione del rapporto CD4/CD8 (< 1.0)**.""",
                    "linkedQuestionIds": ["q-pneumo-03", "q-pneumo-08"]
                }
            ]
        },
        {
            "id": "vascolare",
            "name": "Chirurgia Vascolare",
            "icon": "Activity",
            "description": "Aneurismi aortici, EVAR & Endoleak, dissezione aortica, arteriopatia periferica (AOCP), ischemia acuta, carotidi e flebologia.",
            "topics": [
                {
                    "id": "vasc-aneurismi-evar",
                    "title": "Aneurisma Aorta Addominale (AAA) & Endoleak",
                    "category": "Chirurgia Aortica",
                    "anatomy3dTarget": "abdominal-aorta",
                    "audioEffect": "vascular-turbulent-bruit",
                    "videoEmbed": "Z8f07Fh7J1E",
                    "highYieldSummary": {
                        "definizione": "Dilatazione permanente che interessa tutte e 3 le tonache vascolari con diametro > 3 cm o > 50% rispetto al calibro normale dell'aorta adiacente. Colpisce prevalentemente l'aorta sottorenale (95%).",
                        "segniCardine": "Massa pulsante espansibile addominale indolente (asintomatico fino alla rottura). Rottura: triade dolore addominale/lombare improvviso, massa pulsante, shock ipovolemico (rottura retroperitoneale più frequente).",
                        "diagnostica": "Ecocolordoppler per screening e monitoraggio; Angio-TC toraco-addomino-pelvica con mezzo di contrasto gold standard pre-operatorio per valutare il colletto aortico.",
                        "terapia": "Indicazione a riparazione chirurgica: diametro ≥ 5.5 cm negli uomini (≥ 5.0 cm nelle donne), o crescita rapida > 1 cm/anno o aneurisma sintomatico. Tecniche: Open Repair con protesi sintetica in Dacron vs EVAR con endoprotesi."
                    },
                    "clozeTokens": [
                        "diametro maggiore o uguale a 5.5 cm nell'uomo",
                        "interessa tutte e tre le tonache vascolari",
                        "endoleak di tipo 2 il più frequente da arterie lombari",
                        "endoleak di tipo 1 difetto di sigillo al colletto",
                        "rottura retroperitoneale nell'aneurisma sottorenale"
                    ],
                    "examTraps": [
                        "Definizione formale di aneurisma vero: coinvolge TUTTE E 3 LE TONACHE (intima, media, avventizia) con incremento > 50% o diametro > 3 cm.",
                        "L'Endoleak più frequente in assoluto è il Tipo II (da rifornimento retrogrado di arterie lombari o arteria mesenterica inferiore). Il Tipo I (difetto di sigillo al colletto) e il Tipo III (disconnessione o rottura della protesi) sono invece i più pericolosi ad alto rischio di rottura immediata!",
                        "Nell'AAA sottorenale la rottura avviene molto più frequentemente nello spazio retroperitoneale (che può temporaneamente tamponare l'emorragia) rispetto alla rottura libera intraperitoneale."
                    ],
                    "fullText": """### ANEURISMI AORTICI ED ENDOLEAK (Dispense 2FAST)
#### Criteri Diagnostici ed Anatomici
* **Aneurisma Vero:** Dilatazione focale permanente dell'aorta che coinvolge tutte e tre le pareti (intima, media, avventizia).
* Valore soglia convenzionale per l'aorta addominale: diametro trasverso ≥ 3.0 cm.
* **Indicazioni all'Intervento di Riparazione (Linee Guida ESVS):**
  * Diametro massimo ≥ 5.5 cm nel sesso maschile.
  * Diametro massimo ≥ 5.0 cm nel sesso femminile (perché le donne hanno diametri basali minori e maggior rischio di rottura a parità di calibro).
  * Crescita rapida dell'aneurisma: > 10 mm in 1 anno o > 5 mm in 6 mesi.
  * Qualsiasi aneurisma sintomatico (dolore lombare persistente, dolorabilità alla palpazione) o complicato.

#### Classificazione Completa degli Endoleak post-EVAR
* **Tipo I (Perdita da mancato sigillo agli estremi):**
  * *IA:* colletto prossimale aortico; *IB:* colletto distale iliaco.
  * Flusso ematico ad alta pressione nella sacca aneurismatica. Richiede **trattamento immediato** (estensioni, ballooning o cuffie aggiuntive).
* **Tipo II (Rifornimento retrogrado da vasi collaterali - IL PIÙ FREQUENTE):**
  * Sostenuto da flusso retrogrado dall'Arteria Mesenterica Inferiore (IMA) o dalle arterie lombari pervieti.
  * A bassa pressione. Spesso si risolve spontaneamente; si tratta (embolizzazione) solo se la sacca continua ad espandersi nel tempo.
* **Tipo III (Difetto strutturale dell'endoprotesi):**
  * Disconnessione modulare tra i moduli protesici o lacerazione del tessuto di copertura. Alta pressione -> Trattamento immediato.
* **Tipo IV (Porosità del tessuto graft):**
  * Trasudazione attraverso la trama della protesi nelle prime 48 ore; quasi scomparso con i materiali moderni.
* **Tipo V (Endotensione):**
  * Aumento della pressione della sacca e del suo diametro senza evidenza di flusso o stravaso di mezzo di contrasto all'Angio-TC.""",
                    "linkedQuestionIds": ["q-vasc-19", "q-vasc-27"]
                },
                {
                    "id": "vasc-aocp-ischemia",
                    "title": "Arteriopatia Periferica (AOCP), ABI & Ischemia Acuta",
                    "category": "Patologia Arteriosa Periferica",
                    "anatomy3dTarget": "peripheral-arteries",
                    "audioEffect": "vascular-turbulent-bruit",
                    "videoEmbed": "kLwZ5VqKk4s",
                    "highYieldSummary": {
                        "definizione": "AOCP: stenosi o occlusione aterosclerotica cronica delle arterie degli arti inferiori. Ischemia acuta: improvvisa interruzione della perfusione dell'arto causata da embolia o trombosi in situ.",
                        "segniCardine": "AOCP: claudicatio intermittens (dolore muscolare al polpaccio da sforzo che recede a riposo). Ischemia critica: dolore a riposo notturno che migliora a gamba declive, ulcere trofiche. Ischemia acuta (Le 6 P): Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia.",
                        "diagnostica": "Indice Caviglia-Braccio (ABI): normale 0.9-1.3; moderata 0.4-0.7; severa/ischemia critica < 0.4-0.5. Nel diabetico ABI > 1.4 per arterie incomprimibili calcificate. Ischemia acuta: Ecocolordoppler d'urgenza o Angio-TC.",
                        "terapia": "AOCP: esercizio fisico guidato, antiaggreganti, statine ad alta intensità; rivascolarizzazione endovascolare (PTA con pallone/stent) o chirurgica (Bypass femoro-popliteo). Ischemia acuta: eparina EV immediata + tromboembolectomia d'urgenza con Catetere di Fogarty."
                    },
                    "clozeTokens": [
                        "indice caviglia braccio ABI minore di 0.50 per arteriopatia severa",
                        "valori di ABI maggiori di 1.4 nel diabetico per calcificazioni",
                        "le sei P dell'ischemia acuta",
                        "catetere di Fogarty a palloncino per embolectomia",
                        "classificazione di Fontaine da uno a quattro"
                    ],
                    "examTraps": [
                        "ABI > 1.40 NON significa vasi sani, ma arterie rigide e non comprimibili per calcificazione della tonaca media (sclerosi di Monckeberg), frequente nei diabetici e nell'insufficienza renale cronica!",
                        "Il Catetere di Fogarty si usa per l'embolectomia nell'ischemia ACUTA d'arto, non per la TEA carotidea o l'aneurisma aortico!",
                        "Nella cura del piede diabetico con grave componente ischemica l'elastocompressione è ASSOLUTAMENTE CONTROINDICATA perché aggraverebbe l'ischemia tissutale distale."
                    ],
                    "fullText": """### AOCP ED ISCHEMIA ACUTA D'ARTO (Dispense 2FAST)
#### Stadiazione di Leriche-Fontaine dell'AOCP
* **Stadio I:** Asintomatico (presenza di lesione stenotica con polsi periferici ridotti ma nessun sintomo clinico soggettivo).
* **Stadio II (Claudicatio Intermittens):**
  * *IIa:* Claudicatio non invalidante (autonomia di marcia libera > 200 metri).
  * *IIb:* Claudicatio invalidante (autonomia di marcia severamente ridotta < 200 metri).
* **Stadio III:** Dolore ischemico continuo a riposo (prevalentemente notturno a piedi orizzontali nel letto; il paziente dorme con la gamba ciondoloni fuori dal letto per sfruttare la gravità).
* **Stadio IV:** Presenza di lesioni trofiche, necrosi e gangrena (secca o umida) delle dita o del tallone.
*(Stadi III e IV costituiscono la condizione di Ischemia Critica d'Arto).*

#### Interpretazione dell'Ankle-Brachial Index (ABI)
* $\\text{ABI} = \\frac{\\text{Pressione Sistolica alla Caviglia (tibiale post/pedidia)}}{\\text{Pressione Sistolica al Braccio (omerale)}}$
* **0.91 - 1.30:** Normale.
* **0.70 - 0.90:** Arteriopatia ostruttiva lieve.
* **0.40 - 0.70:** Arteriopatia ostruttiva moderata (corrisponde tipicamente allo stadio II).
* **< 0.40 - 0.50:** Arteriopatia severa / Ischemia critica con elevato rischio di perdita dell'arto.
* **> 1.40:** Arterie rigide, calcificate e non comprimibili (frequente nei diabetici); in tal caso l'ABI perde accuratezza e si valuta la pressione all'alluce (Toe-Brachial Index TBI).

#### Ischemia Acuta d'Arto e Catetere di Fogarty
* Insorgenza improvvisa (entro ore) dovuta a embolia cardiogena (FA, IMA recente, protesi valvolare) o trombosi locale acuta di arteria ateromasica.
* **Quadro Clinico delle '6 P':**
  1. *Pain* (dolore acuto, lacerante)
  2. *Pallor* (pallore ceruleo cutaneo)
  3. *Pulselessness* (assenza dei polsi periferici a valle)
  4. *Paresthesia* (formicolio e deficit di sensibilità)
  5. *Paralysis* (deficit motorio: segno di ischemia grave muscolare avanzata)
  6. *Poikilothermia* (arto freddo alla palpazione)
* **Trattamento d'urgenza:** Bolo di eparina EV (5000 UI) per impedire la propagazione distale del trombo. Embolectomia chirurgica d'urgenza mediante **Catetere di Fogarty** attraverso arteriotomia femorale o poplitea.""",
                    "linkedQuestionIds": ["q-vasc-17", "q-vasc-18"]
                },
                {
                    "id": "vasc-carotidi-flebologia",
                    "title": "Stenosi Carotidea, Furto Succlavia & Flebologia",
                    "category": "Tronchi Sovraortici & Vene",
                    "anatomy3dTarget": "carotid-arteries",
                    "audioEffect": "carotid-bruit",
                    "videoEmbed": "O_bJ7B-5dJc",
                    "highYieldSummary": {
                        "definizione": "Stenosi carotidea: aterosclerosi della biforcazione carotidea che causa TIA o ictus ischemico embolico. Flebologia: insufficienza venosa cronica degli arti inferiori e trombosi venosa profonda (TVP).",
                        "segniCardine": "Carotidi: TIA con amaurosi fugace omolaterale, emisindrome motoria/sensitiva controlaterale. Furto della succlavia: vertigini ed atassia scatenate dallo sforzo dell'arto superiore. Flebologia: varici safeniche, edema perimalleolare, segno di Homans (dolore al polpaccio alla dorsiflessione passiva del piede nella TVP).",
                        "diagnostica": "Ecocolordoppler TSA (misura stenosi secondo criteri NASCET ed ECST); Angio-TC o Angio-RM. Vena femorale decorre medialmente rispetto all'arteria femorale. Prova di Trendelenburg: clinostatismo per svuotamento, laccio alla coscia, poi ortostatismo.",
                        "terapia": "Carotidi: Tromboendoarterectomia (TEA) in pz sintomatici con stenosi > 70% (o > 50%) se rischio operatorio < 3%; CAS (Stenting carotideo) se alto rischio chirurgico o collo ostile. TVP: anticoagulazione orale con DOAC o eparina a basso peso molecolare."
                    },
                    "clozeTokens": [
                        "sindrome da furto della succlavia con vertigini",
                        "TEA indicata se rischio operatorio minore del 3%",
                        "vena femorale comune decorre medialmente",
                        "manovra di Trendelenburg prima clino e poi orto",
                        "segno di Homans nella TVP"
                    ],
                    "examTraps": [
                        "La vena femorale comune decorre MEDIALMENTE rispetto all'arteria femorale nel triangolo di Scarpa (regola NAV da laterale a mediale: Nervo, Arteria, Vena).",
                        "Sindrome da furto della succlavia: il sintomo neurologico più frequente in assoluto è la VERTIGINE (da insufficienza vertebro-basilare per inversione del flusso nell'arteria vertebrale omolaterale), NON l'emicrania!",
                        "La TEA carotidea ha indicazione se il rischio chirurgico perioperatorio del centro/chirurgo è rigorosamente < 3% nel paziente asintomatico e < 6% nel sintomatico."
                    ],
                    "fullText": """### CAROTIDI, FURTO DELLA SUCCLAVIA E FLEBOLOGIA (Dispense 2FAST)
#### Stenosi Carotidea e Criteri Chirurgici (NASCET)
* Localizzazione elettiva: bulbo carotideo e origine dell'arteria carotide interna (ICA).
* **Indicazione a TEA (Tromboendoarterectomia Carotidea):**
  * Paziente sintomatico (TIA o ictus non disabilitante negli ultimi 6 mesi): stenosi 70-99% (beneficio assoluto massimo) o 50-69% (beneficio moderato), purché il rischio operatorio previsto sia < 6%.
  * Paziente asintomatico: stenosi > 60-70% con aspettativa di vita > 5 anni e rischio perioperatorio < 3%.
* **CAS (Carotid Artery Stenting):** Alternativa alla TEA in caso di restenosi post-TEA, collo ostile (irradiazione, precedente chirurgia), paralisi del nervo laringeo ricorrente controlaterale o elevato rischio cardiochirurgico; richiede sempre sistemi di protezione embolica cerebrale a filtro.

#### Sindrome da Furto della Succlavia
* Stenosi od occlusione dell'arteria succlavia a monte (prossimalmente) dell'emergenza dell'arteria vertebrale.
* Quando il paziente utilizza l'arto superiore omolaterale, l'aumentata richiesta metabolica e la vasodilatazione periferica determinano un calo di pressione a valle della stenosi.
* L'arteria vertebrale omolaterale inverte il flusso sanguigno, 'rubando' sangue dal poligono di Willis e dal circolo vertebro-basilare per inviarlo al braccio.
* Sintomo principale: **vertigini**, instabilità dell'equilibrio, atassia, scotomi visivi e lipotimie accentuate dal movimento del braccio.

#### Flebologia & Prove Cliniche
* **Origine anatomica della Vena Grande Safena:** Anteriormente al malleolo mediale (tibiale) alla caviglia; risale lungo la faccia mediale della gamba e della coscia per gettarsi nella vena femorale comune all'inguine (crossetta safenica).
* **Manovra di Rima-Trendelenburg:**
  * Paziente supino (clinostatismo) con arto sollevato per favorire il deflusso venoso.
  * Applicazione di un laccio emostatico alla radice della coscia (al di sotto del punto di sbocco della safena).
  * Il paziente si alza in piedi (ortostatismo):
    * Se le vene si riempiono rapidamente solo dopo la rimozione del laccio: incontinenza della valvola ostiale safeno-femorale.
    * Se le vene si riempiono rapidamente dal basso verso l'alto prima di togliere il laccio: incontinenza delle vene perforanti.""",
                    "linkedQuestionIds": ["q-vasc-16", "q-vasc-20", "q-vasc-21", "q-vasc-30"]
                }
            ]
        }
    ]
}

theory_out = os.path.join(SRC_DATA, "theory.json")
with open(theory_out, "w", encoding="utf-8") as f:
    json.dump(theory_data, f, ensure_ascii=False, indent=2)

print(f"Theory database saved successfully to {theory_out}")
