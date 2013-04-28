class BubbleChart
  constructor: (data) ->
    @data = data
    @width = 1200
    @height = 500
    @default_radius = 0
    @what = 0

    @tooltip = CustomTooltip("my_tooltip", 240)

    # locations the nodes will move towards
    # depending on which view is currently being
    # used
    @center = {x: @width / 2, y: @height / 2}
    @sentiment_centers = {
      "Sad": {x: @width / 3, y: @height / 2},
      "Neutral": {x: @width / 2, y: @height / 2},
      "Happy": {x: 2 * @width / 3, y: @height / 2}
    }

    # used when setting up force and
    # moving around nodes
    @layout_gravity = -0.01
    @damper = 0.5

    # these will be set in create_nodes and create_vis
    @vis = null
    @nodes = []
    @force = null
    @circles = null
    @fill_color = d3.scale.ordinal()
      .domain(["Rainy", "Windy", "Snowy", "Sunny", "Foggy"])
      .range(["#5893C8", "#AA92C2", "#A0E0FF", "#FCE897", "#A09EA2"])
	
	# use the max total_amount in the data as the max in the scale's domain
    max_amount = d3.max(@data, (d) -> parseInt(d.TuesdayTemp) / 5)
    @radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85])

    this.create_nodes()
    this.create_vis()

  # create node objects from original data
  # that will serve as the data behind each
  # bubble in the vis, then add each node
  # to @nodes to be used later
  create_nodes: () =>
    @data.forEach (d, i) =>
      node = {
        id: i
        original: d
        radius: parseInt(d.TuesdayTemp) / 5
        value: 99
        temp: parseInt(d.TuesdayTemp)
        tempStatus: tempStatus(parseInt(d.TuesdayTemp))
        wind: d.TuesdayWind
        text: d.text
        name: d.screenName
        sentiment: sentimentPick(parseInt(d.sentiment))
        weather: weatherPick(d.TuesdayConditions, parseInt(d.TuesdayWind))
        location: d.location
        x: Math.random() * @width
        y: Math.random() * @height
      }
      @nodes.push node

  # create svg at #vis and then 
  # create circle representation for each node
  create_vis: () =>
    @vis = d3.select("#vis").append("svg")
      .attr("width", @width)
      .attr("height", @height)
      .attr("id", "svg_vis")
      
    @circles = @vis.selectAll("circle")
      .data(@nodes, (d) -> d.id)

    # used because we need 'this' in the 
    # mouse callbacks
    that = this

    # radius will be set to 0 initially.
    # see transition below
    @circles.enter().append("circle")
      .attr("r", 100)
      .style("fill", (d) => @fill_color(d.weather))
      .attr("stroke-width", 2)
      .attr("stroke", (d) => d3.rgb(@fill_color(d.weather)).darker())
      .attr("id", (d) -> "bubble_#{d.id}")
      .attr("opacity", 0)
      .on("mouseover", (d,i) -> that.show_details(d,i,this))
      .on("mouseout", (d,i) -> that.hide_details(d,i,this))
      
    # Fancy transition to make bubbles appear, ending with the
    # correct radius
    @circles.transition().duration(2000).attr("opacity",1).attr("r", (d) -> d.radius)


  # Charge function that is called for each node.
  # Charge is proportional to the diameter of the
  # circle (which is stored in the radius attribute
  # of the circle's associated data.
  # This is done to allow for accurate collision 
  # detection with nodes of different sizes.
  # Charge is negative because we want nodes to 
  # repel.
  charge: (d) ->
    if d.radius == 0
      return 0;
    -Math.pow(d.radius, 2)

  # Starts up the force layout with
  # the default values
  start: () =>
    @force = d3.layout.force()
      .nodes(@nodes)
      .size([@width, @height])
      
    @circles.call(@force.drag)

  # initiate visualization
  initiate_display: () => 
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on "tick", (e) =>
        @circles.each(this.move_towards_sentiment(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
    @force.start()
    @display_sentiment()
    
  # Filter by sentiment
  sentiment_filter: (param) =>
    @use_filters(param, "sentiment")
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on "tick", (e) =>
        @circles.each(this.move_towards_center(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
    @force.start()
    @hide_sentiment()
    
  # Sets up force layout to display
  # all nodes in one circle.
  display_group_all: () =>
    @hide_sentiment()
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on "tick", (e) =>
        @circles.each(this.move_towards_center(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
    @force.start()
    
  # Moves all circles towards the @center
  # of the visualization
  move_towards_center: (alpha) =>
    (d) =>
      d.x = d.x + (@center.x - d.x) * (@damper + 0.02) * alpha
      d.y = d.y + (@center.y - d.y) * (@damper + 0.02) * alpha

  # move all circles to their associated sentiment     
  move_towards_sentiment: (alpha) =>
    (d) =>
      target = @sentiment_centers[d.sentiment]
      d.x = d.x + (target.x - d.x) * (@damper + 0.02) * alpha * 1.1
      d.y = d.y + (target.y - d.y) * (@damper + 0.02) * alpha * 1.1
      
  display_sentiment: () =>    
    sentiment_x = {"Sad": 300, "Neutral": @width / 2 - 50, "Happy": @width - 350}
    sentiment_data = d3.keys(sentiment_x)
    sentiment = @vis.selectAll(".sentiment")
      .data(sentiment_data)

    sentiment.enter().append("text")
      .attr("class", "sentiment")
      .attr("x", (d) => sentiment_x[d])
      .attr("y", 40)
      .attr("text-anchor", "start")
      .text((d) -> d)

  # Method to hide year titiles
  hide_sentiment: () =>
    sentiment = @vis.selectAll(".sentiment").remove()

  show_details: (data, i, element) =>
    d3.select(element).attr("stroke", "black")
    content = "<span class=\"name\">Name:</span><span class=\"value\"> #{data.name}</span><br/>"
    content +="<span class=\"name\">Tweet:</span><span class=\"value\"> $#{data.text}</span><br/>"
    content +="<span class=\"name\">Sentiment:</span><span class=\"value\"> #{data.sentiment}</span><br/>"
    content +="<span class=\"name\">Location:</span><span class=\"value\"> #{data.location}</span><br/>"
    content +="<span class=\"name\">Temperature:</span><span class=\"value\"> #{data.temp} Degrees</span><br/>"
    content +="<span class=\"name\">Weather:</span><span class=\"value\"> #{data.weather}</span>"
    @tooltip.showTooltip(content,d3.event)

  hide_details: (data, i, element) =>
    d3.select(element).attr("stroke", "#404040")
    @tooltip.hideTooltip()

  use_filters: (filters) =>
    @nodes.forEach (d) =>
      d.radius = d.temp / 5
      filters.discrete.forEach (filter) =>
        #d.radius = d.temp / 5
        value = d[filter.target]
        if (filter.removeValues[value])
          d.radius = @default_radius
    @do_filter()

  do_filter: () =>
    @force.start()
    @circles.transition().duration(2000).attr("r", (d) -> d.radius)

root = exports ? this

$ ->
  chart = null

  render_vis = (csv) ->
    chart = new BubbleChart csv 
    chart.start()
    chart.initiate_display()
  root.display_all = () =>
    chart.display_group_all()
  root.use_filters = (filters) =>
    chart.initiate_display()
    chart.use_filters(filters)

  d3.csv "data/final/test3.csv", render_vis