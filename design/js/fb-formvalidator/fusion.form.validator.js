/*!
* Fusion Form Validator.js v1.0.4 (https://github.com)
* Copyright 2021 Fusion Bolt inc.
*/

/**
 * ----------------------------------------------------------
 * Fusion Form Validator (v1.0.4)
 * ----------------------------------------------------------
 * (**Global Variables Declaration**)
 */
let valid_right,
	padding_right,
	form_group = '.form-group',
	form_field_group = '.form-field-group', // TODO: Changed from input_group ['.input-group'] to form_field_group ['.form-field-group']
	
	default_validator_config = {
		regExp: {
			name: /^([a-zA-Z]{2,255}\s)*([a-zA-Z]{2,255})$/gi,
			email: /^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})*(\.\w{2,3})$/gi,
			phone: /^(\+\d{1,3}?\s)(\(\d{3}\)\s)?(\d+\s)*(\d{2,3}-?\d+)+$/g,
		},
		validation: {
			nativeValidation: false,
			passwordId: 'password',
			passwordConfirmId: 'password_confirmation',
			validateName: false,
			validateEmail: false,
			validatePhone: false,
			validatePassword: false,
		},
		validation_icons: {
			invalid: '<i class="fa far fa-1x fa-exclamation-circle"></i>',
			valid: '<i class="fa far fa-1x fa-check"></i>',
		}
	},
	errorBag = {},
	errorCount = {},
	paddingMultipliers = [];


/**
 * ----------------------------------------------------------
 * Fusion Form Validator (v1.0.4)
 * ----------------------------------------------------------
 * (**Constants**)
 */
const alert_d = 'alert-danger';
const alert_i = 'alert-info';
const alert_s = 'alert-success';

const fa_check = 'fa-check';
const fa_check_c = 'fa-check-circle';
const fa_check_d = 'fa-check-double';
const fa_exc = 'fa-exclamation';
const fa_exc_c = 'fa-exclamation-circle';
const fa_info = 'fa-info';
const fa_info_c = 'fa-info-circle';
const fa_wifi_s = 'fa-wifi-slash';

const version = '1.0.4';

/**
 * ----------------------------------------------------------
 * Fusion Form Validator (v1.0.4):
 * ----------------------------------------------------------
 * (**Base-Component**)
 */
class Base {
	#_config;
	#_validWrapper;
	#_invalidWrapper;
	
	constructor(element, form) {
		this._form = form;
		this._element = element;
		this.#_config = {
			regExp: {
				name: /^([a-zA-Z]{2,255})*(\s[a-zA-Z]{2,255})$/gi,
				email: /^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})*(\.\w{2,3})$/gi,
				phone: /^(\+\d{1,3}?\s)(\(\d{3}\)\s)?(\d+\s)*(\d{2,3}-?\d+)+$/g,
			},
			validation: {
				nativeValidation: false,
				passwordId: 'password',
				passwordConfirmId: 'password_confirmation',
				validateName: false,
				validateEmail: false,
				validatePhone: false,
				validatePassword: false,
			},
			validation_icons: {
				invalid: '<i class="fa far fa-1x fa-exclamation-circle"></i>',
				valid: '<i class="fa far fa-1x fa-check"></i>',
			}
		};
		
		this.#_invalidWrapper = (icon) => {
			return `<small class="position-absolute text-danger invalid validation-icon">${icon}</small>`;
		}
		
		this.#_validWrapper = (icon) => {
			return `<small class="position-absolute text-success valid validation-icon">${icon}</small>`;
		}
	}
	
	/** Getters **/
	
	/* * *Returns The Base element* * */
	get baseElement() {
		return this._element;
	}
	
	/* * *Returns all configuration settings* * */
	get config() {
		return this.#_config;
	}
	
	get invalidIcon() {
		return this.#_invalidWrapper
	}
	
	get validIcon() {
		return this.#_validWrapper
	}
	
	
	/** Setters **/
	
	/* * *Assign the base element* * */
	set baseElement(element) {
		this._element = element;
	}
	
	
	/** Static **/
	
	/* * *Get current validator version* * */
	static get VERSION() {
		return version;
	}
}

