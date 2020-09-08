import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userName: "",
		tempData: [],
		stationMsg: {},
		selectStationGuids: [], // 选择的站点guids
		// 站点的信息
		station: {
			name: '',
			emp: '',
			guid: ''
		}
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
		setStationGuids(state, data) {
			state.selectStationGuids = data
		},
		setStationData(state, data) {
			state.station = data
		},
		setStationEmp(state, data) {
			state.station.emp = data 
		}
	}
})

export default store
