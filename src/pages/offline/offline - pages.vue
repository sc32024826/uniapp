<template>
	<view id="container">
		<view id="head">
			<view id="toolbar" class="flex center">
				<view class="dropdown">
					<picker @change="bindPickerChange" :value="index" :range="array">
						<view>选择工序: {{array[index]}}</view>
					</picker>
				</view>
				<checkbox-group @change="requestType">
					<label>
						<checkbox value="color" :checked="DoColor" />区分颜色
					</label>
					<label>
						<checkbox value="size" :checked="DoSize" />区分尺码
					</label>
				</checkbox-group>
			</view>
			<view id="title" class="flex row vertical-center">
				<checkbox-group @change="selectAll">
					<checkbox value="1" ref="selectAll"></checkbox>
				</checkbox-group>
				<view class="white" style="width: 400rpx;">生产单-款号-颜色-尺码</view>
				<view class="white" style="width: 80rpx;">线上</view>
				<view class="white" style="width: 100rpx;">下线数</view>
			</view>
		</view>

		<view id="list" class="uni-list">
			<checkbox-group @change="checkboxChange">
				<view v-if="!show">暂无数据</view>
				<view class="stripe" v-for="(item,i) in tableData" :key="i">
					<view class="flex row test vertical-center ">
						<checkbox :value="item.id" :checked="item.checked" />
						<view class="mo">
							<view>单号: {{item.MO}}</view>
							<view>款号: {{item.StyleNo}}</view>
							<view v-if="DoColor">颜色: {{item.ColorName}}</view>
							<view v-if="DoSize">尺码: {{item.SizeName}}</view>
						</view>
						<view class="count">{{item.Qty}}</view>
						<!-- <input placeholder="0" type="number" adjust-position :disabled=""></input> -->
						<view v-show="item.checked">XXX</view>
					</view>
				</view>
			</checkbox-group>
		</view>
		<view class="flex column bottom">
			<view class="PageBar flex row">
				<a @click="Currentpage -= 1" :disable="Currentpage = 0">上一页</a>
				{{Currentpage+1}}/{{pages}}
				<a @click="Currentpage += 1" :disable="Currentpage = pages">下一页</a>
			</view>
			<view class="flex row space">
				<button type="primary" size="mini" @click="offline">下线选中的衣服</button>
				<button type="primary" size="mini" @click="offlineByUser">按指定数量下线</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { RackOffline, getSeqNameList } from '@/api/api.js'
	import { SelectAll, SelectBySize, SelectByColor, SelectByColorSize, SetRackOfflineByZdOnlineGuid } from './classify.js'
	export default {
		data() {
			return {
				tableData: [],
				choose: [], // 选中的衣服衣架
				array: [],
				index: 0,
				SeqList: [],
				DoColor: true, //区分颜色
				DoSize: true, //区分尺码
				defalutData: [],
				Currentpage: 0,
				source: [], // 数据源
				perPage: 6 //每页显示数量
			}
		},
		methods: {
			// 全选 /全不选
			selectAll(e) {

				// 首先获取 选项列表 即 tabledata
				if (e.target.value.length > 0) {
					this.source.map(v => {
						v.checked = true
					})
					console.log(this.source)
				} else {
					this.source.map(v => {
						v.checked = false
					})
				}
			},
			// 区分尺码 区分颜色
			requestType(e) {
				let param = e.detail.value
				param.indexOf('size') > -1 ? this.DoSize = true : this.DoSize = false
				param.indexOf('color') > -1 ? this.DoColor = true : this.DoColor = false
				this.getDate()
			},
			// 勾选列表行
			checkboxChange(e) {

				var choose = e.target.value || []
				this.source.map((v, k) => {
					if (choose.indexOf(k.toString()) > -1) {
						v.checked = true
					} else {
						v.checked = false
					}
				})
				this.isAllSelect()
				console.log(this.source);
			},
			offline() {
				var ids = []
				var qty = 0
				// var styles = []
				this.source.map(v => {
					if (v.checked) {
						ids = ids.concat(v.list)
						qty += v.Qty
						// styles.push(v.MO)
					}
				})
				if (ids.length == 0) {
					uni.showModal({
						content: '您没有选择任何项目',
						showCancel: false
					})
				} else {
					// styles = styles.toString().replace(/,/g, '\n')
					uni.showModal({
						title: '确认下线',
						// content: styles + '\n' + '共计 ' + qty.toString() + ' 件',
						content: '共计 ' + qty.toString() + ' 件',
						success: (res) => {
							if (res.confirm) {
								this.offlineConfirm(ids, qty)
							}
						}
					})
				}
				// uni.showModal({
				// 	content: '下线id为' + this.choose,
				// 	showCancel: false
				// })
			},
			offlineByUser() {

			},
			// 重新刷新表数据 
			getDate() {
				if (this.defalutData.length > 0) {
					// this.$refs.selectAll.checked = false
					// if (this.DoColor) {
					// 	if (this.DoSize) {
					// 		this.tableData = SelectByColorSize(this.defalutData)
					// 	} else {
					// 		this.tableData = SelectByColor(this.defalutData)
					// 	}
					// } else if (this.DoSize) {
					// 	this.tableData = SelectBySize(this.defalutData)
					// } else {
					// 	this.tableData = SelectAll(this.defalutData)
					// }
				} else {
					uni.showModal({
						content: '请求错误,请选则工序!',
						showCancel: false
					})
				}
			},
			async bindPickerChange(e) {
				this.index = e.target.value
				let SeqCode = this.SeqList[e.target.value].value
				uni.showLoading({
					title: '正在请求数据!'
				})
				var [err, res] = await RackOffline(SeqCode)
				if (err) {
					uni.showModal({
						content: err.toString()
					})
				} else {
					let data = res.data.response
					
					var result = []
					if (this.DoColor) {
						if (this.DoSize) {
							result = SelectByColorSize(data)
						} else {
							result = SelectByColor(data)
						}
					} else if (this.DoSize) {
						result = SelectBySize(data)
					} else {
						result = SelectAll(data)
					}
				}
				this.source = result
				let start = this.Currentpage * this.perPage
				let end = this.Currentpage * this.perPage + this.perPage

				console.log('start ' + start, 'end ' + end);
				this.tableData = result.slice(start, end)

				uni.hideLoading()
			},
			// 每次勾选操作之后 都需要判断一次 是否是都选择了,若是 则勾选 全选 若否 不勾选全选
			isAllSelect() {
				// 总条目数
				let length = this.source.length
				// 勾选的数量
				var count = 0
				this.source.map(v => {
					v.checked == true ? count++ : count
				})

				if (count == length) {
					this.$refs.selectAll.checked = true
				} else {
					this.$refs.selectAll.checked = false
				}
			},
			// 确认下线
			async offlineConfirm(list, qty) {
				let param = {
					zdOnlineGuids: list,
					seqCode: this.SeqList[this.index].value,
					qty: qty
				}
				console.log(param)
				// var [err, res] = await SetRackOfflineByZdOnlineGuid(param)
				// if (err) {
				// 	uni.showModal({
				// 		content: err
				// 	})
				// } else {
				// 	uni.showModal({
				// 		content: res
				// 	})
				// }
			}
		},
		// 下拉刷新
		// async onPullDownRefresh() {
		// 	await this.getDate()
		// 	uni.stopPullDownRefresh();
		// },
		async created() {
			uni.showLoading({
				title: '正在请求数据!'
			})
			var [err, res] = await getSeqNameList()
			if (err) {
				uni.showModal({
					content: err.toString(),
					showCancel: false
				})
			} else {
				let obj = res.data.response
				this.SeqList = obj
				for (let { label, value } of obj) {
					this.array.push(label)
				}
				uni.hideLoading()
			}
		},
		computed: {
			show() {
				if (this.tableData) {
					return this.tableData.length > 0 ? true : false
				} else {
					return false
				}
			},
			totallines() {
				console.log(this.source.length);
				return this.source.length
			},
			pages() {
				return Math.ceil(this.totallines / this.perPage)
			}
		}
	}
