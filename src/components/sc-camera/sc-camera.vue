<template>
	<view class="content">
		<camera device-position="back" flash="off" mode="scanCode" @scancode="getCode" class="camera"></camera>
	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.src = 'http://s.aigei.com/pvaud_mp3/aud/mp3/1d/1d164fae59db4230a86c32ebb94a3ce6.mp3?download/%E5%BE%AE%E4%BF%A1%E4%BA%8C%E7%BB%B4%E7%A0%81%E6%89%AB%E6%8F%8F%E9%9F%B3%E6%95%88_%E7%88%B1%E7%BB%99%E7%BD%91_aigei_com.mp3&e=1599842340&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:hxfDDEjNgoZ03axbaB51Km-lrDs='
	export default {
		data() {
			return {
				canSacn: true// 是否可以扫码  防止一次性扫码很多次
			}
		},
		methods: {
			// 相机组件 识别二维码时触发
			getCode(e) {
				innerAudioContext.play()
				this.$emit('returnCode', e.detail.result)
			}
		},
		mounted() {
		}
	}
</script>

<style lang="scss" scoped>
	.camera {
		height: 40vh;
	}
</style>
