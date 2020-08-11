<template>
	<view class="container">
		<uni-collapse>
			<view class="lineInfo" v-for="(item,i) in data" :key="i">
				<view class="flex row DateBar">
					<view class="flex row wrap infomation">
						<view>总数:{{item.ClothesQty}}</view>
						<view>衣架数:{{item.NotFinishedRackQty}}</view>
						<view>负载率:{{item.LoadRatio}}</view>
						<view>运行状态:{{item.Status==1?'停止':item.Status==2?'运行':'演示'}}</view>
					</view>
					<button type="primary" id="runStop" @click="lineOption(item.Status,item.LineGuid)">{{item.Status==1?'运行':'停止'}}</button>
				</view>
				<uni-collapse-item :title="item.LineID + '号线'" class="collapseitem">
					<view class="flex row wrap item">
						<view class="box" v-for="(v,k) in item.list" :key="k" @longpress="longpressfn" v-if="item.list">
							<checkbox class="checkbox" v-show="showSelect"></checkbox>
							<view @click="clickBox(v.StationGuid)">
								<view class="flex row">
									<view :class="getstyle(v.Enable,v.EnableIn)"></view>
									<view>{{v.LineID}}-{{v.StationID}}</view>
									<view>{{v.SeqName}}</view>
								</view>
								<view class="flex row">
									<view>{{v.EmpID}}-{{v.Name}}</view>
									<view>{{v.RackCnt}}/{{v.RackCap}}</view>
								</view>
							</view>
						</view>
						<view v-if="!item.list">暂无数据</view>
					</view>
				</uni-collapse-item>
			</view>

		</uni-collapse>
	</view>
</template>

<script>
	import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'
	import { GetStationStatus, GetLineStatus, QueryInStationRackInfByStationGuid, SetLinePause } from '@/api/api.js'
	import groupBy from './classify.js'
	import { mapMutations } from 'vuex'
	import * as dd from "dingtalk-jsapi"

	export default {
		components: { uniCollapse, uniCollapseItem },
		data() {
			return {
				data: []
			}
		},
		methods: {
			...mapMutations(['setStationMsg']),
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
			async clickBox(id) {
				uni.showLoading({
					title: '正在查询,请稍后!'
				})
				let para = {
					StationGuid: id
				}
				const [err, res] = await QueryInStationRackInfByStationGuid(para)
				uni.hideLoading()
				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					if (res.data.success == true) {
						this.setStationMsg({
							id: id,
							data: res.data.response
						})
						uni.navigateTo({
							url: '/pages/details/details'
						})
					} else {
						uni.showModal({
							content: '错误',
							showCancel: false
						})
					}
				}
			},
			close() {
				this.showSelect = false
			},
			// 根据 item 的长度 返回是否打开 下拉展开
			showDown(item) {
				if (item.list) {
					return item.list.length > 0 ? true : false
				} else {
					return false
				}
			},
			// 启停生产线
			lineOption(state, LineGuid) {
				var option = false
				// 当前停止状态
				if (state != 1) {
					option = true
				}
				var param = {
					'LineGuid': LineGuid,
					'isToPause': option,
					'onlyOnce': true
				}
				var str = ''
				if (option) {
					str = '确认停止该生产线?'
				} else {
					str = '确认启动该生产线?'
				}
				uni.showModal({
					content: str,
					success: (res) => {
						if (res.confirm) {
							this.OptionConfirm(param)
						}
					}
				})
			},
			// 操作确认
			async OptionConfirm(param) {
				this.data = []

				uni.showLoading({
					title: '请稍后,正在执行!'
				})

				var [err, res] = await SetLinePause(param)
				setTimeout(() => {
					this.getData()
					uni.hideLoading()
					if (err) {
						uni.showModal({
							content: err,
							showCancel: false
						})
					} else {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
					}
				}, 10000)
			},
			// 获得数据
			async getData() {
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
			
			},
			// 复选
			selectManay(){
				var _this = this
				dd.biz.navigation.setRight({
					show: true,
					control: true,
					text: '选择',
					onSuccess: function() {
						_this.showSelect = true
						_this.cancelSelect()
					}
				})
			},
			cancelSelect(){
				var _this = this
				dd.biz.navigation.setRight({
					show: true,
					control: true,
					text: '取消',
					onSuccess: function() {
						_this.showSelect = false
						_this.selectManay()
					}
				})
			}
		},
		mounted() {
			this.getData()
			this.selectManay()
		}
	}
</script>

<style lang="less" scopde>
	//调试 规则
	.debug {
		border: solid 1rpx red;
	}

	// ::-webkit-scrollbar{
	//   width: 0;
	//   height: 0;
	//   color: transparent;
	// }

	// 正式规则
	.container {
		width: 100%;
		text-align: center;
		text-align: left;

		.ToolBar {
			position: fixed;
		}

		.lineInfo {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.infomation view {
				width: 250rpx;
			}

			.DateBar {
				background-color: #666699;
				color: white;

				#runStop {}
			}

			.collapseitem {
				.item {
					padding: 10rpx 0rpx 10rpx 0rpx;

					.box {
						width: 48%;
						border: solid 2rpx #DCDEE2;
						height: 200rpx;
						margin-bottom: 10rpx;
						margin-top: 10rpx;
						background-color: white;

						.checkbox {
							float: right;
							margin-left: -50%;
							z-index: 10;
						}
					}
				}
			}

			.collapseitem:nth-child(even) {
				.item {
					background-color: #666699;
				}

			}

			.collapseitem:nth-child(odd) {
				.item {
					background-color: #CCCCCC;

				}
			}

		}

	}

	uni-collapse {
		overflow: hidden;
	}

	uni-collapse::-webkit-scrollbar {
		display: none;
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
</style>
