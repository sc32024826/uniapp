module.exports = {
	"devServer": {
		"proxy": {
			'/services': {
				"target": 'http://test-api.servers.mchains.cn',
				"changeOrigin": true,
				"ws": true,
				"pathRewrite":{
					'^/services':''
				}
			},
			'/dingtalk': {
				"target": 'http://dingtalk.servers.mchains.cn',
				"changeOrigin": true,
				"ws": true,
				"pathRewrite":{
					'^/dingtalk':''
				}
			},
			'/sunrise': {
				"target": 'http://test-sunrise.servers.mchains.cn',
				// "target": 'http://172.18.20.145:8081',
				"changeOrigin": true,
				"ws": true,
				"pathRewrite":{
					'^/sunrise':''
				}
			}
		}
	}
}
