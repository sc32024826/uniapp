<template>
	<view class="container">
		<uni-collapse>
			<view class="lineInfo" v-for="(item,i) in data" :key="i">
				<view class="flex row DateBar">
					<view class="flex row wrap infomation">
						<view>总数:{{item.ClothesQty}}</view>
						<view>衣架数:{{item.NotFinishedRackQty}}</view>
						<view>负载率:{{item.LoadRatio*100}}%</view>
						<view>运行状态:{{item.Status==1?'停止':item.Status==2?'运行':'演示'}}</view>
					</view>
					<button class="runStop" @click="lineOption(item)" :type="item.bt.type" :loading="item.bt.load" :disabled="item.bt.disabled">
						{{item.bt.text}}
					</button>
				</view>
				<uni-collapse-item :title="item.LineID + '号线'" class="collapseitem" :open="showContent">
					<view class="flex row wrap item">
						<view class="box" v-for="(v,k) in item.list" :key="k" @longpress="longpressfn" v-if="item.list">
							<view @click="clickBox(v)">
								<checkbox class="checkbox" v-show="showSelect" :checked="v.checked"></checkbox>
								<view class="flex row">
									<view :class="v.Enable*v.EnableIn == false ? 'base stop':'base light'"></view>
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
				data: [],
				showSelect: false, // 是否显示多选框
				showContent: false, // 是否展开下拉扩展框
				stopJump: false, // 当触发多选时,改为true 禁止 跳转页面
				delay: {},
				timerOver: true // 定时器是否结束的标志
			}
		},
		methods: {
			...mapMutations(['setStationMsg']),
			//控制按钮颜色
			getButtontype(Status) {
				if (!this.loading) {
					return Status == 1 ? 'primary' : 'warn'
				} else {
					return 'default'
				}
			},
			setBtDisable(i) {
				if (this.disabled.length > 0) {
					console.log('----')
					return this.disabled[i].status
				} else {
					return false
				}
			},
			// 长按 出现复选框
			longpressfn() {
				this.showSelect = true
			},
			async clickBox(v) {
				if (this.stopJump) {
					v.checked = ! v.checked
					return
				}
				uni.showLoading({
					title: '正在查询,请稍后!'
				})
				let para = {
					StationGuid: v.StationGuid
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
							id: v.StationGuid,
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
			lineOption(item) {
				var option = false
				// 当前停止状态
				if (item.Status != 1) {
					option = true
				}
				var param = {
					'LineGuid': item.LineGuid,
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
							this.OptionConfirm(item, param)
						}
					}
				})
			},
			//操作确认
			async OptionConfirm(item, param) {
				console.log(new Date())
				item.bt = {
					text: '等待',
					load: true,
					disabled: true,
					type: 'default'
				}
				this.delayGetData()
				await SetLinePause(param)
			},
			// 获得数据
			async getData() {
				var part_1 = []
				var part_2 = []
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
						
						data.map(e => {
							e = Object.assign(e, { checked: false })
						})
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
							let tt = m.Status == 1 ? '运行' : '停止'
							let type = m.Status == 1 ? 'primary' : 'warn'
							m = Object.assign(m, {
								list: e.list,
								bt: {
									text: tt,
									type: type,
									load: false,
									disabled: false
								}
							})
						}
					})
				})
				this.data = part_2
			},
			// 复选
			selectManay() {
				var _this = this
				dd.biz.navigation.setRight({
					show: true,
					control: true,
					text: '选择',
					onSuccess: function() {
						_this.showSelect = true
						_this.showContent = true
						_this.stopJump = true
						_this.cancelSelect()
					}
				}).catch(e => {
					console.log(e)
				})
			},
			cancelSelect() {
				var _this = this
				dd.biz.navigation.setRight({
					show: true,
					control: true,
					text: '取消',
					onSuccess: function() {
						_this.showSelect = false
						_this.stopJump = false
						_this.selectManay()
					}
				}).catch(e => {
					console.log(e)
				})
			},
			toggle(val) {
				console.log('子组件 emit事件,传递的参数为: ', val)
			},
			//
			delayGetData() {
				//判断定时器是否结束
				if (this.timerOver) {
					// console.log('定时器 不存在 或者结束')
					this.delay = setTimeout((a) => {
						this.getData()
						this.timerOver = a
						// clearTimeout(this.delay)
					}, 10000, true)
					this.timerOver = false
				} else { // 若定时器依然存在 则 先取消当前定时器 再更新定时器
					// console.log('定时器 已经存在,先清除当前定时器 再更新定义')
					clearTimeout(this.delay)
					this.delay = setTimeout((a) => {
						this.getData()
						this.timerOver = a
						// clearTimeout(this.delay)
					}, 10000, true)
					this.timerOver = false
				}
			}
		},
		async mounted() {
			// 加载数据
			await this.getData()
			// 显示 钉钉导航栏 右侧按钮
			this.selectManay()
			// 根据生产线数量生成一个 全部为false 的数组,用于控制每条生产线按钮的 禁用状态
			console.log(this.data)
		},
		onHide() {
			dd.biz.navigation.setRight({
				show: false,
				control: true,
				text: '',
				onSuccess: function() {}
			})
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

				.runStop {
					width: 300rpx;
					margin-right: 5rpx;
				}
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
