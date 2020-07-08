module.exports = {
	"devServer": {
		"proxy": {
			'/api': {
				"target": 'http://test-api.servers.mchains.cn',
				"changeOrigin": true,
				"ws": true
			},
			'/api2': {
				"target": 'http://dingtalk.servers.mchains.cn',
				"changeOrigin": true,
				"ws": true
			}
		}
	}
}
