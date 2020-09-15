<template>
	<view class="content">
		<ul>
			<block v-for="(item,index) in codes" :key="index">
				<li>{{item}}</li>
			</block>
		</ul>
	</view>
</template>

<script>
	export default {
		props:{
			codes:{
				type:Array
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.content{
		width: 100%;
		height: 60vh;
	}
</style>
