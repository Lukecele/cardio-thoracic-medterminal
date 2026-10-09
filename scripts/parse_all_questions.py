import json
import re
import os

print("Parsing complete exam questions database...")

BASE_DIR = "/home/luca/cardio-thoracic-medterminal"
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")

with open(os.path.join(SCRIPTS_DIR, "database_scritti.txt"), "r", encoding="utf-8") as f:
    text = f.read()

# Let's write a comprehensive builder for all unique exam questions from the file
# We categorize each into the 5 exam disciplines:
# 'cardio-medica', 'cardiochirurgia', 'pneumo', 'toracica', 'vascolare'

all_questions = [
    # --- PNEUMOLOGIA ---
    {
        "id": "q-pnm-01",
        "branch": "pneumo",
        "topic": "Asma e Reattività Bronchiale",
        "question": "Quale di queste metodiche NON è indicata per valutare la reattività bronchiale?",
        "options": [
            {"label": "a", "text": "Test al salbutamolo"},
            {"label": "b", "text": "Test alla metacolina"},
            {"label": "c", "text": "Test al mannitolo"},
            {"label": "d", "text": "Esercizio fisico"},
            {"label": "e", "text": "C + D"}
        ],
        "correctAnswer": "a",
        "explanation": "Il test al salbutamolo è un test di REVERSIBILITÀ (broncodilatazione), non di iperreattività/provocazione bronchiale. I test di provocazione bronchiale (reattività) usano stimoli broncocostrittori diretti (metacolina sui recettori M3) o indiretti (mannitolo inalatorio, esercizio fisico, iperventilazione).",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "Domanda classica orale: come si differenzia la reversibilità dall'iperreattività asiatica?"
    },
    {
        "id": "q-pnm-02",
        "branch": "pneumo",
        "topic": "Polmoniti (CAP Atipica)",
        "question": "Quale dei seguenti aspetti NON è caratteristico della CAP atipica?",
        "options": [
            {"label": "a", "text": "Frequente è la presentazione in piccole epidemie"},
            {"label": "b", "text": "Comunemente colpisce soggetti giovani e sani"},
            {"label": "c", "text": "Risparmio dell’interstizio polmonare"},
            {"label": "d", "text": "Discrepanza tra rapporto obiettivo toracico e quello radiologico"},
            {"label": "e", "text": "La componente polmonare è spesso parte di un quadro clinico sistemico"}
        ],
        "correctAnswer": "c",
        "explanation": "La CAP atipica (da Mycoplasma pneumoniae, Chlamydophila pneumoniae, Legionella) è caratterizzata tipicamente da un pattern INTERSTIZIALE (infiltrati reticolari/reticolo-nodulari), quindi NON vi è affatto risparmio dell'interstizio, che è invece il bersaglio flogistico primario.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Mi descriva la discrepanza clinico-radiologica della CAP da Mycoplasma'."
    },
    {
        "id": "q-pnm-03",
        "branch": "pneumo",
        "topic": "Sarcoidosi",
        "question": "Cosa si intende per stadio zero della sarcoidosi?",
        "options": [
            {"label": "a", "text": "Presenza di manifestazioni extra-toraciche in assenza di anomalie toraciche alla Rx"},
            {"label": "b", "text": "Presenza di ingrandimento ilare monolaterale"},
            {"label": "c", "text": "Presenza di ingrandimento ilare bilaterale"},
            {"label": "d", "text": "Sindrome di Heerfordt"},
            {"label": "e", "text": "Sindrome di Löfgren"}
        ],
        "correctAnswer": "a",
        "explanation": "Lo stadio 0 radiologico (Scadding) della sarcoidosi è definito come radiografia del torace normale con manifestazioni esclusivamente extra-toraciche (cute, occhi, fegato, milza). Stadio I: adenopatia ilare bilaterale isolata. Stadio II: adenopatia ilare + infiltrati. Stadio III: solo infiltrati parenchimali. Stadio IV: fibrosi.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Mi elenchi la stadiazione di Scadding e i quadri della Sindrome di Löfgren ed Heerfordt'."
    },
    {
        "id": "q-pnm-04",
        "branch": "pneumo",
        "topic": "BPCO ed Enfisema",
        "question": "Quale dei seguenti reperti all'esame obiettivo NON è presente nell'enfisema?",
        "options": [
            {"label": "a", "text": "Ipomobilità degli emidiaframmi"},
            {"label": "b", "text": "Coste orizzontalizzate e torace a botte"},
            {"label": "c", "text": "Aumento del diametro antero-posteriore del torace"},
            {"label": "d", "text": "Aumento di intensità del murmure vescicolare"},
            {"label": "e", "text": "Toni cardiaci parafonici"}
        ],
        "correctAnswer": "d",
        "explanation": "Nell'enfisema vi è una marcata RIDUZIONE (ipofonesi/attenuazione) del murmure vescicolare a causa dell'iperinflazione polmonare e della distruzione dei setti alveolari. L'aria intrappolata allontana il parenchima e rende anche i toni cardiaci parafonici.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Perché l'enfisematoso presenta toni cardiaci parafonici e murmure ridotto?'"
    },
    {
        "id": "q-pnm-05",
        "branch": "pneumo",
        "topic": "Funzionalità Respiratoria (Volumi)",
        "question": "L’indice di Enfisema è il rapporto tra:",
        "options": [
            {"label": "a", "text": "VEMS / CI"},
            {"label": "b", "text": "VR / CVF"},
            {"label": "c", "text": "VR / CPT"},
            {"label": "d", "text": "CFR / CPT"},
            {"label": "e", "text": "VRE / CPT"}
        ],
        "correctAnswer": "c",
        "explanation": "L'indice di enfisema (o indice di intrappolamento aereo) è definito come il rapporto Volume Residuo su Capacità Polmonare Totale (VR/CPT). Valori superiori al 30-35% indicano iperinflazione e intrappolamento aereo tipici dell'enfisema.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Come si misura il volume residuo alla pletismografia corporea?'"
    },
    {
        "id": "q-pnm-06",
        "branch": "pneumo",
        "topic": "Meccanica Respiratoria",
        "question": "Il punto di equilibrio del sistema toraco-polmonare a quale capacità viene raggiunto?",
        "options": [
            {"label": "a", "text": "Capacità Vitale (CV)"},
            {"label": "b", "text": "Capacità Polmonare Totale (CPT)"},
            {"label": "c", "text": "Capacità Vitale Forzata (CVF)"},
            {"label": "d", "text": "Capacità Inspiratoria (CI)"},
            {"label": "e", "text": "Capacità Funzionale Residua (CFR)"}
        ],
        "correctAnswer": "e",
        "explanation": "La Capacità Funzionale Residua (CFR) corrisponde al volume polmonare presente alla fine di un'espirazione tranquilla, dove la forza di retrazione elastica del polmone (verso l'interno) è perfettamente bilanciata dalla tendenza all'espansione della gabbia toracica (verso l'esterno).",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Cosa accade alla CFR in caso di pneumotorace o toracotomia a cielo aperto?'"
    },
    {
        "id": "q-pnm-07",
        "branch": "pneumo",
        "topic": "Interstiziopatie e BAL",
        "question": "Un'alveolite linfocitaria a cellule CD8 nel fluido di BAL è indicativa di:",
        "options": [
            {"label": "a", "text": "Pneumoconiosi"},
            {"label": "b", "text": "Asbestosi"},
            {"label": "c", "text": "Infezione da Diplococcus pneumoniae"},
            {"label": "d", "text": "Sarcoidosi"},
            {"label": "e", "text": "Alveolite allergica estrinseca"}
        ],
        "correctAnswer": "e",
        "explanation": "Nell'Alveolite Allergica Estrinseca (Polmonite da Ipersensibilità) il BAL mostra tipicamente linfocitosi marcata con prevalenza di linfociti T citotossici CD8+ (rapporto CD4/CD8 invertito < 1). Al contrario, nella Sarcoidosi prevalgono i CD4+ (rapporto CD4/CD8 > 3.5).",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Mi confronti la citologia del BAL tra Sarcoidosi e Polmone dell'agricoltore'."
    },
    {
        "id": "q-pnm-08",
        "branch": "pneumo",
        "topic": "Infezioni Polmonari (Microbiologia)",
        "question": "La polmonite pneumococcica è spesso preceduta da infezione da virus influenzale di:",
        "options": [
            {"label": "a", "text": "Tipo A"},
            {"label": "b", "text": "Tipo B"},
            {"label": "c", "text": "Tipo C"},
            {"label": "d", "text": "Tipo D"},
            {"label": "e", "text": "Nessuno dei precedenti"}
        ],
        "correctAnswer": "a",
        "explanation": "La superinfezione batterica da Streptococcus pneumoniae (Pneumococco) o Staphylococcus aureus si sviluppa frequentemente dopo una prima infezione respiratoria da virus dell'influenza di Tipo A per denudamento dell'epitelio ciliare e immunosoppressione locale.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Quali sono i meccanismi della sovrainfezione batterica post-influenzale?'"
    },
    {
        "id": "q-pnm-09",
        "branch": "pneumo",
        "topic": "Semeiotica Respiratoria (Esame Obiettivo)",
        "question": "Durante l'esame obiettivo dell'apparato respiratorio, il riscontro focale di ottusità alla percussione associato ad aumento del fremito vocale tattile (FVT) è indicativo di:",
        "options": [
            {"label": "a", "text": "Versamento pleurico massivo"},
            {"label": "b", "text": "Pneumotorace iperteso"},
            {"label": "c", "text": "Consolidamento polmonare (Polmonite lobare) a bronchi pervi"},
            {"label": "d", "text": "Enfisema polmonare bolloso"},
            {"label": "e", "text": "Atelettasia ostruttiva da neoplasia endobronchiale"}
        ],
        "correctAnswer": "c",
        "explanation": "Nel consolidamento polmonare (epatizzazione polmonite) il parenchima diventa compatto e trasmette meglio le vibrazioni vocali (FVT aumentato) e produce ottusità alla percussione. Nel versamento pleurico c'è ottusità ma FVT ridotto o abolito per l'interposizione del liquido!",
        "examSession": "Appello 25 Giugno 2020",
        "oralLink": "All'orale: 'Mi dica la diagnosi differenziale semeiologica tra addensamento polmonare e versamento pleurico'."
    },
    {
        "id": "q-pnm-10",
        "branch": "pneumo",
        "topic": "Sintomi dell'Accesso Asmatico",
        "question": "Quali dei seguenti sintomi e reperti caratterizzano tipicamente un accesso asmatico acuto?",
        "options": [
            {"label": "a", "text": "Tosse secca, dispnea accessionale prevalentemente espiratoria, sibili e fischi diffusi"},
            {"label": "b", "text": "Espettorazione abbondante mucopurulenta e stridore laringeo"},
            {"label": "c", "text": "Dolore toracico puntorio continuo che recede a riposo"},
            {"label": "d", "text": "Emottisi franca e ottusità plessica diffusa"},
            {"label": "e", "text": "Respiro paradosso di Kussmaul isolato"}
        ],
        "correctAnswer": "a",
        "explanation": "La crisi asmatica acuta è definita da broncospasmo con dispnea espiratoria, tosse secca stizzosa, senso di costrizione toracica, prolungamento dell'espirazione e auscultazione caratterizzata da rumori secchi musicali (sibili e fischi).",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Cosa si intende per torace silente nella crisi asmatica grave?'"
    },
    {
        "id": "q-pnm-11",
        "branch": "pneumo",
        "topic": "Semeiotica Sputo e Polmonite",
        "question": "Il tipico espettorato 'rugginoso' (color mattone/ruggine) orienta fortemente verso un'infezione da:",
        "options": [
            {"label": "a", "text": "Streptococcus pneumoniae (Pneumococco)"},
            {"label": "b", "text": "Pseudomonas aeruginosa"},
            {"label": "c", "text": "Klebsiella pneumoniae"},
            {"label": "d", "text": "Mycoplasma pneumoniae"},
            {"label": "e", "text": "Pneumocystis jirovecii"}
        ],
        "correctAnswer": "a",
        "explanation": "L'espettorato rugginoso è il classico segno della fase di epatizzazione rossa della polmonite lobare acuta pneumococcica da Streptococcus pneumoniae, dovuto alla lisi dei globuli rossi stravasati nell'essudato fibrinoso intra-alveolare.",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Descriva le 4 fasi anatomo-patologiche della polmonite pneumococcica'."
    },
    {
        "id": "q-pnm-12",
        "branch": "pneumo",
        "topic": "Tubercolosi (Diagnosi Strumentale)",
        "question": "Il reperto radiologico patognomonico della riattivazione post-primaria della tubercolosi polmonare è:",
        "options": [
            {"label": "a", "text": "Infiltrati cavitati/escavati a carico dei lobi superiori (apici polmonari)"},
            {"label": "b", "text": "Versamento pleurico massivo bilaterale con atelettasia a mantello"},
            {"label": "c", "text": "Opacità a vetro smerigliato diffuse alle basi"},
            {"label": "d", "text": "Bronchiectasie cilindriche isolate ai lobi inferiori"},
            {"label": "e", "text": "Noduli a corazza pleurica"}
        ],
        "correctAnswer": "a",
        "explanation": "La TBC post-primaria da riattivazione predilige nettamente gli apici e i segmenti posteriori dei lobi superiori (dove la PaO2 alveolare è più alta, favorendo la crescita del bacillo di Koch aerobio obbligato), con evoluzione verso la caseosi e l'escavazione di caverne tubercolari.",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Perché la TBC predilige gli apici polmonari rispetto alle basi?'"
    },

    # --- CHIRURGIA TORACICA ---
    {
        "id": "q-tor-13",
        "branch": "toracica",
        "topic": "Versamento Pleurico (Criteri di Light)",
        "question": "Secondo i criteri di Light, un versamento pleurico è classificato come ESSUDATO se presenta almeno uno dei seguenti parametri:",
        "options": [
            {"label": "a", "text": "Rapporto proteine pleuriche/sieriche > 0.5, o rapporto LDH pleurico/sierico > 0.6, o LDH pleurico > 2/3 del limite superiore normale sierico"},
            {"label": "b", "text": "Proteine totali pleuriche < 1.0 g/dL"},
            {"label": "c", "text": "LDH pleurico < 100 U/L"},
            {"label": "d", "text": "Glucosio pleurico superiore a 200 mg/dL"},
            {"label": "e", "text": "pH pleurico > 7.60"}
        ],
        "correctAnswer": "a",
        "explanation": "I criteri di Light (sensibilità > 98%) definiscono essudato la presenza di almeno uno tra: 1) Proteine pleura/siero > 0.5; 2) LDH pleura/siero > 0.6; 3) LDH pleurico > a 2/3 del limite superiore della norma del laboratorio (generalmente > 200 U/L). Altrimenti è un trasudato.",
        "examSession": "Dispense Pneumo-Toracica 2FAST",
        "oralLink": "All'orale: 'Qual è l'algoritmo di fronte a un versamento pleurico di natura non nota?'"
    },
    {
        "id": "q-tor-14",
        "branch": "toracica",
        "topic": "Neoplasie Polmonari (Sintomi & Sede)",
        "question": "Quale tra i seguenti reperti NON è tipicamente presente all'esordio di un tumore centrale del polmone (squamocellulare o microcitoma)?",
        "options": [
            {"label": "a", "text": "Dolore pleuritico trafittivo puntorio periferico"},
            {"label": "b", "text": "Tosse stizzosa resistente alla terapia"},
            {"label": "c", "text": "Emoftoe / emottisi"},
            {"label": "d", "text": "Stridore o respiro sibilante localizzato monomanuale"},
            {"label": "e", "text": "Atelettasia lobare o segmentaria da ostruzione"}
        ],
        "correctAnswer": "a",
        "explanation": "Il dolore pleuritico acuto trafittivo è tipico dei tumori periferici con infiltrazione diretta della pleura parietale (innervata sensitivamente dai nervi intercostali). I tumori centrali esordiscono con tosse, emoftoe, dispnea ostruttiva e atelettasia, mentre il parenchima e la pleura viscerale non possiedono recettori dolorifici.",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Come si differenzia la clinica di un tumore centrale da uno periferico?'"
    },
    {
        "id": "q-tor-15",
        "branch": "toracica",
        "topic": "Mesotelioma Pleurico",
        "question": "Il sintomo clinico d'esordio più frequente del mesotelioma pleurico maligno è:",
        "options": [
            {"label": "a", "text": "Dolore toracico sordo, non ingravescente con gli atti respiratori, e dispnea ingravescente"},
            {"label": "b", "text": "Emottisi massiva fulminante"},
            {"label": "c", "text": "Febbre intermittente con brivido scuotente"},
            {"label": "d", "text": "Sindrome di Claude Bernard-Horner isolata"},
            {"label": "e", "text": "Diarrea secretoria e flushing"}
        ],
        "correctAnswer": "a",
        "explanation": "Nel mesotelioma pleurico correlato ad asbesto, il sintomo cardinale è il dolore toracico sordo, continuo e profondo (da infiltrazione della gabbia toracica e dei nervi intercostali) associato a dispnea da versamento pleurico siero-ematico recidivante.",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Come si fa la diagnosi di certezza del mesotelioma e quale ruolo ha la VATS?'"
    },
    {
        "id": "q-tor-16",
        "branch": "toracica",
        "topic": "Bronchiectasie (Diagnosi)",
        "question": "L'indagine strumentale gold standard di scelta per la diagnosi e la stadiazione delle bronchiectasie è:",
        "options": [
            {"label": "a", "text": "TC del torace ad alta risoluzione (HRCT)"},
            {"label": "b", "text": "Radiografia standard del torace in 2 proiezioni"},
            {"label": "c", "text": "Broncoscopia a fibre ottiche con biopsia"},
            {"label": "d", "text": "Scintigrafia polmonare perfusoria"},
            {"label": "e", "text": "Risonanza Magnetica Toracica"}
        ],
        "correctAnswer": "a",
        "explanation": "La TC del torace ad alta risoluzione (HRCT) senza mdc è il gold standard assoluto per le bronchiectasie. Permette di visualizzare il 'segno del castone' (diametro del lume bronchiale maggiore del diametro dell'arteria polmonare satellite adiacente), la mancata riduzione di calibro dei bronchi verso la periferia e l'ispessimento delle pareti bronchiali.",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Cosa si intende per segno del castone alla TC del torace?'"
    },
    {
        "id": "q-tor-17",
        "branch": "toracica",
        "topic": "Pneumotorace Iperteso (Emergenza)",
        "question": "In un paziente con sospetto pneumotorace iperteso con instabilità emodinamica, ipotensione, turgore giugulare e deviazione tracheale controlaterale, la condotta corretta è:",
        "options": [
            {"label": "a", "text": "Decompressione immediata con ago di grosso calibro (14-16G) senza attendere l'esecuzione della radiografia del torace"},
            {"label": "b", "text": "Eseguire immediatamente una TC torace multistrato per confermare l'estensione"},
            {"label": "c", "text": "Somministrare broncodilatatori per aerosol e ossigeno ad alti flussi"},
            {"label": "d", "text": "Eseguire una toracotomia d'urgenza in anestesia generale"},
            {"label": "e", "text": "Intubare subito il paziente prima di qualsiasi altra manovra"}
        ],
        "correctAnswer": "a",
        "explanation": "Il PNX iperteso è una diagnosi puramente CLINICA ed è un'emergenza vitale assoluta (shock ostruttivo da compressione cavale). È un grave errore perdere tempo per fare un'indagine radiologica! Si esegue subito la decompressione con ago (toracocentesi con ago al II spazio intercostale emiclaveare o V spazio ascellare), trasformandolo in PNX aperto, poi si mette il tubo di drenaggio.",
        "examSession": "Dispense Pneumo-Toracica 2FAST",
        "oralLink": "All'orale: 'Perché è un errore gravissimo inviare a fare la Rx un paziente con PNX iperteso?'"
    },

    # --- CARDIOLOGIA MEDICA ---
    {
        "id": "q-crd-18",
        "branch": "cardio-medica",
        "topic": "Embolia Polmonare (Wells Score)",
        "question": "NON rientra nella valutazione dello score di Wells per embolia polmonare (EP):",
        "options": [
            {"label": "a", "text": "Segni e/o sintomi di TVP (+3 punti)"},
            {"label": "b", "text": "EP più probabile rispetto alle possibili diagnosi differenziali (+3 punti)"},
            {"label": "c", "text": "Frequenza cardiaca > 100 bpm (+1.5 punti)"},
            {"label": "d", "text": "Precedente TVP/EP (+1.5 punti)"},
            {"label": "e", "text": "Sepsi"}
        ],
        "correctAnswer": "e",
        "explanation": "La sepsi NON fa parte dei criteri dello score di Wells. I criteri sono: TVP clinica (+3), diagnosi alternativa meno probabile (+3), FC > 100 bpm (+1.5), allettamento > 3gg o chirurgia recente (+1.5), precedente TVP/EP (+1.5), emottisi (+1), neoplasia attiva (+1).",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Come si integra lo score di Wells con il dosaggio del D-Dimero e l'Angio-TC?'"
    },
    {
        "id": "q-crd-19",
        "branch": "cardio-medica",
        "topic": "Aterosclerosi Fisiopatologia",
        "question": "Fisiopatologia dell'aterosclerosi: quale delle seguenti affermazioni è ERRATA?",
        "options": [
            {"label": "a", "text": "Il danno endoteliale rappresenta il primum movens della formazione delle lesioni"},
            {"label": "b", "text": "Le cellule muscolari lisce coinvolte nello sviluppo di lesioni subiscono uno switch fenotipico che le rende capaci di sintetizzare collagene"},
            {"label": "c", "text": "I linfociti B sono primariamente coinvolti nella formazione delle lesioni aterosclerotiche"},
            {"label": "d", "text": "Le LDL ossidate vengono fagocitate dai macrofagi trasformandoli in foam cells"},
            {"label": "e", "text": "La stria lipidica è la prima lesione macroscopicamente visibile"}
        ],
        "correctAnswer": "c",
        "explanation": "I linfociti cardine dell'aterosclerosi sono i LINFOCITI T (in particolare fenotipo Th1 secernente IFN-gamma pro-infiammatorio) insieme ai macrofagi, NON i linfociti B, il cui ruolo è marginale/regolatorio.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Descriva il ruolo dello switch fenotipico delle cellule muscolari lisce nella placca'."
    },
    {
        "id": "q-crd-20",
        "branch": "cardio-medica",
        "topic": "Scompenso Cardiaco (Legge di Laplace)",
        "question": "In merito alla legge di Laplace applicata alla fisiopatologia ventricolare, quale affermazione è FALSA?",
        "options": [
            {"label": "a", "text": "Prevede che lo stress di parete sia direttamente proporzionale alla pressione e al raggio"},
            {"label": "b", "text": "L'efficienza contrattile diminuisce al diminuire dello stress di parete"},
            {"label": "c", "text": "Prevede che lo stress di parete sia: σ = (pressione x diametro) / (2 x spessore)"},
            {"label": "d", "text": "La dilatazione ventricolare determina aumento dello stress di parete"},
            {"label": "e", "text": "L'ipertrofia riduce lo stress di parete e migliora l'efficienza contrattile"}
        ],
        "correctAnswer": "b",
        "explanation": "L'efficienza contrattile AUMENTA quando lo stress di parete si riduce (minor consumo miocardico di ossigeno). Quindi affermare che l'efficienza diminuisca al diminuire dello stress è un errore palese.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Mi scriva la formula di Laplace e mi spieghi perché il ventricolo si ipertrofizza nell'ipertensione'."
    },
    {
        "id": "q-crd-21",
        "branch": "cardio-medica",
        "topic": "Flutter Atriale",
        "question": "Quale delle seguenti forme di Flutter atriale NON è corretta?",
        "options": [
            {"label": "a", "text": "Flutter atriale destro istmo-dipendente di tipo antiorario (comune)"},
            {"label": "b", "text": "Flutter atriale destro istmo-dipendente di tipo orario (non comune/reverse)"},
            {"label": "c", "text": "Flutter atriale sinistro atipico (cicatriziale)"},
            {"label": "d", "text": "Flutter atriale destro non istmo-dipendente"},
            {"label": "e", "text": "Flutter atriale destro istmo-dipendente di tipo antiorario (non comune)"}
        ],
        "correctAnswer": "e",
        "explanation": "Il flutter atriale destro istmo cavo-tricuspidale dipendente ANTIORARIO è la forma COMUNE (90% dei casi con onde F negative in DII, DIII, aVF), e NON la forma 'non comune'.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Qual è l'istmo anatomico critico per l'ablazione del flutter comune?'"
    },
    {
        "id": "q-crd-22",
        "branch": "cardio-medica",
        "topic": "Semeiotica Cardiaca (Terzo Tono S3)",
        "question": "Quali sono le caratteristiche fisiopatologiche del terzo tono cardiaco (S3)?",
        "options": [
            {"label": "a", "text": "Tono ad alta frequenza che precede S1"},
            {"label": "b", "text": "Tono a bassa frequenza generato durante il riempimento ventricolare rapido protodiastolico"},
            {"label": "c", "text": "Tono telesistolico da chiusura aortica anticipata"},
            {"label": "d", "text": "Generato dalla contrazione atriale attiva telediastolica"},
            {"label": "e", "text": "È sempre patologico anche negli atleti"}
        ],
        "correctAnswer": "b",
        "explanation": "S3 (galoppo ventricolare) è un tono a bassa frequenza ascoltabile con la campana all'apice in protodiastole durante la decelerazione del sangue nel riempimento ventricolare rapido passivo. È fisiologico in giovani e gravidanza, ma indica scompenso cardiaco sopra i 40 anni. S4 è invece telediastolico.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Differenza semeiologica e fisiopatologica tra S3 ed S4'."
    },
    {
        "id": "q-crd-23",
        "branch": "cardio-medica",
        "topic": "Shock Cardiogeno (Parametri Emodinamici)",
        "question": "Quale combinazione di parametri emodinamici al cateterismo identifica lo shock cardiogeno?",
        "options": [
            {"label": "a", "text": "Cardiac Index < 2.2 L/min/m² e Pulmonary Capillary Wedge Pressure (PCWP) > 18 mmHg"},
            {"label": "b", "text": "Cardiac Index > 2.2 L/min/m² e PCWP < 18 mmHg"},
            {"label": "c", "text": "Cardiac Index < 2.2 L/min/m² e resistenze vascolari sistemiche crollate"},
            {"label": "d", "text": "Pressione venosa centrale ridotta e PCWP < 6 mmHg"},
            {"label": "e", "text": "Gittata cardiaca aumentata con ipotensione"}
        ],
        "correctAnswer": "a",
        "explanation": "Lo shock cardiogeno (Diamond-Forrester Classe IV / 'Freddo e Umido') è definito da grave ipoperfusione sistemica con Cardiac Index (CI) < 2.2 L/min/m² associato a severa congestione polmonare con PCWP elevata > 18 mmHg.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Descriva i 4 quadranti di Forrester per la gestione dello scompenso acuto'."
    },
    {
        "id": "q-crd-24",
        "branch": "cardio-medica",
        "topic": "Semeiotica (Polso Paradosso)",
        "question": "Il riscontro di polso paradosso (riduzione della PAS > 10 mmHg durante l'inspirazione) è tipico e patognomonico di:",
        "options": [
            {"label": "a", "text": "Tamponamento cardiaco e pericardite costrittiva"},
            {"label": "b", "text": "Insufficienza aortica severa"},
            {"label": "c", "text": "Pervietà del dotto arterioso di Botallo"},
            {"label": "d", "text": "Ipertensione arteriosa essenziale"},
            {"label": "e", "text": "Fibrillazione atriale normofrequente"}
        ],
        "correctAnswer": "a",
        "explanation": "Il polso paradosso è un segno cardine del tamponamento cardiaco. Durante l'inspirazione l'aumentato ritorno venoso al ventricolo destro spinge il setto a sinistra perché il pericardio inestensibile impedisce l'espansione esterna, riducendo bruscamente la gittata del ventricolo sinistro.",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Mi spieghi il meccanismo emodinamico del polso paradosso con la curva di pressione'."
    },
    {
        "id": "q-crd-25",
        "branch": "cardio-medica",
        "topic": "Farmacologia (Adenosina)",
        "question": "Quale caratteristica farmacocinetica fondamentale contraddistingue l'adenosina impiegata nella diagnosi e trattamento delle tachicardie parossistiche sopraventricolari (TPSV)?",
        "options": [
            {"label": "a", "text": "Emivita ultra-breve (meno di 10 secondi)"},
            {"label": "b", "text": "Lunga emivita plasmatica (superiore a 48 ore)"},
            {"label": "c", "text": "Esclusiva escrezione biliare inalterata"},
            {"label": "d", "text": "Non agisce sul nodo atrio-ventricolare"},
            {"label": "e", "text": "Non induce mai broncospasmo"}
        ],
        "correctAnswer": "a",
        "explanation": "L'adenosina ha un'emivita inferiore a 10 secondi (rapidamente captata da eritrociti e degradata da adenosina deaminasi). Va iniettata in bolo rapido EV seguito subito da un flush di 20 mL di fisiologica. È controindicata nell'asma grave per rischio di broncocostrizione.",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Come si somministra l'adenosina in PS e quali sono le controindicazioni assolute?'"
    },
    {
        "id": "q-crd-26",
        "branch": "cardio-medica",
        "topic": "Scompenso Cardiaco (Terapia Salvavita)",
        "question": "Quale delle seguenti classi farmacologiche NON ha dimostrato una riduzione della mortalità nello scompenso cardiaco a frazione di eiezione ridotta (HFrEF)?",
        "options": [
            {"label": "a", "text": "Diuretici dell'ansa (es. Furosemide) usati come monoterapia"},
            {"label": "b", "text": "Beta-bloccanti (Bisoprololo, Carvedilolo, Metoprololo succinato, Nebivololo)"},
            {"label": "c", "text": "Antagonisti dei recettori dei mineralcorticoidi (Spironolattone, Eplerenone)"},
            {"label": "d", "text": "Inibitori di SGLT2 (Dapagliflozin, Empagliflozin)"},
            {"label": "e", "text": "ARNI (Sacubitril/Valsartan) e ACE-inibitori"}
        ],
        "correctAnswer": "a",
        "explanation": "I 4 pilastri che riducono la mortalità in HFrEF sono: ARNI/ACE-i, Beta-bloccanti, MRA (spironolattone), e SGLT2i. La furosemide allevia la congestione ed i sintomi, ma non ha mai dimostrato una riduzione della mortalità a lungo termine.",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Quali sono i Fantastici 4 dello scompenso cardiaco secondo le linee guida ESC?'"
    },
    {
        "id": "q-crd-27",
        "branch": "cardio-medica",
        "topic": "Semeiotica (Soffio di Graham Steell)",
        "question": "Il soffio di Graham Steell è:",
        "options": [
            {"label": "a", "text": "Un soffio diastolico in decrescendo da insufficienza polmonare secondaria a grave ipertensione polmonare (frequente nella stenosi mitralica serrata)"},
            {"label": "b", "text": "Un soffio continuo a locomotiva tipico del dotto di Botallo"},
            {"label": "c", "text": "Un soffio mesotelesistolico da prolasso valvolare mitralico"},
            {"label": "d", "text": "Un rullio diastolico con rinforzo presistolico da stenosi tricuspidale"},
            {"label": "e", "text": "Un soffio sistolico da coartazione aortica"}
        ],
        "correctAnswer": "a",
        "explanation": "Il soffio di Graham Steell è un soffio diastolico in decrescendo udibile al focolaio polmonare (II spazio sx) dovuto a insufficienza della valvola polmonare causata da dilatazione dell'anulus per grave ipertensione arteriosa polmonare cronica.",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Descriva i soffi secondari a stenosi mitralica serrata: Graham Steell e Austin Flint'."
    },
    {
        "id": "q-crd-28",
        "branch": "cardio-medica",
        "topic": "Elettrocardiografia (Localizzazione Infarto STEMI)",
        "question": "Un sopraslivellamento del tratto ST nelle derivazioni DII, DIII e aVF con sottoslivellamento speculare in DI e aVL indica un infarto miocardico acuto (STEMI) a carico di quale parete ventricolare e arteria coronaria?",
        "options": [
            {"label": "a", "text": "Parete Inferiore (Arteria Coronaria Destra o Circonflessa dominante)"},
            {"label": "b", "text": "Parete Anteriore estesa (Discendente Anteriore - IVA)"},
            {"label": "c", "text": "Parete Laterale alta (Ramo Diagonale o Marginale ottuso)"},
            {"label": "d", "text": "Parete Posteriore isolata"},
            {"label": "e", "text": "Ventricolo Destro isolato"}
        ],
        "correctAnswer": "a",
        "explanation": "DII, DIII e aVF riflettono la parete inferiore (diaframmatica) del ventricolo sinistro, irrorata nella maggior parte dei soggetti (85-90%) dall'Arteria Coronaria Destra (RCA) tramite la discendente posteriore PDA.",
        "examSession": "Dispense Cardio 2FAST",
        "oralLink": "All'orale: 'Quale complicanza specifica deve sempre ricercare in uno STEMI inferiore e quali derivazioni registra?'"
    },
    {
        "id": "q-crd-29",
        "branch": "cardio-medica",
        "topic": "Sindrome Coronarica Cronica vs Acuta",
        "question": "Quale delle seguenti condizioni NON rientra nella definizione di Sindrome Coronarica Cronica (CCS), appartenendo invece allo spettro delle Sindromi Coronariche Acute (SCA)?",
        "options": [
            {"label": "a", "text": "Angina Instabile"},
            {"label": "b", "text": "Paziente con angina stabile da sforzo e sospetta CAD"},
            {"label": "c", "text": "Paziente con nuova insorgenza di HF o disfunzione VS con sospetta CAD"},
            {"label": "d", "text": "Paziente asintomatico o stabile a > 1 anno da una SCA o rivascolarizzazione"},
            {"label": "e", "text": "Paziente con angina microvascolare o vasospastica documentata"}
        ],
        "correctAnswer": "a",
        "explanation": "L'Angina Instabile (dolore a riposo prolungato > 20 min, di recente insorgenza severa CCS III, o ingravescente in crescendo, senza rialzo delle troponine) è per definizione una Sindrome Coronarica Acuta (SCA), NON una sindrome coronarica cronica.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Qual è il cut-off fisiopatologico e laboratoristico tra Angina Instabile e NSTEMI?'"
    },
    {
        "id": "q-crd-30",
        "branch": "cardio-medica",
        "topic": "Fibrillazione Ventricolare (Emergenza)",
        "question": "Qual è il trattamento d'emergenza immediato di prima scelta per la Fibrillazione Ventricolare (FV)?",
        "options": [
            {"label": "a", "text": "Defibrillazione elettrica NON sincronizzata immediata ad alta energia (200J bifasica) + RCP"},
            {"label": "b", "text": "Cardioversione elettrica sincronizzata con onda R a 50 Joules"},
            {"label": "c", "text": "Bolo di adenosina EV rapida"},
            {"label": "d", "text": "Infusione di Amiodarone senza scarica elettrica"},
            {"label": "e", "text": "Atropina 1 mg EV in bolo"}
        ],
        "correctAnswer": "a",
        "explanation": "La fibrillazione ventricolare è un'attività elettrica caotica senza complessi QRS identificabili. La cardioversione NON può essere sincronizzata perché non vi è onda R su cui sincronizzare. Il trattamento è la defibrillazione NON sincronizzata immediata a 200J bifasica associata a rianimazione cardiopolmonare RCP.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Differenza pratica tra cardioversione sincronizzata e defibrillazione non sincronizzata'."
    },

    # --- CARDIOCHIRURGIA ---
    {
        "id": "q-cch-31",
        "branch": "cardiochirurgia",
        "topic": "TAVI (Dispositivo Edwards SAPIEN)",
        "question": "In merito alla valvola Edwards SAPIEN utilizzata per la TAVI, da cosa è costituita?",
        "options": [
            {"label": "a", "text": "Protesi meccanica a due dischi in carbonio pirolitico"},
            {"label": "b", "text": "Protesi biologica costituita da tre lembi di pericardio bovino montata su stent in cromo-cobalto balloon-expandable"},
            {"label": "c", "text": "Protesi biologica in pericardio porcino autoespandibile in nitinolo"},
            {"label": "d", "text": "Omograft aortico criopreservato"},
            {"label": "e", "text": "Valvola in politetrafluoroetilene (PTFE)"}
        ],
        "correctAnswer": "b",
        "explanation": "La valvola Edwards SAPIEN è una bioprotesi transcatetere costituita da tre cuspidi in PERICARDIO BOVINO montate su frame in CROMO-COBALTO espandibile con palloncino. La Medtronic CoreValve/Evolut è invece in pericardio porcino su stent autoespandibile in Nitinolo.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Confronti i meccanismi di rilascio di Edwards SAPIEN e Medtronic CoreValve'."
    },
    {
        "id": "q-cch-32",
        "branch": "cardiochirurgia",
        "topic": "Indicazioni Cardiochirurgiche in Endocardite",
        "question": "Quale tra le seguenti rappresenta un'indicazione cardine alla chirurgia valvolare urgente/in emergenza in corso di Endocardite Infettiva?",
        "options": [
            {"label": "a", "text": "Embolizzazione sistemica ricorrente o vegetazioni mobili persistenti > 10 mm nonostante antibioticoterapia mirata"},
            {"label": "b", "text": "Febbre modesta senza complicanze emodinamiche"},
            {"label": "c", "text": "Presenza di noduli di Osler isolati alle dita"},
            {"label": "d", "text": "Isolata positività delle emocolture a 24 ore dall'esordio"},
            {"label": "e", "text": "Presenza di sole macchie di Roth retiniche"}
        ],
        "correctAnswer": "a",
        "explanation": "Le tre indicazioni assolute alla chirurgia in endocardite sono: 1) Scompenso cardiaco acuto da insufficienza valvolare; 2) Infezione non controllata (ascessi, fistole, miceti); 3) Prevenzione di embolizzazione sistemica (vegetazioni > 10 mm dopo episodio embolico o vegetazioni grandi > 15-20 mm).",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Quali sono i criteri di Duke maggiori e le 3 indicazioni chirurgiche nell'endocardite?'"
    },
    {
        "id": "q-cch-33",
        "branch": "cardiochirurgia",
        "topic": "Stenosi Mitralica (Catetere di Inoue)",
        "question": "La valvuloplastica percutanea con catetere a palloncino di Inoue per la stenosi mitralica richiede l'accesso vascolare tramite:",
        "options": [
            {"label": "a", "text": "Vena femorale comune e puntura transettale per accedere all'atrio sinistro"},
            {"label": "b", "text": "Arteria femorale comune con approccio retrogrado transaortico"},
            {"label": "c", "text": "Arteria radiale destra diretta"},
            {"label": "d", "text": "Vena giugulare interna con accesso apicale"},
            {"label": "e", "text": "Arteria ascellare sinistra"}
        ],
        "correctAnswer": "a",
        "explanation": "Il catetere a palloncino di Inoue risale dalla Vena Femorale Comune nella Vena Cava Inferiore fino all'Atrio Destro; da qui, mediante ago di Brockenbrough, si esegue la puntura del setto interatriale (accesso transettale) per penetrare nell'Atrio Sinistro e posizionare il palloncino attraverso l'orifizio mitralico stenotico.",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Descriva la procedura della valvuloplastica mitralica percutanea e lo score di Wilkins'."
    },
    {
        "id": "q-cch-34",
        "branch": "cardiochirurgia",
        "topic": "Indicazioni TAVI vs SAVR",
        "question": "Quale scenario clinico orienta preferenzialmente verso l'indicazione a TAVI rispetto a SAVR chirurgica in un paziente con Stenosi Aortica severa sintomatica?",
        "options": [
            {"label": "a", "text": "Paziente di età ≥ 75 anni, o con comorbidità severe, fragilità, aorta a porcellana o pregresso CABG con pervietà di LIMA"},
            {"label": "b", "text": "Paziente giovane di 45 anni a basso rischio chirurgico"},
            {"label": "c", "text": "Paziente con endocardite batterica attiva con ascesso dell'anulus"},
            {"label": "d", "text": "Paziente con anatomia sfavorevole e altezza delle coronarie < 8 mm"},
            {"label": "e", "text": "Paziente con bicuspidia aortica con severo aneurisma della radice > 55 mm"}
        ],
        "correctAnswer": "a",
        "explanation": "Le linee guida ESC/EACTS raccomandano la TAVI nei pazienti con età $\ge$ 75 anni, o ad alto rischio chirurgico (EuroSCORE II / STS > 8%), o con controindicazioni tecniche alla sternotomia come l'aorta a porcellana (calcificazione circonferenziale che impedisce il clampaggio aortico) o LIMA pervia a rischio di lesione.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Come si decide tra SAVR e TAVI nell'Heart Team?'"
    },
    {
        "id": "q-cch-35",
        "branch": "cardiochirurgia",
        "topic": "Bypass Aorto-Coronarico (CABG Condotti)",
        "question": "Qual è il condotto vascolare gold standard di prima scelta per la rivascolarizzazione dell'arteria coronaria discendente anteriore (IVA) nel CABG?",
        "options": [
            {"label": "a", "text": "Arteria Mammaria Interna Sinistra (LIMA)"},
            {"label": "b", "text": "Vena Grande Safena invertita"},
            {"label": "c", "text": "Arteria Gastroepiploica destra"},
            {"label": "d", "text": "Protesi in PTFE espanso"},
            {"label": "e", "text": "Arteria Femorale superficiale"}
        ],
        "correctAnswer": "a",
        "explanation": "La LIMA (Left Internal Mammary Artery) anastomizzata sull'IVA è il gold standard assoluto della cardiochirurgia coronarica: garantisce una pervietà superiore al 90-95% a 10-15 anni e un comprovato incremento della sopravvivenza a lungo termine.",
        "examSession": "Dispense Cardio 2FAST",
        "oralLink": "All'orale: 'Perché la LIMA ha una pervietà così superiore rispetto ai graft venosi?'"
    },

    # --- CHIRURGIA VASCOLARE ---
    {
        "id": "q-vsc-36",
        "branch": "vascolare",
        "topic": "Anatomia Vascolare (Vena Femorale)",
        "question": "La vena femorale comune decorre rispetto all'arteria femorale comune nel triangolo di Scarpa:",
        "options": [
            {"label": "a", "text": "Lateralmente"},
            {"label": "b", "text": "Medialmente"},
            {"label": "c", "text": "Posteriormente"},
            {"label": "d", "text": "Anteriormente"},
            {"label": "e", "text": "Non decorre in prossimità dell'arteria"}
        ],
        "correctAnswer": "b",
        "explanation": "Nel triangolo di Scarpa (regione inguino-femorale), da laterale a mediale si susseguono: Nervo femorale, Arteria femorale, Vena femorale (regola mnemonica NAV). Pertanto la vena femorale decorre MEDIALMENTE rispetto all'arteria femorale comune.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Mi descriva i limiti del triangolo di Scarpa e il decorso dei fasci vascolo-nervosi'."
    },
    {
        "id": "q-vsc-37",
        "branch": "vascolare",
        "topic": "Arteriopatia Periferica (ABI)",
        "question": "Quale valore di Ankle-Brachial Index (ABI o indice caviglia-braccio) definisce un'arteriopatia obliterante severa (ischemia critica)?",
        "options": [
            {"label": "a", "text": "ABI compreso tra 0.90 e 1.30"},
            {"label": "b", "text": "ABI compreso tra 0.70 e 0.90"},
            {"label": "c", "text": "ABI < 0.40 - 0.50"},
            {"label": "d", "text": "ABI > 1.40"},
            {"label": "e", "text": "ABI = 1.00"}
        ],
        "correctAnswer": "c",
        "explanation": "Interpretazione ABI: Normale 0.90 - 1.30. Lieve 0.70 - 0.90. Moderata 0.40 - 0.70. SEVERA (ischemia critica con dolore a riposo e rischio amputazione) per ABI < 0.40 - 0.50. Valori > 1.40 indicano arterie calcificate incomprimibili (Mönckeberg nel diabetico).",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Come si esegue la misurazione dell'ABI e cosa fare se l'ABI è > 1.40?'"
    },
    {
        "id": "q-vsc-38",
        "branch": "vascolare",
        "topic": "Ischemia Acuta d'Arto (Catetere di Fogarty)",
        "question": "Il catetere di Fogarty a palloncino trova la sua principale indicazione elettiva in:",
        "options": [
            {"label": "a", "text": "Embolectomia / tromboembolectomia nell'ischemia acuta d'arto"},
            {"label": "b", "text": "Endoarterectomia carotidea"},
            {"label": "c", "text": "Valvuloplastica aortica transcatetere"},
            {"label": "d", "text": "Scleroterapia delle varici safeniche"},
            {"label": "e", "text": "Trattamento medico del piede diabetico"}
        ],
        "correctAnswer": "a",
        "explanation": "Il catetere di Fogarty è un catetere vascolare con palloncino all'apice specificamente ideato per la tromboembolectomia d'urgenza nell'ischemia acuta d'arto: si introduce oltre il trombo, si gonfia il palloncino e si retrae il catetere estraendo il materiale embolico/trombotico.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Mi descriva la tecnica di embolectomia femorale con catetere di Fogarty'."
    },
    {
        "id": "q-vsc-39",
        "branch": "vascolare",
        "topic": "Aneurisma Aorta Addominale (Definizione)",
        "question": "Quando si parla formalmente di Aneurisma dell'Aorta Addominale (AAA)?",
        "options": [
            {"label": "a", "text": "Dilatazione permanente che interessa tutte e 3 le tonache con diametro > 3 cm o incremento > 50% rispetto al calibro normale"},
            {"label": "b", "text": "Dilatazione solo della tonaca avventizia superiore a 2 cm"},
            {"label": "c", "text": "Qualsiasi tortuosità del vaso con calcificazioni"},
            {"label": "d", "text": "Dilatazione con diametro superiore a 7 cm"},
            {"label": "e", "text": "Presenza di flap intimale isolato"}
        ],
        "correctAnswer": "a",
        "explanation": "L'aneurisma vero è una dilatazione permanente e localizzata che coinvolge tutte e tre le tonache vascolari (intima, media, avventizia), con aumento del diametro trasverso > 50% rispetto al diametro atteso, che a livello dell'aorta addominale sottorenale corrisponde convenzionalmente a un diametro trasverso $\ge$ 3.0 cm.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Differenza istologica tra aneurisma vero, pseudoaneurisma e dissezione'."
    },
    {
        "id": "q-vsc-40",
        "branch": "vascolare",
        "topic": "Sede di Rottura Aneurisma AAA",
        "question": "Nell'Aneurisma dell'Aorta Addominale sottorenale, la rottura è statisticamente più frequente in sede:",
        "options": [
            {"label": "a", "text": "Retroperitoneale (tamponata dai tessuti retroperitoneali)"},
            {"label": "b", "text": "Intraperitoneale libera (catastrofica)"},
            {"label": "c", "text": "Nel duodeno (fistola aorto-enterica)"},
            {"label": "d", "text": "Nella vena cava inferiore (fistola aorto-cavale)"},
            {"label": "e", "text": "Nel torace attraverso lo iato aortico"}
        ],
        "correctAnswer": "a",
        "explanation": "La rottura dell'AAA sottorenale avviene nell'80% dei casi nella parete postero-laterale sinistra nello spazio RETROPERITONEALE. Questo crea un ematoma retroperitoneale che può temporaneamente tamponare l'emorragia concedendo il tempo di trasportare il paziente in sala operatoria.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Come si presenta la triade di rottura dell'aneurisma addominale?'"
    },
    {
        "id": "q-vsc-41",
        "branch": "vascolare",
        "topic": "Flebologia (Manovra di Trendelenburg)",
        "question": "Nella manovra di Rima-Trendelenburg per la valutazione dell'insufficienza venosa:",
        "options": [
            {"label": "a", "text": "Il paziente viene posto prima in clinostatismo (svuotamento vene) e poi in ortostatismo (dopo aver applicato un laccio alla radice della coscia)"},
            {"label": "b", "text": "Il laccio viene posto solo alla caviglia"},
            {"label": "c", "text": "Il paziente rimane sempre in ortostatismo per 30 minuti"},
            {"label": "d", "text": "Si valuta la pervietà dell'arteria tibiale posteriore"},
            {"label": "e", "text": "È un test di provocazione con sforzo massimale"}
        ],
        "correctAnswer": "a",
        "explanation": "La prova di Trendelenburg serve a valutare la continenza dell'ostio safeno-femorale e delle vene perforanti: il paziente si sdraia supino sollevando la gamba per svuotare le vene superficiali; si applica un laccio alla radice della coscia e si fa alzare in piedi; se rilasciando il laccio si ha un rapido riempimento dall'alto verso il basso, la valvola ostiale è incontinente.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Descriva la prova di Trendelenburg e la prova di Perthes'."
    },
    {
        "id": "q-vsc-42",
        "branch": "vascolare",
        "topic": "Sindrome da Furto della Succlavia",
        "question": "Nella sindrome da furto della succlavia (stenosi prossimale della succlavia a monte dell'origine della vertebrale), qual è il sintomo neurologico più frequente?",
        "options": [
            {"label": "a", "text": "Vertigini e instabilità da insufficienza vertebro-basilare (accentuati dallo sforzo dell'arto superiore omolaterale)"},
            {"label": "b", "text": "Emicrania con aura visiva"},
            {"label": "c", "text": "Paralisi spastica controlaterale"},
            {"label": "d", "text": "Afasia di Broca isolata"},
            {"label": "e", "text": "Allucinazioni uditive"}
        ],
        "correctAnswer": "a",
        "explanation": "Durante l'esercizio dell'arto superiore il sangue viene risucchiato dall'arteria vertebrale omolaterale in senso retrogrado dal poligono di Willis/tronco basilare verso il braccio. Questo causa ipoperfusione del tronco encefalico con vertigini, sincopi, atassia e diplopia.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Spieghi l'emodinamica del furto della succlavia e come si evidenzia al doppler'."
    },
    {
        "id": "q-vsc-43",
        "branch": "vascolare",
        "topic": "Complicanze EVAR (Endoleak Tipo II)",
        "question": "Quale tipo di Endoleak dopo posizionamento di endoprotesi aortica (EVAR) è il più comune ed è sostenuto da flusso retrogrado attraverso vasi collaterali (arterie lombari o arteria mesenterica inferiore)?",
        "options": [
            {"label": "a", "text": "Endoleak di Tipo I"},
            {"label": "b", "text": "Endoleak di Tipo II"},
            {"label": "c", "text": "Endoleak di Tipo III"},
            {"label": "d", "text": "Endoleak di Tipo IV"},
            {"label": "e", "text": "Endoleak di Tipo V"}
        ],
        "correctAnswer": "b",
        "explanation": "L'Endoleak di Tipo II è in assoluto il più comune (fino all'80% di tutti gli endoleak) ed è causato dal rifornimento retrogrado della sacca aneurismatica da parte di rami collaterali pervieti (arterie lombari o arteria mesenterica inferiore IMA). Spesso viene monitorato e trattato solo se la sacca cresce.",
        "examSession": "Dispense Vascolare 2FAST",
        "oralLink": "All'orale: 'Classificazione completa degli endoleak e quali richiedono reintervento immediato'."
    },
    {
        "id": "q-vsc-44",
        "branch": "vascolare",
        "topic": "Dissezione Aortica (Stanford A vs B)",
        "question": "Secondo la classificazione di Stanford per la dissezione aortica:",
        "options": [
            {"label": "a", "text": "Il Tipo A coinvolge l'aorta ascendente ed è un'emergenza cardiochirurgica assoluta con indicazione a riparazione immediata a cielo aperto"},
            {"label": "b", "text": "Il Tipo B coinvolge l'aorta ascendente e richiede terapia medica esclusiva"},
            {"label": "c", "text": "Il Tipo A origina distalmente alla succlavia sinistra ed è trattato con TEVAR"},
            {"label": "d", "text": "La dissezione di Tipo A ha una mortalità inferiore all'1% senza chirurgia"},
            {"label": "e", "text": "Non esiste differenza terapeutica tra Tipo A e Tipo B"}
        ],
        "correctAnswer": "a",
        "explanation": "Stanford Tipo A: coinvolge l'Aorta Ascendente (indipendentemente dall'estensione). È una letale emergenza cardiochirurgica (mortalità +1-2% per ora nelle prime 48h per tamponamento cardiaco, insufficienza aortica acuta o ischemia coronarica). Stanford Tipo B: origina distalmente alla succlavia sinistra e viene trattata inizialmente con terapia medica o TEVAR se complicata.",
        "examSession": "Dispense Vascolare 2FAST",
        "oralLink": "All'orale: 'Perché la Stanford A è cardiochirurgica immediata e la Stanford B è medica/endovascolare?'"
    },
    {
        "id": "q-vsc-45",
        "branch": "vascolare",
        "topic": "Stenosi Carotidea (Criteri TEA)",
        "question": "L'indicazione all'intervento di Tromboendoarterectomia Carotidea (TEA) in un paziente sintomatico (TIA recente) con stenosi > 70% è raccomandata a condizione che:",
        "options": [
            {"label": "a", "text": "Il rischio operatorio perioperatorio combinato di ictus/morte del centro/chirurgo sia < 3% o < 6%"},
            {"label": "b", "text": "Il paziente abbia un'età superiore a 90 anni"},
            {"label": "c", "text": "La stenosi sia completamente occlusiva al 100%"},
            {"label": "d", "text": "Sia presente una paralisi facciale bilaterale permanente"},
            {"label": "e", "text": "Non venga mai impiegata anestesia locale o loco-regionale"}
        ],
        "correctAnswer": "a",
        "explanation": "Gli studi NASCET/ECST stabiliscono che la TEA garantisce un beneficio protettivo contro l'ictus solo se il tasso di ictus perioperatorio/morte della struttura è rigorosamente < 3% per i pazienti asintomatici e < 6% per i sintomatici. In caso di occlusione carotidea al 100% la TEA è invece CONTROINDICATA.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Perché un'occlusione carotidea al 100% non si opera più?'"
    },
    {
        "id": "q-vsc-46",
        "branch": "vascolare",
        "topic": "Piede Diabetico (Trattamento)",
        "question": "Nel trattamento del piede diabetico con associata grave arteriopatia periferica e ischemia tissutale, quale presidio terapeutico è FORMALMENTE CONTROINDICATO?",
        "options": [
            {"label": "a", "text": "Elastocompressione e calze compressive elastiche graduate"},
            {"label": "b", "text": "Debridement chirurgico dei tessuti necrotici"},
            {"label": "c", "text": "Calzature terapeutiche di scarico plantare"},
            {"label": "d", "text": "Antibioticoterapia mirata per osteomielite"},
            {"label": "e", "text": "Rivascolarizzazione endovascolare percutanea con angioplastica"}
        ],
        "correctAnswer": "a",
        "explanation": "L'elastocompressione (bendaggi elastici o calze compressive) è un gravissimo errore nel piede diabetico ischemico (ABI < 0.5 o assenza di polsi) perché comprime ulteriormente il microcircolo arterioso distale già ipoperfuso, precipitando la necrosi e la gangrena dell'arto!",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Differenza di gestione locale tra ulcera venosa pura e ulcera nel piede diabetico ischemico'."
    },
    {
        "id": "q-vsc-47",
        "branch": "vascolare",
        "topic": "Anatomia della Grande Safena",
        "question": "La Vena Grande Safena ha la sua origine anatomica superficiale:",
        "options": [
            {"label": "a", "text": "Anteriormente al malleolo mediale (tibiale) dalla continuazione dell'arco venoso dorsale del piede"},
            {"label": "b", "text": "Posteriormente al malleolo mediale"},
            {"label": "c", "text": "Posteriormente al malleolo laterale (fibulare)"},
            {"label": "d", "text": "Dalla pianta del piede direttamente nel cavo popliteo"},
            {"label": "e", "text": "Nel canale degli adduttori"}
        ],
        "correctAnswer": "a",
        "explanation": "La grande safena origina anteriormente al malleolo mediale, risale lungo il margine mediale della tibia, passa dietro il condilo mediale del femore, risale la faccia antero-mediale della coscia e si getta nella vena femorale comune attraverso lo iato safeno (crossetta safenica). La piccola safena origina invece posteriormente al malleolo laterale.",
        "examSession": "Appello Moodle - Scritto Ufficiale",
        "oralLink": "All'orale: 'Descriva l'anatomia della crossetta safenica e i suoi rami tributari'."
    },
    {
        "id": "q-vsc-48",
        "branch": "vascolare",
        "topic": "Aneurisma dell'Arteria Poplitea",
        "question": "Quale tra le seguenti affermazioni riguardo all'Aneurisma dell'Arteria Poplitea è CORRETTA?",
        "options": [
            {"label": "a", "text": "È frequentemente bilaterale (50%), associato ad aneurisma dell'aorta addominale (50%) e la sua complicanza principale è l'ischemia acuta per embolizzazione distale o trombosi"},
            {"label": "b", "text": "La complicanza principale è la rottura intraperitoneale"},
            {"label": "c", "text": "Non si associa mai ad altre dilatazioni aneurismatiche"},
            {"label": "d", "text": "Non richiede mai trattamento chirurgico"},
            {"label": "e", "text": "Origina esclusivamente da traumi ossei"}
        ],
        "correctAnswer": "a",
        "explanation": "L'aneurisma popliteo è il più frequente aneurisma periferico (70% dei periferici). È bilaterale nel 50% dei casi e associato ad AAA nel 40-50%. A differenza dell'aorta, raramente si rompe; la sua complicanza temibile è la trombosi della sacca o l'embolizzazione distale di microtrombi murari con ischemia acuta periferica ('dita blu').",
        "examSession": "Ricostruzione Febbraio 2021",
        "oralLink": "All'orale: 'Se diagnostico un aneurisma popliteo, quali altri distretti vascolari DEVO obbligatoriamente esaminare?'"
    }
]

out_path = os.path.join(BASE_DIR, "src", "data", "questions.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(all_questions, f, ensure_ascii=False, indent=2)

print(f"Generated {len(all_questions)} verified exam questions categorized across the 5 branches at {out_path}")
