/* Project ecosystem 1 by Daria Evseeva, Eduardo Vela, Nicolas Brich, Sarah Ertel, Constantin Holzapfel 21.1.19 */

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


// Update function
// This function will be redefined after window loading
let filterCharts = function() {}

// Filtering using chart elements
let performFilter = function() {
	let $this = $(this);
	let $parent = $this.closest(".pie");
	let new_value = $(this).data("value");

	// Update attribute
	let buttonID = null;
	if ($parent.hasClass("sex")) {
		buttonID = "#btn_sex";
	} else if ($parent.hasClass("bmi")) {
		buttonID = "#btn_bmi";
	}

	// Change displayed text
	$(buttonID).attr("value", new_value)
	$(buttonID).html(new_value + " <span class='caret'></span>");

	filterCharts();
}


// Base implementation of a Chart
class Chart {

	constructor(width, height) {
		this.width = width ? width : 900;
		this.height = height ? height : 500;

		// Setting color encoding
		this.colorMap = {
			Age: {
				1: "#ffffcc",
				2: "#c7e9b4",
				3: "#7fcdbb",
				4: "#41b6c4",
				5: "#1d91c0",
				6: "#225ea8",
				7: "#0c2c84",
				NA: "#aaa"
			},
			Sex: {
				female: "#ef8a62",
				male: "#67a9cf",
				NA: "#aaa"
			},
			Nationality: {
				CentralEurope: "#8dd3c7",
				Scandinavia: "#ffffb3",
				SouthEurope: "#bebada",
				UKIE: "#fb8072",
				US: "#80b1d3",
				EasternEurope: "#fdb462",
				NA: "#aaa"
			},
			BMI_group: {
				underweight: "#ffffcc",
				lean: "#c7e9b4",
				overweight: "#7fcdbb",
				obese: "#41b6c4",
				severeobese: "#2c7fb8",
				morbidobese: "#253494",
				NA: "#aaa"
			}
		}

		// In case internal margin is needed
		this.margin = {top: 0, right: 0, bottom: 0, left: 0};
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

	set colorFor(key) {
		this.scaleColor = this.colorMap[key];
	}

	createLayout() {
		// Create SVG element as container
		this.svg = this.selection
			.append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom)
			.append("g")
				.attr(
					"transform",
					"translate(" + this.margin.left + "," + this.margin.top + ")"
				);

		// Create tooltip element
		this.tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.text("");
	}

	show() {
		this.width -= (this.margin.left + this.margin.right),
		this.height -= (this.margin.top + this.margin.bottom);

		this.createLayout();
		this.createGraphics();
	}

	update(filtered_data) {
		this.data = filtered_data;
		this.createGraphics();
	}
}


// Implementation of a Pie Chart
class PieChart extends Chart {

	constructor(width, height) {
		super(width, height);

		this.radius = Math.min(this.width, this.height) / 2 - 50;
		this.labelRadius = this.radius * 0.8;
	}

	// Different separations if labels are on one
	// of the two sides of a pie chart
	labelXSeparation(element) {
		return (element.startAngle > Math.PI ? -1 : -2.5) + "em";
	}

	// Only append label if there's enough space
	showLabel(element, angle) {
		return element.endAngle - element.startAngle > angle;
	}

	drawArc(angle, self) {
		let inter = d3.interpolate(this._newAngle, angle);
		this._newAngle = inter(0);

		return (t) => self.arc(inter(t));
	}

	createLayout() {
		super.createLayout();

		this.circle = this.svg.append("g")
			.attr(
				"transform",
				"translate(" + this.width / 2 + "," + this.height / 2 + ")"
			);

		// Build arcs
		this.pie = d3.pie().value((d) => d);

		this.arc = d3.arc().innerRadius(0).outerRadius(this.radius);

		// Build arc label
		this.arcLabel = d3.arc()
		.innerRadius(this.labelRadius)
		.outerRadius(this.labelRadius);
	}

