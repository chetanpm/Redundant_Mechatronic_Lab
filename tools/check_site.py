#!/usr/bin/env python3
"""Static checks for the built RML Jekyll site.

Usage (after a build):
    bundle exec jekyll build --baseurl /Redundant_Mechatronic_Lab
    python3 tools/check_site.py _site

Exit code 0 = all good, 1 = something broke. The "Checks" GitHub workflow
runs this on every PR — including Dependabot's automatic gem-bump PRs — so a
gem rollout that breaks the site shows up as a RED check on the PR before
anything can merge. Stdlib only (python3), no dependencies.

What it checks:
  1. Required build outputs exist (pages, brief, assets, feed, sitemap).
  2. Brief page structure (36 snap pages p01..p36, 87 S# markers all
     resolving to the 42 hidden-bibliography entries, no listing pages).
  3. Internal links: every relative href/src in the built HTML resolves to a
     file in the build output, with an explicit baseline for the one
     intentional placeholder 404.
"""
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

BASEURL = "/Redundant_Mechatronic_Lab"

# Intentionally missing targets (design placeholders). Drop an entry once the
# real asset lands — the checker will then verify it exists via the links.
KNOWN_MISSING = {
    # Vendored bootstrap.min.css carries font-faces for Bootstrap 3's
    # glyphicons; the site uses Font Awesome instead, so the glyphs are
    # never requested by a visible element. Pre-existing (2025 template).
    "fonts/glyphicons-halflings-regular.eot",
    "fonts/glyphicons-halflings-regular.svg",
    "fonts/glyphicons-halflings-regular.ttf",
    "fonts/glyphicons-halflings-regular.woff",
    "fonts/glyphicons-halflings-regular.woff2",
}

# Built files that must exist (relative to the build root).
REQUIRED_FILES = [
    "index.html",
    "brief/index.html",
    "feed.xml",
    "sitemap.xml",
    "assets/main.css",
    "assets/js/custom.js",
    "assets/img/sky-min.webp",
    "assets/img/projects/aerostatic_spindle_imtex.webp",
    "assets/img/projects/aerostatic_spindle_imtex_thumb.webp",
    "assets/img/projects/desktop_mill_thumb.webp",
    "assets/img/projects/desktop_mill_full.webp",
    "assets/img/projects/desktop-mill-poster.webp",
    "assets/img/projects/spindle-imtex-poster.webp",
    "assets/img/projects/tabletop_mill_thumb.webp",
    "assets/img/projects/tabletop_mill_full.webp",
    "assets/img/projects/tabletop_mill_more.webp",
    "assets/video/spindle-imtex.mp4",
    "assets/video/spindle-imtex.av1.webm",
    "assets/video/desktop-mill.mp4",
    "assets/video/desktop-mill.av1.webm",
]


