console.log('print something')

//create layer variables
var lines_pipeline_crudeoil;
var lines_pipeline_fractracker;
var lines_pipeline_hgl;
var lines_pipeline_naturalgas;
var lines_pipeline_petroleum;

var points_compressorstations;
var points_eia_electric_generator;
var points_eia_plants_biodiesel;
var points_eia_plants_ethanol;
var points_eia_plants_ethylene_cracker;
var points_eia_plants_batterystorage;
var points_eia_plants_coal;
var points_eia_plants_geothermal;
var points_eia_plants_hydroelectric;
var points_eia_plants_hydropumped;
var points_eia_plants_power_naturalgas;
var points_eia_plants_nuclear;
var points_eia_plants_petroleum;
var points_eia_plants_processing_naturalgas;
var points_eia_plants_refinery_petroleum;
var points_eia_bordercrossing_electric;
var points_eia_bordercrossing_liquids;
var points_eia_bordercrossing_naturalgas;
var points_eia_markethub_hgl;
var points_eia_markethub_naturalgas;
var points_eia_ports_petroleum;
var points_eia_reserve_petroleum;
var points_eia_storage_naturalgas;
var points_eia_terminal_crudeoil;
var points_eia_terminal_lng;
var points_eia_terminal_petroleum;
var points_eia_powerplants_batterystorage ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;
// var points_eia_powerplants ;


var buffs;
// Create constants for the filter items
const statetextbox = document.getElementById('statePicks');
const ctytextbox = document.getElementById('countyPicks');
const ctybuttonContainer = document.getElementById('county-container');
const statustextbox = document.getElementById('statusPicks');
const statusbuttonContainer = document.getElementById('status-container');
const typetextbox = document.getElementById('typePicks');
const typebuttonContainer = document.getElementById('type-container');
const cattextbox = document.getElementById('ftacatPicks');
const catbuttonContainer = document.getElementById('ftacat-container');



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

// Function to fetch GeoJSON data from a view
function getStates(data) {
    // var states = document.getElementById('statePicks').value;
    $.ajax({
        url: '/petrochem/getstates_view', // Replace with your view URL
        method: 'GET',
        data: {
            states: data,
        },
        success: function(data) {
            map.eachLayer(function(layer) {

                try {
                    if (layer._leaflet_id == stateLayer) {
                        map.removeLayer(layer);
                    } else {
                        // console.log('state layer id did not match') 
                    }
                    }
                    catch(err) {
                        // console.log('no such state layer exists'); 
                    }
                    
            }); 
            // Convert GeoJSON to vector tiles using leaflet-geojson-vt
            var geojsonStyle = {
                fillColor:"#FFFFFF",
                color: "#000",
                weight: 3,
                opacity: .6,
                fillOpacity: 0.000001,
                };
            
            var options = {
                maxZoom: 20,
                minZoom: 6,
                tolerance: 3,
                debug: 0,
                style: geojsonStyle,
                zIndex: 100,
            };
            canvasLayer_state = L.geoJSON(data, options).addTo(map);


            stateLayer=canvasLayer_state._leaflet_id
            try {
                statebounds = canvasLayer_state.getBounds();
                map.fitBounds(statebounds);
                map.on('moveend', function() {
                    // setCheckboxes();
                })
                
            } catch(err) {
                // console.log('no such layer exists just yet'); 
            } 

        },
        error: function(xhr, status, error) {
            // Handle error
            console.error(error);
        }
    });
}

// Function to fetch GeoJSON data from a view
function getCounties(s,c,data) {
    pts = data
    var states = getSelValues('statePicks')
    $.ajax({
        url: '/petrochem/getcounties_view', 
        method: 'GET',
        data: {
            states: states,
        },
        success: function(data) {
            
            // console.log('GeoJSON data received:', data);
            // Convert GeoJSON to vector tiles using leaflet-geojson-vt
            map.eachLayer(function(layer) {
                try {
                    if (layer._leaflet_id == countyLayer) {
                        map.removeLayer(layer);
                    } else {
                        // console.log('layer id did not match')
                    }
                    }
                    catch(err) {
                        // console.log('no such county layer exists');
                    }
                    
            }); 

            
            var geojsonStyle = {
                fillColor:"#FFFFFF",
                color: "#000",
                weight: 1,
                opacity: .5,
                fillOpacity: 0.00001,
                };

            canvasLayer_cty = L.geoJSON(data, {
                style: geojsonStyle,
                zIndex: 10,
                maxZoom: 20,
                minZoom: 1,
                tolerance: 3,
                debug: 0,
                onEachFeature: function(feature, layer) {
                    const county = feature.county;
                    // layer.bindPopup(`<strong>County:</strong> ${county}`);
                    // Add hover functionality to show county name in a tooltip
                    layer.on({
                        mouseover: function(e) {
                            var layer = e.target;
                            layer.bindTooltip(`<strong>County:</strong> ${county}`, {
                                permanent: false,
                                direction: 'top',
                                opacity: 0.8
                            }).openTooltip();
                        },
                        mouseout: function(e) {
                            e.target.closeTooltip();
                        }
                    });
                    // layer.on('click', function () {
                    //     console.log('clicked it');  // Log the message when the polygon is clicked
                    // });
                }
            }).addTo(map);

            ctyct(data,pts);


            countyLayer = canvasLayer_cty._leaflet_id
            
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error(error);
        }
    });
}



function addCtyOptions(states) {
    // var states = document.getElementById('statePicks').value;

    $.ajax({
        url: '/petrochem/createCountyList',
        method: 'GET',
        data: {
            states: states,
        },
        success: function(data) {
            // create the "buttons" for each county for the dropdown
            let ctyitems = JSON.parse(data);
            highlight = ctytextbox.innerHTML
            ctybuttonContainer.innerHTML = ''
            // console.log('what is in the html?')
            // console.log(highlight)
            // Iterate through the statesarray array and create a button for each color
            ctyitems.forEach(ctyitem => {
                const ctybutton = document.createElement('button');
                ctybutton.id = ctyitem.stusps + ': ' + ctyitem.county+'btn';
                // console.log(ctybutton.id)
                if (highlight.includes(ctybutton.id.slice(0,-3))) {
                    // console.log('found something to highlight')
                    ctybutton.className = 'highlightbutton';
                } else {
                    ctybutton.className = 'filterbutton';
                }
                
                // console.log(ctyitem.county)
                ctybutton.innerText = ctyitem.stusps + ': ' + ctyitem.county; // Capitalize the first letter of color
                ctybutton.onclick = () => toggleselection('county',ctyitem.stusps + ': ' + ctyitem.county);
                // Append the button to the button-container div
                ctybuttonContainer.appendChild(ctybutton);
            });
        },
        error: function(xhr,status,error) {
            console.error(error);
        }
    })
};



function addStatus(states) {
    // var states = document.getElementById('statePicks').value;
    $.ajax({
        url: '/petrochem/createStatusList',
        method: 'GET',
        data: {
            states: states,
        },
        success: function(data) {
            // create the "buttons" for each county for the dropdown
            let statusitems = JSON.parse(data);
            // console.log(statustextbox.innerHTML)
            highlight = statustextbox.innerHTML
            statusbuttonContainer.innerHTML = ''
            // Iterate through the statesarray array and create a button for each color
            statusitems.forEach(item => {
                const statusbutton = document.createElement('button');
                statusbutton.className = 'filterbutton';
                statusbutton.id = item.stusps + ': ' + item.well_status+'btn';
                // console.log(ctyitem.county)
                if (highlight.includes(statusbutton.id.slice(0,-3))) {
                    // console.log('found something to highlight')
                    statusbutton.className = 'highlightbutton';
                } else {
                    statusbutton.className = 'filterbutton';
                }
                statusbutton.innerText = item.stusps + ': ' + item.well_status; // Capitalize the first letter of color
                statusbutton.onclick = () => toggleselection('status',item.stusps + ': ' + item.well_status);
                // Append the button to the button-container div
                statusbuttonContainer.appendChild(statusbutton);
            });
        },
        error: function(xhr,status,error) {
            console.error(error);
        }
    })
};

