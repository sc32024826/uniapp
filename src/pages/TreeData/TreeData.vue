<template>
	<view class="container">
		<!-- <mix-tree :list="treeData" @treeItemClick="treeItemClick"></mix-tree> -->
		<block v-for="(v,i) in treeData" :key="i">
			<view class="list row" @click="showChild(i,v)">
				<block><text :class="v.open ? 'rotate-ani':'rotate-ani-rev'">&#xe65c;</text>{{v.name}}</block>
				<text class="cycle center" v-show="v.loading">&#xe613;</text>
			</view>
			<block>
				<view class="children">
					<view v-for="(val,index) in v.children" :key="index" :class="v.open ? 'open-ani':'open-ani-rev'"
					 @click="showChild2(val,index)">
						<view>
							<text :class="val.open ? 'rotate-ani':'rotate-ani-rev'">&#xe65c;</text>
							{{val.name}}<text class="cycle center" v-show="val.loading">&#xe613;</text>
						</view>
					</view>
				</view>
			</block>
		</block>
	</view>
</template>

<script>
	import { QueryRouteGuidsByMODCS } from '@/api/api.js'
	// import mixTree from '@/components/mix-tree/mix-tree';
	export default {
		components: {
			// mixTree
		},
		data() {
			return {
				response: [],
				// ready: false,
				treeData: []
			}
		},
		methods: {
			/**
			 * @param {Object} pre 表示级别的参数  父级 空   子级 1 
			 * @param {Object} obj 接口参数
			 */
			async getData(pre, obj) {
				console.log('请求一次')
				let param = obj

				var [err, res] = await QueryRouteGuidsByMODCS(param)
				if (err) {
					console.error(err)
					uni.showModal({
						content: err,
						showCancel: false
					})
				} else {
					// console.log(res)
					var tempArray = []
					if (res.data.success == true) {
						res.data.response.map((e, index) => {
							let element = Object.assign(e, {
								id: Number(pre + String(index + 1)),
								children: [],
								open: false, // 展开状态标识 open 标识展开
								loading: false //
							})
							tempArray.push(element)
						})
						console.log(tempArray)
						return tempArray
					} else {
						uni.showModal({
							content: res.data.msg,
							showCancel: false
						})
					}
				}
			},
			// 点击款号 展开子项
			async showChild(i, obj) {
				// 点击后 显示加载动画
				// 已经获得数据 只展开或者这折叠
				if (this.treeData[i].children.length > 0) {
					this.treeData[i].open = !this.treeData[i].open
					return
				} else {
					this.treeData[i].loading = true
				}
				console.log(i)
				console.log(obj)
				let param = {
					StyleCode: obj.name
				}
				let res = await this.getData('1', param)
				console.log(res)
				this.treeData[i].children = res
				this.treeData[i].loading = false
				this.treeData[i].open = !this.treeData[i].open
			},
			showChild2(v, i) {
				console.log(v)
				console.log(i)
			},
			async setData() {
				this.treeData = await this.getData('', {})
			},
			treeItemClick(item) {
				let { id, name, parentId } = item
				uni.showModal({
					content: `点击了${parentId.length+1}级菜单, ${name}, id为${id}, 父id为${parentId.toString()}`
				})
				console.log(item)
			}
		},
		mounted() {
			this.setData()
		}
	}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;
		padding: 5rpx;

		.list {
			margin-bottom: 5rpx;
			background-color: #55aaff;
			color: white;
			font-size: 40rpx;
			height: 80rpx;
			align-items: center; // 垂直居中
		}

		.children {
			margin-left: 50rpx;
			z-index: 2;
		}
	}

	.center {
		margin-left: 40rpx;
	}

	// 展开动画
	.open-ani {
		display: flex;
		flex-direction: column;
		height: 80rpx;
		justify-content: center;
		background-color: #5ddaff;
		margin-bottom: 5rpx;
		z-index: 1;
		overflow: hidden;
		animation: open 0.5s ease 1;
		-webkit-animation: open 0.5s ease 1;
	}
	.open-ani-rev {
		height: 0rpx;
		overflow: hidden;
		animation: open_rev 0.5s ease 1;
		-webkit-animation: open_rev 0.5s ease 1;
	}

	.rotate-ani {
		animation: rotate 0.5s ease 1;
		-webkit-animation: rotate 0.5s ease 1;
	}
	.rotate-ani-rev {
		transform: rotate(-90deg);
		-webkit-transform: rotate(-90deg);
		animation: rotate_rev 0.5s ease 1;
		-webkit-animation: rotate_rev 0.5s ease 1;
	}
	.right{
		transform: rotate(-90deg);
		-webkit-transform: rotate(-90deg);
		font-size: 40rpx;
	}

	@keyframes open {
		from {
			opacity: 0;
			height: 0rpx;
		}

		to {
			opacity: 1;
			height: 80rpx;
		}
	}
	@keyframes open_rev {
		from {
			opacity: 1;
			height: 80rpx;
		}
	
		to {
			opacity: 0;
			height: 0rpx;
		}
	}

	@keyframes rotate {
		0% {
			transform: rotate(-90deg);
			-webkit-transform: rotate(-90deg);
		}

		100% {
			transform: rotate(0deg);
			-webkit-transform: rotate(0deg);
		}
	}
	@keyframes rotate_rev {
		0% {
			transform: rotate(0deg);
			-webkit-transform: rotate(0deg);
		}
	
		100% {
			transform: rotate(-90deg);
			-webkit-transform: rotate(-90deg);
		}
	}
</style>
