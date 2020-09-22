<template>
	<view v-if="visiable" class="search" :style="{ 'padding-top': statusBarHeight + navBarHeight + 'px' }">
		<view ref="select">
			<view class="drawer-content">
				<view><input placeholder="请输入款号" v-model="style" type="text" /></view>
				<view><input placeholder="请输入客户名称" v-model="custom" type="text" /></view>
				<view><input placeholder="请输入状态ID" v-model="status" type="number" /></view>
				<view>
					<!-- <picker></picker> -->
					<view>版单标记</view>
					<picker-view :value="value" :indicator-style="indicatorStyle">
						<picker-view-column>
							<!-- <text>true</text> -->
							<view v-for="(item, index) in [true, false]" :key="index">{{ item }}</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
			<view class="bottom-fixed row jc-c"><button type="primary">搜索</button></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		visiable: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			value: [0],
			style: '',
			custom: '',
			status: null,
			statusBarHeight: 20,
			windowWidth: 375,
			navBarHeight: 44,
			indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`
		}
	},
	methods: {
		open() {
			this.$refs.select.open()
		},
		close() {
			this.$refs.select.close()
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
.search {
	position: fixed;
	background-color: #c2c2c2;
	width: 100%;
	height: 100vh;
	opacity: 95%;
}
.drawer-content {
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
	width: 100%;
	position: fixed;
	top: 70vh;

	button {
		width: 80%;
	}
}
</style>
