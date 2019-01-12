
function plotPCoA(){ 

	returnDictionary = {};
	returnDictionary["init"] = function(data){
		console.log("js", data);
		console.log("js", data[1]);
		
		// Open both the PCoA data and grouping files.
		//d3.tsv("foo.csv", function(error, data) {
	    //if (error) throw error;
		//d3.tsv("PCoA_groups.tsv", function(error, groupData) {
	    //if (error) throw error;

		// Define the sizes and margins for our canvas.
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

		// Cast my values as numbers and determine ranges.
		var minmax = {p1: {min:0, max:0}, p2: {min:0, max:0}}
		Object.keys(data).forEach(function(k) {
			//console.log(data[k].p1);
			data[k].p1 = +data[k].p1;
			data[k].p2 = +data[k].p2;
			minmax.p1.min = Math.min(data[k].p1, minmax.p1.min);
			minmax.p1.max = Math.max(data[k].p1, minmax.p1.max);
			minmax.p2.min = Math.min(data[k].p2, minmax.p2.min);
			minmax.p2.max = Math.max(data[k].p2, minmax.p2.max);
		});
		
		// Actually create my canvas.
		var svg = d3.select("#chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Set-up my x scale.
		var xScale = d3.scaleLinear()
		.range([0, width])
		.domain([Math.floor(minmax.p1.min), Math.ceil(minmax.p1.max)]);

		// Set-up my y scale.
		var yScale = d3.scaleLinear()
		.range([height, 0])
		.domain([Math.floor(minmax.p2.min), Math.ceil(minmax.p2.max)]);

		// Create my x-axis using my scale.
		var xAxis = d3.axisBottom()
		.scale(xScale);

		// Create my y-axis using my scale.
		var yAxis = d3.axisLeft()
		.scale(yScale);

		// Set-up my colours/groups.
		//var color = d3.scale.category10();
		/*var groups = {};
		groupData.forEach(function(d) {
		groups[d.line] = d.group;
		});*/

		// Create my tooltip creating function.
		/*var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
		  return "<strong>" + d.name + "</strong> (" + groups[d.name] + ")";
		});*/


		// Initialize my tooltip.
		//svg.call(tip);

		// Draw my x-axis.
		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + yScale(0) + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Coord. 1");

		// Draw my y-axis.
		svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + xScale(0) + ",0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Coord. 2");
		
		// Create all the data points :-D.
		svg.selectAll("circle")
			.data(Object.values(data))
			.enter().append("circle")
			//.attr("class", "circle")
			.attr("r", 3.5)
			.attr("cx", function(d) { return xScale(d.p1); })
			.attr("cy", function(d) { return yScale(d.p2); })
			.style("fill", function(d) { return "black"; });
		//.style("stroke", function(d) { return color(groups[d.name]); })
		//.style("fill", function(d) { return color(groups[d.name]); })
		//.on('mouseover', tip.show)
		//.on('mouseout', tip.hide);

		// Create the container for the legend if it doesn't already exist.
		/*var legend = svg.selectAll(".legend")
		.data(color.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		// Draw the coloured rectangles for the legend.
		/*legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

		// Draw the labels for the legend.
		legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });*/

		//});
		//});
		
	};
	
	return returnDictionary; 
}