function addType(states) {
    // var states = document.getElementById('statePicks').value;
    $.ajax({
        url: '/petrochem/createTypeList',
        method: 'GET',
        data: {
            states: states,
        },
        success: function(data) {
            // create the "buttons" for each county for the dropdown
            let typeitems = JSON.parse(data);
            // console.log(typetextbox.innerHTML)
            highlight = typetextbox.innerHTML
            typebuttonContainer.innerHTML = ''
            // Iterate through the statesarray array and create a button for each color
            typeitems.forEach(item => {
                const typebutton = document.createElement('button');
                typebutton.className = 'filterbutton';
                typebutton.id = item.stusps + ': ' + item.well_type+'btn';
                // console.log(ctyitem.county)
                if (highlight.includes(typebutton.id.slice(0,-3))) {
                    // console.log('found something to highlight')
                    typebutton.className = 'highlightbutton';
                } else {
                    typebutton.className = 'filterbutton';
                }
                typebutton.innerText = item.stusps + ': ' + item.well_type; // Capitalize the first letter of color
                typebutton.onclick = () => toggleselection('type',item.stusps + ': ' + item.well_type);
                // Append the button to the button-container div
                typebuttonContainer.appendChild(typebutton);
            });
        },
        error: function(xhr,status,error) {
            console.error(error);
        }
    })
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


// Function to apply category filter
function applyCategoryFilter_orig() {
    document.getElementById('filterpanel').classList.add('hide')
    document.getElementById('filterbtn').classList.remove('sel')
    document.getElementById('loadingpanel').classList.remove('hide');
    // let dots = '';
    // let dotCount = 0;
    // dotInterval = setInterval(() => {
    //     dotCount += 1;
    //     if (dotCount > 2) {
    //         thetext = '   '; // Reset dots
    //         dotCount = 0;
    //     } else {
    //         thetext = '...'
    //     }
    // }, 1000); // Update text every 500ms
    // document.getElementById('loading-dots').textContent = thetext;

    // document.getElementById('refineblock').style.display = 'none';

    var category = document.getElementById('ftacatPicks').value; 
    
    var states = getSelValues('statePicks');  // Assuming this returns a comma-delimited string
    // Split the string into an array
    states = states.split(',');
    // Now filter out the null values
    states = states.filter(value => value !== null && value !== '');  // Also filters out empty strings
    states = states.join(',');

    // console.log('states')
    // console.log(states)
    var counties = getSelValues('countyPicks')
    var well_status = getSelValues('statusPicks');
    var well_type = getSelValues('typePicks');
    var category = getSelValues('ftacatPicks');
    // open up the loading window
    // document.getElementById('loading-popupid').style.display = 'block';
    // Start adding periods to the loading popup text
    // update this with something better such as spinny thing



    $.ajax({
        url: '/petrochem/generate_geojson',
        method: 'GET',
        data: {
            states: states,
            county: counties,
            well_type: well_type,
            well_status: well_status,
            category: category,
        },
        success: function(data) {
            filteredData = JSON.parse(data);
            console.log('had success retrieving the records') // replace with action item
            // updateMapMarkers(data);
            // console.log(data);
            // console.log(filteredData);
            // console.log(filteredData.features);
            updateTable(filteredData.features);
            filterProd(data);
            getCounties(states, counties, data);
            getStates(states);
            // document.getElementById('refineblock').style.display = 'block';
            // document.getElementById('loading-popupid').style.display = 'none';
            document.getElementById('loadingpanel').classList.add('hide')
            document.getElementById('resultspanel').classList.remove('hide')
            document.getElementById('resultsbtn').classList.add('sel')

        //     document.getElementById('legenditemid_21').classList.remove('dim')
        //     document.getElementById('legenditemid_11').classList.remove('dim')
        //     document.getElementById('category1').classList.remove('dim')
            
        //     document.getElementById('legenditemid_22').classList.remove('dim')
        //     document.getElementById('legenditemid_12').classList.remove('dim')
        //     document.getElementById('category2').classList.remove('dim')

        //     document.getElementById('legenditemid_23').classList.remove('dim')
        //     document.getElementById('legenditemid_13').classList.remove('dim')
        //     document.getElementById('category3').classList.remove('dim')
            
        //     document.getElementById('legenditemid_24').classList.remove('dim')
        //     document.getElementById('legenditemid_14').classList.remove('dim')
        //     document.getElementById('category4').classList.remove('dim')

        //     document.getElementById('legenditemid_25').classList.remove('dim')
        //     document.getElementById('legenditemid_15').classList.remove('dim')
        //     document.getElementById('category5').classList.remove('dim')

        //     document.getElementById('legenditemid26').classList.remove('dim')
        //     document.getElementById('legenditemid16').classList.remove('dim')
        //     document.getElementById('category6').classList.remove('dim')

        //     document.getElementById('legenditemid27').classList.remove('dim')
        //     document.getElementById('legenditemid17').classList.remove('dim')
        //     document.getElementById('countylayer').classList.remove('dim')

        //     document.getElementById('legenditemid28').classList.remove('dim')
        //     document.getElementById('legenditemid18').classList.remove('dim')
        //     document.getElementById('countycount').classList.remove('dim')

        //     document.getElementById('legenditemid29').classList.remove('dim')
        //     document.getElementById('legenditemid19').classList.remove('dim')
        //     document.getElementById('countychoropleth').classList.remove('dim')
        },

        error: function(xhr, status, error) {
            alert("There was an error retrieving you're records. Try adding some filters to reduce the number of resulting features");
            console.error(error); // make sure to alter user to the error
            document.getElementById('loading-popupid').style.display = 'none';
        }
    });
}


////////
////////
function applyCategoryFilter() {
    // Fetch GeoJSON data from the server
    fetch('/petrochem/generate_geojson_comps')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            d=JSON.parse(data)
            console.log(d)

            // Example point style
            const defaultStyle = {
                radius: 2,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            const highlightStyle = {
                radius: 5  // what you want on hover
            };

            // Add the GeoJSON layer to the map
            compressors = L.geoJSON(d, {
                // filter: function (feature) {
                //     return feature.properties.ft_category === 'Production Well';
                // },
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, defaultStyle);
                },
                onEachFeature: function (feature, layer) {
                    // Bind a popup to each circle marker based on the properties in the GeoJSON data
                    layer.on({
                        mouseover: function (e) {
                            e.target.setStyle(highlightStyle);
                        },
                        mouseout: function (e) {
                            e.target.setStyle(defaultStyle);
                        }
                    });
                    layer.bindPopup( "<br><b>NAICS Desc: </b>" + 
                        feature.properties.naics_desc + "<br><b>Operator: </b>" + 
                        feature.properties.operator + "<br><b>Longitude:</b> " + 
                        feature.properties.x + "<br><b>Latitude: </b>" +
                        feature.properties.y
                    );
                }
        
            }).addTo(map);
            createTable(d);
        })
        .catch(error => console.log(error));
        createLineLayer();
        applyCategoryFilter2();
    };
    // function applyCategoryFilter() {
    //     // Fetch GeoJSON data from the server
    //     fetch('/petrochem/generate_geojson_comps')
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data)
    //             d=JSON.parse(data)
    //             console.log(d)
    
    //             // Example point style
    //             const defaultStyle = {
    //                 radius: 2,
    //                 fillColor: "#ff7800",
    //                 color: "#000",
    //                 weight: 1,
    //                 opacity: 1,
    //                 fillOpacity: 0.8
    //             };
    //             const highlightStyle = {
    //                 radius: 5  // what you want on hover
    //             };
    
    //             // Add the GeoJSON layer to the map
    //             compressors = L.geoJSON(d, {
    //                 // filter: function (feature) {
    //                 //     return feature.properties.ft_category === 'Production Well';
    //                 // },
    //                 pointToLayer: function (feature, latlng) {
    //                     return L.circleMarker(latlng, defaultStyle);
    //                 },
    //                 onEachFeature: function (feature, layer) {
    //                     // Bind a popup to each circle marker based on the properties in the GeoJSON data
    //                     layer.on({
    //                         mouseover: function (e) {
    //                             e.target.setStyle(highlightStyle);
    //                         },
    //                         mouseout: function (e) {
    //                             e.target.setStyle(defaultStyle);
    //                         }
    //                     });
    //                     layer.bindPopup( "<br><b>NAICS Desc: </b>" + 
    //                         feature.properties.naics_desc + "<br><b>Operator: </b>" + 
    //                         feature.properties.operator + "<br><b>Longitude:</b> " + 
    //                         feature.properties.x + "<br><b>Latitude: </b>" +
    //                         feature.properties.y
    //                     );
    //                 }
            
    //             }).addTo(map);
    //             createTable(d);
    //         })
    //         .catch(error => console.log(error));
    //         createLineLayer();
    //         applyCategoryFilter2();
    //     }

// fetch('/petrochem/generate_geojson_buffs')
//     .then(response => response.json())
//     .then(data => {
//         const buffs = L.geoJSON(data, {
//         style: {
//             color: 'blue',
//             weight: 2,
//             fillOpacity: 0.3
//         },
//         onEachFeature: function (feature, layer) {
//             if (feature.properties && feature.properties.name) {
//             layer.bindPopup(feature.properties.name);
//             }
//         }
//         }).addTo(map);
    
//         // Optional: zoom to the layer bounds
//         // map.fitBounds(polygonLayer.getBounds());
//     })
//     .catch(error => {
//         console.error('Error loading GeoJSON:', error);
//     });

function createTriangleMarker(latlng) {
    return L.marker(latlng, {
        icon: L.divIcon({
        className: 'custom-marker-icon',
        html: '<div class="triangle-marker"></div>',
        iconSize: [8, 8],
        iconAnchor: [4, 4]
        })
    });
    }
    
function createDiamondMarker(latlng) {
    return L.marker(latlng, {
        icon: L.divIcon({
        className: 'custom-marker-icon',
        html: '<div class="diamond-marker"></div>',
        iconSize: [8, 8],
        iconAnchor: [4, 4]
        })
    });
    }
function createPentagonMarker(latlng) {
    return L.marker(latlng, {
        icon: L.divIcon({
        className: 'custom-marker-icon',
        html: '<div class="pentagon-marker"></div>',
        iconSize: [8, 8],
        iconAnchor: [4, 4]
        })
    });
    }

function createHexagonMarker(latlng) {
    return L.marker(latlng, {
        icon: L.divIcon({
        className: 'custom-marker-icon',
        html: '<div class="hexagon-marker"></div>',
        iconSize: [8, 8],
        iconAnchor: [4, 4]
        })
    });
    }


