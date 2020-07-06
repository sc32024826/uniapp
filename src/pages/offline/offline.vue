<template>
	<view id="container">
		<view id="toolbar" class="flex center">
			<checkbox-group @change="checkboxChange">
				<label>
					<checkbox value="color" />区分颜色
				</label>
				<label>
					<checkbox value="size" />区分尺码
				</label>
			</checkbox-group>
		</view>
		<view id="title" class="flex row vertical-center">
			<view style="width: 50rpx;"></view>
			<view class="white" style="width: 400rpx;">生产单-颜色-尺码</view>
			<view class="white" style="width: 80rpx;">线上</view>
			<view class="white">下线数</view>
		</view>
		<view id="list" class="uni-list">
			<checkbox-group @change="checkboxChange2">
				<view class="stripe" v-for="(item,i) in items" :key="i">
					<view class="flex row test vertical-center ">
						<checkbox :value="item.id" :checked="item.Check" />
						<!-- <view class="mo">{{format(item.Mo,item.Color,item.Size)}}</view> -->
						<view class="mo">
							<view>{{item.Mo}}</view>
							<view v-if="isShowColor"> -{{item.Color}} </view>
							<view v-if="isShowSize"> -{{item.Size}} </view>
						</view>
						<view class="count">{{item.Count}}</view>
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
	export default {
		data() {
			return {
				items: [
					{ id: '1', Mo: '1', Color: '1', Size: '1', Count: '1', Check: false },
					{ id: '2', Mo: '123123', Color: 'red', Size: 'XXL', Count: '50', Check: false },
					{ id: '3', Mo: '121211123123', Color: 'reasasd', Size: 'XXL', Count: '50000', Check: false }
				],
				choose: [], // 选中的衣服衣架
				isShowColor: false,
				isShowSize: false
			}
		},
		methods: {
			checkboxChange(e) {
				// console.log(e.detail.value) // array
				let showItem = e.detail.value
				if (showItem.indexOf('color') > -1) {
					this.isShowColor = true
				} else {
					this.isShowColor = false
				}
				
				if (showItem.indexOf('size') > -1) {
					this.isShowSize = true
				} else {
					this.isShowSize = false
				}
			},
			checkboxChange2(e) {
				// console.log(e.detail.value);
				// 天选之子s
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
				// console.log('下线id为', this.choose);
			},
			offlineByUser() {

			},
			async getDate() {

			}
		},
		async onPullDownRefresh() {
			await this.getDate()
			uni.stopPullDownRefresh();
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

		// view {
		// 	border: solid 1rpx red;
		// }

		.mo {
			width: 400rpx;
			// overflow: hidden;
			display: flex;
			flex-direction: row;
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

		// view {
		// 	border: solid 1rpx red;
		// }
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
</style>
