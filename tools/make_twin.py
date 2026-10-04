#!/usr/bin/env python3
"""Generate commercialization/prateek-brief.html — the standalone twin of
brief/index.html. Transformations (run after every brief edit):

  1. strip the fixed site-nav block (the twin has no site chrome; the page
     circle + readout stay),
  2. colophon back-link -> plain line (the twin is not inside the site),
  3. base64-embed EVERY local asset (photos, poster, CSS background, and
     both codec variants of every video) so the single file opens from
     file:// with no server and can be emailed as one attachment.

Stdlib only. Usage:  python3 tools/make_twin.py
"""
import base64
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "Redundant_Mechatronic_Lab/brief/index.html"
OUT = ROOT / "commercialization/prateek-brief.html"
WEBROOT = ROOT / "Redundant_Mechatronic_Lab"  # "../assets/..." resolves here
MIME = {".webp": "image/webp", ".mp4": "video/mp4",
        ".webm": "video/webm", ".jpg": "image/jpeg"}

html = SRC.read_text(encoding="utf-8")

html = re.sub(r'<nav class="site-nav".*?</nav>\s*', "", html, count=1, flags=re.S)

html = html.replace(
    '<p><a href="../">\u2190 Back to Redundant Mechatronic Lab</a></p>',
    "<p>Redundant Mechatronic Lab \u00b7 Mysuru, India</p>")

missing = []

def datauri(m):
    ref = m.group(1)
    p = WEBROOT / ref
    if not p.is_file():
        missing.append(ref)
        return m.group(0)
    return "data:%s;base64," % MIME[p.suffix] + base64.b64encode(p.read_bytes()).decode()

html = re.sub(r"\.\./(assets/[A-Za-z0-9_./-]+)", datauri, html)

if missing:
    sys.exit("missing assets (fix before generating the twin): " + ", ".join(missing))
if "../assets/" in html:
    sys.exit("unembedded ../assets/ reference remains — check the regex")

OUT.write_text(html, encoding="utf-8")
print("wrote %s (%.0f KB)" % (OUT.relative_to(ROOT), OUT.stat().st_size / 1024))
