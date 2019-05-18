function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
  
    // Use `d3.json` to fetch the metadata for a sample
      var metaDataUrl = `metadata/${sample}`;
      d3.json(metaDataUrl).then(function(data){
          // Use d3 to select the panel with id of `#sample-metadata`
          var panel = d3.select('#sample-metadata');
          // Use `.html("") to clear any existing metadata
          panel.html("");
          // Use `Object.entries` to add each key and value pair to the panel
          // Hint: Inside the loop, you will need to use d3 to append new
          // tags for each key-value in the metadata.
          Object.entries(data).forEach(function([key, value]){
              panel.append('span').text(`${key}: ${value}`);
              panel.append('br');
          });
          // console.log(entries);
          // BONUS: Build the Gauge Chart
          buildGauge(data.WFREQ);
      })
  
  }
  

 
function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
      var sample_data_url = `samples/${sample}`;
  
      d3.json(sample_data_url).then(function(data){
  
          // Grab the top 10 values
          var topTenOtuIds = data.otu_ids.slice(0,10);
          var topTenOtuLabels = data.otu_labels.slice(0,10);
          var topTenSampleValues = data.sample_values.slice(0,10);
  
          // display on the console to verify result
          // console.log(topTenOtuIds);
          // console.log(topTenOtuLabels);
          // console.log(topTenSampleValues);
  
          // @TODO: Build a Bubble Chart using the sample data
          var BubbleChartTraceData =  [{
                x: data.otu_ids,
                y: data.sample_values,
                // type: 'scatter',
                mode: 'markers',
                text: data.otu_labels,
                marker: {
                  color: data.otu_ids,
                  // opacity: [1, 0.8, 0.6, 0.4],
                  size: data.sample_values
                }
          }];
  
          var BubbleChartLayout = {
          hovermode:'closest',
          title:'Bubble Chart',
          xaxis:{zeroline:false, title: 'OTU ID'},
          yaxis:{zeroline:false, title: 'Sample Values'}
          };
  
          // @TODO: Build a Pie Chart
          var PieChartTraceData = [{
              "labels": topTenOtuIds,
              "values": topTenSampleValues,
              "hovertext": topTenOtuLabels,
              "type": "pie"
          }];
          // Select the element
          // var PIE = d3.select('#pie');
          Plotly.newPlot('pie', PieChartTraceData);
  
          Plotly.newPlot('bubble',BubbleChartTraceData, BubbleChartLayout);
          // HINT: You will need to use slice() to grab the top 10 sample_values,
          // otu_ids, and labels (10 each).
  
      })
  
  }
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
    buildGauge(newSample);
  }
  
  // Initialize the dashboard
  init();