</script>

<style lang="less" scoped>
	#container {
		width: 100%;
		text-align: center;
		// border: solid 1rpx red;

		#head {
			// position: fixed;
			// top: 0;
			width: 100%;
			background-color: white;
			z-index: 2;

			#toolbar {
				margin: 5rpx;
			}
		}

		#list {
			// height: 80%;
		}

		.bottom {
			position: fixed;
			bottom: 30rpx;
			width: 100%;
			z-index: 2;
			border-top: solid 1rpx grey;
			padding-top: 15rpx;

			.space {
				margin-top: 15rpx;
				justify-content: space-around;
			}
		}
	}



	//
	.test {
		// border: solid 1px red;
		justify-content: space-around;
		min-height: 80rpx;
		margin-bottom: 10rpx;

		view {
			// border: solid 1rpx red;
		}

		.mo {
			width: 400rpx;
			// overflow: hidden;
			display: flex;
			flex-direction: column;
			justify-content: center;
			// text-overflow: ellipsis;
		}

		.count {
			width: 80rpx;
		}
	}

	input {
		border: solid 1px grey;
		width: 100rpx;
	}

	//


	.flex {
		display: flex;
	}

	.row {
		flex-direction: row;
		justify-content: space-around;
	}

	.column {
		flex-direction: column;
	}

	.center {
		justify-content: center;

	}

	.vertical-center {
		align-items: center; // 垂直居中
	}



	#title {
		height: 80rpx;
		background-color: #53B4DF;
		margin-bottom: 20rpx;

		view {
			// border: solid 1rpx red;
		}
	}

	.white {
		color: white;
	}

	.stripe:nth-child(even) {
		background: #273238;
		color: white;
	}

	.debug {
		border: solid 1rpx red;
	}

	.dropdown {
		margin-right: 10rpx;
	}
</style>
