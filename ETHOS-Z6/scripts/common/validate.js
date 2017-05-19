(function () {
    app.validate = {
        getValidator: function (selector, params) {
            return $(selector).kendoValidator(_.merge({
                validateOnBlur: true,
                rules: {  
                    validateEmailRule: function (input) {
                        if (input.is('input[type=email]') && !!input.val()) {
                            return input.val().indexOf('@') > 0;
                        }

                        return true;
                    }, 
                },
                messages: { 
                    validateEmailRule: 'Not valid email format.',
                    required: function (input) { 
                        return 'This field is required.';
                    }
                }
            }, params)).data('kendoValidator');
        }
    }
}());