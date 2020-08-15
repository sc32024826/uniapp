<template>
	<view class="container">
		<view class="logo">
		</view>
		<view class="flex row warp">
			<block v-for="(item,i) in optionList">
				<view class="flex column box" @tap="jump(item.url)">
					<text class="test" v-html="item.icon"></text>
					<text class="title">{{item.title}}</text>
				</view>

			</block>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import * as dd from "dingtalk-jsapi"

	export default {
		computed: mapState(['hasLogin', 'userName']),
		data() {
			return {
				optionList: [{
						url: '/pages/ProcessRecord/ProcessRecord',
						icon: '&#xe75f;',
						title: '加工记录'
					},
					{
						url: '/pages/nfc/nfc',
						icon: '&#xe756;',
						title: 'NFC'
					},
					{
						url: '/pages/ProInfo/ProInfo',
						icon: '&#xe6db;',
						title: '生产情况'
					},
					// {
					// 	url: '/pages/offline/offline',
					// 	icon: '&#xe6bb;',
					// 	title: '衣架下线'
					// },
					{
						url: '/pages/beforeOffline/beforeOffline',
						icon: '&#xe71f;',
						title: '生产线'
					}
				]
			}
		},
		methods: {
			// 跳转页面
			jump(url) {
				console.log('页面跳转')
				console.log(url)
				uni.navigateTo({
					url: url
				})
			}
		},
		onShow() {
			dd.biz.navigation.setRight({
				show: false,
				control: true,
				text: '',
				onSuccess: function() {

				}
			})
			dd.biz.navigation.setLeft({
				show: false,
				control: true,
				text: '',
				onSuccess: function() {
			
				}
			})
		}
	}
</script>

<style lang="less" scoped>
	@font-face {
		font-family: 'iconfont';
		/* project id 1825614 */
		src: url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.eot');
		src: url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.eot?#iefix') format('embedded-opentype'),
			url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.woff2') format('woff2'),
			url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.woff') format('woff'),
			url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.ttf') format('truetype'),
			url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.svg#iconfont') format('svg');
	}

	.test {
		font-family: 'iconfont';
		font-size: 150rpx;
		font-style: normal;
	}

	.flex {
		display: flex;
		flex-wrap: wrap;
	}

	.column {
		flex-direction: column;
	}

	.row {
		flex-direction: row;
		justify-content: space-between;
	}

	.wrap {
		flex-wrap: wrap;
	}

	.title {
		text-align: center;
	}

	.box {
		margin-top: 4rpx;
		margin-right: 4rpx;
		align-items: center;
	}



	.container {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		.logo {
			// width: 100%;
			height: 250rpx;
			background-image: url("@/static/img/Title.jpg");
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center;
			margin: 10rpx;

		}
	}
</style>
