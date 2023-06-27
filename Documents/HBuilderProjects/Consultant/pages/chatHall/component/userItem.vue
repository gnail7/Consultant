<template>
	<view class="component" @click="toChatRoom" @longpress="operate">
		<view class="left">
			<image :src="item.fromUser.userAvatar" v-if="item.fromUser.userAvatar"></image>
			<image src="../../../static/image/logo.jpg" v-else></image>
			<view class="tag" v-if="unread">{{unread}}</view>
		</view>
		<view class="content">
			<view class="username">{{item.fromUser.userName}}</view>
			<view class="signature">
				<view v-if="lastWordInfo && lastWordInfo.type === 'text'" v-html="lastWordInfo.wordText"></view>
				<view v-else-if="lastWordInfo && lastWordInfo.type === 'image'">[图片]</view>
				<view v-else-if="lastWordInfo && lastWordInfo.type === 'video'">[视频]</view>
				<view v-else-if="lastWordInfo && lastWordInfo.type === 'voice'">[语音]</view>
				<view v-else>{{`您与"${item.fromUser.userName}"可以开始聊天啦！`}}</view>
			</view>
		</view>
		<view class="time" v-if="!item.endTime">
			{{ lastWordInfo ? lastWordInfo.wordTime.slice(0,-3) : item.startTime.slice(0,-3) }}
		</view>
		<view class="time end" v-else-if="item.endTime && !item.hasEnd" >
			<span style="color:red">结束时间:{{item.endTime}}</span>
		</view>
		<view class="end">
			<view class="icon iconfont icon-zixun" style="font-size: 45rpx;"></view>
		</view>
	</view>
</template>

<script setup>
	/**
	 * wordText : id,read,wordTime
	 * 
	 */
	import {computed, onMounted, onUnmounted, toRefs, watch} from 'vue'
	import {useUserStore} from '../../../store/index.js'
	import {storeToRefs} from 'pinia'
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const props = defineProps({
		item:Object,
		id:String
	})
	const {item,id} = toRefs(props)
	// const {fromUser,wordInfoList,id,endTime} = toRefs(item.value)
	const lastWordInfo = computed(()=>{
		if(item.value.wordInfoList === [] || !item.value.wordInfoList){
			return null
		}
		return item.value.wordInfoList[item.value.wordInfoList.length-1]
	})
	// const unread = computed(()=>(item.value.wordInfoList.filter(ele=>!ele.hasRead)).length)
	const unread = computed(()=>(item.value.wordInfoList.filter(ele=>(!ele.hasRead&&ele.sendId!==userInfo.value.consultantId))).length)
	function toChatRoom(){
		if(!item.value.endTime){
			const i = JSON.stringify({...item.value,personal:false,wordInfoList:[]})
			uni.navigateTo({
				url:`/pages/chatRoom/chatRoom?item=${encodeURIComponent(i)}`
			})
		}
	}

	onUnmounted(()=>{
		uni.$emit(`consultHasEnd${item.value.id}`,true)
	})
	
	watch(()=>item.value.wordInfoList,(newValue,oldValue)=>{
		uni.$emit(`updateWordInfoList${item.value.id}`,newValue)
	})
</script>

<style lang="scss" scoped>
	@import '../../../uni.scss';
	.component{
		display: flex;
		height: 130rpx;
		background-color: #ffffff;
		align-items: center;
		position: relative;
		font-size: 28rpx;
		margin: auto 20rpx;
		box-sizing: border-box;

		.content{
			flex: 1;
			height: 80rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			padding-bottom: 10rpx;
			border-bottom: 4rpx solid $uni-border-grey;
		}
		.left{
			margin-right: 10rpx;
			position: relative;
		}
		.time{
			position: absolute;
			right: 0rpx;
			top: 20rpx;;
			color:$uni-bg-color-grey;
			font-size: 24rpx;
		}
		.end{
			position: absolute;bottom: 20rpx;right: 10rpx;
		}
	}
	:deep(.emo-image ){
		height: 28rpx !important;
		width: 28rpx !important;
		vertical-align: middle !important;
		display: inline-block !important;
	  }
	.content{
		.username{
			font-weight: bold;
		}
		.signature{
		box-sizing: border-box;
		width: 60vw;
		overflow: hidden;
		color:$uni-bg-color-grey;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		
		}	
	}
	image{
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	.tag{
		position: absolute;
		top: -5rpx;
		right: -5rpx;
		background-color: #f74c3f;
		color: #ffffff;
		font-size: 22rpx;
		width:30rpx;
		height: 30rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>