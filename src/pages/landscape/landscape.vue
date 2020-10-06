<template>
	<view class="landscapse">
		<sc-nav left landscapse @goBack="goback"><view @click="search" class="rightBtn column">筛选</view></sc-nav>
		<view class="content">
			<view class="fixed">
				<view class="head row jc-b primary white cell">
					<view>生产单</view>
					<view>款号</view>
					<view>客户</view>
					<view>针种</view>
					<view>交期</view>
					<view>完工工序</view>
					<view>数量</view>
					<view class="fg-1">备注</view>
				</view>
			</view>
			<view class="fill-area"></view>
			<block v-for="(it, index) in sourceData" :key="index">
				<view class="item row jc-b cell">
					<view>{{ it.MONo }}</view>
					<view>{{ it.StyleNo }}</view>
					<view>{{ it.CustomerName }}</view>
					<view>{{ it.PinType }}</view>
					<view>{{ new Date(it.DeliveryTime).format('yyyy-MM-dd') }}</view>
					<view>{{ it.EndProcess || '' }}</view>
					<view>{{ it.Qty }}</view>
					<view class="fg-1">{{ it.Remark || '' }}</view>
				</view>
			</block>
			<uni-load-more :status="more" v-if="allData.length > 20"></uni-load-more>
		</view>
		<sc-select v-if="onReSearch" class="reSearch" @close="close" @reSearch="reSearch"></sc-select>
	</view>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
import { mapState } from 'vuex'
export default {
	data() {
		return {
			landscapse: false,
			windowWidth: 724,
			sourceData: [],
			allData: [],
			page: 0,
			pageSize: 20,
			more: 'more',
			onReSearch: false, // 控制子组件 的出现
			msg: ''
		}
	},
	methods: {
		search() {
			this.onReSearch = true
		},
		goback() {
			let env = dd.env.platform
			if (env != 'notInDingTalk') {
				dd.device.screen.rotateView({
					showStatusBar: true, // 否显示statusbar
					clockwise: true, // 是否顺时针方向
					onSuccess: function() {},
					onFail: function(err) {}
				})
				dd.device.screen.resetView({
					showStatusBar: true,
					onSuccess: function(result) {
						uni.switchTab({
							url: '/pages/main/main'
						})
					},
					onFail: function(err) {}
				})
			} else {
				uni.switchTab({
					url: '../main/main'
				})
			}
		},
		// 获得数据
		setData(para) {
			uni.showLoading({
				title: '请稍后'
			})
			this.$api.QueryMO(para).then(res => {
				if (res.data.success === true) {
					this.allData = res.data.response
					this.sourceData = this.allData.slice(0, this.pageSize)
					uni.hideLoading()
				} else {
					uni.showModal({
						content: res.data.msg,
						showCancel: false
					})
				}
			})
		},
		Changelandscapse() {
			let that = this
			let env = dd.env.platform
			if (env != 'notInDingTalk') {
				dd.device.screen.rotateView({
					showStatusBar: false, // 否显示statusbar
					clockwise: true, // 是否顺时针方向
					onSuccess: function() {
						that.landscapse = true
						resolve(true)
					},
					onFail: function(err) {
						console.log(err)
					}
				})
			}
		},
		close() {
			this.onReSearch = false
		},
		reSearch(val) {
			console.log(val)
			this.setData(val)
		}
	},
	computed: {
		...mapState(['device'])
	},
	mounted() {
		this.setData({})
	},
	created() {
		this.Changelandscapse()
	},
	onReachBottom() {
		console.log('到底了')
		this.more = 'loading'
		let start = this.page * this.pageSize
		let end = start + this.pageSize
		let temp = this.allData.slice(start, end)
		console.log(temp)
		this.sourceData = this.sourceData.concat(temp)
		this.more = 'more'
	},
	onPullDownRefresh() {
		location.reload()
		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 1000)
	}
}
</script>

<style lang="scss" scoped>
.landscapse {
	width: 100%;
	box-sizing: border-box;
	// padding-left: env(safe-area-inset-left);
	// padding-right: env(safe-area-inset-right);
	// padding-bottom: env(safe-area-inset-bottom);
	.rightBtn {
		height: 100%;
		justify-content: center;
	}
	.content {
		background-color: white;
		z-index: 1;
		width: 100%;
		padding-left: env(safe-area-inset-left);
		padding-right: env(safe-area-inset-right);
		box-sizing: border-box;
		.fixed {
			width: 100%;
			left: 0;
			top: 44px;
			box-sizing: border-box;
			padding-left: env(safe-area-inset-left);
			padding-right: env(safe-area-inset-right);
			.head {
				width: 100%;
				z-index: 2;
			}
		}

		.fill-area {
			height: 25px;
		}
		.item {
			padding-bottom: 6rpx;
		}
	}
	.reSearch {
		z-index: 99;
	}
}
.fixed {
	position: fixed;
}
.fg-1 {
	flex-grow: 1;
}
.fg-2 {
	flex-grow: 2;
}
.cell {
	view {
		border: 1rpx #666666 solid;
		min-width: 50rpx;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		box-sizing: border-box;
		white-space: nowrap;
	}

	view:nth-child(1) {
		width: calc(12.5% + 50rpx);
	}
	view:nth-child(2) {
		width: 12.5%;
	}
	view:nth-child(3) {
		width: calc(12.5%);
	}
	view:nth-child(4) {
		width: calc(12.5% - 20rpx);
	}
	view:nth-child(5) {
		width: calc(12.5% + 10rpx);
	}
	view:nth-child(6) {
		width: calc(12.5%);
	}
	view:nth-child(7) {
		width: calc(12.5% - 20rpx);
	}
	view:nth-child(8) {
		width: calc(12.5% - 20rpx);
	}
}
</style>
