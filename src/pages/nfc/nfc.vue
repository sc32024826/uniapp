<template>
	<view class="container full-width">
		<!-- #ifdef H5 -->
		<uni-nav-bar fixed status-bar>
			<view class="center">NFC</view>
			<view slot="left" @click="goback" class="icon-back">返回</view>
			<view slot="right"><text @tap="showHelp" class="marginR">&#xe677;</text></view>
		</uni-nav-bar>
		<!-- #endif -->
		<view class="flex column full-height">
			<view>请靠近您的ID卡</view>
			<view>{{state}}</view>
			<view>{{log}}</view>
		</view>
	</view>

</template>

<script>
	import * as dd from "dingtalk-jsapi"
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				state: '',
				log: ''
			}
		},
		methods: {
			goback() {
				uni.navigateBack({})
			},
			showHelp() {
				console.log('帮助')
			},
			//  使用钉钉NFC 功能
			NFCByDD() {
				console.log('开启钉钉NFC')
				let _this = this
				_this.log = 'ready'
				let env = dd.env.platform
				if (env != 'notInDingTalk') {
					dd.ready(function() {
						dd.device.nfc.nfcRead({
							onSuccess: function(data) {
								_this.state = 'success'
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
								let str = arr.reverse().toString().replace(/,/g, '')
								_this.state = str
								uni.showModal({
									content: str
								})

							}
						})
					})
				}else{
					uni.showModal({
						content: '请在钉钉内部打开应用',
						showCancel: false
					})
				}
			},
			// 微信小程序端的nfc 功能
			NFCByWX() {
				console.log('开启微信NFC')
				wx.startHCE({
					aid_list: ['F222222222'],
					success(res) {
						console.log(res.errMsg)
					}
				})
			}
		},
		onShow() {
			// #ifdef H5
			this.NFCByDD()
			// #endif

			// #ifdef MP-WEIXIN
			this.NFCByWX()
			// #endif
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
