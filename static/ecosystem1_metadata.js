// Function to group entries of object as columns of a table
function groupByColumn(data) {
  keys = Object.keys(data[0]);
  let columns = {}

  for (i = 0; i < data.length; i++) {
    for (j in keys) {
      let key = keys[j]
      let value = data[i][key];

      // Initializing column object
      if (!columns[key]) {
        columns[key] = {
          name: key,
          values: [],
          types: []
        };
      }

      // Transforming to number
      if ($.isNumeric(value)) {
        value = parseFloat(value);
      }

      // Populating 'value' array
      columns[key].values.push(value);

      // Populating 'types' array
      type = typeof(value);
      if (!columns[key].types.includes(type)) {
        columns[key].types.push(type);
      }
    }
  }

  return columns;
}


// Function that counts different elements of an array
function counter(array) {
	let counts = {};
	array.forEach(element => {
		counts[element] = counts[element] ? counts[element] + 1 : 1;
	})

	return counts;
}


// Base implementation of a Chart
class Chart {

	constructor(width, height) {
		this.width = width ? width : 900;
		this.height = height ? height : 500;

		// Setting color encoding
		this.scaleColor = d3.scaleOrdinal(d3.schemeSet2);
	}

	set chartWidth(width) {
		this.width = width;
	}

	set chartHeight(height) {
		this.height = height;
	}

	set legend(show) {
		this.showLegend = show;
	}

	set selectionElement(selection) {
		this.selection = selection;

		// Get the data from selection
		this.data = selection.datum();
	}

	show() {
		this.svg = this.selection
			.append("svg")
			.attr("width", this.width)
			.attr("height", this.height);

		this.createGraphics();
	}
}


// Implementation of a Pie Chart
class PieChart extends Chart {

	createGraphics() {
		// Aggregate data elements
		let counts = counter(this.data);
		let categories = Object.keys(counts);
		let values = Object.values(counts);

		// Set radius for chart
		let radius = Math.min(this.width, this.height) / 2;

		// Build arcs
		let arcs = d3.pie()(values);

		// Build single arc
		let arc = d3.arc().innerRadius(0).outerRadius(radius);

		// Build arc label
		let r = radius * 0.8;
		let arcLabel = d3.arc().innerRadius(r).outerRadius(r);

		// Append at center of svg
		let g = this.svg.append("g")
			.attr(
				"transform",
				"translate(" + this.width / 2 + "," + this.height / 2 + ")"
			);

		// Create base path element
		g.selectAll("path")
			.data(arcs)
			.enter()
				.append("path")
				.attr("fill", (d, i) => this.scaleColor(i))
				.attr("stroke", "white")
				.attr("d", arc);

		// Set text element for labels
		let text = g.selectAll("text")
			.data(arcs)
			.enter()
				.append("text")
				.attr("class", "label")
				.attr(
					"transform",
					(d, i) => "translate(" + arcLabel.centroid(d) + ")"
				);

		// Label for the percentage
		let sum = d3.sum(values);
		text.append("tspan")
			.attr("x", "-1em")
			.attr("y", 0)
			.attr("class", "values")
			.text(d => (d.value / sum * 100).toFixed(2) + "%");

		// Label for the category
		text.append("tspan")
			.attr("x", "-1em")
			.attr("y", "1em")
			.text((d, i) => categories[i]);
	}
}
