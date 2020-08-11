<template>
	<view id="container">
		<view>
			<uni-collapse>
				<uni-collapse-item title="站内衣架" :open="true" class="collapseitem">
				</uni-collapse-item>
			</uni-collapse>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'

	export default {
		components: {
			uniCollapse,
			uniCollapseItem
		},
		data() {
			return {
				data: {}
			}
		},
		methods: {},
		mounted() {

		},
		computed: {
			...mapState(['stationMsg'])
		}
	}
</script>

<style lang="less" scoped>
	#container{
		width: 100%;
	}

</style>
