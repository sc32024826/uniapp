<template>
	<view id="container">
		<view id="head" class="head flex row">
			<view>生产线</view>
			<view>未完成</view>
			<view>负载率</view>
			<view>衣服数</view>
		</view>
		<view class="ProductLines" v-for="(v,i) in lines" :key="i">
			<view class="flex row items">
				<view>生产线{{v.LineID}}</view>
				<view>{{v.NotFinishedRackQty}}</view>
				<view>{{Math.round(v.LoadRatio*100)}} % </view>
				<view>{{v.ClothesQty}}</view>
			</view>
		</view>
		<view id="details">
			<view class="flex row head">
				<view id="seq">工序</view>
				<view id="online">在线</view>
				<view id="in">站内</view>
			</view>
			<view class="details flex row" v-for="(v,i) in details" :key="i" @click="naviTo(v)">
				<view>{{v.SeqName}}</view>
				<view>{{v.OnlineCount}}</view>
				<view>{{v.OnlineQty}}</view>
				<view>{{v.InStationCount}}</view>
				<view>{{v.InStationQty}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { GetLineStatus, QueryQtyWithSeq } from '@/api/api.js'
	export default {
		data() {
			return {
				lines: [],
				details: []
			}
		},
		mounted() {
			this.getData()
			this.showLineInfo()
		},
		methods: {
			async getData() {
				let para = ''
				const [err, res] = await GetLineStatus(para)
				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					this.lines = res.data
					console.log(this.lines);
				}
			},
			async showLineInfo() {
				let [err, res] = await QueryQtyWithSeq()
				if (err) {

				} else {
					if (res.data.success) {
						this.details = res.data.response
					}
				}
			},
			// 页面跳转
			naviTo(obj){
				uni.navigateTo({
					url:'/pages/offline/offline?SeqCode='+ obj.SeqCode + '&SeqName=' + obj.SeqName
				})
			}
		}
	}
</script>

<style lang="less">
	#container {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		#head {
			background-color: #00aaff;
			color: white;
			padding: 10rpx;

			view {
				text-align: center;
				min-width: 60rpx;
			}
		}

		.head {}

		.ProductLines {
			.items {
				margin-right: 20rpx;
				margin-left: 10rpx;
				padding: 30rpx 0 30rpx 0;
			}
		}

		.ProductLines:nth-child(even) {}

		.ProductLines:nth-child(odd) {
			background-color: #bababa;
		}

		#details {
			// border-top: solid 5rpx black;
			padding-top: 20rpx;

			.head {
				background-color: #00aaff;
				padding: 10rpx;
				color: white;

				#seq {
					margin-left: 20rpx;
					width: 120rpx;
				}

				#online {
					flex-grow: 2;
					text-align: center;
				}

				#in {
					flex-grow: 2;
					text-align: center;
				}

			}

			.details {
				view {
					padding: 20rpx 0 20rpx 0;
					// border-left: solid 1rpx red;
					min-width: 120rpx;
					text-align: center;
				}
			}

			.details:nth-child(odd) {
				background-color: #00aa30;
				color: white;
			}

		}
	}

	.flex {
		display: flex;
	}

	.row {
		flex-direction: row;
		justify-content: space-between;
	}
</style>
