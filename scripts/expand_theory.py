import json
import os
import re

BASE_DIR = "/home/luca/cardio-thoracic-medterminal"
SRC_DATA = os.path.join(BASE_DIR, "src", "data")
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")

# Read raw notes
with open(os.path.join(SCRIPTS_DIR, "cardio.txt"), "r", encoding="utf-8", errors="ignore") as f:
    raw_cardio = f.read()

with open(os.path.join(SCRIPTS_DIR, "pneumo.txt"), "r", encoding="utf-8", errors="ignore") as f:
    raw_pneumo = f.read()

with open(os.path.join(SCRIPTS_DIR, "vascolare.txt"), "r", encoding="utf-8", errors="ignore") as f:
    raw_vascolare = f.read()

print("Raw notes loaded successfully.")
