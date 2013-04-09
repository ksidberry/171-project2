#CS 171 Visualization: Weatherly D3pression
By Kendall Sidberry and Zachary Hamed

### Description
This visualization analyzes the relationship between tweets, mood, and the weather.
The app is split into several directories and pages:

### File Structure
/assets
Contains the css, image, and javascript files necessary to load the page.

    /css
    Mostly Bootstrap.

    /img
    Used for some of our buttons.

    /js
    Contains bootstrap js files and our main Javascript file, main.js.

/data
Contains all the data we collected over the course of the week.  The /final
directory contains the final, cleaned CSV, XLS, and JSON files we used for the visualization.
All other files led up to those files.


histogram.html, weather.html, map.html, and scatter.html are our main visualizations. In tweets.html,
we attempted to put together a wordcloud that displayed the most popular words used in tweets, but we
didn't find it to be helpful and abandoned it.

###  Sources
Donut Chart: http://bl.ocks.org/mbostock/3887193
Word Cloud: https://github.com/jasondavies/d3-cloud
Collision Detection: http://bl.ocks.org/mbostock/3231298
Moving Dots: http://bl.ocks.org/mbostock/1371412
Pie Chart: http://bl.ocks.org/mbostock/3887235
Symbol Map: http://bl.ocks.org/mbostock/4342045