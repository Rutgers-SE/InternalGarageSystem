"use strict";
google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(init);


function init() {
  var options = {
    // animation:{
    //   duration: 1000,
    //   easing: 'out',
    // },
    vAxis: {minValue:0, maxValue:500}
  };

  var data = new google.visualization.DataTable();

  $.get('/api/spaceData', function (d) {
    data.addColumn('number', 'x');
    data.addColumn('number', 'y');
    for (let pair of d) {
      data.addRow(pair);
    }

    var chart = new google.visualization.ColumnChart(
      document.getElementById('visualization'));
    var button = document.getElementById('b1');

    function drawChart() {
      console.log("Drawing the chart");
      // Disabling the button while the chart is drawing.
      button.disabled = true;
      google.visualization.events.addListener(chart, 'ready',
                                              function() {
                                                button.disabled = false;
                                              });
      chart.draw(data, options);
    }

    button.onclick = function() {
      $.get('/api/spaceData', function (d) {
        for (let pair in d) {
          data.getValue(d[pair[0]]);
          data.setValue(d[pair[0]], pair[1]);
        }
        drawChart();
      });
    }
    drawChart();
  });
}


