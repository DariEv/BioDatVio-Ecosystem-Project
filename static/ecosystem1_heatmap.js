/* Project ecosystem 1 by Daria Evseeva, Eduardo Vela, Nicolas Brich, Sarah Ertel, Constantin Holzapfel 21.1.19 */


//constants
var svg=NaN;
var cards=NaN;
var samplesLabel=NaN;
var taxaLabels=NaN;
var taxa=NaN;
var col_taxa=NaN;
var margin={ top: 350, right: 0, bottom: 100, left: 100 };
var width=NaN;
var height=NaN;
var gridSize=NaN;
var colors=NaN;

var legendElementWidth=100; //todo: update for different data, depending on buckets number?
var legendElementHeights=20;
var buckets = 6;


function heatmapChart() {
	returnDictionary = {};
	returnDictionary["init"] = function(data){
			taxa = Object.keys(data[0]);
			taxa.shift();

			col_taxa={};
			taxa.forEach(function(taxa, i){
				col_taxa[taxa]=i+1;
			});
			/*console.log(data);
			console.log(data[0]);
			console.log(taxa);
			console.log("length", taxa.length);

			/*
			var samples = new Array(data.length); // create an empty array
			for(var i = 0; i < samples.length; i++){
				samples[i] = + i;
			}
			console.log(samples);
			var max_of_array = Math.max.apply(Math, data);
			console.log('max', max_of_array);
			*/

			//Here were the constants
			//margin = { top: 350, right: 0, bottom: 100, left: 100 },
			width = 2000 - margin.left - margin.right,
			height = 13*data.length - margin.top - margin.bottom,
			gridSize = Math.floor(height / (data.length)),
			//legendElementWidth = gridSize*2,
			//buckets = 9,
			colors = ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"]; //by colorbrewer: YlGnBu[6]

			svg = d3.select("#chart").append("svg")
			  .attr("width", width + margin.left + margin.right)
			  .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			/*
			samplesLabel = svg.selectAll(".samplesLabel")
			  .data(samples)
			  .enter().append("text")
				.text(function (d) { return d; })
				.attr("x", 0)
				.attr("y", function (d, i) { return i * gridSize; })
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + gridSize / 1.5 + ")");
			*/

			var taxaLabels = svg.selectAll(".taxaLabels")
				  .data(taxa)
				  .enter().append("text")
				  	.attr("class","taxaLabels")
					.text(function(d,i) { return col_taxa[d]+": "+ d; })					
					.attr("y", function(d, i) { return i * gridSize; })
					.attr("x", 0)
					.style("text-anchor", "start")
					.attr("transform", "translate(" + gridSize / 2 + ", -6) rotate(-90)");


			cards = svg.selectAll(".sample")
				.data(data);

			cards.append("title");

			cards.enter().append("text")
				.text(function (d) { return d[""]; })
				.attr("class", "samplesLabel")
				.attr("x", 0)
				.attr("y", function (d, i) { return i * gridSize; })
				.attr('pointer-events', 'all')
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + gridSize / 1.5 + ")");

			taxa.forEach(function(item, taxon) {
				cards.enter().append("rect")
					.attr("x", function(d, i) { return (taxon) * gridSize; })
					.attr("y", function(d, i) { return (i) * gridSize; })
					.attr("class", "bordered")
					.attr("width", gridSize)
					.attr("height", gridSize)
					.style("fill", function(d) {c = Math.floor(Math.log10(Number(d[item])));
												return colors[c];})
					.on("mouseover", function(d, i){

						//d3.select(this).style("fill", "orange");
						//highlight text
						d3.select(this).classed("cell-hover",true);
						d3.selectAll(".samplesLabel").classed("text-highlight",function(r,ri){ return ri==(d.row-1);});
						d3.selectAll(".taxaLabels").classed("text-highlight",function(c,ci){ return ci==(d.col-1);});

						//Update the tooltip position and value
						d3.select("#tooltip")
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY) - 40 + "px")
						.select("#value")
						.text("Sample: "+i+"; Taxa: "+item);
						//Show the tooltip
						d3.select("#tooltip").classed("hidden", false);

					})
					.on("mouseout", function(){
						d3.select(this).classed("cell-hover",false);
						/*d3.selectAll(".rowLabel").classed("text-highlight",false);
						d3.selectAll(".colLabel").classed("text-highlight",false);*/
						d3.select("#tooltip").classed("hidden", true);
					});
			});

			plotLegend(svg, colors, height);

			console.log('printed heatmap.');

	}

	returnDictionary['update']=function(filtered_data){
			d3.selectAll(".bordered").remove();
			d3.selectAll(".samplesLabel").remove();
			d3.selectAll(".taxaLabels").remove();

			taxa = Object.keys(filtered_data[0]);
			taxa.shift();

			taxaLabels = svg.selectAll(".taxaLabels")
				  .data(taxa)
				  .enter().append("text")
				  	.attr("class","taxaLabels")
					.text(function(d) { return col_taxa[d]+": "+ d; })
					.attr("y", function(d, i) { return i * gridSize; })
					.attr("x", 0)
					.style("text-anchor", "start")
					.attr("transform", "translate(" + gridSize / 2 + ", -6) rotate(-90)");

			console.log(filtered_data);
			cards=svg.selectAll(".sample").data(filtered_data);

			cards.enter().append("text")
				.text(function (d) { return d[""]; })
				.attr("class", "samplesLabel")
				.attr("x", 0)
				.attr("y", function (d, i) { return i * gridSize; })
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + gridSize / 1.5 + ")");

			taxa.forEach(function(item, taxon) {

				cards.enter().append("rect")
				  .attr("x", function(d, i) { return (taxon) * gridSize; })
				  .attr("y", function(d, i) { return (i) * gridSize; })
				  .attr("class", "bordered")
				  .attr("width", gridSize)
				  .attr("height", gridSize)
				  .style("fill", function(d) {c = Math.floor(Math.log10(Number(d[item])));
												return colors[c];})
				  .on("mouseover", function(d, i){

						//d3.select(this).style("fill", "orange");
						//highlight text
						d3.select(this).classed("cell-hover",true);
						d3.selectAll(".samplesLabel").classed("text-highlight",function(r,ri){ return ri==(d.row-1);});
						d3.selectAll(".taxaLabels").classed("text-highlight",function(c,ci){ return ci==(d.col-1);});

						//Update the tooltip position and value
						d3.select("#tooltip")
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY) - 40 + "px")
						.select("#value")
						.text("Sample: "+i+"; Taxa: "+item);
						//Show the tooltip
						d3.select("#tooltip").classed("hidden", false);

					})
					.on("mouseout", function(){
						d3.select(this).classed("cell-hover",false);
						/*d3.selectAll(".rowLabel").classed("text-highlight",false);
						d3.selectAll(".colLabel").classed("text-highlight",false);*/
						d3.select("#tooltip").classed("hidden", true);
					});
			});
	};
    return returnDictionary;
};


function plotLegend(svg, colors, height){

	legendCells = Array.apply(null, {length: buckets}).map(Number.call, Number); // array from 0 to buckets

	var legend = svg.selectAll(".legend")
		.data(legendCells)
		.enter().append("g")
		.attr("class", "legend");

	var r= legend.append("rect")
		.attr("x", function(d, i) { return legendElementWidth * i; })
		.attr("y", -margin.top + (legendElementWidth)/3)
		.attr("width", legendElementWidth)
		.attr("height", legendElementHeights)
		.attr('pointer-events', 'all')
		.style("fill", function(d, i) { return colors[i]; });

	/*r.on("mouseover", function(){
			d3.select(this)
			  .style("fill", "orange");
	});*/

	legend.append("text")
		.attr("class", "mono")
		.text(function(d) { return d; })
		.attr("width", legendElementWidth)
		.attr("x", function(d, i) { return legendElementWidth * i; })
		.attr("y", -margin.top + (2*legendElementWidth)/3);

	legend.append("text")
		.attr("class", "mono")
		.text("= log_10(Taxa Relative Abundance)")
		.attr("x", legendElementWidth * buckets)
		.attr("y", -margin.top + (2*legendElementWidth)/3);

}
