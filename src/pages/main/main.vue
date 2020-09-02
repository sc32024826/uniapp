<template>
	<view class="container">
		<view class="logo">
		</view>
		<view class="row warp main">
			<block v-for="(item,i) in optionList">
				<view class="column box" @tap="jump(item.url)">
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
						icon: '&#xe60a;',
						title: '加工记录'
					},
					{
						url: '/pages/nfc/nfc',
						icon: '&#xe600;',
						title: 'NFC'
					},
					{
						url: '/pages/ProInfo/ProInfo',
						icon: '&#xe691;',
						title: '生产情况'
					},
					// {
					// 	url: '/pages/offline/offline',
					// 	icon: '&#xe6bb;',
					// 	title: '衣架下线'
					// },
					{
						url: '/pages/beforeOffline/beforeOffline',
						icon: '&#xe705;',
						title: '生产线'
					}
				]
			}
		},
		methods: {
			// 跳转页面
			jump(url) {
				uni.navigateTo({
					url: url
				})
			}
		},
		onShow() {
			let env = dd.env.platform
			if (env == 'notInDingTalk') return
			// 设置右侧多个按钮
			dd.biz.navigation.setMenu({
				backgroundColor: "#ADD8E6",
				textColor: "#ADD8E611",
				items: [{
						"id": "1", //字符串
						"iconId": "file", //字符串，图标命名
						"text": "帮助"
					},
					{
						"id": "2",
						"iconId": "photo",
						"text": "dierge"
					},
					{
						"id": "3",
						"iconId": "setting",
						"text": "disange",
					},
					{
						"id": "4",
						"iconId": "time",
						"text": "disige"
					}
				],
				onSuccess: function(data) {
					console.log(data)
				},
			})
			// 左侧导航按钮  仅支持ios  android 不支持
			dd.biz.navigation.setLeft({
				show: true,
				control: true,
				text: '关闭',
				onSuccess: function() {
					dd.biz.navigation.close()
				}
			})
		}
	}
</script>

<style lang="less" scoped>
	.test {
		font-family: 'iconfont';
		font-size: 150rpx;
		font-style: normal;
	}

	.row {
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

		.main {
			padding: 10rpx;
			height: 80vh;
		}
	}
</style>
