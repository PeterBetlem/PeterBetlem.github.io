import { md } from "./map"

export function loadSidebarPages () {
        $( "#home" ).load( "./pages/home.html" );
        $( "#projects" ).load( "./pages/projects.html" );
        $( "#contact" ).load( "./pages/contact.html" );
        //$( "#teaching" ).load( "./pages/teaching.html" );
        $( "#events" ).load( "./pages/events.html" );
        $( "#grants" ).load( "./pages/grants.html" )
        generateFundingPage2()
        generateCitationsBarPlot()
        
//       $( "#publications" ).load( "./pages/publications.html" ); // automatically refreshed.
}

function generateCitationsBarPlot () {
        let url = 'https://raw.githubusercontent.com/PeterBetlem/Serpapi/82d71ea3d8cbe71740a9b013ff5a26c6b8f21236/GScholargraph.json';

        $.getJSON(url, function(data) {
          var xValue = Object.keys(data);
          var yValue = Object.values(data);
          
          var trace1 = {
            x: xValue,
            y: yValue,
            type: 'bar',
            name: 'citations',
            marker: {
              color: 'rgb(49,130,189)',
              opacity: 0.7,
              },
          width: 'auto',
          hoverinfo: 'none',
          text: yValue.map(String),
          textposition: 'auto'
            };
          var data = [trace1];
          var layout = {
            title: 'Google Scholar Citations',
            xaxis: {
              tickangle: -45
              },
              height: 250,
              width: 400,
              margin: {
                l: 25,
                r: 25,
                t: 50,
                b: 50
              }
            };
        
          Plotly.newPlot('publications-graph-scholar', data, layout, {staticPlot: true});
        }         );

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


function generateFundingPage2 () {
        var myRequest = "https://wms.qgiscloud.com/peterbetlem/rnd?service=WFS&request=GetFeature";
        var outputFormat = "outputformat=geojson";
        var grantsRequest = myRequest + "&typename=grants&" + outputFormat; 
        var data = [];

        $.getJSON( grantsRequest, function(json) {
                $.each(json.features, function(feature) {
                        data.push(json.features[feature].properties)
                }
                )

                data = data.sort((a, b) => parseFloat(b.year) - parseFloat(a.year))
                for (let i in data) {
                        if (data[i]["subfunding"]) {
                                data[i]["funding"] = "<b>" + data[i]["funding"] + "</b><br>" + data[i]["subfunding"] + ""
                        }
                }

                $('#grants-table').bootstrapTable({
                        classes: "table",
                        data: data,
                        pagination: false,
                        search: false,
                        columns: [{
                                field: 'year',
                                title: 'Year'
                        }, {
                                field: 'funding',
                                title: 'Funding'
                        }, {
                                field: 'number',
                                title: '#'
                        }, {
                                field: 'amount',
                                title: 'Amount'
                        }]
                        })

              })

              


}


    