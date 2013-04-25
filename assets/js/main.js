width = 1200;
height = 500;
var counter = 0;
var temps = [];

// put all the ajax at the beginnign and distribute to the functions
// reorganize the navigation for the fewer visualizations

window.onload = function() {	
	// process data
   $("#negative-sentiment").click(
      function(){ 
        var t = d3.selectAll("circle").data().filter(function(d, i){ 
          return d.sentiment > -10 
        }); 
        //console.log(t);
        //console.log(t.length); 
        t.exit().transition().delay(2000).remove();
    });

	var bars = [],
		bubbles = [];
	$.ajax({
		url: "data/final/TuesdayDataSmall.json",
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
				
				temps = temps.concat(data[i]);
			}
		}
	});
	
	// activate tooltips
	$('.tool-info').tooltip();
	
	//buildScatterPlot(temps);
	buildFilterMap();

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

function buildScatterPlot(temps) {
      /*$.ajax({
      url: "data/final/TuesdayDataSmall.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        var arraylength = data.length;
        for (var i = 0; i < 500; i++) {
            temps = temps.concat(data[i]);

        }
      }
    });*/

  //console.log(temps);
  //console.log(temps.length); 
  var svg = d3.select("#scatterContainer").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

  function colorSentiment(s) {
    if (s < 0) {
      return "#ff384a";
    }
    else if (s > 0) {
      return "#5595ff";
    }
    else {
      return "#a9a6ad";
    }
  } 
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
    .attr("r", 7.5)
    .attr("fill", function(d) { return colorSentiment(d.sentiment) });
  
  var text = svg.append("svg:text")
    .attr("x", 20)
    .attr("y", 20);

 var tooltip = d3.select("#scatterContainer")
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
    .on("mouseover", function(d){d3.select("#tooltip").html(function() { return "<strong>Username:</strong> " + d.username + "<br /><strong>Tweet:</strong> " + d.text + "<br /><strong>Sentiment:</strong> " + d.sentiment + "<br /><strong>Temperature:</strong> " + d.temp + "<br /><strong>Rainfall:</strong> " + d.rain + "<br /><strong>Wind speed:</strong> " + d.wind; }); return tooltip.style("visibility", "visible"); })
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

  });

}

function buildFilterMap() {
	var width = 350,
		height = 200,
		centered;

	var path = d3.geo.path();
	
	var svg = d3.select("#filterMapContainer").append("svg")
		.attr("width", width)
		.attr("height", height);
	
	var tooltip = d3.select("#filterMapContainer")
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.attr("id", "mapTooltip")
		.text("a simple tooltip");

	svg.append("rect")
		.attr("class", "background")
		.attr("width", width)
		.attr("height", height)
		.on("click", click)

	var g = svg.append("g")
		.attr("id", "states");

	d3.json("data/us-states.json", function(json) {
		g.selectAll("path")
			.data(json.features)
		.enter().append("path")
			.attr("d", path)
			.attr("transform", "scale(.4, .4)")
	  		.on("click", click)
	  		.on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.properties.name);})
			.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
	});

	function click(d) {
		var x, y, k;

		if (d && centered !== d) {
			var centroid = path.centroid(d);
			x = .4 * centroid[0];
			y = .4 * centroid[1];
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

/*function pieObject (prop1, prop2, prop3, prop4){
	this.weather = prop1;
	this.count = prop2;
	this.percentage = prop3;
	this.total = prop4;
}*/

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

/*function blah(id) {
	$("#scatterContainer").empty();
	var low = [];
	$.ajax({
		url: "data/final/TuesdayDataSmall.json",
		dataType: 'json',
		async: false,
		success: function(data) {
			for (var i = 0; i < data.length; i++) {
				if (id == '$low'){
					if (data[i]["TuesdayTemp"] < 30){
						low = low.concat(data[i]);	
					}
				}
				else if (id == '$mid'){
					if (data[i]["TuesdayTemp"] >= 30 && data[i]["TuesdayTemp"] <= 60){
						low = low.concat(data[i]);
					}
				}
				else if (id == '$high'){
					if (data[i]["TuesdayTemp"] > 60){
						low = low.concat(data[i]);;		
					}
				}
				else if (id == '$sunnyButton'){
					if (data[i]["TuesdayConditions"] == 0){
						low = low.concat(data[i]);;		
					}
				}
				else if (id == '$foggyButton'){
					if (data[i]["TuesdayConditions"] == 100000 || data[i]["TuesdayConditions"] == 110000 || data[i]["TuesdayConditions"] == 100010 || data[i]["TuesdayConditions"] == 101000){
						low = low.concat(data[i]);;		
					}
				}
				else if (id == '$snowyButton'){
					if (data[i]["TuesdayConditions"] == 1000){
						low = low.concat(data[i]);;		
					}
				}
				else if (id == '$windyButton'){
					if (data[i]["TuesdayWind"] > 20){
						low = low.concat(data[i]);;		
					}
				}
				else if (id == '$rainyButton'){
					if (data[i]["TuesdayConditions"] == 10000 || data[i]["TuesdayConditions"] == 11000 || data[i]["TuesdayConditions"] == 10010){
						low = low.concat(data[i]);;		
					}
				}
				else if (id == '$negativeButton'){
					if (data[i]["salience.content.sentiment"] < 0){
						low = low.concat(data[i]);;		
					}
				}
				else if (id == '$neutralButton'){
					if (data[i]["salience.content.sentiment"] == 0){
						low = low.concat(data[i]);;		
					}
				}
				else if (id == '$positiveButton'){
					if (data[i]["salience.content.sentiment"] > 0){
						low = low.concat(data[i]);;		
					}
				}
				else if (id == '$all'){
					low = low.concat(data[i]);;		
				}
				
			}
		}
	});
	buildScatterPlot(low);
}*/

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
