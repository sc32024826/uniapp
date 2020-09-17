<template>
	<view class="container full-width">
		<sc-nav left title="NFC" @goBack="goback" @help="help"></sc-nav>
		<view class="flex column full-height">
			<view v-if="state">请靠近您的ID卡</view>
			<view>{{ log }}</view>
			<view>{{ info }}</view>
		</view>
	</view>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
export default {
	data() {
		return {
			state: false,
			log: ''
		}
	},
	methods: {
		goback() {
			uni.switchTab({
				url: '/pages/main/main'
			})
		},
		help() {
			console.log('帮助')
		},
		//  NFC 功能
		openNFC() {
			// #ifdef H5
			let _this = this
			// _this.log = 'ready'
			let env = dd.env.platform
			if (env != 'notInDingTalk') {
				dd.ready(function() {
					dd.device.nfc.nfcRead({
						onSuccess: function(data) {
							_this.state = true
							_this.info = '读取成功'
							_this.log = data
							uni.showModal({
								content: JSON.stringify(data)
							})
						},
						onFail: function(err) {
							_this.log = err.tagId // 4e:26:cc:1f
							// 先将16位数据 以:为间隔存入数组
							let arr = err.tagId.split(':')
							// 逆序 并 数组转字符串 并 删除 ','
							let str = arr
								.reverse()
								.toString()
								.replace(/,/g, '')
							_this.info = str
							uni.showModal({
								content: str
							})
						}
					})
				})
			} else {
				uni.showModal({
					content: '本功能需要调用钉钉API,因此需要在钉钉内打开',
					showCancel: false
				})
				this.info = '不支持'
			}
			// #endif
			// #ifdef MP-WEIXIN
			uni.showModal({
				content: '微信小程序暂不支持NFC功能.',
				showCancel: false
			})
			// #endif
		}
	},
	onShow() {
		console.log('开始读取NFC')
		this.openNFC()
	}
}
</script>

<style scoped>
.full-height {
	height: 70%;
	justify-content: center;
	text-align: center;
}
</style>
