<template>
	<div>
		<view>正在获取用户信息...</view>
	</div>
</template>
<script>
	import * as dd from "dingtalk-jsapi"
	import store from '../../store/index.js'

	export default {
		data() {
			return {}
		},
		methods: {
			async _requestAwait(data) {
				const [err, res] = await uni.request({
					url: "http://dingtalk.servers.mchains.cn/api/Login/GetLoginfoByCode",
					// url: "http://172.18.20.142/api/Login/GetLoginfoByCode",
					data: data,
					header: {
						"Content-Type": "application/json; charset=utf-8"
					}
				});
				if (err) {
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
					console.log(err)
				} else {
					console.log(res.data)
					let user = res.data.response.Userid
					// 成功之后 需要再vuex中 存储 用户名
					store.commit('login', {
						userName: user
					})
					// 跳转到 功能选择界面
					uni.switchTab({
						url: '../main/main'
					})
				}
			}

		},
		onShow: function() {
			let that = this
			dd.ready(function() {
				dd.runtime.permission.requestAuthCode({
					corpId: "ding04dfeb3807df4a9d35c2f4657eb6378f",
					onSuccess: function(result) {
						that.code = result.code
						that._requestAwait(result)
					},
					onFail: function(err) {}
				})
			})
		},
	}
</script>

<style>
</style>
