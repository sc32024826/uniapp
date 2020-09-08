<template>
	<view class="container">
		<uni-nav-bar fixed status-bar>
			<view class="center">工作台</view>
			<view slot="left" @click="close" class="icon-back">关闭</view>
			<view slot="right" @tap="showhelp"><text>&#xe677;</text></view>
		</uni-nav-bar>
		<swiper :autoplay="true" :indicatorDots="true" indicatorActiveColor="white" circular>
			<swiper-item>
				<view class="logo"></view>
			</swiper-item>
			<swiper-item>
				<image src="@/static/banner/1.jpg" class="wd"></image>
			</swiper-item>
			<swiper-item>
				<image src="@/static/banner/2.jpg" class="wd"></image>
			</swiper-item>
			<swiper-item>
				<image src="@/static/banner/3.jpg" class="wd"></image>
			</swiper-item>
			<swiper-item>
				<image src="@/static/banner/4.jpg" class="wd"></image>
			</swiper-item>
		</swiper>
		<view class="row warp main">
			<block v-for="(item,i) in optionList">
				<view class="box primary" @click="jump(item.url)">
					<view class="icon" v-html="item.icon"></view>
					<view>{{item.title}}</view>
				</view>
			</block>
		</view>
		<view class="help" v-if="helpView">
			<swiper class="swiper" :indicatorDots="true" indicatorActiveColor="white">
				<swiper-item>
					<text class="icon-box"></text>
					<view class="msg">
						<li>
							扫描衣架二维码获得衣架信息
						</li>
						<li>
							手动输入衣架号获得衣架信息
						</li>
						<li>
							设置衣架为已经完成
						</li>
						<li>
							查询衣架的历史记录
						</li>
						<li>
							查询衣架上的衣服信息
						</li>
					</view>
				</swiper-item>
				<swiper-item>
					<text class="icon-box margin-left"></text>
					<view class="msg">
						<li>
							扫描员工卡片获得员工卡号
						</li>
					</view>
				</swiper-item>
				<swiper-item>
					<text class="icon-box margin-left-2"></text>
					<view class="msg">
						<li>
							扫描员工卡片获得员工卡号
						</li>
					</view>
				</swiper-item>
				<swiper-item>
					<text class="icon-box margin-left-3"></text>
					<view class="msg">
						<li>
							扫描员工卡片获得员工卡号
						</li>
					</view>
				</swiper-item>
			</swiper>
			<view @click="understand" class="hideHelp py primary">我知道了</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import * as dd from "dingtalk-jsapi"

	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				optionList: [{
						url: '/pages/ProcessRecord/ProcessRecord',
						icon: '&#xe60a;',
						title: '加工记录'
					},
					{
						url: '/pages/nfc/nfc',
						icon: '&#xe600;',
						title: 'NFC'
					},
					{
						url: '/pages/ProInfo/ProInfo',
						icon: '&#xe691;',
						title: '生产情况'
					},
					{
						url: '/pages/beforeOffline/beforeOffline',
						icon: '&#xe705;',
						title: '生产线'
					}
				],
				helpView: false //是否显示帮助信息
			}
		},
		methods: {
			// 跳转页面
			jump(url) {
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
		}
	}
</script>

<style lang="less" scoped>
	
	.icon {
		font-size: 150rpx;
	}

	.wrap {
		justify-content: start;
		flex-wrap: wrap;
	}
	.wd{
		margin: 10rpx;
		width: calc(100vw - 20rpx);
	}

	.container {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		position: fixed;

		.logo {
			height: 250rpx;
			background-image: url("@/static/img/Title.jpg");
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center;
			margin: 10rpx 10rpx 0 10rpx;

		}

		.main {
			margin: 10rpx;
			flex-wrap: wrap;
			justify-content: space-between;
			.box {
				align-items: center;
				height: 200rpx;
				width: calc((100vw - 50rpx)/4);
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: center;
				margin-bottom: 10rpx;
				color: #323232;
				padding-bottom: 10rpx;
			}
		}

		.help {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			background-color: rgba(165, 165, 165, 0.8);
			z-index: 2;

			.swiper {
				height: 80vh;

				.icon-box {
					color: white;
					font-size: 200rpx;
					display: block;
					margin-top: 390rpx;
					transform: scale(1, 1.2)
				}

				.margin-left {
					margin-left: 24vw;
				}

				.margin-left-2 {
					margin-left: 49vw;
				}

				.margin-left-3 {
					margin-left: 74vw;
				}

				.msg {
					margin-top: 50rpx;
					text-indent: 2em;
				}


			}
		}

		.hideHelp {
			border-radius: 10rpx;
			border: solid 1rpx #e3e3e3;
			width: 40vw;
			margin: 0 auto;
			text-align: center;
			height: 50rpx;
		}

	}
</style>
