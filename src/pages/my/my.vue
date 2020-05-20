<template>
	<view class="content">
		<view class="head flex row">
			<image :src="avatar" class="avatar"></image>
			<view class="flex column name">
				<text>{{username}}</text>
				<text>{{userID}}</text>
			</view>
		</view>
		<view class="body">
			<image :scr="QRCode" class="QRCode"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: '../../static/img/user.png',
				username: '员工姓名',
				userID: '员工工号',
				QRCode: ''
			}
		},
		methods: {

		}
	}
</script>

<style>
	.avatar {
		border-radius: 100%;
		width: 100px;
		height: 100px;
		background-color: #007AFF;
		/* flex-grow: 1; */
	}

	.flex {
		display: flex;
	}

	.row {
		flex-direction: row;
		/* justify-content: space-between; */
	}

	.column {
		flex-direction: column;
		justify-content: center;
	}

	.content {
		width: 100%;
	}

	.head {
		width: 90%;
		height: 100px;
		margin: 20px;
		padding-bottom: 30px;
		border: solid 1px #000000;
		border-bottom: solid 1px #000000;
	}

	.name {
		border: solid 1px #0077AA;
		margin-left: 50rpx;
		width: 50%;
		text-align: center;
	}
	.body{
		display: flex;
		justify-content: center;
	}
	.QRCode {
		width: 200px;
		height: 200px;
		background-color: #000000;
	}
</style>
