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
 * 获取当前在线衣架的款色码数量信息
 */
export const GetQtyOnlineMODCS = param => {
	return uni.request({
		url: '/sunrise/api/MESInterfaces/GetQtyOnlineMODCS',
		data: {
			"SeqCode": param
		}
	})
}
/**
 * 根据衣架号谁当该衣架为已完成
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
/**
 * 获取基础工序代码
 */
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
/**
 * 获取站点状态信息
 */
export const GetStationStatus = param => {
	return uni.request({
		url: '/sunrise/api/MESInterfaces/GetStationStatus',
		data: param
	})
}
/**
 * 获取生产线 信息
 */
export const GetLineStatus = param => {
	return uni.request({
		url: '/sunrise/api/MESInterfaces/GetLineStatus',
		data: param
	})
}
