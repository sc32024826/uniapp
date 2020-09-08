<template>
	<view class="Container">
		<uni-drawer ref="dra" mode="right">
			<view class="label">当前站点:</view>
			<view class="uni-input" v-if="showSingle">{{station.name}}</view>
			<view class="" v-if="showList">
				<ul>
					<li v-for="(item,index) of stationList" :key="index">{{item.name}}</li>
				</ul>
			</view>
			<view class="label"> 当前职工:</view>
			<view class="uni-input">{{currentEmp}}</view>
			<picker :range="employee" range-key="label" mode='selector' :value="index" @change="change">
				<view class="uni-input">{{employee[index].label}}</view>
			</picker>
			<view class="functionList">
				<button type="primary" @click="login" :disabled="btnLoginDisable">职工登录</button>
				<button type="primary" @click="logout" :disabled="btnLogoutDisable">职工登出</button>
			</view>
			<view class="footer">
				<button type="primary" @tap="StationAssignSet">站点方案分配</button>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	s
	export default {
		components: {
			uniDrawer
		},
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.functionList {
		padding: 30rpx;

		button {
			margin-bottom: 30rpx;
		}

	}

	.uni-input {
		height: 50rpx;
		width: 100%;
		text-align: center;
	}

	.label {
		margin-top: 10rpx;
		margin-left: 10rpx;
		font-weight: bold;
	}

	picker {
		background-color: #c8c8c8;
		text-align: center;
		height: 80rpx;
		margin-top: 20rpx;
		padding-top: 20rpx;
	}

	.footer {
		margin-left: 30rpx;
		width: calc(100% - 60rpx);
		position: fixed;
		bottom: 100rpx;
	}
</style>
