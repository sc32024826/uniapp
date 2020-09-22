<template>
	<view class="container">
		<sc-nav left title="生产线" @goBack="goback"></sc-nav>
		<view>
			<work-line :lines="lines"></work-line>
			<more-info :details="details"></more-info>
		</view>
	</view>
</template>

<script>
import WorkLine from '@/components/lines.vue'
import MoreInfo from '@/components/moreInfo.vue'
export default {
	components: {
		WorkLine,
		MoreInfo
	},
	data() {
		return {
			lines: [],
			details: [],
			hideLoading: 0
		}
	},
	watch: {
		hideLoading(newValue, oldValue) {
			if (newValue == 2) {
				uni.hideLoading()
				this.hideLoading = 0
			}
		}
	},
	methods: {
		// 生产线数据
		getLineData() {
			// console.log('请求数据')
			uni.showLoading({
				title: '请求数据'
			})
			this.$api.GetLineStatus().then(res=>{
				// console.log(res)
				this.lines = res.data.response
				this.hideLoading += 1
			})
		},
		// 第二部分的数据
		showLineInfo() {
			uni.showLoading({
				title: '请求数据'
			})
			this.$api.QueryQtyWithSeq().then(res=>{
				if (res.data.success) {
					this.details = res.data.response
					// console.log(res)
					this.hideLoading += 1
				}
			})
		},
		goback() {
			uni.switchTab({
				url: '/pages/main/main'
			})
		}
	},
	mounted() {
		this.getLineData()
		this.showLineInfo()
	},
	onPullDownRefresh() {
		this.lines = []
		this.details = []

		this.getLineData()
		this.showLineInfo()

		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 1000)
	}
}
</script>

<style lang="scss" scoped>
.container {
	// margin: 10rpx;
	width: 100%;

	.title {
		justify-content: space-around;
		padding: 10rpx;
	}
}
</style>
