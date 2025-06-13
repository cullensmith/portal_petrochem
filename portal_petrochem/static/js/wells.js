var lines_pipeline_crudeoil;
var lines_pipeline_fractracker;
var lines_pipeline_hgl;
var lines_pipeline_naturalgas;
var lines_pipeline_petroleum;

var points_compressorstations;
var points_eia_bordercrossing_electric;
var points_eia_bordercrossing_liquids;
var points_eia_bordercrossing_naturalgas;
var points_eia_markethub_hgl;
var points_eia_markethub_naturalgas;
var points_eia_ports_petroleum;
var points_eia_powerplants_batterystorage ;
var points_eia_electric_generator;
var points_eia_plants_biodiesel;
var points_eia_plants_ethanol;
var points_eia_plants_ethylene_cracker;
var points_eia_plants_coal;
var points_eia_plants_geothermal;
var points_eia_plants_hydroelectric;
var points_eia_plants_hydropumped;
var points_eia_plants_power_naturalgas;
var points_eia_plants_nuclear;
var points_eia_plants_petroleum;
var points_eia_plants_processing_naturalgas;
var points_eia_plants_refinery_petroleum;
var points_eia_reserve_petroleum;
var points_eia_storage_naturalgas;
var points_eia_terminal_crudeoil;
var points_eia_terminal_lng;
var points_eia_terminal_petroleum;

var buffs;
var filteredPoints;

// Create constants for the filter items
const statetextbox = document.getElementById('datasetSelection');

const tooltip = document.getElementById('custom-tooltip');
const tooltipTargets = document.querySelectorAll('.tooltip-target');

// Loop through all matching elements
tooltipTargets.forEach(target => {
    target.addEventListener('mousemove', (e) => {
        tooltip.textContent = target.getAttribute('data-tooltip') || "Coming Soon!";
        tooltip.style.left = e.clientX + 10 + 'px';
        tooltip.style.top = e.clientY + 10 + 'px';
        tooltip.style.opacity = 1;
    });

    target.addEventListener('mouseleave', () => {
        tooltip.style.opacity = 0;
    });
});


// Main portion centered around the map container
// Initialize Leaflet map
const divider = document.getElementById('dividerContainer');
const mapC = document.getElementById('map');
const bottomContainer = document.getElementById('bottomContainer');
let isDragging = false;


divider.addEventListener('mousedown', (e) => {
  isDragging = true;
  document.body.style.cursor = 'ns-resize';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const containerRect = document.getElementById('container').getBoundingClientRect();
  const offsetY = e.clientY - containerRect.top;

  const totalHeight = containerRect.height;
  const mapHeightPercentage = (offsetY / totalHeight) * 100;

  if (mapHeightPercentage >= 10 && mapHeightPercentage <= 90) {
    mapC.style.height = `${mapHeightPercentage}%`;
    bottomContainer.style.height = `${100 - mapHeightPercentage}%`;

    // resizes the map so that it covers the new container size
    map.invalidateSize();
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.cursor = 'default';
});


var map = L.map('map').setView([39.8283,-98.5795], 4);
var geojsonLayer;
var osmUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        osm = L.tileLayer(osmUrl, { maxZoom: 20, attribution: osmAttrib }).addTo(map),
        drawnItems = L.featureGroup();
var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
});
var sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    // attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors' 
});
var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    // attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community' 
}).addTo(map);


var controlbase = L.control.layers({'Light': osm,'OSM':OpenStreetMap_Mapnik, 'Satellite':sat, 'Terrain':Esri_WorldTopoMap}, {}, { position: 'bottomleft', collapsed: false }).addTo(map);

var geocoder = L.Control.Geocoder.nominatim();
if (typeof URLSearchParams !== 'undefined' && location.search) {
    // parse /?geocoder=nominatim from URL
    var params = new URLSearchParams(location.search);
    var geocoderString = params.get('geocoder');
    if (geocoderString && L.Control.Geocoder[geocoderString]) {
    // console.log('Using geocoder', geocoderString);
    geocoder = L.Control.Geocoder[geocoderString]();
    } else if (geocoderString) {
    console.warn('Unsupported geocoder', geocoderString);
    }
}

var control = L.Control.geocoder({
    defaultMarkGeocode: false,
    collapsed: false,
    placeholder: 'Go to a location...',
    position:'topright',
    geocoder: geocoder
}).addTo(map);


// Store the marker object
var searchMarker = null;

// Custom transparent icon (1x1 pixel transparent PNG)
var transparentIcon = L.icon({
    iconUrl: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png',  // A 1x1 transparent PNG URL or your own image
    iconSize: [1, 1],  // Set size to 1x1 (or a very small size)
    iconAnchor: [0.5, 0.5],  // Anchor it at the center
    popupAnchor: [0, -16],  // Adjust popup position
});

// Overriding the default marker to make it transparent
control.on('markgeocode', function(event) {
    var latlng = event.geocode.center;
    var marker = L.marker(latlng, {
        icon: L.divIcon({
            className: 'transparent-marker', // Use custom class for the marker
            iconSize: [0, 0]  // Set the size of the marker to 0 (invisible)
        })
    }).addTo(map);
    map.setView(latlng, 14);  // Center map on the result
});



var dots;





var geoJsonCtyLayer;
var geoJsonCtyLayerid;
var ctytally;
var ctytallyid;
let ctyids = [];
var layerNames;
var numicon;
// Create a GeoJSON layer to store all polygons with count > 0

var ctytallyLayer;
var markerIconCollection;
function ctyct(data, d) {
    // Initialize a tally object
    let tally = {};
    let minCount = Infinity;
    let maxCount = -Infinity;

    if (ctytallyLayer) {
        map.removeLayer(ctytallyLayer);
    } ;


    // Parse the data and tally occurrences
    JSON.parse(d).features.forEach(feature => {
        const { stusps, county } = feature.properties;
        const key = `${stusps}_${county}`;
        if (!tally[key]) {
            tally[key] = 0;
        }
        tally[key]++;
    });

    // Loop through each feature and check the tally count
    var filteredCtyCtGeoJSON = {
        "type": "FeatureCollection",
        "features": []
    };
    var markerFeatures = {
        "type": "FeatureCollection",
        "features": []
    };

    data.features.forEach(feature => {
        const statename = feature.statename;
        const county = feature.county;
        const geometry = feature.geometry;
        const tallyKey = `${statename}_${county}`;
        const count = tally[tallyKey] || 0;

        // Track the min and max counts to later adjust opacity proportionally
        if (count < minCount) minCount = count;
        if (count > maxCount) maxCount = count;

        if (count > 0) {
            filteredCtyCtGeoJSON.features.push(feature);

            const polygonLayer = L.geoJSON(feature);
            const center = polygonLayer.getBounds().getCenter(); 

            markerFeatures.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [center.lng, center.lat]
                },
                "properties": {
                    "county": county,
                    "statename": statename,
                    "count": count
                }
            });
        }
    });

    // Function to calculate opacity based on count
    function calculateOpacity(count) {
        const normalized = (count - minCount) / (maxCount - minCount);
        return 0.1 + normalized * 0.8;  // Opacity will range from 0.1 to 0.9
    }

    // Create a GeoJSON layer for the filtered polygons
    ctytallyLayer = L.geoJSON(filteredCtyCtGeoJSON, {
        style: function(feature) {
            const county = feature.county;
            const statename = feature.statename;
            const count = tally[`${statename}_${county}`] || 0;
            const opacity = calculateOpacity(count); // Calculate opacity based on count

            return {
                fillColor: '#025687',        
                color: '#025687',
                weight: 2,              
                opacity: 1,             
                fillOpacity: opacity // Set fill opacity based on count
            };
        },
        zIndex: 200,
        onEachFeature: function(feature, layer) {
            const county = feature.county;
            const statename = feature.statename;
            const count = tally[`${statename}_${county}`] || 0;
            // layer.bindPopup(`<strong>County:</strong> ${county}<br><strong>Count:</strong> ${count}`);
            // Add hover functionality to show county name in a tooltip
            layer.on({
                mouseover: function(e) {
                    var layer = e.target;
                    layer.bindTooltip(`<strong>County:</strong> ${county}<br><strong>Count:</strong> ${count}`, {
                        permanent: false,
                        direction: 'top',
                        opacity: 0.9
                    }).openTooltip();
                },
                mouseout: function(e) {
                    e.target.closeTooltip();
                }
            });
        }
    }).addTo(map);
    document.getElementById('countylayer').checked = true;
    document.getElementById('countychoropleth').checked = true;

    if (markerIconCollection) {
        map.removeLayer(markerIconCollection);
    } ;

    // Create GeoJSON layer for markers (with zoom level control)
    markerIconCollection = L.geoJSON(markerFeatures, {
        zIndex: 1,
        pointToLayer: function(feature, latlng) {
            const numberIcon = L.divIcon({
                className: 'number-icon',
                html: `<div><strong>${feature.properties.count}</strong></div>`,
                iconSize: [55, 30],
                iconAnchor: [30, 20], 
            });

            const iconStyle = `
                .number-icon {
                    background-color: #00253B;  
                    color: #A9DFFF;
                    opacity: .8;
                    border-radius: 25%;     
                    border: 2px solid white;  
                    display: flex;
                    justify-content: center;  
                    align-items: center;      
                    font-size: 14px;          
                    font-weight: bold;        
                }
            `;
            const styleElement = document.createElement('style');
            styleElement.innerHTML = iconStyle;
            document.head.appendChild(styleElement);

            return L.marker(latlng, { icon: numberIcon, zIndex: 1 });
        }
    });
    document.getElementById('countycount').checked = false;
}


// Show points only if zoom level is between 10 and 14
map.on('zoomend', function () {
    var currentZoom = map.getZoom();
    // console.log(currentZoom)
    if (currentZoom <= 6) {
        if (markerIconCollection) {
            markerIconCollection.remove();
            document.getElementById('countycount').checked = false;
        }
    } 
});





function tableJson(i) {
    console.log('tableJson: '+i)
    const grab = getmodname(i)
    console.log('tableJson activated')

    fetch(`/petrochem/generate_geojson_comps?grab=${encodeURIComponent(grab)}`)
        .then(response => response.json())
        .then(data => {
            console.log('table data out')
            tabledata=JSON.parse(data)
            // console.log(tabledata)
            createTable(tabledata); 
            document.getElementById('tabledataset').innerText = i;
})}


function applyCategoryFilter() {
    // Fetch GeoJSON data from the server
    var dataLayer = getSelValues('datasetSelection').replace(",,,","");  // Assuming this returns a comma-delimited string
    console.log('dataLayer: '+dataLayer)
    modname = getmodname(dataLayer)
    console.log('display name: '+modname)
    mapLayer = getmaplayer(modname)
    // console.log('map layer: '+maplayer)
    legendItem = getlegenditem(modname)
    console.log('legend item: '+legendItem)

    if (!mapLayer) {
        console.log('checking on adding the layer')
        addLayerSafely(dataLayer);
    } else {
        console.log('already exists - adding')
        mapLayer.addTo(map);
        document.getElementById(legendItem).checked = true;
        console.log('table json')
        tableJson(dataLayer)
        console.log('table json added')
    };
    document.getElementById('tabledataset').innerText = dataLayer;

    };


     


function getColor(stype) {
    switch (stype) {
        case 'Plugged':
        return  '#0287D4';
        case 'Injection / Storage / Service':
        return '#A3CF5F';
        case 'Production Well':
        return 'red';
        case 'Other / Unknown':
        return '#00253B';
        case 'Orphaned / Abandoned / Unverified Plug':
        return '#FFC857';
        case 'Not Drilled':
        return 'green';
        default:
        return '#FDFFFC';
    }
}

function createTriangleMarker(latlng,newcolor) {
    return L.marker(latlng, {
        icon: L.divIcon({
        className: 'custom-marker-icon',
        html:  `<div class="triangle-marker" style="border-bottom: 8px solid #${newcolor};"></div>`,
        iconSize: [8, 8],
        iconAnchor: [4, 4]
        })
    });
    }
function createDiamondMarker(latlng,newcolor) {
    return L.marker(latlng, {
        icon: L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="diamond-marker" style="background:#${newcolor};"></div>`,
        iconSize: [8, 8],
        iconAnchor: [4, 4]
        })
    });
    }
function createPentagonMarker(latlng) {
    return L.marker(latlng, {
        icon: L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="pentagon-marker" style="background:#${newcolor};"></div>`,
        iconSize: [8, 8],
        iconAnchor: [4, 4]
        })
    });
    }

