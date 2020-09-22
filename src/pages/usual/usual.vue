<template>
	<view class="container">
		<!-- #ifdef H5 -->
		<sc-nav left leftBtnText="关闭" title="常用功能" @goBack="close"></sc-nav>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<sc-nav></sc-nav>
		<!-- #endif -->
		<view class="outside">
			<scroll-view scroll-y>
				<!-- <view v-for="item in 100">{{item}}</view> -->
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import * as dd from 'dingtalk-jsapi'
	export default {
		data() {
			return {
			}
		},
		methods: {
			showHelp() {
				console.log('帮助')
			},
			// 关闭页面
			close() {
				// #ifdef H5
				let env = dd.env.platform
				if (env != 'notInDingTalk') {
					dd.biz.navigation.close()
				} else {
					console.log('关闭页面')
				}
				// #endif
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;
		justify-content: center;
		align-items: center;
		text-align: center;
		.outside{
			height: 100%;
		}
	}
</style>
