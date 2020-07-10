<template>
	<view id="main">
		<view class="flex column top" v-if="haveScaned">
			<view class="flex column margin">
				<view class="flex row space">
					<view>衣架号:{{RackCode}}</view>
					<view v-if="IsFinished" class="red">该衣架已经完成加工</view>
				</view>
				<view v-if="Mo">
					<view>生产单:{{Mo}}</view>
				</view>
				<view v-if="Mo">款色码:{{StyleID}} - {{Color}} - {{SizeName}}</view>
				<view v-if="Mo" @click="showList">数量:{{Qty}}(...)</view>
				<view class="flex row" v-if="Mo">
					<view class="currentSeq">当前工序:{{SeqCode}}-{{SeqName}}</view>
					<view class="currentCustation">当前站:{{CurrentWorkLine}}-{{CurrentStationID}}</view>
				</view>
			</view>
		</view>
		<button class="margin" type="primary" @click="nextScan" disabled="true">继续扫码</button>
		<view class="table">
			<view class="flex row head">
				<view class="cell station">站号</view>
				<view class="flex column name">
					<view class="cell">工号</view>
					<view class="cell">姓名</view>
				</view>
				<view class="cell time">时间</view>
				<view class="cell type">类型</view>
				<view class="cell seq">工序</view>
				<view class="cell count" @click="showList">数量</view>
			</view>
			<view class="data">
				<uni-collapse>
					<uni-collapse-item v-for="(item,key) in tableData" :key="key" title="衣架号" open="true" >
						<view class="flex row">
								<view class="cell station">{{item.StationID}}</view>
							<view class="flex column name">
								<view class="cell">{{item.EmployeeID}}</view>
								<view class="cell">{{item.Name}}</view>
							</view>
							<view class="cell time">{{item.Timestamp}}</view>
							<view class="cell type">{{item.RecordType}}</view>
							<view class="flex column seq">
								<view class="cell">{{item.SeqCode}}</view>
								<view class="cell">{{item.SeqName}}</view>
							</view>
							<view class="cell count">{{item.Qty}}</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				<!-- 	<view v-for="(item,key) in tableData" :key="key" :class="fn(item.RecordType)">
					<view class="flex row">
						<view class="flex column station"> 
						<view class="cell station">{{item.StationID}}</view>
					 </view> 
						<view class="flex column name">
							<view class="cell">{{item.EmployeeID}}</view>
							<view class="cell">{{item.Name}}</view>
						</view>
						<view class="cell time">{{item.Timestamp}}</view>
						<view class="cell type">{{item.RecordType}}</view>
						<view class="flex column seq">
							<view class="cell">{{item.SeqCode}}</view>
							<view class="cell">{{item.SeqName}}</view>
						</view>
						<view class="cell count">{{item.Qty}}</view>
					</view>
				</view> -->
			</view>
		</view>
		<button class="margin" type="primary" @click="direct">手动模式</button>
	</view>
</template>

<script>
	import * as dd from "dingtalk-jsapi"
	import { dateFormat, ISO8601 } from "../ProcessRecord/dateFormat.js"
	import { QueryProcessingHistoryByRackCode } from '@/api/api.js'
	import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'
	
	export default {
		components: { uniCollapse, uniCollapseItem },
		data() {
			return {
				tableData: [],
				Color: '', //颜色
				StyleID: '', //款号
				SizeName: '', //尺码
				Mo: '', // 生产单
				IsFinished: false, //已经完成
				SeqName: '', //工序
				SeqCode: '', //工序号
				CurrentWorkLine: '', //线
				CurrentStationID: '', //站
				RackCode: '', //衣架号
				Qty: '',
				haveScaned: true,
				BarCodes: []
			}
		},
		onLoad: function() {
			// this.scanCode()
		},
		methods: {
			scanCode() {
				let _this = this
				dd.biz.util.scan({
					type: "all", // type 为 all、qrCode、barCode，默认是all。
					onSuccess: function(data) {
						_this.haveScaned = true
						_this._requestAwait(data.text)
					},
					onFail: function(err) {
						uni.switchTab({
							url: '../main/main'
						})
					}
				})
			},
			// 继续下个扫码
			nextScan() {
				this.tableData = []
				this.Color = ''
				this.StyleID = ''
				this.SizeName = ''
				this.Mo = ''
				this.IsFinished = false
				this.SeqName = ''
				this.SeqCode = ''
				this.CurrentWorkLine = ''
				this.CurrentStationID = ''
				this.RackCode = ''
				this.Qty = ''
				this.haveScaned = false
				this.BarCodes = []

				this.scanCode()
			},
			async _requestAwait(Rackcode) {
				const [err, res] = await QueryProcessingHistoryByRackCode(Rackcode)
				if (err) {
					console.log(err)
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
				} else {
					let target = res.data.response
					this.Qty = target.Qty
					this.Mo = target.Mo
					this.Color = target.Color
					this.StyleID = target.StyleID
					this.SizeName = target.SizeName
					this.SeqName = target.SeqName
					this.SeqCode = target.SeqCode
					this.CurrentWorkLine = target.CurrentWorkLine
					this.CurrentStationID = target.CurrentStationID
					this.IsFinished = target.IsFinished
					this.RackCode = target.RackCode
					target.RackProcessingHistory.forEach(e => {
						// 站号处理
						e.StationID = e.LineID + '-' + e.StationID
						// 类型处理
						e.RecordType = e.RecordType == 3 ? '出站' : '进站'
						let temp = new Date(ISO8601(e.Timestamp))
						e.Timestamp = dateFormat("YYYY-mm-dd HH:MM:SS", temp)
					})
					this.tableData = target.RackProcessingHistory
					this.BarCodes = target.BarCodes
				}
			},
			// 显示条码列表
			showList() {
				let list = this.BarCodes.toString()
				let res = list.replace(/,/g, '\n')
				uni.showModal({
					title: '条码列表',
					content: res,
					showCancel: false
				})
			},
			// 根据type 返回css样式名
			fn(type) {
				return type == '进站' ? 'light' : ''
			},
			async direct() {
				const [err, res] = await QueryProcessingHistoryByRackCode(8639003)
				if (err) {
					console.log(err)
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
				} else {
					let target = res.data.response
					this.Qty = target.Qty
					this.Mo = target.Mo
					this.Color = target.Color
					this.StyleID = target.StyleID
					this.SizeName = target.SizeName
					this.SeqName = target.SeqName
					this.SeqCode = target.SeqCode
					this.CurrentWorkLine = target.CurrentWorkLine
					this.CurrentStationID = target.CurrentStationID
					this.IsFinished = target.IsFinished
					this.RackCode = target.RackCode
					target.RackProcessingHistory.forEach(e => {
						// 站号处理
						e.StationID = e.LineID + '-' + e.StationID
						// 类型处理
						e.RecordType = e.RecordType == 3 ? '出站' : '进站'
						let temp = new Date(ISO8601(e.Timestamp))
						e.Timestamp = dateFormat("YYYY-mm-dd HH:MM:SS", temp)
					})
					this.tableData = target.RackProcessingHistory
					this.BarCodes = target.BarCodes
				}
			}
		}
	}
</script>

<style>
	@import url('../ProcessRecord/style.less');
</style>
