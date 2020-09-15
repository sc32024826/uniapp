<template>
	<div class="Container">
<!-- 		<uni-nav-bar fixed status-bar>
			<view class="full-width">{{title}}</view>
			<view slot="left" @tap="closeApp" class="icon-back">关闭</view>
		</uni-nav-bar> -->
		<view class="column primary hfull center white">
			<view v-if="show">当前平台不支持本应用</view>
		</view>
	</div>
</template>
<script>
	import * as dd from "dingtalk-jsapi"
	import { GetLoginfoByCode } from '@/api/api.js'
	import { mapMutations } from 'vuex'

	export default {
		data() {
			return {
				show: false,
				title: ''
			}
		},
		methods: {
			async _requestAwait(data) {
				const [err, res] = await GetLoginfoByCode(data)
				uni.hideLoading()
				if (err) {
					console.error(err);
					uni.showModal({
						content: 'dingtalk Servers:' + err.errMsg,
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
							content: 'dingtalk Servers - 钉钉内部应用免登 api :\n' + res.data.msg,
							showCancel: false
						});
					}

				}

			},
			...mapMutations(['login']),
			refresh() {
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
								uni.showModal({
									content: '钉钉免登失败,请重启应用.'
								})
							}
						})

					})

				}
			},
			closeApp() {
				// #ifdef H5
				let that = this
				let env = dd.env.platform
				if (env != 'notInDingTalk') {
					dd.biz.navigation.close()
				}
				// #endif

			}

		},
		onLoad(options) {
			console.log('get传参: ', options)
			this.title = this.$Route.meta.title
		},
		mounted() {
			// #ifdef H5
			console.log('当前h5平台')
			this.refresh()
			// #endif

			// #ifdef MP-WEIXIN
			this.H5 = false // 关闭自定义 导航栏
			console.log('当前微信小程序,无法使用钉钉免登 因此暂时直接跳转到工作台')
			//微信小程序时  无法使用钉钉免登 因此暂时直接跳转到工作台 后续 需要读取微信用户数据
			uni.switchTab({
				url: '../main/main'
			})
			// #endif
		}
	}
</script>

<style lang="less" scoped>
	.Container {
		width: 100%;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
</style>
