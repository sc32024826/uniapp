<template>
	<view class="container">
		<view class="name my">详细数据</view>
		<view class="title primary white row">
			<view class="grow-1">工序</view>
			<view class="grow-2 column">
				<view>在线</view>
				<view class="row space">
					<view>衣架数</view>
					<view>衣服数</view>
				</view>
			</view>
			<view class="grow-2 column">
				<view>站内</view>
				<view class="row space">
					<view>衣架数</view>
					<view>衣服数</view>
				</view>
			</view>
		</view>
		<block v-for="(v, i) in details" :key="i">
			<view class="row items" @tap="naviTo(v)">
				<view>{{ v.SeqName }}</view>
				<view>{{ v.OnlineCount }}</view>
				<view>{{ v.OnlineQty }}</view>
				<view>{{ v.InStationCount }}</view>
				<view>{{ v.InStationQty }}</view>
			</view>
		</block>
		<view class="primary white row total">
			<view>合计</view>
			<view>{{ OnlineCount }}</view>
			<view>{{ OnlineQty }}</view>
			<view>{{ InStationCount }}</view>
			<view>{{ InStationQty }}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		details: {
			type: Array,
			required: true
		}
	},
	computed: {
		InStationCount() {
			let qty = 0
			this.details.map(m => {
				qty += m.InStationCount
			})
			return qty
		},
		InStationQty() {
			let qty = 0
			this.details.map(m => {
				qty += m.InStationQty
			})
			return qty
		},
		OnlineCount() {
			let qty = 0
			this.details.map(m => {
				qty += m.OnlineCount
			})
			return qty
		},
		OnlineQty() {
			let qty = 0
			this.details.map(m => {
				qty += m.OnlineQty
			})
			return qty
		}
	},
	methods: {
		// 页面跳转
		naviTo(obj) {
			uni.navigateTo({
				url: '/pages/offline/offline?SeqCode=' + obj.SeqCode + '&SeqName=' + obj.SeqName
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	width: 100vw;
}

$wd-4: calc(100vw / 4);
$wd-5: calc(100vw / 5);

.name {
	padding: 10rpx;
	background-color: white;
	font-size: 1.2em;
	font-weight: 700;
}

.title {
	align-items: center;
	justify-content: space-around;
}

.grow-1 {
	text-align: center;
	width: $wd-5;
}

.grow-2 {
	text-align: center;
}

.items {
	text-align: center;
	padding: 20rpx 0;
	margin: 2rpx 0;

	view {
		width: $wd-5;
	}
	&:nth-child(odd) {
		background-image: linear-gradient(to right, grey, white);
	}
}
.total{
	text-align: center;
	padding: 20rpx 0;
	margin: 2rpx 0;
	view {
		width: $wd-5;
	}
}

.space {
	justify-content: space-around;
}
</style>
