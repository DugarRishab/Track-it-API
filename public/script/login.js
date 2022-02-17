/* eslint-disable*/

import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
	try {
		//console.log("trying to logging in");
		const res = await axios({
			method: 'POST',						// <- Axios also triggers the errors
			url: '/api/v1/users/login',
			data: {
				email,
				password
			}
		});
		//console.log(res);
		if (res.data.message === 'success') {
			//showAlert('success', 'logged in successfully');
			///console.log("LOged in succesfully");
			showAlert('success', 'Logged in Successfully');
			window.setTimeout(() => {
				location.assign('/tasks');
			}, 1500);
		}
	}
	catch (err) {
		//console.log('error: ', err.response.data.message);
		showAlert('error', err.response.data.message);
	}
}

export const signup = async (data) => {
	try {
		const res = await axios({
			method: 'POST',						// <- Axios also triggers the errors
			url: '/api/v1/users/signup',
			data
		});

		if (res.data.message === 'success') {
			//console.log('success');
			showAlert('success', 'Signed up Successfully');
			window.setTimeout(() => {
				location.assign('/tasks');
			}, 1500);
		}
	}
	catch (err) {
		//console.log('error: ', err.response.data.message);
		showAlert('error', err.response.data.message);
	}

	
}

export const registerCompany = async (data) => {
	
	try {
		const res = await axios({
			method: 'POST',						// <- Axios also triggers the errors
			url: '/api/v1/companies/',
			data
		});

		if (res.data.message === 'success') {
			//console.log('success');
			showAlert('success', 'Company registered Successfully');
			window.setTimeout(() => {
				location.assign('/tasks');
			}, 1500);
		}
	}
	catch (err) {
		//console.log('error: ', err.response.data.message);
		showAlert('error', err.response.data.message);
	}

	
}