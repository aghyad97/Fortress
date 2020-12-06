// client-side javascript

$(function () {
  $('#logoutButton').click(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/logout',
      success: function (data) {
        window.location.href = '/';       
      },
    });
  });
});