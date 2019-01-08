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
	}

	show() {
		this.svg = this.selection
			.append("svg")
			.attr("width", this.width)
			.attr("height", this.height);

		this.createGraphics();
	}
}

class PieChart extends Chart {

	set setCategories(elements) {
		this.categories = elements;
	}

	set setValues(elements) {
		this.values = elements;
	}

	createGraphics() {
		let _this = this;

		let radius = Math.min(this.width, this.height) / 2;

		// Build arcs
		let arcs = d3.pie()(this.values);

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
				.attr("transform", (d, i) => "translate(" + arcLabel.centroid(d) + ")");

		// Label for the percentage
		let sum = d3.sum(this.values);
		text.append("tspan")
			.attr("x", "-1em")
			.attr("y", 0)
			.style("font-weight", "bold")
			.text(d => (d.value / sum * 100).toFixed(2) + "%");

		// Label for the category
		text.append("tspan")
			.attr("x", "-1em")
			.attr("y", "1em")
			.text((d, i) => _this.categories[i]);
	}
}
