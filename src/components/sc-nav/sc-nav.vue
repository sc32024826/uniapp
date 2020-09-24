<template>
	<view :class="{ Container: true, 'font-size': landscapse }">
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
		<view class="fill-area" :style="{ height: navBarHeight + 'px' }">{{ debugMsg }}</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
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
		},
		landscapse: {
			type: Boolean,
			default() {
				return false
			}
		}
	},
	data() {
		return {
			statusBarHeight: 20, //状态栏高度
			navBarHeight: 44, // 导航栏高度
			windowWidth: 375,
			marginLeft: 0,
			lanscape: false,
			fontSize: 30,
			debugMsg: ''
		}
	},
	created() {
		this.compute()
	},
	methods: {
		// 返回上级路由
		naviback() {
			this.$emit('goBack')
		},
		// 打开帮助页面
		openHelp() {
			this.$emit('help')
		},
		compute() {
			const info = uni.getSystemInfoSync()
			// 横屏模式
			if (this.landscapse) {
				// this.debugMsg = JSON.stringify({safeArea:info.safeAreaInsets,screen:{wid:info.screenWidth,hei:info.screenHeight}})
				if (info.platform === 'android') {
					// 安卓平台底部有43px的安全区
					this.windowWidth = this.device.height - 43
					console.log(this.windowWidth);
				}else{
					this.windowWidth = this.device.height - this.device.safeArea.top - this.device.safeArea.bottom
				}
				// 高度 = 屏幕宽度
				this.statusBarHeight = 0
			} else {
				this.statusBarHeight = info.statusBarHeight
				this.windowWidth = info.windowWidth

				// #ifdef MP-WEIXIN
				const capsule = uni.getMenuButtonBoundingClientRect()
				this.navBarHeight = capsule.bottom - this.statusBarHeight + capsule.top - this.statusBarHeight
				this.windowWidth = capsule.left
				// #endif
			}
		}
	},
	computed: {
		...mapState(['device'])
	}
}
</script>

<style lang="scss">
.font-size {
	font-size: 14px;
}
.Container {
	width: 100%;
	.fixed {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 99;
		padding-left: env(safe-area-inset-left);
		padding-right: env(safe-area-inset-right);
		box-sizing: border-box;
		background-color: #ff5500;
		.nav {
			// background-color: #ff5500;
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
