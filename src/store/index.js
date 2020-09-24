import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// 存储设备信息
		device: {
			safeArea: {},
			height: 812,
			width: 375
		},
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
		},
		userSelectStations: [] // 用户所选择的站点  单选和多选 公用此变量
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
		// proinfo 页面点击站点时 设定站点信息 站点数量为1, 为了优化多选站点 此时将存放于变量
		setStationData(state, data) {
			state.station = data
			state.userSelectStations = [] // 首先清空数据
			if (data instanceof Array) {
				console.log('data 是个数组')
				data.map(item => state.userSelectStations.push(item))
			} else {
				state.userSelectStations.push(data)
			}
		},
		setStationEmp(state, data) {
			state.station.emp = data
		},
		// 修改设备信息
		setDeviceInfo(state, data) {
			const {
				safeArea,
				height,
				width
			} = data
			state.device.safeArea = safeArea
			state.device.height = height
			state.device.width = width
		}
	}
})

export default store
