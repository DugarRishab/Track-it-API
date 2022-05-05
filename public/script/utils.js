export const monthShort = (monthNum) => {
	const monthName = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return monthName[monthNum];
}

// export const notContains = (array1, prop1, array2, prop2) => {
// 	const extraItems = array1.filter(array1Item => {
// 		const checkItem = array2.filter(array2Item => {
// 			return array1Item.prop1 === array2Item.prop2;
// 		});
// 		if (checkItem)
// 			return false;
// 		return true;
// 	});
// }

// export const notContains = ({ array1, type1, prop1 }, { array2, type2, prop2 }) => {
// 	if (type1 === 'html') {
// 		prop1 = '.getAttribute(`${}`)'
// 	}

// 	const extraItems = array1.filter(array1Item => {
// 		const checkItem = array2.filter(array2Item => {
// 			return array1Item.prop1 === array2Item.prop2;
// 		});
// 		if (checkItem)
// 			return false;
// 		return true;
// 	});
// }