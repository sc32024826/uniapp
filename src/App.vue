<script>
	import * as dd from "dingtalk-jsapi"

	export default {
		onLaunch: function() {
			//#ifdef H5
			let env = dd.env.platform
			if (env != 'notInDingTalk') {
				dd.biz.navigation.hideBar({
					hidden: true
				})
			}
			//#endif

		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	/* 头条小程序需要把 iconfont 样式放到组件外 */
	/* @import "components/m-icon/m-icon.css"; */
	@import './static/common.css';
	@import './style.scss';

	/*每个页面公共css */
	page {
		min-height: 100%;
		display: flex;
		font-size: 14px;
		font-family: 'iconfont';
		font-style: normal;
		padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
	}

	/* #ifdef MP-BAIDU */
	page {
		width: 100%;
		height: 100%;
		display: block;
	}

	swan-template {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* 原生组件模式下需要注意组件外部样式 */
	custom-component {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */

	/* #ifdef MP-ALIPAY */
	page {
		min-height: 100vh;
	}

	/* #endif */

	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		/* min-height: 100%; */
		display: flex;
		flex: 1;
	}

	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.input-group {
		background-color: #ffffff;
		margin-top: 20px;
		position: relative;
	}

	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
		font-size: 18px;
		line-height: 40px;
	}

	.input-row .title {
		width: 72px;
		padding-left: 15px;
	}

	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 8px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.btn-row {
		margin-top: 25px;
		padding: 10px;
	}

	button.primary {
		background-color: #0fbcf9;
	}

	.debug {
		border: solid 1rpx red;
	}

	.column {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
		flex-direction: row;
	}

	.between {
		justify-content: space-between;
	}

	.around {
		justify-content: space-around;
	}

	.cycle {
		animation: turn 1s linear infinite;
		-webkit-animation: turn 1s linear infinite;

	}

	/* 
	      turn : 定义的动画名称
	      1s : 动画时间
	      linear : 动画以何种运行轨迹完成一个周期
	      infinite :规定动画应该无限次播放
	     */
	@keyframes turn {
		0% {
			transform: rotate(0deg);
			-webkit-transform: rotate(0deg);
		}

		25% {
			transform: rotate(90deg);
			-webkit-transform: rotate(90deg);
		}

		50% {
			transform: rotate(180deg);
			-webkit-transform: rotate(180deg);
		}

		75% {
			transform: rotate(270deg);
			-webkit-transform: rotate(270deg);
		}

		100% {
			transform: rotate(360deg);
			-webkit-transform: rotate(360deg);
		}
	}
	$topm : calc(var(--status-bar-height) + 35px);
	.status_bar {  
	    height: $topm;  
	    width: 100%;  
	    background-color: #F8F8F8;  
	}  
	.top_view {  
	    height: $topm;  
	    width: 100%;  
	    position: fixed;  
	    background-color: #F8F8F8;  
	    top: 0;  
	    z-index: 999;  
	}
</style>
