---
---
/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("a.page-scroll").forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50, // Adjust offset if needed
                    behavior: "smooth"
                });
            }
        });
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// remove the focused state after click,
// otherwise bootstrap will still highlight the link
$("a").mouseup(function(){
    $(this).blur();
})

//Projects section

document.addEventListener("DOMContentLoaded", function () {
    console.log("Project.js is running...");

    document.querySelectorAll(".project-thumbnail").forEach(thumbnail => {
        thumbnail.addEventListener("click", function () {
            var index = this.getAttribute("data-index");
            console.log("Clicked on project index:", index);
            openProject(index);
        });
    });
});

function openProject(index) {
    var selectedProject = projectsData[index - 1];

    if (!selectedProject) {
        console.error("No project found for index:", index);
        return;
    }

    console.log("Opening project:", selectedProject.name);

    // Hide all project thumbnails
    document.querySelectorAll(".project-thumbnail").forEach(thumb => {
        thumb.style.opacity = "0.5"; // Dim other thumbnails
    });

    // Set new details
    document.getElementById("expanded-image").src = selectedProject.image_expanded;
    document.getElementById("expanded-title").innerText = selectedProject.name;
    document.getElementById("expanded-description").innerText = selectedProject.details;

    var specsList = document.getElementById("expanded-specifications");
    specsList.innerHTML = "";
    selectedProject.specifications.forEach(spec => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${spec.label}:</strong> ${spec.value}`;
        specsList.appendChild(listItem);
    });

    // Show expanded project details
    var expandedProject = document.getElementById("expanded-project");
    expandedProject.style.display = "block";
    expandedProject.scrollIntoView({ behavior: "smooth" });
}

//Form section

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

// Maps section

document.addEventListener("DOMContentLoaded", function () {
    var mapContainer = document.getElementById("map");
  
    if (mapContainer) {
      var map = L.map('map', {
        center: [12.2958, 76.6394],
        zoom: 13,
        scrollWheelZoom: false // Disable scroll zoom initially
      });
  
      // Enable zoom only when Command (⌘) or Ctrl is pressed
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
  
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
  
      // Add Marker with Popup
      var marker = L.marker([12.2958, 76.6394]).addTo(map)
        .bindPopup("<b>Redundant Mechatronic Lab</b><br>Mysore City<br><small>Click to open in Google Maps</small>")
        .openPopup();
  
      // Tooltip for better visibility
      marker.bindTooltip("Click to open Google Maps", { direction: "top", permanent: false, opacity: 0.8 });
  
      // Clickable marker to open Google Maps
      marker.on('click', function() {
        window.open("https://www.google.com/maps/search/?api=1&query=12.2958,76.6394", "_blank");
      });
  
      // Add instruction text for zoom behavior
      var zoomInstruction = document.createElement("div");
      zoomInstruction.innerHTML = "Hold ⌘ (Mac) or Ctrl (Windows) to zoom";
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

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Project details split open animation
function toggleProjectDetails(index) {
    var details = document.getElementById("project-details-" + index);
    if (details) {
        if (details.style.display === "block") {
            details.style.display = "none";
        } else {
            details.style.display = "block";
        }
    }
}