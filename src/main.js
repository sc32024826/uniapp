import Vue from 'vue'
import App from './App'

import store from './store'
import 'pl-table/themes/index.css' 

import 'pl-table/themes/plTableStyle.css'

Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
