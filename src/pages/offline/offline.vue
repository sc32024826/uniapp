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
				<view class="white" style="width: 400rpx;">款号-颜色-尺码</view>
				<view class="white" style="width: 80rpx;">线上</view>
				<view class="white" style="width: 100rpx;">下线数</view>
			</view>
			<view class="errorMsg" v-if="showError">{{msg}}</view>
		</view>
		<view id="list" class="uni-list">
			<checkbox-group @change="checkboxChange">
				<view v-if="!show">暂无数据</view>
				<view class="stripe" v-for="(item,i) in tableData" :key="i">
					<view class="flex row test vertical-center ">
						<checkbox :value="item.id" :checked="item.checked" />
						<view class="flex row mo" @click="showFullInfo(item.MO,item.StyleNo,item.ColorName,item.SizeName)">
							<!-- <view>单号: {{item.MO}}</view> -->
							<view class="st">{{item.StyleNo}}</view>
							<view v-if="DoColor" class="co">{{item.ColorName}}</view>
							<view v-if="DoSize" class="si">{{item.SizeName}}</view>
						</view>
						<view class="count">{{item.Qty}}</view>
						<input placeholder="0" type="number" adjust-position :disabled="!item.checked" @input="verity($event,item.Qty)"
						 @blur="setUserQty($event,item.id)"></input>
					</view>
				</view>
			</checkbox-group>
		</view>
		<view class="flex row bottom">
			<button type="primary" size="mini" @click="offlineByUser">下线衣服</button>
			<!-- <button type="primary" size="mini" @click="offlineByUser">按指定数量下线</button> -->
		</view>
	</view>
</template>

