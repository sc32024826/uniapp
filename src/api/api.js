export const QueryProcessingHistoryByRackCode = param => {
	return uni.request({
		url: "http://test-api.servers.mchains.cn/api/MESInterfaces/QueryProcessingHistoryByRackCode",
		data: {
			"Rackcode": param
		},
		header: {
			"Content-Type": "application/json; charset=utf-8"
		}
	})
}
