/* eslint-disable */

// CHECKBOX ->>
const check = document.querySelectorAll('.check');

const checkBox = document.querySelectorAll('.check .checkmark .checkbox');
if (check) {
	console.log('check found', check);
	check.forEach(el => {
		const checkMark = el.querySelector(`.checkMark`);

		el.addEventListener('click', () => {
			checkMark.classList.toggle('checked');
		});
		if (el.checked) {
			checkMark.classList.toggle('checked');
			alert('checkded')
		}
	});
}

// PROFILE-IMAGE-STACK ->>

const stacks = document.querySelectorAll('.profile-img-stack');

if (stacks) {
	stacks.forEach(stack => {
		const stackItems = stack.querySelectorAll('.profile-img');

		let i = 0;
		stackItems.forEach(item => {
		item.style.left = `${15 * i}px`;
		stack.style.width = `${30 + 15 * i}px`;
		i++;
		});
	})
}

const searchBar = document.querySelector(".search-bar input");
if (searchBar) {
	console.log("search bar found");
	searchBar.addEventListener("focus", e => {
		//e.preventDefault();
		console.log("Click on searchbar found");
		searchBar.parentElement.style.border = "1px solid white";
		
	});
	searchBar.addEventListener("focusout", e => {
		//e.preventDefault();
		//console.log("Click on searchbar found");
		searchBar.parentElement.style.border = "0px solid white";
		
	});
}

const createTaskBtn = document.querySelector(".main header .btn");
if (createTaskBtn) {
	const overlay = document.querySelector(".overlay");

	createTaskBtn.addEventListener("click", () => {
		overlay.style = 'z-index: 10; display: flex';

	})
}

// const profileCrossBtn = document.querySelector(".profile .cross-btn");
// if (profileCrossBtn) {
	
// }




const formChanger = () => {

	const activeForm = document.querySelector('.form-container.active');
	const loginForm = document.querySelector('.form-container#login-form');
	const signupForm = document.querySelector('.form-container#signup-form');
	const passwordForm = document.querySelector('.form-container#password-form');
	const companyForm = document.querySelector('.form-container#company-form');
	const administratorForm = document.querySelector('.form-container#admin-form');

	
	const form = activeForm.querySelector('form');
	const formName = activeForm.getAttribute('id');

	if (formName === 'signup-form') {
		form.addEventListener('submit', e => {
			e.preventDefault();
			
			activeForm.classList.remove('active');
			passwordForm.classList.add('active');	
			formChanger();
		});

		const loginLink = activeForm.querySelector('#login-link');
		const companyLink = activeForm.querySelector('#register-company-link');

		loginLink.addEventListener('click', () => {
			activeForm.classList.remove('active');
			loginForm.classList.add('active');
			formChanger();

		});

		companyLink.addEventListener('click', () => {
			activeForm.classList.remove('active');
			companyForm.classList.add('active');
			formChanger();

		});

	}

	if (formName === 'company-form') {
		form.addEventListener('submit', e => {
			e.preventDefault();

			activeForm.classList.remove('active');
			administratorForm.classList.add('active');
			formChanger();
			
		});
	} 
	
	if (formName === 'login-form') {

		const signupLink = activeForm.querySelector('#signup-link');
		const companyLink = activeForm.querySelector('#register-company-link');

		signupLink.addEventListener('click', () => {
			activeForm.classList.remove('active');
			signupForm.classList.add('active');
			formChanger();

		});

		companyLink.addEventListener('click', () => {
			activeForm.classList.remove('active');
			companyForm.classList.add('active');
			formChanger();

		});
	}

	if (formName === 'admin-form') {
		form.addEventListener('submit', e => {
			e.preventDefault();

			activeForm.classList.remove('active');
			passwordForm.classList.add('active');
			formChanger();
			
		});
	}

}

formChanger();