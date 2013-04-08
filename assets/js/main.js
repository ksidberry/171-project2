width = 1200;
height = 500;
var counter = 0;
var temps = [];

// put all the ajax at the beginnign and distribute to the functions
// reorganize the navigation for the fewer visualizations

window.onload = function() {	
	// process data
	var bars = [],
		bubbles = [];
	$.ajax({
		url: "data/final/TuesdayDataTiny.json",
		dataType: 'json',
		async: false,
		success: function(data) {
			for (var i = 0; i < data.length; i++) {
				var sentiment = data[i]["salience.content.sentiment"];
				bars.push(sentiment);
				
				var longi = data[i]["interaction.geo.longitude"];
				var lat = data[i]["interaction.geo.latitude"];
				var radius = data[i]["klout.score"] / 5;
				var screenName = data[i]["twitter.user.screen_name"];
				var text = data[i]["interaction.content"];
				var location = data[i]["twitter.place.full_name"];
				var temp = data[i]["TuesdayTemp"];
				var fillKey = sentimentColoring(data[i]["salience.content.sentiment"]);
			
				var n = new mapObject(longi, lat, radius, screenName, text, location, temp, fillKey)
				bubbles = bubbles.concat(n);
			}
		}
	});
	
	// activate tooltips
	$('.tool-info').tooltip();
	
	buildScatter();
	buildBarChart(bars);
	buildMapChart(bubbles);
	buildPie();
	buildCloud();
}

function getTweets() {
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
        console.log(tweetwords);
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
        console.log(data.length);
        for (var i = 0; i < 30; i++) {
           var randomnumber=Math.floor(Math.random()*(arraylength + 1)); 
           //console.log(randomnumber);
           console.log(data[i]["salience.content.sentiment"]);
            var text = data[i]["salience.content.sentiment"];
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
        console.log(tweetwords);
        return tweetwords;

      }
    });
    return tweetwords;
}

/*function buildChoropleth() {
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
}*/

/*function buildSymbol () {
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
	
}*/

