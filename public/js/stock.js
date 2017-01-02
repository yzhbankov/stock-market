/**
 * Created by Iaroslav Zhbankov on 02.01.2017.
 */

var xmlHttp = new XMLHttpRequest();
var url = 'http://localhost:3000/stock';
xmlHttp.open("GET", url, false);
xmlHttp.send(null);
var dataSet = JSON.parse(xmlHttp.responseText);
$(".add_stock").on("click", function () {
    var xmlHttp = new XMLHttpRequest();
    var url = 'http://localhost:3000/addstock/' + $('.stockname').val() + '/2014-01-01/2016-12-31';
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    location.reload();
});

function getSetOfXY(objec) {
    var xData = [];
    var yData = [];
    objec.forEach(function (item, index) {
        item.data.forEach(function (item, index) {
            xData.push(item[0]);
            yData.push(item[1]);
        });
        item['x-data'] = xData;
        xData = [];
        item['y-data'] = yData;
        yData = [];
    });
}
getSetOfXY(dataSet);


var ctx = document.getElementById("myChart").getContext("2d");

var data = {
    labels: dataSet[0]['x-data'].reverse(),
    datasets: []
};

for (var i = 0; i < dataSet.length; i++) {

    data.datasets.push(
        {
            label: dataSet[i].stockname,
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
            data: dataSet[i]['y-data'].reverse(),
            spanGaps: false
        }
    );
}

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


var labels = document.querySelector(".labels-js");
for (var i = 0; i < dataSet.length; i++) {
    var label = document.createElement("div");
    label.setAttribute('class', 'col-md-3 labelElement');
    var labelName = document.createElement("div");
    var labelDescription = document.createElement("div");
    var deleteButton = document.createElement("button");
    deleteButton.innerText = 'delete';
    deleteButton.setAttribute('data-name', dataSet[i].stockname);
    deleteButton.setAttribute('class', 'btn btn-default');
    deleteButton.setAttribute('id', 'delete');
    labelName.innerText = dataSet[i].stockname;
    labelDescription.innerText = dataSet[i].stockDescription;
    label.appendChild(labelName);
    label.appendChild(labelDescription);
    label.appendChild(deleteButton);
    labels.appendChild(label);
}

var deleteButtons = document.querySelectorAll('#delete');
deleteButtons.forEach(function (item, index) {
    item.addEventListener('click', function () {
        var xmlHttp = new XMLHttpRequest();
        var url = 'http://localhost:3000/deletestock/' + item.getAttribute('data-name');
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        location.reload();
    });

});