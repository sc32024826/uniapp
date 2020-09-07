<template>
	<view class="container">
		<uni-nav-bar fixed status-bar>
			<view class="center">站点详情</view>
			<view slot="left" @click="goback" class="icon-back">返回</view>
			<view slot="right" class="marginR">
				<text @tap="showHelp" class="marginR">&#xe677;</text>
				<text @tap="openDrawer">更多</text>
			</view>
		</uni-nav-bar>
		<view class="head mx">
			<view>当前站点:{{sid}}</view>
			<view>当前站点登录员工:{{emp}}</view>
		</view>
		<uni-collapse>
			<uni-collapse-item title="站内衣架" :open="true" class="collapseitem mx">
				<view v-if="none" class="infomsg">暂无数据</view>
				<view class="scroll1">
					<uni-swipe-action>
						<view v-for="(v,i) in RackData" :key="i" class="RackiTems" :style="v.Processed ? 'background-color: #ffaa00;' :''"
						 @click="JumpRecode(v.RackCode)">
							<uni-swipe-action-item :right-options="options" @click="bindClick($event,v)" @change="swipeChange()">
								<view class="column full-width">
									<view class="row line between">
										<view>款: {{v.StyleNo}}</view>
										<view style="flex-shrink: 1;">色: {{v.ColorName}}</view>
										<view style="flex-shrink: 1;">码: {{v.SizeName}}</view>
									</view>
									<view class="row line between">
										<view>单: {{v.MoNo}}</view>
										<view>号: {{v.RackCode}}</view>
										<view>{{v.Qty}}件</view>
									</view>
								</view>
							</uni-swipe-action-item>
						</view>
					</uni-swipe-action>
				</view>

			</uni-collapse-item>
			<uni-collapse-item title="已分配的方案" :open="true" class="collapseitem mx">
				<ly-tree :tree-data="data" node-key="ID" :props="defaultProps" />
			</uni-collapse-item>
		</uni-collapse>
		<view id="junpToTop" @click="junpToTop" v-show="showTop"></view>
		<drawer v-show="render" ref="myDrawer" class="drawer"></drawer>
	</view>
</template>

<script>
	import LyTree from '@/components/ly-tree/ly-tree.vue'
	import { uniCollapse, uniCollapseItem, uniSwipeAction, uniSwipeActionItem, uniLoadMore } from '@dcloudio/uni-ui'
	import { GetStationAssign, doneRack, QueryInStationRackInfByStationGuid } from '@/api/api.js'
	import * as dd from "dingtalk-jsapi"
	import drawer from '@/components/my-drawer.vue'
	import { mapMutations } from 'vuex'
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"

	var that = this
	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			uniSwipeAction,
			uniSwipeActionItem,
			LyTree,
			drawer,
			uniNavBar
		},
		data() {
			return {
				guid: '', //当前站点的guid
				sid: '',
				emp: '',
				RackData: [], // 站内衣架
				none: true, // 没有数据的时候显示 暂无数据
				data: [], // 树状数据
				options: [{
					'text': '结束衣架',
					'style': {
						"backgroundColor": "#dd524d"
					}
				}],
				showTop: false, // 显示回到顶部的按钮
				defaultProps: {
					children: 'Child',
					label: 'name'
				},
				render: false //渲染子组件
			}
		},
		methods: {
			...mapMutations(['setStationData']),
			bindClick(e, v) {
				uni.showModal({
					content: '设置该衣架为已完成状态!',
					success: (res) => {
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
				var [err, res] = await doneRack(Code)
				uni.hideLoading()
				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					console.log(res)
					uni.showModal({
						content: res.data.msg,
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								this.getRackStatus()
							}
						}
					})
				}

			},
			swipeChange(e) {
				// console.log('左滑操作')
			},
			// 获得该站点分配方案
			async getAssignResult() {
				uni.showLoading({
					title: '请稍后'
				})
				let para = {
					StationGuid: this.guid
				}
				var [err, res] = await GetStationAssign(para)

				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					if (!res.data.success) {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
					} else {
						this.data = res.data.response
						uni.hideLoading()
					}
				}
			},
			junpToTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					complete: () => {
						this.showTop = false
					}
				})
			},
			JumpRecode(code) {
				uni.navigateTo({
					url: '../ProcessRecord/ProcessRecord?code=' + code
				})
			},
			// 获取站内衣架信息,
			async getRackStatus() {
				uni.showLoading({
					title: '请稍后'
				})
				let param = {
					StationGuid: this.guid
				}
				var [err, res] = await QueryInStationRackInfByStationGuid(param)
				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					if (res.data.success == true) {
						this.RackData = res.data.response
						this.none = false
						uni.hideLoading()
					} else {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
					}
				}
			},
			goback() {
				uni.navigateBack({})
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
			// 衣架信息
			this.getRackStatus()
			// 分配方案
			this.getAssignResult()
		},
		onLoad(options) {
			this.guid = options.guid // station guid
			this.emp = options.emp == 'null-null' ? '无' : options.emp
			this.sid = options.sid
			this.setStationData({
				name: options.sid,
				emp: options.emp,
				guid: options.guid
			})
		}
	}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		z-index: 1;

		.head {
			background-color: #0079FF;
			color: white;
			padding-left: 30rpx;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
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
			}
		}

		.RackiTems:nth-child(even) {
			background-color: #666666;
			color: white;
		}

		.RackiTems:nth-child(odd) {
			background-color: #55aaff;
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

		.scroll1 {
			overflow-y: scroll;
			-webkit-overflow-scrolling: touch;
			max-height: 80vh;
		}

		#junpToTop {
			width: 80rpx;
			height: 80rpx;
			position: fixed;
			right: 60rpx;
			bottom: 60rpx;
			z-index: 4;
			background-color: white;
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

		/* 起到固定的作用 ,从而解决原页面触摸穿透的问题*/
		// .prevent {
		// 	width: 100%;
		// 	height: 100%;
		// 	position: fixed;
		// 	top: 0;
		// 	left: 0;
		// 	overflow: hidden;
		// }

	}

	.marginR {
		margin-right: 20rpx;
	}
</style>
