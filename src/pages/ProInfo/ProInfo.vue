<template>
	<view class="container">
		<uni-collapse>
			<uni-collapse-item :title="item.name" :open="true" v-for="(item,i) in data" :key="i" class="collapseitem">
				<view class="flex row wrap item">
					<view class="box" v-for="(v,k) in item.list" :key="k">
						<view class="flex row">
							<view :class="v.Enable ? 'base light' : 'base stop'"></view>
							<view>{{v.LineID}}-{{v.StationID}}</view>
							<view>{{v.SeqName}}</view>
						</view>
						<view class="flex row">
							<view>{{v.EmpID}}-{{v.Name}}</view>
							<view>{{v.RackCnt}}</view>
						</view>
						<!-- <view class="flex row">{{v.Style}}</view> -->
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'
	import { GetStationStatus } from '@/api/api.js'
	import groupBy from './classify.js'

	export default {
		components: { uniCollapse, uniCollapseItem },
		data() {
			return {
				data: [],
			}
		},
		methods: {

		},
		async mounted() {
			let para = ''
			const [err, res] = await GetStationStatus(para)
			if (err) {
				uni.showModal({
					content: err,
					showCancel: false
				})
			} else {
				console.log(res.data)
				if (res.data.success == true) {
					let data = res.data.response
					this.data = groupBy(data, 'LineID')
					console.log(this.data);
				}
			}

		}
	}
</script>

<style lang="less" scopde>
	//调试 规则
	.debug {
		border: solid 1rpx red;
	}

	// 正式规则
	.container {
		width: 100%;
		text-align: center;
		text-align: left;
		// font-size: 10rpx;

		// display: flex;
		// justify-content: center;
		// margin-top: 20rpx;
		uni-collapse {
			uni-collapse-item {

				// font-size: 10rpx;
			}
		}

	}

	.box {
		width: 48%;
		border: solid 2rpx #DCDEE2;
		height: 200rpx;
		margin: 2rpx;
	}

	.flex {
		display: flex;
	}

	.row {
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin: 10rpx 0rpx 10rpx 0rpx;
	}

	.wrap {
		flex-wrap: wrap;
	}
	.base{
		width: 50rpx;
		height: 50rpx;
		border: solid 1rpx green;
		margin-top: 10rpx;
	}
	.light {
		
		background: yellow;
		
	}
	.stop{
		background: red;
	}

	.collapseitem {
		.item {
			padding: 10rpx 0rpx 10rpx 0rpx;
		}
	}

	.collapseitem:nth-child(even) {
		.item {
			background-color: #666699;
			color: white;
		}
	}

	.collapseitem:nth-child(odd) {
		.item {
			background-color: #CCCCCC;

		}
	}
</style>
