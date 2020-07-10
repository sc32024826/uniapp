<template>
	<view class="flex column">
		<view>请靠近您的ID卡</view>
		<view>{{state}}</view>
		<view>{{log}}</view>
	</view>
</template>

<script>
	import * as dd from "dingtalk-jsapi"
	export default {
		data() {
			return {
				state: '',
				log: ''
			}
		},
		methods: {
		},
		onShow() {
			let _this = this
			_this.log = 'ready'
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
						_this.log = err.tagId  // 4e:26:cc:1f
						// 先将16位数据 以:为间隔存入数组
						let arr = err.tagId.split(':')
						// 逆序 并 数组转字符串 并 删除 ','
						let str = arr.reverse().toString().replace(/,/g,'')
						_this.state = str
						uni.showModal({
							content: str
						})
						
					}
				})
			})
		}
	}
</script>

<style>
	.flex{
		display: flex;
		width: 100%;
		text-align: center;
	}
	.column{
		flex-direction: column;
		justify-content: center;
	}
</style>
