class LineChart {

  constructor(_config, _data, _title, _legendSVG, _legendKeys, _colorScheme) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 300,
      containerHeight: _config.containerHeight || 90,
      margin: { top: 10, bottom: 50, right: 50, left: 50 },
      tooltipPadding: _config.tooltipPadding || 15
    }
    
    this.data = _data;  
    this.title = _title;
    this.legendSVG = d3.select(_legendSVG)
                        .attr('height', 300);
    this.legendKeys = _legendKeys;
    this.colorScheme = _colorScheme;
    this.initVis();
  }

  initVis() {
      
    let vis = this; 

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Create groups based on data type
    vis.groups = d3.groups(vis.data, d => d.type);

    //setup scales
    vis.xValue = d => d.year;
    vis.yValue = d => d.value;

    vis.xScale = d3.scaleLinear()
        .domain(d3.extent(vis.data, vis.xValue))
        .range([0, vis.width]);
    console.log("XScale is setup");
  
    
    vis.yScale = d3.scaleLinear()
        .domain(d3.extent(vis.data, vis.yValue))
        .range([vis.height, 0])
        .nice(); 

    console.log("YScale is setup");

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale);

    // Append x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`)
        .call(vis.xAxis);

      vis.svg.append("text")
          .attr("font-size", "13px")
          .attr("x", vis.width - 200)
          .attr("y", vis.height + 50)
          .attr("text-anchor", "end")
          .attr("stroke", "black")
          .text("Year");
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis')
        .call(vis.yAxis)
        .append("text")
          .attr("font-size", "13px")
          .attr("transform", "rotate(-90)")
          .attr("y", 30)
          .attr("dy", "-4.8em")
          .attr("text-anchor", "end")
          .attr("stroke", "black")
          .text("Percentage");


    // Set colors to be used for chart and legend
    vis.colors = d3.scaleOrdinal()
        .domain(vis.legendKeys)
        .range(vis.colorScheme);

    console.log("colors set");

    // Add one dot in the legend for each name.
    var size = 20
    vis.legendSVG.selectAll("legendSquares")
      .data(vis.legendKeys)
      .enter()
      .append("rect")
        .attr("x", 100)
        .attr("y", function(d,i){ return  80 + i*(size+5)}) 
        .attr("width", size)
        .attr("height", size)
        .style("fill", d => vis.colors(d))

    // Add one dot in the legend for each name.
    vis.legendSVG.selectAll("legendLabels")
      .data(vis.legendKeys)
      .enter()
      .append("text")
        .attr("x", 100 + size*1.2)
        .attr("y", function(d,i){ return 85 + i*(size+5) + (size/2)}) 
        .style("fill", function(d){ 
          return vis.colors(d)
      })
        .text(function(d){ return d})
        .attr("text-anchor", "left")
    
    // Draw lines 
    vis.chart.selectAll(".line")
      .data(vis.groups)
      .join("path")
      .attr("stroke", (d) => vis.colors(d))
      .attr('fill', "none")
      .attr('stroke-width', 2)
      .attr('d', function (d) {
        return d3.line()
          .x(d => {return vis.xScale(d.year);})
          .y(d => {return vis.yScale(d.value);})(d[1])
      });

    // Create toolitp
    vis.tooltip = vis.chart.append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');

    vis.tooltip.append('circle')
        .attr('r', 4);

    vis.tooltip.append('text');
    vis.marks = vis.chart.append('g');
    vis.trackingArea = vis.chart.append('rect')
        .attr('width', vis.width)
        .attr('height', vis.height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');
  }
  
  updateVis() { 

   let vis = this;
    
    vis.xValue = d => d.year;
    vis.yValue = d => d.value;

    // Set the scale input domains
    vis.xScale.domain(d3.extent(vis.data, vis.xValue));
    vis.yScale.domain(d3.extent(vis.data, vis.yValue));

    vis.bisectDate = d3.bisector(vis.xValue).left;
    vis.renderVis();
   }
  
  
   renderVis() { 
    let vis = this;

    d3.selectAll("path").remove();

      // Update the axes
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);

    //Draw lines
    vis.chart.selectAll(".line")
    .data(vis.groups)
    .join("path")
    .attr("stroke", (d) => vis.colors(d))
    .attr('fill', "none")
    .attr('stroke-width', 2)
    .attr('d', function (d) {
      return d3.line()
        .x(d => {return vis.xScale(d.year);})
        .y(d => {return vis.yScale(d.value);})(d[1])
    });

    console.log("updated!")
  
    }
  
    
}