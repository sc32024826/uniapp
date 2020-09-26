<template>
	<view>

	</view>
</template>

<script>
export default {
	props: {},
	data() {
		return {
		
		}
	},
	methods: {
		open() {
			this.$refs.drawer.open()
		},
		close() {
			this.$refs.drawer.close()
		},
		// 重新检索数据
		reSearch() {
			
		},
		// 取消返回
		cancel() {
			this.close()
		}
	},
	created() {
	
	}
}
</script>

<style lang="scss" scoped>

</style>
