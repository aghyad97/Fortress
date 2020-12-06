$(function () {

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

  // sensor data
  window.setInterval(function () {

  }, 5000);

  // notifications
  window.setInterval(function () {

  }, 1000);


  // pictures of the camera
  $("#getImages").click(function () {
    console.log($('#picturesTime').val());
    if(!isNaN(parseInt($('#picturesTime').val()))){
      $.ajax({
        type: 'GET',
        url: '/api/getimages?limit=' +  parseInt($('#picturesTime').val()),
        success: function (data) {
          console.log();
          let json = JSON.parse(data['data']);
          new Splide( '.splide' ).mount();
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