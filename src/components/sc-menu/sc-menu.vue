<template>
	<view class="container">
		<view class="row wrap">
			<block v-for="item in options" :key="item.id">
				<view class="options" @tap="naviTo(item.url)">
					<!-- #ifdef H5 -->
					<text v-html="item.icon" class="icon"></text>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<i v-html="item.icon" class="icon"/>
					<!-- #endif -->
					<view>{{item.name}}</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			options: {
				type: Array,
				required: true,
			}
		},
		data() {
			return {}
		},
		methods: {
			// 页面跳转
			naviTo(url) {
				// console.log(url)
				// 测试中发现 使用navigateTo 时 轮播组件仍然在自动播放 因此改为 redirectTo
				uni.redirectTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	$wd-4: calc((100vw - 48rpx)/4);
	.container {
		width: 100vw;
		box-sizing: border-box;
		.options {
			box-sizing: border-box;
			background-color: #47c8ff;
			width: $wd-4;
			justify-content: space-around;
			text-align: center;
			color: white;
			margin: 6rpx;
			border-radius: 10rpx;
			padding: 10rpx 0;

			.icon {
				font-size: 100rpx;
			}
		}
	}
</style>
