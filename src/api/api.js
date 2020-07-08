export const GetLoginfoByCode = param => {
	return uni.request({
		url: "/api2/Login/GetLoginfoByCode",
		data: param,
		header: {
			"Content-Type": "application/json; charset=utf-8"
		}
	})
}
export const QueryProcessingHistoryByRackCode = param => {
	return uni.request({
		url: "/api/MESInterfaces/QueryProcessingHistoryByRackCode",
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
