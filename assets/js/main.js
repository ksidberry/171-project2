width = 1200;
height = 500;

window.onload = function() {	
	// activate tooltips
	$('.tool-info').tooltip();
	//buildChoropleth();
	buildSymbol();
	buildScatter();
	buildMetrics();
	//buildCloud();
}

function buildChoropleth() {
$.getJSON('data/tweets_with_temperature/TuesdayData.json', function(data) {

console.log("hi");
var map = new Map({
      scope: 'usa',
      el: $('#choroplethContainer'),
      geography_config: { 
        highlightBorderColor: 'steelblue',
        highlightOnHover: true,
        popupTemplate: _.template('<div class="hoverinfo"><strong><%= geography.properties.name %></strong> <% if (data.electoralVotes) { %><hr/>  Electoral Votes: <%= data.electoralVotes %> <% } %></div>')
      },
      
      fills: {
        'tier1': '#CC4731',
        'tier2': '#306596',
        'tier3': '#667FAF',
        'tier4': '#A9C0DE',
        defaultFill: '#999999'
      },
      data: {
		"AZ": {
            "fillKey": "REP",
            "electoralVotes": 5
        },
        "AZ": {
            "fillKey": "DEM",
            "electoralVotes": 10
        }
      }
    });

   map.render();

});
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
	//addBarChart();
	//addMapChart();
	
	// process data
	var data = new Array,
	// fog, snow, rain, wind, sun
	var count = [0, 0, 0, 0, 0];	
	
	var sequence = {
		"fog": {
			"color": "#999999",
			"id" = "#foggy-donut",
		},
		"snow": {
			"color": "#999999",
			"id" = "#snowy-donut",
		},
		"rain": {
			"color": "#999999",
			"id" = "#rainy-donut",
		},
		"wind": {
			"color": "#999999",
			"id" = "#windy-donut",
		},
		"sun": {
			"color": "#999999",
			"id" = "#sunny-donut",
		}
	}
		
	$.getJSON("data/.json", function(data) {
		$.each(data, function(key, val){
			if (){
				count[0] = count[0] + 1;
			}
			else if (){
				count[1] = count[1] + 1;
			}
			else if (){
				count[2] = count[2] + 1;
			}
			else if (){
				count[3] = count[3] + 1;
			}
			else {
				count[4] = count[4] + 1;
			}
		});
	});
	var total = count[0] + count[1] + count[2] + count[3] + count[4];
	
	var i = 0;
	for (var key in sequence){
		var weather = new pieObject(key, count[i]);
		var everyone = new pieOjbect("everyone", total - count[i]);
		data.push(weather);
		data.push(everyone)
		addDonut(data, sequence[key].color, sequence[key].id);
		i = i + 1;
	}
	
	/*addDonut("#sunny-donut");
	addDonut("#foggy-donut");
	addDonut("#rainy-donut");
	addDonut("#snowy-donut");
	addDonut("#windy-donut");*/
	//addDonut("#unknown-donut");
}

function addBarChart(){
	/*var data = [],
		tier1 = 0,
		tier2 = 0
		tier3 = 0
		tier4 = 0; 
	
	$.getJSON("data/centroid.json", function(data) {
		$.each(data, function(key, val){
			
		});
	});*/
	
	// build sentiment bar chart
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    	w = width - margin.left - margin.right,
    	h = height - margin.top - margin.bottom

	//var formatPercent = d3.format(".0%");

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
		//.tickFormat(formatPercent);

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
	// handle data
	
	// build location map chart
	$("#location-container").datamap({
        scope: 'usa',
        bubbles: tweets.toJSON(),
        bubble_config: {
            popupTemplate: _.template([
                '<div class="hoverinfo"><strong><%= data.screenName %></strong>',
                '<br/>Text: <%= data.text %>',
                '<br/>City: <%= data.city %>',
                '<br/>Temperature: <%= data.temp %>',
                '</div>'].join(''))
        },
        geography_config: {
            popupOnHover: false,
            highlightOnHover: false
        },
        fills: {
            'USA': '#1f77b4',
            'RUS': '#9467bd',
            'PRK': '#ff7f0e',
            'PRC': '#2ca02c',
            'IND': '#e377c2',
            'GBR': '#8c564b',
            'FRA': '#d62728',
            'PAK': '#7f7f7f',
            defaultFill: '#999999'
        },
        data: {
            /*'RUS': {fillKey: 'RUS'},
            'PRK': {fillKey: 'PRK'},
            'CHN': {fillKey: 'PRC'},
            'IND': {fillKey: 'IND'},
            'GBR': {fillKey: 'GBR'},
            'FRA': {fillKey: 'FRA'},
            'PAK': {fillKey: 'PAK'},*/
            'USA': {fillKey: 'USA'}
        }
    });
	
	
	
	/*var centered;

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
	}*/
	
}

function addDonut(data, color, id) {
	var width = 200,
		height = 200,
		radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
		.range([color, "#000000"]);

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 30);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.count; });

	var svg = d3.select(id).append("svg")
		.attr("width", width)
		.attr("height", height)
	.append("g")
    	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	d3.csv(data, function(error, data) {
		data.forEach(function(d) {
			d.count = +d.count;
		});

		var g = svg.selectAll(".arc")
			.data(pie(data))
		.enter().append("g")
			.attr("class", "arc");

		g.append("path")
			.attr("d", arc)
			.style("fill", function(d) { return color(d.data.weather); });

		/*g.append("text")
			.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) { return d.data.weather; });*/
	});
}

function pieObject (prop1, prop2){
	this.weather = prop1;
	this.count = prop2;
}