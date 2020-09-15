process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
	"transpileDependencies": ['uni-simple-router'],
	"devServer": {
		"proxy": {
			'/services': {
				"target": 'http://test-api.servers.mchains.cn',//代理地址，这里设置的地址会代替axios中设置的baseURL
				"changeOrigin": true,// 如果接口跨域，需要进行这个参数配置
				"ws": true,	// proxy websockets
				"pathRewrite": {	//pathRewrite方法重写url
					'^/services': ''
					//pathRewrite: {'^/api': '/'} 重写之后url为 http://192.168.1.16:8085/xxxx
					//pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
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
