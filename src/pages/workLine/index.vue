<template>
	<view class="container">
		<view>
			<work-line :lines="lines"></work-line>
			<more-info :details="details"></more-info>
		</view>
	</view>
</template>

<script>
	import { GetLineStatus, QueryQtyWithSeq } from '@/api/api.js'
	import WorkLine from './components/lines.vue'
	import MoreInfo from './components/moreInfo.vue'
	export default {
		components: {
			WorkLine,MoreInfo
		},
		data() {
			return {
				lines: [],
				details:[]
			}
		},
		mounted() {
			this.getLineData()
			this.showLineInfo()
		},
		methods: {
			// 生产线数据
			async getLineData() {
				let para = ''
				const [err, res] = await GetLineStatus(para)
				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					console.log(res);
					this.lines = res.data
				}
			},
			// 第二部分的数据
			async showLineInfo() {
				let [err, res] = await QueryQtyWithSeq()
				if (err) {
			
				} else {
					if (res.data.success) {
						this.details = res.data.response
						console.log(this.details);
					}
				}
			}
		},
		onLoad() {
			uni.startPullDownRefresh()
		},
		onPullDownRefresh() {
			this.lines = []
			this.details = []
			uni.showLoading({
				title: '加载中'
			})
			this.getLineData()
			this.showLineInfo()
			uni.hideLoading()
			setTimeout(()=>{
				uni.stopPullDownRefresh()
			},1000)
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		margin: 10rpx;
		width: 100%;

		.title {
			justify-content: space-around;
			padding: 10rpx;
		}
	}
</style>