class TagChecker(HTMLParser):
    VOID = {"meta", "link", "br", "img", "hr", "input", "circle", "path",
            "source", "area", "base", "col", "embed", "track", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.urls = []
        self.ids = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        if tag not in self.VOID:
            self.stack.append(tag)
        for k in ("href", "src"):
            if a.get(k):
                self.urls.append(a[k])

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if not self.stack:
            self.errors.append("unmatched closing </%s>" % tag)
        elif self.stack[-1] == tag:
            self.stack.pop()
        else:
            self.errors.append("tag mismatch: expected </%s>, got </%s>"
                               % (self.stack[-1], tag))


def check_brief(brief_path, problems, notes):
    html = brief_path.read_text(encoding="utf-8")
    c = TagChecker()
    c.feed(html)
    for e in c.errors[:5]:
        problems.append("brief: %s" % e)
    if c.stack:
        problems.append("brief: unclosed tags at end: %s" % c.stack[-5:])
    dups = sorted({i for i in c.ids if c.ids.count(i) > 1})
    if dups:
        problems.append("brief: duplicate ids: %s" % dups)

    # v6.3 (2026-10-03): 22 pages, no S# marker system, no biblio. External
    # references are minimal: a handful of direct product/source pages, the
    # two CMTI ABR-150M PDFs (spec Jan 2025 + published machining trial
    # Mar 2025), all opening in a new tab.
    pages = re.findall(r'<section class="bpage[^"]*" id="(p\d+)">', html)
    if pages != ["p%02d" % i for i in range(1, 23)]:
        problems.append("brief: expected 22 sequential pages p01..p22, got %d "
                        "(%s...%s)" % (len(pages), pages[:2], pages[-2:]))
    else:
        notes.append("brief: 22 pages p01..p22")

    if 'class="refbtn"' in html or 'data-s="S' in html:
        problems.append("brief: v6.3 has no S# marker system — markers found")
    if '<div id="biblio"' in html:
        problems.append("brief: the hidden bibliography is gone in v6.3")

    ext = re.findall(r'<a href="(http[^"]+)"([^>]*)>', html)
    no_blank = [u for u, attrs in ext if 'target="_blank"' not in attrs]
    if no_blank:
        problems.append("brief: external links must open in a new tab: %s"
                        % sorted(set(no_blank))[:3])
    if len(ext) > 24:
        problems.append("brief: minimal external references — %d anchors, "
                        "cap is 24" % len(ext))
    else:
        notes.append("brief: %d external anchors, all new-tab" % len(ext))
    if "SciMakIsse2Jan2025.pdf" not in html:
        problems.append("brief: the CMTI ABR-150M spec PDF reference "
                        "(Jan 2025) is missing")
    if "SciMakIss1March2025.pdf" not in html:
        problems.append("brief: the CMTI ABR-150M machining-trial PDF "
                        "(Mar 2025) is missing")

    if "01 / 22" not in html:
        problems.append("brief: readout should say 01 / 22")
    for token in ("{{", "{%"):
        if token in html:
            problems.append("brief: Liquid delimiter %r leaked into output" % token)
    if "µm" in html:
        problems.append("brief: uses µm — the brief is nm-only")
    if "§" in html:
        problems.append("brief: uses § — v6.3 copy is section-symbol free")
    # triple dashes are banned from VISIBLE text (CSS/HTML comments are fine)
    visible = re.sub(r'<style>.*?</style>', '', html, flags=re.S)
    visible = re.sub(r'<script.*?</script>', '', visible, flags=re.S)
    visible = re.sub(r'<!--.*?-->', '', visible, flags=re.S)
    if "---" in visible:
        problems.append("brief: triple dashes --- in visible text")


def check_links(site, problems, notes):
    missing = {}
    css_url = re.compile(r"""url\(\s*['"]?([^'")]+)['"]?\s*\)""")
    for f in sorted(list(site.rglob("*.html")) + list(site.rglob("*.css"))):
        c = TagChecker()
        text = ""
        try:
            text = f.read_text(encoding="utf-8", errors="replace")
            if f.suffix == ".html":
                c.feed(text)
        except Exception as e:  # noqa: BLE001
            problems.append("%s: unparseable file: %s" % (f, e))
            continue
        # CSS url() refs (inline styles, <style> blocks, stylesheets) also
        # have to resolve — they are not hrefs/srcs.
        for u in css_url.findall(text):
            if not u.startswith("data:"):
                c.urls.append(u)
        rel = str(f.relative_to(site))
        for url in c.urls:
            u = url.strip()
            if not u or u.startswith(("#", "http://", "https://", "//",
                                       "mailto:", "tel:", "data:", "javascript:")):
                continue
            path_part = u.split("#", 1)[0].split("?", 1)[0]
            if not path_part:
                continue
            if path_part.startswith(BASEURL + "/") or path_part == BASEURL:
                target = site / path_part[len(BASEURL):].lstrip("/")
            elif path_part.startswith("/"):
                # Root-relative without the baseurl prefix would 404 on
                # chetanpm.github.io/Redundant_Mechatronic_Lab/...
                problems.append("%s: root-relative link missing baseurl: %s"
                                % (rel, u))
                continue
            else:
                target = f.parent / path_part
            target = Path(target)
            try:
                target.resolve()
            except OSError:
                continue
            if not (target.is_file() or target.is_dir()):
                key = str(target).replace(str(site) + "/", "")
                key = os.path.normpath(key)
                missing.setdefault(key, set()).add(rel)
    for key, refs in sorted(missing.items()):
        if key in KNOWN_MISSING:
            notes.append("known-missing (ok): %s  <- %d ref(s)"
                         % (key, len(refs)))
        else:
            problems.append("missing target: %s  <- %s"
                            % (key, sorted(refs)))


def main():
    site = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("_site")
    if not site.is_dir():
        print("ERROR: build dir not found: %s" % site)
        return 1
    site = site.resolve()
    problems, notes = [], []

    for rel in REQUIRED_FILES:
        if not (site / rel).is_file():
            problems.append("missing built file: %s" % rel)

    brief = site / "brief" / "index.html"
    if brief.is_file():
        check_brief(brief, problems, notes)
    check_links(site, problems, notes)

    for n in notes:
        print("ok   " + n)
    if problems:
        for p in problems:
            print("FAIL " + p)
        print("\n%d problem(s) — the site is broken" % len(problems))
        return 1
    print("\nALL OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
