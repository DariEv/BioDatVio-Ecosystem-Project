/* Project ecosystem 1 by Daria Evseeva, Eduardo Vela, Nicolas Brich, Sarah Ertel, Constantin Holzapfel 21.1.19 */


// Set-up colors maps from colorbrewer for each metadata value
var colorMap = {
	
	Age: {1:"#ffffcc",
			2:"#c7e9b4",
			3:"#7fcdbb",
			4:"#41b6c4",
			5:"#1d91c0",
			6:"#225ea8",
			7:"#0c2c84"}, // age from 18 y.o. to 77 y.o. : 7-class YlGnBu, sequential 
			
	Sex: {female:"#ef8a62", male:"#67a9cf"},  // 3-class RdBu, diverging (colors 1 and 3)
	
	Nationality: {		
		CentralEurope:"#8dd3c7",
		Scandinavia: "#ffffb3",
		SouthEurope:"#bebada",
		UKIE:"#fb8072",
		US:"#80b1d3",
		EasternEurope:"#fdb462"}, //6-class Set3, qualitative
		
	BMI_group: {underweight:"#ffffcc",
				lean:"#c7e9b4",
				overweight:"#7fcdbb",
				obese:"#41b6c4",
				severeobese:"#2c7fb8",
				morbidobese:"#253494"} // 6 groups: 6-class YlGnBu, sequential
				
};


// Define the sizes and margins for our canvas.
var margin = {top: 100, right: 20, bottom: 60, left: 60};
var width = 930 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;
var legendElementWidth=100;
var legendElementHeights=20;


function plotPCoA(){ 

	returnDictionary = {};
	
	// intial plotting
	returnDictionary["init"] = function(data){		
		document.getElementById("unnorm").innerHTML = data['unnormalizedPCA'];
		document.getElementById("norm").innerHTML = data['normalizedPCA'];
		
		plotFromData(data, "Age");		
	};
	
	// update plot after using filter
	returnDictionary['update']=function(filtered_data){		
		//console.log("PCoA filtred", filtered_data)
		d3.select("svg").remove();
		plotFromData(filtered_data, document.getElementById("btn_sortby").value);
	};
	
	// update plot after changing color map
	returnDictionary['updateColors']=function(data, colorKey){
		d3.select("svg").remove();		
		plotFromData(data, colorKey);
	};
	
	return returnDictionary; 
}



function plotFromData(data, colorKey){
	
	//console.log("js", data);
	
	var pcaValues = data["dataExploration"];
	var PCsPercentage = data["PCsPercentage"];
	var metadata = data["metadataOverview"];
	
	//console.log("js", pcaValues["Sample-13"]);
	//console.log("meta:", metadata);
	//console.log("meta:", Object.keys(metadata));
	//console.log("meta:", Object.keys(pcaValues));

	// Cast values as numbers and determine ranges.
	var minmax = {p1: {min:0, max:0}, p2: {min:0, max:0}}
	Object.keys(pcaValues).forEach(function(k) {
		pcaValues[k].p1 = +pcaValues[k].p1;
		pcaValues[k].p2 = +pcaValues[k].p2;
		minmax.p1.min = Math.min(pcaValues[k].p1, minmax.p1.min);
		minmax.p1.max = Math.max(pcaValues[k].p1, minmax.p1.max);
		minmax.p2.min = Math.min(pcaValues[k].p2, minmax.p2.min);
		minmax.p2.max = Math.max(pcaValues[k].p2, minmax.p2.max);
	});
	
	// create canvas.
	var svg = d3.select("#chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Set-up x scale.
	var xScale = d3.scaleLinear()
		.range([0, width])
		.domain([minmax.p1.min, Math.ceil(minmax.p1.max)]);

	// Set-up y scale.
	var yScale = d3.scaleLinear()
		.range([height, 0])
		.domain([minmax.p2.min, Math.ceil(minmax.p2.max)]);

	// Create x-axis.
	var xAxis = d3.axisBottom()
		.scale(xScale);

	// Create y-axis.
	var yAxis = d3.axisLeft()
		.scale(yScale);

	// Draw x-axis.
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + yScale(minmax.p2.min) + ")")
		.transition()
		.duration(1000)
		.call(xAxis);				

	// Draw y-axis.
	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + xScale(minmax.p1.min) + ",0)")
		.transition()
		.duration(1000)
		.call(yAxis);
			
	// text label for the x axis
	svg.append("text")             
		.attr("transform", "translate(" + (width/2) + "," + (height + margin.top/2) + ")")
		.style("text-anchor", "middle")
		.text(PCsPercentage[0]);

	// text label for the y axis
	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text(PCsPercentage[1]); 
	
	// default color map
	if (colorKey == "")
		colorKey = "Age";
	
	// Set-up colours/groups.
	var colors = colorMap[colorKey];	
	var groups = {};
	
	metadata.forEach(function(d, i) {
		if (colorKey == "Age")
			groups[i] = Math.floor(d[colorKey]/10);
		else
			groups[i] = d[colorKey];
	});
	
	//console.log("coloring", colors[groups[0]]);
	//console.log("coloring", groups);
	
	// Create all the data points
	var circles = svg.selectAll("circle")
		.data(Object.values(pcaValues))
		.enter().append("circle")
		.attr("r", 4)
		.attr("cx", function(d) { return xScale(d.p1); })
		.attr("cy", function(d) { return yScale(d.p2); })
		.style("stroke", function(d, i) { return "gray"; })
		.on("mouseover", function(d, i){				
			//Update the tooltip position and value
			d3.select("#tooltip")
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY) - 60 + "px")
			.select("#value")
			.text("Sample: "+i+
				"; Age: "+metadata[i].Age+
				"; Sex: "+metadata[i].Sex+
				"; Nationality: "+metadata[i].Nationality+
				"; BMI_group: "+metadata[i].BMI_group);  
			//Show the tooltip
			d3.select("#tooltip").classed("hidden", false);
		})
		.on("mouseout", function(){
			// hide tooltip
			d3.select("#tooltip").classed("hidden", true);
		})
		;
		
	circles.transition()
		.duration(300)
			.style("fill", function(d, i) { return colors[groups[i]]; });
	
	// legend
	plotLegend(svg, colors, colorKey, height);
	
}


function plotLegend(svg, colors, type, height){
	
	// array from 0 to nubmer of colors
	legendCells = Array.apply(null, {length: Object.keys(colors).length}).map(Number.call, Number); 
	colorKeys = Object.keys(colors);
	
	//console.log(colorKeys);
	
	var legend = svg.selectAll(".legend")
		.data(legendCells)
		.enter().append("g")
		.attr("class", "legend");

	// draw color rectangulars
	legend.append("rect")	
		.transition()
		.duration(1000)
		.attr("x", function(d, i) { return legendElementWidth * i; })
		.attr("y", -margin.top + (legendElementWidth)/3)
		.attr("width", legendElementWidth)
		.attr("height", legendElementHeights)
		.attr('pointer-events', 'all')
		.style("fill", function(d, i) {return colors[colorKeys[i]]; });

	// labels
	legend.append("text")
	.transition()
		.duration(1000)
		.attr("class", "mono")
		.text(function(d, i) { if (type == "Age") return "from "+(colorKeys[i]*10)+" y.o.";
								else return colorKeys[i]; })
		.attr("width", legendElementWidth)
		.attr("x", function(d, i) { return legendElementWidth * i; })
		.attr("y", -margin.top + (2*legendElementWidth)/3);
	
}