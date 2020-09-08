<template>
	<view class="container">
		<uni-drawer ref="dra" mode="right">
			<view class="label">当前站点:</view>
			<view class="uni-input" v-if="showSingle">{{station.name}}</view>
			<view class="" v-if="showList">
				<ul>
					<li v-for="(item,index) of stationList" :key="index">{{item.name}}</li>
				</ul>
			</view>
			<view class="label"> 当前职工:</view>
			<view class="uni-input">{{currentEmp}}</view>
			<picker :range="employee" range-key="label" mode='selector' :value="index" @change="change">
				<view class="uni-input">{{employee[index].label}}</view>
			</picker>
			<view class="functionList">
				<button type="primary" @click="login" :disabled="btnLoginDisable">职工登录</button>
				<button type="primary" @click="logout" :disabled="btnLogoutDisable">职工登出</button>
			</view>

		</uni-drawer>

	</view>
</template>

<script>
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import { QueryEmployee, SetStationLoginByStationGuid } from '@/api/api.js'
	import { mapState, mapMutations } from 'vuex'

	export default {
		components: {
			uniDrawer
		},
		props: {
			stationList: {
				type: Array
			}
		},
		data() {
			return {
				employee: [{ label: '无职工', value: '' }],
				index: 0,
				btnLoginDisable: false,
				btnLogoutDisable: false,
				currentEmp: '无职工',
				showSingle: true,
				showList: false
			}
		},
		computed: {
			...mapState(['station'])
		},
		watch: {
			stationList(val) {
				if (val.length != 0) {
					this.showSingle = false
					this.showList = true
				}
			}
		},
		async mounted() {
			this.employee = await this.getEmployeeData()
			this.currentEmp = this.station.emp == 'null-null' ? '' : this.station.emp
		},
		methods: {
			...mapMutations(['setStationData', 'setStationEmp']),
			// 员工登录
			login() {
				this.btnLoginDisable = true
				this.$refs.dra.close()
				setTimeout(() => {
					this.btnLoginDisable = false
				}, 1000)
				// 多选站点模式
				if (this.stationList && this.stationList.length > 1) {
					// console.log('多站点模式');
					uni.showModal({
						content: '多站点模式会多次请求,请耐心等待!',
						success: (res) => {
							if (res.confirm) {
								let length = this.stationList.length
								let stop = false
								this.stationList.map((item, index) => {
									if (index == length - 1) {
										stop = true
									}
									let param = {
										StationGuid: item.guid,
										EmployeeGuid: this.employee[this.index].value,
										emp: this.employee[this.index].label,
										stop: stop
									}
									this.setStationStationMult(param)
								})
							}
						}
					})
				} else {
					// 单站点模式
					let param = {
						StationGuid: this.station.guid,
						EmployeeGuid: this.employee[this.index].value,
						emp: this.employee[this.index].label
					}
					if (this.index > -1) {
						uni.showModal({
							content: '职工: ' + this.employee[this.index].label + ' 登录站点: ' + this.station.name,
							success: (res) => {
								if (res.confirm) {
									this.setStationStation(param)
								}
							}
						})
					} else {
						uni.showModal({
							content: '你没有选择职工,若要登出请选择职工登出',
							showCancel: false
						})
					}
				}
			},
			// 员工登出
			logout() {
				this.btnLogoutDisable = true
				this.$refs.dra.close()
				setTimeout(() => {
					this.btnLogoutDisable = false
				}, 1000)
				// 多选站点模式
				if (this.stationList && this.stationList.length > 1) {
					uni.showModal({
						content: '多站点模式会多次请求,请耐心等待!',
						success: (res) => {
							if (res.confirm) {
								let length = this.stationList.length
								let stop = false
								this.stationList.map((item, index) => {
									if (index == length - 1) {
										stop = true
									}
									let param = {
										StationGuid: item.guid,
										EmployeeGuid: '',
										emp: '',
										stop: stop
									}
									this.setStationStationMult(param)
								})
							}
						}
					})
				} else {
					let param = {
						StationGuid: this.station.guid,
						EmployeeGuid: '',
						emp: ''
					}
					if (this.station.emp == 'null-null') {
						uni.showModal({
							content: '当前站点没有职工登录',
							showCancel: false
						})
					} else {
						uni.showModal({
							content: '确定登出 ' + this.station.emp + ' ?',
							success: (res) => {
								if (res.confirm) {
									this.setStationStation(param)
								}

							}
						})
					}
				}

			},
			open() {
				this.$refs.dra.open()
			},
			close() {
				this.$refs.dra.close()
			},
			// 获得职工列表
			async getEmployeeData() {
				var [err, res] = await QueryEmployee()
				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					if (res.data.success) {
						return res.data.response
					} else {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
					}
				}
			},
			// picker 切换 
			change(e) {
				this.index = e.target.value
			},
			// 根据站点唯一键设定站点员工登陆状态  
			async setStationStation(param) {
				this.$emit('onRequest',param)
			},
			// 多选站点时 会多次请求  需要屏蔽 多次 showModal
			async setStationStationMult(param) {
				this.$emit('onRequestMult', param)
			}
		}

	}
</script>

<style lang="less" scoped>
	.functionList {
		padding: 30rpx;

		button {
			margin-bottom: 30rpx;
		}

	}

	.uni-input {
		height: 50rpx;
		width: 100%;
		text-align: center;
	}

	.label {
		margin-top: 10rpx;
		margin-left: 10rpx;
		font-weight: bold;
	}

	picker {
		background-color: #c8c8c8;
		text-align: center;
		height: 80rpx;
		margin-top: 20rpx;
		padding-top: 20rpx;
	}
</style>
