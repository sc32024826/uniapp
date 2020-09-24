<template>
	<div class="Container">
		<sc-nav :help="false"><view @click="reload">刷新</view></sc-nav>
		<view class="column primary hfull center white jc-c">
			<view v-if="show">当前平台:{{ platform }} 不支持本应用</view>
		</view>
	</div>
</template>
<script>
import * as dd from 'dingtalk-jsapi'
import { mapMutations } from 'vuex'

export default {
	data() {
		return {
			show: false,
			title: '',
			platform: ''
		}
	},
	methods: {
		reload() {
			location.reload()
		},
		async _requestAwait(data) {
			this.$api.GetLoginfoByCode(data).then(res => {
				if (res.data.success == true) {
					let user = res.data.response.Userid
					// // 成功之后 需要再vuex中 存储 用户名
					this.login(user)
					// 跳转到 功能选择界面
					uni.switchTab({
						url: '../main/main'
					})
				}
			})
		},
		...mapMutations(['login', 'setDeviceInfo']),
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
						corpId: 'ding04dfeb3807df4a9d35c2f4657eb6378f',
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
		let env = dd.env.platform
		this.platform = 'H5, ' + env
		this.refresh()
		// #endif

		// #ifdef MP-WEIXIN
		console.log('当前微信小程序,无法使用钉钉免登 因此暂时直接跳转到工作台')
		//微信小程序时  无法使用钉钉免登 因此暂时直接跳转到工作台 后续 需要读取微信用户数据
		uni.switchTab({
			url: '../main/main'
		})
		// #endif
	},
	created() {
		const info = uni.getSystemInfoSync()
		let para = {
			safeArea: {
				left: info.safeAreaInsets.left,
				right: info.safeAreaInsets.right,
				top: info.safeAreaInsets.top,
				bottom: info.safeAreaInsets.bottom
			},
			width: info.screenWidth,
			height: info.screenHeight
		}
		this.setDeviceInfo(para)
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
