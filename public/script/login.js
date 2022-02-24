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
			//alert('logged out');
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

export const sendVerifyRequest = async (code) => {
	try {
		const res = await axios({
			method: 'GET',						// <- Axios also triggers the errors
			url: `/api/v1/users/verifyEmail/${code}`,
			//data: sendData
		});
		if (res.data.message === 'success') {
			showAlert('success', 'You have been Verified');
			window.setTimeout(() => {
				location.assign('/tasks');
			}, 2500);
		}
	}
	catch (err) {
		showAlert('error', err.response.data.message);
	}
	
}

export const logout = async () => {
	try {
		const res = await axios({
			method: 'GET',						// <- Axios also triggers the errors
			url: '/api/v1/users/logout',
		
		});

		if (res.data.message === 'success') {
			showAlert('success', 'Logged out Successfully');
			alert('logged out');
			window.setTimeout(() => {
				location.assign('/');
			}, 2500);
		}
	}
	catch (err) {
		showAlert('error', err.response.data.message);
	}
}