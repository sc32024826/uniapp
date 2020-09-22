<template>
	<view>
		<!-- <view :style="{height:statusBarHeight + navBarHeight + 'px'}"></view> -->
		<uni-drawer ref="drawer" :style="{ top: statusBarHeight + navBarHeight + 'px'  }">
			<view>
				<view class="drawer-content">
					<view><input placeholder="请输入款号" v-model="style" type="text" /></view>
					<view><input placeholder="请输入客户名称" v-model="custom" type="text" /></view>
					<view><input placeholder="请输入状态ID" v-model="status" type="number" /></view>
					<view>
						<view>版单标记</view>
						<picker-view :value="value" :indicator-style="indicatorStyle">
							<picker-view-column>
								<view v-for="(item, index) in [true, false]" :key="index">{{ item }}</view>
							</picker-view-column>
						</picker-view>
					</view>
				</view>
				<view class="bottom-fixed row jc-c"><button type="primary" @tap="reSearch">搜索</button></view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
export default {
	props: {},
	data() {
		return {
			value: [0],
			style: '',
			custom: '',
			status: null,
			statusBarHeight: 20,
			windowWidth: 375,
			navBarHeight: 44,
			indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth / (750 / 100))}px;`
		}
	},
	methods: {
		open() {
			this.$refs.drawer.open()
		},
		close() {
			this.$refs.drawer.close()
		},
		// 重新检索数据
		reSearch() {},
		// 取消返回
		cancel() {
			this.close()
		}
	},
	created() {
		const stateBar = uni.getSystemInfoSync()
		this.statusBarHeight = stateBar.statusBarHeight
		this.windowWidth = stateBar.windowWidth
		// #ifdef MP-WEIXIN
		const capsule = uni.getMenuButtonBoundingClientRect()
		this.navBarHeight = capsule.bottom - this.statusBarHeight + capsule.top - this.statusBarHeight
		this.windowWidth = capsule.left
		// #endif
	}
}
</script>

<style lang="scss">
.drawer-content {
	background-color: #c2c2c2;
	box-sizing: border-box;
	padding: 20rpx;
	view {
		padding: 20rpx;
		input {
			background-color: #ffffff;
			text-align: center;
		}
	}
}
.bottom-fixed {
	box-sizing: border-box;
	padding: 0 20rpx;
	width: 100%;
	position: fixed;
	bottom: 30rpx;
	button {
		width: 100%;
		margin: 10rpx;
	}
}
</style>