<script>
	import { GetQtyOnlineMODCS, getSeqNameList, SetRackOfflineByZdOnlineGuid } from '@/api/api.js'
	import { SelectAll, SelectBySize, SelectByColor, SelectByColorSize } from './classify.js'
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				tableData: [],
				array: [],
				index: 2,
				SeqList: [],
				DoColor: true, //区分颜色
				DoSize: true, //区分尺码
				source: [],
				msg: '显示错误信息',
				showError: false
			}
		},
		methods: {
			...mapMutations(['setTempData']),
			// 全选 /全不选
			selectAll(e) {
				// 首先获取 选项列表 即 tabledata
				if (e.target.value.length > 0) {
					this.tableData.map(v => {
						v.checked = true
					})
				} else {
					this.tableData.map(v => {
						v.checked = false
					})
				}
			},
			// 区分尺码 区分颜色
			requestType(e) {
				let param = e.detail.value
				param.indexOf('size') > -1 ? this.DoSize = true : this.DoSize = false
				param.indexOf('color') > -1 ? this.DoColor = true : this.DoColor = false,
					this.getDate()
			},
			// 勾选列表行
			checkboxChange(e) {

				var choose = e.target.value || []
				this.tableData.map((v, k) => {
					if (choose.indexOf(k.toString()) > -1) {
						v.checked = true
					} else {
						v.checked = false
					}
				})
				this.isAllSelect()
			},
			// 下线选中的衣服
			offlineByUser() {
				var list = []
				var obj = {}
				var styles = new Set()
				this.tableData.map(v => {
					obj = {}
					if (v.checked) {
						styles.add(v.MO)
						obj.zdOnlineGuids = v.list
						obj.SeqCode = this.SeqList[this.index].value
						if (v.offline > 0) {
							obj.qty = v.offline
						} else {
							obj.qty = v.Qty
						}
						list.push(obj)
					}
				})
				var products = [...styles].toString().replace(/\,/g, '\n')
				if (list.length == 0) {
					uni.showModal({
						content: '您没有选择任何项目',
						showCancel: false
					})
				} else {
					uni.showModal({
						title: '生产单确认',
						content: products,
						success: (res) => {
							if (res.confirm) {
								this.offlineConfirm(list)
							}
						}
					})
				}
			},
			// 重新刷新表数据 
			getDate() {
				let data = this.tempData
				var result = []
				if (data.length > 0) {

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
				} else {
					uni.showModal({
						content: '请求错误,请选则工序!',
						showCancel: false
					})
				}
				this.tableData = []
				uni.showLoading({

				})
				setTimeout(() => {
					uni.hideLoading()
					this.tableData = result
				}, 500)

			},
			// 请求原始数据
			async bindPickerChange(e) {
				this.index = e.target.value

				this.getDataSource()
			},
			// 向后台请求数据
			async getDataSource() {
				this.tableData = []
				let SeqCode = this.SeqList[this.index].value
				uni.showLoading({
					title: '正在请求数据!'
				})
				var [err, res] = await GetQtyOnlineMODCS(SeqCode)
				if (err) {
					uni.showModal({
						content: err
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
					this.setTempData(data)
				}
				// console.log('更新数据源')
				this.tableData = result
				uni.hideLoading()
			},
			// 每次勾选操作之后 都需要判断一次 是否是都选择了,若是 则勾选 全选 若否 不勾选全选
			isAllSelect() {
				// 总条目数
				let length = this.tableData.length
				// 勾选的数量
				var count = 0
				this.tableData.map(v => {
					v.checked == true ? count++ : count
				})

				if (count == length) {
					this.$refs.selectAll.checked = true
				} else {
					this.$refs.selectAll.checked = false
				}
			},
			// 确认下线
			async offlineConfirm(list) {
				var [err, res] = await SetRackOfflineByZdOnlineGuid(list)
				if (err) {
					uni.showModal({
						content: err
					})
				} else {
					// 下线成功后 重新获取数据源
					this.getDataSource()
					console.log('下线成功')
					console.log(res.data)
					uni.showModal({
						content: res.data.msg,
						showCancel: false
					})
				}
			},
			// 更新手动下线数量
			setUserQty(e, id) {
				this.tableData[id] = Object.assign(this.tableData[id], { offline: Number(e.target.value) })

				console.log(this.tempData)
			},
			// 数量 输入验证
			verity(e, v) {
				if (e.target.value > v) {
					this.showError = true
					this.msg = '数量错误!'
				} else {
					this.showError = false
				}
			},
			// 点击 行 显示 生产单信息
			showFullInfo(a, b, c, d) {
				var res = ''
				if (a) {
					res = '生产单: ' + a + '\n'
				}
				if (b) {
					res += '款号: ' + b + '\n'
				}
				if (c) {
					res += '颜色: ' + c + '\n'
				}
				if (d) {
					res += '尺码: ' + d
				}
				uni.showModal({
					content: res,
					showCancel: false
				})
			}
		},
		// 下拉刷新
		// async onPullDownRefresh() {
		// 	await this.getDataSource()
		// 	uni.stopPullDownRefresh();
		// },
		async created() {
			uni.showLoading({
				title: '正在请求工序列表!'
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
				obj.map((v, k) => {
					if (v.label == '套整件') {
						this.index = k
					}
					this.array.push(v.label)
				})

				uni.hideLoading()
			}
			setTimeout(() => {
				this.getDataSource()
			}, 1000)

		},
		computed: {
			show() {
				if (this.tableData) {
					return this.tableData.length > 0 ? true : false
				} else {
					return false
				}
			},
			...mapState(['tempData'])
		},
		destroyed() {
			this.setTempData('')
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

			.errorMsg {
				background-color: red;
				color: white;
				height: 60rpx;
				font-size: 40rpx;
			}
		}

		#list {
			height: 1100rpx;
			// overflow: ;

			.stripe:nth-child(even) {
				background: #273238;
				border-radius: 10rpx;
				color: white;

				.mo {
					border: solid 1rpx white;
				}

				.count {
					width: 80rpx;
					border: solid 1rpx white;
				}
			}

			.stripe:nth-child(odd) {}

			.mo {
				width: 420rpx;
				max-width: 420rpx;
				border: solid 1rpx black;
				max-height: 42rpx;

				.st {
					width: 210rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}

				.co {
					width: 105rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}

				.si {
					width: 105rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}

			.count {
				width: 80rpx;
				border: solid 1rpx black;
			}
		}

		.bottom {
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			z-index: 2;
			border-top: solid 1rpx grey;
			padding-top: 15rpx;
			padding-bottom: 30rpx;
			background-color: white;

		}
	}



	//
	.test {
		// border: solid 1px red;
		justify-content: space-around;
		min-height: 80rpx;
		margin-bottom: 10rpx;
		border: solid 1rpx black;
		border-radius: 10rpx;
	}

	input {
		border: solid 1px grey;
		width: 100rpx;
	}

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

	}

	.white {
		color: white;
	}

	.debug {
		border: solid 1rpx red;
	}

	.dropdown {
		margin-right: 10rpx;
	}
</style>
