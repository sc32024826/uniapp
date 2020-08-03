
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
	var guids = []
	for (var i = 0; i < title.length; i++) {
		sum = 0
		guids = []
		for (var j = 0; j < data.length; j++) {
			if (title[i].MO == data[j].MO && title[i].ColorName == data[j].ColorName) {
				sum += data[j].Qty
				guids.push(data[j].ZdOnlineGuid)
			}
		}
		ele = Object.assign(title[i], { 'id': i.toString(), 'Qty': sum, 'list': guids, 'checked': false })
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
	var guids = []
	for (var i = 0; i < title.length; i++) {
		sum = 0
		guids = []
		for (var j = 0; j < data.length; j++) {
			if (title[i].MO == data[j].MO && title[i].SizeName == data[j].SizeName) {
				sum += data[j].Qty
				guids.push(data[j].ZdOnlineGuid)
			}
		}
		ele = Object.assign(title[i], { 'id': i.toString(), 'Qty': sum, 'list': guids, 'checked': false })
		res.push(ele)
	}
	return res
}

// 区分颜色  区分尺码
export const SelectByColorSize = data => {
	var res = []
	data.map((v, k) => {
		v = Object.assign(v, { 'id': k.toString(), 'list': [v.ZdOnlineGuid], 'checked': false })
		res.push(v)
	})
	return res
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
	var res = []
	var ele = {}
	var guids = []
	var SUM = 0
	MOs.forEach((v, k) => {
		SUM = 0
		guids = []
		data.forEach(e => {
			if (e.MO == v.MO) {
				guids.push(e.ZdOnlineGuid)
				SUM += e.Qty
			}
		})
		ele = Object.assign(v, { 'id': k.toString(), 'Qty': SUM, 'list': guids, 'checked': false })
		res.push(ele)
	})
	return res
}
