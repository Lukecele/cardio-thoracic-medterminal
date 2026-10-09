import json
import os
import re

print("Compilazione della teoria medica integrale pulita e strutturata...")

BASE_DIR = "/home/luca/cardio-thoracic-medterminal"
SRC_DATA = os.path.join(BASE_DIR, "src", "data")
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")

with open(os.path.join(SCRIPTS_DIR, "cardio.txt"), "r", encoding="utf-8", errors="ignore") as f:
    cardio_pages = f.read().split('\x0c')

with open(os.path.join(SCRIPTS_DIR, "pneumo.txt"), "r", encoding="utf-8", errors="ignore") as f:
    pneumo_pages = f.read().split('\x0c')

with open(os.path.join(SCRIPTS_DIR, "vascolare.txt"), "r", encoding="utf-8", errors="ignore") as f:
    vascolare_pages = f.read().split('\x0c')

COMPREHENSIVE_EMOJI_REPLACEMENTS = [
    # Mnemonic phrases
    (r'All\'ECG la pericardite\s*[“"]sorride[”"]\s*😃\s*\.\s*IMA è triste\s*😢\s*\.?', 
     'All\'ECG il sopraslivellamento ST nella pericardite è a concavità verso l\'alto ("a sella"), mentre nell\'IMA acuto è a convessità verso l\'alto ("a dorso di gatto").'),
    (r'“a bocca di pesce”\s*🐟', '"a bocca di pesce" (orifizio valvolare stenotico)'),
    (r'“a pane imburrato”\s*🍞\s*🥖', '"a pane e burro" (pericardite sierofibrinosa)'),
    (r'PANDAS\s*🐼', 'PANDAS'),
    (r'MALATTIA REUMATICA\s*🐼\s*🥖', 'MALATTIA REUMATICA ACUTA'),
    (r'segni ABCDE\s*🦇\s*:', 'Segni radiologici RX dell\'Edema Polmonare (Linee di Kerley, ali di pipistrello):'),
    (r'schiuma rosa dalla bocca\s*🌸', 'espettorato schiumoso rosato (segno cardinale di edema polmonare acuto)'),
    (r'ANCHE IN GRAVIDANZA\s*🤰', '(sicuri anche in gravidanza)'),
    (r'in gravidanza\s*🤰', 'in gravidanza'),
    (r'EP in gravidanza\s*🤰', 'Embolia Polmonare in gravidanza'),
    (r'Procedura\s*🎈\s*🥃', 'Procedura Interventistica'),
    (r'SENZA compressione cardiaca\s*🚰', 'senza compressione o tamponamento cardiaco'),
    (r'Criteri\s*💍', 'Criteri Diagnostici'),
    (r'DIAGNOSI\s*🍿', 'Diagnostica Radiologica (Calcificazioni a Pop-corn)'),
    (r'Diagnosi\s*🐎\s*🧲', 'Diagnostica Strumentale & Segno del Cuore a Zoccolo'),
    (r'Diagnosi\s*✈\s*⚪', 'Diagnostica di Laboratorio & Esame del Liquido Pleurico'),
    (r'massa “a cavolfiore”\s*🥬', 'massa vegetante a cavolfiore'),
    (r'variante iperplastica\s*\(([^)]+)\)\s*🧅', r'variante iperplastica (\1, aspetto a buccia di cipolla)'),
    (r'RX torace\s*🪾\s*🪚', 'RX torace (aspetto ad albero potato)'),
    (r'RX torace\s*🛡\s*🧊', 'RX torace'),
    (r'In adulti e bambini\s*🐟\s*🐷', 'In pazienti adulti e pediatrici'),
    (r'Rischio di rottura\s*💥', 'Rischio di rottura aortica'),
    (r'>1,40\s*🍬\s*🍰', '>1,40 (arterie non comprimibili per calcificazioni da microangiopatia diabetica)'),
    (r'Piede di Charcot\s*🔥', 'Neuroartropatia di Charcot'),
    (r'💔\s*Fattori che peggiorano', 'Fattori prognostici negativi'),
    (r'Classificazione morfologica di Reid\s*🛤', 'Classificazione Morfologica di Reid'),
    (r'Segno del binario\s*🛤', 'Segno del binario'),
    (r'Patogenesi\s*🐝\s*🍯', 'Patogenesi del Quadro a Nido d\'Ape (Honeycombing)'),
    (r'1\.\s*UIP\s*🐝', '1. Pattern UIP (Usual Interstitial Pneumonia)'),
    
    # Mechanism of action icons
    (r'm\.d\.a\.\s*→\s*🔴\s*COX-1 irreversibile\s*=\s*🔴\s*TXA2\s*=\s*🔴\s*aggregazione piastrinica', 
     'm.d.a. → inibizione irreversibile di COX-1 → soppressione TXA2 → inibizione aggregazione piastrinica'),
    (r'🔴\s*COX-1', 'inibizione COX-1'),
    (r'🔴\s*TXA2', 'riduzione TXA2'),
    (r'🔴\s*aggregazione', 'inibizione aggregazione'),
    (r'🔴\s*NKCC', 'inibizione NKCC'),
    (r'🔴\s*PPAR-a', 'agonismo PPAR-alpha'),
    (r'🔴\s*fXa', 'inibizione fattore Xa'),
    (r'🔴\s*fIIa', 'inibizione fattore IIa'),
    (r'🔴\s*SCN5A', 'blocco SCN5A'),
    (r'🔴\s*NPC1L1', 'blocco trasportatore NPC1L1'),
    (r'🔴\s*canale cardiaco F', 'blocco selettivo dei canali If'),
    (r'🔴\s*pompa Na\+/K\+', 'inibizione pompa Na+/K+ ATPasi'),
    (r'🔴\s*rec\.V2 ADH', 'antagonismo recettori V2 dell\'ADH'),
    (r'🔴\s*riassorb\.', 'riduzione del riassorbimento'),
    (r'🔴\s*sintesi collagene', 'inibizione sintesi collagene'),
    (r'🔴\s*TGF-B', 'inibizione TGF-beta'),
    (r'🔴\s*Citochine', 'inibizione citochine'),
    (r'🔴\s*semilunare aortica', 'chiusura semilunare aortica'),
    (r'🔴\s*tricuspide', 'chiusura tricuspide'),
    (r'🔴\s*valvole AV', 'chiusura valvole atrio-ventricolari'),
    (r'🟢\s*tricuspide', 'apertura tricuspide'),
    (r'🟢\s*semilunari', 'apertura semilunari'),
    (r'🟢\s*RAAS', 'stimolo asse RAAS'),
    (r'🟢\s*EPO', 'stimolo eritropoietina (EPO)'),
    (r'🟢\s*PKC', 'attivazione protein chinasi C (PKC)'),
    (r'🟢\s*cGMP', 'aumento cGMP'),
    (r'🟢\s*canali K\+ ATP-dip', 'attivazione canali K+ ATP-dipendenti'),
    (r'🟢\s*can\. L del K\+', 'attivazione canali K+'),
    (r'🔴\s*can\. Ca\+ Tipo L', 'blocco canali Ca2+ tipo L'),
    (r'🟢\s*simpatico', 'iperattivazione del simpatico'),
    (r'🟢\s*catecolamine', 'aumento secrezione catecolamine'),
    (r'🟢\s*S\.I\.', 'attivazione del sistema immunitario'),
    (r'BB\s*\(\s*🔴\s*→\s*FC,\s*contrattilità,\s*consumo O2\s*\)', 'Beta-bloccanti (riduzione FC, contrattilità miocardica e consumo di O2)'),
    (r'🔴\s*si accentua', 'si accentua'),
    (r'🟢\s*Si riduce', 'si riduce'),
    (r'🔴\s*BEE', 'schema terapeutico combinato'),
    
    # Clinical states & access modes
    (r'🚶\s*[\u200b\s]*🏻\s*[\u200b\s]*‍♂?\s*Se il paziente si presenta autonomamente:?', '• Accesso spontaneo in Pronto Soccorso:'),
    (r'🚑\s*Paziente trasportato dal 118:?', '• Trasporto d\'urgenza con mezzo 118:'),
    (r'🚑\s*In emergenza\s*→', 'In condizioni di emergenza →'),
    (r'🚑\s*ITER IN URGENZA', 'Iter Clinico in Emergenza-Urgenza'),
    (r'Terapia\s*🚑', 'Terapia in Emergenza-Urgenza'),
    (r'EMERGENZE IPERTENSIVE\s*🚑\s*⏳', 'EMERGENZE IPERTENSIVE'),
    (r'Pz da ricoverare d\'urgenza\s*🚑', 'Paziente da ricoverare d\'urgenza'),
    
    # Clinical classifications & grades
    (r'🟢\s*classe 1', 'Classe I (raccomandazione forte)'),
    (r'🟠\s*classe 2A\s*/\s*2B', 'Classe IIa / IIb'),
    (r'⚪\s*Classe I - II', 'Classe I-II (basso rischio)'),
    (r'🟢\s*Classe III', 'Classe III (rischio intermedio)'),
    (r'🟠\s*Classe IV', 'Classe IV (alto rischio)'),
    (r'🔴\s*Classe V', 'Classe V (altissimo rischio)'),
    (r'🟠\s*EP SUB-MASSIVA', 'Embolia polmonare sub-massiva'),
    (r'🟢\s*Paziente STABILE', 'Paziente emodinamicamente stabile'),
    (r'🟢\s*Paziente a rischio NON ALTO', '• Paziente a rischio non alto:'),
    (r'🟠\s*Paziente a rischio ALTO', '• Paziente ad alto rischio (PCI < 24h):'),
    (r'🔴\s*Paziente a rischio MOLTO ALTO', '• Paziente a rischio molto alto (PCI immediata):'),
    (r'🟢\s*basso rischio', 'basso rischio'),
    (r'🔴\s*alto rischio', 'alto rischio'),
    (r'🔴\s*Alto rischio', 'Alto rischio'),
    (r'🟠\s*rischio moderato', 'rischio moderato'),
    (r'🟠\s*rischio intermedio', 'rischio intermedio'),
    (r'🟢\s*<108', '[Basso Rischio] <108'),
    (r'🔴\s*>140', '[Alto Rischio] >140'),
    (r'🟢\s*SPT Lieve', '• Score SPT Lieve'),
    (r'🔴\s*SPT grave', '• Score SPT Grave'),
    (r'🟢\s*>1-1,4', '• Indice ABI > 1,0-1,40 (normale)'),
    (r'🔴\s*<0,4', '• Indice ABI < 0,40 (ischemia critica)'),
    (r'🟠\s*100-500m', '• Claudicatio a 100-500 m (moderata)'),
    (r'🔴\s*<100m', '• Claudicatio < 100 m (severa)'),
    (r'🔴\s*Tipo 3', '• Endoleak Tipo 3 (urgenza chirurgica)'),
    (r'🟢\s*Tipo 4', '• Endoleak Tipo 4'),
    (r'⚪\s*assente', 'assente'),
    (r'🟢\s*lieve', 'lieve'),
    (r'🔴\s*grave', 'grave'),
    (r'🟢\s*Casi lievi-moderati', '• Casi lievi-moderati'),
    (r'🔴\s*Casi gravi', '• Casi gravi'),
    (r'🔴\s*Stadi avanzati', '• Stadi avanzati'),
    (r'🔴\s*HF\s*→', '• Scompenso cardiaco severo →'),
    (r'🟠\s*casi lievi\s*→', '• Casi lievi →'),
    (r'📉\s*Fattori precipitanti', 'Fattori scatenanti / precipitanti'),
    (r'Fattori precipitanti\s*📉', 'Fattori precipitanti'),
    (r'❎\s*Escludiamo SCA', 'Esclusione SCA:'),
    
    # Generic replacements
    (r'🥇\s*Gold standard', 'Gold Standard'),
    (r'gold standard.*?🥇', 'gold standard'),
    (r'🥇', ' [Riferimento Primario] '),
    (r'🚨\s*URGENZA', 'URGENZA CLINICA'),
    (r'🚨\s*Complicanze', 'Complicanze Maggiori'),
    (r'🚨\s*DDX', 'Diagnosi Differenziale Critica:'),
    (r'🚨', ' [ATTENZIONE CLINICA] '),
    (r'🚑', ' [URGENZA] '),
    (r'⚠\s*controindicazione', 'Controindicazione'),
    (r'⚠\s*Controindicato', 'Controindicato'),
    (r'⚠\s*Rischio', 'Rischio'),
    (r'⚠\s*Complicanze', 'Complicanze'),
    (r'⚠', ' '),
    (r'❗', ' [Nota Clinica: '),
    (r'🩺\s*E\.O\.\s*→', 'Esame Obiettivo:'),
    (r'🩺\s*Auscultazione\s*→', 'Auscultazione:'),
    (r'🩺', ' '),
    (r'🔬', 'Esame microscopico: '),
    (r'🫀\s*TN-C', 'Troponina C (muscolare e cardiaca)'),
    (r'🫀\s*TN-I', 'Troponina I (cardiomiocitaria)'),
    (r'💪\s*🫀\s*TN-T', 'Troponina T (cardiomiocitaria)'),
    (r'🫀', 'miocardico'),
    (r'❌\s*CV,\s*VEMS', 'riduzione di CV e VEMS'),
    (r'AUMENTO\s*✅\s*VR', 'aumento del Volume Residuo (VR)'),
    (r'✅\s*Vantaggi\s*→', 'Vantaggi:'),
    (r'❌\s*Limiti\s*→', 'Limiti metodologici:'),
    (r'❌\s*Complicanze\s*→', 'Complicanze:'),
    (r'✅\s*Per confermare', 'Per confermare la diagnosi'),
    (r'✅\s*Fasi iniziali', 'Nelle fasi precoci'),
    (r'❌\s*Forme inoperabili', 'Nelle forme inoperabili'),
    (r'🚫\s*biopsia negativa', 'biopsia negativa'),
    (r'🔹|🔸', '• '),
    (r'👀', ' '),
    (r'🚬', ' (tabagismo) '),
    (r'👑', ' '),
]

