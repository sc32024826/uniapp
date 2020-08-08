<template>
	<view class="container">
		<uni-collapse>
			<uni-collapse-item :title="item.line" :open="true" v-for="(item,i) in data" :key="i" class="collapseitem">
				<view class="flex row wrap item">
					<view class="box" v-for="(v,k) in item.list" :key="k">
						<view class="flex row">
							<view class="light"></view>
							<view>{{v.LineNo}}-{{v.StationNo}}</view>
							<view>{{v.SeqName}}</view>
						</view>
						<view class="flex row">
							<view>{{v.EmpID}}-{{v.EmpName}}</view>
							<view>{{v.Count}}</view>
						</view>
						<view class="flex row">{{v.Style}}</view>
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
					list: [{
							LineNo: 1,
							StationNo: 2,
							SeqName: 'asdada',
							EmpID: 1231,
							EmpName: '张三',
							Count: 1231,
							Style: '1231231'
						},
						{
							LineNo: 1,
							StationNo: 2,
							SeqName: 'asdada',
							EmpID: 1231,
							EmpName: '张三',
							Count: 1231,
							Style: '1231231'
						}
					]
				}, {
					line: '2号线',
					list: [{
							LineNo: 1,
							StationNo: 2,
							SeqName: 'asdada',
							EmpID: 1231,
							EmpName: '张三',
							Count: 1231,
							Style: '1231231'
						},
						{
							LineNo: 1,
							StationNo: 2,
							SeqName: 'asdada',
							EmpID: 1231,
							EmpName: '张三',
							Count: 1231,
							Style: '1231231'
						}
					]
				}, {
					line: '3号线',
					list: [{
							LineNo: 1,
							StationNo: 2,
							SeqName: 'asdada',
							EmpID: 1231,
							EmpName: '张三',
							Count: 1231,
							Style: '1231231'
						},
						{
							LineNo: 1,
							StationNo: 2,
							SeqName: 'asdada',
							EmpID: 1231,
							EmpName: '张三',
							Count: 1231,
							Style: '1231231'
						}
					]
				}]
			}
		},
		methods: {

		}
	}
</script>

<style lang="less" scopde>
	//调试 规则
	.debug {
		border: solid 1px red;
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

	.light {
		width: 50rpx;
		height: 50rpx;
		background: yellow;
		border: solid 1rpx green;
		margin-top: 10rpx;
	}
	.collapseitem{
		.item{
			padding: 10rpx 0rpx 10rpx 0rpx;
		}
	}
	.collapseitem:nth-child(even){
		.item{
			background-color: #666699;
			color: white;
		}
	}
	.collapseitem:nth-child(odd){
		.item{
			background-color: #CCCCCC;
			
		}
	}
</style>
