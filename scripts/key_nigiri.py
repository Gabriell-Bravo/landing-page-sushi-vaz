"""Recorta o fundo verde (chroma key) das imagens do nigiri e salva PNG/WebP com transparência."""
import os

import numpy as np
from PIL import Image, ImageFilter

ASSETS = r"C:\Users\gabri\.cursor\projects\c-Users-gabri-Desktop-sushi-vaz\assets"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "nigiri")
os.makedirs(OUT, exist_ok=True)

items = {
    "prato": "nigiri-prato.jpg",
    "arroz": "nigiri-arroz.jpg",
    "atum": "nigiri-atum-fatia.jpg",
}

for name, fn in items.items():
    im = Image.open(os.path.join(ASSETS, fn)).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    d = g - np.maximum(r, b)  # quanto o pixel é "verde"
    alpha = 1.0 - np.clip((d - 25.0) / 110.0, 0, 1)
    # remove o reflexo verde nas bordas
    spill = np.maximum(g - np.maximum(r, b), 0)
    g2 = g - spill * 0.9
    out = np.stack([r, g2, b], axis=-1)
    alpha_img = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    rgba = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).convert("RGBA")
    rgba.putalpha(alpha_img)
    bbox = alpha_img.point(lambda v: 255 if v > 24 else 0).getbbox()
    pad = 6
    bbox = (
        max(bbox[0] - pad, 0),
        max(bbox[1] - pad, 0),
        min(bbox[2] + pad, rgba.width),
        min(bbox[3] + pad, rgba.height),
    )
    rgba = rgba.crop(bbox)
    path = os.path.join(OUT, f"{name}.webp")
    rgba.save(path, "WEBP", quality=90, method=6)
    rgba.save(os.path.join(OUT, f"{name}.png"))
    print(name, rgba.size, os.path.getsize(path) // 1024, "KB")
