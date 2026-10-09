import re

def parse_cardio():
    with open('scripts/cardio.txt', 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    pages = text.split('\x0c')
    print(f"Total cardio pages: {len(pages)}")
    return pages

def parse_pneumo():
    with open('scripts/pneumo.txt', 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    pages = text.split('\x0c')
    print(f"Total pneumo pages: {len(pages)}")
    return pages

def parse_vascolare():
    with open('scripts/vascolare.txt', 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    pages = text.split('\x0c')
    print(f"Total vascolare pages: {len(pages)}")
    return pages

def parse_scritti():
    with open('scripts/database_scritti.txt', 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    domande = re.split(r'Domanda\s+\d+', text)
    print(f"Total scritti sections: {len(domande)}")
    return text

c = parse_cardio()
p = parse_pneumo()
v = parse_vascolare()
s = parse_scritti()
