<template>
	<view class="container">
		<view class="top"></view> 
		<view class="mid">
			<view class="box">
					<view style="position: absolute;top: -50rpx;">友屿咨询师端</view>
					<button @click="comfirmValidator" class="button consultant">进入咨询室 <text class="content">-></text></button>
			</view>
		</view>
		<view class="bottom"></view>
	</view>
	<view class="page" v-if="visible">
		<view class="box">
			<view class="dialog-container">
				<view class="title">支持者服务手册</view>
				<view class="content">
					<li class="li"><text class="strong">1、对话开始前，请来访者阅读用户守则，对方确认后方可开始。</text></li>
					<li class="li"><text class="strong">2、恪守八条戒律与伦理守则：</text>不评断、不建议、不测、不问“为什么”、先处理情绪、关注此时此地、来访者自己负责、给予共情。</li>
					<li class="li"><text class="strong">3、放弃“救世主心态”。</text>我们能处理的只有他当下的情绪问题，实际问题我们只能尽力而为</li>
					<li class="li"><text class="strong">4、对方如果有让你又不舒服的地方，温柔且坚定的告诉对方原因并终止服务。</text></li>
					<li class="li"><text class="strong">5、注意语言的礼貌，及语气词的使用。</text>沟通言论中不得涉及任何违法、暴力、种族歧视、违反道德、侮辱、伤害等一系列的负面内容。</li>
					<li class="li"><text class="strong">6、不得以任何理由与来访者发生冲突。</text></li>
				</view>
				<button class="button" @click="navigate">确认</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {onMounted, ref} from 'vue'
	import {showInfo} from '../../utils/index.js'
	import {onLoad} from '@dcloudio/uni-app'
	import {suscribeApi} from '../../utils/api.js'
	import {useUserStore} from '@/store/index.js'
	import {storeToRefs} from 'pinia'
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const visible = ref(false)
	const comFirm = ref(false)
	function navigate(){
		const tmplIds =['IK18Knq0P-rDharivgecSmnaSIFkDUYXNEksOWDOjL0']
		uni.requestSubscribeMessage({
			desc:'',
			tmplIds,
			success:(res)=>{
				const status = res['IK18Knq0P-rDharivgecSmnaSIFkDUYXNEksOWDOjL0']
				
				if(status !== 'accept'){
				
				}
			},
			complete:(res)=>{
				
			}
		})
		uni.switchTab({
			url:'/pages/chatHall/chatHall'
		})
		visible.value = false
	}

	function comfirmValidator(){
		visible.value = true
		uni.hideTabBar()
	}
	onLoad(()=>{
		uni.hideTabBar()
	})
	
</script>

<style lang="scss" scoped>
	.container{
		width:100%;
		flex:1;
		height:100%;
		background-color: #f2f7ff;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: auto;
		overflow: hidden;
		box-sizing: border-box;
		.top{
			height:30%;
			background-color: #f2edf5;
		}
		.bottom{
			height:50%;
			background-color: #ffffff;	
		}
		.mid{
			position: absolute;
			left: 50%;
			top: 30%;	
			width:500rpx;
			transform: translate(-50%,-50%);
			z-index: 0;
			border-radius: 20rpx;
			z-index: 1;
			.box{
				width: 100%;
				height:100%;
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				z-index: 1;
				.button{
					width: 100%;
					height:100%;
					display: flex;
					justify-content: center;
					align-items: center;
					z-index: 2;
					background-color: #25c7b6 !important;
				}
			}
		}
	}
	.consultant{
		border-radius: 30rpx;
		background-color: #25c7b6;
		color: #ffffff;
		&::after{
			border: none;
		}
	}
	
	.page{
		width: 100vw;
		height: 100%;
		// background-color: pink;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 10;
		position: absolute;
		top: 0;
		.box{
			position: relative;
			width: 100%;
			height: 100%;
			.dialog-container{
				box-sizing: border-box;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				border-radius: 50rpx;
				padding: 50rpx;
				background-color: #ffffff;
				display: flex;
				flex-direction: column;
				width:80%;
				overflow: auto;
				.title{
					margin: auto;
					font-size: 40rpx;
					font-weight: bold;
				}
				.li{
					margin: 10rpx auto;
					.strong{
						color: black;				font-weight: bold;
					}
				}
				.strong{
					color: black;				font-weight: bold;
				}
				button{
					border-radius: 20rpx;
					background-color: $uni-btn-bg-color;
					color: #ffffff;
					display: flex;
					justify-content: center;
					align-items: center;
					&::after{
						border: none;
					}
				}
			}
		}
	
	}

	img{
		width:30rpx;
		height: 30rpx;
	}
	.emo-image {
		height: 40rpx;
		width: 40rpx;
		vertical-align: middle;
		display: inline-block;
  }
	
</style>