def clean_medical_text(text: str) -> str:
    """Rimuove spazzatura OCR, cover, link esterni YouTube, paginazione cruda e normalizza layout."""
    # 1. Rimuovi cover e crediti spuri
    text = re.sub(r'(?i)\bCARDIO\b\s*\n\s*2FAST.*?\n', '', text)
    text = re.sub(r'(?i)\bPNEUMO\s*TORACICA\b\s*\n\s*2FAST.*?\n', '', text)
    text = re.sub(r'(?i)\bVASCOLARE\b\s*\n\s*2FAST.*?\n', '', text)
    text = re.sub(r'(?i)\bCHIRURGIA\s*TORACICA\b\s*\n\s*2FAST.*?\n', '', text)
    text = re.sub(r'(?i)A cura di Lorenzo Pessetti', '', text)
    text = re.sub(r'(?i)2FAST', '', text)
    
    # 2. Rimuovi riferimenti a video YouTube e URL
    text = re.sub(r'https?://\S+', '', text)
    text = re.sub(r'(?i)vedi video Youtube[^\n.]*', '', text)
    text = re.sub(r'(?i)vedi video YouTube[^\n.]*', '', text)
    text = re.sub(r'(?i)link al video[^\n.]*', '', text)
    
    # 3. Rimuovi riferimenti grezzi di paginazione da PDF
    text = re.sub(r'(?i)pag\.\s*\d+(-\d+)?', '', text)
    text = re.sub(r'(?i)pagg\.\s*\d+(-\d+)?', '', text)
    text = re.sub(r'(?i)pagina\s*\d+', '', text)
    
    # 4. Sostituzioni semantiche degli emoji
    for pattern, repl in COMPREHENSIVE_EMOJI_REPLACEMENTS:
        text = re.sub(pattern, repl, text)
    
    # Rimuovi categoricamente qualunque residuo di emoji / simboli grafici Unicode
    text = re.sub(r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]', '', text)
    
    # 5. Normalizza virgolette ripetute e apostrofi
    text = re.sub(r'[“”"]{2,}', '"', text)
    text = text.replace('‘', "'").replace('’', "'")
    
    # 6. Normalizza linee e spazi
    lines = text.split('\n')
    cleaned_lines = []
    for l in lines:
        cleaned_line = l.strip()
        # Rimuovi righe vuote o intestazioni isolate superflue
        if cleaned_line.upper() in ['CARDIOLOGIA', 'PNEUMOLOGIA', 'CHIRURGIA VASCOLARE', 'CHIRURGIA TORACICA', 'CARDIOCHIRURGIA']:
            continue
        cleaned_lines.append(cleaned_line)
    
    joined = '\n'.join(cleaned_lines)
    # Riduci multiple newline
    joined = re.sub(r'\n{3,}', '\n\n', joined)
    return joined.strip()

