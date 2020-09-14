import modules from './modules'
import Vue from 'vue'
//这里仅示范npm安装方式的引入，其它方式引入请看最上面【安装】部分
import Router from 'uni-simple-router'
import store from '@/store'

Vue.use(Router)
//初始化
const router = new Router({
	routes: [...modules] //路由表
});

const ENV = process.env.NODE_ENV

console.log('当前环境', ENV)
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	console.log('路由前置守卫')
	//#ifndef MP-WEIXIN
	if (to.meta.title) { document.title = to.meta.title }
	//#endif
	if (to.name == 'index') {
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
