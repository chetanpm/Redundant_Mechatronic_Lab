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

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  var mapContainer = document.getElementById("map");

  if (mapContainer) {
    var map = L.map('map').setView([12.2958, 76.6394], 13); // Mysore coordinates

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add Marker
    var marker = L.marker([12.2958, 76.6394]).addTo(map)
      .bindPopup("<b>Redundant Mechatronic Lab</b><br>Mysore City")
      .openPopup();

    // Clickable marker to open Google Maps
    marker.on('click', function() {
      window.open("https://www.google.com/maps/search/?api=1&query=12.2958,76.6394", "_blank");
    });
  }
});

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