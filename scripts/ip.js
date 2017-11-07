var user = $.get('https://ipinfo.io/json', function(response) {
  // $('#ip').html('IP: ' + response.ip);
  // $('#address').html('Location: ' + response.city + ', ' + response.region);
  // $('#details').html(JSON.stringify(response, null, 4));
  //


  document.getElementById('city').value = response.city;
  document.getElementById('country').value = response.country;
  document.getElementById('hostname').value = response.hostname;
  document.getElementById('ip').value = response.ip;
  document.getElementById('loc').value = response.loc;
  document.getElementById('org').value = response.org;
  document.getElementById('postal').value = response.postal;
  document.getElementById('region').value = response.region;


}, 'jsonp');

user.always(function(res) {
  console.log(res);
  $.getJSON('/json/states_hash.json', function(dict) {
      // console.log(res); // this will show the info it in firebug console
        for (key in dict) {
          var value = dict[key];
          $('#state').append($('<option/>').attr('value', key).text(dict[key] + ' (' + key + ')'));
          if (res.region == dict[key]) {
            $('#state').val(key);
            $('#feedback').css('display','inherit');
          }
        }




  });
});

// // Put state names into the drop down list:
// fetch(
//   '/json/states_hash.json'
// ).then(
//   function(res) {
//     res.json().then(function(dict) {
//       for (key in dict) {
//         var value = dict[key];
//         $('#state').append($('<option/>').attr('value', key).text(dict[key] + ' (' + key + ')'));
//
//       }
//     });
//
//   }
// )
