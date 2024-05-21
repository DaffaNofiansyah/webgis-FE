const DEFAULT_COORD = [-6.5539484, 106.7207479];

// Initialize the map with zoom control
const Map = L.map("render-map", {
  zoomControl: true,
}).setView(DEFAULT_COORD, 15);

Map.zoomControl.setPosition("bottomright");

// Define layers
const osmTile = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 20,
    minZoom: 2,
    useCache: true,
    crossOrigin: true,
    cacheMaxAge: 24 * 3600 * 1000, // Cache tiles for 24 hours
  }
);

const satellite = L.tileLayer(
  "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    minZoom: 2,
    attribution: "Imagery ©2022 Google",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    useCache: true,
    crossOrigin: true,
    cacheMaxAge: 24 * 3600 * 1000, // Cache tiles for 24 hours
  }
);

const terrain = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    attribution: "Data © OpenTopoMap (CC-BY-SA)",
    maxZoom: 20,
    minZoom: 2,
    useCache: true,
    crossOrigin: true,
    cacheMaxAge: 24 * 3600 * 1000, // Cache tiles for 24 hours
  }
);

// Add the default layer asynchronously
setTimeout(() => {
  osmTile.addTo(Map);
}, 500);

function changeLayer(type) {
  Map.eachLayer(function (layer) {
    if (layer instanceof L.TileLayer) {
      Map.removeLayer(layer);
    }
  });
  if (type === "default") {
    osmTile.addTo(Map);
  } else if (type === "satellite") {
    satellite.addTo(Map);
  } else if (type === "terrain") {
    terrain.addTo(Map);
  }
}

// Custom Zoom Functionality
function zoomInMap() {
  Map.zoomIn();
}

function zoomOutMap() {
  Map.zoomOut();
}

// Define styles for circle markers
// const markerStyle = {
//     color: '#000',
//     fillColor: '#FF7800',
//     fillOpacity: 0.8,
//     radius: 10,
//     weight: 2
// };

// // Array to store the marker references
// const markers = [];

// // Function to filter markers based on scale
// function filterMarkers() {
//     const filterValue = document.getElementById('scale-filter').value;

//     markers.forEach(marker => {
//         const markerScale = marker.options.scale;
//         if (
//             filterValue === 'all' ||
//             (filterValue === 'low' && markerScale < 5000) ||
//             (filterValue === 'medium' && markerScale >= 5000 && markerScale < 10000) ||
//             (filterValue === 'high' && markerScale >= 10000)
//         ) {
//             if (!Map.hasLayer(marker)) {
//                 marker.addTo(Map);
//             }
//         } else {
//             if (Map.hasLayer(marker)) {
//                 Map.removeLayer(marker);
//             }
//         }
//     });
// }

// // Add markers with popups for each position
// popupContents.forEach(content => {
//     const marker = L.circleMarker(content.position, {
//         ...markerStyle,
//         scale: content.scale // Store the scale value in the marker options
//     }).addTo(Map);

// marker.bindPopup(`
//     <div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; text-align: left; padding: 10px;">
//         <div style="margin-right: 10px;">
//             <img src="${content.image}" alt="${content.name}" width="145" style="border-radius: 10px;">
//         </div>
//         <div>
//             <h2 style="margin-bottom: 5px; line-height: 2.5;">${content.name}</h2>
//             <div style="line-height: 1.5;">
//                 <p style="margin: 2px 0;"><strong>Nama Latin:</strong> <span style="font-style: italic;">${content.latinName}</span></p>
//                 <p style="margin: 2px 0;"><strong>Persebaran:</strong> ${content.distribution}</p>
//                 <p style="margin: 2px 0;"><strong>Skala:</strong> ${content.scale}</p>
//                 <p style="margin: 2px 0;"><strong>Jumlah:</strong> ${content.count}</p>
//             </div>
//         </div>
//     </div>
// `);

//     marker.on('click', function () {
//         marker.setStyle({
//             fillColor: '#0000FF'
//         });
//     });

//     marker.on('popupclose', function () {
//         marker.setStyle({
//             fillColor: '#FF7800'
//         });
//     });

//     // Add hover effect
//     marker.on('mouseover', function () {
//         marker.setStyle({
//             radius: 15,
//             fillOpacity: 1,
//             color: '#FF0000',
//             weight: 4,
//             transition: 'all 0.3s ease'
//         });
//     });

//     marker.on('mouseout', function () {
//         marker.setStyle({
//             radius: 10,
//             fillOpacity: 0.8,
//             color: '#000',
//             weight: 2,
//             transition: 'all 0.3s ease'
//         });
//     });

//     markers.push(marker);
// });

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".toggle-button");
  const settingsDrawer = document.querySelector(".settings-drawer");

  toggleButton.addEventListener("click", function () {
    settingsDrawer.classList.toggle("hidden");
  });

  // Adding custom zoom buttons to the UI
  const zoomInButton = document.createElement("button");
  zoomInButton.innerText = "Zoom In";
  zoomInButton.onclick = zoomInMap;
  document.body.appendChild(zoomInButton);

  const zoomOutButton = document.createElement("button");
  zoomOutButton.innerText = "Zoom Out";
  zoomOutButton.onclick = zoomOutMap;
  document.body.appendChild(zoomOutButton);
});

// GEOSERVER LAYER CONNECT

var wfs_url =
  "http://localhost:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3AIPB_Biodiversity&maxFeatures=50&outputFormat=application%2Fjson";

$.getJSON(wfs_url).then((res) => {
  var layer = L.geoJson(res, {
    onEachFeature: function (f, l) {
      l.bindPopup(`
            <div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; text-align: left; padding: 10px;">
                <div style="margin-right: 10px;">
                    <img src="${f.properties.Foto_URL}" alt="${f.properties.Foto_URL}" width="145" height="145" style="border-radius: 10px; object-fit: cover;">
                </div>
                <div>
                    <h2 style="margin-bottom: 5px; line-height: 1.25;">${f.properties.Nama}</h2>
                    <div style="line-height: 1.5;">
                        <p style="margin: 2px 0;"><strong>Nama Latin:</strong><br><span style="font-style: italic;">${f.properties.Nama_Latin}</span></p>
                        <p style="margin: 2px 0;"><strong>Kategori:</strong><br>${f.properties.Kategori}</p>
                        <p style="margin: 2px 0;"><strong>Lokasi:</strong><br>${f.properties.Lokasi}</p>
                    </div>
                </div>
            </div>
        `);
    },
  }).addTo(Map);
});
