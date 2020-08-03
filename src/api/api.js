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
/**
 * 在线衣架下线
 */
export const RackOffline = param => {
	return uni.request({
		url: '/sunrise/api/MESInterfaces/GetQtyOnlineMODCS',
		data: {
			"SeqCode": param
		}
	})
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

export const getSeqNameList = () => {
	return uni.request({
		url: '/sunrise/api/BaseInfo/GetBaseSeqCode'
	})
}

//根据在加工产品唯一键列表下线指定衣服数量的在线衣架
export const SetRackOfflineByZdOnlineGuid = param => {
	return uni.request({
		url: '/sunrise/api/MESInterfaces/SetRackOfflineByZdOnlineGuid',
		method: 'POST',
		data: param
	})
}