/**
 * ----------------------------------------------------------
 * Fusion Form Validator (v1.0.4):
 * ----------------------------------------------------------
 * (**Validate Form**)
 */
class ValidateForm extends Base {
	#_regExp;
	#_padding;
	#_validation;
	#_validation_icons;
	#_invalid;
	#_valid;
	
	constructor(element, form) {
		super(element, form);
		let _config = this.config;
		
		this.#_regExp = _config.regExp;
		this.#_padding = {
			input: 2.5,
			input$sm: 3.5,
			select: 4,
			select$sm: 5.8,
			validDate: 3,
			validDate$sm: 3.8,
			validInput: 0.9,
			validInput$sm: 1.5,
			validSelect: 3,
			validSelect$sm: 3.8,
		};
		this.#_validation = _config.validation;
		this.#_validation_icons = _config.validation_icons;
		this.#_invalid = this.invalidIcon;
		this.#_valid = this.validIcon;
	}
	
	assignConfig(options, config) {
		let filtered = Object.keys(config).filter((_option) => {
			if (_option in options && options[_option] !== '')
				config[_option] = options[_option];
		});
		config = (options === config) ? options : (filtered.length > 0 ? filtered : config);
		return this;
	}
	
	validateForm() {
		if (!!this._form.length) {
			$.each(this._form, (idx, form) => {
				let regExp = this.#_regExp,
					validation = this.#_validation,
					icons = this.#_validation_icons,
					invalidWrapper = this.#_invalid,
					validWrapper = this.#_valid,
					context = `#${form.id} ${this._element}`;
				paddingMultipliers[form.id] = this.#_padding;
				errorBag[form.id] = {};
				errorCount[form.id] = 0;
				
				if (validation.nativeValidation)
					$(form).removeAttr('novalidate');
				else
					$(form).attr({novalidate: ''});
				
				$(context).each(function () {
					let target = this,
						element = $('input, textarea, select', target),
						inputElement = $('input, textarea', target),
						selectElement = $('select', target),
						element_id = $(element).attr('id');
					
					$(target).attr('id', `${element_id}_group`);
					$(form_field_group, target).append(validWrapper(icons.valid)).append(invalidWrapper(icons.invalid)); // TODO: changed from '.input-group' to form_field_group
					
					inputElement.on({
						input: function () {
							let _type = inputElement.attr('type');
							if (inputElement.isValidated())
								if ((_type !== 'date' && _type !== 'datetime' && _type !== 'datetime-local') && (_type !== 'email' && !inputElement.isPhoneField()) && element_id !== 'name')
									if (_type !== 'password')
										inputElement.validate(target);
									else {
										if (_type === 'password' && validation.validatePassword) {
											let _password_id = `#${validation.passwordId}`,
												_password_confirm_id = `#${validation.passwordConfirmId}`,
												_password = $(_password_id),
												_password_confirm = $(_password_confirm_id),
												minlength = _password.attr('minlength'),
												maxlength = _password.attr('maxlength');
											
											/*if (element_id === 'current_password')
												inputElement.validate(target);*/
											
											if ((element_id === validation.passwordId) && element_id !== validation.passwordConfirmId) {
												if (inputElement.val().length < minlength || inputElement.val().length > maxlength) {
													/*console.log($(`${form_group}`, form).has(_password_confirm))*/
													/*if ($(form[0]).has(_password_confirm).length) {*/
													if ($(`${form_group}`, form).has(_password_confirm)) {
														_password_confirm.validate(_password_confirm.parents(form_group), null, true);
														inputElement.validate(target, `Password must be between ${minlength} and ${maxlength} characters`);
													}
												} else {
													/*if ($(form[0]).has(_password_confirm).length)*/
													if ($(`${form_group}`, form).has(_password_confirm).length)
														if ((inputElement.val().length > 0 && _password_confirm.val().length > 0) && inputElement.val() !== _password_confirm.val()) {
															inputElement.validate(target, 'Passwords do not match.', true);
															_password_confirm.validate(_password_confirm.parents(form_group), null, true);
														} else {
															inputElement.validate(target)
															_password_confirm.validate(_password_confirm.parents(form_group))
														}
													else
														inputElement.validate(target);
												}
											} else {
												if (element_id === validation.passwordConfirmId) {
													if (_password.val().length < 1)
														inputElement.validate(target, 'The Password field is required', true)
													else {
														if (_password.val().length < minlength || _password.val().length > maxlength) {
															inputElement.validate(target, null, true);
															_password.validate(_password.parents(form_group), `Password must be between ${minlength} and ${maxlength} characters'`);
														} else if (inputElement.val().length < 1)
															inputElement.validate(target);
														else if (inputElement.val() !== _password.val()) {
															inputElement.validate(target, null, true);
															_password.validate(_password.parents(form_group), 'Passwords do not match.', true);
														} else {
															inputElement.validate(target);
															_password.validate(_password.parents(form_group));
														}
													}
												} else
													inputElement.validate(target);
											}
										} else
											inputElement.validate(target);
									}
							
							if (inputElement.isValidated()) {
								if (_type === 'email')
									if (validation.validateEmail)
										inputElement.emailValidate(regExp.email, target);
									else
										checkValidate(inputElement, target);
								
								if (inputElement.isPhoneField())
									if (validation.validatePhone)
										inputElement.phoneValidate(regExp.phone, target);
									else
										checkValidate(inputElement, target);
								
								if (element_id === 'name')
									if (validation.validateName)
										inputElement.nameValidate(regExp.name, target);
									else
										checkValidate(inputElement, target);
							}
						},
						/*change: function () {
							if (inputElement.isValidated())
							
						},*/
						keyup: function () {
							let _type = inputElement.attr('type');
							
							if (_type === 'date' || _type === 'datetime' || _type === 'datetime-local') {
								inputElement.validate(target);
							}
						}
					});
					
					selectElement.on('change', function () {
						if ($(this).isValidated())
							$(this).validate(target);
					});
					
					if (element.attr('id')) {
						let _type = element.attr('type');
						
						if (element.isValidated())
							if (element[0].tagName.toLowerCase() !== 'select') {
								if (_type && _type.toLowerCase() !== 'checkbox' || (element.val().length && element.val().length < 1))
									if (element.val().length < 1) {
										errorCount[form.id]++;
										errorBag[form.id][element_id] = 'This field is required';
									}
							} else {
								if ($('option:selected', element).val() < 1) {
									errorCount[form.id]++;
									errorBag[form.id][element_id] = 'This field is required';
								}
							}
					}
				});
				// TODO: Validate form on form reset
				$(form).off('reset').on('reset', (e) => {
					let _target = e.currentTarget;
					$('.alert', _target).each((idx, val) => $(val).alert('close'));
					$('input, textarea, select', _target).removeClass('border-danger').removeClass('border-success');
					$('.validation-icon', _target).fadeOut();
					/*$(_target).fusionFormValidator(form_group).validateForm();*/
				});
			});
			
			return this._form;
		} else
			console.warn(`Some form element(s) not found in current document: ${this._form}`);
		return new Error('Some form element(s) not found in current document');
	}
	
	
	/**
	 * ----------------------------------------------------------
	 * Getters
	 *----------------------------------------------------------
	 */
	
	/* * *Returns Padding configuration settings* * */
	get padding_multipliers() {
		return this.#_padding;
	}
	
	/* * *Returns Regular Expression configuration settings* * */
	get regExp_config() {
		return this.#_regExp
	}
	
	/* * *Returns Validation configuration settings* * */
	get validation_config() {
		return this.#_validation;
	}
	
	/* * *Returns configuration settings for Validation Icons* * */
	get validation_icons() {
		return this.#_validation_icons;
	}
	
	
	/**
	 * ----------------------------------------------------------
	 * Setters
	 * ----------------------------------------------------------
	 */
	
	/* Set Padding configuration */
	set padding_config(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_padding;
		this.assignConfig(_options, this.#_padding);
		return this;
	}
	
	/* Set Regular Expression configuration */
	set regExp_config(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_regExp;
		this.assignConfig(_options, this.#_regExp);
		return this;
	}
	
	/* Set Validation configuration */
	set validation_config(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_validation;
		this.assignConfig(_options, this.#_validation);
		return this;
	}
	
	/* Set Validation Icons configuration */
	set validation_icons(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_validation_icons;
		this.assignConfig(_options, this.#_validation_icons);
		return this;
	}
	
	static get NAME() {
		return 'Form Validator';
	}
}

/**
 * Return product of two values using the CSS calc property
 * @param pad1
 * @param pad2
 * @returns {string}
 */
function multiplyPadding(pad1, pad2) {
	return `calc(${pad1} * ${pad2})`;
}

/**
 * Close validation alert on alert close
 *
 * (* Requires removeValidationText function *)
 * @param context
 */
function onAlertClose(context) {
	$('.alert').on('close.bs.alert', function () {
		let _target = $(this).data('alert-id');
		if (_target !== null || true || _target !== '')
			$(_target).removeValidationText(context);
	});
}

function checkValidate(inputElement, target) {
	if (inputElement.isValidated())
		inputElement.validate(target);
	else
		inputElement.removeValidationText(target, true);
}

jQuery.fn.extend({
	/**
	 * Create a new instance of Fusion Form Validator
	 * @param element
	 * @returns {ValidateForm}
	 */
	fusionFormValidator(element) {
		return new ValidateForm(element, this);
	},
	addValidPad() {
		if ($(this[0]).attr('type') !== 'date')
			$(this[0]).css({paddingRight: padding_right});
	},
	removeValidPad() {
		let _padding_x = $(this[0]).css('padding-left');
		$(this[0]).css({paddingRight: _padding_x});
	},
	/**
	 * Checks if an element is explicitly validated; using the 'fb-validate' data key
	 * @returns {boolean}
	 */
	isValidated() {
		let validated = $(this[0]).data('fb-validate');
		return validated !== 'no' && validated !== 'No' && validated !== 'nO' && validated !== 'NO';
	},
	/**
	 * Check if the element is a phone input field
	 * @returns {RegExpMatchArray}
	 */
	isPhoneField() {
		let _target_id = $(this[0]).attr('id')
		return _target_id.match(/phone/gi);
	},
	/**
	 * Checks if a form element has any validation errors (* When using Fusion Form Validator *)
	 * @returns {Error|{count: number, errors: (*|boolean)}}
	 */
	hasErrors() {
		let _target = this[0],
			errors = errorCount[_target.id] > 0 ? errorBag[_target.id] : false;
		/*console.log(errors)*/
		if (_target.tagName.toLowerCase() === 'form')
			return {
				count: errorCount[_target.id],
				errors: errors,
			};
		
		console.error(`Expected 'form element' but '${_target.tagName.toLowerCase()} element' given`);
		return new Error(`Function hasErrors() accepts only 'form element', '${_target.tagName.toLowerCase()} element' given!`);
	},
	/**
	 * @param errors
	 * @param message
	 * @param callback
	 */
	displayValidationErrors(errors, message, callback) {
		let _target = this[0],
			elements = $(_target).allElements();
		
		Object.keys(errors).forEach((element) => {
			if (element in elements && errors[element] !== '')
				$(`#${element}`, _target).validate($(form_group, _target), errors[element], false, true);
			else {
				if (errors[element] === '')
					$(`#${element}`, _target).validate($(form_group, _target), 'Verify input and try again.', false, true);
			}
		});
		if (typeof message === 'string' && message !== '')
			$(_target).messageTag().displayMessage(alert_d, fa_exc_c, message, null, _target, true);
		if (typeof callback === 'function')
			callback();
	},
	/**
	 * Close specified Validation alert
	 * @param context
	 * @param close
	 */
	removeValidationText(context, close = false) {
		let _target = this[0],
			e = $(_target).validationProps();
		/*delete errorBag[_target.form.id][_target.id];
		errorCount[_target.form.id] = Object.keys(errorBag[_target.form.id]).length;*/
		
		if (close)
			$(`#${e.validField[0].id} > .alert`, context).alert('close');
		
		$(_target).removeClass('border-danger').removeClass('border-success');
		$(e.validationIcon).fadeOut();
		$(_target).removeValidPad();
		
		return _target;
	},
	validationProps() {
		let target = this[0],
			target_id = target.id,
			_target_id = `#${target_id}`;
		
		return {
			id: _target_id,
			validField: $(`${_target_id}Valid`),
			validIcon: $(form_group + `${_target_id}_group ${form_field_group} > .valid`),
			invalidIcon: $(form_group + `${_target_id}_group ${form_field_group} > .invalid`),
			validationIcon: $(form_group + `${_target_id}_group ${form_field_group} > .validation-icon`)
		}
	},
	/**
	 * Validate specified email input field using regular expression
	 * @param regExp
	 * @param context
	 * @returns jQuery|JQuery<TElement>
	 */
	emailValidate(regExp, context) {
		let _target = this[0],
			_input = $(_target);
		
		if (_input.val().length > 0) {
			if (_input.val().match(regExp))
				_input.validate(context);
			else
				_input.validate(context, 'Please input a valid E-mail Address', false, true);
		} else
			checkValidate(_input, context);
		return this;
	},
	/**
	 * Validate specified phone field using regular expression
	 * @param regExp
	 * @param context
	 * @returns jQuery|JQuery<TElement>
	 */
	phoneValidate(regExp, context) {
		let _target = this[0],
			_input = $(_target);
		
		if (_input.val().length > 0) {
			if (_input.val().match(regExp))
				_input.validate(context);
			else
				_input.validate(context, 'Please input a valid Phone Number format', false, true);
		} else
			checkValidate(_input, context);
		return this;
	},
	nameValidate(regExp, context) {
		let _target = this[0],
			_input = $(_target)
		
		if (_input.val().length > 0) {
			if (_input.val().match(regExp))
				_input.validate(context);
			else
				_input.validate(context, 'Please input a valid Name format (eg. John Doe)', false, true);
		} else
			checkValidate(_input, context);
		return this;
	},
	addValidText(context, message, icon = true) {
		let _target = this[0],
			e = $(_target).validationProps();
		delete errorBag[_target.form.id][_target.id];
		errorCount[_target.form.id] = Object.keys(errorBag[_target.form.id]).length;
		
		if (icon) {
			e.invalidIcon.fadeOut(0);
			e.validIcon.css({right: valid_right, zIndex: 100}).fadeIn();
			$(_target).addValidPad();
		} else
			$(_target).removeValidPad();
		
		if (!message)
			e.validField.html(null);
		else
			e.validField.displayMessage(alert_s, fa_check, message, e.id, context, true);
		$(_target).removeClass('border-danger').addClass('border-success');
	},
	addInvalidText(context, message, icon = true) {
		let _target = this[0],
			_message = !message ? 'This field is required' : message,
			e = $(_target).validationProps();
		errorBag[_target.form.id][_target.id] = _message;
		
		if (icon) {
			e.validIcon.fadeOut(0);
			e.invalidIcon.css({right: valid_right, zIndex: 100}).fadeIn();
			$(_target).addValidPad();
		} else
			$(_target).removeValidPad();
		
		if (!_message)
			e.validField.html(null);
		else
			e.validField.displayMessage(alert_d, fa_exc_c, _message, e.id, context, true);
		$(_target).removeClass('border-success').addClass('border-danger');
	},
	/**
	 *
	 * @param bs_alert
	 * @param fa_icon
	 * @param message
	 * @param id
	 * @param context
	 * @param dismissible
	 * @param wait
	 * @returns jQuery|JQuery<TElement>
	 */
	displayMessage(bs_alert, fa_icon, message, id, context = null, dismissible = false, wait = false) {
		let message_tag = this[0],
			_bs_alert = dismissible ? `${bs_alert} alert-dismissible` : bs_alert,
			_message_tag = context ? $(message_tag, context) : $(message_tag),
			_dismiss = dismissible ? '<a type="button" class="text-danger" data-bs-dismiss="alert"><i class="fa fa-times-circle"></i></a>' : '',
			_wait = wait ? '<br><i class="fa fa-1x fa-spin fa-spinner-third"></i> Please Wait...' : '';
		
		_message_tag.html(`\
			<div class="alert ${_bs_alert} d-flex justify-content-between align-items-center pr-0 p-1 mt-1 fade show" data-alert-id="${id}" role="alert">\n\
				<div class="px-1">\n\
					<i class="fa far fa-1x ${fa_icon}"></i>\n\
					<span>${message}</span>\n\
					${_wait}\n\
				</div>\n\
				${_dismiss}\n\
			</div>\
		`);
		return this;
	},
	validate(context, message, password = false, errors = false) {
		let _target = this[0],
			_pad = paddingMultipliers[_target.form.id],
			_type = ($(_target).attr('type') ?? '').toLowerCase(),
			_padding_x = $(_target).css('padding-left'),
			_min_input_length = (_target.tagName.toLowerCase() !== 'select' ? $(_target).attr('minlength') : false),
			_message = (_min_input_length ? (($(_target).val().length < _min_input_length && !message) ? `This field requires a minimum of ${_min_input_length} characters` : message) : ((password && !message) ? 'Check Password.' : message));
		
		if (_type === 'date' || _type === 'datetime' || _type === 'datetime-local')
			valid_right = $(_target).hasClass('form-control-sm') ? multiplyPadding(_padding_x, _pad.validDate$sm) : multiplyPadding(_padding_x, _pad.validDate);
		else {
			if (_target.tagName.toLowerCase() === 'select') {
				valid_right = ($(_target).hasClass('form-control-sm') || $(_target).hasClass('form-select-sm')) ? multiplyPadding(_padding_x, _pad.validSelect$sm) : multiplyPadding(_padding_x, _pad.validSelect);
				padding_right = ($(_target).hasClass('form-control-sm') || $(_target).hasClass('form-select-sm')) ? multiplyPadding(_padding_x, _pad.select$sm) : multiplyPadding(_padding_x, _pad.select);
			} else {
				valid_right = ($(_target).hasClass('form-control-sm')) ? multiplyPadding(_padding_x, _pad.validInput$sm) : multiplyPadding(_padding_x, _pad.validInput);
				padding_right = ($(_target).hasClass('form-control-sm')) ? multiplyPadding(_padding_x, _pad.input$sm) : multiplyPadding(_padding_x, _pad.input);
			}
		}
		
		if (!$((_target.tagName.toLowerCase() !== 'select') ? _target : `#${_target.id} > option:selected`).val().length || $(_target).val().length < _min_input_length || (password && (!$(_target).val().length || _message)) || errors)
			$(_target).addInvalidText(context, _message);
		else
			$(_target).addValidText(context);
		errorCount[_target.form.id] = Object.keys(errorBag[_target.form.id]).length;
		onAlertClose();
		
		return this;
	},
});
