<template>
	<view class="page">
		<view class="component">
			<view class="box">
				<view class="status-bar"></view>
				<view class="top-bar">
					<view class="top-bar-right ">
						<view class="icon iconfont icon-home" @click="backToHome"></view>
					</view>
					<view class="middle">友屿咨询端</view>
				</view>
			</view>
		</view>
		<view class="block"></view>
		
		<view class="main" >
			<loading :loading="isLoading" style="z-index: 12;"/>
			<user-item v-for="(item,index) in data.consultantionList" :key="item.id" :item="item"></user-item>
			<personal-chat 
			v-for="(item,index2) in data.personalChatList" 
			:key="item.id"
			:wordInfoList="item.chatRecords"
			:userA="computedUserA(item)"
			:id="index2+'x'"
			:item="item"
			/>
			<view v-if="!data.consultantionList || ((data.consultantionList.length === 0) && data.personalChatList.length === 0)" style="position: absolute;top: 30%;left:50%;transform: translate(-50%)">暂时没有消息~</view>
		</view>
	</view>
</template>

<script setup>
	import { onLoad,onShow,onUnload} from "@dcloudio/uni-app"
	import {reactive,nextTick, computed, watch,ref, toRefs, onMounted} from 'vue'
	import {useUserStore} from '../../store/index.js'
	import {storeToRefs} from 'pinia'
	import loading from '../../directives/loading.vue'
	import gInput from '@/components/input/gInputItem.vue'
	import request from "../../utils/request"
	import userItem from "./component/userItem.vue"
	import personalChat from './component/personalChat.vue'
	import {getNavigationBarSync,getTopBarHeight, getTopBarHeightSync} from '../../utils/index.js'

	const data = reactive({
		consultantionList:[],
		personalChatList:[]
	})
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const isLoading = computed(()=>{
		if(!loading1.value && !loading2.value){
			return false
		}
		return true
	})
	function computedUserA(item){
		if(item.userA.consultantId && item.userA.consultantId === userInfo.value.consultantId){
			return item.userB
		}
		return item.userA
	}
	const loading1 = ref(true)
	const loading2 = ref(true)
	const topNavHeight = computed(()=>getNavigationBarSync()+'px')
	const topBarHeight = computed(()=>getTopBarHeightSync()+'px')
	const statusHeight = computed(()=>getTopBarHeightSync()-getNavigationBarSync()+'px')
	onUnload(()=>{
		uni.$off('getWordInfoList')
		socket.normalCloseFlag = true
		heartBeatReset()
		socket.socketTask.close()
		socket.socketTask = null
	})
	function backToHome(){
		uni.reLaunch({
			url:'/pages/index/index'
		})
	}
	function compare(wordInfoList){
		//wordInfoList
		const length = wordInfoList.length
	    return function(a,b){
	        var value1 = a.wordInfoList[length-1];
	        var value2 = b.wordInfoList[length-1];
	        return value1 - value2;
	    }
	}
	// #region socket
	const socket = reactive({
		socketTask:null,
		socketOpen:false,//websocket的连接状态
		reconnectTimer:null,
		normalCloseFlag:false,
		maxReconnectMaxTime: 20,
		reconnectTime:0,
		timeoutObj: null,
		first:true
	})
	function changeSubMenu(){
		hidden.value = !hidden.value
	}
	onLoad(async(option)=>{
		data.consultantionList = uni.getStorageSync('wordinfolist') ||[]
		function onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		        
		    }
		    return {
		        title: '友屿咨询端', //分享的名称
		        path: '/pages/login/login',
		        mpId:'wx712d7eb0b873518e' //此处配置微信小程序的AppId
		    }
		}
		//分享到朋友圈
		function onShareTimeline(res) {
		    return {
		        title: '友屿咨询端',
		        type: 0,
		        summary: "",
		    }
		}
		uni.$on('getWordInfoList',(res)=>{
			data.consultantionList = res || []
			userStore.changeConsultNums(data.consultantionList.length)
			loading1.value = false
		})
		socket.socketTask = uni.connectSocket({
			url:'wss://zzpbzx.com:8854/getConsultantChatList',
			success: () => {
				
			}
		})
		socket.socketTask.onOpen((res)=>{
			clearInterval(socket.reconnectTimer)
			socket.first = false
			heartBeatReset()
			socket.socketOpen = true
			socket.reconnectTime = 1
			sendSocketMessage()
			heartBeatStart()
		})
		socket.socketTask.onMessage((res)=>{
			res = JSON.parse(res.data) || []
			data.personalChatList = res
			loading2.value = false
			uni.setStorageSync('personalList',res)
		})
		socket.socketTask.onError((e)=>{
			
		})
		socket.socketTask.onClose((e)=>{
			socket.socketOpen = false
			onReconnect(e)
		})
	
	})
	onMounted(()=>{
		setTimeout(()=>{
			if(!loading1.value || !loading2.value){
				loading2.value = false
				loading1.value = false
			}
		},2000)
	})
	function sendSocketMessage(){
		const obj  = {personId:userInfo.value.consultantId}
		if(socket.socketOpen){
			socket.socketTask.send({
				data:JSON.stringify(obj),
			})
		}
	}
	// onShow(()=>{
	// 	// console.log('onShow')
	// 	if(!socket.socketOpen&&!socket.first){
	// 		onReconnect({code:-1})
	// 	}
	// })
	function heartBeatReset(){
		clearInterval(socket.timeoutObj);
		clearTimeout(socket.serverTimeoutObj);
	}
	function onReconnect(e){
		socket.socketOpen = false
		heartBeatReset()
		clearInterval(socket.reconnectTimer)
		if(!socket.normalCloseFlag)
		{
			socket.reconnectTimer = setInterval(()=>{
				if(socket.socketTask){
					socket.socketTask.close()
				}
				console.log(`第【${socket.reconnectTime}】次重新连接中……`)
				socket.socketTask = null
				socketInit()
			},2000)
		}		
	}
	function heartBeatStart(){
		if(socket.socketOpen){
			socket.timeoutObj = setInterval(()=>{
				sendSocketMessage()
			},200)
		}
	}
	function socketInit(){
		socket.socketTask = uni.connectSocket({
			url:'wss://zzpbzx.com:8854/getConsultantChatList',
			success: () => {
				
			}
		})
		socket.socketTask.onOpen((res)=>{
			clearInterval(socket.reconnectTimer)
			heartBeatReset()
			socket.socketOpen = true
			socket.reconnectTime = 1
			sendSocketMessage()
			heartBeatStart()
		})
		socket.socketTask.onMessage((res)=>{
			res = JSON.parse(res.data) || []
			data.personalChatList = res
			loading2.value = false
		})
	}
	// #endregion socket
