<template>
	<view id="container">
		<uni-nav-bar fixed status-bar>
			<view class="center">生产线</view>
			<view slot="left" @click="goback" class="icon-back">返回</view>
			<view slot="right"><text @tap="showHelp" class="marginR">&#xe677;</text></view>
		</uni-nav-bar>
		<view class="mx">

			<table class="table">
				<thead>
					<tr>
						<th>生产线</th>
						<th>衣架数</th>
						<th>衣服数</th>
						<th>负载率</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(v,i) in lines" :key="i">
						<td>生产线{{v.LineID}}</td>
						<td>{{v.NotFinishedRackQty}}</td>
						<td>{{v.ClothesQty}}</td>
						<td>{{Math.round(v.LoadRatio*100)}} % </td>
					</tr>
					<tr class="primary white">
						<td>合计</td>
						<td>{{RackQty}}</td>
						<td>{{ClothesQty}}</td>
						<td></td>
					</tr>
				</tbody>
			</table>
			<table class="table">
				<thead>
					<tr>
						<th rowspan='2'>工序</th>
						<th colspan='2'>在线</th>
						<th colspan='2'>站内</th>

					</tr>
					<tr>
						<th>衣架数</th>
						<th>衣服数</th>
						<th>衣架数</th>
						<th>衣服数</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(v,i) in details" :key="i" @click="naviTo(v)">
						<td>{{v.SeqName}}</td>
						<td>{{v.OnlineCount}}</td>
						<td>{{v.OnlineQty}}</td>
						<td>{{v.InStationCount}}</td>
						<td>{{v.InStationQty}}</td>
					</tr>
					<tr class="primary white">
						<td>合计</td>
						<td>{{OnlineCount}}</td>
						<td>{{OnlineQty}}</td>
						<td>{{InStationCount}}</td>
						<td>{{InStationQty}}</td>
					</tr>
				</tbody>
			</table>
		</view>
	</view>
</template>

<script>
	import { GetLineStatus, QueryQtyWithSeq } from '@/api/api.js'
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				lines: [],
				details: []
			}
		},
		onLoad() {
			uni.startPullDownRefresh()
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
			},
			goback() {
				uni.navigateBack({})
			},
			showHelp() {
				console.log('帮助')
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
			InStationCount() {
				let qty = 0
				this.details.map(m => {
					qty += m.InStationCount
				})
				return qty
			},
			InStationQty() {
				let qty = 0
				this.details.map(m => {
					qty += m.InStationQty
				})
				return qty
			},
			OnlineCount() {
				let qty = 0
				this.details.map(m => {
					qty += m.OnlineCount
				})
				return qty
			},
			OnlineQty() {
				let qty = 0
				this.details.map(m => {
					qty += m.OnlineQty
				})
				return qty
			}
		},
		onPullDownRefresh() {
			this.lines = []
			this.details = []
			uni.showLoading({
				title: '加载中'
			})
			this.getData()
			this.showLineInfo()
			uni.hideLoading()
			setTimeout(()=>{
				uni.stopPullDownRefresh()
			},1000)
		}
	}
</script>

<style lang="less">
	#container {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;

		.table {
			width: 100%;
			margin-bottom: 20rpx;
			th {
				color: white;
				font-size: 1.2em;
				background-color: #00aaff;
				padding-top: 10rpx;
				padding-bottom: 10rpx;
			}

			td {
				padding-top: 10rpx;
				padding-bottom: 10rpx;
			}
		}

		.table,
		th,
		td {

			border: solid 1rpx #00aaff;
		}
	}
</style>
