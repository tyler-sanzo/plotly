function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").append('b').text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// 1. Create the buildCharts function.
function buildCharts(clientID) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allSamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = allSamples.filter(sample => sample.id == clientID);
    //  5. Create a variable that holds the first sample in the array.
    var clientSample = filteredSamples[0];
    console.log(clientSample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_arr = clientSample.otu_ids;
    var otu_labels_arr = clientSample.otu_labels;
    var sample_values_arr = clientSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids_arr.slice(0,10).reverse();
    console.log(yticks);
    // 8. Create the trace for the bar chart.

    var barData = [{
        x: sample_values_arr.slice(0,10).reverse(),
        y: yticks,
        text: otu_labels_arr.slice(0,10).reverse(),
        type: 'bar',
        orientation : 'h',
      }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: ('Client '+ clientID  + "'s Most Common Bacteria Cultures"),
      xaxis: {title: 'Sample Count'},
      yaxis : {type: 'category', title: "OTU ID"}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);


    //Bubble Chart
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids_arr,
      y: sample_values_arr,
      text: otu_labels_arr,
      mode: 'markers',
      marker : {
        size: sample_values_arr,
        color: otu_ids_arr,
      }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Sample counts per bacteria culture.',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Sample Count'},
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Gauge Chart

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetadata = data.metadata.filter(metadata => metadata.id == clientID);
    console.log(filteredMetadata);

    // 2. Create a variable that holds the first sample in the metadata array.
    clientMetadata = filteredMetadata[0];
    console.log(clientMetadata);

    // 3. Create a variable that holds the washing frequency.
    washFreq = clientMetadata.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [ {

      value: washFreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: 'Scrubs per week',
      gauge: {
        axis: {range: [null,10]},
        bar: {color : 'black'},
        steps: [
          {range: [0,2], color:'red'},
          {range: [2,4], color:'orange'},
          {range: [4,6], color:'yellow'},
          {range: [6,8], color:'lightgreen'},
          {range: [8,10], color:'green'}
        ]
      }
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: 'Belly Button Wash Frequency',
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData, gaugeLayout);
  });
}
