/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// ✅ Navbar Collapse on Scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// ✅ Smooth Scrolling with Section Navigation
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("a.page-scroll").forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // Ensure header section is reachable
    document.querySelector(".btn-circle").addEventListener("click", function () {
        document.querySelector("#about").scrollIntoView({ behavior: "smooth", block: "start" });
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
// ✅ Projects Quick Look Pop-up (Centered)
// ============================================

document.addEventListener("DOMContentLoaded", function () {
    var quicklookOverlay = document.getElementById("quicklook-overlay");
    var quicklookClose = document.querySelector(".quicklook-close");

    function openProject(index) {
        var project = projectsData[index - 1];
        if (!project) return;

        document.getElementById("quicklook-title").innerText = project.name;
        document.getElementById("quicklook-description").innerText = project.details;
        document.getElementById("quicklook-image").src = project.image_expanded;

        // Show specifications
        var specsList = document.getElementById("quicklook-specifications");
        specsList.innerHTML = "";
        project.specifications.forEach(spec => {
            let listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${spec.label}:</strong> ${spec.value}`;
            specsList.appendChild(listItem);
        });

        quicklookOverlay.classList.add("show");
    }

    quicklookClose.addEventListener("click", function () {
        quicklookOverlay.classList.remove("show");
    });

    quicklookOverlay.addEventListener("click", function (event) {
        if (event.target === quicklookOverlay) {
            quicklookOverlay.classList.remove("show");
        }
    });

    window.openProject = openProject;
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

        var marker = L.marker([12.2958, 76.6394]).addTo(map)
            .bindPopup("<b>Redundant Mechatronic Lab</b><br>Mysore City<br><small>Click to open in Google Maps</small>")
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
    }
});