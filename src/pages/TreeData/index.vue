<template>
	<view class="container">
		<uni-nav-bar fixed status-bar>
			<view class="center">站点方案分配</view>
			<view slot="left" @click="goback" class="icon-back">返回</view>
			<view slot="right"><text @tap="showHelp" class="marginR">&#xe677;</text></view>
		</uni-nav-bar>
		<view class="mx">
			<view class="primary white px py">
				当前选择的站点:
				<view class="row wrap">
					<li v-for="(item, index) in userSelectStations" :key="index" class="mx">{{ item.name }}</li>
				</view>
			</view>
			<ly-tree
				class="ly-tree mt"
				v-if="isReady"
				:props="props"
				node-key="id"
				:load="loadNode"
				lazy
				show-checkbox
				@check="handleCheck"
				@node-click="handleNodeClick"
				:expandOnCheckNode="false"
				:checkStrictly="true"
			/>
		</view>

		<button type="primary" class="bottom" @click="submit" :disabled="btnDisable">提交</button>
	</view>
</template>

<script>
import LyTree from '@/components/ly-tree/ly-tree.vue'
import { mapState, mapMutations } from 'vuex'
var _self
var index_id = 1
export default {
	components: {
		LyTree
	},
	data() {
		return {
			//为了确保页面加载完成后才去调用load方法，this指向正确
			isReady: false,
			props: {
				label: 'name',
				children: 'children',
				isLeaf: 'leaf'
			},
			btnDisable: false,
			selectRackGuids: new Set(),
			selectStationGuids: []
		}
	},
	onLoad() {
		_self = this
		this.isReady = true
	},
	mounted() {
		this.selectStationGuids = this.userSelectStations.map(item => item.guid)
	},
	methods: {
		goback() {
			uni.navigateBack({})
		},
		showHelp() {},
		handleNodeClick(obj) {
			let msg = {
				id: obj.data.id,
				name: obj.data.name
			}
		},
		/**
		 * @param {Object} pre 表示级别的参数  父级 空   子级 1
		 * @param {Object} obj 接口参数
		 */
		async getData(obj) {
			let param = obj
			let result = await this.$api.QueryRouteGuidsByMODCS(param)
			var tempArray = []
			result.data.response.map((e, index) => {
				let element = Object.assign(e, {
					id: index_id,
					children: []
				})
				index_id++
				tempArray.push(element)
			})
			return tempArray
		},
		// 提交
		submit() {
			let choose = Array.from(this.selectRackGuids)
			if (choose.length == 0) {
				uni.showModal({
					content: '没有勾选衣架',
					showCancel: false
				})
			} else {
				this.getCanEnter(choose, this.selectStationGuids)
			}
			//  防止按钮的多次点击
			this.btnDisable = true
			setTimeout(() => {
				this.btnDisable = false
			}, 1000)
		},
		// 后台请求 是否允许进衣
		getCanEnter(a, b) {
			let param = {
				stationGuids: b,
				routeGuids: a,
				opCode: 0 // 0:   1:  -1:
			}
			this.$api.SetStAssignByRouteGuids(param).then(res => {
				uni.showLoading({})
				setTimeout(() => {
					uni.hideLoading()
					uni.redirectTo({
						url: '/pages/ProInfo/ProInfo'
					})
				}, 500)
			})
		},
		// 因为这个函数是在Vue实例以外的地方调用，如果函数内部需要用到this，需要改成_self
		async loadNode(node, resolve) {
			// _self.xxx; 这里用_self而不是this
			if (node.level === 0) {
				let data = await this.getData({})
				resolve(data)
			} else {
				if (node.level === 2) {
					let canshu = node.data.relation.split(',')
					let param = {
						StyleCode: canshu[0],
						MONO: canshu[1]
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
							e.children = [
								{
									name: names.toString, // 颜色
									Guids: e.Guids
								}
							]
						}
						if (MO != e.name) {
							temp.push(e)
							MO = e.name
						} else {
							temp.filter(item => {
								if (item.name == e.name) {
									e.Guids.map(i => {
										item.Guids.push(i)
									})
								}
							})
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
				if (node.level === 4) return resolve([])
			}
		},
		handleCheck(obj) {
			let checkedGuids = new Set()

			obj.checkedNodes.forEach(e => {
				e.Guids.forEach(v => {
					checkedGuids.add(v)
				})
			})

			this.selectRackGuids = checkedGuids
		}
	},
	computed: {
		...mapState(['userSelectStations'])
	}
}
</script>

<style lang="scss" scoped>
.container {
	width: 100vw;

	.ly-tree {
		background-color: #e3e3e3;
	}

	.bottom {
		margin: 10rpx;
		width: calc(100vw - 20rpx);
		position: fixed;
		bottom: 0;
		z-index: 10;
	}

	uni-nav-bar {
		z-index: 2;
	}
}
</style>
