<template>
	<view class="container">
		<!-- #ifdef H5 -->
		<sc-nav left leftBtnText="关闭" @goBack="close"></sc-nav>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<sc-nav></sc-nav>
		<!-- #endif -->
		<scroll-view scroll-y>
			<sc-banner :images="banners"></sc-banner>
			<sc-menu :options="options"></sc-menu>
		</scroll-view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
import * as dd from 'dingtalk-jsapi'

export default {
	data() {
		return {
			banners: [
				{
					id: 1,
					image: '../../static/img/1.jpg', // 显示的轮播图片地址
					url: '' // 需要点击触发跳转的页面
				},
				{
					id: 2,
					image: '../../static/img/2.jpg',
					url: ''
				},
				{
					id: 3,
					image: '../../static/img/3.jpg',
					url: ''
				},
				{
					id: 4,
					image: '../../static/img/4.jpg',
					url: ''
				}
			],
			options: [
				{
					id: 1,
					name: '加工记录',
					icon: '&#xe60a;',
					url: '/pages/ProcessRecord/ProcessRecord'
				},
				{
					id: 2,
					name: 'NFC',
					icon: '&#xe600;',
					url: '/pages/nfc/nfc'
				},
				{
					id: 3,
					name: '生产车间',
					icon: '&#xe691;',
					url: '/pages/ProInfo/ProInfo'
				},
				{
					id: 4,
					name: '生产线',
					icon: '&#xe705;',
					url: '/pages/workLine/index'
				},
				{
					id: 5,
					name: '扫码',
					icon: '&#xe6e5;',
					url: '/pages/scancode/scancode'
				},
				{
					id: 6,
					name: '生产单',
					icon: '&#xe64e;',
					url: '/pages/order/order'
				},
				{
					id: 7,
					name: '横屏',
					icon: '&#xe64e;',
					url: '/pages/landscape/landscape',
					
				}
			],
			helpView: false, //是否显示帮助信息
			title: ''
		}
	},
	methods: {
		showhelp() {
			this.helpView = !this.helpView
		},
		// 关闭页面
		close() {
			// #ifdef H5
			let env = dd.env.platform
			if (env != 'notInDingTalk') {
				dd.biz.navigation.close()
			} else {
				console.log('关闭页面')
			}
			// #endif
		},
		understand() {
			this.helpView = false
		}
	},
	computed: {
		...mapState(['hasLogin', 'userName'])
	},
	mounted() {
		this.title = this.$Route.meta.title
	},
	onPullDownRefresh() {
		location.reload()
		setTimeout(function() {
			uni.stopPullDownRefresh()
		}, 1000)
	}
}
</script>

<style lang="less" scoped>
.container {
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	position: fixed;
	text-align: center;
}
</style>
