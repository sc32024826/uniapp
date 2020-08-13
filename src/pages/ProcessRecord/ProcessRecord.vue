<template>
	<view id="main">
		<view class="flex column top" v-if="haveScaned">
			<view class="flex column margin">
				<view class="flex row space">
					<view @click="finishRack(RackCode)">衣架号:{{RackCode}}
						<uni-icons type="info-filled" size="20" v-if="RackCode"></uni-icons>
					</view>
					<view v-if="Status == 3" class="red debug">已完成</view>
					<view v-if="Status == 4" class="red debug">已完成4</view>
					<view v-if="Status == 2" class="red debug">站内</view>
				</view>
				<view v-if="Mo">
					<view>生产单:{{Mo}}</view>
				</view>
				<view v-if="Mo">款色码:{{StyleID}} - {{Color}} - {{SizeName}}</view>
				<view v-if="Mo" @click="showList">数量:{{Qty}}
					<uni-icons type="info-filled" size="20"></uni-icons>
				</view>
				<view class="flex row" v-if="Mo">
					<view class="currentSeq">当前工序:{{SeqCode}}-{{SeqName}}</view>
					<view class="currentCustation">当前站:{{CurrentWorkLine}}-{{CurrentStationID}}</view>
				</view>
			</view>
		</view>
		<view class="flex row button-area">
			<button type="primary" @click="nextScan">扫码</button>
			<button type="primary" @click="inputHand">手输</button>
		</view>
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
					<block v-for="(item,key) in tableData" :key="key">
						<uni-collapse-item :open="isOpen(item.RackCode)" :title="title(key,item.RackCode)" :class="[item.RackCode==RackCode?'item':'']">
							<view v-for="(v,k) in item.ProcessRecords" :key="k">
								<view :class="[v.RecordType == '进站' ? 'light' : 'flex row']">
									<view class="cell station">{{v.StationID}}</view>
									<view class="flex column name">
										<view class="cell">{{v.EmployeeID}}</view>
										<view class="cell">{{v.Name}}</view>
									</view>
									<view class="cell time">{{v.Timestamp}}</view>
									<view class="cell type">{{v.RecordType}}</view>
									<view class="flex column seq">
										<view class="cell">{{v.SeqCode}}</view>
										<view class="cell">{{v.SeqName}}</view>
									</view>
									<view class="cell count">{{v.Qty}}</view>
								</view>
							</view>
						</uni-collapse-item>
					</block>
				</uni-collapse>
			</view>
		</view>
		<view id="modal" v-show="inputByHand">
			<view id="mask">
				<text>手动输入衣架号</text>
				<input type="number" placeholder="衣架号" v-model="RackCodeHD" />
				<view >
					<button type="default" size="mini" @click="closeModal">取消</button>
					<button type="primary" size="mini" @click="submit">提交</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as dd from "dingtalk-jsapi"
	import { dateFormat, ISO8601 } from "./dateFormat.js"
	import { QueryProcessingHistoryByRackCode, doneRack } from '@/api/api.js'
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
				Status: -1,
				SeqName: '', //工序
				SeqCode: '', //工序号
				CurrentWorkLine: '', //线
				CurrentStationID: '', //站
				RackCode: '', //衣架号
				Qty: '',
				haveScaned: false,
				BarCodes: [],
				inputByHand: false,
				RackCodeHD:''
			}
		},
		onLoad: function() {
			this.scanCode()
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
						
					}
				}).catch(e=>{
					console.log(e)
				})
			},
			// 继续下个扫码
			nextScan() {
				this.tableData = []
				this.Color = ''
				this.StyleID = ''
				this.SizeName = ''
				this.Mo = ''
				this.Status = -1
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
					this.Status = target.Status
					this.RackCode = target.RackCode
					target.RackProcessingHistory.forEach(e => {
						e.ProcessRecords.forEach(item => {
							// 站号处理
							item.StationID = item.LineID + '-' + item.StationID
							// 类型处理
							item.RecordType = item.RecordType == 3 ? '出站' : '进站'
							let temp = new Date(ISO8601(item.Timestamp))
							item.Timestamp = dateFormat("YYYY-mm-dd HH:MM:SS", temp)
						})
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
			// 控制title 显示
			title(key, rack) {
				let no = key + 1
				return '衣架' + no + ': ' + rack.toString()
			},
			// 控制折叠框 是否打开
			isOpen(rack) {
				if (rack.toString() == this.RackCode) {
					return true
				}
			},
			// 设置衣架完成
			finishRack(RackCode) {
				if (RackCode) {
					uni.showModal({
						title: '警告',
						content: '确认设置衣架号 ' + RackCode + ' 为已完成',
						confirmColor: 'RED',
						success: (res) => {
							if (res.confirm) {
								this.confirmFinish(RackCode)
							}
						}
					})
				}
			},
			async confirmFinish(RackCode) {
				const [err, res] = await doneRack(RackCode)
				if (err) {
					uni.showModal({
						content: err
					})
				} else {
					this.refreshStatus(RackCode)
				}
			},
			// 刷新获取status
			async refreshStatus(RackCode) {
				const [err, res] = await QueryProcessingHistoryByRackCode(RackCode)
				if (!err) {
					let target = res.data.response
					this.Status = target.Status
				}
			},
			inputHand() {
				this.inputByHand = true
			},
			closeModal(){
				this.inputByHand = false
			},
			submit(){
				this._requestAwait(this.RackCodeHD)
				this.inputByHand = false
				this.RackCodeHD = ''
			}
		}
	}
</script>

<style lang="less" scoped>
	@import url("./style.less");
</style>
