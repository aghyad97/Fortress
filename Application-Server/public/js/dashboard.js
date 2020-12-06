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
  // window.setInterval(function () {
  //   $.ajax({
  //     type: 'GET',
  //     data: $('#').val(),
  //     url: '/api/getimages',
  //     success: function (data) {
  //       console.log('success');
  //     },
  //   });
  // }, 15000);

  // predicted images
  // window.setInterval(function () {
  //   $.ajax({
  //     type: 'GET',
  //     data: $('#').val(),
  //     url: '/api/getimages',
  //     success: function (data) {
  //       console.log('success');
  //     },
  //   });
  // }, 5000);

});