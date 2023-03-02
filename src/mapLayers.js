import { md, sidebar, map } from "./map"
/*const OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18});
*/

 
var OSM = new L.StamenTileLayer("watercolor");

var domStyleOptions = {
    fillColor: "red",
    color: "red",
    weight: 3,
}

const doms_request = "https://svalbox.unis.no/arcgis/rest/services/dom/DOM/FeatureServer/1/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=&f=geojson"
const doms_layer = L.geoJson(null, {
    style: domStyleOptions,
    onEachFeature: onEachFeatureClosure("dom"),
    id: "dom"
    }
)

var img360_markers = new L.markerClusterGroup({
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: false,
    removeOutsideVisibleBounds: true,
    clusterPane: "tilePane"
    }); 
const img360_request = "https://svalbox.unis.no/arcgis/rest/services/Images/images360/MapServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=&f=geojson"
const img360_layer = L.geoJson(null, {
    pointToLayer: function(feature, latlng) {
        var marker = L.circleMarker(latlng, {
            radius:3,
            opacity: .5,
            color: "orange",
            //color:getColor(feature.properties.League),
            //fillColor:  getColor(feature.properties.League),
            fillOpacity: 0.8

            });  //.bindTooltip(feature.properties.Name);
        //marker.addTo(img360_markers);
        return marker
        },
    onEachFeature: onEachFeatureClosure("img360"),
    id: "img360"
    }
)


var geojsonMarkerOptions = {
    radius: 100,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 0.5,
    fillOpacity: 0.8
};

var myRequest = "https://wms.qgiscloud.com/peterbetlem/rnd?service=WFS&request=GetFeature";
var outputFormat = "outputformat=geojson";
var projectsRequest = myRequest + "&typename=projects&" + outputFormat; 
var domsRequest = myRequest + "&typename=doms&" + outputFormat; 

const projects_layer = L.geoJson(null, {

    pointToLayer: function(feature, latlng) {

        return L.circleMarker(latlng, {
        radius:6,
        opacity: .5,
        //color: "#000",
        //color:getColor(feature.properties.League),
        //fillColor:  getColor(feature.properties.League),
        fillOpacity: 0.8

        });  //.bindTooltip(feature.properties.Name);
    },
    onEachFeature: onEachFeatureClosure("projects"),
    id: "projects"
    });


const personal_doms = L.geoJson(null, {
    style: domStyleOptions,
    onEachFeature: onEachFeatureClosure("v3geo"),
    id: "doms"
    });

export var searchGroup = L.featureGroup([projects_layer, personal_doms]);


function getJSONForRequest(request, container) {
    $.getJSON(request, function(data){
        // L.geoJson function is used to parse geojson file and load on to map
        container.addData(data)
        })
        /*    .success(function(){
            console.log("Successfully retrieved GIS objects.")
        })
        */
        .fail(function(){
            alert('Failed to access project GIS data')
            console.log("Failed to retrieve project GIS objects.")
        })
}

getJSONForRequest(domsRequest, personal_doms)
getJSONForRequest(projectsRequest, projects_layer)
getJSONForRequest(doms_request, doms_layer)
getJSONForRequest(img360_request, img360_layer)

export const mapLayers = [
    {
        layer: OSM,
        defaultAdd: true,
        baseLayerControl: true,
        title: "OSM",
    },
/*    {
        layer: img360_layer,
        eventType: "img360",
        overlayLayerControl: true,
        title: "Photospheres",
    },
*/    {
        layer: doms_layer,
        eventType: "DOMs",
        overlayLayerControl: true,
        title: "DOMs",
    },
    {
        layer: personal_doms,
        eventType: "DOMs",
        overlayLayerControl: true,
        title: "DOMs",
    },
    {
        layer: projects_layer,
        eventType: "projects",
        overlayLayerControl: true,
        title: "Projects",
    },
]

function onEachFeatureClosure(data_type) {
    return function onEachFeature (feature, layer) {
        layer.on("click", function(e){
            switch (data_type) {
                case "projects":
                    updateProjectDivTag("#projects", feature.properties)
                    window.location.hash = '#projects='+feature.properties.name.replace(/\s+/g, '-').toLowerCase()
                    sidebar.open("projects")
                    break
                case "dom":
                    updateSketchfabDivTag("#events", feature.properties)
                    $( "#events-content" ).html()
                    sidebar.open("events")
                    break
                case "v3geo":
                    updateV3geoDivTag("#events", feature.properties)
                    sidebar.open("events")
                    break
                case "img360":
                    updateImg360DivTag("#events", feature.properties)
                    sidebar.open("events")
                    break
                }
    })

    window.addEventListener('hashchange', function () {
        zoomToURL("projects", data_type, feature)
    });
    zoomToURL("projects", data_type, feature)
    
    
        
    }
}

function updateProjectDivTag( divTag, properties) {
    $( divTag + "-content-header").html( md.render("## " + properties.name) )
    $( divTag + "-content" ).html( md.render(properties.description) )
}

function updateV3geoDivTag( divTag, properties) {
    $( divTag + "-content" ).html(
        '<br><div> <iframe style="width:100%;height:95%;position:absolute;left:0px;top:44px;'+
        '" title="Piz Laviner - Err detachment system | V3Geo" width=100% frameborder="0" allowfullscreen mozallowfullscreen="true" '+
        'webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport '+
        'execution-while-not-rendered web-share src="https://v3geo.com/viewer/index.html#/' + properties.v3geo_id + '"></iframe></div>')
}

function updateSketchfabDivTag( divTag, properties) {
    $( divTag + "-content" ).html('<br><div class="sketchfab-embed-wrapper"> '+
    '<iframe style="width:100%;height:95%;position:absolute;left:0px;top:44px;" width=100% frameborder="0" allowfullscreen mozallowfullscreen="true" '+
    'webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport '+
    'execution-while-not-rendered web-share src="https://sketchfab.com/models/' + properties.publ_sketchfab_id + '/embed"></iframe></div>')
}

function updateImg360DivTag( divTag, properties) {
    $( divTag + "-content" ).html('<br><div class="sketchfab-embed-wrapper"> <iframe style="width:100%;height:95%;position:absolute;left:0px;top:44px;" width=100% <iframe width="100%" height="150%" allowfullscreen style="border-style:none;"'+
    ' src="https://cdn.pannellum.org/2.5/pannellum.htm#panorama='+properties.api_link+'&autoLoad=false"></iframe></div>')
}


function zoomToURL(target_data_type, data_type, feature){
    const location = window.location.href
    if (location.includes("#"+target_data_type+"=")) {
        const project = location.split('projects=')[1]
    
        if (data_type == target_data_type && feature.properties.name) {
            if (feature.properties.name.replace(/\s+/g, '-').toLowerCase() == project.replace(/\s+/g, '-').toLowerCase()) {
                updateProjectDivTag("#projects", feature.properties)
                sidebar.open("projects")
                map.flyTo([feature.geometry.coordinates[0][1], feature.geometry.coordinates[0][0]], 5);
            }
    
        }
    
    }

    }