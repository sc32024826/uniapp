<template>
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
</template>

<script>
</script>

<style>
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
</style>
