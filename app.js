// @TODO: YOUR CODE HERE!

//set width and height of chart

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//svg wrapper
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "chart");

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


//import the data
d3.csv('data.csv').then(function (stateData) {
    stateData.forEach(function (data) {
        data.income = +data.income;
        data.poverty = +data.poverty; 
    });

    //create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(stateData, d => d.income)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.poverty)])
        .range([height, 0]);

    //axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axes
    chartGroup.append("g").
        attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "lightblue")
        .attr("opacity", ".75")
        .attr('class','tspan');

    //circle text
        chartGroup
            .selectAll("tspan").data(stateData)
        .enter()
        .append("text")
        .text(function (data) {
            return data.abbr
        })
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("font-family", "arial")
        .attr("x", d => xLinearScale(d.income))
        .attr("y", d => yLinearScale(d.poverty));

    //tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>Income: ${d.income}<br>Poverty: ${d.poverty}`);
        })

    //tooltip in chart
    chartGroup.call(toolTip);

    //event listeners
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });


    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Income");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty In %");
        
});

