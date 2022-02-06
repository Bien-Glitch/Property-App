const page = 'html';
const body = 'body';
const navbarHeader = 'header#nav';
const navbar = 'nav.navbar';
const mainBody = 'main.body';

const createPropPage = '#create-property-page';
const editPropPage = '#edit-property-page';

const registerForm = '#register-form';
const loginForm = '#login-form';

const listingWrapper = '.listing-wrapper';

let client_h = window.innerHeight,
	client_w = window.innerWidth,
	screen_h = window.outerHeight,
	screen_w = window.outerWidth,
	prevScrollPos = window.scrollY,
	navbar_h = $(navbar)[0].clientHeight,
	navbarHeader_h = $(navbarHeader)[0].clientHeight,
	
	href = location.href,
	hrefSplit = href.split('/');

setActiveNavLink = () => {
	$('.nav-link').each((idx, ele) => {
		const anchor = $(ele).attr('href')
		
		if (anchor && anchor.length)
			if (anchor.split('./')[1].toLowerCase() === hrefSplit[hrefSplit.length - 1].toLowerCase()) {
				$('.nav-link').removeClass('active');
				$(ele).addClass('active')
			}
	});
}

resizeListingImage = () => {
	if ($(listingWrapper).length) {
		setTimeout(() => {
			$(listingWrapper).each(function () {
				if ($(this).has('img').length && $(this).has('.content').length) {
					let wrapper_h = $('.content', this)[0].clientHeight;
					$('img', this).css({height: `${wrapper_h}px`})
				}
			});
		}, 800)
	}
}

$(window).on({
	load: function () {
		if ($('.auth-wrapper').length)
			$(mainBody).css({height: `calc(100vh - ${navbarHeader_h}px)`});
		
		if ($(`${createPropPage}, ${editPropPage}`).length) {
			let bedroomLabel_h = $('label[for="bedrooms"]')[0].clientHeight,
				bedroomField_h = $('#bedrooms')[0].clientHeight
			$('textarea#description').css({height: `${(bedroomLabel_h + 13) + (bedroomField_h * 2)}px`})
		}
		
		if ($('#register-page, #login-page').length) {
			if ($(registerForm).length)
				$(registerForm).on('submit', function (e) {
					e.preventDefault();
					submitPostXHR({form: this, button: 'button[type="submit"]'});
				});
			else
				$(loginForm).on('submit', function (e) {
					e.preventDefault();
					submitPostXHR({form: this, button: 'button[type="submit"]'});
				});
		}
		$(mainBody).css({marginTop: `${navbarHeader_h}px`});
		
		setActiveNavLink();
		resizeListingImage();
		initValidatePageForms();
	},
	resize: function () {
		resizeListingImage();
	}
});
