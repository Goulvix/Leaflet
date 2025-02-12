var map = L.map('map', {
center: [48.116, -1.66],
zoom: 12,
attributionControl: true });


// Ajouter une attribution personnalisée directement via la carte
map.attributionControl.addAttribution
('Réalisation : <a href = https://esigat.wordpress.com/ target = _blank > Master SIGAT </a> / OSM / Rennes Métropole');

// Ajouter des fonds de carte
var baselayers = {
OSM: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
ESRI: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png'),
CARTO: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'),
OrthoRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'raster:ortho2021'}),
PlanRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'ref_fonds:pvci_simple_gris'})
};

baselayers.CARTO.addTo(map);


// Ajouter l'echelle cartographique
L.control.scale().addTo(map);

// Ajouter une MiniMap
var miniMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png');
var miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true, minimized: false, position: 'bottomright'}).addTo(map);

// Ajouter des marqueurs manuels rennes 2
//var Rennes2 = L.marker([48.119, -1.7013]).addTo(map);
// Ajouter des marqueurs manuels gare
//var Gare = L.marker([48.103, -1.671]).addTo(map);


//Marqueur personnel (logo rennes 2)
var rennes2icone = L.icon({
  iconUrl: 'https://www.daeu.fr/app/uploads/2018/11/universite-rennes-2-350x0-c-default.png',
  iconSize: [30, 30] });

//Ajout markeur avec popup image Rennes 2

var popuprennes2 = '<h1>Université Rennes 2 </h1> <br> <img src="https://www.echosciences-bretagne.bzh/uploads/place/image/attachment/1005216262/lg_Campus_Villejean_-_Rennes.jpg" width="350px">';
var customOptions = {'maxWidth': '500', 'className' : 'custom'}
var Rennes2 = L.marker([48.119, -1.7013],{icon: rennes2icone}).bindPopup(popuprennes2,customOptions);


//Marqueur personnel (logo gare)
var gareicone = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Logo_des_trains_grandes_lignes.png/1200px-Logo_des_trains_grandes_lignes.png',
  iconSize: [30, 30] });
var gare = L.marker([48.103, -1.671], {icon: gareicone}).bindPopup('<b>Gare de Rennes</b>') ;

// Ajouter un gestionnaire d'événements pour le survol (hover)
gare.on('mouseover', function (e) {
this.openPopup();
});
// Ajouter un gestionnaire d'événements pour quitter le survol (hover)
gare.on('mouseout', function (e) {
this.closePopup();
});


//Ajout du cadastre WMS
var Cadastre = L.tileLayer.wms('http://geobretagne.fr/geoserver/cadastre/wms', {layers: 'CP.CadastralParcel',format: 'image/png',transparent: true, opacity:0.3});

//Ajout du batiments WMS
var Batiment = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'ref_cad:batiment',format: 'image/png',transparent: true});

//Ajout aménagement cyclable 
var velo = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'trp_doux:v_voirie_amenagement_velo',format: 'image/png',transparent: true});

//Ajout temps réel
var tempr = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'trp_rout:v_rva_trafic_fcd',format: 'image/png',transparent: true});

//Gérer les marqueurs 
var couches = {"Université de Rennes 2": Rennes2, "Gare de Rennes": gare, "Cadastre": Cadastre, "Bâtiments": Batiment, "Vélo": velo, "Trafic temps réel": tempr };

// Ajout des Stations de vélos
var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson).addTo(map);
  // Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h2> Station : "+velos.feature.properties.nom+"</h2>"+"<hr><h4>" 
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h4>" ;
});
});


// Ajouter le controleur de couches (quelles couches affichées). Les deux menus sont séparés




var menu2 = L.control.layers(null, couches, {
    position: 'topright',
    collapsed: false
}).addTo(map);

var menu2Container = menu2.getContainer();
var menu2Title = document.createElement('div');
menu2Title.innerHTML = "<strong>Menu des couches</strong>";
menu2Title.style.textAlign = "center";
menu2Title.style.padding = "5px";
menu2Title.style.backgroundColor = "#f8f9fa";
menu2Title.style.borderBottom = "1px solid #ccc";
menu2Container.prepend(menu2Title);

var menu1 = L.control.layers(baselayers, null, {
    position: 'topleft',
    collapsed: false
}).addTo(map);

var menu1Container = menu1.getContainer();
var menu1Title = document.createElement('div');
menu1Title.innerHTML = "<strong>Menu des fonds de carte</strong>";
menu1Title.style.textAlign = "center";
menu1Title.style.padding = "5px";
menu1Title.style.backgroundColor = "#f8f9fa"; // Couleur légère pour le titre
menu1Title.style.borderBottom = "1px solid #ccc"; // Ligne pour séparer le titre du contenu
menu1Container.prepend(menu1Title);