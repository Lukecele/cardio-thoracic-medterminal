import re

def analyze_document(filepath, title):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    pages = content.split('\x0c')
    print(f"\n==================================================")
    print(f"DOCUMENTO: {title} ({len(pages)} pagine)")
    print(f"==================================================")
    
    # Identify chapters and major topics
    chapter_map = []
    current_topic = None
    
    for i, page in enumerate(pages):
        page_num = i + 1
        lines = [l.strip() for l in page.split('\n') if l.strip()]
        if not lines:
            continue
            
        # Heuristic for chapter/topic headers
        header_candidate = None
        for l in lines[:5]:
            # Remove bullets
            clean_l = re.sub(r'^[•◦‣\-\*\d\.\)\s]+', '', l).strip()
            if not clean_l:
                continue
            if len(clean_l) > 3 and len(clean_l) < 70:
                if clean_l.isupper() or 'sindrome' in clean_l.lower() or 'insufficienza' in clean_l.lower() or 'stenosi' in clean_l.lower() or 'aneurisma' in clean_l.lower() or 'terapia' in clean_l.lower() or 'diagnosi' in clean_l.lower() or 'asma' in clean_l.lower() or 'bpco' in clean_l.lower() or 'polmonit' in clean_l.lower() or 'tubercolosi' in clean_l.lower() or 'sarcoidosi' in clean_l.lower() or 'tumori' in clean_l.lower() or 'pneumotorace' in clean_l.lower() or 'dissezione' in clean_l.lower() or 'piede diabetico' in clean_l.lower():
                    header_candidate = clean_l
                    break
        
        if header_candidate:
            chapter_map.append((page_num, header_candidate, len(page)))
            
    print(f"Estratti {len(chapter_map)} argomenti/punti chiave:")
    for p_num, name, size in chapter_map:
        print(f"  [Pag. {p_num:3d}] {name} ({size} caratteri)")

analyze_document('scripts/cardio.txt', 'CARDIO 2FAST (Cardiologia Medica & Cardiochirurgia)')
analyze_document('scripts/pneumo.txt', 'PNEUMO-TORACICA 2FAST (Pneumologia & Chirurgia Toracica)')
analyze_document('scripts/vascolare.txt', 'VASCOLARE 2FAST (Chirurgia Vascolare)')
