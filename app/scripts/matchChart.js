 var createPieChart = function(pieChartName, data) {

 // var chart = dc.pieChart("#pieChart1");
 var chart = dc.pieChart("#"+pieChartName);

    //data = totalDamageDealtArray
    //static data array for now
    // var totalDamageDealtArray = [
    //       {
    //         "championId" : 78,
    //         "totalDamageDealt" : 11111
    //       },
    //       {
    //         "championId" : 71,
    //         "totalDamageDealt" : 33333
    //       },
    //       {
    //         "championId" : 72,
    //         "totalDamageDealt" : 80000
    //       },
    //       {
    //         "championId" : 73,
    //         "totalDamageDealt" : 22345
    //       },
    //       {
    //         "championId" : 74,
    //         "totalDamageDealt" : 33421
    //       },
    //       {
    //         "championId" : 75,
    //         "totalDamageDealt" : 11245
    //       },
    //       {
    //         "championId" : 76,
    //         "totalDamageDealt" : 4794
    //       },
    //       {
    //         "championId" : 77,
    //         "totalDamageDealt" : 23545
    //       },
    //       {
    //         "championId" : 79,
    //         "totalDamageDealt" : 60075
    //       },
    //       {
    //         "championId" : 70,
    //         "totalDamageDealt" : 37545
    //       }
    //     ];

    var ndx = crossfilter(data);

    //Dimension and Group for damage dealt by champion Pie Chart
    var damageDim = ndx.dimension(function(d){return "champion "+d.championId+"'s total damage dealt:"+d.totalDamageDealt;});
    var damageGroup = damageDim.group().reduceSum(function(d) {return d.totalDamageDealt;});

    //Custom Styling for Tool Tip for Pie Chart #1
    var pieTip1 = d3.tip()
      .attr('class','d3-tip')
      .offset([-10,0])
      .html(function (d) { return "<span style='color: #3369ff'>" +  d.data.key + "</span> : "  + d.data.value; });

    chart.width(450)
             .height(400)
             .transitionDuration(1000)
             .dimension(damageDim)
             .group(damageGroup)
             .radius(180)
             .innerRadius(0)
             .minAngleForLabel(0)
             .renderLabel(false)
             .title(function(d){return d.key;});

    dc.renderAll();

    d3.selectAll(".pie-slice").call(pieTip1);
                  d3.selectAll(".pie-slice").on('mouseover', pieTip1.show)
                      .on('mouseout', pieTip1.hide);

}