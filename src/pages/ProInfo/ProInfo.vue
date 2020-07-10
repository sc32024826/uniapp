<template>
	<view class="container">
		<uni-collapse>
			<uni-collapse-item :title="item.line" open="true" v-for="(item,i) in data" :key="i">
				<view class="flex row wrap">
					<view class="box" v-for="(v,k) in item.list" :key="k">
						<view class="flex row">
							<view class="light"></view>
							<view>线号-站号{{v.lineNo}}{{v.stationNo}}</view>
							<view>工序{{v.seqName}}</view>
						</view>
						<view class="flex row">
							<view>工号-姓名</view>
							<view>当日产量</view>
						</view>
						<view class="flex row">款号</view>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'
	export default {
		components: { uniCollapse, uniCollapseItem },
		data() {
			return {
				data: [{
					line: '1号线',
					list: [
					]
				}, {
					line: '2号线',
					list: []
				}, {
					line: '3号线',
					list: []
				}]
			}
		},
		methods: {

		}
	}
</script>

<style lang="less" scopde>
	//调试 规则
	// view {
	// 	border: solid 1px red;
	// }

	// 正式规则
	.container {
		width: 100%;
		text-align: center;
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
		border: solid 1rpx red;
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

	.light {
		width: 50rpx;
		height: 50rpx;
		background: yellow;
		border: solid 1rpx green;
		margin-top: 10rpx;
	}
</style>
