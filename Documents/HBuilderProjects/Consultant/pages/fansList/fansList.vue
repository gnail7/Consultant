<template>
	<view class="page">
		<view class="item" v-for="item in data.fansList" :key="item.id">
			<view class="left">
				<view class="avatar">
					<image :src="item.userAvatar"></image>
				</view>
				<view class="info-box">
					<view class="username">{{item.userName}}<view class="icon iconfont " :class="item.gender==='男'?'icon-nan':'icon-xingbienv'"></view></view>
					<view class="signature">{{item.signature ? item.signature : '这个人很懒什么都没有留下～'}}</view>
				</view>
			</view>
			<view class="right">
				<button class="button" @click="addPersonalChat(item)">私信</button>
			</view>
		</view>
	</view>
	<view v-if="data.fansList.length===0" class="empty">
		<image src="../../static/image/empty.png" style="width: 500rpx;" mode="widthFix"></image>
	</view>
</template>

<script setup>
	import {ref,onMounted,reactive} from 'vue'
	import {useUserStore} from '../../store/index.js'
	import {storeToRefs} from 'pinia'
	import {getFansUser,addChatInfo} from '../../utils/api.js'
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const data = reactive({
		fansList:[]
	})
	//userName,userAvatar,gender,signature,age
	onMounted(async()=>{
		const r = await getFansUser(userInfo.value)
		if(r){
			data.fansList = r
		}
	})
	async function addPersonalChat(item){
		console.log('item',item)
		const r = await addChatInfo({userAId:item.userId,userBId:userInfo.value.consultantId})
		if(r){
			uni.showToast({
				title:'私聊成功'
			})
			setTimeout(()=>{
				uni.switchTab({
					url:'/pages/chatHall/chatHall'
				})
			},1000)
			
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../style/component.scss';
	.page{
		width: 100vw;
		height: 100vh;
		font-size: 28rpx;
		background-color: #f8f8f8;
		padding-top: 20rpx;
		box-sizing: border-box;
		.item{
			width: 100%;
			height: 130rpx;
			display: flex;
			box-sizing: border-box;
			padding: 20rpx;
			margin: auto 20rpx;
			justify-content: space-between;
			border-bottom: 5rpx solid #ededed;
			.left{
				display: flex;
				.avatar{
					image{
						width:80rpx;
						height: 80rpx;
						border-radius: 100%;
					}
				}
				.info-box{
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					.username{
						display: flex;
					}
					.signature{
						font-size: 25rpx;
						color: #909399;
					}
				}
			}
			.right{
				margin-right:20rpx;
				.button{
					background-color: #ffffff;
					color: #852742;
					border: 2rpx solid #852742;
					border-radius: 24rpx;
				}
			}
		}
	}
	.empty{
		position: absolute;
		top: 0%;
		left: 0%;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		
	}
</style>
