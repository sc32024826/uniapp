<template>
	<view class="content">
		<view class="flex column">
			<block v-for="(item,i) in optionList">
				<view class="flex row box" @tap="jump(item.url)">
					<text class="test" v-html="item.icon"></text>
					<text class="title">{{item.title}}</text>
				</view>

			</block>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		computed: mapState(['hasLogin', 'userName']),
		data() {
			return {
				optionList: [{
						url: '11111111111',
						icon: '&#xe711;',
						title: '调拨单'
					},
					{
						url: '222222222222',
						icon: '&#xe719;',
						title: '进销存报表'
					},
					{
						url: '需要跳转的url',
						icon: '&#xe744;',
						title: '新品发布'
					},
					{
						url: '/pages/set/set',
						icon: '&#xe6b4;',
						title: '设置/管理'
					}
				]
			}
		},
		onLoad() {},
		created() {
			// 根据用户 权限获得功能列表
			// uni.request({
			// 	url: '',
			// 	data: {},
			// 	success: (res) => {},
			// 	fail: (err) => {}
			// })
		},
		methods: {
			// 跳转页面
			jump(url) {
				console.log(url)
				// uni.showModal({
				// 	content: url
				// })
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style>
	@font-face {
		font-family: 'iconfont';
		/* project id 1825614 */
		src: url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.eot');
		src: url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.eot?#iefix') format('embedded-opentype'),
			url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.woff2') format('woff2'),
			url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.woff') format('woff'),
			url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.ttf') format('truetype'),
			url('https://at.alicdn.com/t/font_1825614_wqjnnkv7ksm.svg#iconfont') format('svg');
	}

	.test {
		font-family: 'iconfont';
		font-size: 160px;
		font-style: normal;
	}

	.flex {
		display: flex;
	}

	.column {
		flex-direction: column;
	}

	.row {
		flex-direction: row;
	}

	.title {
		text-align: center;
	}

	.box {
		margin: 2px;
		border: solid 2px #000000;
		width: 350px;
		align-items: center;
	}
</style>