function createHexagonMarker(latlng) {
    return L.marker(latlng, {
        icon: L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="hexagon-marker" style="background:#${newcolor};"></div>`,
        iconSize: [8, 8],
        iconAnchor: [4, 4]
        })
    });
    }


const highlightStyle = {
    radius: 5  // what you want on hover
};
const defaultStyle = {
    radius: 2,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};


var layerStore = {};

function addLayerSafely(layerId, layerObj) {
    if (!layerStore[layerId]) {
        layerStore[layerId] = layerObj;
        console.log('has not been created yet')
        if (layerId.includes('_')) {
            console.log("Underscore found - 1");
        } else {
            console.log("No underscore - 1");
        }
        createPointLayer(layerId)
    } else {
        tableJson(layerId)
        console.log("Layer already created:", layerId);
    }
}

function createPointLayer(ptlay) {
    
    if (ptlay.includes('_')) {
        console.log("Underscore found - 2");
        displayName = getdisplayname(ptlay)
        modname = ptlay
    } else {
        console.log("No underscore - 2");
        displayname = ptlay
        modname = getmodname(ptlay)
    }
    console.log('ptlay: '+ptlay)
    
    // displayname = ptlay
    layerStore[ptlay] = getmaplayername(modname);
    console.log(`create the ${ptlay} layer`)
    fetch(`/petrochem/generate_geojson_comps?grab=${encodeURIComponent(modname)}`)
        .then(response1 => response1.json())
        .then(data1 => {
            console.log('got the data')
            d=JSON.parse(data1)
            console.log('right after')
            
            if (ptlay === 'Compressors') {
                console.log('checked compressor stations')
                points_compressorstations = L.geoJSON(d, {
                    pointToLayer: function (feature, latlng) {
                        newcolor = '00253B'
                        const marker = createTriangleMarker(latlng,newcolor);
                    
                        marker.on('mouseover', () => {
                          const el = marker.getElement().querySelector('.triangle-marker');
                          el.style.transform = 'scale(2)';
                        });
                    
                        marker.on('mouseout', () => {
                          const el = marker.getElement().querySelector('.triangle-marker');
                          el.style.transform = 'scale(1)';
                        });
                    
                        return marker;
                      },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });
                          layer.bindPopup( 
                            `<div style="color: black; font-weight: bold;"><u>${displayname}</u></div><br>` +
                            `<span style="color: black; font-weight: bold;">NAICS Desc: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.naics_desc}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Operator: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.operator}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Longitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.x}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Latitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.y}</span>`
                        );
                    }
            
                });
                if (!map.hasLayer(points_compressorstations)) {
                    map.addLayer(points_compressorstations);
                }
            } else if (ptlay === 'Bordercrossing_Electric') {
                // Example point style
                newcolor = '5d792f'
                // Add the GeoJSON layer to the map
                points_eia_bordercrossing_electric = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createTriangleMarker(latlng,newcolor);
                            
                            marker.on('mouseover', () => {
                              const el = marker.getElement().querySelector('.triangle-marker');
                              el.style.transform = 'scale(2)';
                            });
                        
                            marker.on('mouseout', () => {
                              const el = marker.getElement().querySelector('.triangle-marker');
                              el.style.transform = 'scale(1)';
                            });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });
                        layer.bindPopup( 
                            `<div style="color: black; font-weight: bold;"><u>${displayname}</u></div><br>` +
                            `<span style="color: black; font-weight: bold;">Owner: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.owner}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Linename: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.linename}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Longitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.x).toFixed(6)}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Latitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.y).toFixed(6)}</span>`
                        );

                    }
            
                });
                if (!map.hasLayer(points_eia_bordercrossing_electric)) {
                    console.log('needed to add the layer')
                    map.addLayer(points_eia_bordercrossing_electric);
                }
            } else if (ptlay === 'Electric_Generator') {
                // Example point style
                newcolor = 'de02d3'
                // Add the GeoJSON layer to the map
                points_eia_electric_generator = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createHexagonMarker(latlng,newcolor);
                            
                            marker.on('mouseover', () => {
                              const el = marker.getElement().querySelector('.hexagon-marker');
                              el.style.transform = 'scale(2)';
                            });
                        
                            marker.on('mouseout', () => {
                              const el = marker.getElement().querySelector('.hexagon-marker');
                              el.style.transform = 'scale(1)';
                            });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });
                        layer.bindPopup( 
                            `<div style="color: black; font-weight: bold;"><u>${displayname}</u></div><br>` +
                            `<span style="color: black; font-weight: bold;">Owner: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.owner}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Linename: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.linename}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Longitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.x).toFixed(6)}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Latitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.y).toFixed(6)}</span>`
                        );

                    }
            
                });
                if (!map.hasLayer(points_eia_electric_generator)) {
                    console.log('needed to add the layer')
                    // map.addLayer(points_eia_electric_generator);
                }
            } else if (ptlay === 'Bordercrossing_Liquids') {
                // Example point style
                newcolor = '00253B'
                // Add the GeoJSON layer to the map
                points_eia_bordercrossing_liquids = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            
                            const marker = createTriangleMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                              const el = marker.getElement().querySelector('.triangle-marker');
                              el.style.transform = 'scale(2)';
                            });
                        
                            marker.on('mouseout', () => {
                              const el = marker.getElement().querySelector('.triangle-marker');
                              el.style.transform = 'scale(1)';
                            });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });
                        layer.bindPopup( 
                            `<div style="color: black; font-weight: bold;"><u>${displayname}</u></div><br>` +
                            `<span style="color: black; font-weight: bold;">Owner: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.owner}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Pipeline: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.pipeline}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Longitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.x).toFixed(6)}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Latitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.y).toFixed(6)}</span>`
                        );

                    }
            
                }).addTo(map);
            }  else if (ptlay === 'Bordercrossing_Naturalgas') {
                // Example point style
                newcolor = 'de541e'
                // Add the GeoJSON layer to the map
                points_eia_bordercrossing_naturalgas = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createTriangleMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                              const el = marker.getElement().querySelector('.triangle-marker');
                              el.style.transform = 'scale(2)';
                            });
                        
                            marker.on('mouseout', () => {
                              const el = marker.getElement().querySelector('.triangle-marker');
                              el.style.transform = 'scale(1)';
                            });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });
                        layer.bindPopup( 
                            `<div style="color: black; font-weight: bold;"><u>${displayname}</u></div><br>` +
                            `<span style="color: black; font-weight: bold;">Owner: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.owner}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Pipeline: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.pipeline}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Longitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.x).toFixed(6)}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Latitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.y).toFixed(6)}</span>`
                        );

                    }
            
                }).addTo(map);
            }  else if (ptlay === 'Markethubs_hgl') {
                // Example point style
                newcolor = '0287D4'
                // Add the GeoJSON layer to the map
                points_eia_markethub_hgl = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });
                    layer.bindPopup( 
                            `<div style="color: black; font-weight: bold;"><u>${displayname}</u></div><br>` +
                            `<span style="color: black; font-weight: bold;">Facility: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.facility}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Longitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.x).toFixed(6)}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Latitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.y).toFixed(6)}</span>`
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Markethubs_Naturalgas') {
                // Example point style
                newcolor = '00253B'
                // Add the GeoJSON layer to the map
                points_eia_markethub_naturalgas = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });
                    layer.bindPopup( 
                            `<div style="color: black; font-weight: bold;"><u>${displayname}</u></div><br>` +
                            `<span style="color: black; font-weight: bold;">Hub Name: </span>` +
                            `<span style="color: grey; font-weight: normal;">${feature.properties.hubname}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Longitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.x).toFixed(6)}</span><br>` +
                            `<span style="color: black; font-weight: bold;">Latitude: </span>` +
                            `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.y).toFixed(6)}</span>`
                        );

                     }
            
                }).addTo(map);
            } else if (ptlay === 'Ports_Petroleum') {
                // Example point style
                newcolor = 'A3CF5F'
                // Add the GeoJSON layer to the map
                points_eia_ports_petroleum = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });
                    layer.bindPopup( 
                        `<div style="color: black; font-weight: bold;"><u>${displayname}</u></div><br>` +
                        `<span style="color: black; font-weight: bold;">Port Name: </span>` +
                        `<span style="color: grey; font-weight: normal;">${feature.properties.name}</span><br>` +
                        `<span style="color: black; font-weight: bold;">Port Code: </span>` +
                        `<span style="color: grey; font-weight: normal;">${feature.properties.portcode}</span><br>` +
                        `<span style="color: black; font-weight: bold;">Longitude: </span>` +
                        `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.x).toFixed(6)}</span><br>` +
                        `<span style="color: black; font-weight: bold;">Latitude: </span>` +
                        `<span style="color: grey; font-weight: normal;">${parseFloat(feature.properties.y).toFixed(6)}</span>`
                    );

                    }
            
                }).addTo(map);
            } else if (ptlay === 'Powerplants_Batterystorage') {
                // Example point style
                newcolor = '00253B'
                // Add the GeoJSON layer to the map
                points_eia_powerplants_batterystorage = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createHexagonMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                    layer.bindPopup( "<br><b>Plant Name: </b>" + 
                          feature.properties.plant_name + "<br><b>Utility Name: </b>" + 
                          feature.properties.utility_name  + "<br><b>Longitude:</b> " + 
                          parseFloat(feature.properties.x).toFixed(6) + "<br><b>Latitude: </b>" +
                          parseFloat(feature.properties.y).toFixed(6)
                      );
                    }
            
                }).addTo(map);
            }  else if (ptlay === 'Plants_Biodiesel') {
                // Example point style
                newcolor = '00253B'
                // Add the GeoJSON layer to the map
                points_eia_plants_biodiesel = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createPentagonMarker(latlng);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.pentagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.pentagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                    layer.bindPopup( "<br><b>Company: </b>" + 
                          feature.properties.company + "<br><b>Site: </b>" + 
                          feature.properties.site  + "<br><b>Longitude:</b> " + 
                          parseFloat(feature.properties.x).toFixed(6) + "<br><b>Latitude: </b>" +
                          parseFloat(feature.properties.y).toFixed(6)
                      );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Ethanol') {
                // Example point style
                newcolor = '0287D4'
                // Add the GeoJSON layer to the map
                points_eia_plants_ethanol = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createPentagonMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.pentagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.pentagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                          layer.bindPopup( "<br><b>Company: </b>" + 
                          feature.properties.company + "<br><b>Site: </b>" + 
                          feature.properties.site  + "<br><b>Longitude:</b> " + 
                          parseFloat(feature.properties.x).toFixed(6) + "<br><b>Latitude: </b>" +
                          parseFloat(feature.properties.y).toFixed(6)
                      );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Ethylene_Cracker') {
                // Example point style
                newcolor = 'A3CF5F'
                // Add the GeoJSON layer to the map
                points_eia_plants_ethylene_cracker = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createPentagonMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.pentagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.pentagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                    layer.bindPopup( "<br><b>Company: </b>" + 
                          feature.properties.company + "<br><b>Site: </b>" + 
                          feature.properties.site  + "<br><b>Longitude:</b> " + 
                          parseFloat(feature.properties.x).toFixed(6) + "<br><b>Latitude: </b>" +
                          parseFloat(feature.properties.y).toFixed(6)
                      );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Coal') {
                // Example point style
                newcolor='000000'
                // Add the GeoJSON layer to the map
                points_eia_plants_coal = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createHexagonMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Geothermal') {
                // Example point style
                newcolor='5d792f'
                // Add the GeoJSON layer to the map
                points_eia_plants_geothermal = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createHexagonMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Hydroelectric') {
                // Example point style
                newcolor='0287D4'
                // Add the GeoJSON layer to the map
                points_eia_plants_hydroelectric = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Hydropumped') {
                // Example point style
                newcolor='A3CF5F'
                // Add the GeoJSON layer to the map
                points_eia_plants_hydropumped = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createHexagonMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Naturalgas') {
                // Example point style
                newcolor = 'A3CF5F'
                console.log('adding the natural gas power plants')
                // Add the GeoJSON layer to the map
                points_eia_plants_power_naturalgas = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createHexagonMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>Plant Name: </b>" + feature.properties.plant_name
                             + "<br><b>Utility: </b>" + 
                            feature.properties.utility_name + "<br><b>Longitude:</b> " + 
                            feature.properties.longitude + "<br><b>Latitude: </b>" +
                            feature.properties.latitude
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Nuclear') {
                // Example point style
                newcolor='FFC857'
                // Add the GeoJSON layer to the map
                points_eia_plants_nuclear = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createHexagonMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Petroleum') {
                // Example point style
                newcolor='ff0000'
                // Add the GeoJSON layer to the map
                points_eia_plants_petroleum = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createHexagonMarker(latlng);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.hexagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Processing_Naturalgas') {
                // Example point style
                newcolor = 'de541e'
                // Add the GeoJSON layer to the map
                points_eia_plants_processing_naturalgas = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createPentagonMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.pentagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.pentagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Plants_Refinery_Petroleum') {
                // Example point style
                newcolor = '000000'
                // Add the GeoJSON layer to the map
                points_eia_plants_refinery_petroleum = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createPentagonMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.pentagon-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.pentagon-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Reserve_Petroleum') {
                // Example point style
                newcolor = '5d792f'
                // Add the GeoJSON layer to the map
                points_eia_reserve_petroleum = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Storage_Naturalgas') {
                // Example point style
                newcolor='de541e'
                // Add the GeoJSON layer to the map
                points_eia_storage_naturalgas = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Terminal_Crudeoil') {
                // Example point style
                newcolor='000000'
                // Add the GeoJSON layer to the map
                points_eia_terminal_crudeoil = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Terminal_Lng') {
                // Example point style
                newcolor='FFC857'
                // Add the GeoJSON layer to the map
                points_eia_terminal_lng = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Terminal_Petroleum') {
                // Example point style
                newcolor = 'ff0000'
                // Add the GeoJSON layer to the map
                points_eia_terminal_petroleum = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng,newcolor);
                        
                            marker.on('mouseover', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(2) rotate(45deg)';
                              });
                              marker.on('mouseout', () => {
                                const el = marker.getElement().querySelector('.diamond-marker');
                                el.style.transform = 'scale(1) rotate(45deg)';
                              });
                        
                            return marker;
                          },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: highlightStyle,
                            mouseout: defaultStyle
                        });
                        layer.on('click', function(e) {
                            const clickedLatLng = e.latlng;
                            const closestFeature = findClosestFeature(clickedLatLng);
                            console.log('clicked a compressor')
                            if (closestFeature) {
                                console.log('closest feat')
                                console.log(closestFeature)
                                // Display the attributes in the box
                                const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
                                attributesBox.innerHTML = `
                                <br>
                                <h3 style="text-decoration: underline;">Within 1KM of</h3>
                                <p><b>longitude:</b><br> ${closestFeature.properties.longitude}</p>
                                <p><b>latitude:</b><br> ${closestFeature.properties.latitude}</p>
                                <br>
                                <p><b>Population:</b> ${Math.round(closestFeature.properties.j_tpop)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Racial Profile</h4>
                                <p><b>White:</b> ${Math.round(closestFeature.properties.j_wht)}</p>
                                <p><b>Black or AA:</b> ${Math.round(closestFeature.properties.j_b_aa)}</p>
                                <p><b>American Indian:</b> ${Math.round(closestFeature.properties.j_ai_an)}</p>
                                <p><b>Asian:</b> ${Math.round(closestFeature.properties.j_asn)}</p>
                                <p><b>Native Hawaiian:</b> ${Math.round(closestFeature.properties.j_nh_opi)}</p>
                                <p><b>Other race:</b> ${Math.round(closestFeature.properties.j_oth)}</p>
                                <p><b>Two or more races:</b> ${Math.round(closestFeature.properties.j_2r)}</p>
                                <p><b>Hispanic or Latino:</b> ${Math.round(closestFeature.properties.j_hl)}</p>
                                <p><b>Nonwhite:</b> ${Math.round(closestFeature.properties.j_nw)}</p>
                                <br>
                                <h4 style="text-decoration: underline;">Age</h4>
                                <p><b>over 18:</b> ${Math.round(closestFeature.properties.j_18)}</p>
                                <p><b>under 18:</b> ${Math.round(closestFeature.properties.j_u18)}</p>
                                <!--<p><b>Attribute 2:</b> ${Math.round(closestFeature.properties.attribute2)}</p>-->
                                <!--<p><b>Attribute 3:</b> ${Math.round(closestFeature.properties.attribute3)}</p>-->
                                <!-- Add other attributes as needed -->
                            `;
                            }
                          });

                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
                            //  + "<br><b>Operator: </b>" + 
                            // feature.properties.operator + "<br><b>Longitude:</b> " + 
                            // feature.properties.x + "<br><b>Latitude: </b>" +
                            // feature.properties.y
                        );
                    }
            
                }).addTo(map);
            }
            ;
            createTable(d);
        })
        .catch(error => console.log('creating point error'+error));

    }





var demobuffer;
function generate_buffs() {
    console.log('generating the buffer layer')
    // Fetch GeoJSON data from the server
    fetch(`/petrochem/generate_geojson_buffs2`)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            d=JSON.parse(data)
            // console.log(d)


            // Example point style
            const defaultStyle = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 0,
                fillOpacity: 0
            };
            const highlightStyle = {
                radius: 5  // what you want on hover
            };
            // Add the GeoJSON layer to the map
            demobuffer = L.geoJSON(d, {
                // filter: function (feature) {
                //     return feature.properties.ft_category === 'Production Well';
                // },
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, defaultStyle);
                },
                onEachFeature: function (feature, layer) {

                }
            }).addTo(map);
    })};

generate_buffs(); 
// small change


// Function to find the closest feature
function findClosestFeature(clickedLatLng) {
    let closestFeature = null;
    let closestDistance = Infinity;

    demobuffer.eachLayer(function (layer) {
        let featureLatLng = layer.getLatLng();
        let distance = clickedLatLng.distanceTo(featureLatLng);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestFeature = layer.feature;
        }
    });

    return closestFeature;
}




var myRenderer = L.canvas({ padding: 0.5, tolerance: 4 });

function createLineLayer(lay) {
    // Fetch GeoJSON data from the server
    const grab = lay
    fetch(`/petrochem/generate_geojson_lines?grab=${encodeURIComponent(grab)}`)
        .then(response => response.json())
        .then(data => {
            console.log('here are the lines');
            data=JSON.parse(data)
            // console.log(data); // The GeoJSON data is already parsed

            if (lay === 'Pipeline_Naturalgas') {

                // Line style
                var lineStyle = {
                    color: '#de541e',
                    weight: 1.5,        // Line thickness
                    opacity: 1        // Line opacity
                };

                // Line style
                var hoverStyle = {
                    color: '#de541e',
                    weight: 4,        // Line thickness
                    opacity: 1        // Line opacity
                };
                
                // Create the GeoJSON layer and apply the style
                lines_pipeline_naturalgas = L.geoJSON(data, {
                    renderer: myRenderer,
                    style: lineStyle,
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each line feature
                        if (feature.properties && feature.properties.opername && feature.properties.pipename) {
                            layer.bindPopup(
                                "<br><b>Operator: </b>" + feature.properties.opername + 
                                "<br><b>Pipeline Name: </b>" + feature.properties.pipename
                            );
                        }

                        // Event listeners for hover effect
                        layer.on('mouseover', function () {
                            layer.setStyle(
                                hoverStyle
                            );
                        });

                        layer.on('mouseout', function () {
                            // Only reset the color to red if the line is not clicked
                            if (!layer.clicked) {
                                layer.setStyle(
                                    lineStyle
                                );
                            }
                        });

                        // Event listener for click effect
                        layer.on('click', function () {
                            // Set the line color to green when clicked
                            layer.setStyle(
                                hoverStyle
                            );

                            // Mark this line as clicked (so we don't reset to red on mouseout)
                            layer.clicked = true;

                            // Open the popup when the line is clicked
                            layer.openPopup();
                        });

                        // Event listener for when the popup is closed
                        layer.on('popupclose', function () {
                            // Reset the line style to red (default) when popup is closed
                            layer.setStyle(
                                lineStyle
                            );
                            layer.clicked = false; // Reset clicked state
                        });
                    }
                }).addTo(map); // Add the layer to the map
            } else if (lay === 'Pipeline_Fractracker') {

                // Line style
                var lineStyle = {
                    color: '#025687',
                    weight: 1.5,        // Line thickness
                    opacity: 1        // Line opacity
                };

                // Line style
                var hoverStyle = {
                    color: '#025687',
                    weight: 4,        // Line thickness
                    opacity: 1        // Line opacity
                };
                
                // Create the GeoJSON layer and apply the style
                lines_pipeline_fractracker = L.geoJSON(data, {
                    renderer: myRenderer,
                    style: lineStyle,
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each line feature
                        if (feature.properties && feature.properties.opername && feature.properties.pipename) {
                            layer.bindPopup(
                                "<br><b>Operator: </b>" + feature.properties.opername + 
                                "<br><b>Pipeline Name: </b>" + feature.properties.pipename
                            );
                        }

                        // Event listeners for hover effect
                        layer.on('mouseover', function () {
                            layer.setStyle(
                                hoverStyle
                            );
                        });

                        layer.on('mouseout', function () {
                            // Only reset the color to red if the line is not clicked
                            if (!layer.clicked) {
                                layer.setStyle(
                                    lineStyle
                                );
                            }
                        });

                        // Event listener for click effect
                        layer.on('click', function () {
                            // Set the line color to green when clicked
                            layer.setStyle(
                                hoverStyle
                            );

                            // Mark this line as clicked (so we don't reset to red on mouseout)
                            layer.clicked = true;

                            // Open the popup when the line is clicked
                            layer.openPopup();
                        });

                        // Event listener for when the popup is closed
                        layer.on('popupclose', function () {
                            // Reset the line style to red (default) when popup is closed
                            layer.setStyle(
                                lineStyle
                            );
                            layer.clicked = false; // Reset clicked state
                        });
                    }
                }).addTo(map); // Add the layer to the map
            } else if (lay === 'Pipeline_hgl') {

                // Line style
                var lineStyle = {
                    color: '#0287d4',
                    weight: 1.5,        // Line thickness
                    opacity: 1        // Line opacity
                };

                // Line style
                var hoverStyle = {
                    color: '#0287d4',
                    weight: 4,        // Line thickness
                    opacity: 1        // Line opacity
                };
                
                // Create the GeoJSON layer and apply the style
                lines_pipeline_hgl = L.geoJSON(data, {
                    renderer: myRenderer,
                    style: lineStyle,
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each line feature
                        if (feature.properties && feature.properties.opername && feature.properties.pipename) {
                            layer.bindPopup(
                                "<br><b>Operator: </b>" + feature.properties.opername + 
                                "<br><b>Pipeline Name: </b>" + feature.properties.pipename
                            );
                        }

                        // Event listeners for hover effect
                        layer.on('mouseover', function () {
                            layer.setStyle(
                                hoverStyle
                            );
                        });

                        layer.on('mouseout', function () {
                            // Only reset the color to red if the line is not clicked
                            if (!layer.clicked) {
                                layer.setStyle(
                                    lineStyle
                                );
                            }
                        });

                        // Event listener for click effect
                        layer.on('click', function () {
                            // Set the line color to green when clicked
                            layer.setStyle(
                                hoverStyle
                            );

                            // Mark this line as clicked (so we don't reset to red on mouseout)
                            layer.clicked = true;

                            // Open the popup when the line is clicked
                            layer.openPopup();
                        });

                        // Event listener for when the popup is closed
                        layer.on('popupclose', function () {
                            // Reset the line style to red (default) when popup is closed
                            layer.setStyle(
                                lineStyle
                            );
                            layer.clicked = false; // Reset clicked state
                        });
                    }
                }).addTo(map); // Add the layer to the map
            } else if (lay === 'Pipeline_Petroleum') {

                // Line style
                var lineStyle = {
                    color: '#7aa535',
                    weight: 1.5,        // Line thickness
                    opacity: 1        // Line opacity
                };

                // Line style
                var hoverStyle = {
                    color: '#7aa535',
                    weight: 4,        // Line thickness
                    opacity: 1        // Line opacity
                };
                
                // Create the GeoJSON layer and apply the style
                lines_pipeline_petroleum = L.geoJSON(data, {
                    renderer: myRenderer,
                    style: lineStyle,
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each line feature
                        if (feature.properties && feature.properties.opername && feature.properties.pipename) {
                            layer.bindPopup(
                                "<br><b>Operator: </b>" + feature.properties.opername + 
                                "<br><b>Pipeline Name: </b>" + feature.properties.pipename
                            );
                        }

                        // Event listeners for hover effect
                        layer.on('mouseover', function () {
                            layer.setStyle(
                                hoverStyle
                            );
                        });

                        layer.on('mouseout', function () {
                            // Only reset the color to red if the line is not clicked
                            if (!layer.clicked) {
                                layer.setStyle(
                                    lineStyle
                                );
                            }
                        });

                        // Event listener for click effect
                        layer.on('click', function () {
                            // Set the line color to green when clicked
                            layer.setStyle(
                                hoverStyle
                            );

                            // Mark this line as clicked (so we don't reset to red on mouseout)
                            layer.clicked = true;

                            // Open the popup when the line is clicked
                            layer.openPopup();
                        });

                        // Event listener for when the popup is closed
                        layer.on('popupclose', function () {
                            // Reset the line style to red (default) when popup is closed
                            layer.setStyle(
                                lineStyle
                            );
                            layer.clicked = false; // Reset clicked state
                        });
                    }
                }).addTo(map); // Add the layer to the map
            } else if (lay === 'Pipeline_Crudeoil') {

                // Line style
                var lineStyle = {
                    color: '#00253b',
                    weight: 1.5,        // Line thickness
                    opacity: 1        // Line opacity
                };

                // Line style
                var hoverStyle = {
                    color: '#00253b',
                    weight: 4,        // Line thickness
                    opacity: 1        // Line opacity
                };
                
                // Create the GeoJSON layer and apply the style
                lines_pipeline_crudeoil = L.geoJSON(data, {
                    renderer: myRenderer,
                    style: lineStyle,
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each line feature
                        if (feature.properties && feature.properties.opername && feature.properties.pipename) {
                            layer.bindPopup(
                                "<br><b>Operator: </b>" + feature.properties.opername + 
                                "<br><b>Pipeline Name: </b>" + feature.properties.pipename
                            );
                        }

                        // Event listeners for hover effect
                        layer.on('mouseover', function () {
                            layer.setStyle(
                                hoverStyle
                            );
                        });

                        layer.on('mouseout', function () {
                            // Only reset the color to red if the line is not clicked
                            if (!layer.clicked) {
                                layer.setStyle(
                                    lineStyle
                                );
                            }
                        });

                        // Event listener for click effect
                        layer.on('click', function () {
                            // Set the line color to green when clicked
                            layer.setStyle(
                                hoverStyle
                            );

                            // Mark this line as clicked (so we don't reset to red on mouseout)
                            layer.clicked = true;

                            // Open the popup when the line is clicked
                            layer.openPopup();
                        });

                        // Event listener for when the popup is closed
                        layer.on('popupclose', function () {
                            // Reset the line style to red (default) when popup is closed
                            layer.setStyle(
                                lineStyle
                            );
                            layer.clicked = false; // Reset clicked state
                        });
                    }
                }).addTo(map); // Add the layer to the map
            } 
            // createTable(data);
        })
        .catch(error => console.log(error));
}

function createTable(geojson) {
    const tableHeader = document.getElementById("maintableheader");
    const tableBody = document.getElementById("maintablebody");

    // Clear existing content
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (!geojson || !Array.isArray(geojson.features) || geojson.features.length === 0) {
        console.warn('Invalid or empty GeoJSON.');
        return;
    }

    const firstFeature = geojson.features[0];

    // Get keys, excluding "geomjson"
    const keys = Object.keys(firstFeature.properties).filter(key => key !== 'geomjson').filter(key => key !== 'id');

    // Create header row
    const headerRow = document.createElement('tr');
    keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());  // prettify
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);

    // Create rows
    geojson.features.forEach(feature => {
        const tr = document.createElement('tr');
        keys.forEach(key => {
            const td = document.createElement('td');
            td.textContent = feature.properties[key] ?? '';
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
    updateTable(geojson,'create')
}

function populateSortDropdown(geojson) {
    const select = document.getElementById('sort-field');
    select.innerHTML = ''; // Clear existing options

    // Placeholder option
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose a field to sort';
    placeholder.style.color = '#8a8a8a';
    placeholder.selected = true;
    select.appendChild(placeholder);

    // Ensure valid GeoJSON
    if (!geojson || !geojson.features || geojson.features.length === 0) {
        console.warn('Invalid or empty GeoJSON');
        return;
    }

    const props = geojson.features[0].properties;

    // Exclude certain keys
    const excluded = ['geomjson', 'id', 'wellwiki', 'ftuid'];

    Object.keys(props).forEach(key => {
        if (!excluded.includes(key)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); // Prettify label
            select.appendChild(option);
        }
    });
}

function sortTable() {
    // console.log('tabledata:', tabledata);

    if (!tabledata || !tabledata.features) {
        console.warn('No data to sort.');
        return;
    }

    const field = document.getElementById('sort-field').value;
    console.log('Sort field:', field);

    if (!field) {
        alert("Please choose a field.");
        return;
    }

    const sortedFeatures = [...tabledata.features].sort((a, b) => {
        const valA = a.properties[field] ?? '';
        const valB = b.properties[field] ?? '';

        const aVal = typeof valA === 'string' ? valA.toLowerCase() : valA;
        const bVal = typeof valB === 'string' ? valB.toLowerCase() : valB;

        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
    });

    // Rewrap sorted features in a new geojson object
    const sortedGeojson = {
        ...tabledata,
        features: sortedFeatures
    };

    updateTable(sortedGeojson);  //  re-render with sorted data
}


let tabledata=null;
function updateTable(geojson,src) {
    populateSortDropdown(geojson);
    // console.log(geojson);
    if (src === 'create') {
        tabledata = geojson
    }
    // document.getElementById('tabledataset').innerText = `looking here`;
    if (!geojson || !Array.isArray(geojson.features)) {
        console.error('Invalid GeoJSON data');
        return;
    }

    const features = geojson.features;  // now we're working with geojson.features
    const tableBody = document.getElementById('maintablebody');
    let currentPage = 1;
    const rowsPerPage = 50;

    function maxrec(p) {
        let pgrecsMax = ((p - 1) * rowsPerPage) + rowsPerPage;
        return pgrecsMax > features.length ? features.length : pgrecsMax;
    }

    function displayRows(page) {
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageFeatures = features.slice(startIndex, endIndex);

        

        document.getElementById('records').innerText = 
            `Records ${startIndex + 1} - ${maxrec(page)} of ${features.length}`;

        tableBody.innerHTML = '';  // Clear previous rows

        pageFeatures.forEach(feature => {
            const row = document.createElement('tr');

            for (let prop in feature.properties) {
                if (['id', 'wellwiki', 'ftuid', 'geomjson'].includes(prop)) continue;

                const cell = document.createElement('td');
                cell.textContent = feature.properties[prop];
                row.appendChild(cell);
            }

            tableBody.appendChild(row);
        });

        updatePaginationControls(page);
    }

    function updatePaginationControls(page) {
        const paginationCell = document.getElementById('pagination');
        paginationCell.innerHTML = '';

        const totalPages = Math.ceil(features.length / rowsPerPage);

        if (totalPages === 0) return;

        const createButton = (text, onClick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.className = 'pagebtn';
            btn.onclick = onClick;
            return btn;
        };

        if (page > 1) {
            paginationCell.appendChild(createButton('First', () => { currentPage = 1; displayRows(currentPage); }));
            paginationCell.appendChild(createButton('Previous', () => { currentPage -= 1; displayRows(currentPage); }));
        }

        paginationCell.appendChild(createButton(`Page: ${page}`, () => displayRows(page)));

        if (page < totalPages) {
            paginationCell.appendChild(createButton('Next', () => { currentPage += 1; displayRows(currentPage); }));
            paginationCell.appendChild(createButton('Last', () => { currentPage = totalPages; displayRows(currentPage); }));
        }
    }

    window.goToPage = function () {
        const input = document.getElementById('page-input').value;
        const pageNumber = parseInt(input);
        if (pageNumber >= 1 && pageNumber <= Math.ceil(features.length / rowsPerPage)) {
            currentPage = pageNumber;
            displayRows(currentPage);
        } else {
            alert('Please enter a valid page number.');
        }
    };

    // Initial render
    displayRows(currentPage);
}


// Function to download CSV of table data
function downloadTableData(tabledata) {
    console.log('starting the download')
    // Check if filtered data is available
    if (!tabledata) {
        console.error("Filtered data is not available.");
        return;
    }

    var data = tabledata

    function encodeForCSV(str) {
        // If the string contains comma, double quote, or newline characters,
        // wrap it in double quotes and escape any double quotes within the string
        if (/[,"\n#]/.test(str)) {
            return '"' + str.replace(/"/g, '""').replace(/#/g, '') + '"';
        }
        return str;
    }

    // Convert data to CSV format
    var csvContent = "data:text/csv;charset=utf-8,";

    var headers = Object.keys(data.features[0].properties);
    csvContent += headers.join(',') + '\n';

    // Convert each data item to CSV format
    data.features.forEach(function(dataItem) {
        // console.log(dataItem)
        var row = headers.map(function(header) {
            return encodeForCSV(dataItem.properties[header]);
        }).join(",");
        csvContent += row + "\n";
    });

    // Create a Blob object with the CSV content
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_fractracker_table.csv");

    // Initiate download
    document.body.appendChild(link); // Required for Firefox
    link.click();

    // Remove the link element
    document.body.removeChild(link);
}


// Toggle legend content
document.getElementById('legend-toggle').addEventListener('click', function() {
    var content = document.querySelector('.legend-content');
    var icon = document.getElementById('legend-toggle');

    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        document.getElementById('legend_arrow').innerText = 'x';
    } else {
        content.style.display = 'none';
        document.getElementById('legend_arrow').innerText = '';
    }
});



const layersArray = [
    "Border Crossing: Electric", 
    "Border Crossing: Liquids", 
    "Border Crossing: Natural Gas", 
    "Market Hub: HGL", 
    "Market Hub: Natural Gas", 
    "Ports: Petroleum", 
    "Reserves: Petroleum", 
    "Underground Storage: Natural Gas", 
    "Terminal: Crude Oil", 
    "Terminal: LNG", 
    "Terminal: Petroleum", 
    "Compressor Stations", 
    "Plants: Biodiesel", 
    "Plants: Ethanol", 
    "Plants: Ethylene Cracker", 
    "Power Plants: Battery Storage", 
    "Plants: Coal", 
    "Plants: Geothermal", 
    "Plants: Hydroelectric", 
    "Plants: Hydro Pumped Storage",  
    "Power Plants: Natural Gas", 
    "Power Plants: Nuclear", 
    "Power Plants: Petroleum", 
    "Processing Plants: Natural Gas", 
    "Refinery: Petroleum",
    "Power Plants: Electric Generators"
    ];

// Iterate through the layersArray array and create a button for each st
layersArray.forEach(st => {
    const sbutton = document.createElement('button');
    sbutton.className = 'filterbutton';
    sbutton.id = st+'btn';
    sbutton.innerText = st.charAt(0).toUpperCase() + st.slice(1); // Capitalize the first letter of color
    sbutton.onclick = () => toggleselection('state',st);
    // Append the button to the button-container div
    document.getElementById('state-container').appendChild(sbutton);
});

function getButtonValues() {
    // Select all buttons inside the container
    const buttonchk = document.getElementById('datasetSelection').querySelectorAll('*');
    starray = ''
    // Loop through the buttons and log their values
    buttonchk.forEach(b => {
    //   console.log(b.id);
      starray+=b.id.slice(6)+','
    });
    return starray
  }

function getSelValues(s) {
    // Select all buttons inside the container
    const buttonchk = document.getElementById(s).querySelectorAll('*');
    starray = ''
    // Loop through the buttons and log their values
    buttonchk.forEach(b => {
    //   console.log(b.id);
      starray+=b.id.slice(6)+','
    });
    return starray
}


function openlist(bo) {
    statelist = getButtonValues()
};






stcontainer = document.getElementById('state-container')
stbutton = document.getElementById('statebutton')

// Show dropdown when button is clicked
stbutton.addEventListener('click', () => {
    if (stcontainer.style.display === 'none' || stcontainer.style.display === '' ) {
        stcontainer.style.display = 'block';
    } else if (stcontainer.style.display = 'block') {
        stcontainer.style.display = 'none';
    }
});

// Close dropdown if cursor leaves the button or the dropdown container
stcontainer.addEventListener('mouseleave', () => {
    stcontainer.style.display = 'none';
});

// Prevent dropdown from closing if cursor is inside the dropdown content
stcontainer.addEventListener('mouseenter', () => {
    stcontainer.style.display = 'block';
});

// Keep dropdown open if the cursor is inside the button or dropdown
stbutton.addEventListener('mouseleave', () => {
    stcontainer.style.display = 'none';
});



function toggleselection(c,v) {
    var buttonDataset = document.createElement('button-state');

    buttonDataset.classList.add('selbutton');
    statetextbox.style.display='flex';
    buttonDataset.onclick = function() {
        document.getElementById(buttonDataset.id.slice(6) + 'btn').classList = 'filterbutton';
        buttonDataset.remove(); 
    };
    
    // Create a span for the original text
    const textSpan = document.createElement('span');
    textSpan.textContent = v
    
    // Create a span for the 'X' that will appear on hover
    const closeSpan = document.createElement('span');
    closeSpan.textContent = ' X';
    closeSpan.style.display = 'none';  // Hide 'X' initially
    closeSpan.style.color = "red";

    // Append the spans inside the button
    buttonDataset.appendChild(textSpan);
    buttonDataset.appendChild(closeSpan);

    // Add hover effect to display 'X'
    buttonDataset.addEventListener('mouseenter', () => {
        closeSpan.style.display = 'inline';  // Show the 'X' when hovered
    });
    buttonDataset.addEventListener('mouseleave', () => {
        closeSpan.style.display = 'none';  // Hide the 'X' when not hovered
    });

    // buttonDataset.textContent = v;
    buttonDataset.id = "input-" + v;
    buttonDataset.style.fontWeight = 'bold';

    statetextbox.innerHTML='';
    statetextbox.appendChild(buttonDataset);
    

    applyCategoryFilter()
    getcolumns(v)
    
}


function getcolumns(ptlay) {
    console.log('getting columns for: ' + ptlay);
    grab1 = getmodname(ptlay);
    console.log('grab1: ' + grab1);
    document.getElementById('srch-input1').value = '';
    fetch(`/petrochem/generate_geojson_comps?grab=${encodeURIComponent(grab1)}`)
        .then(response => response.json())
        .then(data => {
            d = JSON.parse(data);

            const dropdown = document.getElementById("sort-field2");

            // Clear existing options
            dropdown.innerHTML = ''; // Remove all existing <option>s

            // Optional: Add a placeholder/default option
            const placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = "Choose a field";
            placeholder.style.color = "#8a8a8a";
            dropdown.appendChild(placeholder);

            const keys = Object.keys(d.features[0].properties);
            keys.forEach(key => {
                const option = document.createElement("option");
                option.value = key;
                option.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                dropdown.appendChild(option);
            });

            // const dropdown3 = document.getElementById("sort-field3");

            // Clear existing options
            // dropdown3.innerHTML = ''; // Remove all existing <option>s

            // // Optional: Add a placeholder/default option
            // const placeholder3 = document.createElement("option");
            // placeholder3.value = "";
            // placeholder3.textContent = "Refine your search";
            // placeholder3.style.color = "#8a8a8a";
            // dropdown3.appendChild(placeholder3);

            // const keys3 = Object.keys(d.features[0].properties);
            // keys3.forEach(key3 => {
            //     const option = document.createElement("option");
            //     option.value = key3;
            //     option.textContent = key3.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            //     dropdown3.appendChild(option);
            // });
        });
}





var productionwells;
var pluggedwells;
var otherwells;
var orphanwells;
var notdrilledwells;
var injectionwells;
var filtproductionwells;
var filtpluggedwells;
var filtotherwells;
var filtorphanwells;
var filtnotdrilledwells;
var filtinjectionwells;




function filterProd(data) {
    fd = JSON.parse(data);
    // console.log(fd)

    // document.getElementById('category6').checked = false;
    // document.getElementById('category5').checked = false;
    // document.getElementById('category4').checked = false;
    // document.getElementById('category3').checked = false;
    // document.getElementById('category2').checked = false;
    // document.getElementById('category1').checked = false;


    if (productionwells) {
        map.removeLayer(productionwells);
    } ;
    productionwells = L.geoJSON(fd, {
        filter: function (feature) {
            return feature.properties.ft_category === 'Production Well';
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: getColor(feature.properties.ft_category),
                fillColor: getColor(feature.properties.ft_category),
                zIndex: 10000,
                radius: 1, // Radius // Fill opacity of the circle
            });
        },
        onEachFeature: function (feature, layer) {
            // Bind a popup to each circle marker based on the properties in the GeoJSON data

            layer.bindPopup("<b>API Number: </b>" + feature.properties.api_num + "<br><b>FracTracker Class: </b>" + 
                feature.properties.ft_category + "<br><b>State: </b>" + 
                feature.properties.stusps + "<br><b>Provided Well Type: </b>" + 
                feature.properties.well_type + "<br><b>Provided Well Status: </b>" + 
                feature.properties.well_status + "<br><b>Well Name: </b>" + 
                feature.properties.well_name + "<br><b>Operator: </b>" + 
                feature.properties.operator + "<br><b>Longitude:</b> " + 
                feature.properties.lng + "<br><b>Latitude: </b>" 
            );
        }

    });

    if (pluggedwells) {
        map.removeLayer(pluggedwells);
    } ;
    pluggedwells = L.geoJSON(fd, {
        filter: function (feature) {
            return feature.properties.ft_category === 'Plugged';
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: getColor(feature.properties.ft_category),
                fillColor: getColor(feature.properties.ft_category),
                zIndex: 10000,
                radius: 1, // Radius // Fill opacity of the circle
            });
        },
        onEachFeature: function (feature, layer) {
            // Bind a popup to each circle marker based on the properties in the GeoJSON data

            layer.bindPopup("<b>API Number: </b>" + feature.properties.api_num + "<br><b>FracTracker Class: </b>" + 
                feature.properties.ft_category + "<br><b>State: </b>" + 
                feature.properties.stusps + "<br><b>Provided Well Type: </b>" + 
                feature.properties.well_type + "<br><b>Provided Well Status: </b>" + 
                feature.properties.well_status + "<br><b>Well Name: </b>" + 
                feature.properties.well_name + "<br><b>Operator: </b>" + 
                feature.properties.operator + "<br><b>Longitude:</b> " + 
                feature.properties.lng + "<br><b>Latitude: </b>" 
            );
        }
    });

    if (otherwells) {
        map.removeLayer(otherwells);
    } ;
    otherwells = L.geoJSON(fd, {
        filter: function (feature) {
            return feature.properties.ft_category === 'Other / Unknown';
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: getColor(feature.properties.ft_category),
                fillColor: getColor(feature.properties.ft_category),
                zIndex: 10000,
                radius: 1, // Radius // Fill opacity of the circle
            });
        },
        onEachFeature: function (feature, layer) {
            // Bind a popup to each circle marker based on the properties in the GeoJSON data

            layer.bindPopup("<b>API Number: </b>" + feature.properties.api_num + "<br><b>FracTracker Class: </b>" + 
                feature.properties.ft_category + "<br><b>State: </b>" + 
                feature.properties.stusps + "<br><b>Provided Well Type: </b>" + 
                feature.properties.well_type + "<br><b>Provided Well Status: </b>" + 
                feature.properties.well_status + "<br><b>Well Name: </b>" + 
                feature.properties.well_name + "<br><b>Operator: </b>" + 
                feature.properties.operator + "<br><b>Longitude:</b> " + 
                feature.properties.lng + "<br><b>Latitude: </b>" 
            );
        }
    });

    if (orphanwells) {
        map.removeLayer(orphanwells);
    } ;
    orphanwells = L.geoJSON(fd, {
        filter: function (feature) {
            return feature.properties.ft_category === 'Orphaned / Abandoned / Unverified Plug';
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: getColor(feature.properties.ft_category),
                fillColor: getColor(feature.properties.ft_category),
                zIndex: 10000,
                radius: 1, // Radius // Fill opacity of the circle
            });
        },
        onEachFeature: function (feature, layer) {
            // Bind a popup to each circle marker based on the properties in the GeoJSON data

            layer.bindPopup("<b>API Number: </b>" + feature.properties.api_num + "<br><b>FracTracker Class: </b>" + 
                feature.properties.ft_category + "<br><b>State: </b>" + 
                feature.properties.stusps + "<br><b>Provided Well Type: </b>" + 
                feature.properties.well_type + "<br><b>Provided Well Status: </b>" + 
                feature.properties.well_status + "<br><b>Well Name: </b>" + 
                feature.properties.well_name + "<br><b>Operator: </b>" + 
                feature.properties.operator + "<br><b>Longitude:</b> " + 
                feature.properties.lng + "<br><b>Latitude: </b>" 
            );
        }
    });

    if (notdrilledwells) {
        map.removeLayer(notdrilledwells);
    } ;
    notdrilledwells = L.geoJSON(fd, {
        filter: function (feature) {
            return feature.properties.ft_category === 'Not Drilled';
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: getColor(feature.properties.ft_category),
                fillColor: getColor(feature.properties.ft_category),
                zIndex: 10000,
                radius: 1, // Radius // Fill opacity of the circle
            });
        },
        onEachFeature: function (feature, layer) {
            // Bind a popup to each circle marker based on the properties in the GeoJSON data

            layer.bindPopup("<b>API Number: </b>" + feature.properties.api_num + "<br><b>FracTracker Class: </b>" + 
                feature.properties.ft_category + "<br><b>State: </b>" + 
                feature.properties.stusps + "<br><b>Provided Well Type: </b>" + 
                feature.properties.well_type + "<br><b>Provided Well Status: </b>" + 
                feature.properties.well_status + "<br><b>Well Name: </b>" + 
                feature.properties.well_name + "<br><b>Operator: </b>" + 
                feature.properties.operator + "<br><b>Longitude:</b> " + 
                feature.properties.lng + "<br><b>Latitude: </b>" 
            );
        }
    });

    if (injectionwells) {
        map.removeLayer(injectionwells);
    } ;
    injectionwells = L.geoJSON(fd, {
        filter: function (feature) {
            return feature.properties.ft_category === 'Injection / Storage / Service';
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: getColor(feature.properties.ft_category),
                fillColor: getColor(feature.properties.ft_category),
                zIndex: 10000,
                radius: 1, // Radius // Fill opacity of the circle
            });
        },
        onEachFeature: function (feature, layer) {
            // Bind a popup to each circle marker based on the properties in the GeoJSON data

            layer.bindPopup("<b>API Number: </b>" + feature.properties.api_num + "<br><b>FracTracker Class: </b>" + 
                feature.properties.ft_category + "<br><b>State: </b>" + 
                feature.properties.stusps + "<br><b>Provided Well Type: </b>" + 
                feature.properties.well_type + "<br><b>Provided Well Status: </b>" + 
                feature.properties.well_status + "<br><b>Well Name: </b>" + 
                feature.properties.well_name + "<br><b>Operator: </b>" + 
                feature.properties.operator + "<br><b>Longitude:</b> " + 
                feature.properties.lng + "<br><b>Latitude: </b>" 
            );
        }
    });
    // map.addLayer(productionwells)
}



// Function to toggle the point layer visibility based on zoom level
function togglePointLayerByZoom() {
    var currentZoom = map.getZoom();
    // console.log(currentZoom);


    const wellftc = {'category6':productionwells, 'category5':pluggedwells, 'category4':otherwells, 'category3':orphanwells, 'category2':injectionwells, 'category1':notdrilledwells}
    // toggle well layers
    for (const [k,v] of Object.entries(wellftc)) {
        if (currentZoom >= 13 && currentZoom <= 20) {lines_pipeline_naturalgas
            if (!map.hasLayer(v) && document.getElementById(k).checked) {
                map.addLayer(v);  // Add point layer when zoom level is between 14 and 20
                document.getElementById(k).checked = true;
            }
        } else if (v) {
            map.removeLayer(v);  // Remove point layer when zoom level is outside 14 to 20
            document.getElementById(k).checked = false;
        };
    }

}

// Call togglePointLayerByZoom every time the map zooms
map.on('zoomend', togglePointLayerByZoom);

// Initial check for the zoom level
togglePointLayerByZoom();




// // Create the Leaflet Draw Control
// var drawControl = new L.Control.Draw({
//     draw: {
//         circle: true, // Allow the user to draw a circle
//         circlemarker: false,
//         polygon: false,
//         polyline: false,
//         rectangle: false,
//         marker: false,
//     }
// });

// // Manually attach the draw control to a div outside the map
// var drawControlsDiv = document.getElementById('draw-controls');

// // Attach the draw control to the separate div
// map.addControl(drawControl);

// // Move the control outside of the map container
// var controlContainer = document.querySelector('.leaflet-draw-toolbar');
// drawControlsDiv.appendChild(controlContainer);

// // Now a box
// // Create the Leaflet Draw Control
// var drawControlB = new L.Control.Draw({
//     draw: {
//         circle: false, // Allow the user to draw a circle
//         circlemarker: false,
//         polygon: false,
//         polyline: false,
//         rectangle: true,
//         marker: false,
//     }
// });

// // Manually attach the draw control to a div outside the map
// var drawControlsDivB = document.getElementById('draw-controls-b');

// // Attach the draw control to the separate div
// // map.addControl(drawControlB);

// // Move the control outside of the map container
// var controlContainerB = document.querySelector('.leaflet-draw-toolbar');
// drawControlsDivB.appendChild(controlContainerB);

// Attach the draw control to the separate div
// map.addControl(drawControl);
// map.addControl(drawControlB);

// Move the control outside of the map container
// var controlContainer = document.getElementById('controls');
// drawControlsDiv.appendChild(controlContainer);
// var controlContainerB = document.getElementById('controls-b');
// drawControlsDivB.appendChild(controlContainerB);

// Event listener to count points inside the circle
map.on('draw:created', function (e) {
var layer = e.layer;

if (layer instanceof L.Circle) {
    // Get circle's center and radius
    var circleCenter = layer.getLatLng();
    var circleRadius = layer.getRadius();

    // Count how many points are inside the circle
    var pointsInside = 0;
        // JSON object to store points inside the circle
    var pointsInsideJSON = {
        count: 0,
        points: []
        };

    const wellftcat = {'category6':productionwells, 'category5':pluggedwells, 'category4':otherwells, 'category3':orphanwells, 'category2':injectionwells, 'category1':notdrilledwells}
    
    
    for (const [k,v] of Object.entries(wellftcat)) {
        if (document.getElementById(k).checked === true) {
            v.eachLayer(function (marker) {
                // console.log(marker)
                // console.log(marker.feature.properties.api_num)
                // Check if the marker is inside the circle
                var distance = circleCenter.distanceTo(marker.getLatLng());
                if (distance <= circleRadius) {
                pointsInsideJSON.count++;

                // Collect all attributes of the marker, including coordinates
                var markerData = {
                    api_num: marker.feature.properties.api_num,     // Custom attribute
                    other_id: marker.feature.properties.other_id,     // Custom attribute
                    latitude: marker.feature.properties.latitude,     // Custom attribute
                    longitude: marker.feature.properties.longitude,     // Custom attribute
                    stusps: marker.feature.properties.stusps,     // Custom attribute
                    county: marker.feature.properties.county,     // Custom attribute
                    municipality: marker.feature.properties.municipality,     // Custom attribute
                    well_name: marker.feature.properties.well_name,     // Custom attribute
                    operator: marker.feature.properties.operator,     // Custom attribute
                    spud_date: marker.feature.properties.spud_date,     // Custom attribute
                    plug_date: marker.feature.properties.plug_date,     // Custom attribute
                    well_type: marker.feature.properties.well_type,     // Custom attribute
                    well_status: marker.feature.properties.well_status,     // Custom attribute
                    well_configuration: marker.feature.properties.well_configuration,     // Custom attribute
                    ft_category: marker.feature.properties.ft_category,     // Custom attribute
                    id: marker.feature.properties.id,     // Custom attribute
                };

                pointsInsideJSON.points.push(markerData);
                }
            });
    }}
    // console.log(JSON.stringify(pointsInsideJSON, null, 2));

    //   starting here ============
    data = JSON.stringify(pointsInsideJSON, null, 2)
    // Convert the points to GeoJSON
    function convertToGeoJSON(data) {
        return {
            type: "FeatureCollection",
            features: data.points.map(point => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [point.longitude, point.latitude]
            },
            properties: {
                api_num: point.api_num,
                other_id: point.other_id,
                latitude: point.latitude,
                longitude: point.longitude,
                stusps: point.stusps,
                county: point.county,
                municipality: point.municipality,
                well_name: point.well_name,
                operator: point.operator,
                spud_date: point.spud_date,
                plug_date: point.plug_date,
                well_type: point.well_type,
                well_status: point.well_status,
                well_configuration: point.well_configuration,
                ft_category: point.ft_category,
                id: point.id,

            }
            }))
        };
        }
    
        // Convert data to GeoJSON
        const refinedrad = convertToGeoJSON(pointsInsideJSON);
        
        updateTable(refinedrad.features,'refined')
        // Log the result
        // console.log(JSON.stringify(geoJSON, null, 2));


      // Display the JSON object in the console
    //   console.log(JSON.stringify(pointsInsideJSON, null, 2));
    // alert("Points inside the circle: " + pointsInside);
}
});




function refinefilter() {
    console.log('Refining filter...');
    console.log(tabledata);

    const f = document.getElementById('sort-field2').value;
    const s = document.getElementById('srch-input1').value;
    // const s2 = document.getElementById('srch-input2').value;

    const refinedFeatures = tabledata.features.filter(feature => {
        if (!feature || !feature.properties || feature.properties[f] == null) return false;

        const propValue = feature.properties[f];
        return propValue.toString().toLowerCase() === s.toString().toLowerCase();
    });

    const refinedsrch = {
        type: "FeatureCollection",
        features: refinedFeatures
    };

    console.log('Filtered GeoJSON:', JSON.stringify(refinedsrch, null, 2));
    
    // Optional: Validate GeoJSON
    if (!Array.isArray(refinedsrch.features)) {
        console.error('Invalid GeoJSON: "features" is not an array');
        return;
    }
    
    console.log('adding filtered points')
    filteredPoints = L.geoJSON(refinedsrch, {
        pointToLayer: function (feature, latlng) {
        // size of the square (in degrees) — adjust for zoom level
        const size = .3;
    
        // Create a rectangle (square) centered at latlng
        return L.rectangle([
            [latlng.lat - size, latlng.lng - size],
            [latlng.lat + size, latlng.lng + size]
        ], {
            color: 'red',
            weight: 4,
            fillOpacity: 0,
            pane: 'overlayPane'
        });
        
        // // Coordinates for the main square
        // const bounds = [
        //     [latlng.lat - size, latlng.lng - size],
        //     [latlng.lat + size, latlng.lng + size]
        // ];
    
        // // Slightly larger bounds for the outer outline
        // const outerSize = size + 0.2;
        // const outerBounds = [
        //     [latlng.lat - outerSize, latlng.lng - outerSize],
        //     [latlng.lat + outerSize, latlng.lng + outerSize]
        // ];
    
        // // Outer darker outline (behind)
        // const outerRect = L.rectangle(outerBounds, {
        //     color: 'red',
        //     weight: 2,
        //     fillOpacity: 0,
        //     pane: 'overlayPane'
        // });
    
        // // Inner yellow outline (on top)
        // const innerRect = L.rectangle(bounds, {
        //     color: 'red',
        //     weight: 2,
        //     fillOpacity: 0,
        //     pane: 'overlayPane'
        // });
    
        // // Create a layer group with both
        // return L.layerGroup([outerRect, innerRect]);
        }
    }).addTo(map);
    console.log('added the filtered pints')

    updateTable(refinedsrch,'refined');
}

function clearFilter() {
    updateTable(tabledata)
    map.removeLayer(filteredPoints)
}


window.onload = function() {
    //document.getElementById('pipeline_fractracker').checked = false;
    document.getElementById('srch-input1').value = '';
    document.getElementById('pipeline_crudeoil').checked = false;
    document.getElementById('pipeline_hgl').checked = false;
    document.getElementById('pipeline_naturalgas').checked = false;
    document.getElementById('pipeline_petroleum').checked = false;
    document.getElementById('eia_bordercrossing_electric').checked = false;
    document.getElementById('eia_bordercrossing_liquids').checked = false;
    document.getElementById('eia_bordercrossing_naturalgas').checked = false;
    document.getElementById('eia_markethub_hgl').checked = false;
    document.getElementById('eia_markethub_naturalgas').checked = false;
    document.getElementById('eia_ports_petroleum').checked = false;
    document.getElementById('eia_reserve_petroleum').checked = false;
    document.getElementById('eia_storage_naturalgas').checked = false;
    document.getElementById('eia_terminal_crudeoil').checked = false;
    document.getElementById('eia_terminal_lng').checked = false;
    document.getElementById('eia_terminal_petroleum').checked = false;
    document.getElementById('eia_compressorstations').checked = false;
    document.getElementById('eia_plants_biodiesel').checked = false;
    document.getElementById('eia_plants_ethanol').checked = false;
    document.getElementById('eia_plants_ethylene_cracker').checked = false;
    document.getElementById('eia_powerplants_batterystorage').checked = false;
    document.getElementById('eia_electric_generator').checked = false;
    document.getElementById('eia_plants_coal').checked = false;
    document.getElementById('eia_plants_geothermal').checked = false;
    document.getElementById('eia_plants_hydroelectric').checked = false;
    document.getElementById('eia_plants_hydropumped').checked = false;
    document.getElementById('eia_plants_power_naturalgas').checked = false;
    document.getElementById('eia_plants_nuclear').checked = false;
    document.getElementById('eia_plants_petroleum').checked = false;
    document.getElementById('eia_plants_processing_naturalgas').checked = false;
    document.getElementById('eia_plants_refinery_petroleum').checked = false;

}

const legend = document.querySelector('.legend'); // or your actual legend class/id

L.DomEvent.disableScrollPropagation(legend);
L.DomEvent.disableClickPropagation(legend);


function getNearestFeature(clickedLatLng, targetLayerGroup) {
    let nearestFeature = null;
    let nearestDistance = Infinity;
  
    targetLayerGroup.eachLayer(function(layer) {
      const layerLatLng = layer.getLatLng?.() || layer.getBounds().getCenter(); // for points or polygons
      const distance = clickedLatLng.distanceTo(layerLatLng);
  
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestFeature = layer;
      }
    });
  
    return nearestFeature;
  }
// Toggle line visibility based on checkbox
document.getElementById('pipeline_crudeoil').addEventListener('change', function() {
    if (this.checked) {
        console.log('pipeline_naturalgas - checked')
        if (!lines_pipeline_crudeoil) {
            console.log('pipeline_naturalgas - needs to load')
            createLineLayer('Pipeline_Crudeoil')
        } else {
            console.log('pipeline_naturalgas - just adding')
            lines_pipeline_crudeoil.addTo(map);
        }
    } else if (lines_pipeline_crudeoil) {
        console.log('pipeline_naturalgas - removing')
        map.removeLayer(lines_pipeline_crudeoil);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('pipeline_naturalgas').addEventListener('change', function() {
    if (this.checked) {
        console.log('pipeline_naturalgas - checked')
        if (!lines_pipeline_naturalgas) {
            console.log('pipeline_naturalgas - needs to load')
            createLineLayer('Pipeline_Naturalgas')
        } else {
            console.log('pipeline_naturalgas - just adding')
            lines_pipeline_naturalgas.addTo(map);
        }
    } else if (lines_pipeline_naturalgas) {
        console.log('pipeline_naturalgas - removing')
        map.removeLayer(lines_pipeline_naturalgas);
    }
});

// // Toggle line visibility based on checkbox
// document.getElementById('pipeline_fractracker').addEventListener('change', function() {
//     if (this.checked) {
//         // console.log('pipeline_naturalgas - checked')
//         if (!lines_pipeline_fractracker) {
//             console.log('pipeline_naturalgas - needs to load')
//             // createLineLayer('Pipeline_Fractracker')
//         } else {
//             // console.log('pipeline_naturalgas - just adding')
//             lines_pipeline_fractracker.addTo(map);
//         }
//     } else if (lines_pipeline_fractracker) {
//         console.log('pipeline_naturalgas - fake removing')
//         // map.removeLayer(lines_pipeline_fractracker);
//     }
// });

// Toggle line visibility based on checkbox
document.getElementById('pipeline_hgl').addEventListener('change', function() {
    if (this.checked) {
        console.log('pipeline_naturalgas - checked')
        if (!lines_pipeline_hgl) {
            console.log('pipeline_naturalgas - needs to load')
            createLineLayer('Pipeline_hgl')
        } else {
            console.log('pipeline_naturalgas - just adding')
            lines_pipeline_hgl.addTo(map);
        }
    } else if (lines_pipeline_hgl) {
        console.log('pipeline_naturalgas - removing')
        map.removeLayer(lines_pipeline_hgl);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('pipeline_petroleum').addEventListener('change', function() {
    if (this.checked) {
        console.log('pipeline_petroleum - checked')
        if (!lines_pipeline_petroleum) {
            console.log('pipeline_petroleum - needs to load')
            createLineLayer('Pipeline_Petroleum')
        } else {
            console.log('pipeline_petroleum - just adding')
            lines_pipeline_petroleum.addTo(map);
        }
    } else if (lines_pipeline_petroleum) {
        console.log('pipeline_petroleum - removing')
        map.removeLayer(lines_pipeline_petroleum);
    }
});


// Toggle line visibility based on checkbox
document.getElementById('eia_compressorstations').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Compressor Stations')
        if (!points_compressorstations) {
            createPointLayer('Compressors')
            document.getElementById('tabledataset').innerHTML = 'Compressors'
        } else {
            points_compressorstations.addTo(map);
        }
    } else if (points_compressorstations) {
        map.removeLayer(points_compressorstations);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_bordercrossing_electric').addEventListener('change', function() {
    if (this.checked) {
        if (!points_eia_bordercrossing_electric) {
            console.log('toggled on via checkbox after creating points')
            createPointLayer('Bordercrossing_Electric')
            document.getElementById('tabledataset').innerHTML = 'Border Crossing: Electric'
        } else {
            console.log('toggled on and added')
            points_eia_bordercrossing_electric.addTo(map);
        }
        toggleselection('state','Border Crossing: Electric')

    } else if (points_eia_bordercrossing_electric) {
        console.log('toggled off and removing')
        map.removeLayer(points_eia_bordercrossing_electric);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_bordercrossing_liquids').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Border Crossing: Liquids')
        if (!points_eia_bordercrossing_liquids) {
            createPointLayer('Bordercrossing_Liquids')
            document.getElementById('tabledataset').innerHTML = 'Border Crossing: Liquids'
        } else {
            points_eia_bordercrossing_liquids.addTo(map);
        }
    } else if (points_eia_bordercrossing_liquids) {
        map.removeLayer(points_eia_bordercrossing_liquids);
    }
});


// Toggle line visibility based on checkbox
document.getElementById('eia_bordercrossing_naturalgas').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Border Crossing: Natural Gas')
        if (!points_eia_bordercrossing_naturalgas) {
            createPointLayer('Bordercrossing_Naturalgas')
            document.getElementById('tabledataset').innerHTML = 'Border Crossing: Natural Gas'
        } else {
            points_eia_bordercrossing_naturalgas.addTo(map);
        }
    } else if (points_eia_bordercrossing_naturalgas) {
        map.removeLayer(points_eia_bordercrossing_naturalgas);
    }
});



// Toggle line visibility based on checkbox
document.getElementById('eia_markethub_naturalgas').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Market Hub: Natural Gas')
        if (!points_eia_markethub_naturalgas) {
            createPointLayer('Markethubs_Naturalgas')
            document.getElementById('tabledataset').innerHTML = 'Market Hub: Natural Gas'
        } else {
            points_eia_markethub_naturalgas.addTo(map);
        }
    } else if (points_eia_markethub_naturalgas) {
        map.removeLayer(points_eia_markethub_naturalgas);
    }
});


// Toggle line visibility based on checkbox
document.getElementById('eia_markethub_hgl').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Market Hub: HGL')
        if (!points_eia_markethub_hgl) {
            createPointLayer('Markethubs_hgl')
            document.getElementById('tabledataset').innerHTML = 'Market Hub: HGL'
        } else {
            points_eia_markethub_hgl.addTo(map);
        }
    } else if (points_eia_markethub_hgl) {
        map.removeLayer(points_eia_markethub_hgl);
    }
});



// Toggle line visibility based on checkbox
document.getElementById('eia_ports_petroleum').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Ports: Petroleum')
        if (!points_eia_ports_petroleum) {
            createPointLayer('Ports_Petroleum')
            document.getElementById('tabledataset').innerHTML = 'Ports: Petroleum'
        } else {
            points_eia_ports_petroleum.addTo(map);
        }
    } else if (points_eia_ports_petroleum) {
        map.removeLayer(points_eia_ports_petroleum);
    }
});



// Toggle line visibility based on checkbox
document.getElementById('eia_powerplants_batterystorage').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Power Plants: Battery Storage')

        if (!points_eia_powerplants_batterystorage) {
            createPointLayer('Powerplants_Batterystorage')
            document.getElementById('tabledataset').innerHTML = 'Power Plants: Battery Storage'
        } else {
            points_eia_powerplants_batterystorage.addTo(map);
        }
    } else if (points_eia_powerplants_batterystorage) {
        map.removeLayer(points_eia_powerplants_batterystorage);
    }
});



// Toggle line visibility based on checkbox
document.getElementById('eia_electric_generator').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Power Plants: Electric Generators')

        if (!points_eia_electric_generator) {
            createPointLayer('Electric_Generator')
            document.getElementById('tabledataset').innerHTML = 'Power Plants: Electric Generators'
        } else {
            points_eia_electric_generator.addTo(map);
        }
    } else if (points_eia_electric_generator) {
        map.removeLayer(points_eia_electric_generator);
    }
});



// Toggle line visibility based on checkbox
document.getElementById('eia_plants_biodiesel').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Plants: Biodiesel')
        if (!points_eia_plants_biodiesel) {
            createPointLayer('Plants_Biodiesel')
            document.getElementById('tabledataset').innerHTML = 'Plants: Biodiesel'
        } else {
            points_eia_plants_biodiesel.addTo(map);
        }
    } else if (points_eia_plants_biodiesel) {
        map.removeLayer(points_eia_plants_biodiesel);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_plants_ethanol').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Plants: Ethanol')
        if (!points_eia_plants_ethanol) {
            createPointLayer('Plants_Ethanol')
            document.getElementById('tabledataset').innerHTML = 'Plants: Ethanol'
        } else {
            points_eia_plants_ethanol.addTo(map);
        }
    } else if (points_eia_plants_ethanol) {
        map.removeLayer(points_eia_plants_ethanol);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_plants_ethylene_cracker').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Plants: Ethylene Cracker')
        if (!points_eia_plants_ethylene_cracker) {
            createPointLayer('Plants_Ethylene_Cracker')
            document.getElementById('tabledataset').innerHTML = 'Plants: Ethylene Cracker'
        } else {
            points_eia_plants_ethylene_cracker.addTo(map);
        }
    } else if (points_eia_plants_ethylene_cracker) {
        map.removeLayer(points_eia_plants_ethylene_cracker);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_plants_coal').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Plants: Coal')
        if (!points_eia_plants_coal) {
            createPointLayer('Plants_Coal')
            document.getElementById('tabledataset').innerHTML = 'Plants: Coal'
        } else {
            points_eia_plants_coal.addTo(map);
        }
    } else if (points_eia_plants_coal) {
        map.removeLayer(points_eia_plants_coal);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_plants_geothermal').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Plants: Geothermal')
        if (!points_eia_plants_geothermal) {
            createPointLayer('Plants_Geothermal')
            document.getElementById('tabledataset').innerHTML = 'Plants: Geothermal'
        } else {
            points_eia_plants_geothermal.addTo(map);
        }
    } else if (points_eia_plants_geothermal) {
        map.removeLayer(points_eia_plants_geothermal);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_plants_hydroelectric').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Plants: Hydroelectric')
        if (!points_eia_plants_hydroelectric) {
            createPointLayer('Plants_Hydroelectric')
            document.getElementById('tabledataset').innerHTML = 'Plants: Hydroelectric'
        } else {
            points_eia_plants_hydroelectric.addTo(map);
        }
    } else if (points_eia_plants_hydroelectric) {
        map.removeLayer(points_eia_plants_hydroelectric);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_plants_hydropumped').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Plants: Hydro Pumped Storage')
        if (!points_eia_plants_hydropumped) {
            createPointLayer('Plants_Hydropumped')
            document.getElementById('tabledataset').innerHTML = 'Plants: Hydro Pumped Storage'
        } else {
            points_eia_plants_hydropumped.addTo(map);
        }
    } else if (points_eia_plants_hydropumped) {
        map.removeLayer(points_eia_plants_hydropumped);
    }
});


// Toggle line visibility based on checkbox
document.getElementById('eia_plants_power_naturalgas').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Power Plants: Natural Gas')
        if (!points_eia_plants_power_naturalgas) {
            createPointLayer('Plants_Naturalgas')
            document.getElementById('tabledataset').innerHTML = 'Power Plants: Natural Gas'
        } else {
            points_eia_plants_power_naturalgas.addTo(map);
        }
    } else if (points_eia_plants_power_naturalgas) {
        map.removeLayer(points_eia_plants_power_naturalgas);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_plants_nuclear').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Power Plants: Nuclear')
        if (!points_eia_plants_nuclear) {
            createPointLayer('Plants_Nuclear')
            document.getElementById('tabledataset').innerHTML = 'Power Plants: Nuclear'
        } else {
            points_eia_plants_nuclear.addTo(map);
        }
    } else if (points_eia_plants_nuclear) {
        map.removeLayer(points_eia_plants_nuclear);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_plants_petroleum').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Power Plants: Petroleum')
        if (!points_eia_plants_petroleum) {
            createPointLayer('Plants_Petroleum')
            document.getElementById('tabledataset').innerHTML = 'Power Plants: Petroleum'
        } else {
            points_eia_plants_petroleum.addTo(map);
        }
    } else if (points_eia_plants_petroleum) {
        map.removeLayer(points_eia_plants_petroleum);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_plants_processing_naturalgas').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Processing Plants: Natural Gas')
        if (!points_eia_plants_processing_naturalgas) {
            createPointLayer('Plants_Processing_Naturalgas')
            document.getElementById('tabledataset').innerHTML = 'Processing Plants: Natural Gas'
        } else {
            points_eia_plants_processing_naturalgas.addTo(map);
        }
    } else if (points_eia_plants_processing_naturalgas) {
        map.removeLayer(points_eia_plants_processing_naturalgas);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_plants_refinery_petroleum').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Refineries: Petroleum')
        if (!points_eia_plants_refinery_petroleum) {
            createPointLayer('Plants_Refinery_Petroleum')
            document.getElementById('tabledataset').innerHTML = 'Refineries: Petroleum'
        } else {
            points_eia_plants_refinery_petroleum.addTo(map);
        }
    } else if (points_eia_plants_refinery_petroleum) {
        map.removeLayer(points_eia_plants_refinery_petroleum);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_reserve_petroleum').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Reserves: Petroleum')
        if (!points_eia_reserve_petroleum) {
            createPointLayer('Reserve_Petroleum')
            document.getElementById('tabledataset').innerHTML = 'Reserves: Petroleum'
        } else {
            points_eia_reserve_petroleum.addTo(map);
        }
    } else if (points_eia_reserve_petroleum) {
        map.removeLayer(points_eia_reserve_petroleum);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_storage_naturalgas').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Storage: Natural Gas')
        if (!points_eia_storage_naturalgas) {
            createPointLayer('Storage_Naturalgas')
            document.getElementById('tabledataset').innerHTML = 'Storage: Natural Gas'
        } else {
            points_eia_storage_naturalgas.addTo(map);
        }
    } else if (points_eia_storage_naturalgas) {
        map.removeLayer(points_eia_storage_naturalgas);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_terminal_crudeoil').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Terminals: Crude Oil')
        if (!points_eia_terminal_crudeoil) {
            createPointLayer('Terminal_Crudeoil')
            document.getElementById('tabledataset').innerHTML = 'Terminals: Crude Oil'
        } else {
            points_eia_terminal_crudeoil.addTo(map);
        }
    } else if (points_eia_terminal_crudeoil) {
        map.removeLayer(points_eia_terminal_crudeoil);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_terminal_lng').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Terminals: LNG')
        if (!points_eia_terminal_lng) {
            createPointLayer('Terminal_Lng')
            document.getElementById('tabledataset').innerHTML = 'Terminals: LNG'
        } else {
            points_eia_terminal_lng.addTo(map);
        }
    } else if (points_eia_terminal_lng) {
        map.removeLayer(points_eia_terminal_lng);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_terminal_petroleum').addEventListener('change', function() {
    if (this.checked) {
        toggleselection('state','Terminals Petroleum')
        if (!points_eia_terminal_petroleum) {
            createPointLayer('Terminal_Petroleum')
            document.getElementById('tabledataset').innerHTML = 'Terminals: Petroleum'
        } else {
            points_eia_terminal_petroleum.addTo(map);
        }
    } else if (points_eia_terminal_petroleum) {
        map.removeLayer(points_eia_terminal_petroleum);
    }
});
// app.listen(3000, () => {
//     const os = require('os');
//     const interfaces = os.networkInterfaces();
  
//     Object.values(interfaces).forEach(ifaceGroup => {
//       ifaceGroup.forEach(iface => {
//         if (iface.family === 'IPv4' && !iface.internal) {
//           console.log('Server running at IP:', iface.address);
//         }
//       });
//     });
//   });

document.getElementById("filterbtn").addEventListener("click", function() {
    console.log('clicked filterpanel')
    document.getElementById("filterbtn").classList.add("sel")
    document.getElementById("resultsbtn").classList.remove("sel")
    document.getElementById("filterpanel").classList.remove("hide")
    document.getElementById("resultspanel").classList.add("hide")
});

document.getElementById("resultsbtn").addEventListener("click", function() {
    console.log('clicked resultspanel')
    document.getElementById("filterbtn").classList.remove("sel")
    document.getElementById("resultsbtn").classList.add("sel")
    document.getElementById("resultspanel").classList.remove("hide")
    document.getElementById("filterpanel").classList.add("hide")
});

function getmodname(v) {
    if (v === "Border Crossing: Electric") {
        return 'Bordercrossing_Electric';  // Set the text inside the span
    } else if (v === "Border Crossing: Liquids") {
        return 'Bordercrossing_Liquids';  // Set the text inside the span
    } else if (v === "Border Crossing: Natural Gas") {
        return 'Bordercrossing_Naturalgas';  // Set the text inside the span
    } else if (v === "Market Hub: HGL") {
        return 'Markethubs_hgl';  // Set the text inside the span
    } else if (v === "Market Hub: Natural Gas") {
        return 'Markethubs_Naturalgas';  // Set the text inside the span
    } else if (v === "Ports: Petroleum") {
        return 'Ports_Petroleum';  // Set the text inside the span
    } else if (v === "Reserves: Petroleum") {
        return 'Reserve_Petroleum';  // Set the text inside the span
    } else if (v === "Underground Storage: Natural Gas") {
        return 'Storage_Naturalgas';  // Set the text inside the span
    } else if (v === "Terminal: Crude Oil") {
        return 'Terminal_Crudeoil';  // Set the text inside the span
    } else if (v === "Terminal: LNG") {
        return 'Terminal_Lng';  // Set the text inside the span
    } else if (v === "Terminal: Petroleum") {
        return 'Terminal_Petroleum';  // Set the text inside the span
    } else if (v === "Compressor Stations") {
        return 'Compressors';  // Set the text inside the span
    } else if (v === "Plants: Biodiesel") {
        return 'Plants_Biodiesel';  // Set the text inside the span
    } else if (v === "Plants: Ethanol") {
        return 'Plants_Ethanol';  // Set the text inside the span
    } else if (v === "Plants: Ethylene Cracker") {
        return 'Plants_Ethylene_Cracker';  // Set the text inside the span
    } else if (v === "Power Plants: Battery Storage") {
        return 'Powerplants_Batterystorage';  // Set the text inside the span
    } else if (v === "Plants: Coal") {
        return 'Plants_Coal';  // Set the text inside the span
    } else if (v === "Plants: Geothermal") {
        return 'Plants_Geothermal';  // Set the text inside the span
    } else if (v === "Plants: Hydroelectric") {
        return 'Plants_Hydroelectric';  // Set the text inside the span
    } else if (v === "Plants: Hydro Pumped Storage") {
        return 'Plants_Hydropumped';  // Set the text inside the span
    } else if (v === "Power Plants: Natural Gas") {
        return 'Plants_Naturalgas';  // Set the text inside the span
    } else if (v === "Power Plants: Nuclear") {
        return 'Plants_Nuclear';  // Set the text inside the span
    } else if (v === "Power Plants: Petroleum") {
        return 'Plants_Petroleum';  // Set the text inside the span
    } else if (v === "Processing Plants: Natural Gas") {
        return 'Plants_Processing_Naturalgas';  // Set the text inside the span
    } else if (v === "Refinery: Petroleum") {
        return 'Plants_Refinery_Petroleum';  // Set the text inside the span
    } else if (v === "Power Plants: Electric Generators") {
        return 'Electric_Generator';  // Set the text inside the span
    } else {console.log('error - getmodname: '+v)}
}

function getdisplayname(v) {
    if (v === "Bordercrossing_Electric") {
        return 'Border Crossing: Electric';  // Set the text inside the span
    } else if (v === "Bordercrossing_Liquids") {
        return 'Border Crossing: Liquids';  // Set the text inside the span
    } else if (v === "Bordercrossing_Naturalgas") {
        return 'Border Crossing: Natural Gas';  // Set the text inside the span
    } else if (v === "Markethubs_hgl") {
        return 'Market Hub: HGL';  // Set the text inside the span
    } else if (v === "Markethubs_Naturalgas") {
        return 'Market Hub: Natural Gas';  // Set the text inside the span
    } else if (v === "Ports_Petroleum") {
        return 'Ports: Petroleum';  // Set the text inside the span
    } else if (v === "Reserve_Petroleum") {
        return 'Reserves: Petroleum';  // Set the text inside the span
    } else if (v === "Storage_Naturalgas") {
        return 'Underground Storage: Natural Gas';  // Set the text inside the span
    } else if (v === "Terminal_Crudeoil") {
        return 'Terminal: Crude Oil';  // Set the text inside the span
    } else if (v === "Terminal_Lng") {
        return 'Terminal: LNG';  // Set the text inside the span
    } else if (v === "Terminal_Petroleum") {
        return 'Terminal: Petroleum';  // Set the text inside the span
    } else if (v === "Compressors") {
        return 'Compressor Stations';  // Set the text inside the span
    } else if (v === "Plants_Biodiesel") {
        return 'Plants: Biodiesel';  // Set the text inside the span
    } else if (v === "Plants_Ethanol") {
        return 'Plants: Ethanol';  // Set the text inside the span
    } else if (v === "Plants_Ethylene_Cracker") {
        return 'Plants: Ethylene Cracker';  // Set the text inside the span
    } else if (v === "Powerplants_Batterystorage") {
        return 'Power Plants: Battery Storage';  // Set the text inside the span
    } else if (v === "Plants_Coal") {
        return 'Plants: Coal';  // Set the text inside the span
    } else if (v === "Plants_Geothermal") {
        return 'Plants: Geothermal';  // Set the text inside the span
    } else if (v === "Plants_Hydroelectric") {
        return 'Plants: Hydroelectric';  // Set the text inside the span
    } else if (v === "Plants_Hydropumped") {
        return 'Plants: Hydro Pumped Storage';  // Set the text inside the span
    } else if (v === "Plants_Naturalgas") {
        return 'Power Plants: Natural Gas';  // Set the text inside the span
    } else if (v === "Plants_Nuclear") {
        return 'Power Plants: Nuclear';  // Set the text inside the span
    } else if (v === "Plants_Petroleum") {
        return 'Power Plants: Petroleum';  // Set the text inside the span
    } else if (v === "Plants_Processing_Naturalgas") {
        return 'Processing Plants: Natural Gas';  // Set the text inside the span
    } else if (v === "Plants_Refinery_Petroleum") {
        return 'Refinery: Petroleum';  // Set the text inside the span
    } else if (v === "Electric_Generator") {
        return 'Power Plants: Electric Generators';  // Set the text inside the span
    } else {console.log('error - getdisplayname: '+v)}
}


function getmaplayername(v) {
    if (v === "Bordercrossing_Electric") {
        return 'points_eia_bordercrossing_electric';  // Set the text inside the span
    } else if (v === "Bordercrossing_Liquids") {
        return 'points_eia_bordercrossing_liquids';  // Set the text inside the span
    } else if (v === "Bordercrossing_Naturalgas") {
        return 'points_eia_bordercrossing_naturalgas';  // Set the text inside the span
    } else if (v === "Markethubs_hgl") {
        return 'points_eia_markethub_hgl';  // Set the text inside the span
    } else if (v === "Markethubs_Naturalgas") {
        return 'points_eia_markethub_naturalgas';  // Set the text inside the span
    } else if (v === "Ports_Petroleum") {
        return 'points_eia_ports_petroleum';  // Set the text inside the span
    } else if (v === "Reserve_Petroleum") {
        return 'points_eia_reserve_petroleum';  // Set the text inside the span
    } else if (v === "Storage_Naturalgas") {
        return 'points_eia_storage_naturalgas';  // Set the text inside the span
    } else if (v === "Terminal_Crudeoil") {
        return 'points_eia_terminal_crudeoil';  // Set the text inside the span
    } else if (v === "Terminal_Lng") {
        return 'points_eia_terminal_lng';  // Set the text inside the span
    } else if (v === "Terminal_Petroleum") {
        return 'points_eia_terminal_petroleum';  // Set the text inside the span
    } else if (v === "Compressors") {
        return 'points_compressorstations';  // Set the text inside the span
    } else if (v === "Plants_Biodiesel") {
        return 'points_eia_plants_biodiesel';  // Set the text inside the span
    } else if (v === "Plants_Ethanol") {
        return 'points_eia_plants_ethanol';  // Set the text inside the span
    } else if (v === "Plants_Ethylene_Cracker") {
        return 'points_eia_plants_ethylene_cracker';  // Set the text inside the span
    } else if (v === "Powerplants_Batterystorage") {
        return 'points_eia_powerplants_batterystorage';  // Set the text inside the span
    } else if (v === "Plants_Coal") {
        return 'points_eia_plants_coal';  // Set the text inside the span
    } else if (v === "Plants_Geothermal") {
        return 'points_eia_plants_geothermal';  // Set the text inside the span
    } else if (v === "Plants_Hydroelectric") {
        return 'points_eia_plants_hydroelectric';  // Set the text inside the span
    } else if (v === "Plants_Hydropumped") {
        return 'points_eia_plants_hydropumped';  // Set the text inside the span
    } else if (v === "Plants_Naturalgas") {
        return 'points_eia_plants_power_naturalgas';  // Set the text inside the span
    } else if (v === "Plants_Nuclear") {
        return 'points_eia_plants_nuclear';  // Set the text inside the span
    } else if (v === "Plants_Petroleum") {
        return 'points_eia_plants_petroleum';  // Set the text inside the span
    } else if (v === "Plants_Processing_Naturalgas") {
        return 'points_eia_plants_processing_naturalgas';  // Set the text inside the span
    } else if (v === "Plants_Refinery_Petroleum") {
        return 'points_eia_plants_refinery_petroleum';  // Set the text inside the span
    } else if (v === "Electric_Generator") {
        return 'points_eia_electric_generator';  // Set the text inside the span
    }  else {console.log('error - getmaplayername: '+v)}
}



function getmaplayer(v) {
    if (v === "Bordercrossing_Electric") {
        return points_eia_bordercrossing_electric;  // Set the text inside the span
    } else if (v === "Bordercrossing_Liquids") {
        return points_eia_bordercrossing_liquids;  // Set the text inside the span
    } else if (v === "Bordercrossing_Naturalgas") {
        return points_eia_bordercrossing_naturalgas;  // Set the text inside the span
    } else if (v === "Markethubs_hgl") {
        return points_eia_markethub_hgl;  // Set the text inside the span
    } else if (v === "Markethubs_Naturalgas") {
        return points_eia_markethub_naturalgas;  // Set the text inside the span
    } else if (v === "Ports_Petroleum") {
        return points_eia_ports_petroleum;  // Set the text inside the span
    } else if (v === "Reserve_Petroleum") {
        return points_eia_reserve_petroleum;  // Set the text inside the span
    } else if (v === "Storage_Naturalgas") {
        return points_eia_storage_naturalgas;  // Set the text inside the span
    } else if (v === "Terminal_Crudeoil") {
        return points_eia_terminal_crudeoil;  // Set the text inside the span
    } else if (v === "Terminal_Lng") {
        return points_eia_terminal_lng;  // Set the text inside the span
    } else if (v === "Terminal_Petroleum") {
        return points_eia_terminal_petroleum;  // Set the text inside the span
    } else if (v === "Compressors") {
        return points_compressorstations;  // Set the text inside the span
    } else if (v === "Plants_Biodiesel") {
        return points_eia_plants_biodiesel;  // Set the text inside the span
    } else if (v === "Plants_Ethanol") {
        return points_eia_plants_ethanol;  // Set the text inside the span
    } else if (v === "Plants_Ethylene_Cracker") {
        return points_eia_plants_ethylene_cracker;  // Set the text inside the span
    } else if (v === "Powerplants_Batterystorage") {
        return points_eia_powerplants_batterystorage;  // Set the text inside the span
    } else if (v === "Plants_Coal") {
        return points_eia_plants_coal;  // Set the text inside the span
    } else if (v === "Plants_Geothermal") {
        return points_eia_plants_geothermal;  // Set the text inside the span
    } else if (v === "Plants_Hydroelectric") {
        return points_eia_plants_hydroelectric;  // Set the text inside the span
    } else if (v === "Plants_Hydropumped") {
        return points_eia_plants_hydropumped;  // Set the text inside the span
    } else if (v === "Plants_Naturalgas") {
        return points_eia_plants_power_naturalgas;  // Set the text inside the span
    } else if (v === "Plants_Nuclear") {
        return points_eia_plants_nuclear;  // Set the text inside the span
    } else if (v === "Plants_Petroleum") {
        return points_eia_plants_petroleum;  // Set the text inside the span
    } else if (v === "Plants_Processing_Naturalgas") {
        return points_eia_plants_processing_naturalgas;  // Set the text inside the span
    } else if (v === "Plants_Refinery_Petroleum") {
        return points_eia_plants_refinery_petroleum;  // Set the text inside the span
    } else if (v === "Electric_Generator") {
        return points_eia_electric_generator;  // Set the text inside the span
    }  else {console.log('error - getmaplayer: '+v)}
}

function getlegenditem(v) {
    if (v === "Bordercrossing_Electric") {
        return 'eia_bordercrossing_electric';  // Set the text inside the span
    } else if (v === "Bordercrossing_Liquids") {
        return 'eia_bordercrossing_liquids';  // Set the text inside the span
    } else if (v === "Bordercrossing_Naturalgas") {
        return 'eia_bordercrossing_naturalgas';  // Set the text inside the span
    } else if (v === "Markethubs_hgl") {
        return 'eia_markethub_hgl';  // Set the text inside the span
    } else if (v === "Markethubs_Naturalgas") {
        return 'eia_markethub_naturalgas';  // Set the text inside the span
    } else if (v === "Ports_Petroleum") {
        return 'eia_ports_petroleum';  // Set the text inside the span
    } else if (v === "Reserve_Petroleum") {
        return 'eia_reserve_petroleum';  // Set the text inside the span
    } else if (v === "Storage_Naturalgas") {
        return 'eia_storage_naturalgas';  // Set the text inside the span
    } else if (v === "Terminal_Crudeoil") {
        return 'eia_terminal_crudeoil';  // Set the text inside the span
    } else if (v === "Terminal_Lng") {
        return 'eia_terminal_lng';  // Set the text inside the span
    } else if (v === "Terminal_Petroleum") {
        return 'eia_terminal_petroleum';  // Set the text inside the span
    } else if (v === "Compressors") {
        return 'eia_compressorstations';  // Set the text inside the span
    } else if (v === "Plants_Biodiesel") {
        return 'eia_plants_biodiesel';  // Set the text inside the span
    } else if (v === "Plants_Ethanol") {
        return 'eia_plants_ethanol';  // Set the text inside the span
    } else if (v === "Plants_Ethylene_Cracker") {
        return 'eia_plants_ethylene_cracker';  // Set the text inside the span
    } else if (v === "Powerplants_Batterystorage") {
        return 'eia_powerplants_batterystorage';  // Set the text inside the span
    } else if (v === "Plants_Coal") {
        return 'eia_plants_coal';  // Set the text inside the span
    } else if (v === "Plants_Geothermal") {
        return 'eia_plants_geothermal';  // Set the text inside the span
    } else if (v === "Plants_Hydroelectric") {
        return 'eia_plants_hydroelectric';  // Set the text inside the span
    } else if (v === "Plants_Hydropumped") {
        return 'eia_plants_hydropumped';  // Set the text inside the span
    } else if (v === "Plants_Naturalgas") {
        return 'eia_plants_power_naturalgas';  // Set the text inside the span
    } else if (v === "Plants_Nuclear") {
        return 'eia_plants_nuclear';  // Set the text inside the span
    } else if (v === "Plants_Petroleum") {
        return 'eia_plants_petroleum';  // Set the text inside the span
    } else if (v === "Plants_Processing_Naturalgas") {
        return 'eia_plants_processing_naturalgas';  // Set the text inside the span
    } else if (v === "Plants_Refinery_Petroleum") {
        return 'eia_plants_refinery_petroleum';  // Set the text inside the span
    } else if (v === "Electric_Generator") {
        return 'eia_electric_generator';  // Set the text inside the span
    }  else {console.log('error - getlegenditem: '+v)}
}