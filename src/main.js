import Vue from 'vue'
import App from './App'

import store from './store'
import router from './router'
import { RouterMount } from 'uni-simple-router'
Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	router,
	store,
	...App
})

// #ifdef H5
	RouterMount(app,'#app');
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif