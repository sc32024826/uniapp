<template>
	<view class="container">
		<sc-nav left @goBack="goback" title="生产车间"><view @click="selectItems" class="select">选择</view></sc-nav>
		<uni-collapse>
			<view class="lineInfo column" v-for="(item, i) in data" :key="i">
				<view class="row DateBar my">
					<view class="row wrap infomation my">
						<view>总数:{{ item.ClothesQty }}</view>
						<view>衣架数:{{ item.NotFinishedRackQty }}</view>
						<view>负载率:{{ Math.round(item.LoadRatio * 100) }}%</view>
						<view>运行状态:{{ item.Status == 1 ? '停止' : item.Status == 2 ? '运行' : '演示' }}</view>
					</view>
					<button class="runStop" @tap="lineOption(item)" :type="item.bt.type" :loading="item.bt.load" :disabled="item.bt.disabled">
						<text class="iconfont">{{ item.bt.text == '停止' ? '&#xe74b;' : '' }}</text>
						{{ item.bt.text }}
					</button>
				</view>
				<template>
					<uni-collapse-item :title="item.LineID + '号线'" class="collapseitem" :open="showContent">
						<view class="row wrap item">
							<view class="box" v-for="(v, k) in item.list" :key="k" v-if="item.list">
								<checkbox class="checkbox" v-if="showSelect" :checked="v.checked" @tap="clickBox(v)"></checkbox>
								<view @tap="clickBox(v)" class="ht">
									<view class="row special">
										<view :class="v.Enable * v.EnableIn == false ? 'base stop' : 'base light'"></view>
										<view class="wd-50">{{ v.LineID }}-{{ v.StationID }}</view>
										<view class="wd-50">{{ v.SeqName == null ? '' : v.SeqName }}</view>
									</view>
									<view class="row">
										<view class="al-c">{{ v.EmpID == null ? '' : v.EmpID }}-{{ v.Name == null ? '' : v.Name }}</view>
										<view class="wd-50 al-c">{{ v.RackCnt }}/{{ v.RackCap }}</view>
									</view>
								</view>
							</view>
							<view v-if="!item.list">暂无数据</view>
						</view>
					</uni-collapse-item>
				</template>
			</view>
		</uni-collapse>
		<view class="footer row" v-if="showSubmitBtn">
			<button type="primary" @tap="navigateToTree" class="wd-2">确认选择</button>
			<button type="default" @tap="selectItems" class="wd-2">取消</button>
		</view>
		<drawer v-show="render" ref="myDrawer" class="drawer" :station-list="selectedStation" @onRequestMult="requestMult"></drawer>
	</view>
</template>

<script>
import { mapMutations } from 'vuex'
import groupBy from './classify.js'
import drawer from '@/components/my-drawer.vue'

