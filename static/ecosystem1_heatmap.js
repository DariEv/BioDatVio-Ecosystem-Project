//constants
var cards=NaN;
var taxa=NaN;
var margin=NaN;
var width=NaN;
var height=NaN;
var gridSize=NaN;
var legendElementWidth=NaN;
var colors=NaN;

function heatmapChart() {
	returnDictionary = {};
	returnDictionary["init"] = function(data){
			taxa = Object.keys(data[0]); 
			taxa.shift();
			console.log(data[0]);
			console.log(taxa);
			console.log("length", taxa.length);
			
			var samples = new Array(data.length); // create an empty array
			for(var i = 0; i < samples.length; i++){
				samples[i] = + i;
			}
			console.log(samples);
			var max_of_array = Math.max.apply(Math, data);
			console.log('max', max_of_array);
			
			//Here were the constants
			margin = { top: 250, right: 0, bottom: 100, left: 50 },
			width = 2000 - margin.left - margin.right,
			height = 13*samples.length - margin.top - margin.bottom,
			gridSize = Math.floor(height / (samples.length)),
			legendElementWidth = gridSize*2,
			buckets = 9,
			colors = ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"]; //by colorbrewer: YlGnBu[6]

			var svg = d3.select("#chart").append("svg")
			  .attr("width", width + margin.left + margin.right)
			  .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");			  			  
			  
			var samplesLabel = svg.selectAll(".samplesLabel")
			  .data(samples)
			  .enter().append("text")
				.text(function (d) { return d; })
				.attr("x", 0)
				.attr("y", function (d, i) { return i * gridSize; })
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + gridSize / 1.5 + ")");

			var taxaLabels = svg.selectAll(".taxaLabels")
				  .data(taxa)
				  .enter().append("text")			
					.text(function(d) { return d; })					
					.attr("y", function(d, i) { return i * gridSize; })
					.attr("x", 0)
					.style("text-anchor", "start")
					.attr("transform", "translate(" + gridSize / 2 + ", -6) rotate(-90)");
					
			/*var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);
			*/

			cards = svg.selectAll(".sample")
				.data(data);//, function(d) {return d.taxa[i]+':'+d.samples[i];});

			cards.append("title");
			
			taxa.forEach(function(item, taxon) {
				cards.enter().append("rect")
				  //.attr("x", function(d, i) { return (i) * gridSize; })
				  //.attr("y", function(d, i) { return (taxon) * gridSize; })
				  .attr("x", function(d, i) { return (taxon) * gridSize; })
				  .attr("y", function(d, i) { return (i) * gridSize; })
				  .attr("class", "hour bordered")
				  .attr("width", gridSize)
				  .attr("height", gridSize)
				  .style("fill", function(d) {c = Math.floor(Math.log10(Number(d[item]))); 		
												return colors[c];});
			});
			
	}

	returnDictionary['update']=function(filtered_data){
			cards.data(filtered_data);//, function(d) {return d.taxa[i]+':'+d.samples[i];});

			cards.append("title");
			
			taxa.forEach(function(item, taxon) {
				cards.enter().append("rect")
				  //.attr("x", function(d, i) { return (i) * gridSize; })
				  //.attr("y", function(d, i) { return (taxon) * gridSize; })
				  .attr("x", function(d, i) { return (taxon) * gridSize; })
				  .attr("y", function(d, i) { return (i) * gridSize; })
				  .attr("class", "hour bordered")
				  .attr("width", gridSize)
				  .attr("height", gridSize)
				  .style("fill", function(d) {c = Math.floor(Math.log10(Number(d[item]))); 		
												return colors[c];});
			});
	};
    return returnDictionary;  
};