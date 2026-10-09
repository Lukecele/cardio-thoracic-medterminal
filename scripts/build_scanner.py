import json
import os

BASE_DIR = "/home/luca/cardio-thoracic-medterminal"
SRC_DATA = os.path.join(BASE_DIR, "src", "data")

scanner_items = [
    {
        "id": "scan-as",
        "diagnosis": "Stenosi Aortica Severa",
        "system": "cardio",
        "topicId": "cardio-valvulopatie",
        "symptoms": ["Dispnea da sforzo", "Angina", "Sincope da sforzo"],
        "physicalFindings": ["Soffio sistolico eiettivo a diamante irradiato ai vasi del collo", "Polso parvus et tardus", "Sdoppiamento paradosso di S2"],
        "ecgFindings": ["Ipertrofia ventricolare sinistra (Sokolow-Lyon > 35 mm)", "Sovraccarico sistolico con ST sottoslivellato"],
        "imagingGoldStandard": "Ecocardiogramma Doppler: AVA < 1.0 cm², Gradiente medio > 40 mmHg, Vmax > 4.0 m/s",
        "urgentActions": ["Evitare vasodilatatori aggressivi che abbattono il postcarico", "Valutazione Heart Team per SAVR vs TAVI"],
        "examFrequency": "Molto Alta (Quiz frequente Edwards SAPIEN, indicazioni TAVI)"
    },
    {
        "id": "scan-stemi-inf",
        "diagnosis": "STEMI Parete Inferiore",
        "system": "cardio",
        "topicId": "cardio-ischemia-sca",
        "symptoms": ["Dolore toracico oppressivo retrosternale > 20 min", "Irradiazione epigastrica / braccio sx", "Sudorazione algida"],
        "physicalFindings": ["Bradicardia da ipertono vagale o BAV", "Toni parafonici"],
        "ecgFindings": ["Sopraslivellamento ST in DII, DIII, aVF", "Sottoslivellamento speculare in DI, aVL", "Possibile estensione a V3R, V4R"],
        "imagingGoldStandard": "Coronarografia d'urgenza (PCI primaria entro 120 min): lesione su Arteria Coronaria Destra (RCA)",
        "urgentActions": ["Aspirina masticabile 300 mg + Ticagrelor 180 mg + Eparina", "Controindicati nitrati se coinvolto ventricolo destro!"],
        "examFrequency": "Molto Alta (Derivazioni inferiori RCA / DII DIII aVF)"
    },
    {
        "id": "scan-tamponade",
        "diagnosis": "Tamponamento Cardiaco",
        "system": "cardio",
        "topicId": "cardio-semeiotica",
        "symptoms": ["Dispnea ingravescente", "Astenia marcata", "Ortopnea"],
        "physicalFindings": ["Triade di Beck (Ipotensione, Turgore giugulare, Toni cardiaci parafonici)", "Polso paradosso (PAS cala > 10 mmHg in inspirazione)"],
        "ecgFindings": ["Bassi voltaggi diffusi", "Alternanza elettrica delle onde QRS"],
        "imagingGoldStandard": "Ecocardiogramma: versamento pericardico circonferenziale con collasso diastolico del ventricolo destro e atrio destro",
        "urgentActions": ["Pericardiocentesi percutanea d'urgenza guidata da ecografo", "Espansione volemica per sostenere il precarico"],
        "examFrequency": "Altissima (Polso paradosso classico trabocchetto d'esame)"
    },
    {
        "id": "scan-dissection-a",
        "diagnosis": "Dissezione Aortica (Stanford Tipo A)",
        "system": "vascolare",
        "topicId": "vasc-dissezione",
        "symptoms": ["Dolore lacerante acuto retrosternale con irradiazione interscapolare/dorsale migrante", "Sincope"],
        "physicalFindings": ["Asimmetria pressoria e sfigmica tra le due braccia (> 20 mmHg)", "Soffio diastolico da insufficienza aortica acuta"],
        "ecgFindings": ["Sovente aspecifico o sopraslivellamento ST se dissezione dell'ostio della coronaria destra"],
        "imagingGoldStandard": "Angio-TC torace-addome con mdc: visualizzazione del flap intimale e falso lume nell'aorta ascendente",
        "urgentActions": ["Controllo pressorio aggressivo con Beta-bloccante EV (Labetalolo/Esmololo) target PAS 100-120 mmHg", "Chirurgia cardiochirurgica d'urgenza assoluta a cielo aperto"],
        "examFrequency": "Altissima (Stanford A vs B)"
    },
    {
        "id": "scan-aaa-rupture",
        "diagnosis": "Rottura Aneurisma Aorta Addominale (AAA)",
        "system": "vascolare",
        "topicId": "vasc-aneurismi-evar",
        "symptoms": ["Dolore addominale o lombare violento e improvviso", "Sensazione di lipotimia / svenimento"],
        "physicalFindings": ["Massa addominale pulsante ed espansibile", "Segni di shock ipovolemico (ipotensione, tachicardia, pallore)"],
        "ecgFindings": ["Tachicardia sinusale"],
        "imagingGoldStandard": "Eco FAST immediato se instabile; Angio-TC se emodinamicamente stabile (ematoma retroperitoneale)",
        "urgentActions": ["Accesso vascolare di grande calibro, ipotensione permissiva", "Chirurgia immediata (Open repair o EVAR d'emergenza)"],
        "examFrequency": "Alta (Sottorenale rottura retroperitoneale, diametro > 5.5 cm)"
    },
    {
        "id": "scan-acute-limb",
        "diagnosis": "Ischemia Acuta d'Arto",
        "system": "vascolare",
        "topicId": "vasc-aocp-ischemia",
        "symptoms": ["Dolore violento acuto all'arto inferiore o superiore", "Impotenza funzionale improvvisa"],
        "physicalFindings": ["Le 6 P: Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia (arto freddo)"],
        "ecgFindings": ["Spesso Fibrillazione Atriale non anticoagulata (fonte embolica)"],
        "imagingGoldStandard": "Ecocolordoppler o Angio-TC con arresto brusco del flusso a cannocchiale",
        "urgentActions": ["Eparina non frazionata bolo EV 5000 UI immediato", "Embolectomia chirurgica con Catetere di Fogarty"],
        "examFrequency": "Molto Alta (Catetere di Fogarty classico quesito d'esame)"
    },
    {
        "id": "scan-asthma-attack",
        "diagnosis": "Attacco Asmatico Acuto",
        "system": "pneumo",
        "topicId": "pneumo-asma-polmoniti",
        "symptoms": ["Dispnea accessionale espiratoria", "Tosse secca stizzosa", "Senso di costrizione al torace"],
        "physicalFindings": ["Tachipnea, uso dei muscoli respiratori accessori", "Auscultazione: fischi e sibili diffusi bilaterali a prevalenza espiratoria"],
        "ecgFindings": ["Tachicardia sinusale"],
        "imagingGoldStandard": "Misurazione Peak Expiratory Flow (PEF < 50% = attacco grave) + Emogasanalisi arteriosa (iniziale ipocapnia da iperventilazione; normo/ipercapnia indica esaurimento muscolare!)",
        "urgentActions": ["Salbutamolo + Ipratropio per aerosol continuo", "Corticosteroide sistemico EV/os (Metilprednisolone/Prednisone) + Ossigenoterapia"],
        "examFrequency": "Alta (Reattività vs reversibilità, GINA)"
    },
    {
        "id": "scan-pneumonia-cap",
        "diagnosis": "Polmonite Acquisita in Comunità (CAP Tipica)",
        "system": "pneumo",
        "topicId": "pneumo-asma-polmoniti",
        "symptoms": ["Febbre elevata con brivido scuotente", "Tosse con espettorato rugginoso", "Dolore toracico puntorio continuo"],
        "physicalFindings": ["Ottusità plessica circoscritta", "Aumento del Fremito Vocale Tattile (FVT)", "Soffio bronchiale e rantoli crepitanti"],
        "ecgFindings": ["Tachicardia sinusale"],
        "imagingGoldStandard": "Rx Torace: consolidamento lobare uniforme con broncogramma aereo",
        "urgentActions": ["Calcolo score CURB-65 per criterio di ricovero", "Antibioticoterapia empirica (Amoxicillina/Clavulanato o Ceftriaxone + Macrolide)"],
        "examFrequency": "Molto Alta (Espettorato rugginoso Pneumococco, CAP tipica vs atipica)"
    },
    {
        "id": "scan-sarcoidosis",
        "diagnosis": "Sarcoidosi (Stadio 0 / I)",
        "system": "pneumo",
        "topicId": "pneumo-sarcoidosi-tbc",
        "symptoms": ["Spesso asintomatica riscontrata per caso", "Eritema nodoso tibiale", "Artralgie delle caviglie (Sindrome di Löfgren)"],
        "physicalFindings": ["Cute con lesioni papulose/lupus pernio", "Linfoadenopatia periferica indolente"],
        "ecgFindings": ["Monitoraggio per escludere BAV o aritmie ventricolari da infiltrazione granulomatosa miocardica"],
        "imagingGoldStandard": "Rx Torace (Stadio 0: Rx normale con manifestazioni extratoraciche; Stadio I: adenopatia ilare bilaterale); BAL con rapporto CD4/CD8 > 3.5; Biopsia: granulomi non caseificanti",
        "urgentActions": ["Monitoraggio clinico; Corticosteroidi solo se sintomi evolutivi o impegno d'organo critico"],
        "examFrequency": "Altissima (Stadio 0 e BAL CD4/CD8 frequenti negli scritti)"
    }
]

out_path = os.path.join(SRC_DATA, "scannerMatrix.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(scanner_items, f, ensure_ascii=False, indent=2)

print(f"Saved scanner matrix with {len(scanner_items)} profiles to {out_path}")
