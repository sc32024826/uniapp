<template>
	<view :class="{ Container: true, 'font-size': landscapse }">
		<view class="fixed">
			<view class="state-bar" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="nav" :style="{ height: navBarHeight + 'px'}">
				<!-- , width: windowWidth + 'px' -->
				<view class="navi-left column">
					<view v-if="left" @click="naviback">
						<text class="iconfont icon-back"></text>
						<text>{{ leftBtnText }}</text>
					</view>
				</view>
				<view class="navi-title">{{ title  }}</view>
				<view class="navi-right row">
					<view class="help column" @click="openHelp" v-if="help"><text class="iconfont icon-help"></text></view>
					<slot></slot>
				</view>
			</view>
		</view>
		<view class="fill-area" :style="{ height: navBarHeight + 'px' }"></view>
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
			statusBarHeight: 44, //状态栏高度
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
		// console.log(this.statusBarHeight);
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
			// 横屏模式
			if (this.landscapse) {
				// 读取本地存储数据中的高度 即横屏模式下的宽度
				let deviceInfo = uni.getStorageSync('deviceInfo')
				console.log(deviceInfo)
				if (deviceInfo.platform === 'android') {
					this.windowWidth = deviceInfo.height - 43
				} else {
					this.windowWidth = deviceInfo.height - deviceInfo.safeArea.top - deviceInfo.safeArea.bottom
				}
				console.log('横屏,导航栏宽度: ', deviceInfo.height - 43)
				// 高度 = 屏幕宽度
				this.statusBarHeight = 0
			} else {
				setTimeout(()=>{
					const info = uni.getSystemInfoSync()
					this.statusBarHeight = info.statusBarHeight
					this.windowWidth = info.windowWidth
					
					// #ifdef MP-WEIXIN
					const capsule = uni.getMenuButtonBoundingClientRect()
					this.navBarHeight = capsule.bottom - this.statusBarHeight + capsule.top - this.statusBarHeight
					this.windowWidth = capsule.left
					// #endif
				},100)
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
			width: 100%;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: white;
			.navi-left {
				padding: 2rpx;
				border-radius: 10rpx;
				min-width: 100rpx;
				height: 100%;
				view {
					display: flex;
					align-items: center;
					justify-content: center;
					flex-grow: 1;
				}
			}
			.navi-title {
				text-align: center;
				flex: 1;
			}
			.navi-right {
				height: 100%;
				min-width: 100rpx;
				display: flex;
				flex-wrap: nowrap;
				justify-content: center;
				align-items: center;
				.help {
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}
}
</style>
