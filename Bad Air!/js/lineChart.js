class LineChart {

    constructor(_config, _data, _legendSVG, _legendKeys, _colorScheme) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 300,
        containerHeight: _config.containerHeight || 90,
        margin: { top: 10, bottom: 30, right: 50, left: 50 },
        tooltipPadding: _config.tooltipPadding || 15
      }
     
      this.data = _data;  
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

      vis.groups = d3.groups(vis.data, d => d.type);

      vis.xValue = d => d.year;
      vis.yValue = d => d.value;
  
      //setup scales
      vis.xScale = d3.scaleLinear()
          .domain(d3.extent(vis.data, vis.xValue)) //d3.min(vis.data, d => d.year), d3.max(vis.data, d => d.year) );
          .range([0, vis.width]);
      console.log("XScale is setup");
    
      
      vis.yScale = d3.scaleLinear()
          .domain(d3.extent(vis.data, vis.yValue))
          .range([vis.height, 0])
          .nice(); 

        console.log("YScale is setup");

      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // Append group element that will contain our actual chart (see margin convention)
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale);
      vis.yAxis = d3.axisLeft(vis.yScale);
  
      // Append x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.height})`)
          .call(vis.xAxis);
      
      // Append y-axis group
      vis.yAxisG = vis.chart.append('g')
          .attr('class', 'axis y-axis')
          .call(vis.yAxis); 
      console.log("y-axis setup");
  
 
    // Create lines

    vis.colorPalette = d3.scaleOrdinal(d3.schemeTableau10);
    vis.colorPalette.domain(vis.legendKeys);

    vis.colors = d3.scaleOrdinal()
        .domain(vis.legendKeys)
        .range(vis.colorScheme);

    console.log("colors set");

    // Add one dot in the legend for each name.
    var size = 20
    vis.legendSVG.selectAll("mydots")
      .data(vis.legendKeys)
      .enter()
      .append("rect")
        .attr("x", 100)
        .attr("y", function(d,i){ return  20 + i*(size+5)}) // 20 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", d => vis.colors(d))

    // Add one dot in the legend for each name.
    vis.legendSVG.selectAll("mylabels")
      .data(vis.legendKeys)
      .enter()
      .append("text")
        .attr("x", 100 + size*1.2)
        .attr("y", function(d,i){ return 20 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ 
          return vis.colors(d)
      })
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        //.style("alignment-top", "middle")

    vis.chart.selectAll(".circle")
      .data(data)
      .join("path");
    
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

    this.updateVis();

}
  
    //leave this empty for now
   updateVis() { 

  //   vis.chart.selectAll('path')
  //     .data([])
  //     .exit().remove();

  //  let vis = this;
    
  //   vis.xValue = d => d.year;
  //   vis.yValue = d => d.maxAQI;

  //   vis.line = d3.line()
  //       .x(d => vis.xScale(vis.xValue(d)))
  //       .y(d => vis.yScale(vis.yValue(d)));

  //   // Set the scale input domains
  //   vis.xScale.domain(d3.extent(vis.data, vis.xValue));
  //   vis.yScale.domain(d3.extent(vis.data, vis.yValue));

  //   vis.bisectDate = d3.bisector(vis.xValue).left;
    //vis.renderVis();


  //   vis.lines
  //     .on('mouseover', (event,d) => {
  //       console.log("no error yet");
  //       console.log("mouse over! ");
  //       console.log(event);
  //       console.log(d);
    
  //   d3.select('#tooltip')
  //     .style('display', 'block')
  //     .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
  //     .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
  //     .html(`
  //       <div class="tooltip-title"></div>
  //       <ul>
  //         <li>Year: ${d.year}</li>
  //         <li>Cost: $${d.percentileAQI} billion</i></li>
  //       </ul>
  //     `);
  // })
  // .on('mouseleave', () => {
  //   d3.select('#tooltip').style('display', 'none');
  // });



  // console.log("no error yet");


  // const trackingArea = vis.chart.append('rect')
  //   .attr('width', vis.width)
  //   .attr('height', vis.height)
  //   .attr('fill', 'none')
  //   .attr('pointer-events', 'all');

  // console.log("tracking area start");
    
  // vis.trackingArea
  //   .on('mouseenter', () => {
  //     //vis.tooltip.style('display', 'block');
  //     console.log("mouse enter")
  //   })
  //   .on('mouseleave', () => {
  //    // vis.tooltip.style('display', 'none');
  //   })
  //   .on('mousemove', function(event) {
  //       console.log("HELLO")
  //     // Get date that corresponds to current mouse x-coordinate
  //     const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
  //     const year = vis.xScale.invert(xPos);

  //     // Find nearest data point
  //     const index = vis.bisectYear(vis.data, year, 1);
  //     const a = vis.data[index - 1];
  //     const b = vis.data[index];
  //     const d = b && (year - a.year > b.year - year) ? b : a; 

  //     // Update tooltip
  //     vis.tooltip.select('circle')
  //         .attr('transform', `translate(${vis.xScale(d.year)},${vis.yScale(d.maxAQI)})`);
      
  //     vis.tooltip.select('text')
  //         .attr('transform', `translate(${vis.xScale(d.year )},${(vis.yScale(d.maxAQI) - 15)})`)
  //         .text(Math.round(d.cost));

  //     vis.tooltip.select('rect')
  //           .attr('transform', `translate(${vis.xScale(d.year)},${0})`);


  //     });
     
  
   }
  
  
   //leave this empty for now...
   renderVis() { 

    //   vis.trackingArea
    //     .on('mouseenter', () => {
    //       console.log("no error yet");
    //      // vis.tooltip.style('display', 'block');
    //     })
    //     .on('mouseleave', () => {
    //       vis.tooltip.style('display', 'none');
    //       //console.log("no error yet");

    //     })
    //     .on('mousemove', function(event) {
    //       // Get date that corresponds to current mouse x-coordinate
    //       const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
    //       const date = vis.xScale.invert(xPos);

    //       // Find nearest data point
    //       const index = vis.bisectDate(vis.data, date, 1);
    //       const a = vis.data[index - 1];
    //       const b = vis.data[index];
    //       const d = b && (date - a.date > b.date - date) ? b : a; 

    //       // Update tooltip
    //       vis.tooltip.select('circle')
    //           .attr('transform', `translate(${vis.xScale(d.year)},${vis.yScale(d.maxAQI)})`);
          
    //       vis.tooltip.select('text')
    //           .attr('transform', `translate(${vis.xScale(d.year)},${(vis.yScale(d.maxAQI) - 15)})`)
    //           .text(Math.round(d.close));
    //     });

    // // Update the axes
    // vis.xAxisG.call(vis.xAxis);
    // vis.yAxisG.call(vis.yAxis);
  
    }
  
    
  }