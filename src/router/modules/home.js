const home = [{
		//注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
		path: '/pages/index/index',
		aliasPath: '/', //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'index',
		meta: {
			title: '首页'
		},
	},
	{
		path: '/pages/main/main',
		name: 'workTable',
		meta: {
			title: '工作台'
		},
	},
	{
		path: '/pages/my/my',
		name: 'my',
		meta: {
			title: '我的'
		}
	},
	{
		path: '/pages/offline/offline',
		name: 'offline',
		meta: {
			title: '下线衣架'
		}
	},
	{
		path: '/pages/ProcessRecord/ProcessRecord',
		name: 'ProcessRecord',
		meta: {
			title: '加工记录'
		}
	},
	{
		path: '/pages/nfc/nfc',
		name: 'nfc',
		meta: {
			title: 'NFC'
		}
	},
	{
		path: '/pages/ProInfo/ProInfo',
		name: 'ProInfo',
		meta: {
			title: '今日生产情况'
		}
	},
	{
		path: '/pages/usual/usual',
		name: 'usual',
		meta: {
			title: '常用功能'
		}
	},
	{
		path: '/pages/details/details',
		name: 'details',
		meta: {
			title: '站点信息'
		}
	},
	{
		path: '/pages/beforeOffline/beforeOffline',
		name: 'beforeOffline',
		meta: {
			title: '生产线'
		}
	},
	{
		path: '/pages/TreeData/TreeData',
		name: 'TreeData',
		meta: {
			title: ''
		}
	}
]
export default home
