"""Remove o fundo cinza do vídeo do chef e gera um WebM (VP9) com transparência.

Uso: python scripts/key_chef.py <video_entrada.mp4> <saida.webm> [largura]
"""
import os
import re
import subprocess
import sys

import imageio_ffmpeg
import numpy as np
from PIL import Image
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
W = int(sys.argv[3]) if len(sys.argv) > 3 else 540
ff = imageio_ffmpeg.get_ffmpeg_exe()

# descobre o tamanho e a taxa de quadros
probe = subprocess.run([ff, "-hide_banner", "-i", src], capture_output=True, text=True).stderr
size = re.search(r"(\d{3,5})x(\d{3,5})", probe[probe.index("Video:"):])
fps = float(re.search(r"([\d.]+) fps", probe).group(1))
iw, ih = int(size.group(1)), int(size.group(2))
H = int(round(W * ih / iw / 2) * 2)
print("origem", iw, ih, "fps", fps, "-> saída", W, H)

dec = subprocess.Popen(
    [ff, "-v", "error", "-i", src, "-vf", f"scale={W}:{H}:flags=lanczos", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
    stdout=subprocess.PIPE,
)
enc = subprocess.Popen(
    [
        ff, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
        "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "33", "-auto-alt-ref", "0",
        "-row-mt", "1", "-an", dst,
    ],
    stdin=subprocess.PIPE,
)

T_CORE = 9.0    # distância (em níveis de cor) abaixo da qual o pixel é fundo com certeza
T_EDGE = 30.0   # distância a partir da qual o pixel é frente com certeza
frame_bytes = W * H * 3
bg = None
previews = []
n = 0
while True:
    buf = dec.stdout.read(frame_bytes)
    if len(buf) < frame_bytes:
        break
    rgb = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    if bg is None:
        ring = np.concatenate([rgb[:8].reshape(-1, 3), rgb[-8:].reshape(-1, 3), rgb[:, :8].reshape(-1, 3), rgb[:, -8:].reshape(-1, 3)])
        bg = np.median(ring, axis=0)
        print("cor do fundo", bg)
    dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
    # fundo = muito parecido com o fundo OU parecido e ligado à borda do quadro
    cand = dist < T_EDGE
    labels, _ = ndimage.label(cand)
    border_ids = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    border_ids = border_ids[border_ids > 0]
    connected = np.isin(labels, border_ids)
    hard_bg = (dist < T_CORE) | connected
    # remove ruído: pedaços de "frente" minúsculos viram fundo
    fg = ~hard_bg
    fg = ndimage.binary_opening(fg, iterations=1)
    alpha = fg.astype(np.float32)
    # bordas suaves: perto do fundo, a opacidade vem da distância de cor
    near = ndimage.binary_dilation(~fg, iterations=2) & fg
    alpha[near] = np.clip((dist[near] - T_CORE) / (T_EDGE - T_CORE), 0, 1)
    alpha = ndimage.gaussian_filter(alpha, 0.6)
    # tira o resíduo do fundo das bordas (cor = frente pura)
    a = np.maximum(alpha, 0.06)[..., None]
    out_rgb = np.clip((rgb - (1 - a) * bg) / a, 0, 255)
    out = np.dstack([out_rgb, alpha * 255]).astype(np.uint8)
    enc.stdin.write(out.tobytes())
    if n in (5, 60, 110, 170):
        previews.append(out.copy())
    n += 1

enc.stdin.close()
enc.wait()
dec.wait()
print("quadros", n, "tamanho", os.path.getsize(dst) // 1024, "KB")

# imagem de conferência sobre o creme do site
if previews:
    tiles = []
    for p in previews:
        im = Image.fromarray(p, "RGBA")
        base = Image.new("RGBA", im.size, (244, 238, 227, 255))
        base.alpha_composite(im)
        tiles.append(base.convert("RGB").resize((W // 2, H // 2)))
    sheet = Image.new("RGB", (sum(t.width for t in tiles), tiles[0].height))
    x = 0
    for t in tiles:
        sheet.paste(t, (x, 0))
        x += t.width
    sheet.save(os.path.splitext(dst)[0] + "-conferencia.png")
