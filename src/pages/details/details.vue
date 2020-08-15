<template>
	<view id="container">
		<uni-collapse>
			<uni-collapse-item title="站内衣架" :open="true" class="collapseitem">
				<view v-if="nodata" class="infomsg">暂无数据</view>
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
				<template v-if="nodata2">
					<view class="infomsg">暂无数据</view>
				</template>
				<view v-for="(v,i) in data" :key="i" class="solution" @click="showModal(v)">
					<view class="no">{{i+1}}</view>
					<view class="mo">{{v.MoNo}}</view>
					<view class="style">{{v.StyleNo}}</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<view id="footer" class="flex row"> 
			<view>上一页</view>
			<view></view>
			<view>下一页</view>
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
				],
				nodata: true,
				pageCount: 1, //分页总数
				page: 1, //当前页
				dataCount: 15, //总条数
				PageSize: 20 //每页显示数量

			}
		},
		methods: {
			bindClick(e) {
				console.log('点击了' + (e.position === 'left' ? '左侧' : '右侧') + e.content.text + '按钮')
			},
			swipeChange(e, index) {
				console.log('当前状态：' + open + '，下标：' + index)
			},
			async getData() {
				let param = {
					StationGuid: this.stationMsg.id
				}
				var [err, res] = await GetStationAssign(param)
				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					let a = res.data.response
					this.pageCount = a.pageCount
					this.page = a.page
					this.dataCount = a.dataCount
					this.PageSize = a.PageSize
					this.data = a.data
				}
			},
			showModal(item) {
				let str = item.MoNo + '\n' + item.StyleNo + '\n' + item.ColorName + '\n' + item.SizeName
				uni.showModal({
					content: str,
					showCancel: false
				})
			}
		},
		mounted() {
			this.getData()
		},
		computed: {
			...mapState(['stationMsg']),
			nodata2() {
				return this.data.length > 0 ? false : true
			}
		}
	}
</script>

<style lang="less" scoped>
	.debug {
		border: solid 1rpx red;
	}

	#container {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		.infomsg {
			width: 100%;
			text-align: center;
			background-color: white;
			padding: 20rpx 0 20rpx 0;
		}

		.line {
			width: 100%;

			view {
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

		.solution {
			display: flex;
			flex-direction: row;
			justify-content: space-around;

			.no {
				min-width: 80rpx;
				text-align: center;
			}

			.mo {
				width: 300rpx;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.style {
				width: 200rpx;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		.solution:nth-child(even) {
			background-color: #666666;
			color: white;

		}
		#footer{
			border: solid 1rpx red;
			height: 80rpx;
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
