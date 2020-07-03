<template>
	<view id="main">
		<view class="flex column" v-if="haveScaned">
			<view class="flex column ">
				<view>衣架号:{{RackCode}}</view>
				<view v-if="!IsFinished">
					<view>生产单:{{Mo}}</view>
				</view>
				<view class="flex row border" v-if="!IsFinished">
					<view class="Column_item">款号:{{StyleID}}</view>
					<view class="Column_item">颜色:{{Color}}</view>
					<view class="Column_item">尺码:{{SizeName}}</view>
					<view class="Column_item">数量:{{Qty}}</view>
				</view>
				<view class="flex row" v-if="!IsFinished">
					<view class="Column_half">当前工序:{{SeqCode}}-{{SeqName}}</view>
					<view class="Column_half">当前站:{{CurrentWorkLine}}-{{CurrentStationID}}</view>
				</view>
			</view>
		</view>
		<button type="primary" @click="showList">显示条码列表</button>
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
				<view v-for="(item,key) in tableData" :key="key" :class="fn(item.RecordType)">
					<view class="flex row">
						<!-- <view class="flex column station"> -->
						<view class="cell station">{{item.StationID}}</view>
						<!-- </view> -->
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
				</view>
			</view>

		</view>

		<button type="primary" @click="dircted">手动模式</button>
	</view>
</template>

<script>
	import * as dd from "dingtalk-jsapi"
	import { dateFormat, ISO8601 } from "../ProcessRecord/dateFormat.js"
	export default {
		components: {},
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
			dircted() {
				this._requestAwait(9117464)
			},
			async _requestAwait(Rackcode) {
				const [err, res] = await uni.request({
					url: "http://test-api.servers.mchains.cn/api/MESInterfaces/QueryProcessingHistoryByRackCode",
					data: {
						"Rackcode": Rackcode
					},
					header: {
						"Content-Type": "application/json; charset=utf-8"
					}
				});
				if (err) {
					console.log(err)
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
				} else {
					let target = res.data.response

					if (target.IsFinished) {
						this.Qty = target.Qty
						this.Mo = target.Mo
						this.Color = target.Color
						this.StyleID = target.StyleID
						this.SizeName = target.SizeName
						this.SeqName = target.SeqName
						this.SeqCode = target.SeqCode
						this.CurrentWorkLine = target.CurrentWorkLine
						this.CurrentStationID = target.CurrentStationID
					}
					this.IsFinished = target.IsFinished
					this.RackCode = target.RackCode
					target.RackProcessingHistory.forEach(e => {
						// 站号处理
						e.StationID = e.LineID + '-' + e.StationID
						// 类型处理
						e.RecordType = e.RecordType == 3 ? '出站' : '进站'
						// 工序处理
						// e.SeqCode = e.SeqCode + '-' + e.SeqName
						// 时间格式处理
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
			}
		}
	}
</script>

<style scoped lang="less">
	#main {
		width: 100%;
	}

	.flex {
		display: flex;
	}

	.row {
		flex-direction: row;
	}

	.border {
		justify-content: space-between;
	}

	.column {
		flex-direction: column;
	}

	.Column_item {
		// border: solid 1px #DCDEE2;
	}

	.Column_half {
		width: 50%;
		// border: solid 1px #DCDEE2;
	}

	.head {
		background-color: #F8F8F9;
	}

	.cell {
		display: flex;
		flex-direction: column;
		justify-content: center;
		border: solid 1px #DCDEE2;
	}

	.table {
		text-align: center;
	}

	//站号格
	.station {
		width: 16%;
	}

	// 姓名格
	.name {
		width: 16%;
	}

	// 时间格
	.time {
		width: 35%;
	}

	// 类型格
	.type {
		width: 10%;
	}

	// 工序
	.seq {
		width: 12%;
	}

	// 数量
	.count {
		width: 11%;
	}

	// .tableLine:nth-child(odd) {
	// 	background: white;
	// }

	// .tableLine:nth-child(even) {
	// 	background: #2DB7F5;
	// }
	.light {
		background: #2DB7F5;
	}
</style>
