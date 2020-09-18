<template>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<camera device-position="back" flash="off" mode="scanCode" @scancode="getCode" class="camera"></camera>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<text> H5 不支持扫码</text>
		<button type="primary" @tap="play">测试声音</button>
		<!-- #endif -->
	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.src = '/static/sound/scanCode.mp3'
	export default {
		data() {
			return {
				// canSacn: true// 是否可以扫码  防止一次性扫码很多次
			}
		},
		methods: {
			// 相机组件 识别二维码时触发
			getCode(e) {
				innerAudioContext.play()
				this.$emit('returnCode', e.detail.result)
			},
			play(){
				innerAudioContext.play()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.camera {
		height: 40vh;
	}
</style>
