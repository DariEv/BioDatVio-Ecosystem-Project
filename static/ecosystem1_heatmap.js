function heatmapChart() {
	returnDictionary = {};
	returnDictionary["init"] = function(data){
		var taxa = Object.keys(data[0]); 
			taxa.shift();
			console.log(data[0]);
			console.log(taxa);
			console.log("length", taxa.length);
			
			var samples = new Array(data.length); // create an empty array with length 45
			for(var i = 0; i < samples.length; i++){
				samples[i] = + i;
			}
			console.log(samples);
			var max_of_array = Math.max.apply(Math, data);
			console.log('max', max_of_array);
			
			
			var margin = { top: 50, right: 0, bottom: 100, left: 300 },
			width = 10000 - margin.left - margin.right,
			height = 2000 - margin.top - margin.bottom,
			gridSize = Math.floor(width / (samples.length)),
			legendElementWidth = gridSize*2,
			buckets = 9,
			colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"] // alternatively colorbrewer.YlGnBu[9]

			var svg = d3.select("#chart").append("svg")
			  .attr("width", width + margin.left + margin.right)
			  .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			  
			  
			  
			var taxaLabel = svg.selectAll(".taxaLabel")
			  .data(taxa)
			  .enter().append("text")
				.text(function (d) { return d; })
				.attr("x", 0)
				.attr("y", function (d, i) { return i * gridSize; })
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
				//.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "taxaLabel mono axis axis-workweek" : "taxaLabel mono axis"); });

			var sampleLabels = svg.selectAll(".sampleLabels")
				  .data(samples)
				  .enter().append("text")
					.text(function(d) { return d; })
					.attr("x", function(d, i) { return i * gridSize; })
					.attr("y", 0)
					.style("text-anchor", "middle")
					.attr("transform", "translate(" + gridSize / 2 + ", -6)")
					//.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "sampleLabels mono axis axis-worktime" : "sampleLabels mono axis"); });
					
			/*var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);
			*/

          var cards = svg.selectAll(".sample")
              .data(data);//, function(d) {console.log('fff', d); return d.taxa[i]+':'+d.samples[i];});

          cards.append("title");
			
			taxa.forEach(function(item, taxon) {
			//console.log("n", Math.floor(Math.log10(Number(data[0][item]))))
				cards.enter().append("rect")
				  .attr("x", function(d, i) { return (i) * gridSize; })
				  .attr("y", function(d, i) { return (taxon) * gridSize; })
				  //.attr("rx", 4)
				  //.attr("ry", 4)
				  .attr("class", "hour bordered")
				  .attr("width", gridSize)
				  .attr("height", gridSize)
				  .style("fill", function(d) {c = Math.floor(Math.log10(Number(d[item]))); 		
												return colors[c];});
			});
		}

	returnDictionary['update']=function(){}

        	return returnDictionary;  
        };