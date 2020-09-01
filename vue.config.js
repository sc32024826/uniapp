process.env.VUE_APP_VERSION = require('./package.json').version

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
				// "target": 'http://172.18.20.150:8081',
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
