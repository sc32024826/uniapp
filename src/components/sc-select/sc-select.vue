<template>
	<view>
		<!-- <view :style="{height:statusBarHeight + navBarHeight + 'px'}"></view> -->
		
	</view>
</template>

<script>
export default {
	props: {},
	data() {
		return {
			value: [0],
			style: '',
			custom: '',
			status: null,
			statusBarHeight: 20,
			windowWidth: 375,
			navBarHeight: 44,
			indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth / (750 / 100))}px;`
		}
	},
	methods: {
		open() {
			this.$refs.drawer.open()
		},
		close() {
			this.$refs.drawer.close()
		},
		// 重新检索数据
		reSearch() {},
		// 取消返回
		cancel() {
			this.close()
		}
	},
	created() {
		const stateBar = uni.getSystemInfoSync()
		this.statusBarHeight = stateBar.statusBarHeight
		this.windowWidth = stateBar.windowWidth
		// #ifdef MP-WEIXIN
		const capsule = uni.getMenuButtonBoundingClientRect()
		this.navBarHeight = capsule.bottom - this.statusBarHeight + capsule.top - this.statusBarHeight
		this.windowWidth = capsule.left
		// #endif
	}
}
</script>

<style lang="scss">
.drawer-content {
	background-color: #c2c2c2;
	box-sizing: border-box;
	padding: 20rpx;
	view {
		padding: 20rpx;
		input {
			background-color: #ffffff;
			text-align: center;
		}
	}
}
.bottom-fixed {
	box-sizing: border-box;
	padding: 0 20rpx;
	width: 100%;
	position: fixed;
	bottom: 30rpx;
	button {
		width: 100%;
		margin: 10rpx;
	}
}
</style>
