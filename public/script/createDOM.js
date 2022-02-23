import moment from 'moment';
import { monthShort } from './utils';
import { profileImageStackLayout } from "./style";

export const createTaskItem = (task) => {

	//console.log(task);
	const startDate = new moment(task.startDate);
	const endDate = new moment(task.endDate);
	const currentDate = new moment(Date.now());
	const totalDiff = moment.duration(endDate.diff(startDate)).as('hours');
	const remainDiff = moment.duration(endDate.diff(currentDate)).as('hours');

	//console.log("duration: ", totalDiff, remainDiff);

	const taskItem = document.createElement("div");
	taskItem.classList.add("task-item");
	taskItem.setAttribute("data-taskId", `${task.taskId}`);

	if (remainDiff / totalDiff < 0.25) {
		//console.log("!!! LATE !!!")
		taskItem.classList.add("late2");
	}
	if (remainDiff / totalDiff < 0.1) {
		//console.log("!!! LATE !!!")
		taskItem.classList.add("late3");
	}
	
	// inside task item: 
	const contents = document.createElement("div");
	const assign = document.createElement("div");
	contents.classList.add("contents");
	assign.classList.add("assign");

	// inside .task-item .contents:
	const text = document.createElement("div");
	text.classList.add("text");
	const time = document.createElement("div");
	time.classList.add("time");

	// inside .task-item .contents .text:
	const contentHeading = document.createElement("a");
	const contentText = document.createElement("a");
	const contentLink = document.createElement("a");

	contentHeading.classList.add("heading-task");
	contentText.classList.add("text-task");
	contentLink.classList.add("link");
	contentHeading.innerHTML = task.title || "";
	contentText.innerHTML = task.description || "";
	contentLink.innerHTML = "view more";


	// inside .task-item .contents .time:
	const timeItem1 = document.createElement("a");
	const timeItem2 = document.createElement("a");
	const timeIcons = document.createElement("div");
	timeItem1.classList.add("item");
	timeItem2.classList.add("item");
	timeIcons.classList.add("icons");
	timeItem1.innerHTML = `${moment(task.endDate).toObject().date} ${monthShort(moment(task.endDate).toObject().months)} ${moment(task.endDate).toObject().years}`;
	timeItem2.innerHTML = `by ${moment(task.endDate).toObject().hours}:${moment(task.endDate).toObject().minutes} hrs`;


	// inside .task-item .contents .time .icons:
	const timeIcon1 = document.createElement("i")
	const timeIcon2 = document.createElement("i")
	const timeIcon3 = document.createElement("i")
	timeIcon1.classList.add("fas", "fa-times-circle", "no");
	timeIcon2.classList.add("fas", "fa-plus-circle", "add");
	timeIcon3.classList.add("fas", "fa-check-circle", "done");

	// inside .task-item .assign:
	const assignItem1 = document.createElement("div");
	const assignItem2 = document.createElement("div");

	assignItem1.classList.add("item");
	assignItem2.classList.add("item");

	// inside .task-item .assign .assignItem1:
	const assignName = document.createElement("div");
	const assignImages = document.createElement("div");

	assignImages.classList.add("profile-img-stack");
	assignName.classList.add("name");

	// inside .task-item .assign .assignItem2:
	const assign2Name = document.createElement("div");
	const assign2Images = document.createElement("div");

	assign2Images.classList.add("profile-img-stack");
	assign2Name.classList.add("name");

	// inside .task-item .assign .assignItem-1 .profile-img-stack:
	const assign1Image1 = document.createElement("div");
	const assign1Image2 = document.createElement("div");
	const assign1Image3 = document.createElement("div");

	assign1Image1.classList.add("profile-img");
	assign1Image2.classList.add("profile-img");
	assign1Image3.classList.add("profile-img");

	assign1Image1.style.backgroundImage = `url(/img/${task.assignedTo[0].image})`;
	if (task.assignedTo.length >= 2) {
		assign1Image2.style.backgroundImage = `url(/img/${task.assignedTo[1].image})`;
	}
	if (task.assignedTo.length >= 3) {
		assign1Image3.style.backgroundImage = `url(/img/${task.assignedTo[2].image})`;
	}
	
	

	// inside .task-item .assign .assignItem-2 .profile-img-stack:
	const assign2Image1 = document.createElement("div");
	assign2Image1.classList.add("profile-img");
	assign2Image1.style.backgroundImage = `url(/img/${task.assignedBy.image})`;

	// inside .task-item .assign .assignItem-1 names:
	const assign1NameSubText = document.createElement("a");
	const assign1NameText = document.createElement("a");

	assign1NameSubText.classList.add("sub-text");
	assign1NameText.classList.add("names");

	assign1NameSubText.innerHTML = "Assigned To";
	
	if (task.assignedTo.length >= 1) {
		assign1NameText.innerHTML = `${task.assignedTo[0].name}`;
	}
	if (task.assignedTo.length >= 2) {
		assign1NameText.innerHTML = `${task.assignedTo[0].name.split(' ')[0]}, ${task.assignedTo[1].name.split(' ')[0]}`;
	}
	if (task.assignedTo.length >= 3) {
		assign1NameText.innerHTML = `${task.assignedTo[0].name.split(' ')[0]}, ${task.assignedTo[1].name.split(' ')[0]}, ${task.assignedTo[2].name.split(' ')[0]}`;
	}
	

	// inside .task-item .assign .assignItem-2 names:
	const assign2NameSubText = document.createElement("a");
	const assign2NameText = document.createElement("a");

	assign2NameSubText.classList.add("sub-text");
	assign2NameText.classList.add("names");

	assign2NameSubText.innerHTML = "Assigned By";
	assign2NameText.innerHTML = `${task.assignedBy.name}`;

	// Appending everything ->
	timeIcons.appendChild(timeIcon1);
	timeIcons.appendChild(timeIcon2);
	timeIcons.appendChild(timeIcon3);

	time.appendChild(timeItem1);
	time.appendChild(timeItem2);
	time.appendChild(timeIcons);

	text.appendChild(contentHeading);
	text.appendChild(contentText);
	text.appendChild(contentLink);

	contents.appendChild(text);
	contents.appendChild(time);

	taskItem.appendChild(contents, assign);
	taskItem.appendChild(assign);

	assignImages.appendChild(assign1Image1);
	if (task.assignedTo.length >= 2) {
		assignImages.appendChild(assign1Image2);
	}
	if (task.assignedTo.length >= 3) {
		assignImages.appendChild(assign1Image3);
	}
	

	assignName.appendChild(assign1NameSubText);
	assignName.appendChild(assign1NameText);

	assignItem1.appendChild(assignImages);
	assignItem1.appendChild(assignName);

	assign2Images.appendChild(assign2Image1);

	assign2Name.appendChild(assign2NameSubText);
	assign2Name.appendChild(assign2NameText);

	assignItem2.appendChild(assign2Images);
	assignItem2.appendChild(assign2Name);

	assign.appendChild(assignItem1);
	assign.appendChild(assignItem2);

	return taskItem;

}
export const removeAllTaskGroups = () => {

	//console.log('removing tasks groups');
	const previousTaskGroups = document.querySelectorAll(".main .task-group");
	previousTaskGroups.forEach(group => {
		group.parentElement.removeChild(group);
	});
}
export const removeTaskGroup = (projectId) => {

	const mainBody = document.querySelector(".main");
	let taskGroupToBeRemoved
	if (projectId) {
		taskGroupToBeRemoved = mainBody.querySelector(`[data-projectId='${projectId}']`);
	}
	else {
		taskGroupToBeRemoved = mainBody.querySelector(`.task-group`);
	}

	//console.log('removing tasks group...');
	//const previousTaskGroups = document.querySelectorAll(".main .task-group");
	//const taskGroupToBeRemoved = Array.from(previousTaskGroups).find(group => (group.projectId === projectId));
	taskGroupToBeRemoved.parentElement.removeChild(taskGroupToBeRemoved);
}
export const createTaskGroup = (data, option) => {

	const mainBody = document.querySelector(".main");
	const {
		projects,
		assignedByUserTasks,
		assignedToUserTasks
	} = data;

	let currentTasks = [];

	if (option == 0) {
		currentTasks = assignedToUserTasks;
		//console.log("option 0 found: ",option);
	} else if (option == 1) {
		//console.log("option 1 found: ", option);
		currentTasks = assignedByUserTasks;
	}

	projects.forEach(project => {

		const projectTasks = currentTasks.filter(task => (task.projectId === project.projectId));

		if (projectTasks.length !== 0) {

			const taskGroup = document.createElement("div");
			const taskGroupContents = document.createElement("div");
			taskGroup.classList.add('task-group');
			taskGroupContents.classList.add("group-contents");
			taskGroup.setAttribute("data-projectId", `${project.projectId}`);

			const header = document.createElement("header");
			const title = document.createElement("div");
			const titleSubName = document.createElement("div");
			const titleName = document.createElement("div");

			title.classList.add("title");
			titleSubName.classList.add("sub-name");
			titleName.classList.add("name");

			titleSubName.innerHTML = "PROJECT";
			titleName.innerHTML = project.name;

			projectTasks.forEach(task => {
				const taskItem = createTaskItem(task);

				taskGroupContents.appendChild(taskItem);

				//console.log("type of return: ", typeof taskItem);
			});

			title.appendChild(titleSubName);
			title.appendChild(titleName);
			header.appendChild(title);
			taskGroup.appendChild(header);
			taskGroup.appendChild(taskGroupContents);

			mainBody.appendChild(taskGroup);

			profileImageStackLayout();
		}
	});
	//console.log("DATA RECIEVED");
}
// export const checkUpdateTaskItem = (task) => {
// 	const taskItem = document.querySelector(`["data-taskId" = ${task.taskId}]`);
// 	const taskContents = taskItem.querySelector('.contents');
// 	const taskAssignItem1 = taskItem.querySelectorAll('.assign .item')[0];
// 	const taskAssignItem2 = taskItem.querySelectorAll('.assign .item')[1];
// 	if (taskContents.querySelector('.text .heading-task').innerHTML !== task.title);
// 	if (taskContents.querySelector('.text .text-task').innerHTML !== task.description);
// 	if(taskAssignItem1.querySelector('.profile-img-stack .profile-img').style.)\
// }

