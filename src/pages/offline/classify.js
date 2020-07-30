// 只区分颜色  不区分尺码
export const SelectByColor = data => {
	var MO = new Set()
	var temp = ''
	data.map((element) => {
		temp = JSON.stringify({
			MO: element.MO,
			StyleNo: element.StyleNo,
			ColorName: element.ColorName
		})
		MO.add(temp)
	})
	var title = [...MO].map(e => JSON.parse(e)) // json 字符串数组
	var sum = 0
	var ele = {}
	var res = []
	for (var i = 0; i < title.length; i++) {
		sum = 0
		for (var j = 0; j < data.length; j++) {
			if (title[i].MO == data[j].MO && title[i].ColorName == data[j].ColorName) {
				sum += data[j].Qty
			}
		}
		ele = Object.assign(title[i], { 'Qty': sum })
		res.push(ele)
	}
	console.log(res);
	return res
}

// 只区分尺码 不区分颜色
export const SelectBySize = data => {
	var MO = new Set()
	var temp = ''
	data.map((element) => {
		temp = JSON.stringify({
			MO: element.MO,
			StyleNo: element.StyleNo,
			SizeName: element.SizeName
		})
		MO.add(temp)
	})
	var title = [...MO].map(e => JSON.parse(e)) // json 字符串数组
	var sum = 0
	var ele = {}
	var res = []
	console.log(title);
	console.log(data);
	for (var i = 0; i < title.length; i++) {
		sum = 0
		for (var j = 0; j < data.length; j++) {
			if (title[i].MO == data[j].MO && title[i].SizeName == data[j].SizeName) {
				sum += data[j].Qty
			}
		}
		ele = Object.assign(title[i], { 'Qty': sum })
		res.push(ele)
	}
	console.log(res);
	return res
}

// 区分颜色  区分尺码
export const SelectByColorSize = data => {
	return data
}
// 不区分颜色和尺码
export const SelectAll = data => {
	// 去重 求出 所有MO
	var s = new Set()
	var temp = ''
	data.forEach(e => {
		temp = JSON.stringify({
			MO: e.MO,
			StyleNo: e.StyleNo
		})
		s.add(temp)
	})
	var MOs = [...s].map(e => JSON.parse(e))
	// 不区分颜色  不区分尺码 SUM求和
	console.log(MOs);
	var res = []
	var ele = {}
	MOs.forEach(v => {
		var SUM = 0
		console.log(v);
		data.forEach(e => {
			if (e.MO == v.MO) {
				SUM += e.Qty
			}
		})
		ele = Object.assign(v, { 'Qty': SUM })
		res.push(ele)
	})
	console.log(res);
	return res
}
