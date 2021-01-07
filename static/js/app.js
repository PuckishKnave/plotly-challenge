// use D3 to read the JSON file
d3.json("data/samples.json").then((bbData) => {
    window.bbData = bbData;
    console.log(bbData);
    var data = bbData;
  
    // add IDs to dropdown menu
    var idList = data.names;
    for (var i = 0; i < idList.length; i++) {
      selectBox = d3.select("#selDataset");
      selectBox.append("option").text(idList[i]);
    }
  
    // default plot
    updatePlots(0)
  
    // function for updating plots   
    function updatePlots(index) {
  
  
      // arrays for horizontal bar chart & gauge chart
      var sampleSubjectOTUs = data.samples[index].otu_ids;
      console.log(sampleSubjectOTUs);
      var sampleSubjectFreq = data.samples[index].sample_values;
      var otuLabels = data.samples[index].otu_labels;
  
      var washFrequency = data.metadata[+index].wfreq;
      console.log(washFrequency);
  
  
      // populate Demographic Data
      var demoKeys = Object.keys(data.metadata[index]);
      var demoValues = Object.values(data.metadata[index])
      var demographicData = d3.select('#sample-metadata');
  
      // clear demographic data
      demographicData.html("");
  
      for (var i = 0; i < demoKeys.length; i++) {
  
        demographicData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
      };
  
      // slice and reverse data for horizontal bar chart
      var topTenOTUS = sampleSubjectOTUs.slice(0, 10).reverse();
      var topTenFreq = sampleSubjectFreq.slice(0, 10).reverse();
      var topTenToolTips = data.samples[0].otu_labels.slice(0, 10).reverse();
      var topTenLabels = topTenOTUS.map((otu => "OTU " + otu));
      var reversedLabels = topTenLabels.reverse();
  
      // set up trace
      var trace1 = {
        x: topTenFreq,
        y: reversedLabels,
        text: topTenToolTips,
        name: "",
        type: "bar",
        orientation: "h"
      };
  
      // data
      var barData = [trace1];
  
      // apply layout
      var layout = {
        title: "Top 10 OTUs",
        margin: {
          l: 75,
          r: 75,
          t: 75,
          b: 50
        }
      };
  
      // render the plot to the div tag with id "plot"
      Plotly.newPlot("bar", barData, layout);
  
      // set up trace
      trace2 = {
        x: sampleSubjectOTUs,
        y: sampleSubjectFreq,
        text: otuLabels,
        mode: 'markers',
        marker: {
          color: sampleSubjectOTUs,
          opacity: [1, 0.8, 0.6, 0.4],
          size: sampleSubjectFreq
        }
      }
  
      // data
      var bubbleData = [trace2];
  
      // apply layout
      var layout = {
        title: 'OTU Frequency',
        showlegend: false,
        height: 600,
        width: 930
      }
  
      // render the plot to the div tag with id "bubble-plot"
      Plotly.newPlot("bubble", bubbleData, layout)
  
      // gauge chart
      var trace3 = [{
        domain: {x: [0, 1], y: [0,1]},
        type: "indicator",
        mode: "gauge+number",
        value: washFrequency,
        title: { text: "Belly Button Washes Per Week" },
        gauge: {
          axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
          bar: { color: "#669999" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "transparent",
          steps: [
            { range: [0, 1], color: "#fff" },
            { range: [1, 2], color: "#e6fff5" },
            { range: [2, 3], color: "ccffeb" },
            { range: [3, 4], color: "b3ffe0" },
            { range: [4, 5], color: "#99ffd6" },
            { range: [5, 6], color: "#80ffcc" },
            { range: [6, 7], color: "#66ffc2" },
            { range: [7, 8], color: "#4dffb8" },
            { range: [8, 9], color: "#33ffad" }
  
          ],
        }
      }];
  
      gaugeData = trace3;
  
      var layout = {
        width: 600,
        height: 500,
        margin: { t: 0, b: 0 }
      };
  
      Plotly.newPlot("gauge", gaugeData, layout);
  
    }
  
    // on button click, call refreshData()
    d3.selectAll("#selDataset").on("change", refreshData);
  
    function refreshData() {
      var dropdownMenu = d3.select("#selDataset");
      // assign the value of the dropdown menu option to a variable
      var personsID = dropdownMenu.property("value");
      console.log(personsID);
      // initialize an empty array for the person's data
      console.log(data)
  
      for (var i = 0; i < data.names.length; i++) {
        if (personsID === data.names[i]) {
          updatePlots(i);
          return
        }
      }
    }
  
  });