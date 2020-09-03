<template>
	<view class="container">
		<uni-nav-bar fixed status-bar>
			<view class="center">工作台</view>
			<view slot="left" @click="close" class="icon-back">关闭</view>
			<view slot="right">帮助</view>
		</uni-nav-bar>
		<view class="logo">
		</view>
		<view class="row warp main">
			<block v-for="(item,i) in optionList">
				<view class="column box" @click="jump(item.url)">
					<text class="test" v-html="item.icon"></text>
					<text class="title">{{item.title}}</text>
				</view>

			</block>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import * as dd from "dingtalk-jsapi"

	export default {
		components: {
			uniNavBar
		},
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
			},
			showhelp() {
				console.log('帮助')
			},
			close() {
				let env = dd.env.platform
				if (env != 'notInDingTalk') {
					dd.biz.navigation.close()
				}else{
					console.log('关闭页面')
				}
			}
		},
		computed: mapState(['hasLogin', 'userName']),
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
