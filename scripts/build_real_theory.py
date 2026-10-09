import os
import json
import re

# Directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")
SRC_DATA = os.path.join(BASE_DIR, "src", "data")

FILES = [
    {"filename": "cardio.txt", "id": "cardio", "title": "Cardiologia & Cardiochirurgia", "icon": "Heart"},
    {"filename": "pneumo.txt", "id": "pneumo", "title": "Pneumologia & Chirurgia Toracica", "icon": "Lungs"},
    {"filename": "vascolare.txt", "id": "vascolare", "title": "Chirurgia Vascolare", "icon": "Activity"}
]

def extract_title(page_text):
    lines = [l.strip() for l in page_text.split('\n') if l.strip()]
    if not lines:
        return None
    # Look for the first uppercase line or a prominent line
    for line in lines[:5]:
        # Ignore common non-titles
        if "pag." in line.lower() or "a cura di" in line.lower() or len(line) < 3:
            continue
        if line.isupper() or (len(line) < 60 and not line.endswith('.')):
            return line
    return lines[0][:50] + "..."

def extract_traps(text):
    traps = []
    sentences = re.split(r'[.!?]\s+', text)
    keywords = ['attenzione', 'importante', 'ricorda', 'mai', 'assolutamente', 'falso', 'fondamentale']
    for s in sentences:
        if any(k in s.lower() for k in keywords) and len(s) > 15:
            traps.append(s.replace('\n', ' ').strip() + ".")
            if len(traps) >= 3:
                break
    return traps

def extract_clozes(text):
    clozes = []
    # Find words in caps or specific terms
    caps_phrases = re.findall(r'\b[A-Z]{3,}\b', text)
    for c in set(caps_phrases):
        if c not in ['IL', 'LA', 'CHE', 'CON', 'PER', 'TRA', 'FRA', 'NON', 'DEL', 'DEI']:
            clozes.append(f"Il termine {c} è fondamentale.")
    return clozes[:5]

modules = []

for file_info in FILES:
    filepath = os.path.join(SCRIPTS_DIR, file_info["filename"])
    if not os.path.exists(filepath):
        print(f"Missing {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by form feed (pages)
    pages = content.split('\x0c')
    
    topics = []
    current_topic = None
    
    for i, page in enumerate(pages):
        page = page.strip()
        if not page:
            continue
            
        title = extract_title(page)
        if not title:
            title = f"Sezione {i+1}"
            
        # If title is similar to previous, append
        if current_topic and (title == current_topic['title'] or title.startswith("Sezione ")):
            current_topic['fullText'] += "\n\n" + page
        else:
            if current_topic:
                current_topic['examTraps'] = extract_traps(current_topic['fullText'])
                current_topic['clozeTokens'] = extract_clozes(current_topic['fullText'])
                topics.append(current_topic)
            
            topic_id = f"{file_info['id']}-topic-{i}"
            current_topic = {
                "id": topic_id,
                "title": title,
                "category": "Teoria Completa",
                "fullText": page,
                "examTraps": [],
                "clozeTokens": []
            }
            
    if current_topic:
        current_topic['examTraps'] = extract_traps(current_topic['fullText'])
        current_topic['clozeTokens'] = extract_clozes(current_topic['fullText'])
        topics.append(current_topic)
        
    modules.append({
        "id": file_info["id"],
        "name": file_info["title"],
        "icon": file_info["icon"],
        "topics": topics
    })

theory_out = os.path.join(SRC_DATA, "theory.json")
with open(theory_out, "w", encoding="utf-8") as f:
    json.dump({"modules": modules}, f, ensure_ascii=False, indent=2)

print(f"Successfully wrote {len(modules)} modules to theory.json")
