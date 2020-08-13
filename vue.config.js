module.exports = {
	"transpileDependencies": ['uni-simple-router'],
	"devServer": {
		"proxy": {
			'/services': {
				"target": 'http://test-api.servers.mchains.cn',
				"changeOrigin": true,
				"ws": true,
				"pathRewrite": {
					'^/services': ''
				}
			},
			'/dingtalk': {
				"target": 'http://dingtalk.servers.mchains.cn',
				"changeOrigin": true,
				"ws": true,
				"pathRewrite": {
					'^/dingtalk': ''
				}
			},
			'/sunrise': {
				"target": 'http://test-sunrise.servers.mchains.cn',
				// "target": 'http://localhost',
				"changeOrigin": true,
				"ws": true,
				"pathRewrite": {
					'^/sunrise': ''
				}
			}
		},
		"sockHost": 'http://localhost:8080/',
		"disableHostCheck": true

	}
}