export const checkUpdateTaskGroup = (data, option) => {
	const mainBody = document.querySelector(".main");
	const taskGroups = mainBody.querySelectorAll(".task-group");
	//console.log(taskGroups);

	//taskGroups[0].attributes.getNamedItem

	// taskGroups.forEach(group => {
	// 	console.log(group.getAttribute('data-projectId') === 'aaa');	
	// })
	const {
		projects,
		assignedByUserTasks,
		assignedToUserTasks
	} = data;

	let currentTasks = [];

	if (option == 0) {
		currentTasks = assignedToUserTasks;
		//console.log("option 0 found: ",option);
	} else if (option == 1) {
		//console.log("option 1 found: ", option);
		currentTasks = assignedByUserTasks;
	}

	const extraTaskGroups =  Array.from(taskGroups).filter(group => {	// TODO: FORMAT ALL CODE USING DATA ATTRIBUTE
		const checkProject = projects.filter(project => {
			
			return ((group.getAttribute(`data-projectId`) === project.projectId ));
		});
		if (checkProject.length !== 0 || group.getAttribute('id') === 'no-project')
			return false;
		return true;
		//if(mainBody.querySelector(`[data-]`))
	});

	//console.log("extraTaskGroups: ", extraTaskGroups);

	extraTaskGroups.forEach(group => {
		if(group.getAttribute('id') !== 'no-project')
			removeTaskGroup(group.getAttribute(`projectId`))
	});

	const newProjects = projects.filter(project => {
		const checkGroup = Array.from(taskGroups).filter(group => {
			//console.log('working...1');
			return ((group.getAttribute(`data-projectId`) === project.projectId));
		});
		if (checkGroup.length !== 0)
			return false;
		return true;
	});

	//console.log("newProjects", newProjects);

	createTaskGroup({
		projects: newProjects,
		assignedByUserTasks,
		assignedToUserTasks
	}, option);
	//console.log("array attribute looks like: ", Array.from(taskGroups)[0].getAttribute('projectId'));

	profileImageStackLayout();

	const updatedTaskGroups = mainBody.querySelectorAll(".task-group");

	// All PROJECT RELATED TASKS GROUPS ARE CREATED AND UPDATED ->
	updatedTaskGroups.forEach(group => {

		const currentGroupTasks = group.querySelectorAll('.group-contents .task-item');
		const groupTasks = currentTasks.filter(task => (task.projectId === group.getAttribute(`data-projectId`)));
		
		//console.log("task.projectId ", currentTasks[0].projectId);
		//console.log("group.getAttribute(`projectId`)", group.getAttribute(`data-projectId`));

		const newTasks = groupTasks.filter(groupTask => {
			const checkTask = Array.from(currentGroupTasks).filter(currentTask => {
				return currentTask.getAttribute(`data-taskId`) === groupTask.taskId;
			});
			if (checkTask.length !== 0)
				return false;
			return true;
		});

		const extraTasks = Array.from(currentGroupTasks).filter(currentTask => {
			const checkTask = groupTasks.filter(groupTask => {
				//console.log("task id attr: ",currentTask.getAttribute(`taskId`));
				//console.log("group task taskId: ", groupTask.taskId);
				return currentTask.getAttribute(`data-taskId`) === groupTask.taskId;
			});
			//console.log("checkTask: ", checkTask);
			if (checkTask.length !== 0)
				return false;
			return true;
		});
		//console.log("extra Tasks", extraTasks);
		//console.log("new Tasks", newTasks);

		extraTasks.forEach(task => {
			//console.log("removing task item");
			task.parentElement.removeChild(task);
		});

		newTasks.forEach(task => {
			//	console.log("adding taskItem");
			group.querySelector(".group-contents").append(createTaskItem(task));
				
		});

		profileImageStackLayout();

		const updatedGroupTasks = group.querySelectorAll('.group-contents .task-item');

		// updatedGroupTasks.forEach(task => {
		// 	// task.querySelector('.contents .text .heading-task').innerHTML = task.title;
		// 	// task.querySelector('.contents .text .heading-task').innerHTML = task.title;

		// 	//task = createTaskItem(task);
		// 	//  const currentTask = currentTasks.find(item => (item.taskId === task.getAttribute("data-taskId")));
		// 	//checkUpdateTaskItem(currentTask);

		// });
		
	});

		
	const noGroupTasks = currentTasks.filter(task => (!task.hasOwnProperty('projectId')));
	//console.log("noGropupTasks: ", noGroupTasks);

	// ALL OTHER_TASKS GROUP IS CREATED AND UPDATED ->
	if (noGroupTasks.length !== 0) {
		let noProjectGroup = mainBody.querySelector(".task-group#no-project");

		if (!noProjectGroup) {
			//console.log('not found');
			noProjectGroup = document.createElement("div");
			noProjectGroup.classList.add('task-group');
			noProjectGroup.setAttribute('id', 'no-project');
			const header = document.createElement("header");
			const title = document.createElement("div");
			const name = document.createElement("div");
			const groupContents = document.createElement("div");
			title.classList.add('title');
			name.classList.add('name');
			name.innerHTML = 'OTHER TASKS';
			groupContents.classList.add('group-contents');

			title.appendChild(name);
			header.appendChild(title);

			noProjectGroup.appendChild(header);
			noProjectGroup.appendChild(groupContents);

			mainBody.appendChild(noProjectGroup);


		}
		else {
			//console.log('found');
		}
		
		const currentGroupTasks = noProjectGroup.querySelectorAll('.task-item');

		const newTasks = noGroupTasks.filter(groupTask => {

			const checkTask = Array.from(currentGroupTasks).filter(currentTask => {
				return currentTask.getAttribute(`data-taskId`) === groupTask.taskId;
			});

			if (checkTask.length !== 0)
				return false;
			return true;
		});

		const extraTasks = Array.from(currentGroupTasks).filter(currentTask => {
			const checkTask = noGroupTasks.filter(groupTask => {
				//console.log("task id attr: ",currentTask.getAttribute(`taskId`));
				//console.log("group task taskId: ", groupTask.taskId);
				return currentTask.getAttribute(`data-taskId`) === groupTask.taskId;
			});
			//console.log("checkTask: ", checkTask);
			if (checkTask.length !== 0)
				return false;
			return true;
		});
		//console.log("extra Tasks", extraTasks);
		//console.log("new Tasks", newTasks);

		extraTasks.forEach(task => {		// <- This works fine
			console.log("removing task item");
			task.parentElement.removeChild(task);
		});

		newTasks.forEach(task => {		// the prblm is in newTasks algo
			//console.log("adding taskItem");
			noProjectGroup.querySelector(".group-contents").append(createTaskItem(task));
			profileImageStackLayout();
		});

		profileImageStackLayout();
		
	}

}

