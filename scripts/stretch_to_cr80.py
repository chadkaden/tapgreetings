import os
import shutil
from PIL import Image

IMG_DIR = r"G:\Server\projects\tapgreetings\assets\img"
BACKUP_DIR = os.path.join(IMG_DIR, "original_9_16")
os.makedirs(BACKUP_DIR, exist_ok=True)

# CR80 standard: 53.98mm x 85.60mm
CR80_RATIO = 53.98 / 85.60
TARGET_HEIGHT = 2752
TARGET_WIDTH = int(round(TARGET_HEIGHT * CR80_RATIO)) # 1735 or 1736

print(f"Target CR80 Dimensions: {TARGET_WIDTH} x {TARGET_HEIGHT} (ratio: {TARGET_WIDTH/TARGET_HEIGHT:.4f})")

files = []
for i in range(1, 17):
    code = f"{i:03d}"
    files.append(f"{code}-front.jpg")
    files.append(f"{code}-back.jpg")

processed = 0
for fname in files:
    src_path = os.path.join(IMG_DIR, fname)
    backup_path = os.path.join(BACKUP_DIR, fname)
    if not os.path.exists(src_path):
        print(f"Skipping missing: {fname}")
        continue
    
    # Backup original if not already backed up
    if not os.path.exists(backup_path):
        shutil.copy2(src_path, backup_path)
    
    with Image.open(backup_path) as im:
        orig_size = im.size
        orig_ratio = orig_size[0] / orig_size[1]
        
        # Squeeze / stretch to exact CR80 aspect ratio
        stretched_im = im.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
        
        # Save back to src_path
        stretched_im.save(src_path, quality=95, optimize=True)
        processed += 1
        print(f"[{processed}/{len(files)}] {fname}: {orig_size} (ratio {orig_ratio:.3f}) -> ({TARGET_WIDTH}, {TARGET_HEIGHT}) (ratio {TARGET_WIDTH/TARGET_HEIGHT:.3f})")

print(f"\nSuccessfully squeezed & stretched {processed} images to CR80 Credit Card ratio!")
