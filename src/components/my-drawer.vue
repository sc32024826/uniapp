<template>
	<view class="container">
		<uni-drawer ref="dra" mode="right">
			<view class="label"> 当前职工:</view>
			<picker :range="employee" range-key="label" mode='selector' :value="index" @change="change" @touchmove.prevent.stop>
				<view class="uni-input">{{employee.length == 0 ? '' : employee[index].label}}</view>
			</picker>
			<view class="functionList">
				<button type="primary" @click="login">职工登录</button>
				<button type="primary" @click="logout">职工登出</button>
			</view>

		</uni-drawer>

	</view>
</template>

<script>
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import { QueryEmployee } from '@/api/api.js'

	export default {
		components: {
			uniDrawer
		},
		data() {
			return {
				employee: [],
				index: 0
			}
		},
		created() {
			console.log('组件 drawer created')
			this.getEmployeeData()
		},
		mounted() {

		},
		methods: {
			login() {

			},
			logout() {

			},
			open() {
				this.$refs.dra.open()
			},
			close() {
				this.$refs.dra.close()
			},
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
						// console.log(res.data.response)
						console.log('employee 设置完成')
					} else {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
					}
				}
			},
			change(e) {
				this.index = e.target.value
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
	.label{
		margin-top: 10rpx;
		margin-left: 10rpx;
		font-weight: bold;
	}
</style>
