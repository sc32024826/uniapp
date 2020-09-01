<template>
	<view class="container" @tap.prevent.stop>
		<uni-drawer ref="dra" mode="right" @change="toggleShow">
			<view class="label">当前站点:</view>
			<view class="uni-input">{{station}}</view>
			<view class="label"> 当前职工:</view>
			<picker :range="employee" range-key="label" mode='selector' :value="index" @change="change">
				<view class="uni-input">{{currentEmp}}</view>
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

	export default {
		components: {
			uniDrawer
		},
		props: {
			// 站点名称  1-1
			station: {
				type: String
			},
			current: {
				type: String
			},
			// 站点guid
			guid: {
				type: String
			}
		},
		data() {
			return {
				employee: [],
				index: 0,
				btnLoginDisable: false,
				btnLogoutDisable: false,
				currentEmp: '无职工',
				indexBak: 0, // 用于当更改职工后又取消操作时的 数据缓存
				stationEmp: ''
			}
		},
		created() {
			this.getEmployeeData()
		},
		methods: {
			login() {

				let param = {
					StationGuid: this.guid,
					EmployeeGuid: this.index != -1 ? this.employee[this.index].value : ''
				}
				if (this.index > -1) {
					uni.showModal({
						content: '职工: ' + this.currentEmp + ' 登录站点: ' + this.station,
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
					StationGuid: this.guid,
					EmployeeGuid: ''
				}
				console.log(this.currentEmp)
				if (this.stationEmp == '无职工') {
					uni.showModal({
						content: '当前站点没有职工需要下线',
						showCancel: false
					})
				} else {
					uni.showModal({
						content: '确定登出 ' + this.stationEmp + ' ?',
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
						this.employee = res.data.response
					} else {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
					}
				}
			},
			// picker 切换 此时index 必定大于-1  因此不需要判断-1 情况
			change(e) {
				console.log(e)
				this.index = e.target.value
				this.currentEmp = this.employee[this.index].label
			},
			//抽屉的开启和关闭时触发
			toggleShow(val) {
				if (!val) {
					console.log('抽屉 未操作关闭  重新设定初始值', this.indexBak)
					this.index = this.indexBak
					this.currentEmp = this.index == -1 ? '无职工' : this.employee[this.index].label
				}
			},
			setCurrentEmp(data) {
				let index = this.employee.findIndex((m) =>
					m.label.replace(/\s/g, '') == data
				)
				this.index = index
				this.indexBak = index
				this.stationEmp = index == -1 ? '无职工' : this.employee[index].label
				this.currentEmp = index == -1 ? '无职工' : this.employee[index].label
			},
			// 根据站点唯一键设定站点员工登陆状态
			async setStationStation(param) {

				console.log(param)
				var [err, res] = await SetStationLoginByStationGuid(param)
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
		margin-left: 30rpx;
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
