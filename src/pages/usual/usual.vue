<template>
	<view class="container">
		<uni-nav-bar fixed status-bar>
			<view class="center">常用功能</view>
			<view slot="left" @click="close" class="icon-back">关闭</view>
			<view slot="right"><text @tap="showHelp" >&#xe677;</text></view>
		</uni-nav-bar>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default {
		components:{
			uniNavBar
		},
		data() {
			return {
				
			}
		},
		methods: {
			close() {
				let env = dd.env.platform
				if (env != 'notInDingTalk') {
					dd.biz.navigation.close()
				}else{
					console.log('关闭页面')
				}
			},
			showHelp() {
				console.log('帮助')
			}
		},
		created() {
			uni.showToast({
				title:'测试内容'
			})
		}
	}
</script>

<style lang="less" scoped>
	.container{
		width: 100%;
		height: 100vh;
		background-color: green;
	}

</style>
