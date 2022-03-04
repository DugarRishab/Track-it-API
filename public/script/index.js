/* eslint-disable*/
import '@babel/polyfill';
import util from 'util';
import fs from 'fs';
import axios from 'axios';

import { login, registerCompany, signup, sendVerifyRequest, logout } from "./login";
import { getAssignToSearchData, getTaskData, getUserData, getTeamData, sendTaskFormData, updateTask } from "./getData";
import { addAssignToItem, checkUpdateTaskGroup, createTaskGroup, removeAllTaskGroups, removeSearchDropDown } from './createDOM';
import { showAlert } from './alert';
//import { profile } from 'console';

const currentPath = window.location.pathname;
const logo = document.querySelector('.logo');
if (logo) {
	logo.addEventListener('click', () => {
		window.location.reload();
	})
}

if (currentPath === '/tasks') {
	
	const tabs = document.querySelector(".main header .tabs");

	let data;
	const getData = async (options) => {
		try {
			data = await getTaskData(options);
			//console.log("data: ", data);
		}
		catch (err) {
			//console.log(err);
		}
	}

	getData({
		tab: 0,
		firstLoad: true
	});

	const checkActiveTab = () => {
		const tabs = document.querySelector(".main header .tabs");
		const tabItems = tabs.querySelectorAll(".item");
		//console.log(tabItems[0].classList.contains('active') ? 0 : 1);
		return tabItems[0].classList.contains('active')? 0 : 1
	}

	//removeAllTaskGroups();
	//createTaskGroup(data, checkActiveTab());

	
	//let option = 0;
	tabs.addEventListener('click', () => {
		
		const tabItems = tabs.querySelectorAll(".item");
		//console.log("click detected...");
		tabItems[0].classList.toggle('active');
		tabItems[1].classList.toggle('active');
		//(option === 0) ? 1 : 0;
		removeAllTaskGroups();
		checkUpdateTaskGroup(data, {
			tab: checkActiveTab(),
			firstLoad: true
		});
		getData({
			tab: checkActiveTab(),
			firstLoad: true
		});
	});

	const reloadIntervalId = window.setInterval(reload, 10 * 1000);

	function reload() {
		//console.log("reloading...");
		const option = checkActiveTab();
		//console.log("option:", option);
		getData({
			tab: option,
			firstLoad: false
		});
		//checkUpdateTaskGroup(data, option);
		//updateTaskBtnEventListener();
	}

	const createTaskBtn = document.querySelector(".main header .btn");
	if (createTaskBtn) {
		const overlay = document.querySelector(".overlay");

		createTaskBtn.addEventListener("click", () => {
			overlay.style = 'z-index: 10; display: flex';

		})
	}

	// const updateTaskBtnEventListener = () => {
	// 	const taskItems = document.querySelectorAll(".task-item");    
	// 	taskItems.forEach(task => {
	// 		const taskCompleteBtn = task.querySelector(".complete-btn");
	// 		if (taskCompleteBtn) {

	// 			taskCompleteBtn.addEventListener("click", () => {
	// 				console.log("click detected");
	// 				updateTask(task.getAttribute("data-taskId"), { complete: true });
	// 			})
				
	// 		}
	// 	});
	// }

	
	

	//console.log("create page found");

	const taskOverlay = document.querySelector(".body-contents .overlay");
	if (taskOverlay) {
		const backBtn = taskOverlay.querySelector(".main header .back-btn");

		backBtn.addEventListener("click", () => {
			taskOverlay.style = 'z-index: -10; display: hidden;';
		});

		const taskForm = taskOverlay.querySelector(".main form.form-task");
		const taskFormSearch = taskForm.querySelector(".search-bar input");
		
		taskFormSearch.addEventListener("focus", async () => {
			await getTeamData();
			await getUserData();
		});
		
		taskFormSearch.addEventListener("input", () => {
			const searchValue = taskFormSearch.value;
			//console.log('value is: ', searchValue);
			getAssignToSearchData(searchValue);
			
			const dropdown = taskForm.querySelector(".search-bar .drop-down");
		//	console.log('dropdown: ', dropdown);
			if (dropdown) {
				console.log('dropdown found');
				const profileItems = dropdown.querySelectorAll(".profile");
				//console.log('profileItems: ', profileItems);
				profileItems.forEach(item => {
					item.addEventListener("click", () => {
			//			console.log("click detected");
						addAssignToItem(item);
					});
				});
				
				// if (profileItemsNumber !== 0) {
				// 	for (var i = 0; i < profileItemsNumber; i++){

				// 		const profileItem = dropdown.childNodes[i];
				// 		//console.log('profileItems.length(): ', profileItems.length);
				// 		console.log("item: ", profileItem);
				// 		profileItem.addEventListener("click", () => {
				// 			console.log("click detected");
				// 			// addAssignToItem({
				// 			// 	image: profileItem.querySelector(".profile-img").style.ba
				// 			// })
	
				// 			addAssignToItem(profileItem);
				// 		});
				// 	}
				// }
			}
		});

		taskForm.addEventListener("submit", (e) => {
			e.preventDefault();

			//console.log("submitting form");

			const title = taskForm.querySelector("#task-title input").value;
			const startTime = taskForm.querySelector("#start-time").value;
			const endTime = taskForm.querySelector("#end-time").value;
			const description = taskForm.querySelector("#description").value;
			//const steps = taskForm.querySelector("#steps").value;
			//const projects = taskForm.querySelector("#project").value;
			const assignedToResult = taskForm.querySelector("#assignedToResult");
			let assignedTo = [];
			assignedToResult.childNodes.forEach(result => {
				assignedTo.push(result.getAttribute("data-id"));
			});


			const data = {
				title,
				startDate: startTime,
				endDate: endTime,
				description,
				assignedTo
				//steps,
				//projects

			}
			sendTaskFormData(data)

		});

		// const taskSearchBar = taskForm.querySelector(".search-bar");
		// taskSearchBar.addEventListener("click", e => {
		// 	console.log(e, ' detected')
		// 	outsideClickListener(taskSearchBar, e)
		// });

		// const outsideClickListener = (element, event) => {
		// 	if (!element.contains(event.target) && isVisible(element)) { // or use: event.target.closest(selector) === null
		// 		console.log('outisde click detetcted');
		// 		removeSearchDropDown('assignToResult');
		// 	}
		// }
		
		// const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
		
		// taskSearchBar.addEventListener("click", (event) => {
		// 	const dropdown = taskForm.querySelector(".search-bar .drop-down");
		// 	if (!dropdown.contains(event.target) && !isVisible(dropdown)) { // or use: event.target.closest(selector) === null
		// 		console.log('outisde click detetcted');
		// 		removeSearchDropDown('assignToResult');
		// 	}
		// 	else {
		// 		// taskFormSearch.addEventListener("focusout", (event) => {
		// 		// 	removeSearchDropDown('assignToResult');
		// 		// });
		// 	}

		// 	//removeSearchDropDown('assignToResult');
		// });

		// taskFormSearch.addEventListener("focusout", () => {

		// 	const dropdown = taskForm.querySelector(".search-bar .drop-down");
		// 	let clickOnDropdown = false;

		// 	dropdown.addEventListener("click", () => {
		// 		clickOnDropdown = true;
		// 		console.log('click on dropdown dtected');
		// 	});

		// 	if (!clickOnDropdown) {
		// 		removeSearchDropDown('assignToResult');
		// 	}
			
		// });
		
		
	}


	const logoutBtn = document.querySelector("#logout-btn");
	logoutBtn.addEventListener('click', () => {
		console.log('click detected');
		clearInterval(reloadIntervalId);
		showAlert('success', 'trying logging out');
		logout();

	});

}

