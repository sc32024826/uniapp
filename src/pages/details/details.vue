<template>
	<view class="container">
		<sc-nav left title="站点详情" @goBack="goback"><view @tap="openDrawer" class="select">更多</view></sc-nav>
		<view class="head">
			<view class="row jc-b">
				<view>当前站点:</view>
				<view class="value">{{ CurrentStation.name || '' }}</view>
			</view>
			<view class="row jc-b">
				<view>当前站点登录员工:</view>
				<view class="value">{{ CurrentStation.emp == 'null-null' ? '' : CurrentStation.emp }}</view>
			</view>
		</view>
		<uni-collapse>
			<uni-collapse-item title="站内衣架" :open="true" class="collapseitem">
				<view v-if="none" class="infomsg">暂无数据</view>
				<view class="scroll">
					<uni-swipe-action>
						<view v-for="(v, i) in RackData" :key="i" :class="{ RackiTems: true, warn: v.Processed }" @click="JumpRecode(v.RackCode)">
							<uni-swipe-action-item :right-options="options" @click="bindClick($event, v)" @change="swipeChange()">
								<view class="column full-width">
									<view class="row line between">
										<view>款: {{ v.StyleNo }}</view>
										<view style="flex-shrink: 1;">色: {{ v.ColorName }}</view>
										<view style="flex-shrink: 1;">码: {{ v.SizeName }}</view>
									</view>
									<view class="row line between">
										<view>单: {{ v.MoNo }}</view>
										<view>号: {{ v.RackCode }}</view>
										<view>{{ v.Qty }}件</view>
									</view>
								</view>
							</uni-swipe-action-item>
						</view>
					</uni-swipe-action>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<!-- 已经分配方案 -->
		<view class="plan">
			<view class="plan-title">已分配的方案</view>
			<scroll-view class="scroll-view" scroll-y><ly-tree :tree-data="data" node-key="ID" :props="defaultProps" /></scroll-view>
		</view>
		<view class="junpToTop" @click="junpToTop" v-show="showTop"></view>
		<drawer v-show="render" ref="myDrawer" class="drawer" @onRequest="login"></drawer>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import drawer from '@/components/my-drawer.vue'