function createPointLayer(ptlay) {
    // Fetch GeoJSON data from the server
    const grab = ptlay
    fetch(`/petrochem/generate_geojson_comps?grab=${encodeURIComponent(grab)}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            d=JSON.parse(data)
            console.log(d)


            if (ptlay === 'Compressors') {
                console.log('checked compressor stations')
                // Example point style
                const defaultStyle = {
                    radius: 2,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };
                const highlightStyle = {
                    radius: 5  // what you want on hover
                };
                // Add the GeoJSON layer to the map
                points_compressorstations = L.geoJSON(d, {
                    // filter: function (feature) {
                    //     return feature.properties.ft_category === 'Production Well';
                    // },
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, defaultStyle);
                    },
                    onEachFeature: function (feature, layer) {
                        // Bind a popup to each circle marker based on the properties in the GeoJSON data
                        layer.on({
                            mouseover: function (e) {
                                e.target.setStyle(highlightStyle);
                            },
                            mouseout: function (e) {
                                e.target.setStyle(defaultStyle);
                            }
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
                                    <h3>Within 1KM</h3>
                                    <p><b>tpop:</b> ${closestFeature.properties.j_tpop}</p>
                                    <p><b>wht:</b> ${closestFeature.properties.j_wht}</p>
                                    <p><b>b_aa:</b> ${closestFeature.properties.j_b_aa}</p>
                                    <p><b>ai_an:</b> ${closestFeature.properties.j_ai_an}</p>
                                    <p><b>asn:</b> ${closestFeature.properties.j_asn}</p>
                                    <p><b>nh_opi:</b> ${closestFeature.properties.j_nh_opi}</p>
                                    <p><b>oth:</b> ${closestFeature.properties.j_oth}</p>
                                    <p><b>2r:</b> ${closestFeature.properties.j_2r}</p>
                                    <p><b>hl:</b> ${closestFeature.properties.j_hl}</p>
                                    <p><b>o18:</b> ${closestFeature.properties.j_18}</p>
                                    <p><b>nw:</b> ${closestFeature.properties.j_nw}</p>
                                    <p><b>u18:</b> ${closestFeature.properties.j_u18}</p>
                                    <!--<p><b>Attribute 2:</b> ${closestFeature.properties.attribute2}</p>-->
                                    <!--<p><b>Attribute 3:</b> ${closestFeature.properties.attribute3}</p>-->
                                    <!-- Add other attributes as needed -->
                                `;
                            }
                          });
                        layer.bindPopup( "<br><b>NAICS Desc: </b>" + 
                            feature.properties.naics_desc + "<br><b>Operator: </b>" + 
                            feature.properties.operator + "<br><b>Longitude:</b> " + 
                            feature.properties.x + "<br><b>Latitude: </b>" +
                            feature.properties.y
                        );
                    }
            
                }).addTo(map);
            } else if (ptlay === 'Bordercrossing_Electric') {
                // Example point style

                // Add the GeoJSON layer to the map
                points_eia_bordercrossing_electric = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createTriangleMarker(latlng);
                        
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
                            mouseover: function (e) {
                                e.target.setStyle(highlightStyle);
                            },
                            mouseout: function (e) {
                                e.target.setStyle(defaultStyle);
                            }
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
                                    <h3>Within 1KM</h3>
                                    <p><b>tpop:</b> ${closestFeature.properties.j_tpop}</p>
                                    <p><b>wht:</b> ${closestFeature.properties.j_wht}</p>
                                    <p><b>b_aa:</b> ${closestFeature.properties.j_b_aa}</p>
                                    <p><b>ai_an:</b> ${closestFeature.properties.j_ai_an}</p>
                                    <p><b>asn:</b> ${closestFeature.properties.j_asn}</p>
                                    <p><b>nh_opi:</b> ${closestFeature.properties.j_nh_opi}</p>
                                    <p><b>oth:</b> ${closestFeature.properties.j_oth}</p>
                                    <p><b>2r:</b> ${closestFeature.properties.j_2r}</p>
                                    <p><b>hl:</b> ${closestFeature.properties.j_hl}</p>
                                    <p><b>o18:</b> ${closestFeature.properties.j_18}</p>
                                    <p><b>nw:</b> ${closestFeature.properties.j_nw}</p>
                                    <p><b>u18:</b> ${closestFeature.properties.j_u18}</p>
                                    <!--<p><b>Attribute 2:</b> ${closestFeature.properties.attribute2}</p>-->
                                    <!--<p><b>Attribute 3:</b> ${closestFeature.properties.attribute3}</p>-->
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
            } else if (ptlay === 'Bordercrossing_Liquids') {
                // Example point style

                // Add the GeoJSON layer to the map
                points_eia_bordercrossing_liquids = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createTriangleMarker(latlng);
                        
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
                            mouseover: function (e) {
                                e.target.setStyle(highlightStyle);
                            },
                            mouseout: function (e) {
                                e.target.setStyle(defaultStyle);
                            }
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
                                    <h3>Within 1KM</h3>
                                    <p><b>tpop:</b> ${closestFeature.properties.j_tpop}</p>
                                    <p><b>wht:</b> ${closestFeature.properties.j_wht}</p>
                                    <p><b>b_aa:</b> ${closestFeature.properties.j_b_aa}</p>
                                    <p><b>ai_an:</b> ${closestFeature.properties.j_ai_an}</p>
                                    <p><b>asn:</b> ${closestFeature.properties.j_asn}</p>
                                    <p><b>nh_opi:</b> ${closestFeature.properties.j_nh_opi}</p>
                                    <p><b>oth:</b> ${closestFeature.properties.j_oth}</p>
                                    <p><b>2r:</b> ${closestFeature.properties.j_2r}</p>
                                    <p><b>hl:</b> ${closestFeature.properties.j_hl}</p>
                                    <p><b>o18:</b> ${closestFeature.properties.j_18}</p>
                                    <p><b>nw:</b> ${closestFeature.properties.j_nw}</p>
                                    <p><b>u18:</b> ${closestFeature.properties.j_u18}</p>
                                    <!--<p><b>Attribute 2:</b> ${closestFeature.properties.attribute2}</p>-->
                                    <!--<p><b>Attribute 3:</b> ${closestFeature.properties.attribute3}</p>-->
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
            }  else if (ptlay === 'Bordercrossing_Naturalgas') {
                // Example point style

                // Add the GeoJSON layer to the map
                points_eia_bordercrossing_naturalgas = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createTriangleMarker(latlng);
                        
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
                            mouseover: function (e) {
                                e.target.setStyle(highlightStyle);
                            },
                            mouseout: function (e) {
                                e.target.setStyle(defaultStyle);
                            }
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
                                    <h3>Within 1KM</h3>
                                    <p><b>tpop:</b> ${closestFeature.properties.j_tpop}</p>
                                    <p><b>wht:</b> ${closestFeature.properties.j_wht}</p>
                                    <p><b>b_aa:</b> ${closestFeature.properties.j_b_aa}</p>
                                    <p><b>ai_an:</b> ${closestFeature.properties.j_ai_an}</p>
                                    <p><b>asn:</b> ${closestFeature.properties.j_asn}</p>
                                    <p><b>nh_opi:</b> ${closestFeature.properties.j_nh_opi}</p>
                                    <p><b>oth:</b> ${closestFeature.properties.j_oth}</p>
                                    <p><b>2r:</b> ${closestFeature.properties.j_2r}</p>
                                    <p><b>hl:</b> ${closestFeature.properties.j_hl}</p>
                                    <p><b>o18:</b> ${closestFeature.properties.j_18}</p>
                                    <p><b>nw:</b> ${closestFeature.properties.j_nw}</p>
                                    <p><b>u18:</b> ${closestFeature.properties.j_u18}</p>
                                    <!--<p><b>Attribute 2:</b> ${closestFeature.properties.attribute2}</p>-->
                                    <!--<p><b>Attribute 3:</b> ${closestFeature.properties.attribute3}</p>-->
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
            }  else if (ptlay === 'Markethubs_hgl') {
                // Example point style

                // Add the GeoJSON layer to the map
                points_eia_markethub_hgl = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng);
                        
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
                            mouseover: function (e) {
                                e.target.setStyle(highlightStyle);
                            },
                            mouseout: function (e) {
                                e.target.setStyle(defaultStyle);
                            }
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
                                    <h3>Within 1KM</h3>
                                    <p><b>tpop:</b> ${closestFeature.properties.j_tpop}</p>
                                    <p><b>wht:</b> ${closestFeature.properties.j_wht}</p>
                                    <p><b>b_aa:</b> ${closestFeature.properties.j_b_aa}</p>
                                    <p><b>ai_an:</b> ${closestFeature.properties.j_ai_an}</p>
                                    <p><b>asn:</b> ${closestFeature.properties.j_asn}</p>
                                    <p><b>nh_opi:</b> ${closestFeature.properties.j_nh_opi}</p>
                                    <p><b>oth:</b> ${closestFeature.properties.j_oth}</p>
                                    <p><b>2r:</b> ${closestFeature.properties.j_2r}</p>
                                    <p><b>hl:</b> ${closestFeature.properties.j_hl}</p>
                                    <p><b>o18:</b> ${closestFeature.properties.j_18}</p>
                                    <p><b>nw:</b> ${closestFeature.properties.j_nw}</p>
                                    <p><b>u18:</b> ${closestFeature.properties.j_u18}</p>
                                    <!--<p><b>Attribute 2:</b> ${closestFeature.properties.attribute2}</p>-->
                                    <!--<p><b>Attribute 3:</b> ${closestFeature.properties.attribute3}</p>-->
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
            } else if (ptlay === 'Markethubs_Naturalgas') {
                // Example point style

                // Add the GeoJSON layer to the map
                points_eia_markethub_naturalgas = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng);
                        
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
                            mouseover: function (e) {
                                e.target.setStyle(highlightStyle);
                            },
                            mouseout: function (e) {
                                e.target.setStyle(defaultStyle);
                            }
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
                                    <h3>Within 1KM</h3>
                                    <p><b>tpop:</b> ${closestFeature.properties.j_tpop}</p>
                                    <p><b>wht:</b> ${closestFeature.properties.j_wht}</p>
                                    <p><b>b_aa:</b> ${closestFeature.properties.j_b_aa}</p>
                                    <p><b>ai_an:</b> ${closestFeature.properties.j_ai_an}</p>
                                    <p><b>asn:</b> ${closestFeature.properties.j_asn}</p>
                                    <p><b>nh_opi:</b> ${closestFeature.properties.j_nh_opi}</p>
                                    <p><b>oth:</b> ${closestFeature.properties.j_oth}</p>
                                    <p><b>2r:</b> ${closestFeature.properties.j_2r}</p>
                                    <p><b>hl:</b> ${closestFeature.properties.j_hl}</p>
                                    <p><b>o18:</b> ${closestFeature.properties.j_18}</p>
                                    <p><b>nw:</b> ${closestFeature.properties.j_nw}</p>
                                    <p><b>u18:</b> ${closestFeature.properties.j_u18}</p>
                                    <!--<p><b>Attribute 2:</b> ${closestFeature.properties.attribute2}</p>-->
                                    <!--<p><b>Attribute 3:</b> ${closestFeature.properties.attribute3}</p>-->
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
            } else if (ptlay === 'Ports_Petroleum') {
                // Example point style

                // Add the GeoJSON layer to the map
                points_eia_ports_petroleum = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng);
                        
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
                            mouseover: function (e) {
                                e.target.setStyle(highlightStyle);
                            },
                            mouseout: function (e) {
                                e.target.setStyle(defaultStyle);
                            }
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
                                    <h3>Within 1KM</h3>
                                    <p><b>tpop:</b> ${closestFeature.properties.j_tpop}</p>
                                    <p><b>wht:</b> ${closestFeature.properties.j_wht}</p>
                                    <p><b>b_aa:</b> ${closestFeature.properties.j_b_aa}</p>
                                    <p><b>ai_an:</b> ${closestFeature.properties.j_ai_an}</p>
                                    <p><b>asn:</b> ${closestFeature.properties.j_asn}</p>
                                    <p><b>nh_opi:</b> ${closestFeature.properties.j_nh_opi}</p>
                                    <p><b>oth:</b> ${closestFeature.properties.j_oth}</p>
                                    <p><b>2r:</b> ${closestFeature.properties.j_2r}</p>
                                    <p><b>hl:</b> ${closestFeature.properties.j_hl}</p>
                                    <p><b>o18:</b> ${closestFeature.properties.j_18}</p>
                                    <p><b>nw:</b> ${closestFeature.properties.j_nw}</p>
                                    <p><b>u18:</b> ${closestFeature.properties.j_u18}</p>
                                    <!--<p><b>Attribute 2:</b> ${closestFeature.properties.attribute2}</p>-->
                                    <!--<p><b>Attribute 3:</b> ${closestFeature.properties.attribute3}</p>-->
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
            } else if (ptlay === 'Powerplants_Batterystorage') {
                // Example point style

                // Add the GeoJSON layer to the map
                points_eia_powerplants_batterystorage = L.geoJSON(d, {
                        // filter: function (feature) {
                        //     return feature.properties.ft_category === 'Production Well';
                        // },
                        pointToLayer: function (feature, latlng) {
                            const marker = createDiamondMarker(latlng);
                        
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
                            mouseover: function (e) {
                                e.target.setStyle(highlightStyle);
                            },
                            mouseout: function (e) {
                                e.target.setStyle(defaultStyle);
                            }
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
                                    <h3>Within 1KM</h3>
                                    <p><b>tpop:</b> ${closestFeature.properties.j_tpop}</p>
                                    <p><b>wht:</b> ${closestFeature.properties.j_wht}</p>
                                    <p><b>b_aa:</b> ${closestFeature.properties.j_b_aa}</p>
                                    <p><b>ai_an:</b> ${closestFeature.properties.j_ai_an}</p>
                                    <p><b>asn:</b> ${closestFeature.properties.j_asn}</p>
                                    <p><b>nh_opi:</b> ${closestFeature.properties.j_nh_opi}</p>
                                    <p><b>oth:</b> ${closestFeature.properties.j_oth}</p>
                                    <p><b>2r:</b> ${closestFeature.properties.j_2r}</p>
                                    <p><b>hl:</b> ${closestFeature.properties.j_hl}</p>
                                    <p><b>o18:</b> ${closestFeature.properties.j_18}</p>
                                    <p><b>nw:</b> ${closestFeature.properties.j_nw}</p>
                                    <p><b>u18:</b> ${closestFeature.properties.j_u18}</p>
                                    <!--<p><b>Attribute 2:</b> ${closestFeature.properties.attribute2}</p>-->
                                    <!--<p><b>Attribute 3:</b> ${closestFeature.properties.attribute3}</p>-->
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
        .catch(error => console.log(error));

    }
// L.geoJSON(yourGeoJSON, {
//     pointToLayer: function (feature, latlng) {
//         return L.marker(latlng, {
//         icon: L.divIcon({
//             className: 'custom-marker',
//             html: '<div class="triangle"></div>', // or "square"
//             iconSize: [20, 20]
//         })
//         });
//     }
//     }).addTo(map);




var demobuffer;
function generate_buffs() {
    console.log('generating the buffer layer')
    // Fetch GeoJSON data from the server
    fetch(`/petrochem/generate_geojson_buffs2`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            d=JSON.parse(data)
            console.log(d)


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
    // console.log('inside function closestFeature')
    // console.log(closestFeature)
    return closestFeature;
}



// function creatBuffPointLayer() {
//     // Fetch GeoJSON data from the server
//     fetch(`/petrochem/generate_geojson_buffs`)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data)
//             d=JSON.parse(data)
//             console.log(d)


//             if (ptlay === 'Compressors') {
//                 // Example point style
//                 const defaultStyle = {
//                     radius: 2,
//                     fillColor: "#ff7800",
//                     color: "#000",
//                     weight: 1,
//                     opacity: 1,
//                     fillOpacity: 0.8
//                 };
//                 const highlightStyle = {
//                     radius: 5  // what you want on hover
//                 };
//                 console.log('clicked compressor stations')

//                 // Add the GeoJSON layer to the map
//                 points_compressorstations = L.geoJSON(d, {
//                     // filter: function (feature) {
//                     //     return feature.properties.ft_category === 'Production Well';
//                     // },
//                     pointToLayer: function (feature, latlng) {
//                         return L.circleMarker(latlng, defaultStyle);
//                     },
//                     onEachFeature: function (feature, layer) {
//                         // Bind a popup to each circle marker based on the properties in the GeoJSON data
//                         layer.on({
//                             mouseover: function (e) {
//                                 e.target.setStyle(highlightStyle);
//                             },
//                             mouseout: function (e) {
//                                 e.target.setStyle(defaultStyle);
//                             }
//                         });
//                         layer.on('click', function(e) {
//                             const clickedLatLng = e.latlng;
//                             // const nearest = getNearestFeature(clickedLatLng, targetLayerGroup);
                          
//                             // if (nearest) {
//                             //   console.log('Nearest feature properties:', nearest.feature?.properties);
//                             //   // Optionally, highlight or show popup
//                             //   nearest.bindPopup(`Nearest object: ${nearest.feature?.properties.name}`).openPopup();
//                             // }

//                                 // Find the closest feature from layer2
//                             const closestFeature = findClosestFeature(clickedLatLng);
//                             console.log('clicked on a compressor station')
//                             if (closestFeature) {
//                                 console.log('closest feat')
//                                 // console.log(closestFeature)
//                                 console.log('properties')
//                                 // console.log(closestFeature.properties)
//                                 // Display the attributes in the box
//                                 const attributesBox = document.getElementById('attributes-box'); // Assumes you have a div with this ID
//                                 attributesBox.innerHTML = `
//                                     <h3>Closest Feature Attributes</h3>
//                                     <p><b>Attribute 1:</b> ${closestFeature.properties.j_wht}</p>
//                                     <!--<p><b>Attribute 2:</b> ${closestFeature.properties.attribute2}</p>-->
//                                     <!--<p><b>Attribute 3:</b> ${closestFeature.properties.attribute3}</p>-->
//                                     <!-- Add other attributes as needed -->
//                                 `;
//                             }
//                           });
//                         layer.bindPopup( "<br><b>NAICS Desc: </b>" + 
//                             feature.properties.naics_desc + "<br><b>Operator: </b>" + 
//                             feature.properties.operator + "<br><b>Longitude:</b> " + 
//                             feature.properties.x + "<br><b>Latitude: </b>" +
//                             feature.properties.y
//                         );
//                     }
            
//                 }).addTo(map);
//             } else if (ptlay === 'Bordercrossing_Electric') {
//                 // Example point style

//                 // Add the GeoJSON layer to the map
//                 points_eia_bordercrossing_electric = L.geoJSON(d, {
//                         // filter: function (feature) {
//                         //     return feature.properties.ft_category === 'Production Well';
//                         // },
//                         pointToLayer: function (feature, latlng) {
//                             const marker = createTriangleMarker(latlng);
                        
//                             marker.on('mouseover', () => {
//                               const el = marker.getElement().querySelector('.triangle-marker');
//                               el.style.transform = 'scale(2)';
//                             });
                        
//                             marker.on('mouseout', () => {
//                               const el = marker.getElement().querySelector('.triangle-marker');
//                               el.style.transform = 'scale(1)';
//                             });
                        
//                             return marker;
//                           },
//                     onEachFeature: function (feature, layer) {
//                         // Bind a popup to each circle marker based on the properties in the GeoJSON data
//                         layer.on({
//                             mouseover: function (e) {
//                                 e.target.setStyle(highlightStyle);
//                             },
//                             mouseout: function (e) {
//                                 e.target.setStyle(defaultStyle);
//                             }
//                         });
//                         layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
//                             //  + "<br><b>Operator: </b>" + 
//                             // feature.properties.operator + "<br><b>Longitude:</b> " + 
//                             // feature.properties.x + "<br><b>Latitude: </b>" +
//                             // feature.properties.y
//                         );
//                     }
            
//                 }).addTo(map);
//             } else if (ptlay === 'Bordercrossing_Liquids') {
//                 // Example point style

//                 // Add the GeoJSON layer to the map
//                 points_eia_bordercrossing_liquids = L.geoJSON(d, {
//                         // filter: function (feature) {
//                         //     return feature.properties.ft_category === 'Production Well';
//                         // },
//                         pointToLayer: function (feature, latlng) {
//                             const marker = createTriangleMarker(latlng);
                        
//                             marker.on('mouseover', () => {
//                               const el = marker.getElement().querySelector('.triangle-marker');
//                               el.style.transform = 'scale(2)';
//                             });
                        
//                             marker.on('mouseout', () => {
//                               const el = marker.getElement().querySelector('.triangle-marker');
//                               el.style.transform = 'scale(1)';
//                             });
                        
//                             return marker;
//                           },
//                     onEachFeature: function (feature, layer) {
//                         // Bind a popup to each circle marker based on the properties in the GeoJSON data
//                         layer.on({
//                             mouseover: function (e) {
//                                 e.target.setStyle(highlightStyle);
//                             },
//                             mouseout: function (e) {
//                                 e.target.setStyle(defaultStyle);
//                             }
//                         });
//                         layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
//                             //  + "<br><b>Operator: </b>" + 
//                             // feature.properties.operator + "<br><b>Longitude:</b> " + 
//                             // feature.properties.x + "<br><b>Latitude: </b>" +
//                             // feature.properties.y
//                         );
//                     }
            
//                 }).addTo(map);
//             }  else if (ptlay === 'Bordercrossing_Naturalgas') {
//                 // Example point style

//                 // Add the GeoJSON layer to the map
//                 points_eia_bordercrossing_naturalgas = L.geoJSON(d, {
//                         // filter: function (feature) {
//                         //     return feature.properties.ft_category === 'Production Well';
//                         // },
//                         pointToLayer: function (feature, latlng) {
//                             const marker = createTriangleMarker(latlng);
                        
//                             marker.on('mouseover', () => {
//                               const el = marker.getElement().querySelector('.triangle-marker');
//                               el.style.transform = 'scale(2)';
//                             });
                        
//                             marker.on('mouseout', () => {
//                               const el = marker.getElement().querySelector('.triangle-marker');
//                               el.style.transform = 'scale(1)';
//                             });
                        
//                             return marker;
//                           },
//                     onEachFeature: function (feature, layer) {
//                         // Bind a popup to each circle marker based on the properties in the GeoJSON data
//                         layer.on({
//                             mouseover: function (e) {
//                                 e.target.setStyle(highlightStyle);
//                             },
//                             mouseout: function (e) {
//                                 e.target.setStyle(defaultStyle);
//                             }
//                         });
//                         layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
//                             //  + "<br><b>Operator: </b>" + 
//                             // feature.properties.operator + "<br><b>Longitude:</b> " + 
//                             // feature.properties.x + "<br><b>Latitude: </b>" +
//                             // feature.properties.y
//                         );
//                     }
            
//                 }).addTo(map);
//             }  else if (ptlay === 'Markethubs_hgl') {
//                 // Example point style

//                 // Add the GeoJSON layer to the map
//                 points_eia_markethub_hgl = L.geoJSON(d, {
//                         // filter: function (feature) {
//                         //     return feature.properties.ft_category === 'Production Well';
//                         // },
//                         pointToLayer: function (feature, latlng) {
//                             const marker = createDiamondMarker(latlng);
                        
//                             marker.on('mouseover', () => {
//                                 const el = marker.getElement().querySelector('.diamond-marker');
//                                 el.style.transform = 'scale(2) rotate(45deg)';
//                               });
//                               marker.on('mouseout', () => {
//                                 const el = marker.getElement().querySelector('.diamond-marker');
//                                 el.style.transform = 'scale(1) rotate(45deg)';
//                               });
                        
//                             return marker;
//                           },
//                     onEachFeature: function (feature, layer) {
//                         // Bind a popup to each circle marker based on the properties in the GeoJSON data
//                         layer.on({
//                             mouseover: function (e) {
//                                 e.target.setStyle(highlightStyle);
//                             },
//                             mouseout: function (e) {
//                                 e.target.setStyle(defaultStyle);
//                             }
//                         });
//                         layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
//                             //  + "<br><b>Operator: </b>" + 
//                             // feature.properties.operator + "<br><b>Longitude:</b> " + 
//                             // feature.properties.x + "<br><b>Latitude: </b>" +
//                             // feature.properties.y
//                         );
//                     }
            
//                 }).addTo(map);
//             } else if (ptlay === 'Markethubs_Naturalgas') {
//                 // Example point style

//                 // Add the GeoJSON layer to the map
//                 points_eia_markethub_naturalgas = L.geoJSON(d, {
//                         // filter: function (feature) {
//                         //     return feature.properties.ft_category === 'Production Well';
//                         // },
//                         pointToLayer: function (feature, latlng) {
//                             const marker = createDiamondMarker(latlng);
                        
//                             marker.on('mouseover', () => {
//                                 const el = marker.getElement().querySelector('.diamond-marker');
//                                 el.style.transform = 'scale(2) rotate(45deg)';
//                               });
//                               marker.on('mouseout', () => {
//                                 const el = marker.getElement().querySelector('.diamond-marker');
//                                 el.style.transform = 'scale(1) rotate(45deg)';
//                               });
                        
//                             return marker;
//                           },
//                     onEachFeature: function (feature, layer) {
//                         // Bind a popup to each circle marker based on the properties in the GeoJSON data
//                         layer.on({
//                             mouseover: function (e) {
//                                 e.target.setStyle(highlightStyle);
//                             },
//                             mouseout: function (e) {
//                                 e.target.setStyle(defaultStyle);
//                             }
//                         });
//                         layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
//                             //  + "<br><b>Operator: </b>" + 
//                             // feature.properties.operator + "<br><b>Longitude:</b> " + 
//                             // feature.properties.x + "<br><b>Latitude: </b>" +
//                             // feature.properties.y
//                         );
//                     }
            
//                 }).addTo(map);
//             } else if (ptlay === 'Ports_Petroleum') {
//                 // Example point style

//                 // Add the GeoJSON layer to the map
//                 points_eia_ports_petroleum = L.geoJSON(d, {
//                         // filter: function (feature) {
//                         //     return feature.properties.ft_category === 'Production Well';
//                         // },
//                         pointToLayer: function (feature, latlng) {
//                             const marker = createDiamondMarker(latlng);
                        
//                             marker.on('mouseover', () => {
//                                 const el = marker.getElement().querySelector('.diamond-marker');
//                                 el.style.transform = 'scale(2) rotate(45deg)';
//                               });
//                               marker.on('mouseout', () => {
//                                 const el = marker.getElement().querySelector('.diamond-marker');
//                                 el.style.transform = 'scale(1) rotate(45deg)';
//                               });
                        
//                             return marker;
//                           },
//                     onEachFeature: function (feature, layer) {
//                         // Bind a popup to each circle marker based on the properties in the GeoJSON data
//                         layer.on({
//                             mouseover: function (e) {
//                                 e.target.setStyle(highlightStyle);
//                             },
//                             mouseout: function (e) {
//                                 e.target.setStyle(defaultStyle);
//                             }
//                         });
//                         layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
//                             //  + "<br><b>Operator: </b>" + 
//                             // feature.properties.operator + "<br><b>Longitude:</b> " + 
//                             // feature.properties.x + "<br><b>Latitude: </b>" +
//                             // feature.properties.y
//                         );
//                     }
            
//                 }).addTo(map);
//             } else if (ptlay === 'Powerplants_Batterystorage') {
//                 // Example point style

//                 // Add the GeoJSON layer to the map
//                 points_eia_powerplants_batterystorage = L.geoJSON(d, {
//                         // filter: function (feature) {
//                         //     return feature.properties.ft_category === 'Production Well';
//                         // },
//                         pointToLayer: function (feature, latlng) {
//                             const marker = createDiamondMarker(latlng);
                        
//                             marker.on('mouseover', () => {
//                                 const el = marker.getElement().querySelector('.diamond-marker');
//                                 el.style.transform = 'scale(2) rotate(45deg)';
//                               });
//                               marker.on('mouseout', () => {
//                                 const el = marker.getElement().querySelector('.diamond-marker');
//                                 el.style.transform = 'scale(1) rotate(45deg)';
//                               });
                        
//                             return marker;
//                           },
//                     onEachFeature: function (feature, layer) {
//                         // Bind a popup to each circle marker based on the properties in the GeoJSON data
//                         layer.on({
//                             mouseover: function (e) {
//                                 e.target.setStyle(highlightStyle);
//                             },
//                             mouseout: function (e) {
//                                 e.target.setStyle(defaultStyle);
//                             }
//                         });
//                         layer.bindPopup( "<br><b>NAICS Desc: </b>" + feature.properties.naics_desc
//                             //  + "<br><b>Operator: </b>" + 
//                             // feature.properties.operator + "<br><b>Longitude:</b> " + 
//                             // feature.properties.x + "<br><b>Latitude: </b>" +
//                             // feature.properties.y
//                         );
//                     }
            
//                 }).addTo(map);
//             }
//             ;
//         })
//         .catch(error => console.log(error));

//     }


function applyCategoryFilter2() {
    // Fetch GeoJSON data from the server
    fetch('/petrochem/generate_geojson_comps2')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            d=JSON.parse(data)
            console.log(d)

            // Example point style
            const defaultStyle = {
                radius: 2,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            const highlightStyle = {
                radius: 5  // what you want on hover
            };

            // Add the GeoJSON layer to the map
            others = L.geoJSON(d, {
                // filter: function (feature) {
                //     return feature.properties.ft_category === 'Production Well';
                // },
                pointToLayer: function (feature, latlng) {
                    const marker = createTriangleMarker(latlng);
                
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
                    // layer.on({
                    //     mouseover: function (e) {
                    //         e.target.setStyle(highlightStyle);
                    //     },
                    //     mouseout: function (e) {
                    //         e.target.setStyle(defaultStyle);
                    //     }
                    // });
                    layer.bindPopup( "<br><b>NAICS Desc: </b>" + 
                        feature.properties.naics_desc + "<br><b>Operator: </b>" + 
                        feature.properties.operator + "<br><b>Longitude:</b> " + 
                        feature.properties.x + "<br><b>Latitude: </b>" +
                        feature.properties.y
                    );
                }
        
            }).addTo(map);
            createTable(d);
        })
        .catch(error => console.log(error));
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
            console.log(data); // The GeoJSON data is already parsed

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
    updateTable(geojson)
}

function populateSortDropdown(geojson) {
    const select = document.getElementById('sort-field');
    select.innerHTML = ''; // Clear existing options

    // Placeholder option
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose a field';
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
    console.log('tabledata:', tabledata);

    if (!tabledata || !tabledata.features) {
        console.warn('No data to sort.');
        return;
    }

    const field = document.getElementById('sort-field').value;
    console.log('Sort field:', field);

    if (!field) {
        alert("Please choose a field to sort by.");
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

    updateTable(sortedGeojson);  // 🔁 re-render with sorted data
}



// document.getElementById('sortbtn').addEventListener('click', function () {
//     sortTable();
// });

// function revert() {
//     updateTable(filteredData)
// }

let tabledata=null;
function updateTable(geojson) {
    populateSortDropdown(geojson);
    console.log(geojson);

    tabledata = geojson

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
function downloadTableData(filteredData) {
    console.log('starting the download')
    // Check if filtered data is available
    if (!filteredData) {
        console.error("Filtered data is not available.");
        return;
    }

    // console.log(filteredData)
    // Parse filtered data
    // var data = JSON.parse(filteredData);

    var data = filteredData
    // console.log(data)
    // Function to properly encode special characters for CSV
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

    // Get the headers from the first data item
    // var headers = ['api_num','county','ft_category','fta_uid','id','latitude','longitude','municipality','operator','other_id','plug_date','spud_date','stusps','well_configuration','well_name','well_status','well_type'];
    // csvContent += headers.map(encodeForCSV).join(",") + "\n"; 

    var headers = Object.keys(data.features[0].properties);
    csvContent += headers.join(',') + '\n';

    // console.log(headers)
    
    // Convert each data item to CSV format
    data.features.forEach(function(dataItem) {
        // console.log(dataItem)
        var row = headers.map(function(header) {
            return encodeForCSV(dataItem.properties[header]);
        }).join(",");
        // console.log(row);
        csvContent += row + "\n";
    });

    // Create a Blob object with the CSV content
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_well_data.csv");

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

const statesarray = [
    "Alabama", 
    // "Alaska", 
    "Arizona", 
    "Arkansas", 
    "California", 
    "Colorado", 
    // "Connecticut", 
    // "Delaware", 
    "Florida", 
    // "Georgia", 
    // "Hawaii", 
    "Idaho", 
    "Illinois", 
    "Indiana", 
    "Iowa", 
    "Kansas", 
    "Kentucky", 
    "Louisiana", 
    // "Maine", 
    "Maryland", 
    // "Massachusetts", 
    "Michigan", 
    // "Minnesota", 
    "Mississippi", 
    "Missouri", 
    "Montana", 
    "Nebraska", 
    "Nevada", 
    // "New Hampshire", 
    // "New Jersey", 
    "New Mexico", 
    "New York", 
    // "North Carolina", 
    "North Dakota", 
    "Ohio", 
    "Oklahoma", 
    "Oregon", 
    "Pennsylvania", 
    // "Rhode Island", 
    // "South Carolina", 
    "South Dakota", 
    "Tennessee", 
    "Texas (disabled)", 
    "Utah", 
    // "Vermont", 
    "Virginia", 
    "Washington", 
    "West Virginia",
    // "Wisconsin", 
    "Wyoming"
    ];

// Iterate through the statesarray array and create a button for each st
statesarray.forEach(st => {
    const sbutton = document.createElement('button');
    sbutton.className = 'filterbutton';
    sbutton.id = st+'btn';
    sbutton.innerText = st.charAt(0).toUpperCase() + st.slice(1); // Capitalize the first letter of color
    sbutton.onclick = () => toggleselection('state',st);
    // Append the button to the button-container div
    document.getElementById('state-container').appendChild(sbutton);
});

const ftacats = ['Injection / Storage / Service', 'Not Drilled','Orphaned / Abandoned / Unverified','Other / Unknown','Plugged','Production Well']

ftacats.forEach(st => {
    const fbutton = document.createElement('button');
    fbutton.className = 'filterbutton';
    fbutton.id = st+'btn';
    fbutton.innerText = st.charAt(0).toUpperCase() + st.slice(1); // Capitalize the first letter of color
    fbutton.onclick = () => toggleselection('ftacat',st);
    // Append the button to the button-container div
    document.getElementById('ftacat-container').appendChild(fbutton);
});

function getButtonValues() {
    // Select all buttons inside the container
    const buttonchk = document.getElementById('statePicks').querySelectorAll('*');
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
    // console.log(bo)
    statelist = getButtonValues()
    // console.log(document.getElementById(bo+'-container').value)
    if (bo==="county" && statelist != null) {
        // console.log(statelist),
        addCtyOptions(statelist)
    } else if (bo === "wellstatus" && statelist != null) {
        addStatus(statelist)
    } else if (bo === "welltype" && statelist != null) {
        addType(statelist)
    }
    
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




ctycontainer = document.getElementById('county-container')
ctybutton = document.getElementById('countybutton')

// Show dropdown when button is clicked
ctybutton.addEventListener('click', () => {
    if (ctycontainer.style.display === 'none' || ctycontainer.style.display === '' ) {
        // if (statetextbox.innerHTML != '' && statetextbox.innerHTML != '**REQUIRED**') {
        if (statetextbox.innerHTML != '' && statetextbox.innerHTML != '') {
            statetextbox.style.display='flex';
            ctycontainer.style.display = 'block';
        } else {
            ctycontainer.style.display = 'none';
        }
    } else if (ctycontainer.style.display = 'block') {
        ctycontainer.style.display = 'none';
    }
});

// Close dropdown if cursor leaves the button or the dropdown container
ctycontainer.addEventListener('mouseleave', () => {
    ctycontainer.style.display = 'none';
});

// Prevent dropdown from closing if cursor is inside the dropdown content
ctycontainer.addEventListener('mouseenter', () => {
    ctycontainer.style.display = 'block';
});

// Keep dropdown open if the cursor is inside the button or dropdown
ctybutton.addEventListener('mouseleave', () => {
    ctycontainer.style.display = 'none';
});


statuscontainer = document.getElementById('status-container')
statusbutton = document.getElementById('statusbutton')

// Show dropdown when button is clicked
statusbutton.addEventListener('click', () => {
    if (statuscontainer.style.display === 'none' || statuscontainer.style.display === '' ) {
        // if (statetextbox.innerHTML != '' && statetextbox.innerHTML != '**REQUIRED**') {
        if (statetextbox.innerHTML != '' && statetextbox.innerHTML != '') {
            statuscontainer.style.display = 'block';
            statetextbox.style.display='flex';
        } else {
            statuscontainer.style.display = 'none';
        }
    } else if (statuscontainer.style.display = 'block') {
        statuscontainer.style.display = 'none';
    }
});

// Close dropdown if cursor leaves the button or the dropdown container
statuscontainer.addEventListener('mouseleave', () => {
    statuscontainer.style.display = 'none';
});

// Prevent dropdown from closing if cursor is inside the dropdown content
statuscontainer.addEventListener('mouseenter', () => {
    statuscontainer.style.display = 'block';
});

// Keep dropdown open if the cursor is inside the button or dropdown
statusbutton.addEventListener('mouseleave', () => {
    statuscontainer.style.display = 'none';
});

typecontainer = document.getElementById('type-container')
typebutton = document.getElementById('typebutton')

// Show dropdown when button is clicked
typebutton.addEventListener('click', () => {
    if (typecontainer.style.display === 'none' || typecontainer.style.display === '' ) {
        // if (statetextbox.innerHTML != '' && statetextbox.innerHTML != '**REQUIRED**') {
        if (statetextbox.innerHTML != '' && statetextbox.innerHTML != '') {
            typecontainer.style.display = 'block';
            statetextbox.style.display='flex';
        } else {
            typecontainer.style.display = 'none';
        }
    } else if (typecontainer.style.display = 'block') {
        typecontainer.style.display = 'none';
    }
});

// Close dropdown if cursor leaves the button or the dropdown container
typecontainer.addEventListener('mouseleave', () => {
    typecontainer.style.display = 'none';
});

// Prevent dropdown from closing if cursor is inside the dropdown content
typecontainer.addEventListener('mouseenter', () => {
    typecontainer.style.display = 'block';
});

// Keep dropdown open if the cursor is inside the button or dropdown
typebutton.addEventListener('mouseleave', () => {
    typecontainer.style.display = 'none';
});



fcontainer = document.getElementById('ftacat-container')
fbutton = document.getElementById('ftacatbutton')

// Show dropdown when button is clicked
fbutton.addEventListener('click', () => {
    if (fcontainer.style.display === 'none' || fcontainer.style.display === '' ) {
        fcontainer.style.display = 'block';
    } else if (fcontainer.style.display = 'block') {
        fcontainer.style.display = 'none';
    }
});

// Close dropdown if cursor leaves the button or the dropdown container
fcontainer.addEventListener('mouseleave', () => {
    fcontainer.style.display = 'none';
});

// Prevent dropdown from closing if cursor is inside the dropdown content
fcontainer.addEventListener('mouseenter', () => {
    fcontainer.style.display = 'block';
});

// Keep dropdown open if the cursor is inside the button or dropdown
fbutton.addEventListener('mouseleave', () => {
    fcontainer.style.display = 'none';
});





function toggleselection(c,v) {
    var earray = statetextbox.querySelectorAll("*");
    var ecount = earray.length;

    if (document.getElementById('input-'+v) != null) {
        if (c==='state') {
            document.getElementById(v+'btn').classList = 'filterbutton'
        } else if (c==='county') {
            document.getElementById(v+'btn').classList = 'filterbutton'
        } else if (c==='status') {
            document.getElementById(v+'btn').classList = 'filterbutton'
        } else if (c==='type') {
            document.getElementById(v+'btn').classList = 'filterbutton'
        } else if (c==='ftacat') {
            document.getElementById(v+'btn').classList = 'filterbutton'
        };
        document.getElementById('input-'+v).remove();
        if (statetextbox.innerHTML === '') {
            // statetextbox.innerHTML = '**REQUIRED**';
            statetextbox.style.display = 'none';
            document.getElementById('countybutton').classList.remove('notyet')
            document.getElementById('statusbutton').classList.remove('notyet')
            document.getElementById('typebutton').classList.remove('notyet')
            document.getElementById('ftacatbutton').classList.remove('notyet')
        } else {
            statetextbox.style.display='flex';
        };
    } else if (ecount>6 && c ==='state') {
        alert("You've selected the max number of states per search.");
    } else {
        if (c === 'state') {
            document.getElementById(v+'btn').classList = 'highlightbutton'
        } else if (c === 'county') {
            document.getElementById(v+'btn').classList = 'highlightbutton'
        } else if (c === 'status') {
            document.getElementById(v+'btn').classList = 'highlightbutton'
        } else if (c === 'type') {
            document.getElementById(v+'btn').classList = 'highlightbutton'
        } else if (c === 'ftacat') {
            document.getElementById(v+'btn').classList = 'highlightbutton'
        }
        var buttonState = document.createElement('button-state');
        buttonState.classList.add('selbutton');
        statetextbox.style.display='flex';
        buttonState.onclick = function() {
            document.getElementById(buttonState.id.slice(6) + 'btn').classList = 'filterbutton';
            buttonState.remove();
            if (statetextbox.innerHTML === '') {
                // statetextbox.innerHTML = '**REQUIRED**';
                statetextbox.style.display = 'none';
                document.getElementById('countybutton').classList.add('notyet')
                document.getElementById('statusbutton').classList.remove('notyet')
                document.getElementById('typebutton').classList.remove('notyet')
                document.getElementById('ftacatbutton').classList.remove('notyet')
    
            } else if (ctytextbox.innerHTML==='') {
                ctytextbox.innerHTML='You can limit your results to those within a specific county by clicking the corresponding button below.'
            } else if (statustextbox.innerHTML==='') {
                statustextbox.innerHTML='Status varies from state to state, take a look at the reference below.'
            } else if (typetextbox.innerHTML==='') {
                typetextbox.innerHTML='Type varies from state to state, take a look at the reference below.'
            } else if (cattextbox.innerHTML==='') {
                cattextbox.innerHTML='Our attempt to normalize the varying classifications across the country. '
            } ;
        };
        
        // Create a span for the original text
        const textSpan = document.createElement('span');
        if (c === 'state') {
            if (v === "Alabama") {
                textSpan.textContent = 'AL'
            } else if (v === "Arizona") {
                textSpan.textContent = 'AZ';  // Set the text inside the span
            } else if (v === "Arkansas") {
                textSpan.textContent = 'AR';  // Set the text inside the span
            } else if (v === "California") {
                textSpan.textContent = 'CA';  // Set the text inside the span
            } else if (v === "Colorado") {
                textSpan.textContent = 'CO';  // Set the text inside the span
            } else if (v === "Florida") {
                textSpan.textContent = 'FL';  // Set the text inside the span
            } else if (v === "Idaho") {
                textSpan.textContent = 'ID';  // Set the text inside the span
            } else if (v === "Illinois") {
                textSpan.textContent = 'IL';  // Set the text inside the span
            } else if (v === "Indiana") {
                textSpan.textContent = 'IN';  // Set the text inside the span
            } else if (v === "Iowa") {
                textSpan.textContent = 'IA';  // Set the text inside the span
            } else if (v === "Kansas") {
                textSpan.textContent = 'KS';  // Set the text inside the span
            } else if (v === "Kentucky") {
                textSpan.textContent = 'KY';  // Set the text inside the span
            } else if (v === "Louisiana") {
                textSpan.textContent = 'LA';  // Set the text inside the span
            } else if (v === "Maryland") {
                textSpan.textContent = 'MD';  // Set the text inside the span
            } else if (v === "Michigan") {
                textSpan.textContent = 'MI';  // Set the text inside the span
            } else if (v === "Mississippi") {
                textSpan.textContent = 'MS';  // Set the text inside the span
            } else if (v === "Missouri") {
                textSpan.textContent = 'MO';  // Set the text inside the span
            } else if (v === "Montana") {
                textSpan.textContent = 'MT';  // Set the text inside the span
            } else if (v === "Nebraska") {
                textSpan.textContent = 'NE';  // Set the text inside the span
            } else if (v === "Nevada") {
                textSpan.textContent = 'NV';  // Set the text inside the span
            } else if (v === "New Mexico") {
                textSpan.textContent = 'NM';  // Set the text inside the span
            } else if (v === "New York") {
                textSpan.textContent = 'NY';  // Set the text inside the span
            } else if (v === "North Dakota") {
                textSpan.textContent = 'ND';  // Set the text inside the span
            } else if (v === "Ohio") {
                textSpan.textContent = 'OH';  // Set the text inside the span
            } else if (v === "Oklahoma") {
                textSpan.textContent = 'OK';  // Set the text inside the span
            } else if (v === "Oregon") {
                textSpan.textContent = 'OR';  // Set the text inside the span
            } else if (v === "Pennsylvania") {
                textSpan.textContent = 'PA';  // Set the text inside the span
            } else if (v === "South Dakota") {
                textSpan.textContent = 'SD';  // Set the text inside the span
            } else if (v === "Tennessee") {
                textSpan.textContent = 'TN';  // Set the text inside the span
            } else if (v === "Texas") {
                textSpan.textContent = 'TX';  // Set the text inside the span
            } else if (v === "Utah") {
                textSpan.textContent = 'UT';  // Set the text inside the span
            } else if (v === "Virginia") {
                textSpan.textContent = 'VA';  // Set the text inside the span
            } else if (v === "Washington") {
                textSpan.textContent = 'WA';  // Set the text inside the span
            } else if (v === "West Virginia") {
                textSpan.textContent = 'WV';  // Set the text inside the span
            } else if (v === "Wyoming") {
                textSpan.textContent = 'WY';  // Set the text inside the span
            }
            
        } else {
            textSpan.textContent = v;  // Set the text inside the span
        };
        // Create a span for the 'X' that will appear on hover
        const closeSpan = document.createElement('span');
        closeSpan.textContent = ' X';
        closeSpan.style.display = 'none';  // Hide 'X' initially
        closeSpan.style.color = "red";

        // Append the spans inside the button
        buttonState.appendChild(textSpan);
        buttonState.appendChild(closeSpan);



        // Add hover effect to display 'X'
        buttonState.addEventListener('mouseenter', () => {
            closeSpan.style.display = 'inline';  // Show the 'X' when hovered
        });

        buttonState.addEventListener('mouseleave', () => {
            closeSpan.style.display = 'none';  // Hide the 'X' when not hovered
        });

        // buttonState.textContent = v;
        buttonState.id = "input-" + v;
        buttonState.style.fontWeight = 'bold';


        // Append the new button to the input box (which is now an input field)
        // if (statetextbox.innerHTML==='**REQUIRED**' && c==='state') {
        if (statetextbox.innerHTML==='' && c==='state') {
            statetextbox.innerHTML='';
            document.getElementById('countybutton').classList.remove('notyet')
            document.getElementById('statusbutton').classList.remove('notyet')
            document.getElementById('typebutton').classList.remove('notyet')
            document.getElementById('ftacatbutton').classList.remove('notyet')

        } else if (c==='county' && ctytextbox.innerHTML==='You can limit your results to those within a specific county by clicking the corresponding button below.') {
            ctytextbox.innerHTML=''
        } else if (c==='status' && statustextbox.innerHTML==='Status varies from state to state, take a look at the reference below.') {
            statustextbox.innerHTML=''
        } else if (c==='type' && typetextbox.innerHTML==='Type varies from state to state, take a look at the reference below.') {
            typetextbox.innerHTML=''
        } else if (c==='ftacat' && cattextbox.innerHTML==='Our attempt to normalize the varying classifications across the country. ') {
            cattextbox.innerHTML=''
        } ;
        
        if (c === 'state') {
            statetextbox.appendChild(buttonState);

        } else if (c === 'county') {
            // console.log(ctytextbox.innerHTML.slice(5))
            if (ctytextbox.innerHTML.slice(0,5) === 'Not n'){
                ctytextbox.innerHTML = ''
            }
            ctytextbox.appendChild(buttonState);
        } else if (c === 'status') {
            statustextbox.appendChild(buttonState);
        } else if (c === 'type') {
            typetextbox.appendChild(buttonState);
        } else if (c === 'ftacat') {
            cattextbox.appendChild(buttonState);
        }
    }
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
// // Toggle polygons visibility based on checkbox
// document.getElementById('category6').addEventListener('change', function() {
//     // document.getElementById('category6').classList.add('loadinglayer');
//     document.body.classList.add('loadinglayer');

//     if (this.checked) {
//         productionwells.addTo(map)
//     } else if (productionwells) {
//         map.removeLayer(productionwells);
//     } 
//     document.body.classList.remove('loadinglayer');

//     // document.getElementById('category6').classList.remove('loadinglayer');
// });

// // Toggle polygons visibility based on checkbox
// document.getElementById('category5').addEventListener('change', function() {
//     if (this.checked) {
//         pluggedwells.addTo(map);
//     } else if (pluggedwells) {
//         map.removeLayer(pluggedwells);
//     }
// });


// // Toggle polygons visibility based on checkbox
// document.getElementById('category4').addEventListener('change', function() {
//     if (this.checked) {
//         otherwells.addTo(map);
//     } else if (otherwells) {
//         map.removeLayer(otherwells);
//     }
// });


// // Toggle polygons visibility based on checkbox
// document.getElementById('category3').addEventListener('change', function() {
//     if (this.checked) {
//         orphanwells.addTo(map);
//     } else if (orphanwells) {
//         map.removeLayer(orphanwells);
//     }
// });


// // Toggle polygons visibility based on checkbox
// document.getElementById('category2').addEventListener('change', function() {
//     if (this.checked) {
//         notdrilledwells.addTo(map);
//     } else if (notdrilledwells) {
//         map.removeLayer(notdrilledwells);
//     }
// });


// // Toggle polygons visibility based on checkbox
// document.getElementById('category1').addEventListener('change', function() {
//     if (this.checked) {
//         injectionwells.addTo(map);
//     } else if (injectionwells) {
//         map.removeLayer(injectionwells);
//     }
// });

// Toggle polygons visibility based on checkbox
// document.getElementById('countylayer').addEventListener('change', function() {
//     if (this.checked && canvasLayer_cty) {
//         canvasLayer_cty.addTo(map);
//     } else if (canvasLayer_cty) {
//         map.removeLayer(canvasLayer_cty);
//     }
// });


// Toggle polygons visibility based on checkbox
// document.getElementById('countychoropleth').addEventListener('click', function() {
//     if (this.checked) {
//         ctytallyLayer.addTo(map);
//     } else if (ctytallyLayer) {
//         map.removeLayer(ctytallyLayer);
//     }
// });
// Toggle polygons visibility based on checkbox
// document.getElementById('countycount').addEventListener('click', function() {
//     if (this.checked) {
//         markerIconCollection.addTo(map);
//     } else if (markerIconCollection) {
//         map.removeLayer(markerIconCollection);
//     }
// });


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




// Create the Leaflet Draw Control
var drawControl = new L.Control.Draw({
    draw: {
        circle: true, // Allow the user to draw a circle
        circlemarker: false,
        polygon: false,
        polyline: false,
        rectangle: false,
        marker: false,
    }
});

// Manually attach the draw control to a div outside the map
var drawControlsDiv = document.getElementById('draw-controls');

// Attach the draw control to the separate div
map.addControl(drawControl);

// Move the control outside of the map container
var controlContainer = document.querySelector('.leaflet-draw-toolbar');
drawControlsDiv.appendChild(controlContainer);

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
map.addControl(drawControl);
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
        
        updateTable(refinedrad.features)
        // Log the result
        // console.log(JSON.stringify(geoJSON, null, 2));


      // Display the JSON object in the console
    //   console.log(JSON.stringify(pointsInsideJSON, null, 2));
    // alert("Points inside the circle: " + pointsInside);
}
});

function refinefilter () {
    f = document.getElementById('sort-field2').value;
    s = document.getElementById('srch-input').value;
    const refinedsrch = {
        "type": "FeatureCollection",
        "features": filteredData.features.filter(function(feature) {
          return feature.properties[f] === s; // Change the value as needed
        })
      };
      console.log('here')
      console.log(refinedsrch.features)
      updateTable(refinedsrch.features)
}

filterbtn.addEventListener('click', (e) => {
    document.getElementById('resultspanel').classList.add('hide');
    document.getElementById('filterpanel').classList.remove('hide');
    document.getElementById('resultsbtn').classList.remove('sel')
    document.getElementById('filterbtn').classList.add('sel')


});
resultsbtn.addEventListener('click', (e) => {
    document.getElementById('filterpanel').classList.add('hide');
    document.getElementById('resultspanel').classList.remove('hide');
    document.getElementById('filterbtn').classList.remove('sel')
    document.getElementById('resultsbtn').classList.add('sel')


});



window.onload = function() {
    // document.getElementById('category1').checked = false;
    // document.getElementById('category2').checked = false;
    // document.getElementById('category3').checked = false;
    // document.getElementById('category4').checked = false;
    // document.getElementById('category5').checked = false;
    // document.getElementById('category6').checked = false;

    document.getElementById('pipeline_fractracker').checked = false;
    document.getElementById('pipeline_crudeoil').checked = false;
    document.getElementById('pipeline_hgl').checked = false;
    document.getElementById('pipeline_naturalgas').checked = false;
    document.getElementById('pipeline_petroleum').checked = false;
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

// Toggle line visibility based on checkbox
document.getElementById('pipeline_fractracker').addEventListener('change', function() {
    if (this.checked) {
        // console.log('pipeline_naturalgas - checked')
        if (!lines_pipeline_fractracker) {
            console.log('pipeline_naturalgas - needs to load')
            // createLineLayer('Pipeline_Fractracker')
        } else {
            // console.log('pipeline_naturalgas - just adding')
            lines_pipeline_fractracker.addTo(map);
        }
    } else if (lines_pipeline_fractracker) {
        console.log('pipeline_naturalgas - fake removing')
        // map.removeLayer(lines_pipeline_fractracker);
    }
});

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
        console.log('compressors - checked')
        if (!points_compressorstations) {
            console.log('compressors - needs to load')
            createPointLayer('Compressors')
        } else {
            console.log('compressors - just adding')
            points_compressorstations.addTo(map);
        }
    } else if (points_compressorstations) {
        console.log('compressors - removing')
        map.removeLayer(points_compressorstations);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_bordercrossing_electric').addEventListener('change', function() {
    if (this.checked) {
        // console.log('compressors - checked')
        if (!points_eia_bordercrossing_electric) {
            // console.log('compressors - needs to load')
            createPointLayer('Bordercrossing_Electric')
        } else {
            // console.log('compressors - just adding')
            points_eia_bordercrossing_electric.addTo(map);
        }
    } else if (points_eia_bordercrossing_electric) {
        // console.log('compressors - removing')
        map.removeLayer(points_eia_bordercrossing_electric);
    }
});

// Toggle line visibility based on checkbox
document.getElementById('eia_bordercrossing_liquids').addEventListener('change', function() {
    if (this.checked) {
        // console.log('compressors - checked')
        if (!points_eia_bordercrossing_liquids) {
            // console.log('compressors - needs to load')
            createPointLayer('Bordercrossing_Liquids')
        } else {
            // console.log('compressors - just adding')
            points_eia_bordercrossing_liquids.addTo(map);
        }
    } else if (points_eia_bordercrossing_liquids) {
        // console.log('compressors - removing')
        map.removeLayer(points_eia_bordercrossing_liquids);
    }
});


// Toggle line visibility based on checkbox
document.getElementById('eia_bordercrossing_naturalgas').addEventListener('change', function() {
    if (this.checked) {
        // console.log('compressors - checked')
        if (!points_eia_bordercrossing_naturalgas) {
            // console.log('compressors - needs to load')
            createPointLayer('Bordercrossing_Naturalgas')
        } else {
            // console.log('compressors - just adding')
            points_eia_bordercrossing_naturalgas.addTo(map);
        }
    } else if (points_eia_bordercrossing_naturalgas) {
        // console.log('compressors - removing')
        map.removeLayer(points_eia_bordercrossing_naturalgas);
    }
});



// Toggle line visibility based on checkbox
document.getElementById('eia_markethub_naturalgas').addEventListener('change', function() {
    if (this.checked) {
        // console.log('compressors - checked')
        if (!points_eia_markethub_naturalgas) {
            // console.log('compressors - needs to load')
            createPointLayer('Markethubs_Naturalgas')
        } else {
            // console.log('compressors - just adding')
            points_eia_markethub_naturalgas.addTo(map);
        }
    } else if (points_eia_markethub_naturalgas) {
        // console.log('compressors - removing')
        map.removeLayer(points_eia_markethub_naturalgas);
    }
});


// Toggle line visibility based on checkbox
document.getElementById('eia_markethub_hgl').addEventListener('change', function() {
    if (this.checked) {
        // console.log('compressors - checked')
        if (!points_eia_markethub_hgl) {
            // console.log('compressors - needs to load')
            createPointLayer('Markethubs_hgl')
        } else {
            // console.log('compressors - just adding')
            points_eia_markethub_hgl.addTo(map);
        }
    } else if (points_eia_markethub_hgl) {
        // console.log('compressors - removing')
        map.removeLayer(points_eia_markethub_hgl);
    }
});



// Toggle line visibility based on checkbox
document.getElementById('eia_ports_petroleum').addEventListener('change', function() {
    if (this.checked) {
        // console.log('compressors - checked')
        if (!points_eia_ports_petroleum) {
            // console.log('compressors - needs to load')
            createPointLayer('Ports_Petroleum')
        } else {
            // console.log('compressors - just adding')
            points_eia_ports_petroleum.addTo(map);
        }
    } else if (points_eia_ports_petroleum) {
        // console.log('compressors - removing')
        map.removeLayer(points_eia_ports_petroleum);
    }
});



// Toggle line visibility based on checkbox
document.getElementById('eia_powerplants_batterystorage').addEventListener('change', function() {
    if (this.checked) {
        console.log('compressors - checked')
        if (!points_eia_powerplants_batterystorage) {
            console.log('compressors - needs to load')
            createPointLayer('Powerplants_Batterystorage')
        } else {
            console.log('compressors - just adding')
            points_eia_powerplants_batterystorage.addTo(map);
        }
    } else if (points_eia_powerplants_batterystorage) {
        console.log('compressors - removing')
        map.removeLayer(points_eia_powerplants_batterystorage);
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