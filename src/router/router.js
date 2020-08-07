const router = new Router({
  routes:[
    {
        //注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
	    path: '/pages/index/index',
		name: 'index',//在路由跳转时可直接使用name来跳转，后面会讲到
		aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
        //可以自定义路由元信息
        myDiy:{
            isTab:true
        },
        meta: {
	        title: '首页',
	    },
    },
    {
	    path: '/pages/home/list',
        name: 'list',
        meta: {
	        title: '列表',
	    },
	},
  ]
});