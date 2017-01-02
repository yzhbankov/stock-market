/**
 * Created by Iaroslav Zhbankov on 02.01.2017.
 */
var xmlHttp = new XMLHttpRequest();
var url = 'http://localhost:3000/stock';
xmlHttp.open("GET", url, false);
xmlHttp.send(null);
var dataSet = JSON.parse(xmlHttp.responseText);

var fullData = dataSet.dataset.data;
var dataX = [];
var dataY = [];
fullData.forEach(function (item, index) {
    dataX.push(item[0]);
    dataY.push(item[1]);
});

var ctx = document.getElementById("myChart").getContext("2d");

var data = {
    labels: dataX,
    datasets: [
        {
            label: "My First dataset",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: dataY,
            spanGaps: false
        }, {
            label: "My Second dataset",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: dataY,
            spanGaps: false
        }
    ]
};

var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        scales: {
            xAxes: [{
                display: false
            }]
        }
    }
});