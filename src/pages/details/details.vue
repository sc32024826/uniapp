<template>
	<view id="container">
		<view>
			<uni-collapse>
				<uni-collapse-item title="站内衣架" :open="true" class="collapseitem">
					<view v-for="(v,i) in stationMsg.data" :key="i" class="flex row width">
						<view class="flex row line">
							<view>款: {{v.StyleNo}}</view>
							<view style="flex-shrink: 1;">色: {{v.ColorName}}</view>
							<view style="flex-shrink: 1;">码: {{v.SizeName}}</view>
						</view>
						<view class="flex row line">
							<view>单: {{v.MoNo}}</view>
							<view>号: {{v.RackCode}}</view>
							<view>{{v.Qty}}件</view>
						</view>

					</view>
				</uni-collapse-item>
				<uni-collapse-item title="已分配的方案">

				</uni-collapse-item>
			</uni-collapse>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'

	export default {
		components: {
			uniCollapse,
			uniCollapseItem
		},
		data() {
			return {
				data: {}
			}
		},
		methods: {

		},
		mounted() {
			console.log(this.stationMsg)
		},
		computed: {
			...mapState(['stationMsg'])
		}
	}
</script>

<style lang="less" scoped>
	.debug {
		border: solid 1rpx red;
	}

	#container {
		width: 100%;

		.line {
			width: 100%;
			height: 50rpx;

			view {
				// border-left: solid 2rpx white;
				// border-right: solid 2rpx white;
				padding: 4rpx;
				margin-top: 4rpx;
				margin-bottom: 4rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		// .width view {
		// 	// width: 240rpx;
		// 	text-align: center;
		// 	height: 50rpx;
		// 	text-overflow: ellipsis;
		// 	overflow: hidden;
		// 	white-space: nowrap;
		// }

		.width:nth-child(even) {
			background-color: #666666;
			color: white;
		}

		.width:nth-child(odd) {
			background-color: #55aaff;
			color: white;
		}

		.width {
			border: solid 1rpx black;
			margin: 2rpx;
		}
	}

	.flex {
		display: flex;
	}

	.row {
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
	}
</style>
