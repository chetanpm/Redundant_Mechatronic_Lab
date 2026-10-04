/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// 2026-09: site improvements in this file (nav-highlight fix, scroll
// governance, project page) developed with AI assistance.

// ✅ Navbar Collapse on Scroll + Active Section Highlight
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }

    // Highlight active section in navbar
    // (moved out of the inline script in 2-nav.html, which ran before jQuery loaded)
    var scrollPos = $(document).scrollTop();
    $('.nav a').each(function () {
        var section = $(this).attr("href");
        if ($(section).length && $(section).position().top <= scrollPos + 100) {
            $('.nav li').removeClass("active");
            $(this).parent().addClass("active");
        }
    });
});

// ✅ Smooth Scrolling with Section Navigation
document.addEventListener("DOMContentLoaded", function () {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var behavior = reduceMotion ? "auto" : "smooth";
    document.querySelectorAll("a.page-scroll").forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: behavior, block: "start" });
            }
        });
    });
});

// ✅ Close Mobile Navbar on Link Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// ✅ Remove Focus Highlight on Click
$("a").mouseup(function() {
    $(this).blur();
});

// ============================================
// ✅ Form Submission Handling with Success Modal
// ============================================
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact-form-wrapper form");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent page reload

            fetch(form.action, {
                method: "POST",
                body: new FormData(form),
            })
            .then(response => {
                if (response.ok) {
                    document.getElementById("successModal").style.display = "block";
                    form.reset(); // Clear form fields
                } else {
                    document.getElementById("errorModal").style.display = "block";
                }
            })
            .catch(error => {
                console.error("Form submission error:", error);
                document.getElementById("errorModal").style.display = "block";
            });
        });
    }
});

