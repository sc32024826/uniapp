<template>
	<view class="content">
		<view class="head flex row">
			<image :src="avatar" class="avatar"></image>
			<view class="flex column name">
				<text>{{userName}}</text>
				<!-- <text>{{userID}}</text> -->
			</view>
		</view>
		<view class="body">
			<view id="qrcode"></view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import QRCode from 'qrcodejs2'

	export default {
		data() {
			return {
				avatar: '../../static/img/1.jpg',
				userID: '员工工号'
			}
		},
		methods: {
			makeCode() {
				var qrcode = new QRCode('qrcode', {
					text: 'xxxx',
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
		}

	}
</script>

<style scoped lang="less">
	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-items: center;

		.head {
			width: 90%;
			margin: 20rpx;
			padding: 10rpx;
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
			display: flex;
			justify-content: center;

			#qrcode {
				width: 128px;
				height: 128px;
				background-color: #fff; //设置白色背景色
				padding: 6px; 
			}
		}
	}
	.flex{
		display: flex;
	}
	.column{
		flex-direction: column;
	}
</style>
