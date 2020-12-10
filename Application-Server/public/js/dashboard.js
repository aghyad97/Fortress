var wsbroker = "broker.hivemq.com"; //mqtt websocket enabled broker
var wsport = 443 // port for above

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

$(function () {
  client.connect(options);
  $.ajax({
    type: 'GET',
    url: '/api/getimages',
    success: function (data) {
      console.log();
      let json = JSON.parse(data['data']);
      for ( var i = 0, len = json.length; i < len; i++ ) {
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
  var splide = new Splide( '.splide' , {
    type        : 'loop',
    autoplay    : true,
  }).mount();
  $("#getImages").click(function () {
    console.log($('#picturesTime').val());
    //$( ".splide__list" ).empty();
    if(!isNaN(parseInt($('#picturesTime').val()))){       
      $( ".splide__list" ).empty();
      $.ajax({
        type: 'GET',
        url: '/api/getimages?limit=' +  parseInt($('#picturesTime').val()),
        success: function (data) {
          let json = JSON.parse(data['data']);
          for ( var i = 0, len = json.length; i < len; i++ ) {
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
    $( ".splide__list" ).empty();
    $.ajax({
      type: 'GET',
      url: '/api/getimages',
      success: function (data) {
        console.log();
        let json = JSON.parse(data['data']);
        for ( var i = 0, len = json.length; i < len; i++ ) {
          $('.splide__list').append('<li class="splide__slide text-center"><div class="splide__slide__container"><img src="data:image/png;base64, ' + json[i]['image'] + '"/></div></li>')
        }
        splide.refresh();
      },
    });
  }, 5000);


  $("#getSensorData").click(function () {
    let dataType = $('#sensorDataType[name="sensorDataType"]:checked').val();
    console.log(dataType);
    if(!isNaN(parseInt($('#sensorData').val()))){       
      $.ajax({
        type: 'GET',
        url: '/api/getSensorValue?limit=' +  parseInt($('#sensorData').val()),
        success: function (data) {
          console.log(data);
          var ctx = document.getElementById('sensorDataCanvas').getContext('2d');
          var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [{
                      x: new Date(),
                      y: 1
                    }, {
                      t: new Date(),
                      y: 10
                    }],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
                }
            }
        });
        },
      });
    } else {
      alert('Please enter a valid number');
    }
  });

});