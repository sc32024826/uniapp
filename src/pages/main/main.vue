<template>
	<view class="container">
		<uni-nav-bar fixed status-bar v-if="H5">
			<view class="full-width">{{title}}</view>
			<view slot="left" @click="close" class="icon-back">关闭</view>
			<view slot="right" @tap="showhelp"><text>&#xe677;</text></view>
		</uni-nav-bar>
		<!-- #ifdef MP-WEIXIN -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<scroll-view class="scroll-y">
			<sc-banner :images="banners"></sc-banner>
			<sc-menu :options="options"></sc-menu>
		</scroll-view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import * as dd from "dingtalk-jsapi"

	export default {
		data() {
			return {
				banners: [{
						id: 1,
						image: '../../static/img/1.jpg', // 显示的轮播图片地址
						url: '' // 需要点击触发跳转的页面
					},
					{
						id: 2,
						image: '../../static/img/2.jpg',
						url: '',
					},
					{
						id: 3,
						image: '../../static/img/3.jpg',
						url: '',
					},
					{
						id: 4,
						image: '../../static/img/4.jpg',
						url: '',
					}
				],
				options: [{
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
					}, {
						id: 3,
						name: '生产车间',
						icon: '&#xe691;',
						url: '/pages/ProInfo/ProInfo'
					}, {
						id: 4,
						name: '生产线',
						icon: '&#xe705;',
						url: '/pages/workLine/index'
					}, {
						id: 5,
						name: '扫码',
						icon: '&#xe6e5;',
						url: '/pages/scancode/scancode'
					}
				],
				helpView: false, //是否显示帮助信息
				H5: true,
				title: ''
			}
		},
		methods: {
			// 跳转页面
			jump(item) {
				// #ifdef H5
				let url = item.url
				// #endif
				// #ifdef MP-WEIXIN
				let url = item.wx_url
				// #endif
				console.log(url)
				return
				uni.navigateTo({
					url: url
				})
			},
			showhelp() {
				this.helpView = !this.helpView
			},
			close() {
				let env = dd.env.platform
				if (env != 'notInDingTalk') {
					dd.biz.navigation.close()
				} else {
					console.log('关闭页面')
				}
			},
			understand() {
				this.helpView = false
			}
		},
		computed: {
			...mapState(['hasLogin', 'userName'])
		},
		mounted() {
			//#ifndef H5
			this.H5 = false
			//#endif
			this.title = this.$Route.meta.title
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
