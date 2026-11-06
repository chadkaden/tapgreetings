import os
from PIL import Image, ImageDraw, ImageFont

IMG_DIR = r"G:\Server\projects\tapgreetings\assets\img\cr80"
OUTPUT_PATH = r"G:\Server\projects\tapgreetings\assets\img\cr80\master-collection-box-set.jpg"

# Create a 4x4 grid of all 16 cards
# Card target thumbnail: 400 x 636 (CR80 ratio 53.98/85.60)
CARD_W = 400
CARD_H = int(round(CARD_W / (53.98 / 85.60))) # 634
PADDING = 28
HEADER_H = 180
FOOTER_H = 100

CANVAS_W = (CARD_W * 4) + (PADDING * 5) # 400*4 + 140 = 1740
CANVAS_H = HEADER_H + (CARD_H * 4) + (PADDING * 5) + FOOTER_H

canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), "#120C08")
draw = ImageDraw.Draw(canvas)

# Add subtle gradient or header banner
header_rect = [PADDING, 20, CANVAS_W - PADDING, HEADER_H - 10]
draw.rectangle(header_rect, fill="#1E130D", outline="#FBBF24", width=3)

# Place each of the 16 cards
for i in range(1, 17):
    code = f"{i:03d}"
    card_path = os.path.join(IMG_DIR, f"{code}-front.jpg")
    if not os.path.exists(card_path):
        continue
    
    with Image.open(card_path) as im:
        thumb = im.resize((CARD_W, CARD_H), Image.Resampling.LANCZOS)
        row = (i - 1) // 4
        col = (i - 1) % 4
        
        x = PADDING + col * (CARD_W + PADDING)
        y = HEADER_H + row * (CARD_H + PADDING)
        
        # Border
        draw.rectangle([x - 2, y - 2, x + CARD_W + 1, y + CARD_H + 1], outline="#FBBF24", width=2)
        canvas.paste(thumb, (x, y))

# Save composite
canvas.save(OUTPUT_PATH, quality=95, optimize=True)
print(f"Master Collection Box Set hero image created: {OUTPUT_PATH} ({CANVAS_W}x{CANVAS_H})")
