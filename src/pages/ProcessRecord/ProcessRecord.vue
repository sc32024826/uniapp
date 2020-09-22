<template>
	<view class="container">
		<sc-nav left title="加工记录" @goBack="goback"></sc-nav>
		<view class="column top" v-if="haveScaned">
			<view class="column margin">
				<view class="row between">
					<view @tap="finishRack(RackCode)">
						衣架号:{{ RackCode }}
						<text>&#xe679;</text>
					</view>
					<view v-if="Status == 3" class="red debug">已完成</view>
					<view v-if="Status == 4" class="red debug">已完成4</view>
					<view v-if="Status == 2" class="red debug">站内</view>
				</view>
				<view v-if="Mo">
					<view>生产单:{{ Mo }}</view>
				</view>
				<view v-if="Mo">款色码:{{ StyleID }} - {{ Color }} - {{ SizeName }}</view>
				<view v-if="Mo" @tap="showList">
					数量:{{ Qty }}
					<text>&#xe679;</text>
				</view>
				<view class="row" v-if="Mo">
					<view class="currentSeq">当前工序:{{ SeqCode }}-{{ SeqName }}</view>
					<view class="currentCustation">当前站:{{ CurrentWorkLine }}-{{ CurrentStationID }}</view>
				</view>
			</view>
		</view>
		<view class="row button-area">
			<button type="primary" @tap="nextScan">
				<text class="iconfont">&#xe6e5;</text>
				扫码
			</button>
			<button type="primary" @tap="inputHand">
				<text class="iconfont">&#xe601;</text>
				手输
			</button>
		</view>
		<view class="table">
			<view class="row primary white bd">
				<view class="cell column station">站号</view>
				<view class="column name">
					<view class="cell column">工号</view>
					<view class="cell column">姓名</view>
				</view>
				<view class="cell column time">时间</view>
				<view class="cell column type">类型</view>
				<view class="cell column seq">工序</view>
				<view class="cell column count" @tap="showList">数量</view>
			</view>
			<view class="data">
				<uni-collapse>
					<block v-for="(item, key) in tableData" :key="key">
						<uni-collapse-item :open="isOpen(item.RackCode)" :title="title(key, item.RackCode)" :class="[item.RackCode == RackCode ? 'item' : '']">
							<view v-for="(v, k) in item.ProcessRecords" :key="k">
								<view :class="[v.RecordType == '进站' ? 'light row white' : 'row']">
									<view class="cell column station">{{ v.StationID }}</view>
									<view class="column name">
										<view class="cell column">{{ v.EmployeeID }}</view>
										<view class="cell column">{{ v.Name }}</view>
									</view>
									<view class="cell column time">{{ v.Timestamp }}</view>
									<view class="cell column type">{{ v.RecordType }}</view>
									<view class="column seq">
										<view class="cell column">{{ v.SeqCode }}</view>
										<view class="cell column">{{ v.SeqName }}</view>
									</view>
									<view class="cell column count">{{ v.Qty }}</view>
								</view>
							</view>
						</uni-collapse-item>
					</block>
				</uni-collapse>
			</view>
		</view>
		<view v-show="inputByHand" class="modal row">
			<view class="mask">
				<text>手动输入衣架号</text>
				<input type="number" placeholder="衣架号" v-model="RackCodeHD" />
				<view>
					<button type="default" size="mini" @tap="closeModal">取消</button>
					<button type="primary" size="mini" @tap="submit">提交</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
import ISO8601 from './dateFormat.js'
export default {
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
			RackCodeHD: ''
		}
	},
	onLoad(options) {
		if (options.code) {
			this._requestAwait(options.code)
		} else {
			this.scanCode()
		}
	},
	methods: {
		scanCode() {
			let _this = this
			// #ifdef H5
			let env = dd.env.platform
			if (env != 'notInDingTalk') {
				dd.biz.util.scan({
					type: 'all', // type 为 all、qrCode、barCode，默认是all。
					onSuccess: function(data) {
						_this._requestAwait(data.text)
					},
					onFail: function(err) {
						uni.showModal({
							content: err,
							showCancel: false
						})
					}
				})
			} else {
				uni.showModal({
					content: '当前平台无法开启扫码功能!',
					showCancel: false
				})
			}
			// #endif

			// #ifdef MP-WEIXIN
			wx.scanCode({
				onlyFromCamera: true,
				success(res) {
					uni.showLoading({
						title: '请稍后'
					})
					_this._requestAwait(res.result)
				},
				fail(err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				}
			})
			// #endif
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
			this.$api.QueryProcessingHistoryByRackCode(Rackcode).then(res => {
				let target = res.data.response
				if (target != null) {
					this.haveScaned = true
					// console.log(target)
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
							let temp = ISO8601(item.Timestamp)
							item.Timestamp = new Date(temp).format('yyyy-MM-dd HH:mm:ss')
						})
					})
					this.tableData = target.RackProcessingHistory
					this.BarCodes = target.BarCodes
				}
			})
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
					success: res => {
						if (res.confirm) {
							this.confirmFinish(RackCode)
						}
					}
				})
			}
		},
		confirmFinish(RackCode) {
			this.$api.doneRack(RackCode).then(res => {
				this.refreshStatus(RackCode)
			})
		},
		// 刷新获取status
		async refreshStatus(RackCode) {
			this.$api.QueryProcessingHistoryByRackCode(RackCode).then(res => {
				let target = res.data.response
				this.Status = target.Status
			})
		},
		inputHand() {
			this.inputByHand = true
		},
		closeModal() {
			this.inputByHand = false
		},
		submit() {
			this._requestAwait(this.RackCodeHD)
			this.inputByHand = false
			this.RackCodeHD = ''
			this.haveScaned = true
		},
		goback() {
			uni.switchTab({
				url: '/pages/main/main'
			})
		},
		showHelp() {
			this.helpView = !this.helpView
		}
	}
}
</script>

<style lang="less" scoped>
.container {
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	.button-area {
		width: 100%;
		padding: 10rpx;
	}

	.button-area button {
		width: 40%;
	}

	.modal {
		position: fixed;
		top: 0;
		z-index: 10;
		width: 100%;
		height: 100vh;
		background-color: rgba(201, 201, 201, 1);
		opacity: 95%;

		.mask {
			margin-top: 10vh;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border-radius: 10rpx;
			border: solid 2rpx #e3e3e3;
			width: 90vw;
			height: 400rpx;
			margin-left: 5vw;

			text {
				margin: 10rpx;
			}

			input {
				width: 50%;
				height: 15%;
				background-color: white;
				border-radius: 10rpx;
				text-align: center;
			}

			view {
				width: 80%;
				display: flex;
				justify-content: space-between;
			}

			button {
				width: 40%;
				margin: 30rpx 10rpx 10rpx 10rpx;
			}
		}
	}
}

.cell {
	justify-content: center;
	border: solid 1rpx #c9c9c9;
	min-height: 50rpx;
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
	width: 32%;
	white-space: pre-wrap;
}

// 类型格
.type {
	width: 10%;
}

// 工序
.seq {
	width: 15%;
}

// 数量
.count {
	width: 11%;
}

.light {
	background: #00aaff;
}

.red {
	color: red;
}

.top {
	font-size: 40rpx;
}

.currentSeq {
	flex-grow: 1;
}

.currentCustation {
	flex-grow: 2;
}

.item {
	border: solid 1rpx #c9c9c9;
	background-color: white;
}

.help {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	z-index: 2;

	image {
		margin-top: 44px;
		width: 100%;
		height: 100%;
	}
}
</style>
