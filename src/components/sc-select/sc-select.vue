<template>
	<view class="Container row" @click.stop="close" @touchmove.stop.prevent>
		<view class="search column" @click.stop>
			<input placeholder="请输入款号" class="full-width al-c" v-model="styleNo" />
			<input placeholder="请输入客户名称" class="full-width al-c" v-model="custom" />
			<view class="row a-i full-width al-c">
				<text class="bd wd50">交期:</text>
				<view class="wd50">
					<picker mode="date" @change="changeTime" :value="date" :start="startDate" :end="endDate">
						<view class="uni-input">{{ date }}</view>
					</picker>
				</view>
			</view>
			<view class="row a-i full-width al-c">
				<text class="bd wd50">状态ID:</text>
				<view class="wd50"><slider :value="stateID" @change="sliderChange" show-value min="1" max="4" /></view>
			</view>
			<view class="full-width al-c row a-i">
				<text class="bd wd50">版单标记:</text>
				<view class="wd50"><switch :value="checked" :size="30" @change="checkChange"></switch></view>
			</view>
			<view class="row full-width">
				<button type="primary" @click="reSearch">搜索</button>
				<button type="default" @click="cancel">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		const currentDate = this.getDate({
			format: true
		})
		return {
			styleNo: '', // 款号
			custom: '', //客户
			checked: false, // 版单标记
			stateID: 1, //状态ID
			date: currentDate,
			time: currentDate
		}
	},
	methods: {
		close() {
			this.$emit('close')
		},
		// 重新检索数据
		reSearch() {
			let data = {
				StyleNo: this.styleNo,
				CustomerName: this.custom,
				time: new Date(this.time).getTime() / 1000,
				StatusID: this.stateID,
				IsSample: this.checked
			}
			this.$emit('reSearch', data)
			this.$emit('close')
		},
		// 取消返回
		cancel() {
			this.close()
		},
		checkChange(e){
			this.checked = e.detail.value
		},
		sliderChange(e) {
			this.stateID = e.detail.value
		},
		changeTime(e) {
			this.time = e.detail.value
		},
		getDate(type) {
			const date = new Date()
			let year = date.getFullYear()
			let month = date.getMonth() + 1
			let day = date.getDate()
			if (type === 'start') {
				year = year - 10
			} else if (type === 'end') {
				year = year + 2
			}
			month = month > 9 ? month : '0' + month
			day = day > 9 ? day : '0' + day
			return `${year}-${month}-${day}`
		}
	},
	created() {},
	computed: {
		startDate() {
			return this.getDate('start')
		},
		endDate() {
			return this.getDate('end')
		}
	}
}
</script>

<style lang="scss" scoped>
.Container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba($color: #555555, $alpha: 0.8);
	justify-content: center;
	.search {
		padding: 20rpx;
		margin-top: 44px;
		background-color: white;
		height: 70%;
		width: 70%;
		animation: show 0.5s linear;
		-webkit-animation: show 0.5s linear;
		-o-animation: show 0.5s linear;
		-ms-animation: show 0.5s linear;
		-moz-animation: show 0.5s linear;
		justify-content: space-between;
		align-items: center;
		button {
			width: 100%;
			margin: 10rpx 20rpx;
		}
		.slider {
		}
	}
}
@keyframes show {
	from {
		transform: translateY(-200px);
		-ms-transform: translateY(-200px); /* IE 9 */
		-moz-transform: translateY(-200px); /* Firefox */
		-webkit-transform: translateY(-200px); /* Safari 和 Chrome */
		-o-transform: translateY(-200px); /* Opera */
	}
	to {
		transform: translateY(0px);
		-ms-transform: translateY(0px); /* IE 9 */
		-moz-transform: translateY(0px); /* Firefox */
		-webkit-transform: translateY(0px); /* Safari 和 Chrome */
		-o-transform: translateY(0px); /* Opera */
	}
}
</style>