def get_clean_pages_range(pages, start_page, end_page):
    extracted = []
    for p in range(start_page - 1, min(end_page, len(pages))):
        clean_p = pages[p].strip()
        if clean_p:
            extracted.append(clean_p)
    raw = "\n\n".join(extracted)
    return clean_medical_text(raw)

TOPIC_SECTIONS_SPEC = {
    "crd-semeiotica": {
        "default": "Semeiotica Clinica & Toni Cardiaci Fisiologici e Patologici (S1, S2, S3, S4)",
        "anchors": [
            (r'SOFFI CARDIACI', 'Soffi Cardiaci Sistolici, Diastolici & Manovre Semeiologiche'),
            (r'POLSO ARTERIOSO', 'Polso Arterioso Sistemico, Pressioni & Polso Giugulare'),
        ]
    },
    "crd-ipertensione": {
        "default": "Definizione, Epidemiologia & Classificazione ESC 2024",
        "anchors": [
            (r'Classificazione EZIOLOGICA|• SECONDARIA', 'Eziologia & Forme di Ipertensione Secondaria'),
            (r'3\.\s*Misurazione della pressione|Valutazione danno', 'Misurazione Pressoria & Danno d\'Organo (HMOD)'),
            (r'TERAPIA\s*\n|ALGORITMO TERAPEUTICO', 'Terapia Farmacologica & Algoritmi di Combinazione'),
            (r'EMERGENZE IPERTENSIVE', 'Emergenze ed Urgenze Ipertensive'),
        ]
    },
    "crd-ischemica-acuta": {
        "default": "Fisiopatologia dell'Aterosclerosi Coronarica & Rischio Cardiovascolare",
        "anchors": [
            (r'Eziologia delle ACS|Classificazione patologico|NSTEMI', 'Sindromi Coronariche Acute senza Sopraslivellamento ST (NSTEMI / UA)'),
            (r'→ STEMI|STEMI\s*\n', 'Infarto Miocardico Acuto con Sopraslivellamento ST (STEMI)'),
            (r'ANTIAGGREGANTI|DAPT|Strategia invasiva', 'Terapia Antiaggregante, Anticoagulante & Strategia Invasiva (PCI)'),
        ]
    },
    "crd-scompenso": {
        "default": "Fisiopatologia dello Scompenso Cardiaco & Classificazione ESC",
        "anchors": [
            (r'DIAGNOSI DI SCOMPENSO CRONICO', 'Diagnosi Clinica, Biomarcatori (BNP/NT-proBNP) & Ecocardiogramma'),
            (r'Terapia emodinamico|FOCUS sui farmaci|schema CHAMPIT', 'I 4 Pilastri Terapeutici di HFrEF & Farmacoterapia Integrata'),
            (r'CLINICA SCA|Shock cardiogeno|Ridotto indice cardiaco', 'Scompenso Acuto & Shock Cardiogeno: Classificazione ed Emodinamica'),
        ]
    },
    "crd-aritmie": {
        "default": "Cardiomiopatie (Ipertrofica, Dilatativa, Aritmogena, Restrittiva)",
        "anchors": [
            (r'MIOCARDITI|PERICARDITE|All\'ECG il sopraslivellamento', 'Miocarditi, Pericarditi Acute & Tamponamento Cardiaco'),
            (r'STENOSI MITRALICA|FIBRILLAZIONE ATRIALE', 'Valvulopatia Mitralica & Fibrillazione Atriale'),
            (r'ARITMIE|Disturbi della Conduzione|BAV|Blocchi', 'Aritmie Ipocinetiche, Ipercinetiche & Blocchi Atrio-Ventricolari'),
        ]
    },
    "cch-stenosi-aortica": {
        "default": "Stenosi Valvolare Aortica: Eziopatogenesi & Fisiopatologia",
        "anchors": [
            (r'DIAGNOSI\s*\n|IMAGING', 'Diagnostica Clinica, Ecocardiografica & Gradiente Valvolare'),
            (r'TERAPIA\s*\n|PROTESI VALVOLARI', 'Chirurgia Sostitutiva (SAVR vs TAVI) & Selezione Protesi'),
            (r'CARDIO|Incannulazione|Circolazione Extracorporea', 'Circolazione Extracorporea (CEC) & Tecniche di Cannulazione'),
        ]
    },
    "cch-mitralica-endocardite": {
        "default": "Insufficienza & Stenosi Mitralica: Eziopatogenesi & Wilkins Score",
        "anchors": [
            (r'WILKINS SCORE|DIAGNOSI', 'Diagnosi Ecocardiografica, Wilkins Score & Timing Chirurgico'),
            (r'Criteri di Duke|ENDOCARDITE', 'Endocardite Infettiva: Eziologia & Criteri di Duke ESC 2023'),
            (r'Terapia\s*\n|Trattamento sintomatico', 'Chirurgia Riparativa vs Sostituzione & Terapia Medica'),
        ]
    },
    "cch-cabg-aorta": {
        "default": "Bypass Aorto-Coronarico (CABG): Indicazioni & Terapia Medica",
        "anchors": [
            (r'ANEURISMA AORTA TORACICA', 'Aneurismi dell\'Aorta Toracica: Eziologia & Indicazioni Chirurgiche'),
            (r'Iter Clinico in Emergenza|Dissezione|Fisiopatologia', 'Dissezione Aortica: Classificazione Stanford ed Emergenza Chirurgica'),
            (r'CARDIOPATIE CONGENITE', 'Cardiopatie Congenite dell\'Adulto & Dotto Arterioso Pervio'),
        ]
    },
    "pnm-pfr-ega": {
        "default": "Semeiotica Respiratoria & Reperti Auscultatori (Rantoli, Ronchi)",
        "anchors": [
            (r'SPIROMETRIA|TEST DI FUNZIONALITÀ', 'Prove di Funzionalità Respiratoria (PFR) & Spirometria'),
            (r'TERAPIA IPOSSIEMIA|Classificazione clinica', 'Emogasanalisi Arteriosa (EGA) & Insufficienza Respiratoria Tipo 1 e 2'),
            (r'NON RE-BREATHER|Ossigenoterapia|CPAP|BiPAP', 'Ossigenoterapia & Dispositivi ad Alti e Bassi Flussi'),
        ]
    },
    "pnm-asma-bpco": {
        "default": "Broncopneumopatia Cronica Ostruttiva (BPCO): Fisiopatologia & GOLD",
        "anchors": [
            (r'POLMONITI|Classificazione Epidemiologica', 'Polmoniti Acquisite in Comunità (CAP) & Infezioni Polmonari'),
            (r'spirometria con test di bronco-reversibilità|Asma intermittente', 'Asma Bronchiale: Diagnostica con Reversibilità & Stadiazione'),
            (r'MOMETASONE|LABA|OMALIZUMAB|MEPOLIZUMAB', 'Terapia Inalatoria Multistep GINA & Farmaci Biologici'),
        ]
    },
    "pnm-tbc-sarcoidosi": {
        "default": "Tubercolosi Polmonare & Extrapolmonare: Trasmissione & Diagnostica",
        "anchors": [
            (r'TERAPIA\s*\n|Forme\s*RESISTENTI', 'Terapia Farmacologica della TBC (Regime RIPE) & Forme Resistenti'),
            (r'SARCOIDOSI|granulomi|Scadding', 'Sarcoidosi Toracica: Stadiazione Radiologica & Fisiopatologia'),
            (r'Interstiziopatie|IPF|Pattern UIP|Fibrosi interstiziale', 'Interstiziopatie Polmonari & Fibrosi Polmonare Idiopatica (IPF)'),
        ]
    },
    "cht-neoplasie-tnm": {
        "default": "Neoplasie Polmonari Benigne & Nodulo Polmonare Solitario",
        "anchors": [
            (r'TUMORI DEL POLMONE|VALUTAZIONE MOLECOLARE', 'Carcinoma Polmonare (NSCLC vs SCLC): Istologia & Biologia Molecolare'),
            (r'COME FARE STAGING|STAGING', 'Stadiazione TNM 8ª Edizione & Diagnostica Endoscopica'),
            (r'Criteri di NON resecabilità|TERAPIA GENERALE', 'Criteri di Resecabilità Funzionale & Terapia Chirurgica Resettiva'),
            (r'Empiema|PLEURITI|Mesotelioma|versamento', 'Patologie Pleuriche Chirurgiche, Empiema & Mesotelioma'),
        ]
    },
    "cht-pleura-pnx": {
        "default": "Fisiopatologia Pleurica & Criteri di Light (Trasudato vs Essudato)",
        "anchors": [
            (r'TORACENTESI', 'Toracentesi Diagnostico-Evacuativa & Drenaggio Toracico Bulau'),
            (r'PNEUMOTORACE|PNX IPERTESO', 'Pneumotorace Spontaneo, Traumatico ed Iperteso'),
            (r'ERNIE CONGENITE|GRANULOMATOSI', 'Ernie Diaframmatiche & Patologie del Mediastino'),
        ]
    },
    "vsc-aaa": {
        "default": "Aneurisma Aorta Addominale (AAA): Eziologia, Screening & Diametri Soglia",
        "anchors": [
            (r'COMPLICANZE|Rottura aortica|Rischio di rottura', 'Complicanze Aneurismatiche & Rottura Aortica'),
            (r'posizionamento fluoroscopico|endoprotesi|Tipo 3|Tipo 4', 'Trattamento Endovascolare (EVAR) & Classificazione Endoleak'),
        ]
    },
    "vsc-aocp-ischemia": {
        "default": "Arteriopatia Obliterante (AOCP): Classificazione Leriche-Fontaine & ABI",
        "anchors": [
            (r'TERAPIA AOAI|PTA|Angioplastica', 'Trattamento Medico ed Endovascolare dell\'AOCP'),
            (r'Ischemia Acuta|3 cause principali|Fogarty', 'Ischemia Acuta Periferica: Segni Clinici (6 P) & Embolectomia Fogarty'),
            (r'Classificazione C\.E\.A\.P\.|Flebologia|Insufficienza Venosa', 'Insufficienza Venosa Cronica (Classificazione CEAP)'),
        ]
    },
    "vsc-carotidi-flebologia": {
        "default": "Stenosi Carotidea Extracranica: Fisiopatologia & Criteri NASCET",
        "anchors": [
            (r'Classificazione di Marsiglia|CLINICA', 'Quadro Clinico (TIA / Ictus) & Classificazione di Marsiglia'),
            (r'TERAPIA\s*\n|incisione cute|clampaggio', 'Tromboendoarterectomia Carotidea (TEA): Tecnica Chirurgica & Shunt'),
            (r'varicocele|succlavia|furto', 'Sindrome da Furto della Succlavia & Varicocele'),
        ]
    }
}

