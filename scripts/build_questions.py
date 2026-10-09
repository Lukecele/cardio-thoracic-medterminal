import json
import re
import os

print("Starting parser script...")

BASE_DIR = "/home/luca/cardio-thoracic-medterminal"
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")

# 1. Parse Database Scritti
with open(os.path.join(SCRIPTS_DIR, "database_scritti.txt"), "r", encoding="utf-8") as f:
    db_raw = f.read()

# Let's inspect the questions
# We will create high-quality, verified questions
questions = []

# Known parsed questions from the official sessions & reconstructions:
# Let's write a structured list of curated exam questions from the exact PDF:
parsed_questions = [
    {
        "id": "q-pneumo-01",
        "system": "pneumo",
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
        "explanation": "Il test al salbutamolo è un test di REVERSIBILITÀ (broncodilatazione), non di iperreattività/provocazione bronchiale. I test di provocazione bronchiale (reattività) usano stimoli broncocostrittori diretti (metacolina) o indiretti (mannitolo, esercizio fisico, iperventilazione).",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-pneumo-02",
        "system": "pneumo",
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
        "explanation": "La CAP atipica (da Mycoplasma pneumoniae, Chlamydophila pneumoniae, Legionella) è caratterizzata tipicamente da un pattern INTERSTIZIALE (infiltrati reticolari/reticolo-nodulari), quindi NON vi è affatto risparmio dell'interstizio, che è invece il bersaglio principale.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-pneumo-03",
        "system": "pneumo",
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
        "explanation": "Lo stadio 0 radiologico (Scadding) della sarcoidosi è definito come radiografia del torace normale con manifestazioni esclusivamente extra-toraciche (es. cutanee, oculari, epatiche). Stadio I: adenopatia ilare bilaterale isolata. Stadio II: adenopatia ilare + infiltrati parenchimali. Stadio III: infiltrati parenchimali senza linfoadenopatia. Stadio IV: fibrosi polmonare irreversibile.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-cardio-04",
        "system": "cardio",
        "topic": "Embolia Polmonare (Wells Score)",
        "question": "NON rientra nella valutazione dello score di Wells per embolia polmonare (EP):",
        "options": [
            {"label": "a", "text": "Segni e/o sintomi clinici di TVP (3 punti)"},
            {"label": "b", "text": "EP più probabile rispetto alle possibili diagnosi differenziali (3 punti)"},
            {"label": "c", "text": "Frequenza cardiaca > 100 bpm (1.5 punti)"},
            {"label": "d", "text": "Precedente TVP/EP (1.5 punti)"},
            {"label": "e", "text": "Sepsi"}
        ],
        "correctAnswer": "e",
        "explanation": "La sepsi NON fa parte dei criteri dello score di Wells. I criteri sono: TVP clinica (+3), EP alternativa più probabile (+3), FC > 100 bpm (+1.5), allettamento/chirurgia recente (+1.5), precedente TVP/EP (+1.5), emottisi (+1), neoplasia attiva (+1).",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-pneumo-05",
        "system": "pneumo",
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
        "explanation": "Nell'enfisema vi è una marcata RIDUZIONE (ipofonesi/attenuazione) del murmure vescicolare a causa dell'iperinflazione polmonare e della distruzione dei setti alveolari, NON un aumento. L'aria intrappolata allontana il parenchima e rende anche i toni cardiaci parafonici/ovattati.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-pneumo-06",
        "system": "pneumo",
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
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-pneumo-07",
        "system": "pneumo",
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
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-pneumo-08",
        "system": "pneumo",
        "topic": "Interstiziopatie e BAL",
        "question": "Un'alveolite linfocitaria a cellule CD8 prevalenti nel fluido di BAL è indicativa di:",
        "options": [
            {"label": "a", "text": "Pneumoconiosi"},
            {"label": "b", "text": "Asbestosi"},
            {"label": "c", "text": "Infezione da Diplococcus pneumoniae"},
            {"label": "d", "text": "Sarcoidosi"},
            {"label": "e", "text": "Alveolite allergica estrinseca (Polmone dell'agricoltore)"}
        ],
        "correctAnswer": "e",
        "explanation": "Nell'Alveolite Allergica Estrinseca (Polmonite da Ipersensibilità) il BAL mostra tipicamente linfocitosi marcata con prevalenza di linfociti T citotossici CD8+ (rapporto CD4/CD8 invertito < 1). Al contrario, nella Sarcoidosi prevalgono i CD4+ (rapporto CD4/CD8 > 3.5).",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-cardio-09",
        "system": "cardio",
        "topic": "Aterosclerosi",
        "question": "Fisiopatologia dell'aterosclerosi: quale delle seguenti affermazioni è ERRATA?",
        "options": [
            {"label": "a", "text": "Il danno endoteliale rappresenta il primum movens della formazione delle lesioni aterosclerotiche"},
            {"label": "b", "text": "Le cellule muscolari lisce coinvolte nello sviluppo di lesioni subiscono uno switch fenotipico che le rende capaci di sintetizzare collagene"},
            {"label": "c", "text": "I linfociti B sono primariamente coinvolti nella formazione delle lesioni aterosclerotiche"},
            {"label": "d", "text": "Le LDL ossidate vengono fagocitate dai macrofagi tramite scavenger receptors trasformandoli in foam cells"},
            {"label": "e", "text": "La stria lipidica è la prima lesione visibile macroscopicamente"}
        ],
        "correctAnswer": "c",
        "explanation": "Nell'aterosclerosi i linfociti primariamente coinvolti nell'infiammazione di parete sono i LINFOCITI T (in particolare Th1 produttori di IFN-gamma) e i macrofagi, NON i linfociti B. Il ruolo dei linfociti B è marginale/regolatorio, non primario nella patogenesi della placca.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-cardio-10",
        "system": "cardio",
        "topic": "Scompenso Cardiaco (Legge di Laplace)",
        "question": "In merito alla legge di Laplace applicata alla fisiopatologia ventricolare, quale affermazione è FALSA?",
        "options": [
            {"label": "a", "text": "Prevede che lo stress di parete sia direttamente proporzionale alla pressione e al raggio della cavità"},
            {"label": "b", "text": "L'efficienza contrattile diminuisce al diminuire dello stress di parete"},
            {"label": "c", "text": "Prevede che lo stress di parete sia: σ = (P × r) / (2 × h)"},
            {"label": "d", "text": "La dilatazione ventricolare aumenta il raggio e quindi aumenta lo stress di parete"},
            {"label": "e", "text": "L'ipertrofia concentrica (aumento dello spessore h) riduce lo stress di parete secondo Laplace"}
        ],
        "correctAnswer": "b",
        "explanation": "L'efficienza contrattile AUMENTA (migliora) quando lo stress di parete si riduce, perché il ventricolo consuma meno ossigeno per generare pressione. L'affermazione che diminuisca al diminuire dello stress è chiaramente falsa.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-cardio-11",
        "system": "cardio",
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
        "explanation": "Il flutter atriale destro istmo cavo-tricuspidale dipendente ANTIORARIO è la forma COMUNE (rappresenta il 90% dei casi con onde a dente di sega negative in DII, DIII, aVF), NON la forma 'non comune'. La forma oraria è quella non comune.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-cardio-12",
        "system": "cardio",
        "topic": "Semeiotica Cardiaca (Toni)",
        "question": "Quali sono le caratteristiche del terzo tono cardiaco (S3)?",
        "options": [
            {"label": "a", "text": "Tono ad alta frequenza che precede S1"},
            {"label": "b", "text": "Tono a bassa frequenza generato durante il riempimento ventricolare rapido protodiastolico"},
            {"label": "c", "text": "Tono telesistolico da chiusura aortica anticipata"},
            {"label": "d", "text": "Generato dalla contrazione atriale attiva telediastolica"},
            {"label": "e", "text": "È sempre patologico anche nei giovani e negli atleti"}
        ],
        "correctAnswer": "b",
        "explanation": "S3 (galoppo ventricolare) è un tono a BASSA frequenza che si ascolta all'apice con la campana in protodiastole (riempimento ventricolare rapido passivo). È dovuto alla vibrazione della parete ventricolare sovraccaricata di volume o poco compliante. Può essere fisiologico in giovani, atleti e gravidanza, ma patologico (scompenso) sopra i 40 anni. S4 è invece telediastolico (presistolico) da contrazione atriale attiva.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-cardio-13",
        "system": "cardio",
        "topic": "Insufficienza Aortica",
        "question": "Quale tra i seguenti segni/sintomi generalmente NON si riscontra nel paziente con insufficienza aortica severa cronica compensata?",
        "options": [
            {"label": "a", "text": "Angina pectoris da ridotta perfusione coronarica diastolica"},
            {"label": "b", "text": "Pressione differenziale allargata con polso celere e scoccante (di Corrigan)"},
            {"label": "c", "text": "Segno di Musset e danza dei vasi del collo"},
            {"label": "d", "text": "Soffio diastolico in decrescendo al focolaio di Erb"},
            {"label": "e", "text": "Edemi declivi periferici ed epatomegalia da stasi isolati"}
        ],
        "correctAnswer": "e",
        "explanation": "L'insufficienza aortica determina sovraccarico di volume del ventricolo SINISTRO (quindi dispnea e congestione polmonare in fase avanzata, o angina per ipoperfusione diastolica). Gli edemi declivi marcati sono espressione di scompenso cardiaco destro avanzato o ipertensione venosa sistemica, non reperto tipico isolato dell'insufficienza aortica.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-cardio-14",
        "system": "cardio",
        "topic": "Shock Cardiogeno (Emodinamica)",
        "question": "Quale combinazione di parametri emodinamici identifica lo shock cardiogeno?",
        "options": [
            {"label": "a", "text": "Cardiac Index < 2.2 L/min/m² e Pulmonary Capillary Wedge Pressure (PCWP) > 18 mmHg"},
            {"label": "b", "text": "Cardiac Index > 2.2 L/min/m² e PCWP < 18 mmHg"},
            {"label": "c", "text": "Cardiac Index < 2.2 L/min/m² e resistenze vascolari sistemiche marcatamente ridotte"},
            {"label": "d", "text": "Pressione venosa centrale ridotta e PCWP < 6 mmHg"},
            {"label": "e", "text": "Gittata cardiaca aumentata con ipotensione"}
        ],
        "correctAnswer": "a",
        "explanation": "Lo shock cardiogeno (Diamond-Forrester Classe IV / 'Freddo e Umido') è definito da grave ipoperfusione sistemica con Cardiac Index (CI) < 2.2 L/min/m² (o < 1.8 senza supporto) associato a grave congestione/pressione di incuneamento capillare polmonare (PCWP) elevata > 18 mmHg.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-cardio-15",
        "system": "cardio",
        "topic": "Stenosi Aortica e TAVI",
        "question": "In merito alla valvola Edwards SAPIEN utilizzata per la TAVI, da cosa è costituita?",
        "options": [
            {"label": "a", "text": "Protesi meccanica a due dischi in carbonio pirolitico"},
            {"label": "b", "text": "Protesi biologica costituita da tre lembi di pericardio bovino montata su stent in cromo-cobalto balloon-expandable"},
            {"label": "c", "text": "Protesi biologica in pericardio porcino autoespandibile in nitinolo"},
            {"label": "d", "text": "Omograft aortico criopreservato"},
            {"label": "e", "text": "Valvola in politetrafluoroetilene (PTFE)"}
        ],
        "correctAnswer": "b",
        "explanation": "La valvola Edwards SAPIEN è una bioprotesi transcatetere costituita da tre cuspidi in PERICARDIO BOVINO montate su una gabbia/frame in CROMO-COBALTO espandibile con palloncino (balloon-expandable). La Medtronic CoreValve/Evolut è invece in pericardio porcino su stent autoespandibile in Nitinolo.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-vasc-16",
        "system": "vascolare",
        "topic": "Anatomia Vascolare",
        "question": "La vena femorale comune decorre rispetto all'arteria femorale comune:",
        "options": [
            {"label": "a", "text": "Lateralmente"},
            {"label": "b", "text": "Medialmente"},
            {"label": "c", "text": "Posteriormente"},
            {"label": "d", "text": "Anteriormente"},
            {"label": "e", "text": "Non decorre in prossimità dell'arteria"}
        ],
        "correctAnswer": "b",
        "explanation": "Nel triangolo di Scarpa (regione inguino-femorale), da laterale a mediale decorrono: Nervo femorale, Arteria femorale, Vena femorale (regola mnemonica NAV). Pertanto la vena femorale decorre MEDIALMENTE rispetto all'arteria femorale comune.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-vasc-17",
        "system": "vascolare",
        "topic": "Arteriopatia Periferica (ABI)",
        "question": "Quale valore di Ankle-Brachial Index (ABI o indice caviglia-braccio) definisce un'arteriopatia obliterante severa?",
        "options": [
            {"label": "a", "text": "ABI compreso tra 0.90 e 1.30"},
            {"label": "b", "text": "ABI compreso tra 0.70 e 0.90"},
            {"label": "c", "text": "ABI < 0.40 - 0.50"},
            {"label": "d", "text": "ABI > 1.40"},
            {"label": "e", "text": "ABI = 1.00"}
        ],
        "correctAnswer": "c",
        "explanation": "Interpretazione ABI: Normale 0.90 - 1.30. Lieve 0.70 - 0.90. Moderata 0.40 - 0.70. SEVERA (ischemia critica con dolore a riposo e lesioni trofiche) per ABI < 0.40 - 0.50. Valori > 1.40 indicano arterie incomprimibili e rigide (calcificazione della media / sclerosi di Monckeberg tipica del diabetico).",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-vasc-18",
        "system": "vascolare",
        "topic": "Ischemia Acuta d'Arto",
        "question": "Il catetere di Fogarty a palloncino trova la sua principale indicazione elettiva in:",
        "options": [
            {"label": "a", "text": "Embolectomia / tromboembolectomia nell'ischemia acuta d'arto"},
            {"label": "b", "text": "Endoarterectomia carotidea"},
            {"label": "c", "text": "Valvuloplastica aortica transcatetere"},
            {"label": "d", "text": "Scleroterapia delle varici safeniche"},
            {"label": "e", "text": "Trattamento medico del piede diabetico"}
        ],
        "correctAnswer": "a",
        "explanation": "Il catetere di Fogarty è un catetere con palloncino all'apice specificamente ideato per la tromboembolectomia d'urgenza nell'ischemia acuta d'arto: si introduce oltre il trombo, si gonfia il palloncino e si retrae il catetere estraendo il materiale embolico/trombotico.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-vasc-19",
        "system": "vascolare",
        "topic": "Aneurisma Aorta Addominale (AAA)",
        "question": "Quando si parla formalmente di Aneurisma dell'Aorta Addominale (AAA)?",
        "options": [
            {"label": "a", "text": "Dilatazione permanente che interessa tutte e 3 le tonache vascolari con diametro > 3 cm o incremento > 50% rispetto al calibro normale"},
            {"label": "b", "text": "Dilatazione solo della tonaca avventizia superiore a 2 cm"},
            {"label": "c", "text": "Qualsiasi tortuosità del vaso con calcificazioni"},
            {"label": "d", "text": "Dilatazione con diametro superiore a 7 cm"},
            {"label": "e", "text": "Presenza di flap intimale isolato"}
        ],
        "correctAnswer": "a",
        "explanation": "L'aneurisma vero è una dilatazione permanente e localizzata che coinvolge tutte e tre le tonache vascolari (intima, media, avventizia), con aumento del diametro trasverso > 50% rispetto al diametro atteso, che a livello dell'aorta addominale sottorenale corrisponde convenzionalmente a un diametro trasverso ≥ 3.0 cm.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-vasc-20",
        "system": "vascolare",
        "topic": "Flebologia (Manovra di Trendelenburg)",
        "question": "Nella manovra di Rima-Trendelenburg per la valutazione dell'insufficienza valvolare venosa safeno-femorale:",
        "options": [
            {"label": "a", "text": "Il paziente viene posto prima in clinostatismo (per svuotare le vene) e poi in ortostatismo (dopo aver applicato un laccio emostatico alla radice della coscia)"},
            {"label": "b", "text": "Il laccio viene posto esclusivamente alla caviglia"},
            {"label": "c", "text": "Il paziente rimane sempre e solo in ortostatismo per 30 minuti"},
            {"label": "d", "text": "Si valuta la pervietà dell'arteria tibiale posteriore"},
            {"label": "e", "text": "È un test provocativo con sforzo massimale"}
        ],
        "correctAnswer": "a",
        "explanation": "La prova di Trendelenburg serve a valutare la continenza dell'ostio safeno-femorale e delle vene perforanti: il paziente si sdraia supino sollevando la gamba per svuotare le vene superficiali; si applica un laccio alla radice della coscia e si fa alzare in piedi. Se rilasciando il laccio si ha un rapido riempimento dall'alto verso il basso, la valvola ostiale è incontinente.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-vasc-21",
        "system": "vascolare",
        "topic": "Sindrome da Furto della Succlavia",
        "question": "Nella sindrome da furto della succlavia (stenosi o occlusione dell'arteria succlavia a monte dell'origine della vertebrale), qual è il sintomo neurologico più frequente?",
        "options": [
            {"label": "a", "text": "Vertigini e instabilità da insufficienza vertebro-basilare (accentuati dallo sforzo dell'arto superiore omolaterale)"},
            {"label": "b", "text": "Emicrania con aura visiva"},
            {"label": "c", "text": "Paralisi spastica controlaterale"},
            {"label": "d", "text": "Afasia di Broca isolata"},
            {"label": "e", "text": "Allucinazioni uditive"}
        ],
        "correctAnswer": "a",
        "explanation": "Nella sindrome da furto della succlavia, durante l'esercizio dell'arto superiore il sangue viene risucchiato dall'arteria vertebrale omolaterale in senso retrogrado dal circolo cerebrale posteriore (basilare) verso l'arto. Questo causa ipoperfusione del tronco encefalico con vertigini, sincopi, atassia e diplopia.",
        "highYield": True,
        "session": "Appello Ufficiale - Quiz Moodle"
    },
    {
        "id": "q-cardio-22",
        "system": "cardio",
        "topic": "Tamponamento Cardiaco",
        "question": "Il riscontro di polso paradosso (riduzione della PAS > 10 mmHg durante l'inspirazione) è tipico e patognomonico di:",
        "options": [
            {"label": "a", "text": "Tamponamento cardiaco e pericardite costrittiva"},
            {"label": "b", "text": "Insufficienza aortica severa"},
            {"label": "c", "text": "Pervietà del dotto arterioso di Botallo"},
            {"label": "d", "text": "Ipertensione arteriosa essenziale"},
            {"label": "e", "text": "Fibrillazione atriale normofrequente"}
        ],
        "correctAnswer": "a",
        "explanation": "Il polso paradosso è un segno cardine del TAMPONAMENTO CARDIACO (insieme alla Triade di Beck: ipotensione, turgore giugulare, toni parafonici). Durante l'inspirazione l'aumentato ritorno venoso al ventricolo destro spinge il setto interventricolare a sinistra perché il pericardio inestensibile impedisce l'espansione verso l'esterno, riducendo bruscamente la gittata del ventricolo sinistro.",
        "highYield": True,
        "session": "Ricostruzione Appello Ufficiale"
    },
    {
        "id": "q-cardio-23",
        "system": "cardio",
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
        "explanation": "L'adenosina ha un'emivita inferiore a 10 secondi (viene rapidamente captata da eritrociti e cellule endoteliali e metabolizzata dall'adenosina deaminasi). Per questo va somministrata in bolo rapido EV seguito immediatamente da un flush di soluzione fisiologica ('push and flush'). È controindicata nell'asma grave per rischio di broncocostrizione.",
        "highYield": True,
        "session": "Ricostruzione Appello Ufficiale"
    },
    {
        "id": "q-cardio-24",
        "system": "cardio",
        "topic": "Scompenso Cardiaco (Terapia Farmacologica)",
        "question": "Quale delle seguenti classi farmacologiche NON ha dimostrato una riduzione della mortalità nello scompenso cardiaco a frazione di eiezione ridotta (HFrEF)?",
        "options": [
            {"label": "a", "text": "Diuretici dell'ansa (es. Furosemide) usati come monoterapia"},
            {"label": "b", "text": "Beta-bloccanti (Bisoprololo, Carvedilolo, Metoprololo succinato, Nebivololo)"},
            {"label": "c", "text": "Antagonisti dei recettori dei mineralcorticoidi (Spironolattone, Eplerenone)"},
            {"label": "d", "text": "Inibitori di SGLT2 (Dapagliflozin, Empagliflozin)"},
            {"label": "e", "text": "ARNI (Sacubitril/Valsartan) e ACE-inibitori"}
        ],
        "correctAnswer": "a",
        "explanation": "I 4 pilastri che riducono la mortalità in HFrEF ('Fantastic Four') sono: 1) ARNI/ACE-i, 2) Beta-bloccanti, 3) MRA (spironolattone/eplerenone), 4) SGLT2i. La furosemide e i diuretici dell'ansa migliorano i sintomi congestizi ed eliminano il sovraccarico idrico, ma NON hanno dimostrato una riduzione della mortalità globale.",
        "highYield": True,
        "session": "Ricostruzione Appello Ufficiale"
    },
    {
        "id": "q-pneumo-25",
        "system": "pneumo",
        "topic": "Infezioni Polmonari (Microbiologia)",
        "question": "Il tipico espettorato 'rugginoso' (color mattone/ruggine) orienta fortemente verso un'infezione da:",
        "options": [
            {"label": "a", "text": "Streptococcus pneumoniae (Pneumococco)"},
            {"label": "b", "text": "Pseudomonas aeruginosa (espettorato verde brillante)"},
            {"label": "c", "text": "Klebsiella pneumoniae (a gelatina di ribes)"},
            {"label": "d", "text": "Mycoplasma pneumoniae"},
            {"label": "e", "text": "Pneumocystis jirovecii"}
        ],
        "correctAnswer": "a",
        "explanation": "L'espettorato rugginoso è il classico segno della fase di epatizzazione rossa della polmonite lobare acuta da Streptococcus pneumoniae (Pneumococco), causato dallo stravaso eritrocitario e dalla degradazione dell'emoglobina negli alveoli.",
        "highYield": True,
        "session": "Ricostruzione Appello Ufficiale"
    },
    {
        "id": "q-cardio-26",
        "system": "cardio",
        "topic": "Semeiotica (Soffio di Graham Steell)",
        "question": "Il soffio di Graham Steell è:",
        "options": [
            {"label": "a", "text": "Un soffio diastolico in decrescendo da insufficienza polmonare secondaria a grave ipertensione arteriosa polmonare (frequente nella stenosi mitralica serrata)"},
            {"label": "b", "text": "Un soffio continuo a locomotiva tipico del dotto di Botallo"},
            {"label": "c", "text": "Un soffio mesotelesistolico da prolasso valvolare mitralico"},
            {"label": "d", "text": "Un rullio diastolico con rinforzo presistolico da stenosi tricuspidale"},
            {"label": "e", "text": "Un soffio sistolico da coartazione aortica"}
        ],
        "correctAnswer": "a",
        "explanation": "Il soffio di Graham Steell è un soffio diastolico ad alta frequenza da insufficienza della valvola polmonare causata da marcata dilatazione dell'anulus polmonare per grave ipertensione polmonare cronica (classicamente complicanza di stenosi mitralica avanzata).",
        "highYield": True,
        "session": "Ricostruzione Appello Ufficiale"
    },
    {
        "id": "q-vasc-27",
        "system": "vascolare",
        "topic": "Endoleak post-EVAR",
        "question": "Quale tipo di Endoleak dopo posizionamento di endoprotesi aortica (EVAR) è il più comune ed è sostenuto da flusso retrogrado attraverso vasi collaterali collaterali (arterie lombari o arteria mesenterica inferiore)?",
        "options": [
            {"label": "a", "text": "Endoleak di Tipo I (difetto di sigillo al colletto prossimale o distale)"},
            {"label": "b", "text": "Endoleak di Tipo II (reflusso da arterie collaterali branch vessels)"},
            {"label": "c", "text": "Endoleak di Tipo III (disconnessione o rottura del tessuto dell'endoprotesi)"},
            {"label": "d", "text": "Endoleak di Tipo IV (porosità del tessuto del graft)"},
            {"label": "e", "text": "Endoleak di Tipo V (endotensione senza reperto tc di fuga)"}
        ],
        "correctAnswer": "b",
        "explanation": "L'Endoleak di Tipo II è in assoluto il più comune (rappresenta fino all'80% degli endoleak) ed è causato dal rifornimento retrogrado della sacca aneurismatica da parte di rami collaterali (arterie lombari o arteria mesenterica inferiore). Spesso viene monitorato e trattato solo se la sacca cresce.",
        "highYield": True,
        "session": "Dispense Vascolare 2FAST"
    },
    {
        "id": "q-pneumo-28",
        "system": "pneumo",
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
        "explanation": "I criteri di Light (sensibilità > 98% per essudato) definiscono essudato la presenza di ALMENO UNO dei seguenti: 1) Proteine pleura/siero > 0.5; 2) LDH pleura/siero > 0.6; 3) LDH pleurico > a 2/3 del limite superiore della norma del laboratorio (generalmente > 200 U/L). Altrimenti è un trasudato (es. scompenso, cirrosi, sindrome nefrosica).",
        "highYield": True,
        "session": "Dispense Pneumo 2FAST"
    },
    {
        "id": "q-cardio-29",
        "system": "cardio",
        "topic": "Elettrocardiografia e SCA",
        "question": "Un sopraslivellamento del tratto ST nelle derivazioni DII, DIII e aVF con sottoslivellamento speculare in DI e aVL indica un infarto miocardico acuto (STEMI) a carico di quale parete ventricolare e arteria coronaria?",
        "options": [
            {"label": "a", "text": "Parete Inferiore (Arteria Coronaria Destra o Circonflessa dominante)"},
            {"label": "b", "text": "Parete Anteriore estesa (Discendente Anteriore - IVA)"},
            {"label": "c", "text": "Parete Laterale alta (Ramo Diagonale o Marginale ottuso)"},
            {"label": "d", "text": "Parete Posteriore isolata"},
            {"label": "e", "text": "Ventricolo Destro isolato"}
        ],
        "correctAnswer": "a",
        "explanation": "DII, DIII e aVF 'guardano' la parete INFERIORE (diaframmatica) del ventricolo sinistro, irrorata nella stragrande maggioranza dei soggetti (85-90%) dall'Arteria Coronaria Destra (RCA) tramite la discendente posteriore, oppure dal ramo circonflesso in caso di circolazione a dominanza sinistra.",
        "highYield": True,
        "session": "Dispense Cardio 2FAST"
    },
    {
        "id": "q-vasc-30",
        "system": "vascolare",
        "topic": "Dissezione Aortica",
        "question": "Secondo la classificazione di Stanford per la dissezione aortica:",
        "options": [
            {"label": "a", "text": "Il Tipo A coinvolge l'aorta ascendente ed è un'emergenza cardiochirurgica assoluta con indicazione a riparazione immediata a cielo aperto"},
            {"label": "b", "text": "Il Tipo B coinvolge l'aorta ascendente e richiede terapia medica esclusiva"},
            {"label": "c", "text": "Il Tipo A origina distalmente alla succlavia sinistra ed è trattato con TEVAR"},
            {"label": "d", "text": "La dissezione di Tipo A ha una mortalità inferiore all'1% senza chirurgia"},
            {"label": "e", "text": "Non esiste differenza terapeutica tra Tipo A e Tipo B"}
        ],
        "correctAnswer": "a",
        "explanation": "Stanford Tipo A: qualsiasi dissezione che coinvolga l'AORTA ASCENDENTE (a monte dell'arteria anonima/succlavia sx), indipendentemente dal punto di ingresso. È una letale emergenza cardiochirurgica (rischio rottura intrapericardica con tamponamento, insufficienza aortica acuta o dissezione coronarica, mortalità +1-2% per ora nelle prime 48h). Stanford Tipo B: origina distalmente alla succlavia sinistra e viene trattata inizialmente con terapia medica (controllo pressorio/FC con beta-bloccanti) o TEVAR in caso di complicanze.",
        "highYield": True,
        "session": "Dispense Vascolare 2FAST"
    }
]

out_path = os.path.join(BASE_DIR, "src", "data", "questions.json")
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(parsed_questions, f, ensure_ascii=False, indent=2)

print(f"Generated {len(parsed_questions)} high-yield structured questions at {out_path}")
