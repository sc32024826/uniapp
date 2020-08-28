import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userName: "",
		tempData: [],
		stationMsg: {},
		selectGuids: []
	},
	mutations: {
		login(state, userName) {
			state.userName = userName;
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		},
		setTempData(state, data) {
			// 深拷贝 数据
			state.tempData = JSON.parse(JSON.stringify(data))
		},
		setStationMsg(state, data) {
			state.stationMsg = data
		},
		setGuids(state, data) {
			state.selectGuids = data
		}
	}
})

export default store
