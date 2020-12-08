$(function () {
  $('#loginButton').click(function (e) {
    $('#loginButton').addClass('disabled');
    $('#loginButton').attr('disabled', true);
    e.preventDefault();
    $.ajax({
      type: 'POST',
      data: $('#login').serialize(),
      url: '/login',
      success: function (data) {
        console.log('success');
        console.log(data['data']['token']);
        window.location.href = '/dashboard';       
      },
      error: function (jqXHR, exception) {
        var msg;
        if (jqXHR.status === 0) {
          msg = jqXHR.responseJSON;
        } else if (jqXHR.status == 400) {
          msg = jqXHR.responseJSON;
          if ($.trim($('#email').val()) == '' && $.trim($('#password').val()) != '') {
            $('#emailHelp').text(msg['data'][0]['msg']);
            $('#passwordHelp').text('');
          } else if (!$.trim($('#email').val()) == '' && $.trim($('#password').val()) == '') {
            $('#emailHelp').text('');
            $('#passwordHelp').text(msg['data'][0]['msg']);
          } else {
            $('#emailHelp').text(msg['data'][0]['msg']);
            $('#passwordHelp').text(msg['data'][2]['msg']);
          }
        } else if (jqXHR.status == 401) {
          $('#emailHelp').text('');
          msg = jqXHR.responseJSON;
          $('#passwordHelp').text(msg['message']);
        } else if (jqXHR.status == 404) {
          msg = jqXHR.responseJSON;
        } else if (jqXHR.status == 500) {
          msg = jqXHR.responseJSON;
        } else if (exception === 'parsererror') {
          msg = jqXHR.responseJSON;
        } else if (exception === 'timeout') {
          msg = jqXHR.responseJSON;
        } else if (exception === 'abort') {
          msg = jqXHR.responseJSON;
        } else {
          msg = jqXHR.responseJSON;
        }
      },
      complete: function (jqXHR, textStatus) {
        $('#loginButton').removeClass('disabled');
        $('#loginButton').attr('disabled', false);
      }
    });
  });
});