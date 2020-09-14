<template>
	<view class="content">
		<swiper :autoplay="true" @change="swiperChange" class="banner" circular>
			<block v-for="item in images" :key="item.id">
				<swiper-item>
					<image :src="item.image" class="img"></image>
				</swiper-item>
			</block>
		</swiper>
		<view class="pointBox">
			<block v-for="(v,i) in images" :key="i">
				<view :class="{active:current === i,dot:true}"></view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0 // 当前轮播图序号
			}
		},
		props: {
			images: {
				type: Array,
				required: true
			}
		},
		methods: {
			// 轮播图 切换 触发事件
			swiperChange(e) {
				// console.log(e.detail.current)
				this.current = e.detail.current
			}
		},
		mounted() {
			// console.log(this.images)
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 40vh;

		.banner {
			height: 35vh;
			width: 100%;

			.img {
				width: 100%;
			}
		}
	}

	.pointBox {
		display: flex;
		flex-direction: row;
		justify-content: center;
		height: 50rpx;
		width: 100%;
		align-items: center;

		.dot {
			height: 18rpx;
			width: 35rpx;
			background-color: #a7a7a7;
			z-index: 2;
			margin: 0 5rpx;
		}
	}

	.active {
		background-color: #47c8ff !important;
	}
</style>