export default {
	components: {
		drawer
	},
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
			selectedStation: [],
			navBtnRight: '选择',
			render: false // 控制抽屉的开启和关闭
		}
	},
	methods: {
		...mapMutations(['setStationMsg', 'setStationGuids', 'setStationData']),
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
		clickBox(v) {
			// 生产线号-站号
			let sname = v.LineID + '-' + v.StationID
			// 职工信息
			let emp = v.EmpID + '-' + v.Name

			// 当 stopJump = true 时 此时点击box为勾选操作  否则 将发生页面跳转
			if (this.stopJump) {
				v.checked = !v.checked
				if (v.checked) {
					console.log(v)
					this.selectedStationGuids.push(v.StationGuid)
					this.selectedStation.push({
						name: sname,
						guid: v.StationGuid,
						emp: emp
					})
				} else {
					let No = this.selectedStationGuids.indexOf(v.StationGuid)
					this.selectedStationGuids.splice(No, 1)
					this.selectedStation.splice(No, 1)
				}
				return
			}
			// vuex 存储 站点信息
			this.setStationData({
				name: sname,
				emp: emp,
				guid: v.StationGuid
			})
			uni.navigateTo({
				url: '/pages/details/details'
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
				LineGuid: item.LineGuid,
				isToPause: option,
				onlyOnce: true
			}
			var str = ''
			if (option) {
				str = '确认停止该生产线?'
			} else {
				str = '确认启动该生产线?'
			}
			uni.showModal({
				content: str,
				success: res => {
					if (res.confirm) {
						this.OptionConfirm(item, param)
					}
				}
			})
		},
		//操作确认
		OptionConfirm(item, param) {
			console.log(new Date())
			item.bt = {
				text: '等待',
				load: true,
				disabled: true,
				type: 'default'
			}
			this.delayGetData()
			this.$api.SetLinePause(param)
		},
		// 获得数据
		async getData() {
			uni.showLoading({
				title: '请稍后'
			})
			var stationData = []
			var lineData = await this.$api.GetStationStatus().then(res => {
				if (res.data.success) {
					let data = res.data.response
					data.map(e => {
						e = Object.assign(e, {
							checked: false
						})
					})
					return groupBy(data, 'LineID')
				}
			})
			// console.log(lineData)
			this.$api.GetLineStatus().then(res => {
				stationData = res.data.response
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
			})
		},
		// 复选
		selectItems() {
			if (this.navBtnRight === '选择') {
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
				this.delay = setTimeout(
					a => {
						this.getData()
						this.timerOver = a
						// clearTimeout(this.delay)
					},
					10000,
					true
				)
				this.timerOver = false
			} else {
				// 若定时器依然存在 则 先取消当前定时器 再更新定时器
				// console.log('定时器 已经存在,先清除当前定时器 再更新定义')
				clearTimeout(this.delay)
				this.delay = setTimeout(
					a => {
						this.getData()
						this.timerOver = a
						// clearTimeout(this.delay)
					},
					10000,
					true
				)
				this.timerOver = false
			}
		},
		// 提交按钮 跳转到treedata页面
		navigateToTree() {
			this.render = true
			this.$refs.myDrawer.open()
			this.setStationData(this.selectedStation)
		},
		// 子组件 返回的多次请求事件 state 表示是否是最后一次执行 若是 执行完刷新页面
		requestMult(param) {
			let para = {
				StationGuid: param.StationGuid,
				EmployeeGuid: param.EmployeeGuid
			}
			let state = param.stop
			// await SetStationLoginByStationGuid(para)
			this.$api.SetStationLoginByStationGuid(para)

			//state 表示是否是最后一次执行 若是 执行完刷新页面
			if (state) {
				this.clear()
				uni.showLoading({
					title: '请稍后'
				})
				this.getData()
			}
		},
		clear() {
			this.data = []
			this.showSubmitBtn = false
			this.showSelect = false // 是否显示多选框
			this.showContent = true // 是否展开下拉扩展框
			this.stopJump = false // 当触发多选时,改为true 禁止 跳转页面
			this.delay = {}
			this.timerOver = true // 定时器是否结束的标志
			this.selectedStationGuids = [] //选择的StationGuids
			this.selectedStation = []
			this.navBtnRight = '选择'
			this.render = false // 控制抽屉的开启和关闭
			this.errList = [] // 站点复选时 提交 存放错误次数等信息
		},
		goback() {
			uni.switchTab({
				url: '/pages/main/main'
			})
		}
	},
	mounted() {
		this.getData()
	},
	onPullDownRefresh() {
		console.log('加载数据')
		this.data = []
		this.getData()
		setTimeout(function() {
			uni.stopPullDownRefresh()
		}, 1000)
	}
}
</script>

<style lang="less" scopde>
.container {
	width: 100%;
	text-align: center;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	.select {
		padding: 1px 4px;
		// border-radius: 20rpx;
		// border: 1rpx white solid;
	}
	.scroll-view {
		flex: 1;
		height: 812px;
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
				width: 350rpx;
				margin-right: 10rpx;
				border-radius: 30rpx;
				font-size: 14px;
			}
		}

		.collapseitem {
			text-align: left;
			.item {
				justify-content: space-between;
				padding-bottom: 5rpx;
				padding-top: 5rpx;
				background-color: #e3e3e3;

				.box {
					width: calc((100vw - 10rpx) / 2);
					height: 180rpx;
					background-color: white;
					margin-top: 10rpx;
					display: block;

					.ht {
						height: 100%;

						.row {
							align-items: flex-end;
							justify-content: space-around;
							margin-top: 20rpx;
						}

						.special {
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
	margin-top: 10rpx;
}

.light {
	background: #38a800;
}

.stop {
	background: red;
}
</style>
