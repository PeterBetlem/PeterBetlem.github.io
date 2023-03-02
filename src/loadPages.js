import { md } from "./map"

export function loadSidebarPages () {
        $( "#home" ).load( "./pages/home.html" );
        $( "#projects" ).load( "./pages/projects.html" );
        $( "#contact" ).load( "./pages/contact.html" );
        $( "#teaching" ).load( "./pages/teaching.html" );
        $( "#events" ).load( "./pages/events.html" );
        $( "#grants" ).load( "./pages/grants.html" )
        generateFundingPage()
        
//       $( "#publications" ).load( "./pages/publications.html" ); // automatically refreshed.
}

function generateFundingPage () {
        var myRequest = "https://wms.qgiscloud.com/peterbetlem/rnd?service=WFS&request=GetFeature";
        var outputFormat = "outputformat=geojson";
        var grantsRequest = myRequest + "&typename=grants&" + outputFormat; 
        $.getJSON(grantsRequest, function(data){
                var sorted = data.features.sort((a, b) => parseFloat(b.properties.year) - parseFloat(a.properties.year))
                
                var header = '| Year | Funding | Number | Amount |\n|:------ | :----------- |  :----------- | ------:|\n'
                for (let i in sorted) {
                        if (data.features[i].properties.number) {
                                var number = data.features[i].properties.number
                        } else {
                                var number = ""
                        }
                        
                        if (data.features[i].properties.subfunding) {
                                var subfunding = data.features[i].properties.subfunding
                        } else {
                                var subfunding = data.features[i].properties.funding
                        }
                        let row = "| " + data.features[i].properties.year + " | " + subfunding + " | " + number + " | " + Math.round(data.features[i].properties.amount/1000) + " k" + data.features[i].properties.currency + " |\n"
                        header = header.concat(row)
                }
        $( "#grants-content" ).html( md.render(header) )
        })
}

    