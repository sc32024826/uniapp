<template>
	<view id="container">
		<view id="toolbar" class="flex center">
			<view class="debug dropdown">
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
		<view id="list" class="uni-list">
			<checkbox-group @change="checkboxChange">
				<view class="stripe" v-for="(item,i) in items" :key="i">
					<view class="flex row test vertical-center ">
						<checkbox :value="item.id" :checked="item.Check" />
						<view class="mo">
							<view>单号: {{item.MO}}</view>
							<view>款号: {{item.StyleNo}}</view>
							<view>颜色: {{item.ColorName}}</view>
							<view>尺码: {{item.SizeName}}</view>
						</view>
						<view class="count">{{item.Qty}}</view>
						<input placeholder="0" type="number" adjust-position :disabled="!item.Check"></input>
					</view>
				</view>
			</checkbox-group>
		</view>
		<view class="flex row bottom">
			<!-- <button type="primary" size="mini" @click="offline">下线选中的衣服</button> -->
			<!-- <button type="primary" size="mini" @click="offlineByUser">按指定数量下线</button> -->
		</view>
	</view>
</template>

<script>
	import { RackOffline, getSeqNameList } from '@/api/api.js'
	import { SelectAll } from './classify.js'
	export default {
		data() {
			return {
				items: [],
				choose: [], // 选中的衣服衣架
				array: [],
				index: -1,
				SeqList: []
			}
		},
		methods: {
			// 全选 全不选
			selectAll(e) {
				// 全选
				if (this.items.length === 0) return
				if (e.detail.value == 'chooseAll') {
					let choose = []
					this.items.forEach(element => {
						element = Object.assign(element, { Check: true })
						choose.push(element.id)
					})
					this.choose = choose
				} else {
					this.items.forEach(element => {
						element = Object.assign(element, { Check: false })
					})
					this.choose = []
				}
			},
			// 区分尺码 区分颜色
			async requestType(e) {
				let param = e.detail.value
				this.items = await this.getDate(param)
			},
			// 勾选列表行
			checkboxChange(e) {
				let chooseList = e.detail.value
				this.choose = chooseList
				if (chooseList.length == 0) return
				this.items.forEach(element => {
					if (chooseList.indexOf(element.id) > -1) {
						element.Check = true
					} else {
						element.Check = false
					}
				})
			},
			offline() {
				console.log('下线id为', this.choose);
			},
			offlineByUser() {

			},
			async getDate(param) {
				const { res, err, data } = await tempfunction(param)
				return data
			},
			async bindPickerChange(e) {
				let SeqCode = this.SeqList[e.target.value].value
				const [err, res] = await RackOffline(SeqCode)
				if (err) {
					// console.log(err);
					uni.showModal({
						content: err
					})
				} else {

					
					let re = SelectAll(res.data.response)
					this.items = re
					console.log(re);
				}
			}
		},
		// 下拉刷新
		// async onPullDownRefresh() {
		// 	await this.getDate()
		// 	uni.stopPullDownRefresh();
		// },
		watch: {

		},
		async created() {
			const [err, res] = await getSeqNameList()
			if (err) {
				console.log(err);
			} else {
				console.log(res.data.response);
				let obj = res.data.response
				this.SeqList = obj
				for (let { label, value } of obj) {
					this.array.push(label)
				}
				console.log(this.array);
			}
		}
	}
</script>

<style lang="less" scoped>
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
	#container {
		width: 100%;
		text-align: center;
	}

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

	#toolbar {
		margin: 5rpx;
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

	.bottom {
		position: absolute;
		bottom: 0;
		width: 100%;
		margin-bottom: 50rpx;
	}

	.debug {
		border: solid 1rpx red;
	}

	.dropdown {
		margin-right: 10rpx;
	}
</style>
