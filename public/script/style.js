/* eslint-disable */

// CHECKBOX ->>
const check = document.querySelectorAll('.check');


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

export const profileImageStackLayout = () => {
	const stacks = document.querySelectorAll('.profile-img-stack');
	
	if (stacks) {
		stacks.forEach(stack => {
			//console.log("layouting");
			const stackItems = stack.querySelectorAll('.profile-img');
			// console.log("stack found");
			let i = 0;
			stackItems.forEach(item => {
				item.style.left = `${15 * i}px`;
				stack.style.width = `${30 + 15 * i}px`;
				i++;
			});
		})
	}
}