	createGraphics() {
		let _this = this;

		// Aggregate data elements
		let counts = counter(this.data);
		this.categories = Object.keys(counts)
			.sort((a, b) => counts[b] - counts[a]);
		this.values = Object.values(counts).sort((a, b) => b - a);

		// Remove unused paths
		this.circle.datum(this.values)
			.selectAll("path")
			.data(this.pie)
			.exit().remove();

		// Add new arcs
		this.circle.datum(this.values)
			.selectAll("path")
			.data(this.pie)
			.enter()
			.append("path")
			.attr("d", this.arc)
			.each((d) => this._newAngle = d)
			.on("mouseover", (d, i) => {
				this.tooltip.html(
					"<p><span id='value'>" +
					_this.categories[i] + ": #" + d.data + " entries" +
					"</p>"
				);
				this.tooltip.classed("visible", true);
			})
			.on("mousemove", () => {
				this.tooltip
					.style("top", (d3.event.pageY + 15) + "px")
					.style("left", (d3.event.pageX + 15) + "px");
			})
			.on("mouseout", (d) => {
				this.tooltip.classed("visible", false);
			})
			.on("click", performFilter);

		// Update existing arcs
		this.circle.datum(this.values)
			.selectAll("path")
			.data(this.pie)
			.transition()
			.duration(950)
			.attr("fill", (d, i) => _this.scaleColor[_this.categories[i]])
			.attr("data-value", (d, i) => _this.categories[i])
			.attrTween("d", (d) => {
				let interpolate = d3.interpolate(this._newAngle, d);
				this._newAngle = interpolate(0);
				return (t) => {
					return _this.arc(interpolate(t));
				};
			});

		// Remove any exisintg labels
		this.circle.selectAll("text.label").remove();

		// Set text element for labels
		this.circle.datum(this.values)
		.selectAll("text")
		.data(this.pie)
		.enter()
			.append("text")
			.attr("class", "label")
			.attr(
				"transform",
				(d) => "translate(" + _this.arcLabel.centroid(d) + ")"
			);

		// Label for the percentage
		let sum = d3.sum(this.values);
		this.circle.datum(this.values)
			.selectAll("text")
			.data(this.pie)
			.filter(d => this.showLabel(d, 0.15))
			.append("tspan")
			.attr("x", this.labelXSeparation)
			.attr("y", 0)
			.attr("class", "values")
			.text(d => (d.value / sum * 100).toFixed(2) + "%");

		// Label for the category
		this.circle.datum(this.values)
			.selectAll("text")
			.data(this.pie)
			.filter(d => this.showLabel(d, 0.25))
			.append("tspan")
			.attr("x", this.labelXSeparation)
			.attr("y", "1em")
			.text((d, i) => _this.categories[i]);
	}
}


// Implementation of a Bar Chart
class BarChart extends Chart {

	constructor(width, height) {
		super(width, height);

		this.axisSeparation = 10;
		this.mustRotateLabels = false;

		// Allow internal margin for axis and labels
		this.margin = {top: 10, right: 20, bottom: 85, left: 60};
	}

	set xAxisLabel(label) {
		this.xLabel = label;
	}

	set yAxisLabel(label) {
		this.yLabel = label;
	}

	set sortData(sort) {
		this.mustSort = sort;
	}

	set rotateLabels(rotate) {
		this.mustRotateLabels = rotate;
	}

	createLayout() {
		super.createLayout();

		this.createAxes();
		this.appendAxes();
		this.createAxisLabels();
	}

	calculateCounts() {
		// Get sorted counts
		let counts = counter(this.data);
		let entries = Object.entries(counts);

		if (this.mustSort) {
			entries = entries.sort((a, b) => b[1] - a[1]);
		}

		let keys = [];
		let values = [];
		entries.forEach(element => {
			keys.push(element[0]);
			values.push(element[1]);
		});

		this.xLabels = keys;
		this.data = values;
	}

	calculateAxisBoundaries() {
		// Get max of X and Y axes
		this.maxX = this.data.length;
		this.maxY = d3.max(this.data);
	}

	scaleBarHeight(value) {
		return value / this.maxY * this.height;
	}

