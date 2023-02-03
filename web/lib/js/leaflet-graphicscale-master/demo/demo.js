(function() {
	'use strict';

	var map = L.map('map', {
        maxZoom: 30
    }).setView([16.252583, -61.539917], 10);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{key}/{z}/{x}/{y}.png', {
        key: 'lrqdo.me2bng9n',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="http://mapbox.com">Mapbox</a>'
    }).addTo(map);

	var graphicScale = L.control.graphicScale({
		doubleLine: false,
		fill: 'hollow',
	}).addTo(map);

    

})();
