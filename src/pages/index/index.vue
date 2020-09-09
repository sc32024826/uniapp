<template>
	<div class="Container">
		<uni-nav-bar fixed status-bar>
			<view class="center">登录中...</view>
			<view slot="left" @click="close" class="icon-back">关闭</view>
			<view slot="right" @tap="refresh">刷新</view>
		</uni-nav-bar>
		<view class="column primary hfull">
			<text v-if="show">当前平台不支持本应用</text>
		</view>
	</div>
</template>
<script>
import * as dd from "dingtalk-jsapi"
import { GetLoginfoByCode } from '@/api/api.js'
import { mapMutations } from 'vuex'
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"

export default {
	components: {
		uniNavBar
	},
	data () {
		return {
			show: false
		}
	},
	methods: {
		async _requestAwait (data) {
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
		refresh () {
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

				dd.ready(function () {
					dd.runtime.permission.requestAuthCode({
						corpId: "ding04dfeb3807df4a9d35c2f4657eb6378f",
						onSuccess: function (result) {
							that._requestAwait(result)
						},
						onFail: function (err) {
							uni.showModal({
								content: '钉钉免登失败,请重启应用.'
							})
						}
					})

				})

			}
        },
        close(){
            let that = this
			let env = dd.env.platform
			if (env != 'notInDingTalk') {
				dd.biz.navigation.close()
			}
        }

	},
	onLoad (options) {
		console.log(options)
	},
	mounted () {
        this.refresh()
	}
}
</script>

<style lang="less" scoped>
.Container {
	width: 100%;
	justify-content: center;
	align-items: center;

	view {
		text-align: center;
	}
}
</style>
