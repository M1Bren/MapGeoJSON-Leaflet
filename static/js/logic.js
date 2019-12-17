// Create a selectable range of layer types.  Each user needs an API Key for the variable API_KEY
let outdoorsBKG = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

let streetsBKG = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

let satelliteBKG = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

// Create a map with the above layers
let map = L.map("map", {
    center: [39, -98],
    zoom: 5,
    layers: [outdoorsBKG, satelliteBKG, streetsBKG]
});

// Add layer for data markers
let eqLayer = new L.LayerGroup();
let tpLayer = new L.LayerGroup();

// Overlays Object
let overlays = {
    "Earthquakes": eqLayer,
    "Tectonic Plates": tpLayer
};

// Background Layer Object
let baseLayers = {
    Outdoors: outdoorsBKG,
    Streets: streetsBKG,
    Satellite: satelliteBKG
};

// Adds selection buttons to determine which layers will be on display
L.control
 .layers(baseLayers, overlays)
 .addTo(map);

 // Earthquake API URL Link
let eqURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let tpURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Returns the color according to earthquake magnitude
function getColor(magnitude) {
    switch (true) {
        case magnitude > 5:
        return "#DF0101";
        case magnitude > 4:
        return "#DF7401";
        case magnitude > 3:
        return "#D7DF01";
        case magnitude > 2:
        return "#74DF00";
        case magnitude > 1:
        return "#3ADF00";
        default:
        return "#82FA58";
    }
};

// Returns a relative radius size according to earthquake magnitude
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    else {
        return magnitude * 3;
    }
    };

// Function that sets up the marker styling
function style(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        color: "black", // This is the stroke/outline color
        stroke: true,
        weight: 1
    }
}; 

// Legend Object
let legend = L.control({
    position: "bottomright"
  });

// Function that creates a legend for the Earthquake Data
legend.onAdd = function(){
    let div = L.DomUtil
               .create("div", "info legend");

    let grades = [5, 4, 3, 2, 1, 0];
    let colors = [
      "#DF0101",
      "#DF7401",
      "#D7DF01",
      "#74DF00",
      "#3ADF00",
      "#82FA58"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

// Retrieve earthquake GeoJSON data and plot it on the maps
d3.json(eqURL, data => {

    // add the Earthquake data to the map
    L.geoJSON(data, {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng)
        },
        style: style,
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`Magnitude: ${feature.properties.mag}
                            <br>Location: ${feature.properties.place}`)
        }
    }).addTo(eqLayer);

    legend.addTo(eqLayer);
});

// Retrieve Tectonic Plate GeoJSON data and plot it on the maps
d3.json(tpURL, data => {
    L.geoJSON(data, {
        color: "red",
        weight: 3
    }).addTo(tpLayer);
})