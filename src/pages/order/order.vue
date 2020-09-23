<template>
	<view class="Container column fixed" @touchmove.stop>
		<sc-nav left title="生产单" @goBack="goback"><view @tap="select">筛选</view></sc-nav>
		<scroll-view class="scroll-view" scroll-y :style="{ height: bodyH + 'px' }" @scrolltolower="loadMore">
			<block v-for="(item, index) in sourceData" :key="index">
				<view class="items white">
					<view class="row my line">
						<view class="line-head">生产单:</view>
						<view class="t-a-c">{{ item.MONo }}</view>
					</view>
					<view class="row jc-b my line">
						<view class="line-head">款号:</view>
						<view class="t-a-c">{{ item.StyleNo }}</view>
					</view>
					<view class="row jc-b my line">
						<view class="line-head">客户:</view>
						<view class="t-a-c">{{ item.CustomerName }}</view>
					</view>
					<view class="row jc-b my line">
						<view class="line-head">针种:</view>
						<view class="t-a-c">{{ item.PinType }}</view>
					</view>
					<view class="row jc-b my line">
						<view class="line-head">交期:</view>
						<view class="t-a-c">{{ new Date(item.DeliveryTime).format('yyyy-MM-dd') }}</view>
					</view>
					<view class="row jc-b my line">
						<view class="line-head">完工工序:</view>
						<view class="t-a-c">{{ item.EndProcess || '' }}</view>
					</view>
					<view class="row jc-b my line">
						<view class="line-head">数量:</view>
						<view class="t-a-c">{{ item.Qty }}</view>
					</view>
					<view class="row jc-b my line">
						<view class="line-head">备注:</view>
						<view class="t-a-c">{{ item.Remark || '' }}</view>
					</view>
				</view>
			</block>
			<uni-load-more :status="more"></uni-load-more>
		</scroll-view>
		<view class="info-bar info fixed row jc-b a-i white" :style="{ bottom: bottomSafeArea + 'px' }">
			<view>当前第{{ page + 1 }}页</view>
			<view style="justify-self: flex-end;">共{{ allData.length }}条记录</view>
		</view>
		<uni-drawer ref="drawer" :style="{ top: statusBarHeight + navBarHeight + 'px', bottom: bottomSafeArea + 'px' }" >
			<view class="drawer">
				<view class="drawer-content">
					<view><input placeholder="请输入款号" v-model="style" type="text" /></view>
					<view><input placeholder="请输入客户名称" v-model="custom" type="text" /></view>
					<view><input placeholder="请输入状态ID" v-model="status" type="number" /></view>
					<view class="switch row jc-b a-i">
						<view>版单标记:</view>
						<evan-switch v-model="checked" :size="30" class="evan-switch"></evan-switch>
					</view>
				</view>
				<view class="bottom-fixed cloumn jc-c">
					<button type="primary" @tap="reSearch({ style, custom, status, checked })">搜索</button>
					<button type="default" @tap="reset">清空</button>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sourceData: [],
			allData: [],
			page: 0,
			pageSize: 20,
			more: 'more',
			scrollHeight: 674,
			showSearch: false,
			value: [0],
			style: '', //输入内容 款号
			custom: '', // 输入内容客户
			status: null, // 状态id
			checked: false,
			statusBarHeight: 20,
			windowWidth: 375,
			navBarHeight: 44,
			bodyH: 768, //主体高度,
			bottomSafeArea: 44 // 底部安全区域高度
		}
	},
	computed: {
		length() {
			return this.allData.length
		}
	},
	watch: {
		page(newVal) {
			if (newVal * this.pageSize >= this.length) {
				this.more = 'noMore'
			}
		}
	},
	methods: {
		loadMore() {
			if (this.length > this.page * this.pageSize) {
				this.more = 'loading'
				setTimeout(() => {
					this.page += 1
					let start = this.page * this.pageSize
					let end = start + this.pageSize
					let temp = this.allData.slice(start, end)
					console.log(temp)
					this.sourceData = this.sourceData.concat(temp)
					this.more = 'more'
				}, 100)
			} else {
				this.more = 'noMore'
			}
		},
		// 返回tabbar
		goback() {
			uni.switchTab({
				url: '/pages/main/main'
			})
		},
		// 获得数据
		setData(para) {
			uni.showLoading({
				title:'请稍后'
			})
			this.$api.QueryMO(para).then(res => {
				if (res.data.success === true) {
					console.log('查询成功')
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
		// 筛选
		select() {
			// 打开抽提
			this.$refs.drawer.open()
		},
		reSearch(e) {
			const { style, custom, status, checked } = e
			let para = {
				StyleNo: style,
				CustomerName: custom,
				IsSample: checked,
				StatusID: status
			}
			this.$refs.drawer.close()
			this.setData(para)
		},
		reset(){
			this.style = ''
			this.custom = ''
			this.status = ''
			this.checked = false
		}
	},
	mounted() {
		this.setData({})
	},
	created() {
		const stateBar = uni.getSystemInfoSync()
		console.log(stateBar)
		// 状态栏高度 + 导航栏高度 + 分页栏高度
		// this.scrollHeight = stateBar.screenHeight - stateBar.statusBarHeight - 44 - 50
		//页面的高度 = 100vh - 状态栏 - 导航栏 - 底部安全区
		//即
		this.statusBarHeight = stateBar.statusBarHeight
		this.windowWidth = stateBar.windowWidth
		// #ifdef MP-WEIXIN
		const capsule = uni.getMenuButtonBoundingClientRect()
		this.navBarHeight = capsule.bottom - this.statusBarHeight + capsule.top - this.statusBarHeight
		this.windowWidth = capsule.left
		// #endif
		//主体高度 = 屏幕高度 - 安全区高度(顶部+底部) - 导航栏高度
		this.bodyH = stateBar.screenHeight - stateBar.safeAreaInsets.top - stateBar.safeAreaInsets.bottom - this.navBarHeight - 44
		this.bottomSafeArea = stateBar.safeAreaInsets.bottom
	}
}
</script>

<style lang="scss" scoped>
.Container {
	width: 100%;
	box-sizing: border-box;

	.scroll-view {
		// overflow: hidden;
		// height: calc(100vh - 188rpx);
		box-sizing: border-box;
		// flex: 1;
		.items {
			margin: 10rpx;
			box-sizing: border-box;
			background-color: #ffffff;
			padding: 20rpx;
			box-shadow: 0 0 1px 1px #999;
			.line {
				.line-head {
					background-color: #47c8ff;
					width: 150rpx;
					text-align: center;
					align-self: flex-start;
					color: white;
				}
				.t-a-c {
					text-align: center;
					border-bottom: 1rpx grey solid;
				}
				view {
					width: 100%;
					color: black;
					min-width: 200rpx;
				}
				.a-r {
					text-align: right;
				}
			}
		}
	}
	.info-bar {
		box-sizing: border-box;
		padding: 20rpx;
		background-color: #47c8ff;
		height: 44px;
	}
	.fixed {
		position: fixed;
		left: 0;
		width: 100%;
		z-index: 10;
	}
	.drawer{
		display: flex;
		flex-direction: column;
	}
	.drawer-content {
		flex: 1;
		background-color: #c2c2c2;
		height: auto;
		box-sizing: border-box;
		padding: 20rpx;
		view {
			padding: 20rpx;
			input {
				background-color: #ffffff;
				text-align: center;
			}
		}
		.switch {
			padding: 0;
			.evan-switch {
				padding: 0;
			}
		}
	}
	.bottom-fixed {
		box-sizing: border-box;
		padding: 0 20rpx;
		width: 100%;
		position: fixed;
		bottom: 30rpx;
		button {
			width: 100%;
			margin-bottom: 10rpx;
		}
	}
}
</style>
