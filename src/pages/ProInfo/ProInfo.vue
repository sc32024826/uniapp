<template>
	<view class="container">
		<uni-collapse>
			<uni-collapse-item title="1号线" open="true" thumb="">
				<view class="flex row wrap">
					<view class="box" v-for="(item,v) in list" :key="v">
						<view class="flex row">
							<view class="light"></view>
							<view>线号-站号</view>
							<view>工序</view>
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
		<!-- <uni-collapse>
			<uni-collapse-item title="2号线" open="true">
				<view class="flex row wrap">
					<view class="box" v-for="(item,v) in list" :key="v">
						<view class="flex row">
							<view class="light"></view>
							<view>线号-站号</view>
							<view>工序</view>
						</view>
						<view class="flex row">
							<view>工号-姓名</view>
							<view>当日产量</view>
						</view>
						<view class="flex row">款号</view>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse> -->
	</view>
</template>

<script>
	import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'
	export default {
		components: { uniCollapse, uniCollapseItem },
		data() {
			return {
				data:[
					{
						line:'1号线',
						
					}
				]
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
		font-size: 30rpx;
		// display: flex;
		// justify-content: center;
		// margin-top: 20rpx;
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
