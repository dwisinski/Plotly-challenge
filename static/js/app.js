// creating data variable from json
var sample_data = "static/samples.json"

// console logging the data for viewing
d3.json(sample_data).then(function(data) {
    console.log(data);
  });

// creating the initial page on load
function init() {
    var dropdown = d3.select("#selDataset");
    // generating the dropdown list
    d3.json(sample_data).then((data) => {
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        buildCharts(data.names[0]);
        buildTable(data.names[0]);
    });
}

// creating the metadata table
function buildTable(sample_id) {
    d3.json(sample_data).then((data) => {
        var filteredData = data.metadata.filter(sample => sample.id == sample_id)[0];
        var sampleMetadata = d3.select("#sample-metadata");
        sampleMetadata.html("");
        var card = d3.select("#sample-metadata");
        Object.entries(filteredData).forEach(([key, value]) => {
            card.append("p").text(`${key}: ${value}`);
        })

    })
}

// creating the charts
function buildCharts(sample_id) {
    d3.json(sample_data).then((data) => {
        var chart_data = data.samples.filter(sample => sample.id == sample_id)[0];
        var otu_ids = chart_data.otu_ids;
        var otu_labels = chart_data.otu_labels;
        var otu_values = chart_data.sample_values;
        var bubble_data = data.metadata.filter(sample => sample.id == sample_id)[0];
        var wfreq_values = bubble_data.wfreq;

        var bar_data = [
            { y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
              x: otu_values.slice(0,10).reverse(),
              text: otu_labels.slice(0,10).reverse(),
              type: "bar",
              orientation: "h",
              marker: {
                color: "rgb(42, 58, 101)"
              }
            }
          ];
        
        var bar_layout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 45
            }
        };
        
        Plotly.newPlot("bar", bar_data, bar_layout, {displayModeBar: false});

        var bubble_data = [
            { x: otu_ids,
              y: otu_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                size: otu_values,
                colorscale: "YlGnBu",
                color: otu_ids
              }
            }
          ];    
        
        var bubble_layout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 45
            },
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", bubble_data, bubble_layout, {displayModeBar: false});

        var gauge_data = [
            { domain: {x: [0, 1], y: [0, 1]},
              value: wfreq_values,
              title: {text: "Belly Button Washing Frequency<br>(Per Week)"},
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: {range: [null, 9]},
                bar: {color: "rgb(42, 58, 101)"},
                steps: [
                  {range: [0, 3], color: "lightgray"},
                  {range: [3, 6], color: "darkgray"},
                  {range: [6, 9], color: "gray"}
                ],
                threshold: {
                  line: {color: "black", width: 4},
                  thickness: 0.8,
                  value: wfreq_values
                }
              }
            }
          ];
          
          var gauge_layout = { margin: { t: 0, b: 0 } };
          
          Plotly.newPlot("gauge", gauge_data, gauge_layout, {displayModeBar: false});
        
    });
}

// creating the function for a change in selection from dropdown
function optionChanged(sample_id) {
    buildCharts(sample_id);
    buildTable(sample_id);
    }

init();