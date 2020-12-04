$(function () {
  $('#registerButton').click(function (e) {
    e.preventDefault();

    var data = {};
    data.fullName = $('#fullName').val();
    data.email = $('#email').val();
    data.password = $('#password').val();
    console.log(JSON.stringify(data));
    $.ajax({
      type: 'post',
      data: JSON.stringify(data),
      url: '/register',
      success: function (data) {
        console.log('success');
        console.log(JSON.stringify(data));
      },
      error: function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
          msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 400) {
          msg = 'Requested page not found. [400]' + jqXHR.responseText;
        } else if (jqXHR.status == 401) {
          msg = 'Requested page not found. [401]' + jqXHR.responseText;
        } else if (jqXHR.status == 404) {
          msg = 'Requested page not found. [404]' +jqXHR.responseText;
        } else if (jqXHR.status == 500) {
          msg = 'Internal Server Error [500].' +jqXHR.responseText;
        } else if (exception === 'parsererror') {
          msg = 'Requested JSON parse failed.' +jqXHR.responseText;
        } else if (exception === 'timeout') {
          msg = 'Time out error.' +jqXHR.responseText;
        } else if (exception === 'abort') {
          msg = 'Ajax request aborted.' +jqXHR.responseText;
        } else {
          msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log(msg);
      },
    });
  });
});