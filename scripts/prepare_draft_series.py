import os
import shutil
from PIL import Image

IMG_DIR = r"G:\Server\projects\tapgreetings\assets\img"
CR80_DIR = os.path.join(IMG_DIR, "cr80")
os.makedirs(CR80_DIR, exist_ok=True)

CR80_RATIO = 53.98 / 85.60
TARGET_HEIGHT = 2752
TARGET_WIDTH = int(round(TARGET_HEIGHT * CR80_RATIO)) # 1735

draft_cards = [
    {"num": "01", "name": "Delphine (The Ice Starlet)"},
    {"num": "02", "name": "Autumn Gratitude (Thanksgiving)"},
    {"num": "03", "name": "Aria (The Village Lantern)"},
    {"num": "04", "name": "Cyber Starlet (Black Friday)"},
    {"num": "05", "name": "Midnight Toast (New Year 2026)"}
]

for card in draft_cards:
    num = card["num"]
    for side in ["front", "back"]:
        src_name = f"{num}-{side}.jpg"
        src_path = os.path.join(IMG_DIR, src_name)
        if not os.path.exists(src_path):
            print(f"Warning: {src_path} not found!")
            continue
        
        # Save as draft-01-front.jpg in cr80 folder
        out_name = f"draft-{num}-{side}.jpg"
        out_path = os.path.join(CR80_DIR, out_name)
        
        with Image.open(src_path) as im:
            stretched = im.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
            stretched.save(out_path, quality=95, optimize=True)
            print(f"Stretched {src_name} -> {out_name} ({TARGET_WIDTH}x{TARGET_HEIGHT})")

print("\nAll Draft Series cards stretched to CR80 aspect ratio!")
