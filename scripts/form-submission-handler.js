function validEmail(email) { // see:
  // var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  // return re.test(email);
  return true;
}

function validateHuman(honeypot) {
  if (honeypot) { //if hidden form filled up
    console.log("Robot Detected!");
    return true;
  } else {
    console.log("Welcome Human!");
  }
}

// get all data in form and return object
function getFormData() {
  var form = document.getElementById("gform");
  var elements = form.elements; // all form elements
  var fields = Object.keys(elements).map(function(k) {
    if (elements[k].name !== undefined) {
      return elements[k].name;
      // special case for Edge's html collection
    } else if (elements[k].length > 0) {
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  console.log(fields);

  fields.forEach(function(k) {
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
    // it to be appended to for each item in the loop
    if (elements[k].type === "checkbox") { // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append
      // the current checked value to
      // the end of it, along with
      // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space
      // from the  string to make the output
      // prettier in the spreadsheet
    } else if (elements[k].length) {
      for (var i = 0; i < elements[k].length; i++) {
        if (elements[k].item(i).checked) {
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });

  // add form-specific values into the data
  data.formDataNameOrder = JSON.stringify(fields);
  data.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
  data.formGoogleSendEmail = form.dataset.email || ""; // no email by default

  console.log(data);
  return data;
}

function handleFormSubmit(event) { // handles form submit withtout any jquery
  event.preventDefault(); // we are submitting via xhr below
  var data = getFormData(); // get the values submitted in the form

  // OPTION: Remove this comment to enable SPAM prevention, see README.md
  if (validateHuman(data.honeypot)) { //if form is filled, form will not be submitted
    return false;
  }


  if (!validEmail(data.email)) { // if email is not valid show error
    document.getElementById('email-invalid').style.display = 'block';
    return false;
  } else {
    var url = event.target.action; //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      console.log(xhr.status, xhr.statusText)
      console.log(xhr.responseText);
      document.getElementById('gform').style.display = 'none'; // hide form
      document.getElementById('thankyou_message').style.display = 'block';
      return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
  }
}

function loaded() {
  console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  var form = document.getElementById('gform');
  form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);



var user = $.get('https://ipinfo.io/json', function (response) {
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
      var selected = $('#state').find(":selected").val()
      console.log(selected)
      $('#cong-dist').attr("src", '/images/congressional_district_plots/' + selected + '_cong_dist.png')
      $('#clusters').attr("src", '/images/best_plots/' + selected + '.png')

    })

    var button = document.getElementById('next')
    button.addEventListener("click", handleFormNext, false)

  })
})

function handleFormNext(event) { // handles form submit withtout any jquery
  event.preventDefault(); // we are submitting via xhr below
  var data = getFormData(); // get the values submitted in the form

  if (validateHuman(data.honeypot)) { // if form is filled, form will not be submitted
    return false;
  }

  console.log(data.state)
  $('#cong-dist').attr("src", '/images/congressional_district_plots/' + data.state + '_cong_dist.png')
  $('#clusters').attr("src", '/images/best_plots/' + data.state + '.png')

  $('#submit').css('display', 'initial')
  $('#radio').css('display', 'initial')
  $('#next').css('display', 'none')
  $('#state').css('display', 'none')
  $('#label-state').css('display', 'none')


}
