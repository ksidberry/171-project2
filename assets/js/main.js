width = 1200;
height = 500;
var counter = 0;
var temps = [];

window.onload = function() {	
	// activate tooltips
	$('.tool-info').tooltip();
	buildChoropleth();
	buildSymbol();
	buildScatter();
	buildMetrics();
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
	//var tweets = getAllTweets();
    $.ajax({
      url: "data/final/WednesdayData.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        console.log("scatter hi");
        console.log(data.length);
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