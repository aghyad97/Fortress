$(function () {
  $('#registerButton').click(function (e) {
    $('#registerButton').addClass('disabled');
    $('#registerButton').attr('disabled', true);
    e.preventDefault();
    $.ajax({
      type: 'post',
      data: $('#register').serialize(),
      url: '/register',
      success: function (data) {
        console.log('success');
        $('#fullNameHelp').text('');
        $('#passwordHelp').text('');
        $('#emailHelp').text('');
        console.log(JSON.stringify(data));
        $('#alert').text('Congratulations, your account has been successfully created. Redirecting to login...').css('visibility', 'visible').delay(5000);
        window.setTimeout(function() { window.location.replace("/login") }, 3000);
      },
      error: function (jqXHR, exception) {
        var msg;
        if (jqXHR.status === 0) {
          msg = jqXHR.responseJSON;
          $('#fullNameHelp').text(msg);
          $('#emailHelp').text(msg);
          $('#passwordHelp').text(msg);
        } else if (jqXHR.status == 400) {
          msg = jqXHR.responseJSON;
          console.log(msg);
          console.log($.trim($('#fullName').val()));
          console.log($.trim($('#email').val()));
          if ($.trim($('#email').val()) != '') {
            console.log('212121');
            $('#emailHelp').text(msg['data'][0]['msg']);
          } else if ($.trim($('#fullName').val()) == '' && $.trim($('#email').val()) != '' && $.trim($('#password').val()) != '') {
            $('#fullNameHelp').text(msg['data'][0]['msg']);
            $('#emailHelp').text('');
            $('#passwordHelp').text('');
          } else if ($.trim($('#fullName').val()) != '' && $.trim($('#email').val()) == '' && $.trim($('#password').val()) != '') {
            $('#fullNameHelp').text('');
            $('#emailHelp').text(msg['data'][0]['msg']);
            $('#passwordHelp').text('');
          } else if ($.trim($('#fullName').val()) != '' && $.trim($('#email').val()) != '' && $.trim($('#password').val()) == '') {
            $('#fullNameHelp').text('');
            $('#emailHelp').text('');
            $('#passwordHelp').text(msg['data'][0]['msg']);
          } else {
            $('#fullNameHelp').text(msg['data'][0]['msg']);
            $('#emailHelp').text(msg['data'][2]['msg']);
            $('#passwordHelp').text(msg['data'][3]['msg']);
          }
        } else if (jqXHR.status == 401) {
          msg = jqXHR.responseJSON;
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
        $('#registerButton').removeClass('disabled');
        $('#registerButton').attr('disabled', false);
      }
    });
  });
});