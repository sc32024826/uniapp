import Vue from 'vue'
import App from './App'

import store from './store'
import Router, {RouterMount} from 'uni-simple-router'

Vue.config.productionTip = false

Vue.prototype.$store = store
// Vue.use(Router)
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