// ✅ Close Modal on Click
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// ============================================
// ✅ Map with Scroll Zoom Only When Holding ⌘/Ctrl
// ============================================
document.addEventListener("DOMContentLoaded", function () {
    var mapContainer = document.getElementById("map");

    if (mapContainer) {
        var map = L.map('map', {
            center: [12.2958, 76.6394],
            zoom: 13,
            scrollWheelZoom: false
        });

        document.addEventListener("keydown", function (event) {
            if (event.metaKey || event.ctrlKey) {
                map.scrollWheelZoom.enable();
            }
        });

        document.addEventListener("keyup", function (event) {
            if (!event.metaKey && !event.ctrlKey) {
                map.scrollWheelZoom.disable();
            }
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var marker = L.marker([12.2958, 76.6394], {
            icon: L.divIcon({
                className: "",
                html: '<div class="rml-crosshair-pin"></div>',
                iconSize: [22, 22],
                iconAnchor: [11, 11]
            })
        }).addTo(map)
            .bindPopup("<b>Redundant Mechatronic Lab</b><br>Mysuru City<br><small>Click to open in Google Maps</small>")
            .openPopup();

        marker.bindTooltip("Click to open Google Maps", { direction: "top", permanent: false, opacity: 0.8 });

        marker.on('click', function() {
            window.open("https://www.google.com/maps/search/?api=1&query=12.2958,76.6394", "_blank");
        });

        var zoomInstruction = document.createElement("div");
        zoomInstruction.innerHTML = "Hold ⌘ or Ctrl to zoom";
        zoomInstruction.style.position = "absolute";
        zoomInstruction.style.bottom = "10px";
        zoomInstruction.style.right = "10px";
        zoomInstruction.style.background = "rgba(0, 0, 0, 0.7)";
        zoomInstruction.style.color = "#fff";
        zoomInstruction.style.padding = "5px 10px";
        zoomInstruction.style.borderRadius = "5px";
        zoomInstruction.style.fontSize = "12px";
        zoomInstruction.style.zIndex = "1000";
        mapContainer.appendChild(zoomInstruction);

        // Pages are exact viewport stages — when the window resizes,
        // tell the map so its tiles line up again.
        var resizeRaf = null;
        window.addEventListener("resize", function () {
            if (resizeRaf) return;
            resizeRaf = requestAnimationFrame(function () {
                resizeRaf = null;
                map.invalidateSize();
            });
        });
    }
});

// ============================================
// ✅ One page per gesture + Project page
//    Pages: header, about, projects, contact,
//    map, footer — plus the project page, which
//    unfolds between Projects and Contact when a
//    project is opened. CSS scroll-snap picks the
//    landing spot; this governs gestures so a hard
//    flick / trackpad fling can never carry past
//    one page. Every page is exactly one viewport
//    tall (nothing scrolls inside a page); the
//    project page holds three folded sheets (one
//    per project) — each unfolds as a 3D page
//    turn from the fold line, its printed content
//    landing at a per-project diagonal (tri-fold
//    fan), with its "More information" page
//    attached straight below, nested under the
//    sheet's head. Each hidden sheet rests flush
//    at its own top edge (a native snap point,
//    like every other page); its head (title bar)
//    sits directly under the collapsed navbar —
//    the parent's name, centered, the link that
//    unfolded it, now its title. Clicking a head
//    folds its sheet back.
// ============================================
$(document).ready(function () {
    var pageIds = ["#header", "#about", "#projects", "#project-page", "#desktop-more", "#spindle-more", "#tabletop-more", "#contact", "#map-section", "#footer-section"];
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var behavior = reduceMotion ? "auto" : "smooth";
    var lockedUntil = 0;

    // Pages currently in the flow (the project page counts only while open).
    function livePages() {
        var out = [];
        $.each(pageIds, function (i, sel) {
            var el = document.querySelector(sel);
            if (el && el.offsetHeight > 0) out.push(sel);
        });
        return out;
    }

    // True document-top of an element (walks offsetParents, so it is
    // correct even if a section ever gets a positioned ancestor).
    function docTop(el) {
        var top = 0;
        while (el) {
            top += el.offsetTop;
            el = el.offsetParent;
        }
        return top;
    }

    // Collapsed navbar height — the sheets' heads (title bars) sit
    // directly beneath it, so their CSS offset must match the settled
    // height exactly. The hidden pages always sit in the scrolled
    // state, where the navbar is collapsed (top-nav-collapse), so the
    // collapsed height is what counts. Published to CSS as --nav.
    var navEl = document.querySelector(".navbar");
    var navCache = null;
    function navH() {
        if (navCache === null) {
            if (!navEl) {
                navCache = 50;
            } else {
                // Measure the settled collapsed height: the theme
                // transitions the navbar padding, so freeze it first.
                var had = navEl.classList.contains("top-nav-collapse");
                var tr = navEl.style.transition;
                navEl.style.transition = "none";
                if (!had) navEl.classList.add("top-nav-collapse");
                navCache = navEl.offsetHeight;
                if (!had) navEl.classList.remove("top-nav-collapse");
                navEl.style.transition = tr;
            }
        }
        return navCache;
    }
    function syncNav() {
        navCache = null;
        document.documentElement.style.setProperty("--nav", navH() + "px");
    }
    syncNav();
    window.addEventListener("resize", syncNav);
    window.addEventListener("load", syncNav);

    // Where the frame rests when showing this page: every page rests
    // flush at its own top edge (a native snap point). The one
    // exception: while a more page is open (nested) it lives below
    // its parent's head strip, so its rest is the PARENT's top edge —
    // the same rest the parent has while nested.
    function pageTop(el) {
        if (el && el.classList.contains("more-page")) return docTop(projectPage);
        return docTop(el);
    }

    function currentPage() {
        var pages = livePages();
        var pos = $(window).scrollTop() + $(window).height() / 3;
        var idx = 0;
        $.each(pages, function (i, sel) {
            var el = document.querySelector(sel);
            if (el && pageTop(el) <= pos) idx = i;
        });
        return idx;
    }

    function goToPage(idx) {
        var pages = livePages();
        if (idx < 0) idx = 0;
        if (idx > pages.length - 1) idx = pages.length - 1;
        var el = document.querySelector(pages[idx]);
        window.scrollTo({ top: pageTop(el), behavior: behavior });
        pageSettle(el);
        updateNav();
    }

    // The arriving page FITS into place with a soft bounce (slightly
    // viscous paper). The project page has its own choreography and
    // the more pages ride under it — neither gets the generic one.
    function pageSettle(el) {
        if (!el || reduceMotion) return;
        if (el.id === "project-page" || el.classList.contains("more-page")) return;
        el.classList.remove("settle");
        void el.offsetWidth; // restart the animation
        el.classList.add("settle");
    }

    // Fold back the open more page (paper motion; the frame stays
    // put — the parent's top edge is the rest in both states).
    function foldOpenMorePages() {
        if (openMore >= 0 && moreClosers[openMore]) moreClosers[openMore]({});
    }

    // One page in the reading direction (dir: 1 = down, -1 = up).
    // Special case: up from a nested more page. The project page above
    // it shares this exact rest position, so the move is the paper
    // fold back — a scroll would only land the frame on a non-rest
    // position with both heads hidden behind the navbar.
    function stepPage(fromIdx, dir) {
        var pages = livePages();
        var el = document.querySelector(pages[fromIdx]);
        if (dir < 0 && el && el.classList.contains("more-page")) {
            foldOpenMorePages();
        } else {
            goToPage(fromIdx + dir);
        }
        lockedUntil = Date.now() + 800; // let the paper settle before the governor acts
    }

    // ---------------- Fixed page navigation ----------------
    // One circle, the same screen position on every page. Down = next
    // page; on the last page it becomes the up-arrow (back to top).
    var pageNav = document.getElementById("page-nav");
    var pageNavIcon = pageNav ? pageNav.querySelector("i") : null;
    var pageInd = document.getElementById("page-ind");
    var navRaf = null;

    function updateNav() {
        if (!pageNav) return;
        var pages = livePages();
        var idx = currentPage();
        var last = idx === pages.length - 1;
        if (pageNavIcon) pageNavIcon.className = last ? "fa fa-angle-double-up bob-up" : "fa fa-angle-double-down";
        if (pageInd) pageInd.textContent = ("0" + (idx + 1)).slice(-2) + " / " + ("0" + pages.length).slice(-2);
        pageNav.setAttribute("aria-label", last ? "Back to top" : "Next page");
    }

    function queueNavUpdate() {
        if (navRaf) return;
        navRaf = requestAnimationFrame(function () {
            navRaf = null;
            updateNav();
        });
    }

    pageNav.addEventListener("click", function (event) {
        event.preventDefault();
        var idx = currentPage();
        goToPage(idx === livePages().length - 1 ? 0 : idx + 1);
    });

    $(window).on("scroll", queueNavUpdate);

    // Can we still scroll further within the given page (dir: 1 = down)?
    function canScrollWithin(dir, idx) {
        var pages = livePages();
        if (idx === undefined) idx = currentPage();
        var el = document.querySelector(pages[idx]);
        if (!el) return false;
        var st = window.scrollY;
        var top = pageTop(el);
        if (dir === 1) return (st + window.innerHeight) < (top + el.offsetHeight) - 8;
        return st > top + 8;
    }

    // ---------------- Project page: the fold ----------------
    // Three sheets (one per project) live folded between Projects
    // and Contact; each carries its own "More information" page
    // attached straight below it. All the paper motion is CSS
    // (custom.css: the 3D fall from the fold line, the diagonal
    // settle, the shadow sweep); this code is the state machine:
    // toggle classes, pan the frame, keep the governor happy.
    // Open: the sheet's paper grows to one frame while its fold
    // falls from the seam (a magazine page turn) and the printed
    // content lands at the sheet's diagonal. More: the showcase
    // shrinks to its head strip and the more page folds down from
    // the same seam — the hidden page revealing. The head (title
    // bar) folds its sheet back; ‹ › fold to the neighbour; the
    // governor's up-gesture from a more page folds the more back.
    var projectPage = document.getElementById("project-page");
    var projectsSec = document.querySelector("#projects");
    var sheets = projectPage ? Array.prototype.slice.call(projectPage.querySelectorAll(".proj-sheet")) : [];
    var morePages = Array.prototype.slice.call(document.querySelectorAll(".more-page"));
    var ppPrev = projectPage ? projectPage.querySelector(".pp-prev") : null;
    var ppNext = projectPage ? projectPage.querySelector(".pp-next") : null;
    var openSheet = -1;  // index of the unfolded sheet, -1 = all folded
    var openMore = -1;   // index of the open more page, -1 = none
    var foldBusy = false;
    var moreClosers = []; // closeMorePage per more page (the governor folds via these)

    // Fold timings (ms) — must track the CSS custom properties.
    var T_FOLD_UP = 520;   // sheet folds back up (CSS --fold-up-d .5s)
    var T_COLLAPSE = 420;  // paper collapses (CSS .closing .4s)
    var T_OPEN = 1150;     // sheet fall + diagonal pan + bounce (CSS --fold-d .9s / pan 1.05s)
    var T_MORE = 620;      // more page fold + grow (CSS --more-d .7s)

    function moreEl(i) { return morePages[i] || null; }

    function syncHasMore() {
        if (projectPage) projectPage.classList.toggle("has-more", openMore >= 0);
    }

    // The arrows show the open sheet's place in the row; dimmed at
    // both ends (no wrap-around), gone while a more page is open
    // (CSS: #project-page.has-more .pp-arrow).
    function updateArrows() {
        if (!ppPrev || !ppNext) return;
        ppPrev.classList.toggle("pp-dim", openSheet <= 0);
        ppNext.classList.toggle("pp-dim", openSheet >= sheets.length - 1);
    }

    // Snap is off while the paper moves (the snap points are in flux
    // while a sheet grows / collapses); restored shortly after.
    var noSnapTimer = null;
    function noSnap(ms) {
        document.documentElement.classList.add("no-snap");
        if (noSnapTimer) clearTimeout(noSnapTimer);
        noSnapTimer = setTimeout(function () {
            noSnapTimer = null;
            document.documentElement.classList.remove("no-snap");
        }, ms);
    }

    // Unfold sheet i and pan the frame to the fold line.
    function openSheetNow(i) {
        openSheet = i;
        sheetEl(i).classList.add("open");
        noSnap(900);
        window.scrollTo({ top: pageTop(projectPage), behavior: behavior });
        syncHasMore();
        updateArrows();
        updateNav();
        setTimeout(updateNav, 700); // the readout once the sheet has real height
    }

    function sheetEl(i) { return sheets[i] || null; }

    // Fold sheet i back up (3D), then let the paper collapse.
    // opts: { scroll: pan the frame back to Projects, onFolded, onDone }
    function closeSheet(opts) {
        var i = openSheet;
        if (i < 0) {
            if (opts.onFolded) opts.onFolded();
            if (opts.onDone) opts.onDone();
            return;
        }
        foldBusy = true;
        var s = sheetEl(i);
        openSheet = -1;
        if (reduceMotion) {
            s.classList.remove("open");
            if (opts.scroll) window.scrollTo({ top: pageTop(projectsSec), behavior: "auto" });
            syncHasMore();
            updateArrows();
            updateNav();
            foldBusy = false;
            if (opts.onFolded) opts.onFolded();
            if (opts.onDone) opts.onDone();
            return;
        }
        s.classList.add("closing"); // the sheet folds up (fast 3D)
        setTimeout(function () {
            noSnap(700);
            s.classList.remove("open"); // the paper collapses (.4s)
            if (opts.scroll) window.scrollTo({ top: pageTop(projectsSec), behavior: behavior });
            if (opts.onFolded) opts.onFolded();
            setTimeout(function () {
                s.classList.remove("closing"); // hide the folded sheet
                updateArrows();
                updateNav();
                foldBusy = false;
                if (opts.onDone) opts.onDone();
            }, T_COLLAPSE);
        }, T_FOLD_UP);
    }

    // Card click / arrow / keyboard: unfold sheet i. Same sheet
    // again = fold everything back to Projects.
    function openSheetAt(i) {
        i = Math.min(sheets.length - 1, Math.max(0, i));
        if (foldBusy) return;
        foldBusy = true;
        if (openSheet === i) {
            lockedUntil = Date.now() + (openMore >= 0 ? T_MORE + T_FOLD_UP + T_COLLAPSE : T_FOLD_UP + T_COLLAPSE) + 400;
            foldAllBack();
            return;
        }
        if (openSheet < 0) {
            lockedUntil = Date.now() + T_OPEN + 150;
            openSheetNow(i);
            setTimeout(function () { foldBusy = false; }, reduceMotion ? 0 : T_OPEN);
            return;
        }
        // A different sheet is open: fold it back up, then unfold
        // the new one as the old paper collapses.
        lockedUntil = Date.now() + T_FOLD_UP + T_COLLAPSE + T_OPEN + 300;
        closeMoreInstant();
        closeSheet({
            scroll: false,
            onFolded: function () {
                openSheetNow(i);
                setTimeout(function () { foldBusy = false; }, reduceMotion ? 0 : T_OPEN + 200);
            }
        });
    }

    function closeMoreInstant() {
        if (openMore < 0) return;
        moreClosers[openMore]({ instant: true });
    }

    // Everything back to the grid: the more page folds first, then
    // its sheet (only while a more page is open are there two).
    function foldAllBack() {
        if (openSheet < 0) { foldBusy = false; return; }
        if (openMore >= 0) {
            moreClosers[openMore]({
                onDone: function () {
                    closeSheet({
                        scroll: true,
                        onDone: function () { foldBusy = false; }
                    });
                }
            });
        } else {
            closeSheet({
                scroll: true,
                onDone: function () { foldBusy = false; }
            });
        }
    }

    // The visible sheet's content can be taller than the viewport;
    // then vertical wheeling must keep scrolling inside it.
    function contentCanScrollY(dir) {
        if (openSheet < 0) return false;
        if (livePages()[currentPage()] !== "#project-page") return false;
        var p = sheets[openSheet] ? sheets[openSheet].querySelector(".ps-content") : null;
        if (!p) return false;
        if (dir === 1) return (p.scrollTop + p.clientHeight) < (p.scrollHeight - 8);
        return p.scrollTop > 8;
    }

    if (projectPage && sheets.length) {
        document.querySelectorAll(".project-link").forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                var i = parseInt(link.getAttribute("data-index"), 10) - 1;
                openSheetAt(i);
            });
        });

        // The heads fold their sheet (and its more page) back.
        sheets.forEach(function (s, i) {
            var head = s.querySelector(".ps-head");
            if (head) {
                head.addEventListener("click", function () {
                    if (openSheet !== i) return;
                    foldBusy = true;
                    lockedUntil = Date.now() + T_FOLD_UP + T_COLLAPSE + 400;
                    foldAllBack();
                });
            }
        });

        // ‹ ›: fold to the neighbouring sheet (clamped, no wrap).
        if (ppNext) {
            ppNext.addEventListener("click", function () {
                if (openSheet >= 0 && openSheet < sheets.length - 1) openSheetAt(openSheet + 1);
            });
        }
        if (ppPrev) {
            ppPrev.addEventListener("click", function () {
                if (openSheet >= 0 && openSheet > 0) openSheetAt(openSheet - 1);
            });
        }

        document.addEventListener("keydown", function (event) {
            if (openSheet < 0 || livePages()[currentPage()] !== "#project-page") return;
            if (event.key === "ArrowRight" && openSheet < sheets.length - 1) openSheetAt(openSheet + 1);
            else if (event.key === "ArrowLeft" && openSheet > 0) openSheetAt(openSheet - 1);
        });

        // The more pages: each opens nested under its sheet's head
        // strip (the showcase shrinks to the strip, the more page
        // fills the rest — the frame never moves) and folds back
        // from its own smaller head.
        morePages.forEach(function (more, mi) {
            var openMorePage = function () {
                if (foldBusy || openSheet !== mi || openMore >= 0) return;
                foldBusy = true;
                lockedUntil = Date.now() + T_MORE + 200;
                openMore = mi;
                noSnap(800);
                sheetEl(mi).classList.add("nested");
                more.classList.add("open");
                syncHasMore();
                updateArrows();
                updateNav();
                setTimeout(function () { foldBusy = false; }, reduceMotion ? 0 : T_MORE);
            };
            var closeMorePage = function (opts) {
                opts = opts || {};
                if (openMore !== mi) return;
                openMore = -1;
                syncHasMore();
                var s = sheetEl(mi);
                if (opts.instant || reduceMotion) {
                    s.classList.remove("nested");
                    more.classList.remove("open", "closing");
                    updateArrows();
                    updateNav();
                    if (opts.onDone) opts.onDone();
                    return;
                }
                noSnap(700);
                s.classList.remove("nested");  // the paper grows back
                more.classList.add("closing"); // stays visible while it folds
                more.classList.remove("open"); // height -> 0, fold back down
                setTimeout(function () {
                    more.classList.remove("closing");
                    foldBusy = false;
                    updateArrows();
                    updateNav();
                    if (opts.onDone) opts.onDone();
                }, T_MORE);
            };
            moreClosers[mi] = closeMorePage;
            document.querySelectorAll('.pp-more[href="#' + more.id + '"]').forEach(function (a) {
                a.addEventListener("click", function (event) {
                    event.preventDefault();
                    if (foldBusy) return;
                    if (openMore === mi) {
                        closeMorePage({});
                        lockedUntil = Date.now() + T_MORE + 200;
                    } else {
                        openMorePage();
                    }
                });
            });
            var smHead = more.querySelector(".sm-head");
            if (smHead) {
                smHead.addEventListener("click", function (event) {
                    event.preventDefault();
                    if (foldBusy) return;
                    closeMorePage({});
                    lockedUntil = Date.now() + T_MORE + 200;
                });
            }
        });

        updateArrows();
    }

    updateNav();

    // ---------------- Wheel ----------------
    // A burst of wheel events (a fling) = one gesture = exactly one page.
    var wheelActive = false;
    var wheelAccum = 0;
    var wheelTimer = null;
    var wheelBoundary = null; // the edge section, while a rubber-band gesture runs
    var rubberOffset = 0;     // current rubber-band displacement (px)

    // Rubber band: flicking past the head or the tail of the booklet
    // drags the edge page elastically (damped resistance — it becomes
    // harder the further you pull) and springs it home with two
    // decaying overshoots. Slightly viscous paper.
    function rubberDamp(total) {
        var x = total * 0.55;
        var d = x * (1 - 1 / (Math.abs(x) * 0.03 + 1));
        return Math.max(-110, Math.min(110, d));
    }

    function rubberApply(el, total) {
        rubberOffset = rubberDamp(total);
        el.classList.add("no-anchor"); // keep scroll anchoring out of it
        el.style.transition = "none";
        el.style.transform = "translateY(" + rubberOffset + "px)";
    }

    function rubberRelease(el) {
        var off = rubberOffset;
        rubberOffset = 0;
        if (!el) return;
        if (!off || reduceMotion) {
            el.classList.remove("no-anchor");
            el.style.transform = "";
            el.style.transition = "";
            return;
        }
        el.style.setProperty("--rb", off + "px");
        el.classList.remove("rubber-back");
        void el.offsetWidth; // restart the spring
        el.classList.add("rubber-back"); // 0% of the keyframe = --rb (no flash)
        el.addEventListener("animationend", function h(e) {
            if (e.animationName !== "rubber-back") return;
            el.classList.remove("rubber-back", "no-anchor");
            el.style.removeProperty("--rb");
            el.style.transform = "";
            el.style.transition = "";
            el.removeEventListener("animationend", h);
        });
        lockedUntil = Date.now() + 850;
    }

    window.addEventListener("wheel", function (event) {
        if (Date.now() < lockedUntil) {
            event.preventDefault();
            return;
        }
        // ⌘/Ctrl + wheel over the map = zoom, not paging
        var overMap = event.target && event.target.closest && event.target.closest("#map-container");
        if (overMap && (event.metaKey || event.ctrlKey)) return;
        if (!wheelActive) {
            // Inside a tall page (or the open sheet's content):
            // native scroll.
            var dir0 = event.deltaY > 0 ? 1 : -1;
            if (canScrollWithin(dir0) || contentCanScrollY(dir0)) return;
            wheelActive = true;
            wheelAccum = 0;
            // Edge of the booklet: rubber-band instead of paging.
            wheelBoundary = null;
            if (!reduceMotion) {
                var wIdx = currentPage();
                var wPages = livePages();
                if ((dir0 < 0 && wIdx === 0) || (dir0 > 0 && wIdx === wPages.length - 1)) {
                    wheelBoundary = document.querySelector(wPages[wIdx]);
                }
            }
        }
        event.preventDefault(); // own the whole gesture
        wheelAccum += event.deltaY;
        if (wheelBoundary) rubberApply(wheelBoundary, wheelAccum);
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(function () {
            wheelActive = false;
            var dir = wheelAccum > 0 ? 1 : (wheelAccum < 0 ? -1 : 0);
            wheelAccum = 0;
            var rb = wheelBoundary;
            wheelBoundary = null;
            if (rb) {
                rubberRelease(rb);
                return;
            }
            if (!dir) return;
            stepPage(currentPage(), dir);
        }, 180);
    }, { passive: false });

    // ---------------- Touch ----------------
    var touchY = null;
    var touchT = 0;
    var touchStartPage = null;

    window.addEventListener("touchstart", function (event) {
        touchY = event.touches[0].clientY;
        touchT = Date.now();
        touchStartPage = currentPage();
    }, { passive: true });

    window.addEventListener("touchend", function (event) {
        if (touchY === null) return;
        var d = touchY - event.changedTouches[0].clientY;
        var dt = Date.now() - touchT;
        touchY = null;
        if (dt === 0 || Math.abs(d) < 40) return;      // a tap, not a swipe
        if (Math.abs(d) / dt < 0.4) return;            // gentle swipe: CSS snap handles it
        var dir = d > 0 ? 1 : -1;
        if (canScrollWithin(dir, touchStartPage)) return; // flicking inside a tall page
        if (contentCanScrollY(dir)) return;               // flicking inside the open sheet's content
        // Edge of the booklet: a rubber thud (drag + elastic return)
        // instead of a page move.
        if (!reduceMotion) {
            var tPages = livePages();
            if ((dir < 0 && touchStartPage === 0) || (dir > 0 && touchStartPage === tPages.length - 1)) {
                var tEl = document.querySelector(tPages[touchStartPage]);
                rubberOffset = dir * 46;
                tEl.classList.add("no-anchor");
                tEl.style.transition = "none";
                tEl.style.transform = "translateY(" + rubberOffset + "px)";
                rubberRelease(tEl);
                return;
            }
        }
        stepPage(touchStartPage, dir);                    // hard flick: exactly one page
    }, { passive: true });

    // ---------------- Layer three: the CAD ground work ----------------
    // The line trace under the project sheet draws itself once, the
    // first time this area comes into view. Reduced motion: it simply
    // sits there, already drawn (CSS handles that; the class is
    // harmless either way).
    var cadLayer = document.querySelector(".cad-layer");
    if (cadLayer && "IntersectionObserver" in window) {
        var cadSeen = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    cadLayer.classList.add("cad-drawn");
                    cadSeen.disconnect();
                }
            });
        }, { threshold: 0.25 });
        cadSeen.observe(cadLayer);
    } else if (cadLayer) {
        cadLayer.classList.add("cad-drawn");
    }

    // The third layer, in the console, for the ones who open it.
    if (!window.__rmlEgg) {
        window.__rmlEgg = true;
        console.log("%cREDUNDANT MECHATRONIC LAB", "font:700 15px 'IBM Plex Mono', monospace");
        console.log("Three layers: what it is · how it's built · why it's overbuilt.");
        console.log("You're on the third one. The lines under the project sheet are traced from the CAD model.");
    }
});


// ✅ Theme toggle (2026-10): the sun/moon button at the end of the nav.
// No stored choice -> the site follows the OS (prefers-color-scheme) live;
// a click stores the choice (rml-theme) and overrides the OS. The CSS in
// _includes/css/custom.css carries both token sets.
(function () {
    var root = document.documentElement;
    var btn = document.getElementById("theme-toggle");
    var mqLight = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

    function effective() {
        var t = root.getAttribute("data-theme");
        if (t === "light" || t === "dark") return t;
        return (mqLight && mqLight.matches) ? "light" : "dark";
    }

    function syncIcon() {
        if (!btn) return;
        var light = effective() === "light";
        btn.classList.toggle("in-light", light);
        btn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
        btn.title = light ? "Dark mode" : "Light mode";
    }

    if (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            var next = effective() === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            try { localStorage.setItem("rml-theme", next); } catch (err) {}
            syncIcon();
        });
    }

    if (mqLight && mqLight.addEventListener) {
        mqLight.addEventListener("change", function () {
            if (!root.getAttribute("data-theme")) syncIcon();
        });
    }

    syncIcon();
})();
