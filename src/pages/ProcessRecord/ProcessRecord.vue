<template>
	<view>
		<view class="flex column" v-if="haveScaned">
			<view class="flex column border">
				<view>衣架号:{{RackCode}}</view>
				<view class="border" v-if="!IsFinished">
					<view>生产单:{{Mo}}</view>
				</view>
				<view class="flex row border" v-if="!IsFinished">
					<view class="Column_item">款号:{{StyleID}}</view>
					<view class="Column_item">颜色:{{Color}}</view>
					<view class="Column_item">尺码:{{SizeName}}</view>
					<view class="Column_item">数量:{{Qty}}</view>
				</view>
				<view class="flex row border" v-if="!IsFinished">
					<view class="Column_item">当前工序:{{SeqCode}}-{{SeqName}}</view>
					<view class="Column_item">当前站:{{CurrentWorkLine}}-{{CurrentStationID}}</view>
				</view>
			</view>
			<view>
				<pl-table ref="plTable" :data="tableData" :row-height="rowHeight" size="mini" border stripe fit>
					<pl-table-column v-for="item in columns" :key="item.id" :prop="item.prop" :label="item.label" :width="item.width" />
				</pl-table>
			</view>
		</view>
		<!-- <button type="primary" @click="dircted">手动模式</button> -->
	</view>
</template>

<script>
	import * as dd from "dingtalk-jsapi"
	import { PlTable, PlTableColumn, PlxTableGrid, PlxTableColumn } from 'pl-table'
	import { dateFormat, ISO8601 } from "./dateFormat.js"
	var _self
	var page = 1
	export default {
		components: {
			PlTable,
			PlTableColumn
		},
		data() {
			return {
				log: '',
				rowHeight: 50,
				tableData: [],
				columns: [
					{ prop: 'StationID', label: '站号', width: '70' },
					{ prop: 'EmployeeID', label: '工号', width: '50' },
					{ prop: 'Name', label: '姓名', width: '59' },
					{ prop: 'Timestamp', label: '时间', width: '150' },
					{ prop: 'RecordType', label: '类型', width: '50' },
					{ prop: 'SeqCode', label: '工序', width: '90' },
					{ prop: 'Qty', label: '数量', width: '30' }
				],
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
				haveScaned: true
			}
		},
		onLoad: function() {
			this.scanCode()
		},
		methods: {
			selectable(row, index) {
				if (index === 1) {
					return false
				} else {
					return true
				}
			},
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

					if (!target.IsFinished) {
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
						e.SeqCode = e.SeqCode + '-' + e.SeqName
						// 时间格式处理
						let temp = new Date(ISO8601(e.Timestamp))
						e.Timestamp = dateFormat("YYYY-mm-dd HH:MM:SS", temp)
					})
					this.tableData = target.RackProcessingHistory
				}
			}
		}
	}
</script>

<style>
	.flex {
		display: flex;
	}

	.row {
		flex-direction: row;
		justify-content: space-between;
	}

	.column {
		flex-direction: column;
	}

	.border {
		margin: 1px;
	}

	.Column_item {}
</style>
