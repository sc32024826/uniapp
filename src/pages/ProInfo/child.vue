<template>
	<!-- <input type="checkbox" v-model="checked" @click="check" /> -->
	<checkbox :checked="select"></checkbox>
</template>

<script>
	export default {
		props: {
			checked: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				select: this.checked
			}
		},
		methods: {

		},
		watch: {
			checked(val){
				this.select = val
				console.log('子组件中的方法,提交值给父组件')
				this.$emit('togglecheck', this.select)
			}
		}
	}
</script>

<style>
</style>
