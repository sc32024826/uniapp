<template>
	<view class="Container">
		<sc-nav left title="生产单" @goBack="goback"></sc-nav>
		<view class="list">
			<view class="info">共{{ sourceData.length }}条记录</view>
			<scroll-view class="scroll" scroll-y>
				<block v-for="(item, index) in 10" :key="index">
					<view class="items white">
						<view class="row jc-b my line">
							<view>生产单</view>
							<view>款号</view>
						</view>
						<view class="row jc-b my line">
							<view>客户</view>
							<view>针种</view>
						</view>
						<view class="row jc-b my line">
							<view>交期</view>
							<view>完工工序</view>
						</view>
						<view class="row jc-b my line">
							<view>数量</view>
							<view>备注</view>
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sourceData: []
		}
	},
	methods: {
		// 返回tabbar
		goback() {
			uni.switchTab({
				url: '/pages/main/main'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.Container {
	width: 100%;
	box-sizing: border-box;
	.list {
		width: 100%;
		height: calc(100vh - 44px);
		background-color: white;
		box-sizing: border-box;
		.info {
			box-sizing: border-box;
			padding: 20rpx;
			background-color: #47c8ff;
			height: 100rpx;
		}
		.scroll {
			overflow: hidden;
			height: 100%;
			box-sizing: border-box;
			.items {
				margin: 10rpx;
				box-sizing: border-box;
				height: 250rpx;
				background-color: #ffffff;
				padding: 20rpx;
				box-shadow: 0 0 1px 1px #999;
				.line {
					view {
						width: 50%;
						color: black;
						min-width: 200rpx;
					}
				}
			}
		}
	}
}
</style>
