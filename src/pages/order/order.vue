<template>
	<view class="Container">
		<sc-nav left title="生产单" @goBack="goback"><view @tap="select">筛选</view></sc-nav>
		<sc-select :visiable="showSearch" class="search"></sc-select>
		<view class="list">
			<scroll-view class="scroll" scroll-y @scrolltolower="loadMore" :style="{ height: scrollHeight + 'px' }">
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
			</scroll-view>
			<view class="info fixed row jc-b a-i white">
				<view>当前第{{ page + 1 }}页</view>
				<view style="justify-self: flex-end;">共{{ allData.length }}条记录</view>
			</view>
		</view>
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
			showSearch: false
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
				this.page += 1
				let start = this.page * this.pageSize
				let end = start + this.pageSize
				let temp = this.allData.slice(start, end)
				console.log(temp)
				this.sourceData = this.sourceData.concat(temp)
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
			this.$api.QueryMO(para).then(res => {
				if (res.data.success === true) {
					console.log('查询成功')
					this.allData = res.data.response
					this.sourceData = this.allData.slice(0, this.pageSize)
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
			let para = {
				StyleNo: '',
				CustomerName: '',
				IsSample: false,
				StatusID: ''
			}
			// 打开抽提
			this.showSearch = true
		}
	},
	mounted() {
		this.setData({})
	},
	created() {
		const info = uni.getSystemInfoSync()
		// 状态栏高度 + 导航栏高度 + 分页栏高度
		this.scrollHeight = info.screenHeight - info.statusBarHeight - 44 - 50
	}
}
</script>

<style lang="scss" scoped>
.Container {
	width: 100%;
	box-sizing: border-box;
	.search{
		z-index: 11;
	}
	.list {
		width: 100%;
		background-color: white;
		box-sizing: border-box;
		.info {
			box-sizing: border-box;
			padding: 20rpx;
			background-color: #47c8ff;
			height: 100rpx;
		}
		.fixed {
			position: fixed;
			left: 0;
			width: 100%;
			z-index: 10;
		}
		.scroll {
			overflow: hidden;
			height: calc(100vh - 188rpx);
			box-sizing: border-box;
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
	}
}
</style>
