function setData(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);

  //  data filter
  var sampleArray = metadata.filter(sampObject => sampObject.id == sample);
  var results = sampleArray[0];
  var panel = d3.select("#sample-metadata");

  // Clear existing data
  panel.html("");

  // Add each key and value pair to panel
  Object.entries(results).forEach(([key, value]) => {
    panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
});
}

function Graphs(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.samples;
    var sampleArray = metadata.filter(sampObject => sampObject.id == sample);
    var results = sampleArray[0];

    var otu_ids = results.otu_ids;
    var otu_labels = results.otu_labels;
    var sample_values = results.sample_values;

    // Bubble graph
  var bubbleGraph = {
      title: "OTUs per Individual",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "sunsetdark"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleGraph);
    
    //Horizontal bar graph
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var layout = {
      title: "Top 10 OTUs Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, layout);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selDropDown = d3.select("#selDataset");

  // Populate the select options by using the list of sample names
  d3.json("samples.json").then((data) => {
    var name = data.names;

    name.forEach((sample) => {
      selDropDown
        .append("option")
        .text(sample)
        .property("value", sample);
    })

    // Use the sample data from the list to build the plots
    var metadata = name[0];
    Graphs(metadata);
    setData(metadata);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  Graphs(newSample);
  setData(newSample);
};


// Initialize the dashboard
init()