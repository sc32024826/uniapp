export default function $http(options) {
	let {
		url,
		data,
		method
	} = options
	// #ifdef MP-WEIXIN
	url = url.replace(/\/services/,'http://test-api.servers.mchains.cn')
	url = url.replace(/\/sunrise/,'http://test-sunrise.servers.mchains.cn')
	url = url.replace(/\/tinwayerp/,'http://test-tinwayerp.servers.mchains.cn')
	// #endif
	return new Promise((resolve, reject) => {
		uni.request({
			url: url,
			data: data,
			method: method,
			success(res) {
				console.log(res);
				if (res.data.success) {
					resolve(res)
				}else{
					reject(res.data.msg)
					uni.showModal({
						content:res.data.msg,
						showCancel:false
					})
				}
			},
			fail(err) {
				reject(err)
				uni.showModal({
					content:err,
					showCancel:false
				})
			}
		})
	})
}
