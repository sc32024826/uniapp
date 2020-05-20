<template>
	<view class="warp">
		<view class="box">
			<t-table>
				<t-tr>
					<t-th>生产单</t-th>
					<t-th>款号</t-th>
					<t-th>颜色</t-th>
				</t-tr>
				<t-tr v-for="(v,i) in tableData" :key="i">
					<view class="flex row" @click="ontab(v.MO)">
						<t-td>{{v.MO}}</t-td>
						<t-td>{{v.styleNO}}</t-td>
						<t-td>{{v.color}}</t-td>
					</view>
				</t-tr>
			</t-table>
		</view>
		<e-modal :visible.sync="visible" @cancel="handleCancel" class="modal">
			<view class="title">为生产单号:{{modal.mo}}指派任务</view>
			<uniList class="uni-list">
				<checkbox-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item,i) in modal.items" :key="i">
						<uni-list-item>
							<view>
								<checkbox :value="item.value" :checked="item.checked" />
							</view>
							<view>{{item.name}}</view>
						</uni-list-item>
					</label>
				</checkbox-group>
			</uniList>
			<button type="primary" @click="submit">确认</button>
		</e-modal>
	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	export default {
		components: {
			tTable,
			tTh,
			tTr,
			tTd,
			uniList,
			uniListItem
		},
		data() {
			return {
				tableData: [{
					MO: '163000009401',
					styleNO: '1111',
					color: '红色'
				}, {
					MO: '163000009402',
					styleNO: '1111',
					color: '红色'
				}, {
					MO: '163000009403',
					styleNO: '1111',
					color: '红色'
				}],
				visible: false,
				modal: {
					mo: '',
					items: [{
							value: '1',
							name: '分组1',
							checked: true
						},
						{
							value: '2',
							name: '分组2',
							checked: true
						},
						{
							value: '3',
							name: '分组3',
							checked: false
						}
					]
				},

			}
		},
		methods: {
			ontab(data) {
				console.log('款号:', data)
				this.visible = true
				this.modal.mo = data
				// 请求分组数据
				// this.modal.items = {}
			},
			handleCancel() {
				this.visible = false
			},
			checkboxChange() {
				console.log('改变值')
			},
			submit() {
				this.visible = false
				// 提交任务指派
				console.log(this.modal)
				// 提交完毕后 清空 modal 对象
				this.modal = {}
			}
		},
		// 下拉刷新 事件停止
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>

<style>
	.warp {
		width: 100%;
		font-size: 40rpx;
		font-weight: bold;
	}

	.flex {
		display: flex;
		width: 100%;
	}

	.column {
		flex-direction: column;
	}

	.title {
		text-align: center;
		font-size: 30px;
		border-bottom: solid 1px #000000;
		font-weight: bold;
	}

	.line {
		border-bottom: solid 1px #000000;
		text-align: center;
		font-size: 40rpx;
		font-weight: bold;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
