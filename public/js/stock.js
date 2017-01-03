/**
 * Created by Iaroslav Zhbankov on 02.01.2017.
 */
var colors = ['#FF5733', '#FFC733', '#83FF33', '#33FFF6', '#3393FF', '#5533FF', '#DD33FF', '#FF336E', '#FF3333', '#33FF99', '#857347', '#47856F'];
function getLastYearTime() {
    var date = new Date();
    var year = +(date.getFullYear());
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day;
}
var endDate = getLastYearTime();
var xmlHttp = new XMLHttpRequest();
var url = 'http://localhost:3000/stock';
xmlHttp.open("GET", url, false);
xmlHttp.send(null);
var dataSet = JSON.parse(xmlHttp.responseText);
$(".add_stock").on("click", function () {
    var xmlHttp = new XMLHttpRequest();
    var url = 'http://localhost:3000/addstock/' + $('.stockname').val() + '/2014-01-01/' + endDate;
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    location.reload();
    socket.emit('change');
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
            backgroundColor: colors[i],
            borderColor: colors[i],
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: colors[i],
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: colors[i],
            pointHoverBorderColor: colors[i],
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
        socket.emit('change');
    });

});

//var socket = io('http://localhost:3000');
var socket = io('https://ystockmarket.herokuapp.com');
socket.on('connect', function () {
    console.log('connected to the server')
});
socket.on('update', function () {
    location.reload();
});




