width = 1200;
height = 500;
var counter = 0;
var temps = [];

window.onload = function() {	
	// activate tooltips
	$('.tool-info').tooltip();
	buildChoropleth();
	//buildSymbol();
	buildScatter();
	buildMetrics();
	//buildCloud();
}

function getTweets() {
    var tweet;
    var tweetwords = [];
    $.ajax({
      url: "data/final/WednesdayData.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        var arraylength = data.length;
        for (var i = 0; i < 25; i++) {
           var randomnumber=Math.floor(Math.random()*(arraylength + 1)); 
           //console.log(randomnumber);
           //console.log(data);
            var text = data[randomnumber]["twitter.text"];
            //console.log(text);
            var n=text.split(" ");
            //console.log(n);
            //console.log(tweetwords.length);
            tweetwords = tweetwords.concat(n);

        }
        //console.log(tweetwords);
        //tweetwords = ['hi'];
        //console.log(data);
        // data is a JavaScript object now. Handle it as such
        //console.log("hi");
        //console.log(tweetwords);
        return tweetwords;

      }
    });
    return tweetwords;
}

function getAllTweets() {
    var tweet;
    var tweetwords = [];
    $.ajax({
      url: "data/final/TuesdayDataSmall.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        var arraylength = data.length;
        for (var i = 0; i < 25; i++) {
           var randomnumber=Math.floor(Math.random()*(arraylength + 1)); 
           //console.log(randomnumber);
           //console.log(data);
            var text = data[i]["TuesdayTemp"];
            //console.log(text);
            //var n=text.split(" ");
            //console.log(n);
            //console.log(tweetwords.length);
            tweetwords = tweetwords.concat(text);

        }
        //console.log(tweetwords);
        //tweetwords = ['hi'];
        //console.log(data);
        // data is a JavaScript object now. Handle it as such
        //console.log(tweetwords);
        return tweetwords;

      }
    });
    return tweetwords;
}

