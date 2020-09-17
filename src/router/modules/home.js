const home = [{
		//注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
		path: '/pages/index/index',
		aliasPath: '/', //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'index',
		meta: {
			title: 'ShanYing登录中...'
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
		path: '/pages/workLine/workLine',
		name: 'workLineH5',
		meta: {
			title: '生产线'
		}
	},
	{
		path: '/pages/workLine/index',
		name: 'workLine',
		meta: {
			title: '生产线'
		}
	},
	{
		path: '/pages/TreeData/index',
		name: 'TreeData',
		meta: {
			title: '站点方案分配'
		}
	},
	{
		path: '/pages/order/order',
		name: 'order',
		meta: {
			title: '生产单'
		}
	}
]
export default home
