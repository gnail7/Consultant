<template>
	<view class="component" @click="toChatRoom" @longpress="operate">
		<view class="left">
			<image :src="userA.type ? userA.userAvatar : userA.consultantAvatar" v-if="userA.userAvatar || userA.consultantAvatar"></image>
			<image src="../../../static/image/logo.jpg" v-else></image>
			<view class="tag" v-if="unread">{{unread}}</view>
		</view>
		<view class="content">
			<view class="username">{{userA.type ? userA.userName : userA.consultantName}}<text style="color: #909399;">(私聊)</text></view>
			<view class="signature">
				<view v-if="lastWordInfo && lastWordInfo.type === 'text'" v-html="lastWordInfo.wordText"></view>
				<view v-else-if="lastWordInfo && lastWordInfo.type === 'image'">[图片]</view>
				<view v-else-if="lastWordInfo && lastWordInfo.type === 'video'">[视频]</view>
				<view v-else-if="lastWordInfo && lastWordInfo.type === 'voice'">[语音]</view>
				<view v-else>{{`您与"${userA.type ? userA.userName : userA.consultantName}"可以开始私聊啦！`}}</view>
			</view>
		</view>
		<view class="time" v-if="!endTime">
			{{ lastWordInfo ? lastWordInfo.wordTime.slice(0,-3) : startTime.slice(0,-3) }}
		</view>
		<view class="end">
			<view class="icon iconfont icon--siliaoshezhi" style="font-size: 45rpx;"></view>
		</view>
	</view>
</template>

<script setup>
	/**
	 * wordText : id,read,wordTime
	 * 
	 */
	import {useUserStore} from '@/store/index.js'
	import {storeToRefs} from 'pinia'
	import {computed, onMounted, toRefs, watch} from 'vue'
	const props = defineProps({
		wordInfoList:{
			type:Array,
			default:[]
		},
		item:Object,
		userA:Object,
		startTime:{
			type:String,
			default:''
		},
		endTime:{
			type:String,
			default:''
		},
		hasEnd:{
			type:Boolean,
			default:false
		},
		id:String
	})
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const {userA,wordInfoList,id,startTime,endTime,hasEnd,item} = toRefs(props)
	const anotherUser = computed(()=>{
		if(item.value.userA.consultantId && (item.value.userA.consultantId === userInfo.value.consultantId)){
			return item.value.userB
		}
		return item.value.userA
	})
	const lastWordInfo = computed(()=>{
		if(wordInfoList.value === [] || !wordInfoList.value){
			return null
		}
		return wordInfoList.value[wordInfoList.value.length-1]
	})
	const unread = computed(()=>(wordInfoList.value.filter(ele=>(!ele.hasRead&&ele.sendId!==userInfo.value.consultantId))).length)
	function toChatRoom(){
		const obj = {fromUser:userA.value,wordInfoList:[],id:id.value,personal:true,userA:anotherUser.value}
		const i = JSON.stringify(obj)
		uni.navigateTo({
			url:`/pages/chatRoom/chatRoom?item=${encodeURIComponent(i)}`
		})
	}
	watch(wordInfoList,(newValue,oldValue)=>{
		uni.$emit(`updateWordInfoList${id.value}`,newValue)
	})
	function operate(){
	}
	onMounted(()=>{
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