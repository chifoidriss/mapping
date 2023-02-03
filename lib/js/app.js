$(() => {
	var map = L.map('map', {
		center: [3.7024, 9.9392],
		zoom: 12,
		fullscreenControl: true,
		zoomControl: false
	});

	var osmLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

	map.addLayer(osmLayer);	


	//Ajout du plugin des coordonnées
	var mousePosition = L.control.mousePosition({
		'position': 'center',
	});
	L.control.mousePosition().addTo(map);
			
	//Ajout des outils de zoom
	var zoomHome = L.Control.zoomHome();
		zoomHome.addTo(map);

	//ajout de l'échelle 	
	var graphicScale = L.control.graphicScale({
		doubleLine: false,
		fill: 'hollow',
	}).addTo(map);

	///////// Search paysage
	var search_layer = new L.geoJson(search, { 
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, style_search(feature))
		}
	});
	map.addControl(new L.Control.Search({
		layer: search_layer,
		buildTip: function(text, val) {
			var type = val.layer.feature.properties.type;
			return '<a href="#" class="form-control '+type+'">'+text+'<b>'+type+'</b></a>';
		}
	}));
		

	//Ajout du plugin Hash
	var hash = new L.Hash(map);


	//Google Imagery
	var googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
	});

	//OSM
	var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
	}).addTo(map);	


		
	//Style conflit 2
	function style_search() {
		return {
			rotationAngle: 0.0,
			rotationOrigin: 'center center',
			icon: L.icon({
				iconUrl: 'lib/images/marker.png',
				iconSize: [0, 0]
			}),
		}
	}


	//Zones
	var zoneLayer = L.geoJson(zones, {
		style: style_zone,
		onEachFeature: evenement
	}).addTo(map);

	function style_zone() {
		return {
			opacity: 1,
			color: '#c0bb63',
			fillColor: '#d9daaa',
			dashArray: '',
			lineCap: 'butt',
			lineJoin: 'miter',
			weight: 2.5, 
			fillOpacity: 0.3,
			interactive: true,
		}
	}
		
		
	//Ajout des évènements
	function evenement(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}
		
	//Paramétrage du mouseover
	function highlightFeature(e) {
		var layer = e.target;

		// layer.setStyle({
		// 	weight: 1.25,
		// 	color: 'white',
		// 	fillColor: '#f3ed4a',
		// 	dashArray: '1',
		// 	fillOpacity: 0.6
		// });

		info.update(layer.feature.properties);
	}
		
	//Paramétrage du reset mouseover
	function resetHighlight(e) {
		zoneLayer.resetStyle(e.target);
		info.update();
	}

	//Paramétrage du zoom to bounds
	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	//Retrait des pays au zoom
	map.on("zoomend", function(e) {
		if (map.getZoom() <= 14 && map.getZoom() >= 6) {
			map.addLayer(zoneLayer);
		} else if (map.getZoom() >= 15 || map.getZoom() >= 15) {
			map.removeLayer(zoneLayer);
		}
	});

	//////////////////////////////////////////////////////////////// AJOUT DES COUCHES AU CONTROLE DES COUCHES ////////////////////////////////////////////

	var baseMaps = [
		{ 
			groupName: "FONDS CARTOGRAPHIQUES",
			expanded: true,
			layers: {
				"Open Street Map": osm,
				"Google Satellite": googleSat
			}
		}
	];

	var overlays = [
		{
			groupName: "Campagne de terrain",
			expanded: true,
			layers: {
				"Couches": zoneLayer,
				// "Parcelles plantées": parcelles_layer,
			}
		}
	];


	var options = {
		container_width : "200px",
		container_maxHeight : "auto",
		group_maxHeight : "300px",
		collapsed: false,
		exclusive : false
	};

	var control = L.Control.styledLayerControl(baseMaps, overlays, options);
	map.addControl(control);



	//Ajout du div d'informations 
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		var grades = [];
		
		// this._div.innerHTML = '<div class="zone-name"><span style="color:#2B8EB6; font-size: 15px;">Nom de la communauté</span><br />' + '<span style="font-size: 12px"> <b>' + (props ? props.Paysage || props.Nom +'</b> </span>' + '<br /> <span style="color:#2B8EB6; font-size: 15px"> Partenaire</span><br />' + '<span style="font-size: 13px"><b>' + (props.Partenaire) + '</span></b>' + '<br /> <span style="color:#2B8EB6; font-size: 15px"> Superficie totale de la zone </span><br />' + '<span style="font-size: 13px"><b>' + (props.Sup) +'  Ha' + '</span></b>' + '<br /> <span style="color:#2B8EB6; font-size: 15px"> Superficie totale plantée</span><br />' + '<span style="font-size: 13px"><b>' + (props.Sum_sup_pa) + ' Ha' + '</span></b>' + '<br /> <span style="color:#2B8EB6; font-size: 15px"> Nombre de parcelles planteés</span><br />' + '<span style="font-size: 13px"><b>' + (props.Count_) + '</span></b>' + '<br /> <span style="color:#2B8EB6; font-size: 15px"> Nombre de plants reçus</span><br />' + '<span style="font-size: 13px"><b>' + (props.Plants_Rec) + '</span></b>'+ '<br /><span style="color:#2B8EB6; font-size: 15px">Nombre de plants vivants</span><br />' + '<span style="font-size: 13px"><b>' + (props.Plants_viv) + '</span></b>' + '<br /> <span style="color:#2B8EB6; font-size: 15px"> Bambou</span><br />' + '<span style="font-size: 13px"><b>'+ (props.Bambou) + '</span></b>' + '<br /> <span style="color:#2B8EB6; font-size: 15px"> Mangrove</span><br />' + '<span style="font-size: 13px"><b>'+ (props.Mangrove) + '</span></b>'+'</div>'

		this._div.innerHTML = '<div class="zone-name">'+
			'<span style="color:#2B8EB6; font-size: 15px;">Nom de la communauté</span><br />' + '<span style="font-size: 12px"> <b>' + (props ? props.communaut +'</b> </span>' + '<br />'+
			'<span style="color:#2B8EB6; font-size: 15px">Forme</span><br />' + '<span style="font-size: 13px"><b>' + (props.forme) + '</span></b>' + '<br />'+
			'<span style="color:#2B8EB6; font-size: 15px">Nom</span><br />' + '<span style="font-size: 13px"><b>' + (props.nom) + '</span></b>' + '<br />'+
			'<span style="color:#2B8EB6; font-size: 15px">Type</span><br />' + '<span style="font-size: 13px"><b>' + (props.type) + '</span></b>' + '<br />'+
			'<span style="color:#2B8EB6; font-size: 15px">Longitude</span><br />' + '<span style="font-size: 13px"><b>' + (props.longitude) + '</span></b>' + '<br />'+
			'<span style="color:#2B8EB6; font-size: 15px">Latitude</span><br />' + '<span style="font-size: 13px"><b>' + (props.latitude) + '</span></b>'+ '<br />'+
			'</div>'
		: '');
	};
	info.addTo(map);

});
