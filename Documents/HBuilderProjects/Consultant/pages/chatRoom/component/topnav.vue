<template>
	<view class="component">
		<view class="box">
			<view class="status-bar"></view>
			<view class="top-bar">
			<!-- userName,userAvator -->
				<view class="left" @click="backPage">
					<view class="icon iconfont icon-fanhuijiantou"></view>
					<view>消息</view>
				</view>
				<view class="middle">
					<view class="mid-box">
						<view class="name">
							{{fromUser.userName ? fromUser.userName : fromUser.consultantName}}
						</view>
					</view>		
				</view>
			</view>	
		</view>
	</view>
	
	<view class="block"></view>
</template>

<script setup>
	import {onMounted, toRefs,ref,reactive,computed} from 'vue'
	import {addSucideHotline} from '../../../utils/api.js'
	import {formatDate,showModal} from '../../../utils/index.js'
	import {useUserStore} from '../../../store/index.js'
	import {storeToRefs} from 'pinia'
	import {addChatInfo} from '../../../utils/api.js'
	import request from '../../../utils/request.js'
	import {getTopBarHeight,getNavigationBarSync,getTopBarHeightSync} from '../../../utils/index.js'
	const props = defineProps({
		fromUser:Object,
		personal:Boolean,
		
	})
	const userStore = useUserStore()
	const {userInfo } = storeToRefs(userStore)
	const topNavHeight = getNavigationBarSync()
	const statusHeight = ref(null)
	const {fromUser,personal,id} = toRefs(props)
	
	
	const topBarHeight = ref(0)
	const topBarHeightSync = getTopBarHeightSync()+'px'
	function backPage(){
		uni.navigateBack()
	}
	onMounted(async()=>{
		const top = await getTopBarHeight()
		topBarHeight.value = top+'px'
	})
</script>

<style lang="scss" scoped>
	@import '../../../style/common.scss';
	@import '../../../style/component.scss';
	.component{
		position: fixed;
		width:100%;
		height: v-bind(topBarHeightSync);
		background-color: #ededed;
		z-index: 1;
		box-sizing: border-box;
		.box{
			display: flex;
			flex-direction: column;
			width:100%;
			height: 100%;
			box-sizing: border-box;
		}
	}
	.block{
		height: v-bind(topBarHeight);
		width:100%;
		display: block;
	}
	.top-bar{
		display: flex;
		padding: 20rpx;
		
		width: 100%;
		flex:1;
		position: relative;
		align-items: flex-end;
		font-size: 34rpx;
		justify-content: space-between;
		box-sizing: border-box;
		.left{
			display: flex;
			align-items: center;
			box-sizing: border-box;
		}
		.middle{
			position: absolute;
			left: 50%;
			box-sizing: border-box;
		
			transform: translatex(-50%);
		}
	}
	.middle{
		width:auto;
		.mid-box{
			display: flex;
			justify-content: center;
			align-items: center;
			width:100%;
		}
	}
	.dialog2{
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		left:0;
		.box2{
			width:100%;
			height: 100%;;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			.mask2{
				width: 100vw;
				height: 100vh;
				background-color: rgba(0, 0, 0, 0.5);
				position: absolute;
				top: 0;
				left:0;
				z-index: 1;
			}
			.consultant-list{				
				border-radius: 50rpx;
				width:90%;
				height: 800rpx;
				background-color: #ffffff;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				z-index: 2;
				position: relative;
				
			}
		}
	}
	.consultant-item{
		display: flex;
		height:150rpx;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-bottom: 2rpx solid $uni-border-grey;
		box-sizing: border-box;
		.left{
			display: flex;
			width:100%;
			.name{
				display: flex;
				margin-left:20rpx;
				align-items: center;
				width:100%;
			}
			image{
				width:80rpx;
				height: 80rpx;
				border-radius: 100%;
			}
		}
		.right{
			display: flex;
			height:100%;
			align-items: center;
			
			.button{
				height:80rpx;
				line-height: 80rpx;
				width:120rpx;
				font-size:24rpx;
				margin:auto 10rpx;
			}
			
		}
	}
	.dialog{
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		left:0;
		
		.box{
			width:100%;
			height: 100%;;
			position: relative;
			display: flex;
			justify-content: center;
			.mask{
				width: 100vw;
				height: 100vh;
				position: absolute;
				top: 0;
				left:0;
				z-index: 1;
			}
			.btn-group{
				position: absolute;
				top:v-bind(topBarHeightSync);
				background-color: #ffffff;
				padding:30rpx 20rpx;
				display: flex;
				margin: auto;
				flex-direction: column;
				z-index: 2;
				border-radius: 15rpx;
				
				&::after{
					content: '';
					display: inline-block;
					height: 0;
					width: 0;
					border: 25rpx solid #ffffff;
					border-left: 25rpx solid transparent;
					border-right: 25rpx solid transparent;
					border-top: 25rpx solid transparent;
					position: absolute;
					left:50%;
					top:-40rpx;
					transform: translateX(-50%);
					border-radius: 20rpx;
				}
				.item{
					margin:10rpx auto;
					border-bottom: 2rpx solid $uni-border-grey;
				}
			}
		}
	}
	.status-bar{
		width:100%;
		height: var(--status-bar-height);
	}
	.footer{
		position: absolute;
		bottom: 20rpx;
		left: 50%;
		transform: translate(-50%);
	}
	.name{
		display: flex;
		align-items: center;
		font-size: 34rpx;
		box-sizing: border-box;
	}
</style>