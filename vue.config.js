module.exports = {
	"devServer": {
		"proxy": {
			'/api2': {
				"target": 'http://test-api.servers.mchains.cn',
				"changeOrigin": true,
				"ws": true,
				"pathRewrite": {
					'^/api2': '/api'
				}
			},
			'/api/': {
				"target": 'http://dingtalk.servers.mchains.cn',
				"changeOrigin": true,
				"ws": true
			}
		}
	}
}
