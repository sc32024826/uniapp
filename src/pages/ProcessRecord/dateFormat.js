function dateFormat(fmt, date) {
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}

function ISO8601(string) {
	var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
		"(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
		"(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
	if (string) {
		var d = string.match(new RegExp(regexp));
		var offset = 0;
		var date = new Date(d[1], 0, 1);

		if (d[3]) {
			date.setMonth(d[3] - 1);
		}
		if (d[5]) {
			date.setDate(d[5]);
		}
		if (d[7]) {
			date.setHours(d[7]);
		}
		if (d[8]) {
			date.setMinutes(d[8]);
		}
		if (d[10]) {
			date.setSeconds(d[10]);
		}
		if (d[12]) {
			date.setMilliseconds(Number("0." + d[12]) * 1000);
		}
		if (d[14]) {
			offset = (Number(d[16]) * 60) + Number(d[17]);
			offset *= ((d[15] == '-') ? 1 : -1);
		}
		offset -= date.getTimezoneOffset();
		var time = (Number(date) + (offset * 60 * 1000));
		return time;
	} else {
		return null;
	}
}
export  {
	dateFormat,
	ISO8601
}
