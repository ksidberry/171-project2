width = 1200;
height = 500;

window.onload = function() {	
	// activate tooltips
	$('.tool-info').tooltip();
	buildChoropleth();
	buildSymbol();
	buildScatter();
	buildMetrics();
	buildCloud();
}

function buildChoropleth() {

	/*var svg = d3.select("#choroplethContainer")
	  .append("svg:svg")
		//.call(d3.behavior.zoom()
		//.on("zoom", redraw))
	  .append("svg:g");

	var counties = svg.append("svg:g")
		.attr("id", "choropleth-counties");

	var path = d3.geo.path();

	var fill = d3.scale.log()
		.domain([10, 500])
		.range(["purple", "steelblue"]);

	d3.json("data/counties.json", function(json) {
	  counties.selectAll("path")
		  .data(json.features)
		.enter().append("svg:path")
		  .attr("d", path)
		  .attr("fill", function(d) { return fill(path.area(d)); });
	});*/

/*function redraw() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}*/
}

function buildSymbol () {
	// The radius scale for the centroids.
	var r = d3.scale.sqrt()
    	.domain([0, 1e6])
    	.range([0, 10]);

	// Our projection.
	var xy = d3.geo.albersUsa();

	var svg = d3.select("#symbolContainer")
		.append("svg:svg")
		.attr("width", width)
		.attr("height", height);
	
	svg.append("svg:g").attr("id", "states");
	svg.append("svg:g").attr("id", "state-centroids");

	d3.json("data/map.json", function(collection) {
		svg.select("#states")
    		.selectAll("path")
      			.data(collection.features)
   		.enter().append("svg:path")
      		.attr("d", d3.geo.path().projection(xy));
	});

	d3.json("data/centroid.json", function(collection) {
  		svg.select("#state-centroids")
    		.selectAll("circle")
      			.data(collection.features
      			.sort(function(a, b) { return b.properties.population - a.properties.population; }))
    		.enter().append("svg:circle")
      			.attr("transform", function(d) { return "translate(" + xy(d.geometry.coordinates) + ")"; })
      			.attr("r", 0)
    	.transition()
      		.duration(1000)
      		.delay(function(d, i) { return i * 50; })
      		.attr("r", function(d) { return r(d.properties.population); });
	});
	
}

function buildScatter() {
	var svg = d3.select("#scatterContainer").append("svg:svg")
		.attr("width", width)
		.attr("height", height);

	var circle = svg.selectAll("circle")
		.data(d3.range(1000).map(function() {
		return {
			x: width * Math.random(),
			y: height * Math.random(),
			dx: Math.random() - .5,
			dy: Math.random() - .5
			};
		}))
		.enter().append("svg:circle")
		.attr("r", 2.5);

	var text = svg.append("svg:text")
		.attr("x", 20)
		.attr("y", 20);

	var start = Date.now(),
		frames = 0;

	d3.timer(function() {

	// Update the FPS meter.
	var now = Date.now(), duration = now - start;
	text.text(~~(++frames * 1000 / duration));
	if (duration >= 1000) frames = 0, start = now;

	// Update the circle positions.
	circle
		.attr("cx", function(d) { d.x += d.dx; if (d.x > width) d.x -= width; else if (d.x < 0) d.x += width; return d.x; })
		.attr("cy", function(d) { d.y += d.dy; if (d.y > height) d.y -= height; else if (d.y < 0) d.y += height; return d.y; });
	});

}

function buildCloud() {
	var fill = d3.scale.category20();

  d3.layout.cloud().size([width, height])
      .words([
        "Hello", "world", "normally", "you", "want", "more", "words",
        "than", "this"].map(function(d) {
        return {text: d, size: 10 + Math.random() * 90};
      }))
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

  function draw(words) {
    d3.select("#cloudContainer").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }

}

function buildMetrics() {
	addBarChart();
	addMapChart();
	addDonut("#sunny-donut");
	addDonut("#foggy-donut");
	addDonut("#rainy-donut");
	addDonut("#snowy-donut");
	addDonut("#windy-donut");
	addDonut("#unknown-donut");
}

function addBarChart(){
	// build sentiment bar chart
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    	w = width - margin.left - margin.right,
    	h = height - margin.top - margin.bottom

	var formatPercent = d3.format(".0%");

	var x = d3.scale.ordinal()
    	.rangeRoundBands([0, w], .1);

	var y = d3.scale.linear()
		.range([h, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(formatPercent);

	var svg = d3.select("#sentiment-container").append("svg")
		.attr("width", w + margin.left + margin.right)
		.attr("height", h + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.tsv("data/bar_sample.csv", function(error, data) {
		data.forEach(function(d) {
    	d.frequency = +d.frequency;
  	});

  	x.domain(data.map(function(d) { return d.letter; }));
  	y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  	svg.append("g")
    	.attr("class", "x axis")
    	.attr("transform", "translate(0," + h + ")")
      	.call(xAxis);

	svg.append("g")
    	.attr("class", "y axis")
      	.call(yAxis)
	.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Frequency");

	svg.selectAll(".bar")
		.data(data)
	.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.letter); })
		.attr("width", x.rangeBand())
		.attr("y", function(d) { return y(d.frequency); })
		.attr("height", function(d) { return h - y(d.frequency); });

	});
}

function addMapChart(){	
	// build location map chart
	var centered;

	var path = d3.geo.path();
	
	var svg = d3.select("#location-container").append("svg")
		.attr("width", width)
		.attr("height", height);

	svg.append("rect")
		.attr("class", "mapBackground")
		.attr("width", width)
		.attr("height", height)
		.on("click", click);

	var g = svg.append("g")
		.attr("id", "states");

	d3.json("data/map.json", function(json) {
		g.selectAll("path")
			.data(json.features)
		.enter().append("path")
			.attr("d", path)
			.on("click", click);
	});

	function click(d) {
		var x, y, k;

		if (d && centered !== d) {
			var centroid = path.centroid(d);
			x = centroid[0];
			y = centroid[1];
			k = 4;
			centered = d;
		} else {
			x = width / 2;
			y = height / 2;
			k = 1;
			centered = null;
		}

		g.selectAll("path")
			.classed("active", centered && function(d) { return d === centered; });

		g.transition()
			.duration(1000)
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
			.style("stroke-width", 1.5 / k + "px");
	}
	
}

function addDonut(id) {
	var width = 200,
		height = 200,
		radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 30);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.population; });

	var svg = d3.select(id).append("svg")
		.attr("width", width)
		.attr("height", height)
	.append("g")
    	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	d3.csv("data/donut_sample.csv", function(error, data) {

		data.forEach(function(d) {
			d.population = +d.population;
		});

		var g = svg.selectAll(".arc")
			.data(pie(data))
		.enter().append("g")
			.attr("class", "arc");

		g.append("path")
			.attr("d", arc)
			.style("fill", function(d) { return color(d.data.age); });

		/*g.append("text")
			.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) { return d.data.age; });*/
	});
}