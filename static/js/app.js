// reading in belly button data from JSON and setting some variables
d3.json('samples.json').then(BBdata => {

    var metadata = BBdata.metadata;

    var names = BBdata.names

    var samples = BBdata.samples

// adding IDs
var message = ("Choose a Subject");
d3.select("#selDataset").append("option")
.attr("value", message).html(message);

var dropdown = d3.select("#selDataset");
names.forEach((item) => {
    var row = dropdown.append("option")
    .attr("value", item);
    row.text(item);
});

// populate demographics table on drop down selection
const dropdownchange = () => {

// demographics table
  var demoTable = d3.select("#demographics-table");
  // clear previous table
  demoTable.html("")
  var inputElement = d3.select("#selDataset");
  var tableBody = demoTable.append("tbody");
  var inputValue = inputElement.property("value");

// filtering data by input value
var filteredData = metadata.filter(item => item.id == inputValue);
var filteredSamples = samples.filter(item => item.id == inputValue);

// populating table with data
filteredData.forEach((item) => {
  let row = tableBody.append("tr");
  Object.entries(item).forEach(value => {
      let cell = row.append("tr");
      cell.text("");
      cell.text(`${value[0]}: ${value[1]}`);
  })
});

// slice/reverse for barchart
var SlicedSampleValues = filteredSamples[0].sample_values.slice(0,10).reverse();
var slicedOTUs = filteredSamples[0].otu_ids.slice(0,10).reverse().map(data => `OTU ` + data);
var slicedLabels = filteredSamples[0].otu_labels.slice(0,10).reverse();

// horizontal bar chart
var trace1 = {
  x: SlicedSampleValues,
  y: slicedOTUs,
  text: slicedLabels,
  type: "bar",
  orientation: "h"
};
var bardata = [trace1];
var barlayout = {
    title: "Top 10 OTUs in Sample",
    xaxis: {title: "Prevalence in Sample"},
    yaxis: {title: "OTU ID Number"}  
};
Plotly.newPlot("bar", bardata, barlayout);

// bubble chart
var size = filteredSamples[0].sample_values;

var trace2 = {
  x: filteredSamples[0].otu_ids,
  y: filteredSamples[0].sample_values,
  text: filteredSamples[0].otu_labels,
  mode: 'markers',
  marker: {
    size: size,
    sizeref: .1,
    sizemode: 'area',
    color: filteredSamples[0].otu_ids,
}}
var bubbledata = [trace2]
var bubblelayout = {
  title: "OTU Prevalence in Sample",
  xaxis: {title: 'OTU ID Number'},
  yaxis: {title: 'Prevalence in Sample'},
}

Plotly.newPlot("bubble", bubbledata, bubblelayout)
};

// event trigger
dropdown.on("change", dropdownchange);
});