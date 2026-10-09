# 🩺 Cardio-Thoracic MedTerminal (v2.0 FAST)

[![Live Production](https://img.shields.io/badge/Vercel-Live%20Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://cardio-thoracic-medterminal.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20STL%20Renderer-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Medical Grade](https://img.shields.io/badge/Clinical-2FAST%20Integrale-rose?style=for-the-badge&logo=addthis&logoColor=white)](#)

> **Cockpit multimodale ad alta densità per l'esame integrato di Medicina e Chirurgia**: *Cardiologia Medica*, *Cardiochirurgia*, *Pneumologia*, *Chirurgia Toracica* e *Chirurgia Vascolare*.  
> Costruito sul compendio integrale di **Lorenzo Pessetti (2FAST)** e sul **Database Ufficiale delle prove scritte e orali**.

---

## 🎯 Panoramica dell'Esame (5 Scritti & 5 Orali)

L'esame integrato del sistema cardiovascolare e respiratorio è suddiviso in 5 branche specialistiche distinte. MedTerminal aggrega la totalità del materiale didattico, eliminando la dispersione e consentendo uno studio attivo senza perdita di informazioni critiche (cut-off, linee guida ESC/ERS, classificazioni chirurgiche):

```
                        ┌──────────────────────────────────────────────┐
                        │      MED-TERMINAL CLINICAL AGGREGATOR        │
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

## ⚡ Caratteristiche Chiave

### 1. 📖 Compendio 2FAST Loss-Free & Active Recall
- **100% Fedele alle Dispense**: Trattazione enciclopedica di tutte le patologie senza omissione di numeri, percentuali, score o criteri d'esame.
- **Motore Cloze Blur (Active Recall)**: Modalità commutabile in tempo reale che sfoca selettivamente cut-off clinici, dosaggi farmacologici e parole chiave per stimolare il richiamo attivo prima dell'orale.
- **Perle & Trabocchetti d'Esame**: Segnalazione visiva immediata delle nozioni bersagliate dai docenti agli appelli.

### 2. 🏆 Simulatore Database Scritti (Question Bank Ufficiale)
- **48+ Quesiti Ufficiali Verificati**: Ricostruzione fedele con 5 opzioni (`a`-`e`), cronologia delle sessioni d'esame e spiegazioni cliniche punto per punto.
- **Filtro per Disciplina**: Possibilità di filtrare i quiz per singola branca (Cardio, Pneumo, Vascolare) o modalità mista globale.
- **Feedback Istantaneo**: Calcolo automatico del punteggio, tracciamento degli errori e visualizzazione immediata della risposta corretta.

### 3. 🩺 Simulatore Orali a 5 Stazioni (Clinical Board Simulator)
- **Casi Clinici Complessi**: Vignette dettagliate per ciascuna delle 5 commissioni d'esame (paziente, parametri vitali, obiettività stetoscopica e strumentale).
- **Interrogazione a Step Sequenziali**: Domande progressive del docente (diagnosi differenziale, terapia di prima linea, indicazioni all'intervento chirurgico).
- **Rivelazione Guidata & Alert Trabocchetto**: Risposta modello da 30 e lode con evidenziazione del *Fatal Trap* che costa la bocciatura all'orale.
- **Autovalutazione dello Studente**: Sistema di rating a semaforo (`Ottima`, `Accettabile`, `Da Rivedere`).

### 4. 🫀 Viewport Anatomico 3D Reale (STL Loader)
- **Segmentazioni Cliniche TAC/RMN Reali**:
  - `heart.stl` (Anatomia cardiaca tridimensionale ad alta risoluzione).
  - `aorta_dilatation.stl` (Ectasia e dilatazione dell'aorta ascendente dal catalogo NIH 3D Print Exchange).
- **Rendering PBR Avanzato**: Shader Three.js con ACESFilmic Tone Mapping, rotazione orbitale libera 360°, switch Wireframe/Shader e reset camera con un clic.

### 5. 🔊 Soundboard Stetoscopica Reale (Stetofonografia 44.1kHz)
- **Audio Autentico da Stetoscopio Medico** (Nessuna sintesi fittizia o oscillatori artificiali):
  - **S1-S2 Fisiologico**: Toni cardiaci normali a 61 bpm.
  - **Soffio Sistolico a Diamante**: Registrazione stetoscopica di stenosi valvolare aortica.
  - **Soffio Olosistolico**: Difetto del setto ventricolare (VSD).
  - **Fibrillazione Atriale**: Ritmo caotico irregolarmente irregolare.
  - **Tachicardia Ventricolare/SVT**: Frequenza rapida a 150 bpm.
  - **Sibili Espiratori**: Rantoli e wheezing nell'attacco asmatico acuto.
  - **Crepitii Tele-inspiratori**: Crepitii velcro da essudato alveolare in polmonite lobare.
- **Controlli Integrati**: Regolazione volume audio, riproduzione continua in loop e waveform visiva in tempo reale.

### 6. ⚡ Scanner Clinico & Matrice Differenziale
- Matrice incrociata ad alta velocità: Quadro clinico ➔ Gold Standard Diagnostico ➔ Criteri di Ricovero d'Urgenza ➔ Terapia Immediata.

### 7. 🧮 Calcolatori Clinici Integrati
- **CHA₂DS₂-VASc**: Rischio cardioembolico in FA e indicazione a NAO/DOAC.
- **HAS-BLED**: Rischio emorragico per stratificazione anticoagulante.
- **Wells Score (EP)**: Probabilità pre-test di embolia polmonare e cut-off D-Dimero vs Angio-TC.
- **CURB-65**: Indice di gravità per la polmonite acquisita in comunità (CAP).

---

## 🛠️ Stack Tecnologico

- **Frontend Core**: React 19, TypeScript 5.8
- **Bundler & Tooling**: Vite 8, Rolldown engine
- **Grafica 3D**: Three.js (r186) + STLLoader
- **Stile & Layout**: Tailwind CSS v4, Lucide Icons
- **Audio Engine**: Native HTML5 Audio API con playback multitraccia non bloccante
- **PWA & Mobile**: Offline-ready manifest, display standalone, navigazione adattiva touch-first
- **Deploy**: Vercel Serverless Edge Platform

---

## 🚀 Avvio Locale

Prerequisiti: [Node.js](https://nodejs.org/) (versione 18 o superiore)

```bash
# 1. Clona il repository
git clone https://github.com/Lukecele/cardio-thoracic-medterminal.git
cd cardio-thoracic-medterminal

# 2. Installa le dipendenze
npm install

# 3. Avvia il server di sviluppo
npm run dev

# 4. Compila per la produzione
npm run build
```

---

## 📱 Supporto PWA & Mobile

MedTerminal è ottimizzato come Progressive Web App:
- Aggiungibile alla schermata home su **iOS (Safari -> Condividi -> Aggiungi alla schermata Home)** e **Android (Chrome -> Installa App)**.
- Layout HUD responsive progettato per schermi smartphone, tablet e monitor ultrawide.
- Scorciatoia globale di ricerca: <kbd>Ctrl</kbd> + <kbd>K</kbd> (o tocco sull'icona della lente da mobile).

---

## 📄 Licenza

Rilasciato con licenza MIT. Materiale clinico didattico basato sulle note di Lorenzo Pessetti e sui database storici delle sessioni d'esame.
