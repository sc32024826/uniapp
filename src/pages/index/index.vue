<template>
	<div id="Container">
		<view>等待用户数据返回...</view>
	</div>
</template>
<script>
	import * as dd from "dingtalk-jsapi"
	import store from '../../store/index.js'
	import { GetLoginfoByCode } from '@/api/api.js'
	import { mapMutations } from 'vuex'
	export default {
		data() {
			return {
				log: ''
			}
		},
		methods: {
			async _requestAwait(data) {
				const [err, res] = await GetLoginfoByCode(data)

				if (err) {
					console.log(err);
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
				} else {
					let user = res.data.response.Userid
					// // 成功之后 需要再vuex中 存储 用户名
					this.login(user)
					// 跳转到 功能选择界面
					uni.switchTab({
						url: '../main/main'
					})
				}
			},
			...mapMutations(['login'])

		},
		onShow: function() {
			let that = this
			dd.ready(function() {
				dd.runtime.permission.requestAuthCode({
					corpId: "ding04dfeb3807df4a9d35c2f4657eb6378f",
					onSuccess: function(result) {
						// that.code = result.code
						that._requestAwait(result)
					},
					onFail: function(err) {
						console.log(err)
						that.log = err
					}
				})
			})
		},
	}
</script>

<style lang="less" scoped>
	#Container {
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;

		view {
			// border: solid 1px red;
			text-align: center;
		}
	}
</style>
