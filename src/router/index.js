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
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	uni.showLoading({
		
	})
	if(to.name == 'index'){
		next()
	}else{
		if(store.state.userName){
			console.log(store.state.userName)
			next()
		}else{
			router.push({name:'index'})
		}
	}

	
})
// 全局路由后置守卫
router.afterEach((to, from) => {
	uni.hideLoading()
})
export default router;
