<template>
	<view id="container">
		<view>
			<uni-collapse>
				<uni-collapse-item title="站内衣架" :open="true" class="collapseitem">
					<view v-for="(v,i) in stationMsg.data" :key="i" class="flex row width">
						<view>{{v.RackCode}}</view>
						<view>{{v.MoNo}}</view>
						<view>款:{{v.StyleNo}}</view>
						<view>色:{{v.ColorName}}</view>
						<view>码:{{v.SizeName}}</view>
						<view>{{v.Qty}}件</view>
					</view>
				</uni-collapse-item>
				<uni-collapse-item title="已分配的方案">
					
				</uni-collapse-item>
			</uni-collapse>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'

	export default {
		components: {
			uniCollapse,
			uniCollapseItem
		},
		data() {
			return {
				data: {}
			}
		},
		methods: {

		},
		mounted() {
			console.log(this.stationMsg)
		},
		computed: {
			...mapState(['stationMsg'])
		}
	}
</script>

<style lang="less" scoped>
	#container {
		width: 100%;
		.width view{
			width: 240rpx;
			text-align: center;
			height: 50rpx;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.width:nth-child(even){
			background-color: #666666;
			color: white;
		}
		.width:nth-child(odd){
			background-color: #55aaff;
			color: white;
		}
		.width{
			border: solid 1rpx black;
			margin: 2rpx;
		}
	}

	.flex {
		display: flex;
	}
	.row{
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
	}
</style>
