<template>
	<view class="container">
		<uni-drawer ref="dra" mode="right">
			<view class="label">当前站点:</view>
			<view class="uni-input">{{station.name}}</view>
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
		data() {
			return {
				employee: [{ label: '无职工', value: '' }],
				index: 0,
				btnLoginDisable: false,
				btnLogoutDisable: false,
				currentEmp: '无职工'
			}
		},
		computed: {
			...mapState(['station'])
		},
		async mounted() {
			this.employee = await this.getEmployeeData()
			this.currentEmp = this.station.emp == 'null-null' ? '' : this.station.emp
		},
		methods: {
			...mapMutations(['setStationData', 'setStationEmp']),
			login() {
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
							this.btnLoginDisable = true
							this.$refs.dra.close()
							setTimeout(() => {
								this.btnLoginDisable = false
							}, 1000)
						}
					})
				} else {
					uni.showModal({
						content: '你没有选择职工,若要登出请选择职工登出',
						showCancel: false
					})
				}

			},
			// 员工登出
			logout() {
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
							this.btnLogoutDisable = true
							this.$refs.dra.close()
							setTimeout(() => {
								this.btnLogoutDisable = false
							}, 1000)
						}
					})
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
				console.log(param)
				let para = {
					StationGuid: param.StationGuid,
					EmployeeGuid: param.EmployeeGuid
				}
				var [err, res] = await SetStationLoginByStationGuid(para)
				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					if (res.data.success) {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
						// 更新当前站点的登录员工
						this.setStationEmp(param.emp)
						this.currentEmp = this.station.emp
					} else {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
					}
				}
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
		// margin-left: 30rpx;
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
