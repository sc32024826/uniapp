<template>
	<view class="Container">
		<sc-nav left title="生产单" @goBack="goback"></sc-nav>
		<view class="list">
			<view class="info">
				共{{sourceData.length}}条记录
			</view>
			<scroll-view class="scroll" scroll-y>
				<block v-for="(item,index) in 10" :key="index">
					<view class="items white">
						<view class="row jc-b my">
							<view>生产单</view>
							<view>款号</view>
							<view>客户</view>
						</view>
						<view class="row jc-b my">
							<view>针种</view>
							<view>数量</view>
							<view>交期</view>
						</view>
						<view class="row jc-b my">
							<view>完工工序</view>
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
			sourceData:[]
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
		.info{
			box-sizing: border-box;
			padding: 20rpx;
			background-color: #47c8ff;
			height: 100rpx;
			color: white;
		}
		.scroll {
			overflow: hidden;
			height: 100%;
			box-sizing: border-box;
			.items{
				margin: 10rpx;
				box-sizing: border-box;
				height: 200rpx;
				background-color: #c7c7c7;
				padding: 20rpx;
				// box-shadow: ;
			}
		}
	}
}
</style>
