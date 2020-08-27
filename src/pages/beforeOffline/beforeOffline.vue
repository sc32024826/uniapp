<template>
	<view id="container">
		<view id="head" class="head row between">
			<view>生产线</view>
			<view>衣架数</view>
			<view>衣服数</view>
			<view>负载率</view>
		</view>
		<view class="ProductLines" v-for="(v,i) in lines" :key="i">
			<view class="row between items">
				<view>生产线{{v.LineID}}</view>
				<view>{{v.NotFinishedRackQty}}</view>
				<view>{{v.ClothesQty}}</view>
				<view>{{Math.round(v.LoadRatio*100)}} % </view>
			</view>
		</view>
		<view class="sum row between">
			<view>合计:</view>
			<view>{{RackQty}}</view>
			<view>{{ClothesQty}}</view>
			<view></view>
		</view>
		<view id="details">
			<view class="row between head">
				<view id="seq" class="column">工序</view>
				<view class="grow2">
					<view id="online">在线</view>
					<view class="row between">
						<view>衣架数</view>
						<view>衣服数</view>
					</view>
				</view>
				<view class="grow2">
					<view id="in">站内</view>
					<view class="row between">
						<view>衣架数</view>
						<view>衣服数</view>
					</view>
				</view>
			</view>
			<view class="details row between" v-for="(v,i) in details" :key="i" @click="naviTo(v)">
				<view>{{v.SeqName}}</view>
				<view>{{v.OnlineCount}}</view>
				<view>{{v.OnlineQty}}</view>
				<view>{{v.InStationCount}}</view>
				<view>{{v.InStationQty}}</view>
			</view>
			<view class="row between yellow">
				<view>合计:</view>
				<view>{{OnlineCount}}</view>
				<view>{{OnlineQty}}</view>
				<view>{{InStationCount}}</view>
				<view>{{InStationQty}}</view>
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
			uni.showLoading({
				title: '加载中'
			})
			this.getData()
			this.showLineInfo()
			uni.hideLoading()
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
					// console.log(this.lines);
				}
			},
			async showLineInfo() {
				let [err, res] = await QueryQtyWithSeq()
				if (err) {

				} else {
					if (res.data.success) {
						this.details = res.data.response
						console.log(this.details);
					}
				}
			},
			// 页面跳转
			naviTo(obj) {
				uni.navigateTo({
					url: '/pages/offline/offline?SeqCode=' + obj.SeqCode + '&SeqName=' + obj.SeqName
				})
			}
		},
		computed: {
			ClothesQty() {
				let qty = 0
				this.lines.map(e => {
					qty += e.ClothesQty
				})
				return qty
			},
			RackQty() {
				let qty = 0
				this.lines.map(e => {
					qty += Number(e.NotFinishedRackQty)
				})
				return qty
			},
			InStationCount(){
				let qty = 0
				this.details.map(m=>{
					qty += m.InStationCount
				})
				return qty
			},
			InStationQty(){
				let qty = 0
				this.details.map(m=>{
					qty += m.InStationQty
				})
				return qty
			},
			OnlineCount(){
				let qty = 0
				this.details.map(m=>{
					qty += m.OnlineCount
				})
				return qty
			},
			OnlineQty(){
				let qty = 0
				this.details.map(m=>{
					qty += m.OnlineQty
				})
				return qty
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
				// border: solid 1rpx red;
			}
		}

		.ProductLines {
			.items {
				padding: 30rpx 10rpx 30rpx 10rpx;

				view {
					width: 100rpx;
				}
			}
		}

		.sum {
			padding: 10rpx;
			background-color: #ffff00;

			view {
				width: 100rpx;
			}
		}

		.ProductLines:nth-child(even) {}

		.ProductLines:nth-child(odd) {
			background-color: #bababa;
		}

		#details {
			padding-top: 20rpx;

			.head {
				background-color: #00aaff;
				padding: 10rpx;
				color: white;
				view{
					margin-left: 10rpx;
				}
				.grow2{
					flex-grow: 2;
				}
				#seq {
					width: 120rpx;
					justify-content: center;
				}

				#online {
					flex-grow: 2;
					text-align: center;
					border-bottom: solid 1rpx white;
				}

				#in {
					flex-grow: 2;
					text-align: center;
					border-bottom: solid 1rpx white;
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
			.yellow{
				background-color: #ffff00;
				padding:10rpx 20rpx 10rpx 20rpx;
			}

		}
	}
</style>
