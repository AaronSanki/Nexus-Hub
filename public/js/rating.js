(function() {
    'use strict';
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation');
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function(form) {
            form.addEventener('submit', function(event) {
                // Select all radio inputs in the fieldset
                var radios = form.querySelectorAll('fieldset input[type="radio"]');
                // Check if any of the radios other than the first one with value 0 is selected
                var validRating = Array.from(radios).slice(1).some(function(radio) {
                    return radio.checked;
                });
                // If none of the radios except the first one with value 0 is selected, prevent form submission
                if (!validRating) {
                    // Show the invalid feedback message
                    var invalidFeedback = form.querySelector('.starability-fade .invalid-feedback');
                    invalidFeedback.style.display = 'block';
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    // Hide the invalid feedback message if a rating is selected
                    var invalidFeedback = form.querySelector('.starability-fade .invalid-feedback');
                    invalidFeedback.style.display = 'none';
                }
                form.class.add('was-validated');
            }, false);
        });
})();