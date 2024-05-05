function createMap(EarthquakesLayer) {
    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
        "Street Map": streetmap
    };

    // Create an overlayMaps object to hold the earthquakes layer.
    let overlayMaps = {
        "Earthquakes": EarthquakesLayer
    };

    // Create the map object with options.
    let map = L.map("map", {
        center: [23.63, -102.55], 
        zoom: 4,
        layers: [streetmap, EarthquakesLayer]
    });

    // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function markersSize(magnitude) {
    // the radius of the marker based on earthquake magnitude.
    return magnitude * 10; 
}

function createMarkers(response) {
  
    let earthquakes = response.features;

    // Initialize an array 
    let EarthquakeMarkers = [];

    // Loop through the earthquake array.
    for (let index = 0; index < earthquakes.length; index++) {
        let earthquake = earthquakes[index];
        let lat = earthquake.geometry.coordinates[1];
        let lng = earthquake.geometry.coordinates[0];
        let magnitude = earthquake.properties.mag;
        let depth = earthquake.geometry.coordinates[2]

        // For each earthquake, create a marker 
        let marker = L.circleMarker([lat, lng], {
            radius: markersSize(magnitude), depth,
            fillOpacity: 0.5
        }).bindPopup("<h3>" + earthquake.properties.place + "</h3><h3>Magnitude: " + magnitude + "</h3>"+"</h3><h3>Depth: " + depth );

        // Add the marker
        EarthquakeMarkers.push(marker);
    }

    // Create a layer group made from the earthquake markers array
    createMap(L.layerGroup(EarthquakeMarkers));
}

// Perform an API call to the USGS 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
