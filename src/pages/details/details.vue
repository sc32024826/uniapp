<template>
	<view id="container">
		<uni-collapse>
			<uni-collapse-item title="站内衣架" :open="true" class="collapseitem">
				<view v-if="nodata" class="infomsg">暂无数据</view>
				<view class="scroll1">
					<uni-swipe-action>
						<view v-for="(v,i) in stationMsg.data" :key="i" class="width">
							<uni-swipe-action-item :right-options="options" @click="bindClick($event,v)" @change="swipeChange()">
								<view class="row between wrap">
									<view class="row between wrap line">
										<view>款: {{v.StyleNo}}</view>
										<view style="flex-shrink: 1;">色: {{v.ColorName}}</view>
										<view style="flex-shrink: 1;">码: {{v.SizeName}}</view>
									</view>
									<view class="row between wrap line">
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
			<uni-collapse-item title="已分配的方案" :open="true">
				<template v-if="nodata2">
					<view class="infomsg">暂无数据</view>
				</template>
				<view class="scroll">
					<view v-for="(v,i) in data" :key="i" class="solution row" @click="showModal(v)">
						<view class="no">{{i+1}}</view>
						<view class="mo">{{v.MoNo}}</view>
						<view class="style">{{v.StyleNo}}</view>
					</view>
					<uni-load-more :status="more" v-if="!nodata2"></uni-load-more>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<view id="junpToTop" @click="junpToTop" v-show="showTop"></view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { uniCollapse, uniCollapseItem, uniSwipeAction, uniSwipeActionItem, uniLoadMore } from '@dcloudio/uni-ui'
	import { GetStationAssign, doneRack, QueryInStationRackInfByStationGuid } from '@/api/api.js'

	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			uniSwipeAction,
			uniSwipeActionItem,
			uniLoadMore
		},
		data() {
			return {
				data: [],
				options: [{
					'text': '结束衣架',
					'style': {
						"backgroundColor": "#dd524d"
					}
				}],
				showTop: false,
				more: 'noMore',
				pageCount: 1, //分页总数
				page: 1, //当前页
				dataCount: 0, //总条数
				PageSize: 40 //每页显示数量
			}
		},
		methods: {
			bindClick(e, v) {
				uni.showModal({
					content: '设置该衣架为已完成状态!',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							this.setRackFinished(v.RackCode)
						}
					}
				})
			},
			async setRackFinished(Code) {
				var [err, res] = await doneRack(Code)
				uni.hideLoading()
				if (err) {
					console.log(err)
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
			/**
			 * @param {Object} PageIndex 页
			 * @param {Object} PageSize 每页数据
			 */
			async getData(PageIndex, PageSize) {
				let param = {
					StationGuid: this.stationMsg.id,
					PageIndex: PageIndex,
					PageSize: PageSize
				}
				var [err, res] = await GetStationAssign(param)
				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					let a = res.data.response
					console.log(a);
					this.pageCount = a.pageCount
					this.page = a.page
					this.dataCount = a.dataCount
					this.PageSize = a.PageSize
					return a.data

				}
			},
			showModal(item) {
				let str = item.MoNo + '\n' + item.StyleNo + '\n' + item.ColorName + '\n' + item.SizeName
				uni.showModal({
					content: str,
					showCancel: false
				})
			},
			async setData() {
				this.data = await this.getData(this.page, this.PageSize)
			},
			//拼接数据
			async addData() {
				// 显示正在加载
				this.more = 'loading'
				//如果 数据量 大于当前显示的 则加载新的
				if (this.dataCount > this.page * this.PageSize) {
					let newdata = await this.getData(this.page + 1, this.PageSize)
					this.data = this.data.concat(newdata)
				} else {
					this.more = 'noMore'
				}
				// this.more = 'more'
			},
			junpToTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					complete: () => {
						this.showTop = false
					}
				})
			},
			// 获取站内衣架信息,
			async getRackStatus() {
				let param = {
					StationGuid: this.stationMsg.id
				}
				var [err, res] = await QueryInStationRackInfByStationGuid(param)
				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					if (res.data.success == true) {
						this.stationMsg.data = res.data.response
					} else {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
					}
				}
			}
		},
		mounted() {
			this.setData()
		},
		computed: {
			...mapState(['stationMsg']),
			nodata2() {
				return this.data.length > 0 ? false : true
			},
			// 显示暂无数据
			nodata() {
				if (this.stationMsg.data) {
					return this.stationMsg.data.length > 0 ? false : true
				} else {
					return true
				}
			}
		},
		watch: {
			page(newv, ov) {
				let haveShow = this.PageSize * newv
				this.more = this.dataCount > haveShow ? 'more' : 'noMore'
			}
		},
		// 上拉 触底
		onReachBottom() {
			this.addData()
			this.showTop = true
		}
	}
</script>

<style lang="less" scoped>

	#container {
		width: 100%;
		// height: 100vh;
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
	}
</style>
