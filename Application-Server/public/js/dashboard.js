var wsbroker = "broker.hivemq.com"; //mqtt websocket enabled broker
var wsport = 8000 // port for above
google.charts.load('current', {
  'packages': ['corechart']
});
// create client using the Paho library
var client = new Paho.MQTT.Client(wsbroker, wsport, "clientId");
var options = {
  timeout: 3,
  onSuccess: function () {
    console.log("mqtt connected");
    client.subscribe("project/images", {
      qos: 1
    });
    client.subscribe("project/foundperson", {
      qos: 1
    });
  },
  onFailure: function (message) {
    console.log("Connection failed: " + message.errorMessage);
  },
};

function drawChart(data) {
  var data = google.visualization.arrayToDataTable(data);

  var options = {
    title: 'Values are with respect to time',
    curveType: 'function',
    legend: {
      position: 'bottom'
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById('sensorDataCanvas'));

  chart.draw(data, options);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
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


  sleep(500).then(() => {
    $.ajax({
      type: 'GET',
      url: '/api/getSensorValue?limit=1',
      success: function (values) {
        let valuesJson = JSON.parse(values.data);
        let array = new Array();
        let a = ['time', 'x', 'y', 'z', 'proximity'];
        array.push(a);
        for (let index = 0; index < valuesJson.length; index++) {
          const dataTypeX = valuesJson[index]['x'];
          const dataTypeY = valuesJson[index]['y'];
          const dataTypeZ = valuesJson[index]['z'];
          const dataTypeProximity = valuesJson[index]['proximity'];
          const dataTypeTime = valuesJson[index]['createdAt'];
          a = [dataTypeTime, dataTypeX, dataTypeY, dataTypeZ, dataTypeProximity]
          array.push(a);
        }
        console.log(array);
        drawChart(array);
      },
    });
  });


  $.ajax({
    type: 'GET',
    url: '/api/getimages?isPredict=true&limit=1',
    success: function (data) {
      let json = JSON.parse(data['data']);
      $('.predictedImage').append('<img class="col-lg-12 col-12" src="data:image/png;base64, ' + json[0]['image'] + '"/>');
    },
  });

  client.onMessageArrived = function (message) {
    console.log(message);
    if (message.destinationName == "project/images") {
      var data = JSON.parse(message.payloadString);
      let isPredict = data['isPredict'];
      console.log(isPredict);
      let email = data['email'];
      console.log(email);
      let cookieEmail = getCookie(email);
      console.log(cookieEmail);
      if (isPredict && email === cookieEmail) {
        $('.predictedImage').empty();
        $('.predictedImage').append('<img src="data:image/png;base64, ' + data['image'] + '"/>');
      }
    } else if (message.destinationName == "project/foundperson") {
      $('.notifcationsMessages').append('<p>Found person at ' + Date(Number(message.payloadString)) + '</p>');
    }
  };
  // toggle systemdestinationName == 
  $("#system-toggle").click(function () {
    $.ajax({
      type: 'POST',
      data: $('#system-toggle').is(":checked"),
      url: '/api/togglesystem',
      success: function (data) {
        console.log('success');
        if ($('#system-toggle').is(":checked")) {
          $('#system-status').removeClass('card-header-danger');
          $('#system-status').addClass('card-header-success');
        } else {
          $('#system-status').removeClass('card-header-success');
          $('#system-status').addClass('card-header-danger');
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
  }, 15000);




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
          if (dataType == null || dataType === 'all') {
            let a = ['time', 'x', 'y', 'z', 'proximity'];
            array.push(a);
            for (let index = 0; index < valuesJson.length; index++) {
              const dataTypeX = valuesJson[index]['x'];
              const dataTypeY = valuesJson[index]['y'];
              const dataTypeZ = valuesJson[index]['z'];
              const dataTypeProximity = valuesJson[index]['proximity'];
              const dataTypeTime = valuesJson[index]['createdAt'];
              a = [dataTypeTime, dataTypeX, dataTypeY, dataTypeZ, dataTypeProximity]
              array.push(a);
            }
          } else if (dataType === 'accelerometer') {
            let a = ['time', 'x', 'y', 'z'];
            array.push(a);
            for (let index = 0; index < valuesJson.length; index++) {
              const dataTypeX = valuesJson[index]['x'];
              const dataTypeY = valuesJson[index]['y'];
              const dataTypeZ = valuesJson[index]['z'];
              const dataTypeTime = valuesJson[index]['createdAt'];
              a = [dataTypeTime, dataTypeX, dataTypeY, dataTypeZ]
              array.push(a);
            }
          } else {
            let a = ['time', dataType];
            array.push(a);

            for (let index = 0; index < valuesJson.length; index++) {
              const dataTypeValue = valuesJson[index][dataType];
              const dataTypeTime = valuesJson[index]['createdAt'];
              // dict = {
              //   x: Date.parse(dataTypeTime),
              //   y: dataTypeValue
              // }
              a = [dataTypeTime, dataTypeValue]
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