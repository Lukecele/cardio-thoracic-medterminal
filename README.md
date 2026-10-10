# 🩺 MedTerminal Cardio-Toracico (v2.0)

[![Live Production](https://img.shields.io/badge/Vercel-Live%20Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://cardio-thoracic-medterminal.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20WebGL-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Open Source](https://img.shields.io/badge/Open%20Source-GitHub-cyan?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Lukecele/cardio-thoracic-medterminal)

🌐 **Piattaforma Online**: [https://cardio-thoracic-medterminal.vercel.app](https://cardio-thoracic-medterminal.vercel.app)

> **Piattaforma didattica multimodale per gli studenti di medicina** concepita per la preparazione dell'esame universitario integrato di **Malattie dell'Apparato Cardiovascolare e Respiratorio** (*Cardiologia Medica*, *Pneumologia*, *Cardiochirurgia*, *Chirurgia Toracica* e *Chirurgia Vascolare*).

---

## 👨‍💻 Sviluppo & Crediti

- **Ideazione, Architettura Software & Sviluppo Full-Stack**:  
  **Luca Celebrano** — [GitHub: @Lukecele](https://github.com/Lukecele) • [Repository: Lukecele/cardio-thoracic-medterminal](https://github.com/Lukecele/cardio-thoracic-medterminal)
- **Basi Teoriche & Materiale Didattico**:  
  Si ringrazia **Lorenzo Pessetti** per aver condiviso il materiale PDF dei suoi appunti e dispense universitarie, consultati come base per la stesura e la rielaborazione della sezione teorica curriculare.  
  *Tutti gli strumenti software interattivi, la fonoteca auscultatoria rimasterizzata, i modelli 3D WebGL, i monitor ECG, il simulatore quiz, il simulatore orale e i calcolatori sono stati sviluppati e integrati autonomamente da Luca Celebrano.*

---

## 🎯 Panoramica dell'Esame Integrato (5 Branche Specialistiche)

L'esame universitario accorpa 5 discipline cliniche e chirurgiche. MedTerminal aggrega l'intero programma d'esame in un unico ambiente di studio ad alta resa, eliminando i muri di testo dispersivi:

```
                        ┌──────────────────────────────────────────────┐
                        │        MEDTERMINAL CARDIO-TORACICO           │
                        └──────────────────────┬───────────────────────┘
                                               │
         ┌───────────────┬─────────────────────┼─────────────────────┬─────────────────┐
         │               │                     │                     │                 │
         ▼               ▼                     ▼                     ▼                 ▼
 1. Cardiologia   2. Cardiochirurgia    3. Pneumologia       4. Chir. Toracica   5. Chir. Vascolare
  - Ischemia/STEMI  - Aneurismi Aorta    - BPCO & Asma        - PNX Spontaneo     - AAA & EVAR
  - Scompenso       - Bicuspidia / TAVI  - Polmoniti & GOLD   - Carcinoma Polmone - AOCP & Leriche
  - Valvulopatie    - Bypass CABG        - Embolia Polmonare  - Timomi/Mediastino - Dissezioni Aorta
  - Aritmie & FA    - Dissezione Stanford- Sarcoidosi         - Versamenti        - Carotidi & CEA
```

---

## ⚡ Caratteristiche Principali della Piattaforma

### 1. 📖 Teoria Curriculare Completa (16 Capitoli)
- **Trattazione Sistematica Approfondita**: Il pilastro cardine della piattaforma copre l'intero programma curriculare delle 5 branche senza omissioni di cut-off diagnostici, classificazioni e linee guida vigenti (ESC, AHA/ACC, ERS, ESTS, ESVS).
- **Struttura Didattica a 4 Punti Cardine**:
  1. *Definizione & Fisiopatologia Essenziale*
  2. *Segni Clinici & Semeiotica*
  3. *Iter Diagnostico, Cut-off & Gold Standard*
  4. *Terapia Medica & Indicazioni Chirurgiche*
- **Trabocchetti d'Esame dei Docenti**: Box dedicati che evidenziano i dettagli insidiosi e gli errori più frequenti agli appelli.
- **Active Recall (Modalità Cloze Blur)**: Switch attivabile in tempo reale che maschera selettivamente cut-off numerici, dosaggi farmacologici e parole chiave per stimolare il richiamo attivo della memoria.

### 2. 📝 Database Prove Scritte (48 MCQ Ufficiali Commentati)
- **Quesiti d'Esame Verificati**: Ricostruzione fedele con 5 opzioni (`A`-`E`) e cronologia delle sessioni d'esame.
- **Razionale Clinico Dettagliato**: Spiegazione approfondita del motivo per cui la risposta corretta è valida e analisi dell'errore di ciascun distrattore.
- **Filtro Disciplinare**: Allenamento per singola branca (Cardiologia, Pneumologia, Cardiochirurgia, Chirurgia Toracica, Vascolare) o in modalità mista d'esame.
- **Feedback & Statistiche**: Tracciamento istantaneo di accuratezza, cronologia tentativi e reset statistico.

### 3. 🩺 Simulatore d'Esame Orale (5 Stazioni Specialistiche)
- **Vignette Cliniche Complesse**: Casi caldi d'esame (STEMI acuto con complicanze meccaniche, Shock cardiogeno, Stenosi aortica severa, Riacutizzazione di BPCO, Embolia Polmonare ad alto rischio).
- **Interrogazione a Step Sequenziali**: Domande a cascata che simulano il dialogo con la commissione d'esame.
- **Fatal Traps & Risposte Modello**: Segnalazione dell'errore grave che compromette l'esame e formulazione della risposta attesa da 30 e lode.
- **Autovalutazione a Semaforo**: Valutazione dello studente (`Ottima`, `Accettabile`, `Da Rivedere`).

### 4. 🎧 Fonoteca Auscultatoria HD (11 Reperti Audio Reali)
- **Audio Autentici Registrati da Fonendoscopio** (nessuna sintesi artificiale):
  1. *Toni Fisiologici Normali (S1 - S2)*
  2. *Stenosi Aortica (Soffio Meso-sistolico ad Eiezione a diamante)*
  3. *Insufficienza Mitralica (Soffio Olo-sistolico soffiante)*
  4. *Stenosi Mitralica (Schiocco d'Apertura & Rullio Diastolico)*
  5. *Insufficienza Aortica (Soffio Diastolico in Decrescendo)*
  6. *Terzo Tono S3 (Galoppo Protodiastolico)*
  7. *Quarto Tono S4 (Galoppo Presistolico)*
  8. *Sfregamento Pericardico / Pleurico*
  9. *Rantoli Crepitanti Tele-inspiratori (Crackles / Velcro)*
  10. *Sibili & Fischi Espiratori (Wheezing)*
  11. *Soffio Tubarico / Respiro Bronchiale Patologico*
- **Filtri Acustici Simulati (Stile Littmann)**:
  - *Standard*: Spettro lineare (20 - 20.000 Hz).
  - *Membrana*: Filtro passa-alto (> 180 Hz) per isolare soffi da eiezione, rigurgiti e sfregamenti attenuando il rimbombo basso.
  - *Campana*: Filtro passa-basso (< 220 Hz) per esaltare i galoppi S3/S4 e il rullio della stenosi mitralica.
- **StethoBoost Digitale (+6 dB)**: Amplificazione calibrata per speaker integrati di smartphone e laptop.
- **Visualizzatore del Ciclo**: Mappatura sincronizzata delle fasi sistole/diastole e inspirazione/espirazione.
- **Mobile UX Ottimizzata**: Toggle rapido a due viste (*Elenco Reperti* vs *Scheda Clinica & Console*) con riproduzione sincrona istantanea a 1 tocco e mini-player sticky.

### 5. 🫀 Atlante Anatomico 3D WebGL (Three.js) & Tavole HD
- **Modelli Tridimensionali STL**:
  - *Cuore 3D* (`heart.stl`) — Anatomia delle camere, setti e vasi della base.
  - *Albero Tracheo-Bronchiale* (`lungs.stl`) — Segmentazione bronchiale e campi polmonari.
  - *Ectasia / Dilatazione Aortica* (`aorta_dilatation.stl`) — Modello anatomico patologico (NIH 3D Print Exchange).
- **Controlli Interattivi**: Rotazione orbitale libera 360°, zoom, pan, commutazione Wireframe/PBR shader e reset camera istantaneo.
- **Tavole Anatomiche HD**: Consultazione illustrata rapida ottimizzata per dispositivi mobili.

### 6. 🛠️ Suite di Strumenti Specialistici
- **Monitor ECG Dinamico**: Tracciati elettrocardiografici dinamici su canvas (STEMI, Fibrillazione Atriale, Flutter atriale, BAV 3° grado, Tachicardia Ventricolare) con calcolo frequenza e quiz sul ritmo.
- **Spirometria PFR & Flusso-Volume**: Curva Flusso-Volume interattiva, calcolo Tiffeneau (FEV1/FVC), diagnosi differenziale deficit ostruttivo vs restrittivo e test di reversibilità con broncodilatatore.
- **EGA Arteriosa Interpreter**: Analisi automatica dell'equilibrio acido-base (pH, PaCO₂, HCO₃⁻, BE), Gap Anionico, compensi attesi e classificazione dell'insufficienza respiratoria (Tipo 1 vs Tipo 2, ARDS con PaO₂/FiO₂).
- **Stadiazione TNM 8ª Edizione**: Calcolatore per NSCLC con stima di funzione post-operatoria (ppo-FEV1% e ppo-DLCO%) per l'indicazione a lobectomia o pneumonectomia.
- **Algoritmi Decisionali & Flowchart**: Percorsi decisionali interattivi su STEMI (PCI primaria vs fibrinolisi), Scompenso Cardiaco HFrEF (i 4 pilastri terapeutici), Embolia Polmonare e ischemia acuta periferica con embolectomia di Fogarty.
- **Prontuario Farmacologico & Antidoti**: DOAC e antidoti specifici (Idarucizumab per Dabigatran, Andexanet alfa per anti-Xa), emergenze ipertensive EV e regime antitubercolare RIPE.
- **Atlante Imaging Toracico**: Iconografia e segni radiologici chiave su RX torace e Angio-TC (linee di Kerley B, pneumotorace, flap intimale di dissecazione aortica).
- **Calcolatori Clinici Integrati**: CHA₂DS₂-VASc, HAS-BLED, Wells Score EP, CURB-65, TIMI Risk Score STEMI, EuroSCORE II, Reynolds Risk Score.
- **Scanner Diagnostico (DDx)**: Matrice ad incrocio rapido sintomi/segni per identificare la diagnosi differenziale gold standard in emergenza-urgenza.
- **Ricerca Globale Istantanea (<kbd>Ctrl</kbd> + <kbd>K</kbd>)**: Motore di ricerca rapido indicizzato su tutte le sezioni, patologie, farmaci, audio e 3D.

---

## 🔒 Privacy, Cookie & GDPR

- **Nessun Tracciamento Pubblicitario**: Il portale non fa uso di cookie di profilazione o strumenti di tracciamento di terze parti.
- **Archiviazione Locale Riservata**: I progressi dello studio e le preferenze d'interfaccia risiedono esclusivamente nel `localStorage` del browser dell'utente.

---

## 💻 Stack Tecnologico

| Componente | Tecnologia |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Build Tooling & Bundler** | [Vite 8](https://vite.dev/) (Rolldown engine) |
| **Grafica 3D & WebGL** | [Three.js](https://threejs.org/) (r186) + STLLoader |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/) |
| **Audio Processing** | Web Audio API (BiquadFilterNode highpass/lowpass, GainNode +6dB, MediaElementSource) |
| **Testing E2E & Visual** | Puppeteer Core + Google Chrome Headless |
| **Deploy & Hosting** | [Vercel Serverless Platform](https://vercel.com/) |

---

## 🚀 Installazione & Avvio Locale

### Prerequisiti
- [Node.js](https://nodejs.org/) versione 18.x o superiore
- Gestore pacchetti `npm` (incluso con Node.js)

```bash
# 1. Clona il repository
git clone https://github.com/Lukecele/cardio-thoracic-medterminal.git
cd cardio-thoracic-medterminal

# 2. Installa le dipendenze
npm install

# 3. Avvia l'ambiente di sviluppo locale
npm run dev

# 4. Compila per la produzione (TypeScript check + Vite build)
npm run build

# 5. Visualizza l'anteprima della build di produzione
npm run preview
```

---

## 📱 Esperienza Mobile & PWA

MedTerminal è progettato con approccio **mobile-first e touch-friendly**:
- Supporto PWA installabile su **iOS** (*Safari ➔ Condividi ➔ Aggiungi alla schermata Home*) e **Android** (*Chrome ➔ Installa applicazione*).
- Layout reattivo ottimizzato con controlli ergonomici verificati su schermi fino a 360px di larghezza.
- Scorciatoia globale di ricerca: <kbd>Ctrl</kbd> + <kbd>K</kbd> su desktop, oppure tocco sull'icona della lente nella barra superiore su mobile.

---

## ⚖️ Finalità Didattica & Licenza

Progetto universitario open-source rilasciato con licenza [MIT](LICENSE).  
**Esclusiva Finalità Didattica**: MedTerminal è concepito unicamente per la preparazione dell'esame universitario di Medicina e Chirurgia. Non costituisce dispositivo medico diagnostico né presidio per la gestione clinica di pazienti reali.