def split_topic_into_clinical_sections(text: str, tid: str):
    spec = TOPIC_SECTIONS_SPEC.get(tid, {
        "default": "Trattazione Integrale",
        "anchors": []
    })
    
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    if not paragraphs:
        return []

    sections = []
    current_title = spec["default"]
    current_paragraphs = []
    anchor_idx = 0
    anchors = spec["anchors"]

    for para in paragraphs:
        # Check if this paragraph triggers the next anchor
        if anchor_idx < len(anchors):
            pattern, next_title = anchors[anchor_idx]
            if re.search(pattern, para, re.IGNORECASE):
                # Save previous section if it has content
                if current_paragraphs:
                    sections.append({
                        "id": f"sec-{len(sections) + 1}",
                        "title": current_title,
                        "content": "\n\n".join(current_paragraphs)
                    })
                current_title = next_title
                current_paragraphs = [para]
                anchor_idx += 1
                continue
        current_paragraphs.append(para)

    if current_paragraphs:
        sections.append({
            "id": f"sec-{len(sections) + 1}",
            "title": current_title,
            "content": "\n\n".join(current_paragraphs)
        })

    # If only 1 section was generated and text is long, divide into 3-4 balanced sections
    if len(sections) == 1 and len(paragraphs) > 8:
        chunk_size = max(4, len(paragraphs) // 3)
        sections = []
        for i in range(0, len(paragraphs), chunk_size):
            chunk = paragraphs[i:i+chunk_size]
            first_line = chunk[0].split('\n')[0][:55].strip()
            sections.append({
                "id": f"sec-{len(sections) + 1}",
                "title": f"Parte {len(sections) + 1}: {first_line}",
                "content": "\n\n".join(chunk)
            })

    return sections

# Page mappings for extraction
page_mappings = {
    # 1. CARDIOLOGIA MEDICA
    "crd-semeiotica": ("cardio", 3, 14, []),
    "crd-ipertensione": ("cardio", 15, 26, []),
    "crd-ischemica-acuta": ("cardio", 27, 49, []),
    "crd-scompenso": ("cardio", 63, 80, []),
    "crd-aritmie": ("cardio", 81, 116, []),
    
    # 2. CARDIOCHIRURGIA
    "cch-stenosi-aortica": ("cardio", 118, 124, [("cardio", 167, 173)]),
    "cch-mitralica-endocardite": ("cardio", 108, 119, [("cardio", 95, 102)]),
    "cch-cabg-aorta": ("cardio", 55, 62, [("cardio", 174, 185)]),
    
    # 3. PNEUMOLOGIA
    "pnm-pfr-ega": ("pneumo", 2, 9, [("pneumo", 48, 56)]),
    "pnm-asma-bpco": ("pneumo", 10, 19, [("pneumo", 37, 47)]),
    "pnm-tbc-sarcoidosi": ("pneumo", 20, 36, []),
    
    # 4. CHIRURGIA TORACICA
    "cht-neoplasie-tnm": ("pneumo", 59, 72, []),
    "cht-pleura-pnx": ("pneumo", 73, 89, []),
    
    # 5. CHIRURGIA VASCOLARE
    "vsc-aaa": ("vascolare", 2, 7, []),
    "vsc-aocp-ischemia": ("vascolare", 8, 25, []),
    "vsc-carotidi-flebologia": ("vascolare", 26, 32, [])
}

with open(os.path.join(SRC_DATA, "theory.json"), "r", encoding="utf-8") as f:
    existing_theory = json.load(f)

for mod in existing_theory["modules"]:
    for topic in mod["topics"]:
        tid = topic["id"]
        if tid in page_mappings:
            source_file, start_p, end_p, extra_pages = page_mappings[tid]
            pages_arr = cardio_pages if source_file == "cardio" else (pneumo_pages if source_file == "pneumo" else vascolare_pages)
            full_text = get_clean_pages_range(pages_arr, start_p, end_p)
            
            for extra in extra_pages:
                ex_src, ex_start, ex_end = extra
                ex_arr = cardio_pages if ex_src == "cardio" else (pneumo_pages if ex_src == "pneumo" else vascolare_pages)
                extra_text = get_clean_pages_range(ex_arr, ex_start, ex_end)
                if extra_text:
                    full_text += "\n\n" + extra_text
            
            # Pulisci il testo completo
            full_text = clean_medical_text(full_text)
            topic["fullText"] = full_text
            
            # Genera sezioni strutturate cliniche
            topic["sections"] = split_topic_into_clinical_sections(full_text, tid)

with open(os.path.join(SRC_DATA, "theory.json"), "w", encoding="utf-8") as f:
    json.dump(existing_theory, f, ensure_ascii=False, indent=2)

print("Theory.json ricompilato con successo!")
for m in existing_theory['modules']:
    print(f"\nModulo: {m['name']}")
    for t in m['topics']:
        print(f"  - [{t['id']}] {t['title']} ({len(t['sections'])} sezioni):")
        for s in t['sections']:
            print(f"      • {s['id']}: {s['title']} ({len(s['content'])} car)")

