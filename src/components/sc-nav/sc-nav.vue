<template>
	<view class="Container">
		<view class="fixed">
			<view class="state-bar" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="nav" :style="{ height: navBarHeight + 'px', width: windowWidth + 'px' }">
				<view class="navi-left">
					<view v-if="left" @tap="naviback">
						<text class="iconfont icon-back"></text>
						<text>{{ leftBtnText }}</text>
					</view>
				</view>
				<view class="navi-title">{{ title }}</view>
				<view class="navi-right">
					<view class="help" @tap="openHelp" v-if="help"><text class="iconfont icon-help"></text></view>
					<slot></slot>
				</view>
			</view>
		</view>
		<view class="fill-area" :style="{ height: statusBarHeight + navBarHeight + 'px' }"></view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default() {
				return 'ShanYing'
			}
		},
		left: {
			type: Boolean,
			default: false
		},
		help: {
			type: Boolean,
			default: true
		},
		leftBtnText: {
			type: String,
			default: '返回'
		}
	},
	data() {
		return {
			statusBarHeight: 20, //状态栏高度
			navBarHeight: 44, // 导航栏高度
			windowWidth: 375
		}
	},
	created() {
		const stateBar = uni.getSystemInfoSync()
		// console.log(stateBar)
		this.statusBarHeight = stateBar.statusBarHeight
		this.windowWidth = stateBar.windowWidth

		// #ifdef MP-WEIXIN
		const capsule = uni.getMenuButtonBoundingClientRect()
		this.navBarHeight = capsule.bottom - this.statusBarHeight + capsule.top - this.statusBarHeight
		this.windowWidth = capsule.left
		// #endif
	},
	methods: {
		// 返回上级路由
		naviback() {
			this.$emit('goBack')
		},
		// 打开帮助页面
		openHelp() {
			this.$emit('help')
		}
	}
}
</script>

<style lang="scss">
.Container {
	width: 100%;
	box-sizing: border-box;
	.fixed {
		background-color: #ff5500;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		box-sizing: border-box;
		z-index: 99;
		.nav {
			padding: 10rpx;
			width: 100%;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: white;
			.navi-left {
				min-width: 100rpx;
				view {
					display: flex;
					align-items: center;
				}
			}
			.navi-title {
				text-align: center;
				flex: 1;
			}
			.navi-right {
				min-width: 100rpx;
				display: flex;
				flex-wrap: nowrap;
				justify-content: flex-end;
				align-items: center;
			}
		}
	}
}
</style>