export const createSearchDropdown = (results, id) => {
	
	const searchBar = document.querySelector(`.search-bar#${id}`);
	let dropdown;
	
	if (searchBar.querySelector('.drop-down')) {
		//console.log("existing dropdown found");
		dropdown = searchBar.querySelector('.drop-down');

		if (results.length !== 0) {
			searchBar.appendChild(dropdown);
		}
		else {
			searchBar.removeChild(dropdown);
		}
	}
	else {
		//console.log("dropdown created");
		dropdown = document.createElement("div");
		dropdown.classList.add('drop-down');

		if (results.length !== 0) {
			searchBar.appendChild(dropdown);
		}
	}

	const profileElements = dropdown.querySelectorAll(".profile");
	profileElements.forEach(ele => {
		ele.parentElement.removeChild(ele);
	});

	results.forEach(result => {
		const profile = document.createElement("div");
		const leftSection = document.createElement("div");
		const profileImg = document.createElement("div");
		const name = document.createElement("div");
		const rightSection = document.createElement("div");
		const uid = document.createElement("div");
		const crossBtn = document.createElement("div");
		const crossIcon = document.createElement("span");

		profile.classList.add("profile");
		profile.setAttribute('data-id', result.id);
		leftSection.classList.add("left-section");
		profileImg.classList.add("profile-img");
		name.classList.add("name");
		rightSection.classList.add("right-section");
		uid.classList.add("uid");
		crossBtn.classList.add("cross-btn");
		crossIcon.classList.add("material-icons");

		crossIcon.innerHTML = 'close';
		crossBtn.appendChild(crossIcon);

		uid.innerHTML = result.userId || result.teamId;
		rightSection.appendChild(uid);

		name.innerHTML = result.name;
		profileImg.style = `background-image: url(/img/${result.image || 'teamDefault.png'})`;
		leftSection.appendChild(profileImg);
		leftSection.appendChild(name);

		profile.appendChild(leftSection);
		profile.appendChild(rightSection);
		//profile.appendChild(crossBtn);

		dropdown.appendChild(profile);

	});
}

export const removeSearchDropDown = (id) => {
	const searchBar = document.querySelector(`.search-bar#${id}`);

	const dropdown = searchBar.querySelector('.drop-down');

	if (dropdown) {
		dropdown.parentElement.removeChild(dropdown);
	}
}

export const addAssignToItem = (item) => {
	const taskForm = document.querySelector(".main form.form-task");
	const assignedToList = taskForm.querySelector(".items#assignedToResult");

	const crossBtn = document.createElement("div");
	const crossIcon = document.createElement("span");
	
	crossBtn.classList.add("cross-btn");
	crossIcon.classList.add("material-icons");
	
	crossIcon.innerHTML = 'close';
	crossBtn.appendChild(crossIcon);
	
	
	const uid = item.querySelector('.uid').innerHTML;

	item.setAttribute('data-uid', `${uid}`);

	const previousProfiles = assignedToList.childNodes;
	const duplicateProfile = Array.from(previousProfiles).filter(profile => (profile.getAttribute('data-uid') === uid));

	if (duplicateProfile.length === 0) {
		item.appendChild(crossBtn);
		assignedToList.appendChild(item);

		
	}
	
	
}