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

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
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

document.addEventListener("DOMContentLoaded", function() {
    var latitude = 12.305743; // Replace with actual latitude
    var longitude = 76.655248; // Replace with actual longitude

    // Initialize the Leaflet Map
    var map = L.map('map').setView([latitude, longitude], 15);

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add a marker
    var marker = L.marker([latitude, longitude]).addTo(map);

    // Clickable Popup to Open Google Maps
    var googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    marker.bindPopup(`<b>Our Location</b><br><a href="${googleMapsLink}" target="_blank">Open in Google Maps</a>`).openPopup();
});