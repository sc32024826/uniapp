<template>
	<view>
		{{time}}
	</view>
</template>

<script>
	import format from '../../utils/data/format.js'
	export default {
		data() {
			return {
				time:''
			}
		},
		mounted() {
			let v = new Date()
			this.time = format('yyyy-MM-dd hh:mm:ss',v)
		}
	}
</script>

<style lang="less">

</style>
