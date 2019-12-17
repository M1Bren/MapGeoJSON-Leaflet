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

// Overlays Object
let overlays = {
    "Earthquakes": eqLayer
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

// Retrieve earthquake GeoJSON data and plot it on the maps
d3.json(eqURL, data => {
    
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
});