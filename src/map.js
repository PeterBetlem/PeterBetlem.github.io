import "./map.css";

import { generateBibliography } from "./bibiography"
import { loadSidebarPages } from "./loadPages"
import { mapLayers, searchGroup } from "./mapLayers"

const L = window.L

export var md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
  });
  

export var map;
if (map != undefined) map.remove();
map = L.map("map", {
    center: [57, 10],
    zoom: 3,
    minZoom: 2 // add manually later to place below layer control
    })

map.attributionControl.setPrefix('BetlemTech | Leaflet')
    // create the sidebar instance and add it to the map


export var sidebar = L.control.sidebar({
     container: 'sidebar',
     closeButton: true,
     autopan: true
    
    })
/*sidebar.update = function (props, type) {
    switch (type) {
    case "projects":
        console.log(props)
        break
    }
}*/


sidebar
    .addTo(map)
    .open('home')

    
// add panels dynamically to the sidebar
/*sidebar
.addPanel({
    id:   'js-api',
    tab:  '<i class="fa fa-gear"></i>',
    title: 'JS API',
    pane: '<p>The Javascript API allows to dynamically create or modify the panel state.<p/><p><button onclick="sidebar.enablePanel(\'mail\')">enable mails panel</button><button onclick="sidebar.disablePanel(\'mail\')">disable mails panel</button></p><p><button onclick="addUser()">add user</button></b>',
})
// add a tab with a click callback, initially disabled
.addPanel({
    id:   'mail',
    tab:  '<i class="fa fa-envelope"></i>',
    title: 'Messages',
    button: function() { alert('opened via JS callback') },
    disabled: true,
})*/






// be notified when a panel is opened
sidebar.on('content', function (ev) {
    switch (ev.id) {
        case 'projects':
        sidebar.options.autopan = true;
        break;
        default:
        sidebar.options.autopan = true;
    }
});

loadSidebarPages()
generateBibliography()

mapLayers.forEach((layerObj) => {
    if (layerObj.defaultAdd) {
        //console.log(layerObj)
    }

    if (layerObj.eventType !== "undefined") {
        layerObj.layer.addTo(map)
        
        //layerObj.layer.on("click", (evt) => {
            //console.log(layerObj.layer)
            //sidebar.update(evt.layer.feature.properties, layerObj.eventType)
        //)
    }
    })
    
var searchControl = new L.Control.Search({
    layer: searchGroup, 
    propertyName: "name",
    autoCollapse: true,
    initial: false,
    position: "topright",
    collapsed: false,
    hideMarkerOnCollapse: true,
    zoom: 5
})
    .on('search:locationfound', function(e){
        e.layer.fire("click")

    })


map.addControl(
    searchControl
    )


    
