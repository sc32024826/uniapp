/**
 * @param {Object} array
 * @param {Object} key
 */
function groupBy(array, key) {
	let obj = {};
	array.forEach(function(o) {
		let group = JSON.stringify(o[key]) + '号线'
		obj[group] = obj[group] || [];
		obj[group].push(o);
	});
	return Object.keys(obj).map(function(group) {
		let res = {}
		res.name = group
		res.list = obj[group]
		return res
	});
}

export default groupBy
