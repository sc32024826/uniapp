<template>
	<view class="container">
		<uni-nav-bar fixed status-bar v-if="H5">
			<view class="full-width">{{title}}</view>
			<view slot="left" @click="close" class="icon-back">关闭</view>
			<view slot="right"><text @tap="showHelp">&#xe677;</text></view>
		</uni-nav-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				H5: true,
				title: ''
			}
		},
		methods: {
			close() {
				let env = dd.env.platform
				if (env != 'notInDingTalk') {
					dd.biz.navigation.close()
				} else {
					console.log('关闭页面')
				}
			},
			showHelp() {
				console.log('帮助')
			},
		},
		mounted() {
			this.title = this.$Route.meta.title
			// #ifndef H5
			this.H5 = false
			// #endif
		}
	}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;
		background-color: green;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
</style>
