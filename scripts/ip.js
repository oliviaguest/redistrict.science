var user = $.get('https://ipinfo.io?token=f26b5ab20fec6f', function (response) {
  document.getElementById('city').value = response.city
  document.getElementById('country').value = response.country
  document.getElementById('hostname').value = response.hostname
  document.getElementById('ip').value = response.ip
  document.getElementById('loc').value = response.loc
  document.getElementById('org').value = response.org
  document.getElementById('postal').value = response.postal
  document.getElementById('region').value = response.region
}, 'jsonp')

user.always(function (res) {
  // console.log(res);
  $.getJSON('/json/states_hash.json', function (dict) {
    // BUG
    // BUG: This should be deleted for primetime!!!
    $('#feedback').css('display', 'initial')
    // BUG
    // BUG
    var key = 0
    // console.log(res);
    for (key in dict) {
      var value = dict[key]
      $('#state').append($('<option/>').attr('value', key).text(dict[key] + ' (' + key + ')'))
      if (res.region == dict[key]) {
        $('#state').val(key)
        $('#feedback').css('display', 'initial')
      }
    }

    $('#state').change(function () {
      console.log($('#state').find(":selected").val())

    })

    var form = document.getElementById('gform')
    form.addEventListener("click", handleFormNext, false)

  })
})

function handleFormNext(event) { // handles form submit withtout any jquery
  event.preventDefault(); // we are submitting via xhr below
  if (validateHuman(data.honeypot)) { // if form is filled, form will not be submitted
    return false;
  }
  console.log('bloop next')
}
