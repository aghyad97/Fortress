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

  client.onMessageArrived = function (message) {
    console.log(message);
    var json = JSON.parse(message.payloadString);
    console.log(json);
    alert(json);
    $.ajax({
      type: 'GET',
      url: '/api/getimages?isPredict=true',
      success: function (data) {
        new Splide( '.splide1' ).mount();
        console.log();
        let json = JSON.parse(data['data']);
        for ( var i = 0, len = json.length; i < len; i++ ) {
          $('.splide__list1').append('<li class="splide__slide1"><div class="splide__slide__container"><img src="data:image/png;base64, ' + json[i]['image'] + '"/></div></li>')
        }
      },
    });
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
  $("#getImages").click(function () {
    console.log($('#picturesTime').val());
    if(!isNaN(parseInt($('#picturesTime').val()))){
      $.ajax({
        type: 'GET',
        url: '/api/getimages?limit=' +  parseInt($('#picturesTime').val()),
        success: function (data) {
          new Splide( '.splide' ).mount();
          let json = JSON.parse(data['data']);
          for ( var i = 0, len = json.length; i < len; i++ ) {
            $('.splide__list').append('<li class="splide__slide"><div class="splide__slide__container"><img src="data:image/png;base64, ' + json[i]['image'] + '"/></div></li>')
          }
        },
      });
    } else {
      alert('Please enter a valid number');
    }
  });


  // predicted images
  // window.setInterval(function () {
  //   $.ajax({
  //     type: 'GET',
  //     url: '/api/getimages?limit=' +  parseInt($('#picturesTime').val()),
  //     success: function (data) {
  //       console.log();
  //       let json = JSON.parse(data['data']);
  //       new Splide( '.splide' ).mount();
  //       for ( var i = 0, len = json.length; i < len; i++ ) {
  //         $('.splide__list').append('<li class="splide__slide"><div class="splide__slide__container"><img src="data:image/png;base64, ' + json[i]['image'] + '"/></div></li>')
  //       }
  //     },
  //   });
  // }, 5000);

});