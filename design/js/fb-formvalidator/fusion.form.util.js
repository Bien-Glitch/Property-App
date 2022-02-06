let wait = '.waiting-text',
	_response = '.response-text';

/**
 *
 * @param value {string}
 * @returns {string}
 */
window.spaceToComma = (value) => {
	return value.trim().split(/[ ,]+/g).filter((val) => {
		return val !== '';
	}).join(', ');
}

/**
 *
 * @param form {HTMLFormElement}
 * @param data {Object | null}
 * @param button {string}
 * @param beforeSend {Function| null}
 * @param callback {Function | null}
 * @returns {Promise<{JSON: any, messageTag: any | JQuery | JQuery<HTMLElement>}>} A Promise with the JSON response object and the forms MessageTag Element
 */
window.submitPostXHR = async function ({form, data = null, button, beforeSend = null, callback = null}) {
	let _formHasErrors = $(form).hasErrors(),
		_messageTag = $(form).messageTag();
	_messageTag.html($(form).waitText()).fadeIn();
	
	return new Promise(async function (resolve, reject) {
		if (!_formHasErrors.count)
			$(form).ajaxSubmit({
				url: $(form).action(), method: 'POST', data: data, dataType: 'json', beforeSend: () => {
					if (typeof beforeSend === 'function')
						beforeSend();
					$(button, form).disable();
				}, complete: (xhr) => {
					let response = xhr.responseJSON,
						status = xhr.status;
					
					if (status > 199 && status < 300)
						if (response.status === 200)
							resolve({JSON: response, messageTag: _messageTag});
						else {
							if (response.status === 301)
								_messageTag.displayMessage(alert_d, fa_exc_c, response.message, null, form, true);
							else
								$(form).displayValidationErrors(response.errors, response.message);
						}
					else
						reject(xhr);
					$(button, form).disable(false);
				}
			});
		else
			$(form).displayValidationErrors(_formHasErrors.errors, 'Given data is invalid.')
		if (typeof callback === 'function')
			await callback();
	});
}

window.jQuery.fn.extend({
	/**
	 * Dispose the given modal
	 */
	closeModal: function () {
		let _target = this[0];
		$(_target).modal('dispose').remove();
	},
	waitText: function () {
		return $(wait, this[0]).html();
	},
	/**
	 * Returns the Message tag HTML Element object for the corresponding form
	 * @returns JQuery<TElement>
	 */
	messageTag: function () {
		return $(_response, this[0]);
	},
	action: function () {
		let tag = this[0].tagName.toLowerCase();
		return tag === 'form' ? $(this[0]).attr('action') : $(this[0]).data('action');
	},
	allElements: function () {
		let _target = this[0];
		return ((_target.tagName.toLowerCase() !== 'form') ? console.error(`function 'allElements()' expects 'form element' but '${_target.tagName.toLowerCase()} element' was given`) : _target.elements);
	},
	/**
	 * Disables the given element
	 * @param option
	 * @returns JQuery<TElement> | Window.jQuery
	 */
	disable: function (option = true) {
		let tag = this[0].tagName.toLowerCase();
		(tag !== 'a') ? ($(this[0]).prop({disabled: option})) : ((!option) ? $(this[0]).removeClass('disabled') : $(this[0]).addClass('disabled'));
		return this;
	},
	/**
	 *
	 * @param options
	 * @param callback
	 * @returns {Window.jQuery}
	 */
	onModalLoad: function (options, callback) {
		let _target = this[0];
		$(_target).on('shown.bs.modal', function (e) {
			typeof callback === 'function' ? callback() : (typeof options === 'function' ? options() : null);
		}).modal((options && typeof options !== 'function') ? options : null).modal('show');
		return this;
	},
	/**
	 *
	 * @param direction
	 * @returns {Error|boolean}
	 */
	hasScrollBar: function (direction) {
		let _target = this[0],
			_scroll = direction === 'vertical' ? 'scrollHeight' : 'scrollWidth',
			_client = direction === 'vertical' ? 'clientHeight' : 'clientWidth';
		
		if (!direction) {
			console.error(new Error('Scroll direction not specified!'));
			return new Error('Scroll direction not specified!');
		}
		return _target[_scroll] > _target[_client];
	},
	mouseIsOver: function () {
		let _target = this[0];
		return $(_target).is(':hover');
	},
	/**
	 *
	 * @param uri
	 * @param data
	 * @param slug
	 * @param callback
	 */
	loadPageData: function (uri, data = null, slug, callback) {
		$(this[0]).load(uri, data, (resp, status, xhr) => {
			if (status === 'success') {
				if (typeof callback === 'function')
					callback();
			} else
				alert('Error');
			return this[0];
		});
	},
});
