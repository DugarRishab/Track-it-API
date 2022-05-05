
export const showAlert = (type, msg) => {

	removeAlert();

	const alert = document.createElement('div');
	alert.classList.add('alert');
	alert.classList.add(`${type}`);
	alert.innerHTML = msg;
	const body = document.querySelector('body');
	body.appendChild(alert);
	//console.log('alert created');
	window.setTimeout( removeAlert , 5000);
}

export const removeAlert = () => {

	const alert = document.querySelector('.alert');
	if (alert) {

		//console.log('alert removed');
		alert.parentElement.removeChild(alert);
	}
	
}