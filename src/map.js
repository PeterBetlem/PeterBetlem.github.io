import "./map.css";

import { generateBibliography } from "./bibiography"
import { loadSidebarPages } from "./loadPages"
import { mapLayers } from "./mapLayers"

const L = window.L

const map = L.map("map", {
    center: [67, 10],
    zoom: 4,
    minZoom: 4,
    zoomControl: false, // add manually later to place below layer control
  })

// create the sidebar instance and add it to the map


export var sidebar = L.control.sidebar({ container: 'sidebar' })
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
        //console.log(layerObj)
        layerObj.layer.addTo(map)
        //layerObj.layer.on("click", (evt) => {
            //console.log(layerObj.layer)
            //sidebar.update(evt.layer.feature.properties, layerObj.eventType)
        //)
    }
    })