import { sidebar } from "./map"
const OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; OpenStreetMap contributors | Svalbox | BetlemTech'
});

const doms_request = "https://svalbox.unis.no/arcgis/rest/services/dom/DOM/FeatureServer/1/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=&f=geojson"
const doms_layer = L.geoJson(null, {
    style: {
        fillColor: "red",
        color: "red",
        weight: 1,
    },
    onEachFeature: onEachFeature,
    id: "dom"
    }
)

var img360_markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false
    }); 
const img360_request = "https://svalbox.unis.no/arcgis/rest/services/Images/images360/MapServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=&f=geojson"
const img360_layer = L.geoJson(null, {
    pointToLayer: function(feature, latlng) {

        return L.circleMarker(latlng, {
        radius:3,
        opacity: .5,
        color: "yellow",
        //color:getColor(feature.properties.League),
        //fillColor:  getColor(feature.properties.League),
        fillOpacity: 0.8

        });  //.bindTooltip(feature.properties.Name);
        },
    onEachFeature: onEachFeature,
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
var areasRequest = myRequest + "&typename=areas&" + outputFormat; 

const datalayer = L.geoJson(null, {

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
    onEachFeature: onEachFeature,
    id: "projects"
    });

$.getJSON(areasRequest, function(data){
    // L.geoJson function is used to parse geojson file and load on to map
    datalayer.addData(data)
    })
    /*    .success(function(){
        console.log("Successfully retrieved GIS objects.")
    })
    */
    .fail(function(){
        alert('Failed to access project GIS data')
        console.log("Failed to retrieve project GIS objects.")
    })

$.getJSON(doms_request, function(data){
    // L.geoJson function is used to parse geojson file and load on to map
    doms_layer.addData(data)
    })
    /*    .success(function(){
            console.log("Successfully retrieved GIS objects.")
        })
        */
    .fail(function(){
        alert('Failed to access Svalbox GIS data')
        console.log("Failed to retrieve Svalbox GIS objects.")
    })

$.getJSON(img360_request, function(data){
    // L.geoJson function is used to parse geojson file and load on to map
    img360_layer.addData(data)
    // img360_markers.addLayer(img360_layer)

    })
    /*    .success(function(){
            console.log("Successfully retrieved GIS objects.")
        })
        */
    .fail(function(){
        alert('Failed to access Img360 GIS data')
        console.log("Failed to retrieve Img360 GIS objects.")
    })

export const mapLayers = [
    {
        layer: OSM,
        defaultAdd: true,
        baseLayerControl: true,
        title: "OSM",
    },
    {
        layer: doms_layer,
        eventType: "DOMs",
        overlayLayerControl: true,
        title: "DOMs",
    },
    {
        layer: img360_layer,
        eventType: "img360",
        overlayLayerControl: true,
        title: "Photospheres",
    },
    {
        layer: datalayer,
        eventType: "projects",
        overlayLayerControl: true,
        title: "Projects",
    },
]

function onEachFeature (feature, layer) {
    layer.on("click", function(e){
        switch (Object.keys(layer._eventParents)[0].toString()) {
            case datalayer._leaflet_id.toString():
                $( "#projects-content" ).html("<p>" + feature.properties.description + "</p>")
                sidebar.open("projects")
                break
            case doms_layer._leaflet_id.toString():
                $( "#events-content" ).html('<br><div class="sketchfab-embed-wrapper"> <iframe style="width:100%;height:95%;position:absolute;left:0px;top:44px;" width=100% frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/' + feature.properties.publ_sketchfab_id + '/embed"></iframe></div>')
                sidebar.open("events")
                break
            case img360_layer._leaflet_id.toString():
                $( "#events-content" ).html('<br><div class="sketchfab-embed-wrapper"> <iframe style="width:100%;height:95%;position:absolute;left:0px;top:44px;" width=100% <iframe width="100%" height="150%" allowfullscreen style="border-style:none;"'+
                     ' src="https://cdn.pannellum.org/2.5/pannellum.htm#panorama='+feature.properties.api_link+'&autoLoad=false"></iframe></div>')
                sidebar.open("events")
                break
            }
})
}