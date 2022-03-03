import axios from 'axios';
import { checkUpdateTaskGroup, createTaskGroup, removeAllTaskGroups, createSearchDropdown, removeSearchDropDown } from './createDOM';
import { showAlert } from './alert';
import { success } from '../../utils/colorCli';

let tasksData, usersData, teamsData;
let previousTaskData;

export const getTaskData = async (options) => {

	try {
	//	console.log("trying to get data");
		const res = await axios({
			method: 'GET',						// <- Axios also triggers the errors
			url: '/api/v1/tasks/getMyTasks'
		});
		
		if (res.data.message === 'success') {
			
			//console.log("!!! DATA RECIEVIED !!!");
			//console.log("res", res);
			const { data } = res.data;
			previousTaskData = data;
			
			//removeAllTaskGroups();
			//createTaskGroup(data, option);
			checkUpdateTaskGroup(data, options);
			//console.log("after data, option: ", option);
			tasksData = data;
			return data;
		}

		if (res.statusCode === 401) {
			
		}
		else {
			//console.log("There seems to be an error on our side. Please try again later !!");
		}
		
	}
	catch (err) {
		//console.log(err);
		showAlert('error', err.response.data.message);
	}
}
export const getTeamData = async () => {
	try {
		//console.log("trying to get team data");
		const res = await axios({
			method: 'GET',						// <- Axios also triggers the errors
			url: '/api/v1/teams/'
		});

		if (res.data.message === 'success') {
			//console.log("!!! TEAM DATA RECIEVIED !!!");
			const { data } = res.data;
			///console.log('res: ', data);
			teamsData = data.teams;
			return data;
		}
		
	}
	catch (err) {
		showAlert('error', err.response.data.message);
	}
}
export const getUserData = async () => {
	try {
		//console.log("trying to get user data");
		const res = await axios({
			method: 'GET',						// <- Axios also triggers the errors
			url: '/api/v1/users/'
		});

		if (res.data.message === 'success') {
		//	console.log("!!! User DATA RECIEVIED !!!");
			const { data } = res.data;
			//console.log('res: ', data);
			usersData = data.users;
			return data;
		}
		
	}
	catch (err) {
		showAlert('error', err.response.data.message);
	}
}

export const getAssignToSearchData = async (searchValue) => {
	try {
		//console.log("searchValue=", searchValue);

		let searchResult = [];
		searchResult = searchResult.concat(usersData.filter(item => (item.name.toLowerCase().startsWith(searchValue.toLowerCase()))));
		searchResult = searchResult.concat(teamsData.filter(item => (item.name.toLowerCase().startsWith(searchValue.toLowerCase()))));

		if (searchValue.startsWith('T-')) {
			searchResult = searchResult.concat(teamsData.filter(item => (item.teamId.startsWith(searchValue))));
		}
		if (searchValue.startsWith('U-')) {
			searchResult = searchResult.concat(usersData.filter(item => (item.userId.startsWith(searchValue))));
		}
		createSearchDropdown(searchResult, 'assignToResult');

		if (!searchValue) {
			removeSearchDropDown('assignToResult');
		}
		
		//console.log(searchResult, 'assignToResult');
	}
	catch (err) {
		//console.log(err);
		showAlert('error', err.response.data.message);
	}
} 
export const sendTaskFormData = async (data) => {

	try {
		const assignedTo = Object.assign({}, data.assignedTo);

		//console.log('assignedTo: ', assignedTo);

		const sendData = {
			title: data.title,
			startDate: data.startData,
			endDate: data.endDate,
			description: data.description,
			assignedTo: data.assignedTo,
			steps: data.steps,
			projects: data.projects

		};



		//const formData = new FormData();

		//console.log("type: ", typeof data.assignedTo);
		const res = await axios({
			method: 'POST',						// <- Axios also triggers the errors
			url: '/api/v1/tasks/',
			data: sendData
		});

		if (res.data.message === 'success') {
			//console.log('success');
			showAlert('success', 'Task created successfully');
		}
	}
	catch (err) {
		showAlert('error', err.response.data.message);
	}
}
export const completeTask = async (taskId) => {
	try {
		const res = await axios({
			method: 'GET',						// <- Axios also triggers the errors
			url: `/api/v1/tasks/complete/${taskId}`
			//data: updateBody
		});

		if (res.data.message === 'success') {
			//console.log('success');
			showAlert('success', 'Task completed successfully');
			
		}
	}
	catch (err) {
		showAlert('error', err.response.data.message);
	}
}
export const delTask = async (taskId) => {
	try {
		const res = await axios({
			method: 'DELETE',						// <- Axios also triggers the errors
			url: `/api/v1/tasks/${taskId}`
			//data: updateBody
		});

		if (res.data.message === 'success') {
			console.log('success');
			showAlert('success', 'Task deleted successfully');
		}
	}
	catch (err) {
		showAlert('error', err.response.data.message);
	}
}


