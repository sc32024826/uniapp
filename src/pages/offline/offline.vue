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
						<checkbox value="color" />区分颜色
					</label>
					<label>
						<checkbox value="size" />区分尺码
					</label>
				</checkbox-group>
			</view>
			<view id="title" class="flex row vertical-center">
				<checkbox-group @change="selectAll">
					<checkbox value="chooseAll"></checkbox>
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
						<checkbox :value="item.id" :checked="item.Check" />
						<view class="mo">
							<view>单号: {{item.MO}}</view>
							<view>款号: {{item.StyleNo}}</view>
							<view v-if="DoColor">颜色: {{item.ColorName}}</view>
							<view v-if="DoSize">尺码: {{item.SizeName}}</view>
						</view>
						<view class="count">{{item.Qty}}</view>
						<input placeholder="0" type="number" adjust-position :disabled="!item.Check"></input>
					</view>
				</view>
			</checkbox-group>
		</view>
		<view class="flex row bottom">
			<button type="primary" size="mini" @click="offline">下线选中的衣服</button>
			<button type="primary" size="mini" @click="offlineByUser">按指定数量下线</button>
		</view>
	</view>
</template>

<script>
	import { RackOffline, getSeqNameList } from '@/api/api.js'
	import { SelectAll, SelectBySize, SelectByColor, SelectByColorSize } from './classify.js'
	export default {
		data() {
			return {
				tableData: [],
				choose: [], // 选中的衣服衣架
				array: [],
				index: 0,
				SeqList: [],
				DoColor: false, //区分颜色
				DoSize: false, //区分尺码
				defalutData: []
			}
		},
		methods: {
			// 全选 全不选
			selectAll(e) {
				// 全选
				if (this.tableData.length === 0) return
				if (e.detail.value == 'chooseAll') {
					let choose = []
					this.tableData.forEach(element => {
						element = Object.assign(element, { Check: true })
						choose.push(element.id)
					})
					this.choose = choose
				} else {
					this.tableData.forEach(element => {
						element = Object.assign(element, { Check: false })
					})
					this.choose = []
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
				console.log('这里');
				let chooseList = e.detail.value
				this.choose = chooseList
				if (chooseList.length == 0) return
				this.tableData.forEach(element => {
					if (chooseList.indexOf(element.id) > -1) {
						element.Check = true
					} else {
						element.Check = false
					}
				})
			},
			offline() {
				console.log('下线id为', this.choose);
				uni.showModal({
					content: '下线id为' + this.choose,
					showCancel: false
				})
			},
			offlineByUser() {

			},
			// 重新刷新表数据 
			getDate() {
				if (this.defalutData.length > 0) {
					if (this.DoColor) {
						if (this.DoSize) {
							this.tableData = SelectByColorSize(this.defalutData)
						} else {
							this.tableData = SelectByColor(this.defalutData)
						}
					} else if (this.DoSize) {
						this.tableData = SelectBySize(this.defalutData)
					} else {
						this.tableData = SelectAll(this.defalutData)
					}
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
				const [err, res] = await RackOffline(SeqCode)
				if (err) {
					uni.showModal({
						content: err
					})
				} else {
					this.defalutData = res.data.response
					if (this.DoColor) {
						if (this.DoSize) {
							this.tableData = SelectByColorSize(res.data.response)
						} else {
							this.tableData = SelectByColor(res.data.response)
						}
					} else if (this.DoSize) {
						this.tableData = SelectBySize(res.data.response)
					} else {
						this.tableData = SelectAll(res.data.response)
					}
				}

			}
		},
		// 下拉刷新
		// async onPullDownRefresh() {
		// 	await this.getDate()
		// 	uni.stopPullDownRefresh();
		// },
		async created() {
			const [err, res] = await getSeqNameList()
			if (err) {
				uni.showModal({
					content: err,
					showCancel: false
				})
			} else {
				console.log(res.data.response);
				let obj = res.data.response
				this.SeqList = obj
				for (let { label, value } of obj) {
					this.array.push(label)
				}
			}
		},
		computed: {
			show() {
				if (this.tableData) {
					return this.tableData.length > 0 ? true : false
				} else {
					return false
				}

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
			position: fixed;
			top: 0;
			width: 100%;
			background-color: white;
			z-index: 2;

			#toolbar {
				margin: 5rpx;
			}
		}

		#list {
			margin-top: 150rpx;
		}

		.bottom {
			position: fixed;
			bottom: 50rpx;
			width: 100%;
			z-index: 2;
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