function buildChoropleth() {
$.getJSON('data/tweets_with_temperature/TuesdayData.json', function(data) {

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
	var tweets = getAllTweets();
    $.ajax({
      url: "data/final/TuesdayDataTiny.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        //console.log(data.length);
        var arraylength = data.length;
        for (var i = 0; i < 140; i++) {
           //var randomnumber=Math.floor(Math.random()*(arraylength + 1)); 
           
            //console.log(randomnumber);
           //console.log(data);
            //var text = data[randomnumber]["twitter.text"];
            //console.log(text);
            //var n=text.split(" ");
            //console.log(n);
            //console.log(tweetwords.length);
            //console.log(i);
            temps = temps.concat(data[i]["TuesdayTemp"]);

        }
        //console.log(tweetwords);
        //tweetwords = ['hi'];
        //console.log(data);
        // data is a JavaScript object now. Handle it as such
        //console.log(tweetwords);
        //return tweetwords;

      }
    });


    var svg = d3.select("#scatterContainer").append("svg:svg")
		.attr("width", width)
		.attr("height", height);

    function color() {
      if (counter > 140) {
        counter = 0;
      }
      if (temps[counter] < 30) {
        counter = counter + 1;
        return "steelblue";
      }
      else {
        counter = counter + 1;
        return "yellow";
      }
      /*
        if (counter % 7 == 0) {
            counter = counter + 1;
            return "steelblue";
        }
        else {
            counter = counter + 1;
            return "yellow";
        }*/
    }
    if (tweets[counter] < 50) {
       // console.log("test");
    	var circle = svg.selectAll("circle")
    		.data(d3.range(1000).map(function() {
    		return {
    			x: width * Math.random(),
    			y: height * Math.random(),
    			dx: Math.random() - .5,
    			dy: Math.random() - .5,
                fill: color()
    			};
    		}))
    		.enter().append("svg:circle")
    		.attr("r", 2.5)
    }

    else {
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
            .attr("r", 2.5)
            .style("fill", color());


    }
	var text = svg.append("svg:text")
		.attr("x", 20)
		.attr("y", 20);

	var start = Date.now(),
		frames = 0;

    circle
        .style("fill", function(d) { return color(); });
    ;

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
  d3.layout.cloud().size([width*2, height*2])
      .words(getTweets().map(function(d) {
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
	addMapChart();
	
	// fog, snow, rain, wind, sun, unknown
	var count = [0, 0, 0, 0, 0, 0];	
	
	var sequence = {
		"fog": {
			"color": "#999999",
			"id": "#foggy-donut",
		},
		"snow": {
			"color": "#999999",
			"id": "#snowy-donut",
		},
		"rain": {
			"color": "#999999",
			"id": "#rainy-donut",
		},
		"wind": {
			"color": "#999999",
			"id": "#windy-donut",
		},
		"sun": {
			"color": "#999999",
			"id": "#sunny-donut",
		},
		"unknown": {
			"color": "#999999",
			"id": "#unknown-donut"
		}
	}
		
	$.getJSON("data/final/TuesdayDataTiny.json", function(data) {
		$.each(data, function(key, val){
			//console.log(data[key]["TuesdayConditions"]);
			var k = data[key]["TuesdayConditions"];
			var m = data[key]["TuesdayWind"];
			if (k == 100000 || k == 110000 || k == 100010 || k == 101000){
				count[0] = count[0] + 1;
			}
			else if (k == 1000){
				count[1] = count[1] + 1;
			}
			else if (k == 10000 || k == 11000 || k == 10010){
				count[2] = count[2] + 1;
			}
			else if (m > 20){
				count[3] = count[3] + 1;
			}
			else if (k == 0){
				count[4] = count[4] + 1;
			}
			else {
				count[5] =  count[5] + 1;
			}
		});
		var total = count[0] + count[1] + count[2] + count[3] + count[4] + count[5];
		var i = 0;
		for (var key in sequence){
			var data = [];
			var num = (count[i] / total) * 100;
			var percent = num.toFixed(2);
			var weather = new pieObject(key, count[i], percent.toString() + " %");
			var everyone = new pieObject("everyone", total - count[i], "");
			data.push(weather);
			data.push(everyone)
			addDonut(data, sequence[key]["color"], sequence[key]["id"]);
			i = i + 1;
		}
	});

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
	var tweets = [];
	 $.ajax({
      url: "data/final/TuesdayDataTiny.json",
      dataType: 'json',
      async: false,
      success: function(data) {
    	for (var i = 0; i < data.length; i++) {
    		var longi = data[i]["interaction.geo.longitude"];
    		var lat = data[i]["interaction.geo.latitude"];
    		var radius = data[i]["klout.score"];
    		var screenName = data[i]["twitter.user.screen_name"];
    		var text = data[i]["interaction.content"];
    		var location = data[i]["twitter.place.full_name"];
    		var temp = data[i]["TuesdayTemp"];
    		var fillKey = "USA";
    		//"salience.content.sentiment"
    		
    		var n = new mapObject(longi, lat, radius, screenName, text, location, temp, fillKey)
    		tweets = tweets.concat(n);
    	}	

      }
    });
	
	// build location map chart
	$("#map-box").datamap({
        scope: 'usa',
    	bubbles: tweets,
        bubble_config: {
            popupTemplate: _.template([
                '<div class="hoverinfo"><strong><%= data.screenName %></strong>',
                '<br/>Text: <%= data.text %>',
                '<br/>Location: <%= data.location %>',
                '<br/>Temperature: <%= data.temp %>',
                '</div>'].join(''))
        },
        geography_config: {
            popupOnHover: false,
            highlightBorderColor: 'steelblue',
            highlightOnHover: true
        },
        fills: {
            'USA': '#1f77b4',
            defaultFill: '#999999'
        },
        data: {
            'USA': {fillKey: 'USA'}
        }
    });

	
}

function addDonut(input, color, id) {
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

	input.forEach(function(d) {
		d.count = +d.count;
	});

	var g = svg.selectAll(".arc")
		.data(pie(input))
	.enter().append("g")
		.attr("class", "arc");

	g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.weather); });
	
	g.append("text")
		.style("text-anchor", "middle")
		.text(function(d) { return d.data.percentage; });
}

function pieObject (prop1, prop2, prop3){
	this.weather = prop1;
	this.count = prop2;
	this.percentage = prop3;
}

function mapObject (longi, lat, radius, screenName, text, location, temp, fillKey){
	this.screenName = screenName;
	this.text = text;
	this.latitude = lat;
	this.longitude = longi;
	this.radius = radius;
	this.temp = temp;
	this.fillKey = fillKey;
	this.country = "USA";
	this.location = location;
}