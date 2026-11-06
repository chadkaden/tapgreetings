import os
import glob
import re

ROOT_DIR = r"G:\Server\projects\tapgreetings"

# 1. Update index.html and collection pages
# Replace aspect-[9/16] inside card grid items with aspect-[54/86]
html_files = glob.glob(os.path.join(ROOT_DIR, "*.html")) + \
             glob.glob(os.path.join(ROOT_DIR, "*", "*.html"))

updated_count = 0

for fpath in html_files:
    # Skip scratch or node_modules
    if "scratch" in fpath or "node_modules" in fpath or ".git" in fpath:
        continue
    
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = content
    
    # In card grid items:
    # <div class="relative w-full aspect-[9/16] bg-[#120C08] overflow-hidden flex items-center justify-center">
    # Replace with:
    # <div class="relative w-full aspect-[54/86] bg-[#120C08] overflow-hidden flex items-center justify-center">
    new_content = re.sub(
        r'class="relative w-full aspect-\[9/16\] bg-\[#120C08\]',
        r'class="relative w-full aspect-[54/86] bg-[#120C08]',
        new_content
    )
    
    # In perspective-container (the 3D flip physical card preview on card pages):
    # <div class="perspective-container w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16]
    # Replace with aspect-[54/86]
    new_content = re.sub(
        r'class="perspective-container w-full max-w-\[280px\] sm:max-w-\[320px\] aspect-\[9/16\]',
        r'class="perspective-container w-full max-w-[280px] sm:max-w-[320px] aspect-[54/86]',
        new_content
    )

    # In Zoom modal if present:
    new_content = re.sub(
        r'aspect-\[9/16\] max-h-\[70vh\]',
        r'aspect-[54/86] max-h-[70vh]',
        new_content
    )
    new_content = re.sub(
        r'aspect-\[9/16\] max-h-\[80vh\]',
        r'aspect-[54/86] max-h-[80vh]',
        new_content
    )
    
    if new_content != content:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        updated_count += 1
        print(f"Updated: {os.path.relpath(fpath, ROOT_DIR)}")

print(f"\nDone! Updated {updated_count} HTML files to CR80 credit card aspect ratio aspect-[54/86].")
