<template>
	<view class="content column">
		<view class="head row">
			<image :src="avatar" class="avatar"></image>
			<view class="column name">
				<text>{{userName}}</text>
			</view>
		</view>
		<view class="body column">
			<view id="qrcode"></view>
		</view>
		<view class="footer">
			SY Technology Co., Ltd. Version: {{app_version}}
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import QRCode from 'qrcodejs2'

	export default {
		data() {
			return {
				avatar: '../../static/img/rb.png',
				userID: '员工工号',
				app_version: ''
			}
		},
		methods: {
			makeCode() {
				var qrcode = new QRCode('qrcode', {
					text: this.userName,
					width: 128,
					height: 128,
					colorDark: '#000000',
					colorLight: '#ffffff',
					correctLevel: QRCode.CorrectLevel.H
				})

			}
		},
		computed: {
			...mapState([
				'userName'
			])
		},
		mounted() {
			this.makeCode()
			this.app_version = process.env.VUE_APP_VERSION
			// console.log(process.env);
		}

	}
</script>

<style scoped lang="less">
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
			// padding: 10rpx;
			border-bottom: solid 1rpx #000000;

			.name {
				// border: solid 1rpx #0077AA;
				margin-left: 50rpx;
				width: 50%;
				text-align: center;
			}

			.avatar {
				border-radius: 20rpx;
				width: 128rpx;
				height: 128rpx;
				/* flex-grow: 1; */
			}
		}


		.body {
			height: 70vh;
			min-height: 700rpx;
			width: 100%;
			align-items: center;

			#qrcode {
				width: 128px;
				height: 128px;
				background-color: #fff; //设置白色背景色
				padding: 6px;
			}
		}
		.footer{
			width: 100%;
			height: 50rpx;
			border-top: solid 1rpx black;
			text-align: center;
		}
	}
</style>
