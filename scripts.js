<script
  src="https://code.jquery.com/jquery-3.6.3.min.js"
  integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU="
  crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
<script src="https://www.google.com/recaptcha/api.js" async></script>
<script>
function showAlert(alert, type) {
  if (!alert) return

  if (type === 'SUCCESS') {
    alert.textContent = alert.dataset.successMessage || 'Your message has been sent'
    alert.classList.remove('afd-message--error')
    alert.classList.add('afd-message--success')
  } else {
    alert.textContent = alert.dataset.errorMessage || 'There was an error, please try again later'
    alert.classList.remove('afd-message--success')
    alert.classList.add('afd-message--error')
  }

  alert.classList.remove('hide')
}

function showSuccessMessage () {
  var message = document.getElementById('success-message')
  var contactContainer = document.getElementById('contact-container')
  message && (message.style.display = 'flex')
  contactContainer.style.display = 'none'
}

document.addEventListener('DOMContentLoaded', function () {
  var location = window.location.search
  var params = new URLSearchParams(location)
  if (params.get('submit')) return showSuccessMessage()

  const countrySelect = document.querySelector('.chosen-select')
  fetch('https://assets.adsttc.com/business-site/countries-en.json')
  	.then(res => res.json())
    .then(countries => {
    	const choices = new Choices(countrySelect, {
        choices: countries
      })
    })
});

var EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validateField (name, value) {
  if (value === "") return false;

  if (name === "email") {
    return EMAIL_REGEX.test(value);
  }

  return true;
}

window.addEventListener('load', function () {
  var submitBtn = document.getElementById("advertising-submit")
  var privacyPolicy = document.getElementById("privacy-policy")

  $('.js-advertise-field > input, .js-advertise-field > select, .js-advertise-field > textarea').on('blur change', function () {
    var formElement = this;
    var fieldName = formElement.name;
    var isValid = validateField(fieldName, formElement.value)

    formElement.closest(".js-advertise-field").classList.toggle("has-error", !isValid);
  })

  privacyPolicy.addEventListener("change", function (e) {
    submitBtn.disabled = !this.checked;
  })

  submitBtn.addEventListener("click", function (e) {
    var formElements = document.querySelectorAll(".js-advertise-field > input, .js-advertise-field > select, .js-advertise-field > textarea");

    var isEverythingValid = Array.from(formElements).reduce(function (isFormValid, el) {
      var isElementValid = validateField(el.name, el.value);
      el.closest(".js-advertise-field").classList.toggle("has-error", !isElementValid);

      return isFormValid && isElementValid
    }, true)

    // At least one interest should be marked
    var interestContainer = document.querySelector(".advertise-interest")
    var interestMarked = interestContainer.querySelectorAll("input[type=checkbox]:checked").length > 0;
    interestContainer.classList.toggle("has-error", !interestMarked);

    var validForm = isEverythingValid && interestMarked && privacyPolicy.checked;
    if (!validForm) {
      e.preventDefault();
    }
    return validForm;
  })
});

function saveRegister(event, site) {
  var button = document.getElementById("advertising-submit");
  button && (button.disabled = true);
  
  event.preventDefault()
	var form = event.target;
  var scriptURL;

  if (site === 'en') {
    var scriptURL = 'https://script.google.com/macros/s/AKfycbxQvwsfZCkVWlABMhRDal-wDZR8SpL7aQMjTamHEu6zdRzbVLg3TPVrfvQ89qlxEe82/exec'
  } else {
    var scriptURL = 'https://script.google.com/macros/s/AKfycbyh-lPcZO1Mj-bZppnYVnO_G_vktchLYj13uZtkSNmrJ4KG-ivObdfFzTFAF0tFm4MZsw/exec'
  }

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})

  form.onsubmit = null
  form.submit()

  return false
}
</script>