	createGraphics() {
		let _this = this;

		// Update axes ranges
		this.calculateCounts();
		this.calculateAxisBoundaries();

		// Set scales' domains
		this.xScale.domain(this.xLabels);
		this.yScale.domain([0, this.maxY]);
		this.xAxis.tickValues(this.getLabelsToDisplay());

		// Update axes DOM elements
		this.svg.select(".x-axis")
			.transition()
			.duration(300)
			.call(this.xAxis);

		// Rotate labels after drawing them
		if (this.mustRotateLabels) {
			this.x.selectAll("text")
				.attr("dx", "-0.8em")
				.attr("dy", "0.15em")
				.attr("class", "rotate");
		}

		this.svg.select(".y-axis")
			.transition()
			.duration(300)
			.call(this.yAxis);

		let drawBars = function(selection) {
			selection
			.attr("width", _this.xScale.bandwidth())
			.attr("height", function(d, i) { return _this.scaleBarHeight(d); })
			.attr("y", function(d) { return _this.height - _this.scaleBarHeight(d); })
			.attr("x", function(d, i) { return _this.xScale(_this.xLabels[i]); })
			.attr("fill", (d, i) => {
				let value = _this.xLabels[i];

				if ($.isNumeric(value)) {
					value = Math.floor(value / 10);
				}

				return _this.scaleColor[value]
			});
		};

		// Construct bars
		let bars = this.svg.selectAll("rect")
			.data(this.data, function(d, i) { return i; });

		// Remove unused bars
		bars.exit()
			.transition()
			.duration(1000)
			.attr("height", function(d) { return _this.scaleBarHeight(0); })
			.attr("y", function(d) { return _this.height - _this.scaleBarHeight(0); })
			.remove();

		// Add new bars
		bars.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("height", _this.scaleBarHeight(0))
			.attr("y", _this.height)
			.on("mouseover", (d, i) => {
				_this.tooltip.html(
					"<p><span id='value'>" +
					_this.xLabels[i] + ": #" + _this.data[i] + " entries" +
					"</p>"
				);
				_this.tooltip.classed("visible", true);
			})
			.on("mousemove", () => {
				_this.tooltip
					.style("top", (d3.event.pageY + 15) + "px")
					.style("left", (d3.event.pageX + 15) + "px");
			})
			.on("mouseout", (d) => {
				_this.tooltip.classed("visible", false);
			})
			.call(drawBars);

		// Update new bar position
		bars.transition()
			.duration(1000)
			.call(drawBars);
	}

	getLabelsToDisplay() {
		let values = [];

		this.xLabels.forEach((element) => {
			// If label is a number, don't show all of them
			let add_value = (
				this.xLabels.length <= 13 ||
				!$.isNumeric(element) ||
				($.isNumeric(element) && parseFloat(element) % 5 === 0)
			);

			if (add_value)
				values.push(element);
		});

		return values;
	}

	createAxes() {
		// Create X scale
		this.xScale = d3.scaleBand()
			.range([0, this.width])
			.paddingInner(0.05);

		// Set up X axis
		this.xAxis = d3.axisBottom(this.xScale);

		// Create Y scale
		this.yScale = d3.scaleLinear()
			.range([this.height, 0]);

		// Set up Y axis
		this.yAxis = d3.axisLeft(this.yScale).ticks(3);
	}

	appendAxes() {
		// Append X axis
		this.x = this.svg.append("g")
			.attr("class", "x-axis")
			.attr("transform", "translate(0, " + (this.height + this.axisSeparation) + ")")
			.call(this.xAxis)

		// Append Y axis
		this.svg.append("g")
			.attr("class", "y-axis")
			.attr("transform", "translate(-" + this.axisSeparation + ", 0)")
			.call(this.yAxis);
	}

	createAxisLabels() {
		// Adding X axis label
		this.svg.append("text")
			.attr("class", "label x-axis")
			.attr("x", this.width / 2 - 20)  // At the middle of the X axis
			.attr("y", this.height + (this.mustRotateLabels ? 80 : 50))  // Make sure it's under the axis
			.text(this.xLabel);

		// Adding Y axis label
		this.svg.append("text")
			.attr("class", "label y-axis")
			.attr("x", -20)
			.attr("y", this.height / 2 - 5)
			.text(this.yLabel);
	}
}
