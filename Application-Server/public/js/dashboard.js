var wsbroker = "broker.hivemq.com"; //mqtt websocket enabled broker
var wsport = 443 // port for above
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
// create client using the Paho library
var client = new Paho.MQTT.Client(wsbroker, wsport, "clientId");
var options = {
  timeout: 3,
  onSuccess: function () {
    console.log("mqtt connected");
    client.subscribe("project/images", {
      qos: 1
    });
  },
  onFailure: function (message) {
    console.log("Connection failed: " + message.errorMessage);
  }
};

function drawChart(data) {
  var data = google.visualization.arrayToDataTable(data);

  var options = {
    title: 'Values are with respect to time',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('sensorDataCanvas'));

  chart.draw(data, options);
}

$(function () {
  client.connect(options);
  $.ajax({
    type: 'GET',
    url: '/api/getimages',
    success: function (data) {
      console.log();
      let json = JSON.parse(data['data']);
      for (var i = 0, len = json.length; i < len; i++) {
        $('.splide__list').append('<li class="splide__slide text-center"><div class="splide__slide__container"><img src="data:image/png;base64, ' + json[i]['image'] + '"/></div></li>')
      }
      splide.refresh();
    },
  });

  client.onMessageArrived = function (message) {
    console.log(message);
    $('.notifcationsMessages').append('<p>Found person at ' + message + '</p>');
  };
  // toggle system
  $("#system-toggle").click(function () {
    $.ajax({
      type: 'POST',
      data: $('#system-toggle').is(":checked"),
      url: '/api/togglesystem',
      success: function (data) {
        console.log('success');
        if ($('#system-toggle').is(":checked")) {
          alert('System is ON');
        } else {
          alert('System is OFF');
        }
      },
    });
  });
  // pictures of the camera
  var splide = new Splide('.splide', {
    type: 'loop',
    autoplay: true,
  }).mount();
  $("#getImages").click(function () {
    console.log($('#picturesTime').val());
    //$( ".splide__list" ).empty();
    if (!isNaN(parseInt($('#picturesTime').val()))) {
      $(".splide__list").empty();
      $.ajax({
        type: 'GET',
        url: '/api/getimages?limit=' + parseInt($('#picturesTime').val()),
        success: function (data) {
          let json = JSON.parse(data['data']);
          for (var i = 0, len = json.length; i < len; i++) {
            $('.splide__list').append('<li class="splide__slide text-center"><div class="splide__slide__container"><img src="data:image/png;base64, ' + json[i]['image'] + '"/></div></li>')
          }
          splide.refresh();
        },
      });
    } else {
      alert('Please enter a valid number');
    }
  });


  // predicted images
  window.setInterval(function () {
    $(".splide__list").empty();
    $.ajax({
      type: 'GET',
      url: '/api/getimages',
      success: function (data) {
        console.log();
        let json = JSON.parse(data['data']);
        for (var i = 0, len = json.length; i < len; i++) {
          $('.splide__list').append('<li class="splide__slide text-center"><div class="splide__slide__container"><img src="data:image/png;base64, ' + json[i]['image'] + '"/></div></li>')
        }
        splide.refresh();
      },
    });
  }, 5000);


  $("#getSensorData").click(function () {
    let dataType = $('#sensorDataType[name="sensorDataType"]:checked').val();
    console.log(dataType);
    if (!isNaN(parseInt($('#sensorData').val()))) {
      $.ajax({
        type: 'GET',
        url: '/api/getSensorValue?limit=' + parseInt($('#sensorData').val()),
        success: function (values) {
          let valuesJson = JSON.parse(values.data);
          let array = new Array();
          if(dataType == null || dataType === 'all'){
            let a = ['time', 'x', 'y', 'z', 'proximity'];
            array.push(a);
            for (let index = 0; index < valuesJson.length; index++) {
              const dataTypeX = valuesJson[index]['x'];
              const dataTypeY = valuesJson[index]['y'];
              const dataTypeZ = valuesJson[index]['z'];
              const dataTypeProximity = valuesJson[index]['proximity'];
              const dataTypeTime = valuesJson[index]['createdAt'];
              // dict = {
              //   x: Date.parse(dataTypeTime),
              //   y: dataTypeValue
              // }
              a = [Date.parse(dataTypeTime), dataTypeX, dataTypeY, dataTypeZ, dataTypeProximity]
              array.push(a);
            }
          } else {
            console.log('21212');
            let a = ['time', dataType];
            array.push(a);

            for (let index = 0; index < valuesJson.length; index++) {
              const dataTypeValue = valuesJson[index][dataType];
              const dataTypeTime = valuesJson[index]['createdAt'];
              // dict = {
              //   x: Date.parse(dataTypeTime),
              //   y: dataTypeValue
              // }
              a = [Date.parse(dataTypeTime), dataTypeValue]
              array.push(a);
            }
          }
          drawChart(array);
        },
      });
    } else {
      alert('Please enter a valid number');
    }
  });

});

// var ctx = $('#sensorDataCanvas');
//           new Chart(ctx, {
//             type: 'line',
//             data: [
//               {
//                 x: Date.now(),
//                 y: 1
//               },{
//                 x: Date.now(),
//                 y: 2
//               },{
//                 x: Date.now(),
//                 y: 3
//               }
//             ],
//             options: {
//               title: {
//                 display: true,
//                 text: dataType + ' values along with time axis'
//               },
//               scales: {
//                 yAxes: [{
//                   ticks: {
//                     beginAtZero: true,
//                   }
//                 }],
//                 xAxes: [{
//                   ticks: {
//                     beginAtZero: true,
//                   }
//                 }]
//               }
//             }
//           });