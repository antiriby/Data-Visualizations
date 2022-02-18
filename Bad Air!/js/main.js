
console.log("Hello world");

let data;
let hamCountyAQI = []
let hamCountyAir = []
let hamCountyDays = []

d3.csv('data/data.csv')
  .then(_data => {
        console.log('Data loading complete. Work with dataset.');
        data = _data;
        
        data.forEach(d => {
            d.maxAQI = +d.maxAQI;
            d.percentileAQI = +d.percentileAQI;
            d.medianAQI = +d.medianAQI;
            d.daysCO = +d.daysCO;
            d.daysNO2 = +d.daysNO2;
            d.daysOzone = +d.daysOzone;
            d.daysSO2 = +d.daysSO2;
            d.daysPM2_5 = +d.daysPM2_5;
            d.daysPM10 = +d.daysPM10;
            d.goodDays = +d.goodDays;
            d.moderateDays = +d.moderateDays;
            d.unhealthyForSensitiveGroupsDays = +d.unhealthyForSensitiveGroupsDays;
            d.unhealthyDays = +d.unhealthyDays;
            d.veryUnhealthyDays = +d.veryUnhealthyDays;
            d.hazardousDays = +d.hazardousDays;
        });

        data.filter(d => d.state == "Ohio").filter( d => d.county == "Hamilton").forEach(
            d => {

                //TODO: add if statment to neglect values that are 0 for all different types

                hamCountyAQI.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': d.maxAQI, 'type': "maxAQI" });
                hamCountyAQI.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': d.percentileAQI, 'type': "percentileAQI" });
                hamCountyAQI.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': d.medianAQI, 'type': "medianAQI" });

                hamCountyAir.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.daysCO / d.daysWithAQI) * 100, 'type': "CO"});
                hamCountyAir.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.daysNO2 / d.daysWithAQI) * 100, 'type': "NO2"});
                hamCountyAir.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.daysOzone / d.daysWithAQI) * 100, 'type': "Ozone"});
                hamCountyAir.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.daysPM2_5 / d.daysWithAQI) * 100, 'type': "PM2_5"});
                hamCountyAir.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.daysPM10 / d.daysWithAQI) * 100, 'type': "PM10"});
                hamCountyAir.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.daysSO2 / d.daysWithAQI) * 100, 'type': "SO2"});

                hamCountyDays.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.goodDays / d.daysWithAQI) * 100, 'type': "goodDays"});
                hamCountyDays.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.moderateDays / d.daysWithAQI) * 100, 'type': "moderateDays"});
                hamCountyDays.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.unhealthyForSensitiveGroupsDays / d.daysWithAQI) * 100, 'type': "unhealthyForSensitiveGroupsDays"});
                hamCountyDays.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.unhealthyDays / d.daysWithAQI) * 100, 'type': "unhealthyDays"});
                hamCountyDays.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.veryUnhealthyDays / d.daysWithAQI) * 100, 'type': "veryUnhealthyDays"});
                hamCountyDays.push({'state': d.state, 'county': d.county, 'year': d.year, 'value': (d.hazardousDays / d.daysWithAQI) * 100, 'type': "hazardousDays"});
            }
        )

        console.log(hamCountyDays);

        var aqiLegendKeys = ["Max AQI", "90th Percentile AQI", "Median AQI"];
        var aqiColors = ["#E15759", "#76B7B2", "#ECD948"];

        let AQILineChart = new LineChart({
            'parentElement': '#lineChart', 
            'containerHeight': 400, 
            'containerWidth': 700,
            }, hamCountyAQI, 
            "Air Quality Indexes per Year",
            "#lineChartLegend", 
            aqiLegendKeys, 
            aqiColors);

        console.log("first chart complete");

        var airLegendKeys = ["CO", "NO2", "Ozone", "PM2.5", "PM10", "SO2"];
        var airColors = d3.schemeTableau10.slice(4);

        let AirLineChart = new LineChart({
            'parentElement': '#airLineChart',
            'containerHeight':400, 
            'containerWidth': 700, 
            }, hamCountyAir, 
            "Percentage of Major Air Pollutants per Year", 
            "#airLineChartLegend", 
            airLegendKeys, airColors);

        console.log("second chart complete");

        let AQIBarChart = new BarChart({
            'parentElement': "#aqiBarChart", 
            'containerHeight': 400, 
            'containterWidth': 600, 
        }, hamCountyDays)

        console.log("third chart complete");

        let AQIAirChart = new BarChart({
            'parentElement': "#airBarChart",
            'containerHeight': 400, 
            'containerWidth': 600,
        }, hamCountyAir)

        console.log("fourth chart complete")

        console.log("All chart visualizations have been created!");
})
.catch(error => {
    console.error('Error loading the data');
});



