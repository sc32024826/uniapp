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
	import WorkLine from '@/components/lines.vue'
	import MoreInfo from '@/components/moreInfo.vue'
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
			// this.getLineData()
			// this.showLineInfo()
		},
		methods: {
			// 生产线数据
			async getLineData() {
				console.log('请求数据');
				uni.showLoading({
					title:'请求数据'
				})
				let para = ''
				const [err, res] = await GetLineStatus(para)
				if (err) {
					// uni.hideLoading()
					console.log(err);
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					// uni.hideLoading()
					console.log(res);
					this.lines = res.data
				}
			},
			// 第二部分的数据
			async showLineInfo() {
				uni.showLoading({
					title:'请求数据'
				})
				let [err, res] = await QueryQtyWithSeq()
				if (err) {
					console.log(err);
					// uni.hideLoading()
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					if (res.data.success) {
						this.details = res.data.response
						console.log(this.details);
						// uni.hideLoading()
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
			
			this.getLineData()
			this.showLineInfo()
			
			setTimeout(()=>{
				uni.stopPullDownRefresh()
			},1000)
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
