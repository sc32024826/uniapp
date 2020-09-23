<template>
	<view class="Container">
		<!-- 顶部安全区 -->
		<view class="safe-area-top" :style="{ height: safeAreaTopH + 'px' }">顶部安全区</view>
		<!-- 导航栏 -->
		<view class="nav" :style="{ height: navBarHeight + 'px', width: windowWidth + 'px' }">导航栏</view>
		<!-- 页面主体 -->
		<view class="body" :style="{ height: bodyH + 'px' }">主体</view>
		<!-- 底部安全区 -->
		<view class="safe-area-bottom" :style="{ height: safeAreaBottomH + 'px' }">底部安全区</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			safeAreaTopH: 44,
			navBarHeight: 44,
			windowWidth: 375,
			bodyH: 768,
			safeAreaBottomH: 0
		}
	},
	methods: {},
	created() {
		const info = uni.getSystemInfoSync()
		console.log(info)
		this.safeAreaTopH = info.safeAreaInsets.top //顶部安全区域高度
		this.safeAreaBottomH = info.safeAreaInsets.bottom
		// #ifdef MP-WEIXIN
		const capsule = uni.getMenuButtonBoundingClientRect()
		this.navBarHeight = capsule.bottom - this.safeAreaTopH + capsule.top - this.safeAreaTopH
		this.windowWidth = capsule.left
		// #endif
		//主体高度 = 屏幕高度 - 安全区高度(顶部+底部) - 导航栏高度
		this.bodyH = info.screenHeight - info.safeAreaInsets.top - info.safeAreaInsets.bottom - this.navBarHeight
	}
}
</script>

<style scoped>
.Container {
	width: 100%;
	position: fixed;
	top: 0;
	color: white;
	text-align: center;
	display: flex;
	flex-direction: column;
}
.safe-area-top {
	width: 100%;
	background-color: red;
	text-align: left;
}
.nav {
	width: 100%;
	background-color: #007aff;
}
.body {
	width: 100%;
	background-color: white;
	color: #000000;
}
.safe-area-bottom{
	width: 100%;
	background-color: #000000;
}
</style>
