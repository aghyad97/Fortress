$(function () {
  $('#loginButton').click(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      data: $('#login').serialize(),
      url: '/login',
      success: function (data) {
        console.log('success');
        console.log(JSON.stringify(data));
      },
      error: function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
          msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 400) {
          msg = 'Requested page not found. [400]';
        } else if (jqXHR.status == 401) {
          msg = 'Requested page not found. [401]';
        } else if (jqXHR.status == 404) {
          msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
          msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
          msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
          msg = 'Time out error.';
        } else if (exception === 'abort') {
          msg = 'Ajax request aborted.';
        } else {
          msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log(msg);
      },
    });
  });
});