if (currentPath === '/') {

	const isLoggedIn = document.querySelector('script').getAttribute('data-isLoggedIn');
	console.log('isLoggedIn: ', isLoggedIn);
	
	if (isLoggedIn) {
		showAlert('success', 'You are already logged in');
		window.setTimeout(() => {
			location.assign('/tasks');
		}, 1500);
	}

	let currentForm;
	let name, email, companyUID, role, password, passwordConfirm, country,
		administratorEmail, administratorName, administratorRole;

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

			const nameField = form.querySelector('#input-name');
			const emailField = form.querySelector('#input-email');
			const companyField = form.querySelector('#input-company-uid');
			const roleField = form.querySelector('#input-role');

			// const fieldsArray = [
			// 	nameField,
			// 	emailField,
			// 	companyField,
			// 	roleField
			// ];

			// fieldsArray.forEach(field => {
			// 	field.addEventListener('change', inputValidator(fieldsArray));
			// });

			


			currentForm = formName;

			form.addEventListener('submit', e => {
				e.preventDefault();

				name = form.querySelector('#input-name').value;
				email = form.querySelector('#input-email').value;
				companyUID = form.querySelector('#input-company-uid').value;
				role = form.querySelector('#input-role').value;

				
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

			currentForm = formName;

			const nameField = form.querySelector('#input-name');
			const countryField = form.querySelector('#input-country');

			form.addEventListener('submit', e => {
				e.preventDefault();

				name = form.querySelector('#input-company-name').value;
				country = form.querySelector('#input-country').value;
	
				activeForm.classList.remove('active');
				administratorForm.classList.add('active');
				formChanger();
				
			});
		} 
		
		if (formName === 'login-form') {

			currentForm = formName;

			const passwordField = form.querySelector('#input-password');
			const emailField = form.querySelector('#input-email');
	
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

			
			form.addEventListener('submit', e => {
				e.preventDefault();

				//console.log("Submiting login");

				const inputEmail = form.querySelector("#input-email").value;
				const inputPass = form.querySelector("#input-password").value;

				login(inputEmail, inputPass);
			});
		}
	
		if (formName === 'admin-form') {

			const nameField = form.querySelector('#input-admin-name');
			const emailField = form.querySelector('#input-admin-email');
			const roleField = form.querySelector('#input-admin-role');

			form.addEventListener('submit', e => {
				e.preventDefault();

				administratorName = form.querySelector('#input-admin-name').value;
				administratorEmail = form.querySelector('#input-admin-email').value;
				administratorRole = form.querySelector('#input-admin-role').value;
	
				activeForm.classList.remove('active');
				passwordForm.classList.add('active');
				formChanger();
				
			});
		}

		if (formName === 'password-form') {

			const passwordField = form.querySelector('#input-password');
			const passwordConfirmField = form.querySelector('#input-password-confirm');

			form.addEventListener('submit', e => {
				e.preventDefault();

				password = form.querySelector('#input-password').value;
				passwordConfirm = form.querySelector('#input-password-confirm').value;
				//console.log(currentForm)
				if (currentForm === 'signup-form') {
					const data = {
						name,
						email,
						password,
						passwordConfirm,
						role,
						companyId: companyUID
					}

					signup(data);
				}
				else if (currentForm === 'company-form') {
					const data = {
						country,
						administratorEmail,
						administratorName,
						administratorRole,
						name,
						password,
						passwordConfirm
					}

					registerCompany(data);
				}
				else {
					// nothing...
				}
					
				
			});
		}

		// function inputValidator(fields) {

		// 	console.log("change registered");

		// 	let validate = true;
		// 	fields.forEach(field => {
		// 		if (!field.getAttribute('isvalid')) {
		// 			validate = false;
		// 		}
		// 	});
		// 	const submitBtn = form.querySelector('button[type = "submit"]');
		// 	if (validate) {
		// 		if (submitBtn) {
		// 			submitBtn.classList.add('primary--active');
		// 		}
		// 	}
		// 	else {
		// 		if (submitBtn) {
		// 			submitBtn.classList.add('primary--inactive');
		// 		}
		// 	}
		// }


	
	}

	

	formChanger();

}

if (currentPath.startsWith('/verifyEmail/')) {
	const code = currentPath.split('/')[2];
	//console.log(code);
	sendVerifyRequest(code);

	
}