</script>

<style lang="scss" scoped>
@import '../../uni.scss';
@import '../../style/common.scss';

.page{
	background-color: #ffffff;
	width: 100vw;
	height: 100vh;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	overflow: auto;
	.main{
		width: 100%;
		flex: 1;
		height: auto;
		padding-left: 20rpx;
		padding-right: 20rpx;
		box-sizing: border-box;
		position: relative;
		margin-top: 30rpx;
		.empty{
			position: absolute;
			left: 50%;
			top: 20%;
			font-size:50rpx;
			font-weight: bold;
			transform: translate(-50%);
		}
	}
	
}
.tips{
	width: 100%;
	display: flex;
	justify-content: space-between;
	border-bottom: 1rpx solid #f0f0f0;
	.tips-item{
		display: flex;
		align-content: center;
		font-size: 27rpx;
	}
}
image{
	width: 80rpx;
	height: 80rpx;
	border-radius: 10rpx;
}
.icon-home{
	transform: scale(2);
}

.component{
	position: fixed;
	width:100%;
	height: v-bind(topBarHeight);
	z-index: 1;
	box-shadow: 0 1rpx 18rpx 0 rgba(0, 0, 0, .1);
	.box{
		display: flex;
		flex-direction: column;
		width:100%;
		height: 100%;
	}
}
.block{
	height: v-bind(topBarHeight);
	width:100%;
	display: block;
}
.top-bar{
	display: flex;
	padding:0 40rpx;
	width: 100%;
	flex:1;
	box-sizing: border-box;
	position: relative;
	align-items: center;
	font-size: 34rpx;
	justify-content: space-between;
	background-color: #ffffff;
		.top-bar-left{
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}
		.middle{
			position: absolute;
			left: 50%;
			transform: translate(-50%);
		}
	}

	.status-bar{
		width:100%;
		height: v-bind(statusHeight);
	}
	.name{
		font-size: 34rpx;
	}
	image{
		width: $uni-img-size-base;
		height: $uni-img-size-base;
		border-radius: $uni-img-border-radius;
	}
</style>
