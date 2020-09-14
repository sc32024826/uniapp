<template>
	<view class="Container">
		<view class="name my">生产线数据</view>
		<view class="row primary white title">
			<view>生产线</view>
			<view>衣架数</view>
			<view>衣服数</view>
			<view>负载率</view>
		</view>
		<block v-for="(v,i) in lines" :key="i">
			<view class="row items">
				<view>生产线{{v.LineID}}</view>
				<view>{{v.NotFinishedRackQty}}</view>
				<view>{{v.ClothesQty}}</view>
				<view>{{Math.round(v.LoadRatio*100)}} % </view>
			</view>
		</block>
		<view class="row title primary white">
			<view>合计</view>
			<view>{{RackQty}}</view>
			<view>{{ClothesQty}}</view>
			<view></view>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			lines: {
				type: Array,
				required: true
			}
		},
		computed: {
			ClothesQty() {
				let qty = 0
				this.lines.map(e => {
					qty += e.ClothesQty
				})
				return qty
			},
			RackQty() {
				let qty = 0
				this.lines.map(e => {
					qty += Number(e.NotFinishedRackQty)
				})
				return qty
			}
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		margin: 10rpx;
		width: 100%;
		.name{
			// margin: 10rpx;
			padding: 10rpx;
			background-color: white;
			font-size: 1.2em;
			font-weight: 700;
		}
		.title {
			justify-content: space-around;
			padding: 10rpx;
			text-align: center;
			view{
				width: calc((100vw - 80rpx)/4);
			}

		}

		.items {
			justify-content: space-around;
			text-align: center;
			padding: 10rpx 0;

			view {
				width: calc((100vw - 80rpx)/4);
			}
		}
	}
</style>
