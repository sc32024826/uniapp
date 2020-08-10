<template>
	<view class="container">
		<view class="ToolBar" v-show="showSelect">
			<button @click="close">关闭复选</button>
		</view>
		<uni-collapse>
			<!-- 			<view class="info" v-for="(it,i) in LineStatus" :key="i">
				<text>LineGuid:{{it.LineGuid}}</text>
				<text>数量:{{it.ClothesQty}}</text>
				<text>使用率:{{it.LoadRatio}}</text>
				<text>未完成衣架数:{{it.NotFinishedRackQty}}</text>

			</view> -->
			<uni-collapse-item :title="item.LineID + '号线'" :open="showDown(item)" v-for="(item,i) in data" :key="i" class="collapseitem">
				<view class="lineInfo">
					<view>总数:{{item.ClothesQty}}</view>
					<view>未完成衣架数:{{item.NotFinishedRackQty}}</view>
					<view>使用率:{{item.LoadRatio}}%</view>
					<view>状态:{{item.Status==1?'停止':item.Status==2?'运行':'演示'}}</view>
				</view>
				<view class="flex row wrap item">
					<view class="box" v-for="(v,k) in item.list" :key="k" @longpress="longpressfn" v-if="item.list">
						<checkbox class="checkbox" v-show="showSelect"></checkbox>
						<view @click="clickBox">
							<view class="flex row">
								<view :class="getstyle(v.Enable,v.EnableIn)"></view>
								<view>{{v.LineID}}-{{v.StationID}}</view>
								<view>{{v.SeqName}}</view>
							</view>
							<view class="flex row">
								<view>{{v.EmpID}}-{{v.Name}}</view>
								<view>{{v.RackCnt}}*{{v.RackCap}}</view>
							</view>
						</view>
					</view>
					<view v-if="!item.list">暂无数据</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'
	import { GetStationStatus, GetLineStatus } from '@/api/api.js'
	import groupBy from './classify.js'

	export default {
		components: { uniCollapse, uniCollapseItem },
		data() {
			return {
				data: [],
				showSelect: false,
				LineStatus: []
			}
		},
		methods: {
			// 
			getstyle(a, b) {
				if (a * b == false) {
					return 'base stop'
				} else {
					return 'base light'
				}
			},
			// 长按 出现复选框
			longpressfn() {
				this.showSelect = true
			},
			clickBox() {
				uni.showModal({
					content: '点击了这里',
					showCancel: false
				})
			},
			close() {
				this.showSelect = false
			},
			// 根据对象 返回 标题名
			// getTitle(o){
			// 	let line = o.LineID + '号线 '
			// 	let Qty = o.ClothesQty + '件 '
			// 	let NF = o.NotFinishedRackQty
			// }
			// 根据 item 的长度 返回是否打开 下拉展开
			showDown(item) {
				if (item.list) {
					return item.list.length > 0 ? true : false
				} else {
					return false
				}
			}
		},
		async mounted() {
			var part_1 = [],
				part_2 = []
			let para = ''
			const [err, res] = await GetStationStatus(para)
			if (err) {
				uni.showModal({
					content: err,
					showCancel: false
				})
			} else {
				if (res.data.success == true) {
					let data = res.data.response
					part_1 = groupBy(data, 'LineID')
				}
			}
			let param = ''
			const [error, result] = await GetLineStatus(param)
			if (error) {
				uni.showModal({
					content: error,
					showCancel: false
				})
			} else {
				part_2 = result.data
			}
			part_2.map(m => {
				part_1.forEach(e => {
					if (m.LineID == e.name) {
						m = Object.assign(m, { list: e.list })
					}
				})
			})
			this.data = part_2
			console.log(part_2)
		}
	}
</script>

<style lang="less" scopde>
	//调试 规则
	.debug {
		border: solid 1rpx red;
	}

	// 正式规则
	.container {
		width: 100%;
		text-align: center;
		text-align: left;

		.ToolBar {}

		.checkbox {
			// position: relative;
			// margin-bottom: -100rpx;
			float: right;
			margin-left: -50%;
			// right: 20rpx;
			// top: 20rpx;
			z-index: 10;
		}

		.lineInfo {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			background-color: yellow;
			view {
				// border: solid 1rpx red;
				min-width: 300rpx;
				text-align: center;
			}
		}

	}

	.box {
		width: 48%;
		border: solid 2rpx #DCDEE2;
		height: 200rpx;
		margin-bottom: 20rpx;
		background-color: white;
	}

	.flex {
		display: flex;
	}

	.row {
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin: 10rpx 0rpx 10rpx 0rpx;
	}

	.wrap {
		flex-wrap: wrap;
	}

	.base {
		width: 50rpx;
		height: 50rpx;
		border: solid 1rpx green;
		margin-top: 10rpx;
	}

	.light {
		background: green;
	}

	.stop {
		background: red;
	}

	.collapseitem {
		.item {
			padding: 10rpx 0rpx 10rpx 0rpx;
		}
	}

	.collapseitem:nth-child(even) {
		.item {
			background-color: #666699;
			color: white;
		}
	}

	.collapseitem:nth-child(odd) {
		.item {
			background-color: #CCCCCC;

		}
	}
</style>
