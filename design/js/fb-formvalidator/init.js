const pageForms = {
	login: '#login-form',
	register: '#register-form',
};

window.initValidatePageForms = function () {
	return Object.keys(pageForms).filter((form) => {
		let formValidate = {},
			_form = pageForms[form];
		
		if ($(_form).length) {
			formValidate[form] = $(_form).fusionFormValidator(form_group);
			
			if (formValidate[form] === formValidate.login || formValidate[form] === formValidate.register)
				formValidate[form].validation_config = {
					validateEmail: true,
					nativeValidation: false
				};
			
			if (formValidate[form] === formValidate.register)
				formValidate[form].validation_config.validatePassword = true
			
			formValidate[form].validateForm();
			console.log(formValidate[form].validation_config)
		}
	});
}


/*
form_validate.validation_config = {
	validateEmail: true,
	// validatePassword: true
};

form_validate.validateForm();
*/

/*$(form).on('submit', function (e) {
	e.preventDefault()
	
	if (!$(this).hasErrors())
		$(this).off('submit').trigger('submit');
	else
		alert(`${errorCount[this.id]} error(s) found!`);
})*/
