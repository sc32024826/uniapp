export const GetLoginfoByCode = param => {
	return uni.request({
		url: "/dingtalk/api/Login/GetLoginfoByCode",
		data: param,
		method: 'GET'
	})
}
export const QueryProcessingHistoryByRackCode = param => {
	return uni.request({
		url: "/services/api/MESInterfaces/QueryProcessingHistoryByRackCode",
		data: {
			"Rackcode": param
		},
		header: {
			"Content-Type": "application/json; charset=utf-8"
		}
	})
}

export const tempfunction = param => {
	// return uni.request({
	// 	url: '',
	// 	data: {}
	// })
	return {
		data: [
			{ id: '1', content: '1-123-32423', Count: '1', Check: false },
			{ id: '2', content: '123123-dffgdrfs-sdfsd', Count: '50', Check: false },
			{ id: '3', content: '121211123123-dfgdsfs-dsdfsd', Count: '50000', Check: false }
		]

	}
}
/**
 * 设置衣架 状态
 * param int
 */
export const doneRack = param => {
	return uni.request({
		url: '/sunrise/api/MESInterfaces/SetRackToFinished',
		data: JSON.stringify(param),
		method: 'PUT',
		header: {
			"Content-Type": "application/json; charset=utf-8"
		}
	})
}
