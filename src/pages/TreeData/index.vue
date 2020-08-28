<template>
	<view class="container debug">
		
		<ly-tree v-if="isReady" :props="props" node-key="name" :load="loadNode" lazy show-checkbox @check="handleCheck"/>
		<button type="primary" class="bottom" @click="submit">提交</button>
	</view>
</template>

<script>
	import LyTree from '@/components/ly-tree/ly-tree.vue'
	import { QueryRouteGuidsByMODCS, SetStAssignByRouteGuids } from '@/api/api.js'
	import { mapState } from 'vuex'

	var _self;
	var index_id = 1
	export default {
		components: {
			LyTree
		},
		data() {
			return {
				//为了确保页面加载完成后才去调用load方法，this指向正确
				isReady: false,
				// data: [],
				props: {
					label: 'name',
					children: 'children',
					isLeaf: 'leaf'
				}
			}
		},
		onLoad() {
			_self = this;
			this.isReady = true;
		},
		methods: {
			/**
			 * @param {Object} pre 表示级别的参数  父级 空   子级 1 
			 * @param {Object} obj 接口参数
			 */
			async getData(obj) {
				let param = obj

				var [err, res] = await QueryRouteGuidsByMODCS(param)
				if (err) {
					console.error(err)
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					var tempArray = []
					if (res.data.success == true) {

						res.data.response.map((e, index) => {
							let element = Object.assign(e, {
								id: index_id,
								children: []
							})
							index_id++
							tempArray.push(element)
						})
						return tempArray
					} else {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
					}
				}
			},
			// 提交
			submit() {
				uni.showModal({
					content: '提交',
					showCancel: false
				})
			},
			// 后台请求 是否允许进衣
			async getCanEnter() {
				let param = {
					stationGuids: [],
					routeGuids: [],
					opCode: 0 // 0:   1:  -1:
				}
				var [err, res] = await SetStAssignByRouteGuids(param)

				if (err) {
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					console.log(res)
				}
			},
			// 因为这个函数是在Vue实例以外的地方调用，如果函数内部需要用到this，需要改成_self
			async loadNode(node, resolve) {
				// _self.xxx; 这里用_self而不是this
				console.log(_self)
				if (node.level === 0) {
					let data = await this.getData({})
					resolve(data);

				} else {
					if (node.level === 2) {
						let param = {
							StyleCode: node.parentId,
							MONO: node.data.name
						}
						//调用接口 获得 子项
						let res = await this.getData(param)
						res.map(e => {
							e.relation = e.name
							let names = e.name.split(',')
							// 移除 款号
							let last = names[names.length - 1]
							e.name = last
						})
						resolve(res)
					}
					if (node.level === 1) {
						let param = {
							StyleCode: node.data.name
						}
						//调用接口 获得 子项 
						let res = await this.getData(param)
						var MO = ''
						var temp = []
						res.map(e => {
							e.relation = e.name
							let names = e.name.split(',')
							// 移除 款号
							names.shift()
							e.name = names.shift().toString()
							// 若 names 数组还有剩余 说明这个item 还有颜色 和尺码
							if (names.length > 0) {
								e.children = [{
									name: names.toString, // 颜色
									Guids: e.Guids
								}]
							}
							if (MO != e.name) {
								temp.push(e)
								MO = e.name
							}
						})
						resolve(temp)
					}
					if (node.level === 3) {
						let para = node.data.relation.split(',')
						let param = {
							StyleCode: para[0],
							MONO: para[1],
							ColorName: para[2]
						}
						//调用接口 获得 子项
						let res = await this.getData(param)
						// return
						res.map(e => {
							let names = e.name.split(',')
							// 移除 款号
							let last = names[names.length - 1]
							e.name = last
							e.leaf = true
						})
						resolve(res)
					}
					if(node.level === 4) return resolve([])

				}
			},
			handleCheck(obj){
				console.log(obj)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;

		.bottom {
			margin: 10rpx;
			width: calc(100vw - 20rpx);
			position: fixed;
			bottom: 0;
		}
	}
</style>
