import $http from '../http.js'


export const GetLoginfoByCode = param => {
	return $http({
		url: "/dingtalk/api/Login/GetLoginfoByCode",
		data: param,
		method: 'GET'
	})
}
export const QueryProcessingHistoryByRackCode = param => {
	return $http({
		url: "/services/api/MESInterfaces/QueryProcessingHistoryByRackCode",
		data: {
			"Rackcode": param
		}
	})
}
/**
 * 获取当前在线衣架的款色码数量信息
 */
export const GetQtyOnlineMODCS = param => {
	return $http({
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
	return $http({
		url: '/sunrise/api/MESInterfaces/SetRackToFinished',
		data: JSON.stringify(param),
		method: 'PUT'
	})
}
/**
 * 获取基础工序代码
 */
export const getSeqNameList = () => {
	return $http({
		url: '/sunrise/api/BaseInfo/GetBaseSeqCode'
	})
}

//根据在加工产品唯一键列表下线指定衣服数量的在线衣架
export const SetRackOfflineByZdOnlineGuid = param => {
	return $http({
		url: '/sunrise/api/MESInterfaces/SetRackOfflineByZdOnlineGuid',
		method: 'POST',
		data: param
	})
}
/**
 * 获取站点状态信息
 */
export const GetStationStatus = param => {
	return $http({
		url: '/sunrise/api/MESInterfaces/GetStationStatus',
		data: param
	})
}
/**
 * 获取生产线 信息
 */
export const GetLineStatus = param => {
	return $http({
		url: '/sunrise/api/MESInterfaces/GetLineStatus',
		data: param
	})
}
/**
 * 根据站点唯一键查询站内衣架信息
 */
export const QueryInStationRackInfByStationGuid = param => {
	return $http({
		url: '/sunrise/api/MESInterfaces/QueryInStationRackInfByStationGuid',
		data: param
	})
}
/**
 * 设置生产线启停
 */
export const SetLinePause = param => {
	return $http({
		url: '/sunrise/api/MESInterfaces/SetLinePause',
		data: param,
		method: 'PUT'
	})
}
/**
 * 根据站点唯一码获取站点当前已分配款色码
 */
export const GetStationAssign = param => {
	return $http({
		url: '/sunrise/api/MESInterfaces/GetStationAssignInfoResultsByStation',
		data: param
	})
}
/**
 * 查询各工序未完工的衣架及衣服数
 */
export const QueryQtyWithSeq = () => {
	return $http({
		url: '/sunrise/api/MESInterfaces/QueryQtyWithSeq'
	})
}

/**
 * 根据款色码信息返回对应的方案唯一键列表
 */
export const QueryRouteGuidsByMODCS = param => {
	return $http({
		url: '/sunrise/api/MESInterfaces/QueryRouteGuidsByMODCS',
		data: param
	})
}

/**
 * 根据方案唯一键列表设定站点对于此方案列表是否允许进衣
 */
export const SetStAssignByRouteGuids = param => {
	return $http({
		url: '/sunrise/api/MESInterfaces/SetStAssignByRouteGuids',
		data: param,
		method: 'PUT'
	})
}
/**
 * 获取在职员工列表
 */
export const QueryEmployee = () => {
	return $http({
		url: '/sunrise/api/BaseInfo/QueryEmployee'
	})
}
/**
 * 根据站点唯一键设定站点员工登陆状态
 */
export const SetStationLoginByStationGuid = param => {
	return $http({
		url: '/sunrise/api/MESInterfaces/SetStationLoginByStationGuid',
		data: param,
		method: 'PUT'
	})
}


export const QueryMO = param => {
	return $http({
		url: '/tinwayerp/api/ProductionManagement/QueryMO',
		data: param
	})
}