function buildScatter() {
	//var tweets = getAllTweets();
    $.ajax({
      url: "data/final/WednesdayData.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        //console.log(data.length);
        var arraylength = data.length;
        //console.log(data[0]);
        for (var i = 0; i < data.length; i++) {
           //var randomnumber=Math.floor(Math.random()*(arraylength + 1)); 
           
            //console.log(data[i]["sentiment"]);
           //console.log(data);
            //var text = data[randomnumber]["twitter.text"];
            //console.log(text);
            //var n=text.split(" ");
            //console.log(n);
            //console.log(tweetwords.length);
            //console.log(i);
            temps = temps.concat(data[i]);

        }
        //console.log(temps);
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

    function tweetText() {
       counter = counter + 1;
      return temps[counter]["text"];

    }

    function temp() {
       counter = counter + 1;
       //console.log(counter);
       return temps[counter - 1]["WednesdayTemp"];

    }


    function color() {
       counter = counter + 1;
      console.log(counter);
      var negative = "#ff7480";
      var positive = "#4a83ff";
      var neutral = "#808080";

      console.log("HI");
      //console.log(temps[counter]["sentiment"]);
      if (temps[counter]["sentiment"] < 0) {
        //counter = counter + 1;
        return negative;
      }
      else if (temps[counter]["sentiment"] > 0) {
        //counter = counter + 1;
        return positive;
      }
      else {
        //counter = counter + 1;
        return neutral;
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

  var circle = svg.selectAll("circle")
  .data(d3.range(597).map(function() {
  return {
      x: width * Math.random(),
      y: height * Math.random(),
      dx: Math.random() - .5,
      dy: Math.random() - .5
      };
  }))
  .enter().append("svg:circle")
  .attr("r", 7.5);

	var text = svg.append("svg:text")
		.attr("x", 20)
		.attr("y", 20);

	var start = Date.now(),
		frames = 0;

    var tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("a simple tooltip");



    circle
        .style("fill", function(d) { return color(); })
        .attr("text", function(d) {return tweetText();})
        .attr("temperature", function(d) {return temp();})
        .on("mouseover", function(){d3.select("#tooltip").html(function(d) { return "Temperature: " + temp() + "<br />Tweet: " + tweetText(); }); return tooltip.style("visibility", "visible"); })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

/*
    for (item in d3.selectAll("circle")[0]) {
      if (item.attr("temperature") < 50) {
        item.style("opacity", 0);
      }
    }
*/
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

function buildScatterPlot() {
      $.ajax({
      url: "data/final/TuesdayDataSmall.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        var arraylength = data.length;
        for (var i = 0; i < 50; i++) {
            temps = temps.concat(data[i]);

        }
      }
    });

  console.log(temps);
  var svg = d3.select("#scatterContainer").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

  var circle = svg.selectAll("circle")
    .data(temps.map(function(d) {
    return {
      x: width * Math.random(),
      y: height * Math.random(),
      dx: Math.random() - .5,
      dy: Math.random() - .5,
      temp: d["TuesdayTemp"],
      wind: d["TuesdayWind"],
      conditions: d["TuesdayConditions"],
      rain: d["TuesdayRain"],
      sentiment: d["salience.content.sentiment"],
      text: d["twitter.text"],
      username: d["interaction.author.username"],
      };
    }))
    .enter().append("svg:circle")
    .attr("r", 7.5);

  var text = svg.append("svg:text")
    .attr("x", 20)
    .attr("y", 20);

      var tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("a simple tooltip");



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
    .attr("cy", function(d) { d.y += d.dy; if (d.y > height) d.y -= height; else if (d.y < 0) d.y += height; return d.y; })
    .on("mouseover", function(d){d3.select("#tooltip").html(function() { return "Temperature: " + d.temp + "<br />Tweet: " + d.text; }); return tooltip.style("visibility", "visible"); })
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

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

function buildPie() {
	
	// fog, snow, rain, wind, sun, unknown
	var count = [0, 0, 0, 0, 0, 0];	
	
	var sequence = {
		"fog": {
			"color": "#FFCCFF",
			"id": "#foggy-donut",
		},
		"snow": {
			"color": "#CCFFFF",
			"id": "#snowy-donut",
		},
		"rain": {
			"color": "#3333FF",
			"id": "#rainy-donut",
		},
		"wind": {
			"color": "#CCFF99",
			"id": "#windy-donut",
		},
		"sun": {
			"color": "#FF9900",
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
			var weather = new pieObject(key, count[i], percent.toString() + " %", total);
			var everyone = new pieObject("everyone", total - count[i], "", "");
			data.push(weather);
			data.push(everyone)
			addDonut(data, sequence[key]["color"], sequence[key]["id"]);
			i = i + 1;
		}
	});

}

function buildBarChart(values){
	var margin = {top: 10, right: 30, bottom: 31, left: 30},
		w = width - margin.left - margin.right,
		h = height - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.domain([-20, 20])
		.range([0, w]);

	// Generate a histogram using twenty uniformly-spaced bins.
	var data = d3.layout.histogram()
		.bins(x.ticks(10))
		(values);

	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.y; })])
		.range([h, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var svg = d3.select("#sentiment-container").append("svg")
		.attr("width", w + margin.left + margin.right)
		.attr("height", h + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var bar = svg.selectAll(".bar")
		.data(data)
	  .enter().append("g")
		.attr("class", "bar")
		.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

	bar.append("rect")
		.attr("x", 1)
		.attr("width", 142.5)
		.attr("height", function(d) { return h - y(d.y); });

	bar.append("text")
		.attr("dy", ".75em")
		.attr("y", 6)
		.attr("x", 142.5 / 2)
		.attr("text-anchor", "middle")
		.text(function(d) { return d.y;});

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + h + ")")
		.call(xAxis);

}

function buildMapChart(tweets){		
	// build location map chart
	$("#map-container").datamap({
        scope: 'usa',
    	bubbles: tweets,
        bubble_config: {
            popupTemplate: _.template([
                '<div class="hoverinfo"><strong><%= data.screenName %></strong>',
                '<br/>Text: <%= data.text %>',
                '<br/>Location: <%= data.location %>',
                '<br/>Temperature: <%= data.temp %>',
                '<br/>Sentiment: <%= data.fillKey %>',
                '</div>'].join(''))
        },
        geography_config: {
            popupOnHover: true,
            highlightBorderColor: 'steelblue',
            highlightOnHover: true,
            popupTemplate: _.template('<div class="hoverinfo"><strong><%= geography.properties.name %></strong></div>')
        },
        fills: {
            'tier1': '#660000',
            'tier2': '#FF0000',
            'tier3': '#FF9933',
            'tier4': '#CCFF66',
            'tier5': '#339933',
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
		.style("font-size", "25px")
		.text(function(d) { return d.data.percentage; });
		
 	d3.select(id + "-text").append('p')
 		.data(pie(input))
 		.text(function(d) { return "There have been " + d.data.count + " occurrences of " + d.data.weather + " out of " + d.data.total; });
}

function sentimentColoring(sentiment) {
	if (sentiment < -10){
		return "tier1";
	}
	if (sentiment < 0 && sentiment >= -10){
		return "tier2";
	}
	if (sentiment == 0){
		return "tier3";
	}
	if (sentiment > 0 && sentiment <= 10){
		return "tier4";
	}
	if (sentiment > 10){
		return "tier5";
	}
}

function pieObject (prop1, prop2, prop3, prop4){
	this.weather = prop1;
	this.count = prop2;
	this.percentage = prop3;
	this.total = prop4;
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