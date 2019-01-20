/* Project ecosystem 1 by Daria Evseeva, Eduardo Vela, Nicolas Brich, Sarah Ertel, Constantin Holzapfel 21.1.19 */


//constants
var svg=NaN;
var cards=NaN;
var samplesLabel=NaN;
var taxaLabels=NaN;
var taxa=NaN;
var col_taxa=NaN;
var pos_taxa=NaN;
var margin={ top: 350, right: 0, bottom: 100, left: 100 };
var width=NaN;
var height=NaN;
var gridSize=NaN;
var colors=NaN;

var legendElementWidth=100;
var legendElementHeights=20;
var buckets = 6;

//Oders the Taxa given column filter input
function orderTaxa(keys,help_array){
	var new_array=[];
	var col_val=document.getElementById("COLS").value.replace(" ","").split(";");

	if (col_val == "all"){
      return keys;
    }

	col_val.forEach(function(elem){
    if (elem.indexOf('-') > -1)
      {
        var range = elem.split("-")
        for(var i = +range[0]; i <= +range[1]; i++){
          if(1<=i&&i<=130){new_array.push(help_array[i]);}
        }
      }
    else {
      if(1<=elem&&elem<=130){new_array.push(help_array[elem]);}
    }
  })

	return new_array;
}

//creates a heatmap object
function heatmapChart() {
	returnDictionary = {};

	//heatmap initialisation function
	returnDictionary["init"] = function(data,metadata_labels){
		
			//getting taxas
			taxa = Object.keys(data[0]);
			taxa.shift();

			//memorizing taxa positions for filtering
			col_taxa={};
			taxa.forEach(function(taxa, i){
				col_taxa[taxa]=i+1;
			});

			pos_taxa={};
			taxa.forEach(function(taxa, i){
				i=i+1;
				pos_taxa[i]=taxa;
			});

			//constant initialisation
			width = 2000 - margin.left - margin.right;
			height = 13*data.length - margin.top - margin.bottom;
			gridSize = Math.floor(height / (data.length));
			colors = ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"]; //by colorbrewer: YlGnBu[6]

			//svg creation
			svg = d3.select("#chart").append("svg")
			  .attr("width", width)
			  .attr("height", height)
			  .append("g")
			  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//creating taxa labels
			var taxaLabels = svg.selectAll(".taxaLabels")
				  .data(taxa)
				  .enter().append("text")
				  	.attr("class","taxaLabels")
					.text(function(d,i) { return col_taxa[d]+": "+ d; })
					.attr("y", function(d, i) { return i * gridSize; })
					.attr("x", 0)
					.style("text-anchor", "start")
					.attr("transform", "translate(8, -8) rotate(-90)");

			//creating heatmap
			cards = svg.selectAll(".sample")
				.data(data);

			cards.append("title");

			//drawing sample labels
			cards.enter().append("text")
				.text(function (d) { return d[""]; })
				.attr("class", "samplesLabel")
				.attr("x", 0)
				.attr("y", function (d, i) { return i * gridSize; })
				.attr('pointer-events', 'all')
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
				.on("mouseover", function(d, i){
					//Update the tooltip position and value
					d3.select("#tooltip")
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY) - 60 + "px")
					.select("#value")
					.text(metadata_labels[i].SampleID+
						"; Age: "+metadata_labels[i].Age+
						"; Sex: "+metadata_labels[i].Sex+
						"; Nationality: "+metadata_labels[i].Nationality+
						"; BMI_group: "+metadata_labels[i].BMI_group);
					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);
				})
				.on("mouseout", function(){
					// hide tooltip
					d3.select("#tooltip").classed("hidden", true);
				})
				;

			//drawing heatmap rectangles
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
						//Update the tooltip position and value
						d3.select("#tooltip")
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY) - 40 + "px")
						.select("#value")
						.text("Sample: "+d[""]+"; Taxa: "+item + "; Abundance: "+ d[item]);
						//Show the tooltip
						d3.select("#tooltip").classed("hidden", false);

					})
					.on("mouseout", function(){
						d3.select(this).classed("cell-hover",false);
						d3.select("#tooltip").classed("hidden", true);
					});
			});

			plotLegend(svg, colors, height);
	}

	//update function when filter is selected
	returnDictionary['update']=function(filtered_data,filtered_meta_data){

			//new svg creation
			d3.select("svg").remove();
			svg = d3.select("#chart").append("svg")
			  .attr("width", width)
			  .attr("height", 13*filtered_data.length + margin.top)
			  .append("g")
			  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


			//removes heatmap
			d3.selectAll(".bordered").remove();
			d3.selectAll(".samplesLabel").remove();
			d3.selectAll(".taxaLabels").remove();

			//gets new taxas after filtering
			taxa = Object.keys(filtered_data[0]);
			taxa.shift();
			//is ordering Taxa through column filter
			taxa=orderTaxa(taxa, pos_taxa);

			//creates new taxa labels
			taxaLabels = svg.selectAll(".taxaLabels")
				  .data(taxa)
				  .enter().append("text")
				  	.attr("class","taxaLabels")
					.text(function(d) { return col_taxa[d]+": "+ d; })
					.attr("y", function(d, i) { return i * gridSize; })
					.attr("x", 0)
					.style("text-anchor", "start")
					.attr("transform", "translate(" + gridSize / 2 + ", -6) rotate(-90)");

			//creates new heatmap
			cards=svg.selectAll(".sample").data(filtered_data);

			cards.enter().append("text")
				.text(function (d) { return d[""]; })
				.attr("class", "samplesLabel")
				.attr("x", 0)
				.attr("y", function (d, i) { return i * gridSize; })
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
				.on("mouseover", function(d, i){
					//Update the tooltip position and value
					d3.select("#tooltip")
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY) - 60 + "px")
					.select("#value")
					.text(filtered_meta_data[i].SampleID+
						"; Age: "+filtered_meta_data[i].Age+
						"; Sex: "+filtered_meta_data[i].Sex+
						"; Nationality: "+filtered_meta_data[i].Nationality+
						"; BMI_group: "+filtered_meta_data[i].BMI_group);
					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);
				})
				.on("mouseout", function(){
					// hide tooltip
					d3.select("#tooltip").classed("hidden", true);
				})
				;

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
						//Update the tooltip position and value
						d3.select("#tooltip")
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY) - 40 + "px")
						.select("#value")
						.text("Sample: "+d[""]+"; Taxa: "+item + "; Abundance: "+ d[item]);
						//Show the tooltip
						d3.select("#tooltip").classed("hidden", false);

					})
					.on("mouseout", function(){
						d3.select(this).classed("cell-hover",false);
						d3.select("#tooltip").classed("hidden", true);
					});
			});

			plotLegend(svg, colors, height);
	};
    return returnDictionary;
};

//creates legend for the heatmap
function plotLegend(svg, colors, height){

	legendCells = Array.apply(null, {length: buckets}).map(Number.call, Number); // array from 0 to buckets

	var legend = svg.selectAll(".legend")
		.data(legendCells)
		.enter().append("g")
		.attr("class", "legend");

	var r = legend.append("rect")
		.attr("x", function(d, i) { return legendElementWidth * i; })
		.attr("y", -margin.top + (legendElementWidth)/3)
		.attr("width", legendElementWidth)
		.attr("height", legendElementHeights)
		.attr('pointer-events', 'all')
		.style("fill", function(d, i) { return colors[i]; });

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
