<template>
	<view class="container">
		<view class="header">
			<headbar></headbar>
		</view>
		<crumb-bar/>
		<view id="aside" class="aside " :class="showDrawer?'show':'hidden'" >
			<sidebar />
		</view>
		<view class="main">
			<home v-if="currentPage.name==='home'"/>
			<consult v-if="currentPage.name==='consult'"/>
			<personal v-if="currentPage.name==='personal'"/>
			<sucideHotlines v-if="currentPage.name==='sucideHotlines'"/>
			<manage-consultant v-if="currentPage.name==='manageConsultant'"/>
			<letter v-if="currentPage.name==='letter'"/>
			<user-list v-if="currentPage.name==='userList'"/>
			<feedback v-if="currentPage.name==='feedbackManage'"></feedback>
			<activeManage v-if="currentPage.name=='activityManage'"></activeManage>
		</view>	
	</view>
</template>

<script setup>
	import {useAppStore,useCommonStore,useUserStore} from '@/store/index.js'
	import {storeToRefs} from 'pinia'
	import {onLoad,onUnload,onShow,onHide} from '@dcloudio/uni-app'
	import { computed, onMounted,ref ,reactive, watch, defineAsyncComponent} from "vue"
	import userList from '../userList/index.vue'
	import headbar from '../../components/headbar.vue'
	import sidebar from '../../components/sidebar.vue'
	import request from '../../utils/request.js'
	import crumbBar from '../../components/crumbBar.vue'
	import {loginInterceptor,dateToNumber,autoEndConsult} from '../../utils/index.js'
	import {updateConsultant} from '../../utils/api.js'
	import consult from '../consult/index.vue'
	import home from '../home/index.vue'
	import personal from '../personal/index.vue'
	import activeManage from '../activeManage/index.vue'
	import sucideHotlines from '../sucide/index.vue'
	import manageConsultant from '../manageConsultant/index.vue'
	import letter from '../letter/index.vue'
	import feedback from '@/pages/feedback/feedback.vue'
	
	const commonStore = useCommonStore()
	const {showDrawer,currentPage,routes} = storeToRefs(commonStore)
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const hidden = ref(true)
	const data = reactive({
		socketTask:null,
		socketOpen:false,//websocket的连接状态
		consultantionList:[],
		reconnectTimer:null,
		normalCloseFlag:false,
		interval:5,
		reconnectTime:0,
		heartTimer:2,
		timeout: 1, 
		timeoutObj: null,
		first:true,
	})
	watch(()=>currentPage.value,()=>{
		
	})
	function changeSubMenu(){
		hidden.value = !hidden.value
	}
	onLoad(async(option)=>{
		data.normalCloseFlag = false
		const flag = await loginInterceptor(userInfo)
		
		const localWordInfoList = uni.getStorageSync('wordinfolist') ||[]
		uni.$emit('getWordInfoList',localWordInfoList)
		if(flag){
			data.socketTask = uni.connectSocket({
				url:'wss://zzpbzx.com:8854/consultationOfConsultant/',
				success: (res) => {
					return data.socketTask
				}
			})
			data.socketTask.onOpen((res)=>{
				heartBeatReset()
				data.socketOpen = true
				data.first = false
				data.reconnectTime = 1
				sendSocketMessage(userInfo.value)
				heartBeatStart()
			})
			data.socketTask.onMessage(function(res) {
				res = JSON.parse(res.data) || []
				userStore.changeConsultNums(res.length)

				uni.setStorageSync('wordinfolist',(res))
				uni.$emit('getWordInfoList',res)
				const handleArr = res.filter((item)=>(item.endTime && !item.hasEnd))
				handleArr.map(async(item)=>{
					const flag = autoEndConsult(item.endTime)
					if(flag){
						const r = await request({
							url:'/consultant/updateConsultation',
							data:{...item,hasEnd:1,feedback:'该用户没有填写反馈'}
						})
						const r2 = await request({
							url:'/user/deleteAppointment',
							data:{
								fromId:item.fromUser.userId,
								toId:userInfo.value.consultantId
							}
						})
						const r3 = await updateConsultant({...userInfo.value,status:0})
						userInfo.value = {...userInfo.value,status:0}
						uni.setStorageSync('userInfo',userInfo.value)
					}
				})
				// const filterRes = res.filter(item=>(!item.hasEnd&&item.endTime))
			});
			data.socketTask.onError(function(res) {
				data.socketOpen = false
				heartBeatReset()
				console.log('WebSocket error，请检查！',res);
				uni.showModal({
					title: '温馨提示',
					content: '服务器开小差啦~请重新打开试试',
					showCancel: false,
					confirmText: '我知道了',
					success: () => {
					  uni.navigateBack()
					}
				})
			})
			data.socketTask.onClose((e) => {
				data.socketOpen = false
				console.log('index 断开原因',e)
				onReconnect(e)
			})
		}
	
		
		function onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		        console.log(res.target)
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
	
	})
	onUnload(()=>{
		data.normalCloseFlag = true
		data.socketOpen = false
		heartBeatReset()
		if(data.socketTask){
			data.socketTask.close()
		}
		data.socketTask = null
		clearTimeout(data.reconnectTimer)
		data.reconnectTimer = null
	})
	// onShow(()=>{
	// 	// console.log('onShow',data.socketTask)
	// 	// if(!data.socketOpen){
	// 	// 	onReconnect({code:-1})
	// 	// }
	// })
	// onHide(()=>{
		
	// })
	function heartBeatReset(){
		clearInterval(data.timeoutObj);
	}
	function heartBeatStart(){
		if(data.socketOpen){
			data.timeoutObj = setInterval(()=>{
				sendSocketMessage(userInfo.value)
			},500)
		}
	}
	function socketInit(){
		data.socketTask = uni.connectSocket({
			url:'wss://zzpbzx.com:8854/consultationOfConsultant/',
			success: (res) => {
				console.log('socket init')
			},
		})
		data.socketTask.onOpen((res)=>{
			heartBeatReset()
			clearInterval(data.reconnectTimer)
			data.socketOpen = true
			if(data.socketOpen ){
				data.reconnectTime = 1	
				sendSocketMessage(userInfo.value)
				heartBeatStart()
			}
		})
		data.socketTask.onMessage(function(res) {
			res = JSON.parse(res.data) || []
			userStore.changeConsultNums(res.length)
			uni.$emit('getWordInfoList',res)
			const handleArr = res.filter((item)=>(item.endTime && !item.hasEnd))
			handleArr.map(async(item)=>{
				const flag = autoEndConsult(item.endTime)
				if(flag){
					const r = await request({
						url:'/consultant/updateConsultation',
						data:{...item,hasEnd:1,feedback:'该用户没有填写反馈'}
					})
					const r2 = await request({
						url:'/user/deleteAppointment',
						data:{
							fromId:item.fromUser.userId,
							toId:userInfo.value.consultantId
						}
					})
					const r3 = await updateConsultant({...userInfo.value,status:0})
					userInfo.value = {...userInfo.value,status:0}
					uni.setStorageSync('userInfo',userInfo.value)
				}
			})
		});
	}
	function onReconnect(e){
		data.socketOpen = false
		clearInterval(data.reconnectTimer)
		heartBeatReset()
		if(!data.normalCloseFlag){
			data.reconnectTimer = setInterval(()=>{
				if(data.socketTask){
					data.socketTask.close()
				}
				data.socketTask = null
				console.log(`第【${data.reconnectTime}】次重新连接中……index`,data.socketTask)
				socketInit()
				data.reconnectTime++
			},1000)
		}
		// if(e.code !== 1000)
		// {	
			
		// }
	}
	function sendSocketMessage(msg){
		const obj  = {consultant:msg}
		if(data.socketOpen){
			data.socketTask.send({
				data:JSON.stringify(obj),
				success:()=>{
					
				},
				fail:()=>{
					console.log('send fail')
					onReconnect({code:-1})
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100vh;
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;		
		.aside{
			position: fixed;
			left: -100vw;
			width:100vw;
			height: 100%;
			box-sizing: border-box;
			top: 0;
			box-sizing: border-box;
			transition: all .4s ease-in-out;
			z-index: 9999;
		}
		.show{
			left: 0;
		}
		.hidden{
			left: -100vw;
		}
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.header{
			width: 100%;
			box-shadow: 0 1rpx 14rpx 0 rgba(0, 0, 0, .1);
			box-sizing: border-box;
	}
	.main{
		width:100%;
		flex:1;
		height: 100%;
	}
	
</style>