var that = this
export default {
	components: {
		drawer
	},
	data() {
		return {
			RackData: [], // 站内衣架
			none: true, // 没有数据的时候显示 暂无数据
			data: [], // 树状数据
			// 左滑 按钮
			options: [
				{
					text: '结束衣架',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			// 是否显示回到顶部的按钮
			showTop: false,
			// 树状结构 默认参数
			defaultProps: {
				children: 'Child',
				label: 'name'
			},
			// 是否渲染子组件
			render: false,
			// 当前站点信息
			CurrentStation: {}
		}
	},
	computed: {
		...mapState(['userSelectStations'])
	},
	methods: {
		...mapMutations(['setStationData', 'setStationEmp']),
		clear() {
			console.log(1)
		},
		// 子组件回调 登录
		async login(param) {
			console.log(param)
			let para = {
				StationGuid: param.StationGuid,
				EmployeeGuid: param.EmployeeGuid
			}
			this.$api.SetStationLoginByStationGuid(para).then(res => {
				if (res.data.success) {
					uni.showModal({
						content: res.data.msg,
						showCancel: false
					})
					// 更新当前页面  只需要更新 登录员工
					this.setStationEmp(param.emp)
				} else {
					uni.showModal({
						content: res.data.msg,
						showCancel: false
					})
				}
			})
		},
		bindClick(e, v) {
			uni.showModal({
				content: '设置该衣架为已完成状态!',
				success: res => {
					if (res.confirm) {
						this.setRackFinished(v.RackCode)
					}
				}
			})
		},
		async setRackFinished(Code) {
			uni.showLoading({
				title: '请稍后'
			})
			this.$api.doneRack(Code).then(res => {
				uni.hideLoading()
				uni.showModal({
					content: res.data.msg,
					showCancel: false,
					success: res => {
						if (res.confirm) {
							this.getRackStatus()
						}
					}
				})
			})
		},
		swipeChange(e) {
			// console.log('左滑操作')
		},
		// 获得该站点分配方案
		getAssignResult() {
			uni.showLoading({
				title: '请稍后'
			})
			let para = {
				StationGuid: this.CurrentStation.guid
			}
			// console.log('站点方案请求', para)
			this.$api.GetStationAssign(para).then(res => {
				if (!res.data.success) {
					uni.showModal({
						content: '站点方案请求' + res.data.msg,
						showCancel: false
					})
				} else {
					this.data = res.data.response
					uni.hideLoading()
				}
			})
		},
		// 返回顶部
		junpToTop() {
			uni.pageScrollTo({
				scrollTop: 0,
				complete: () => {
					this.showTop = false
				}
			})
		},
		// 跳转到记录查询页面
		JumpRecode(code) {
			uni.navigateTo({
				url: '../ProcessRecord/ProcessRecord?code=' + code
			})
		},
		// 获取站内衣架信息,
		getRackStatus() {
			uni.showLoading({
				title: '请稍后'
			})
			let param = {
				StationGuid: this.CurrentStation.guid
			}
			// console.log('衣架信息请求', param)
			this.$api.QueryInStationRackInfByStationGuid(param).then(res => {
				if (res.data.success) {
					// console.log(res.data)
					if (res.data.response.length > 0) {
						this.RackData = res.data.response
						this.none = false
					}

					uni.hideLoading()
				} else {
					uni.showModal({
						content: '衣架信息请求' + res.data.msg,
						showCancel: false
					})
				}
			})
		},
		goback() {
			uni.redirectTo({
				url: '../ProInfo/ProInfo'
			})
		},
		showHelp() {
			console.log('帮助')
		},
		openDrawer() {
			this.render = true
			this.$refs.myDrawer.open()
		}
	},
	mounted() {
		this.CurrentStation = this.userSelectStations[0]
		// 衣架信息
		this.getRackStatus()
		// 分配方案
		this.getAssignResult()
	},
	onPullDownRefresh() {
		// console.log(this.CurrentStation)
		this.CurrentStation = this.userSelectStations[0]
		this.RackData = [] // 站内衣架
		this.data = [] // 树状数据
		// 衣架信息
		this.getRackStatus()
		// 分配方案
		this.getAssignResult()

		setTimeout(function() {
			uni.stopPullDownRefresh()
		}, 1000)
	}
}
</script>

<style lang="less" scoped>
.container {
	width: 100%;
	// height: 100vh;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	flex-direction: column;
	.select {
		padding: 1px 4px;
		// border-radius: 20rpx;
		// border: 1rpx white solid;
	}
	.head {
		// background-color: #0079ff;
		background-image: linear-gradient(to right, #0079ff, #55aaff);
		color: white;
		padding-left: 30rpx;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		.value {
			min-width: 200rpx;
			margin-right: 20rpx;
		}
	}
	.scroll{
		touch-action: none;
	}
	.infomsg {
		width: 100%;
		text-align: center;
		background-color: white;
		padding: 20rpx 0 20rpx 0;
	}

	.line {
		width: 95%;
		margin-left: 20rpx;

		view {
			margin-top: 8rpx;
			margin-bottom: 4rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			min-width: 230rpx;
		}
	}
	.warn {
		background-color: #ffaa00 !important;
	}
	.RackiTems:nth-child(even) {
		// background-color: #666666;
		background-image: linear-gradient(to right, #666666, #55aaff);
		color: white;
	}

	.RackiTems:nth-child(odd) {
		background-color: #55aaff;
		background-image: linear-gradient(to right, #55aaff, #666666);
		color: white;
	}

	.RackiTems {
		margin: 2rpx;

		.full-width {
			width: 100%;
		}
	}

	.solution {
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

	.plan {
		display: flex;
		flex-direction: column;
		.plan-title {
			box-sizing: border-box;
			height: 96rpx;
			padding: 22rpx;
			background-color: #f1f1f1;
		}
		.scroll-view {
			// height: 800rpx;
			overflow: hidden;
			flex: 1;
		}
	}

	.junpToTop {
		width: 70rpx;
		height: 80rpx;
		position: fixed;
		right: 60rpx;
		bottom: 60rpx;
		z-index: 4;
		background-image: url(../../static/img/top.png);
		background-position: center;
		background-repeat: no-repeat;
		background-size: 50% 50%;
	}

	.warp {
		flex-wrap: wrap;
	}

	.drawer {
		z-index: 10;
	}
}

.marginR {
	margin-right: 20rpx;
}
</style>
