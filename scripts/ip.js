$.get('https://ipinfo.io/json', function(response) {
  $('#ip').html('IP: ' + response.ip);
  $('#address').html('Location: ' + response.city + ', ' + response.region);
  $('#details').html(JSON.stringify(response, null, 4));

  console.log(response);
}, 'jsonp');
