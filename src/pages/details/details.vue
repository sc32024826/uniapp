<template>
	<view id="container">
		<view>
			<uni-collapse>
				<uni-collapse-item title="站内衣架" :open="true" class="collapseitem">
					<uni-swipe-action>
						<view v-for="(v,i) in stationMsg.data" :key="i" class="width">
							<uni-swipe-action-item :right-options="options" @click="bindClick" @change="swipeChange($event, index)">
								<view class="flex row">
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
							</uni-swipe-action-item>
						</view>
					</uni-swipe-action>
				</uni-collapse-item>
				<uni-collapse-item title="已分配的方案" :open="true">
					<view v-for="(v,i) in data" :key="i" class="flex row solution" >
						<view class="mo">{{v.MoNo}}</view>
						<view class="style">{{v.StyleNo}}</view>
						<view class="color">{{v.ColorName}}</view>
						<view class="size">{{v.SizeName}}</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { uniCollapse, uniCollapseItem, uniSwipeAction, uniSwipeActionItem } from '@dcloudio/uni-ui'
	import { GetStationAssign } from '@/api/api.js'

	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			uniSwipeAction,
			uniSwipeActionItem
		},
		data() {
			return {
				data: [],
				options: [{
						'text': '操作1',
						'style': {
							"backgroundColor": "#007aff",
						}
					},
					{
						'text': '操作2',
						'style': {
							"backgroundColor": "#dd524d"
						}
					}
				]
			}
		},
		methods: {
			bindClick(e) {
				console.log('点击了' + (e.position === 'left' ? '左侧' : '右侧') + e.content.text + '按钮')
			},
			swipeChange(e, index) {
				console.log('当前状态：' + open + '，下标：' + index)
			}
		},
		async mounted() {
			let param = {
				StationGuid: this.stationMsg.id
			}
			console.log(param);
			var [err, res] = await GetStationAssign(param)
			if (err) {
				uni.showModal({
					content: err,
					showCancel: false
				})
			} else {
				this.data = res.data.response
			}
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
			// height: 50rpx;

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
		.solution{
			border: solid 1rpx black;
			.mo{
				width: 250rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.style{
				width: 150rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				text-align: center;
			}
			.color{
				width: 150rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				text-align: center;
			}
			.size{
				width: 80rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				text-align: right;
			}
		}
		.solution:nth-child(even) {
			background-color: #666666;
			color: white;
			
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
