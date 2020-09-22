<template>
	<view class="Container">
		<view class="state-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="fill-area" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="outside">
			<scroll-view scroll-y>
				<view class="content column">
					<view class="head row">
						<image :src="avatar" class="avatar"></image>
						<view class="column name">
							<text>{{ userName }}</text>
						</view>
					</view>
					<view class="body column"><view id="qrcode"></view></view>
					<view class="footer">SY Technology Co., Ltd. Version: {{ app_version }}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
// #ifdef H5
import QRCode from 'qrcodejs2'
// #endif

export default {
	data() {
		return {
			avatar: '../../static/img/rb.png',
			userID: '员工工号',
			app_version: '',
			statusBarHeight: 20
		}
	},
	methods: {
		makeCode() {
			// #ifdef H5
			var qrcode = new QRCode('qrcode', {
				text: this.userName || 'this is empty',
				width: 128,
				height: 128,
				colorDark: '#000000',
				colorLight: '#ffffff',
				correctLevel: QRCode.CorrectLevel.H
			})
			// #endif
		}
	},
	computed: {
		...mapState(['userName'])
	},
	mounted() {
		// #ifdef H5
		this.makeCode()
		// #endif
		this.app_version = process.env.VUE_APP_VERSION
		const stateBar = uni.getSystemInfoSync()
		console.log(stateBar)
		this.statusBarHeight = stateBar.statusBarHeight
	}
}
</script>

<style scoped lang="less">
.Container {
	width: 100%;
	height: 100vh;
	.state-bar {
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		background-color: #ff5500;
	}
	.outside {
		height: 100%;
	}
}
.content {
	width: 100%;
	justify-content: center;
	align-items: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	justify-content: space-between;

	.head {
		height: 12vh;
		width: 100%;
		margin: 20rpx;
		border-bottom: solid 1rpx #c7c7c7;

		.name {
			margin-left: 50rpx;
			width: 50%;
			text-align: center;
		}

		.avatar {
			border-radius: 20rpx;
			width: 128rpx;
			height: 128rpx;
			margin-left: 40rpx;
		}
	}

	.body {
		height: calc(70vh - 44px);
		min-height: 700rpx;
		width: 100%;
		align-items: center;

		.qrcode {
			width: 128px;
			height: 128px;
			background-color: #fff; //设置白色背景色
			padding: 6px;
		}
	}

	.footer {
		position: fixed;
		width: 100%;
		height: 50rpx;
		border-top: solid 1rpx #c7c7c7;
		color: #c7c7c7;
		text-align: center;
		bottom: 0rpx;
	}
}
</style>
