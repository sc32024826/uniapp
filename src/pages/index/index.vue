<template>
	<div id="Container" class="column">
		<text v-if="show">当前平台不支持本应用</text>
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
				show: false
			}
		},
		methods: {
			async _requestAwait(data) {
				const [err, res] = await GetLoginfoByCode(data)
				uni.hideLoading()
				if (err) {
					console.error(err);
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
				} else {
					if (res.data.success == true) {
						let user = res.data.response.Userid
						// // 成功之后 需要再vuex中 存储 用户名
						this.login(user)
						// 跳转到 功能选择界面
						uni.switchTab({
							url: '../main/main'
						})
					} else {
						// console.log(res);
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						});
					}

				}

			},
			...mapMutations(['login'])

		},
		created() {
			let that = this
			let env = dd.env.platform
			if (env == 'notInDingTalk') {
				uni.showModal({
					content: '需要在钉钉中打开!',
					showCancel: false
				})
				this.show = true
			} else {
				uni.showLoading({
					title: '正在请求数据!'
				})
				dd.ready(function() {
					dd.runtime.permission.requestAuthCode({
						corpId: "ding04dfeb3807df4a9d35c2f4657eb6378f",
						onSuccess: function(result) {
							that._requestAwait(result)
						},
						onFail: function(err) {
							console.error(err)
						}
					})
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	#Container {
		width: 100%;
		justify-content: center;
		align-items: center;

		view {
			text-align: center;
		}
	}
</style>
