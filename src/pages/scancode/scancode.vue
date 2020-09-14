<template>
	<view>
		<sc-camera @returnCode="getSacnCode"></sc-camera>
		<sc-code-list :codes="scanCodes"></sc-code-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scanCodes:[]
			};
		},
		methods:{
			getSacnCode(val){
				console.log(val)
				this.scanCodes.push(val)
			}
		}
	}
</script>

<style lang="scss">

</style>
