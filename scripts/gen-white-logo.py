from PIL import Image
from pathlib import Path

LOGO_DIR = Path("assets/img/logo")

with Image.open(LOGO_DIR / "logo-palestras360.png") as img:
    img = img.convert("RGBA")
    _, _, _, a = img.split()
    W, H = 320, 175

    white_full = Image.merge("RGBA", (
        Image.new("L", img.size, 255),
        Image.new("L", img.size, 255),
        Image.new("L", img.size, 255),
        a,
    ))
    white_web = white_full.resize((W, H), Image.LANCZOS)
    white_web.save(LOGO_DIR / "logo-palestras360-white-web.png", format="PNG", optimize=True)
    white_web.save(LOGO_DIR / "logo-palestras360-white-web.webp", format="WEBP", quality=90)

p = LOGO_DIR / "logo-palestras360-white-web.png"
w = LOGO_DIR / "logo-palestras360-white-web.webp"
print(f"PNG {p.stat().st_size // 1024}KB  WebP {w.stat().st_size // 1024}KB  ({W}x{H})")
