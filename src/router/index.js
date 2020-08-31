import modules from './modules'
import Vue from 'vue'
//这里仅示范npm安装方式的引入，其它方式引入请看最上面【安装】部分
import Router from 'uni-simple-router'
import store from '@/store'
import * as dd from "dingtalk-jsapi"

Vue.use(Router)
//初始化
const router = new Router({
	routes: [...modules] //路由表
});

const ENV = process.env.NODE_ENV

console.log('当前环境', ENV)
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	if (to.meta.title) { document.title = to.meta.title }
	let env = dd.env.platform
	if (env == 'notInDingTalk') {
		
	} else {
		// 设置钉钉导航栏标题 start
		dd.ready(function() {

			dd.biz.navigation.setTitle({
				title: document.title, // 控制标题文本，空字符串表示显示默认文本
				onSuccess: result => {},
				onFail: err => {}
			})
		})
	}

	if (to.name == 'index') {
		console.log('不需要登录 直接跳转')
		next()
	} else {
		// 如果是开发模式则放行
		if (store.state.userName || ENV === 'development') {
			next()
		} else {
			router.push({ name: 'index' })
		}
	}


})
// 全局路由后置守卫
router.afterEach((to, from) => {

})
export default router;
