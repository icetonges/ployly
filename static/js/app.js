function init() {
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        console.log("Initialing...")
        console.log(data)
// DropDown        
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });
        optionChanged(data.names[0]);
    });
}

function optionChanged(id) {
// Play with JSON Data
    d3.json("samples.json").then((data) => {

        var metadata = data.metadata;
        console.log("Metadata for Demographic and GaugeInfo...")
        console.log(metadata)

        var result = metadata.filter(a => a.id.toString() === id)[0];
        console.log("Result")
        console.log(result)

        var samples = data.samples.filter(a => a.id === id)[0];

        console.log("Data Samples Section ...")
        console.log(samples);

        var samplevalues = samples.sample_values.slice(0, 10).reverse();

        var otuIDs = samples.otu_ids;

        var OTU_id = otuIDs.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        console.log("Descending OTU_id XXXX...")
        console.log(OTU_id)
        
        var labels = samples.otu_labels.slice(0, 10);


// Demo Info
        var demoInfo = d3.select("#sample-metadata");
        demoInfo.html("");
        Object.entries(result).forEach((entry) => {
            demoInfo.append("h6").text(entry[0] + ": " + entry[1]);
        });

// Bar Chart
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            type: "bar",
            orientation: "h",
        };

        var data = [trace];

        var layout = {
            title: "Top 10 OTUs",
            margin: {
                l: 100,
                r: 10,
                t: 90,
                b: 30
            }
        };

        Plotly.newPlot("bar", data, layout);

// Bubble Chart
        var trace1 = {
            x: otuIDs,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: otuIDs
            },
            text: samples.otu_labels

        };

        var layout1 = {
            xaxis: { title: "OTU IDs" },
            height: 600,
            width: 1200
        };

        var data1 = [trace1];

        Plotly.newPlot("bubble", data1, layout1);

// Gauge 
        var data2 = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: parseInt(result.wfreq),
                title: { text: "Scrubs per Week", font: { size: 24 } },
                //   delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
                gauge: {
                    axis: { range: [null, 10], tickwidth: 1, tickcolor: "#b3ecff" },
                    bar: { color: "#8080ff" },
                    // bgcolor: "white",
                    borderwidth: 1,
                    bordercolor: "#8080ff",
                    steps: [
                        { range: [0, 1], color: "#e6fff7" },
                        { range: [1, 2], color: "#b3ffe6" },
                        { range: [2, 3], color: "#99ffdd" },
                        { range: [3, 4], color: "#80ffd4" },
                        { range: [4, 5], color: "#66ffcc" },
                        { range: [5, 6], color: "#4dffc3" },
                        { range: [6, 7], color: "#33ffbb" },
                        { range: [7, 8], color: "#00e699" },
                        { range: [8, 9], color: "#00cc88" },
                        { range: [9, 10], color: "#00b377" }
                    ],
                },
            }
        ];
        var layout2 = {
            width: 400,
            height: 300,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            font: { color: "#000066", family: "Arial" }
        };
        Plotly.newPlot('gauge', data2, layout2);
    });
}
init();