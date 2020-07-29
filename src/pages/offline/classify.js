// 只区分颜色  不区分尺码
export const SelectByColor = data => {

}

// 只区尺码 不区分颜色
export const SelectBySize = data => {

}

// 区分颜色  区分尺码
export const SelectByColorSize = data => {

}
// 不区分颜色和尺码
export const SelectAll = data =>{
	// 去重 求出 所有MO
	var s = new Set()
	data.forEach(e => {
		s.add(e.MO)
	})
	var MOs = [...s]
	// 不区分颜色  不区分尺码 SUM求和
	console.log(MOs);
	var res = []
	MOs.forEach(v => {
		var SUM = 0
		console.log(v);
		data.forEach(e => {
			if (e.MO == v) {
				SUM += e.Qty
			}
		})
		res.push({
			'MO': v,
			'Qty': SUM,
		})
	})
	return res
}

