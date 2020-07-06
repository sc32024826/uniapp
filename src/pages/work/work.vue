<template>
	<view class="warp">
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
						MO: '163000009401',
						styleNO: '1111',
						color: '红色'
					},
					{
						MO: '163000009402',
						styleNO: '1111',
						color: '红色'
					},
					{
						MO: '163000009403',
						styleNO: '1111',
						color: '红色'
					},
					{
						MO: '163000009402',
						styleNO: '1111',
						color: '红色'
					},
					{
						MO: '163000009402',
						styleNO: '1111',
						color: '红色'
					},
					{
						MO: '163000009402',
						styleNO: '1111',
						color: '红色'
					},
					{
						MO: '163000009402',
						styleNO: '1111',
						color: '红色'
					},
					{
						MO: '163000009402',
						styleNO: '1111',
						color: '红色'
					},
					{
						MO: '163000009402',
						styleNO: '1111',
						color: '红色'
					}
				],
				visible: false,
				modal: {
					mo: '',
					items: [{
							name: '分组1',
							checked: true
						},
						{
							name: '分组2',
							checked: true
						},
						{
							name: '分组3',
							checked: false
						}
					]
				},
				loadingType: 0,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				showMore: false // 控制 上拉刷新的显示
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
			},
			// 列表数据
			getTableData() { //第一次回去数据
				_self.loadingType = 0;
				uni.showNavigationBarLoading();
				uni.request({
					url: 'api地址',
					method: 'POST',
					data: {
						//请求参数
					},
					success: function(res) {
						console.log(res.data.data)
						_self.hotRecommendlist = res.data.data.response;
						if (res.data.data.totalcount == res.data.data.response.length) {
							uni.showToast({
								title: '已是最新',
								duration: 2000
							});
						}
						uni.hideNavigationBarLoading(); //关闭加载动画
						uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
					}
				})
			}
		},
		onLoad: function() {
			
		},
		// 下拉刷新 事件停止
		onPullDownRefresh: function() {
			console.log('refresh');
			// 重新获取数据
			// this.getTableData()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		// 上拉加载
		onReachBottom: function() {
			page++; //每触底一次 page +1
			// console.log(_self.hotRecommendlist.length);
			if (_self.loadingType != 0) { //loadingType!=0;直接返回
				return false;
			}
			_self.loadingType = 1;
			// console.log(page);
			uni.showNavigationBarLoading(); //显示加载动画
			uni.request({
				url: '地址',
				method: 'POST',
				data: {
					"trandate": 1534730538050,
					"requestinfo": {
						"riskkind": "", //产品类型
						"hot": "Y", //是否热点 Y/N
						"iscommend": "", //是否推荐 Y/N
						"productname": "", //产品名称
						"suppliername": "", //保险公司名称
						"channeltype": "", //渠道
						"ispublish": "Y", //是否上架 Y/N
						"productcode": "", //产品编码
						"start_date": "", //查询产品区间开始时间 
						"end_date": "", //查询产品区间结束时间
						"pageno": page, //页码，整数大于0，必填
						"pagesize": 1 //每页显示条数，整数大于0必填
					}
				},
				success: function(res) {
					if (_self.hotRecommendlist.length == res.data.data.totalcount) { //没有数据
						_self.loadingType = 2;
						uni.hideNavigationBarLoading(); //关闭加载动画
						return false;
					}
					for (var i = _self.hotRecommendlist.length; i < res.data.data.totalcount; i++) {
						_self.hotRecommendlist = _self.hotRecommendlist.concat(res.data.data.response[i - 1]); //将数据拼接在一起
					}
					_self.loadingType = 0; //将loadingType归0重置
					uni.hideNavigationBarLoading(); //关闭加载动画

				}
			})
		}
	}
</script>

<style>
	.warp {
		width: 100%;
	}

	.table {
		font-size: 40px;
		font-weight: bold;
	}

	.flex {
		display: flex;
		width: 100%;
	}

	.title {
		text-align: center;
		font-size: 30px;
		border-bottom: solid 1px #000000;
		font-weight: bold;
	}

	.container {
		padding: 5px;
	}

	.loading-text {
		width: 100%;
		text-align: center;
		position: absolute;
		bottom: 10px;
	}
</style>
