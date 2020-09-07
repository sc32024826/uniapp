<template>
	<view class="container">
		<uni-nav-bar fixed status-bar>
			<view class="center">今日生产情况</view>
			<view slot="left" @click="goback" class="icon-back">返回</view>
			<view slot="right" class="marginR">
				<text @tap="showHelp" class="marginR">&#xe677;</text>
				<text @tap="selectItems">{{navBtnRight}}</text>
			</view>
		</uni-nav-bar>
		<uni-collapse class="mx wd">
			<view class="lineInfo column" v-for="(item,i) in data" :key="i">
				<view class="row DateBar my">
					<view class="row wrap infomation my">
						<view>总数:{{item.ClothesQty}}</view>
						<view>衣架数:{{item.NotFinishedRackQty}}</view>
						<view>负载率:{{Math.round(item.LoadRatio*100)}}%</view>
						<view>运行状态:{{item.Status==1?'停止':item.Status==2?'运行':'演示'}}</view>
					</view>
					<button class="runStop" @click="lineOption(item)" :type="item.bt.type" :loading="item.bt.load" :disabled="item.bt.disabled">
						<text class="iconfont">{{item.bt.text == '停止'? '&#xe74b;' : '&#xe65b;'}}</text>{{item.bt.text}}
					</button>
				</view>
				<template>
					<uni-collapse-item :title="item.LineID + '号线'" class="collapseitem" :open="showContent">
						<view class="row wrap item">
							<view class="box" v-for="(v,k) in item.list" :key="k" v-if="item.list">
								<checkbox class="checkbox" v-if="showSelect" :checked="v.checked"></checkbox>
								<view @click="clickBox(v)" class="ht">
									<view class="row special">
										<view :class="v.Enable*v.EnableIn == false ? 'base stop':'base light'"></view>
										<view class="wd-50">{{v.LineID}}-{{v.StationID}}</view>
										<view class="wd-50">{{v.SeqName}}</view>
									</view>
									<view class="row">
										<view class="wd-50 al-c">{{v.EmpID}}-{{v.Name}}</view>
										<view class="wd-50 al-c">{{v.RackCnt}}/{{v.RackCap}}</view>
									</view>
								</view>
							</view>
							<view v-if="!item.list">暂无数据</view>
						</view>
					</uni-collapse-item>
				</template>
			</view>
		</uni-collapse>
		<view class="footer" v-if="showSubmitBtn">
			<button type="primary" @click="navigateToTree">提交</button>
		</view>

	</view>
</template>

<script>
	import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import { GetStationStatus, GetLineStatus, QueryInStationRackInfByStationGuid, SetLinePause } from '@/api/api.js'
	import groupBy from './classify.js'
	import { mapMutations } from 'vuex'

	export default {
		components: { uniCollapse, uniCollapseItem, uniDrawer, uniNavBar },
		data() {
			return {
				data: [],
				showSubmitBtn: false,
				showSelect: false, // 是否显示多选框
				showContent: false, // 是否展开下拉扩展框
				stopJump: false, // 当触发多选时,改为true 禁止 跳转页面
				delay: {},
				timerOver: true, // 定时器是否结束的标志
				selectedStationGuids: [], //选择的StationGuids
				navBtnRight: '选择'
			}
		},
		methods: {
			...mapMutations(['setStationMsg', 'setStationGuids']),
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
				this.stopJump = true
			},
			async clickBox(v) {
				if (this.stopJump) {
					v.checked = !v.checked
					if (v.checked) {
						this.selectedStationGuids.push(v.StationGuid)
					} else {
						let No = this.selectedStationGuids.indexOf(v.StationGuid)
						this.selectedStationGuids.splice(No, 1)
					}
					return
				}
				// 生产线号-站号
				let s = v.LineID + '-' + v.StationID
				// 职工信息
				let emp = v.EmpID + '-' + v.Name
				uni.navigateTo({
					url: '/pages/details/details?guid=' + v.StationGuid + '&sid=' + s + '&emp=' + emp
				})
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
				var lineData = []
				var stationData = []
				let para = ''
				var [err, res] = await GetStationStatus(para)
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
						lineData = groupBy(data, 'LineID')
					}
				}
				let param = ''
				var [error, result] = await GetLineStatus(param)
				if (error) {
					uni.showModal({
						content: error,
						showCancel: false
					})
				} else {
					stationData = result.data
					stationData.map(m => {
						lineData.forEach(e => {
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
					this.data = stationData
					uni.hideLoading()
				}

			},
			// 复选
			selectItems() {
				if (this.navBtnRight == '选择') {
					this.showSelect = true
					this.showContent = true
					this.stopJump = true
					// 点击 选择之后 将按钮改成取消
					this.navBtnRight = '取消'
					this.showSubmitBtn = true
				} else {
					this.showSelect = false
					this.stopJump = false
					// 点击 选择之后 将按钮改成取消
					this.navBtnRight = '选择'
					this.showSubmitBtn = false
				}

			},
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
			},
			// 跳转到treedata页面
			navigateToTree() {
				let length = this.selectedStationGuids.length
				if (length == 0) {
					uni.showModal({
						content: '您没有选择任何站点!',
						showCancel: false
					})
					return
				} else {
					// vuex 存储选中的站点信息
					this.setStationGuids(this.selectedStationGuids)
					uni.redirectTo({
						url: '/pages/TreeData/index'
					})
				}
			},
			goback() {
				uni.navigateBack({})
			},
			showHelp() {
				console.log('帮助')
			}
		},
		mounted() {
			uni.showLoading({
				title: '请稍后'
			})
			this.getData()
		}
	}
</script>

<style lang="less" scopde>
	.container {
		width: 100%;
		text-align: center;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		.wd {
			width: calc(100vw - 20rpx);
		}

		.ToolBar {
			position: fixed;
		}

		.lineInfo {

			.infomation view {
				width: 250rpx;
				padding-left: 10rpx;
			}

			.DateBar {
				background-color: #666699;
				color: white;

				.runStop {
					width: 300rpx;
					margin-right: 10rpx;
					border-radius: 30rpx;
				}
			}

			.collapseitem {
				.item {
					justify-content: space-between;
					padding-bottom: 5rpx;
					padding-top: 5rpx;
					background-color: #e3e3e3;

					.box {
						width: calc((100vw - 34rpx)/2);
						border: solid 1rpx #DCDEE2;
						height: 180rpx;
						background-color: white;
						margin-top: 5rpx;
						margin-bottom: 5rpx;
						display: block;

						.ht {
							height: 100%;
							.row{
								align-items: flex-end;
								justify-content: space-around;
								margin-top: 20rpx;
							}
							.special{
								width: 80%;
								margin-left: 10rpx;
							}
						}

						.checkbox {
							float: right;
							margin-top: 10rpx;
						}

						.wd-50 {
							width: 100rpx;
						}
					}
				}
			}
		}

		.footer {
			position: fixed;
			width: 100%;
			height: 6vh;
			bottom: 0;
			color: white;
		}
	}

	uni-collapse {
		overflow: hidden;
	}

	uni-collapse::-webkit-scrollbar {
		display: none;
	}

	.wrap {
		flex-wrap: wrap;
		justify-content: start;
	}

	.base {
		width: 50rpx;
		height: 50rpx;
		// border: solid 1rpx green;
		margin-top: 10rpx;
	}

	.light {
		background: #38a800;
	}

	.stop {
		background: red;
	}

	.marginR {
		margin-right: 30rpx;
	}
</style>
