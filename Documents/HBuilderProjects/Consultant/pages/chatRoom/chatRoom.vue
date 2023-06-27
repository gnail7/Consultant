<template>
	<view class="page" >
		<topnav :fromUser="data.fromUser" :personal="personal" :id="data.id"/>
		<scroll-view class="chat-win"  
		scroll-y="true" 
		:scroll-with-animation="true"
		:scroll-top="scrollTop" 
		@scrolltoupper="nextPage"
		:scroll-into-view="scrollViewId">
			<view id="msg-list-box" >
				<view class="tips" @click="navigateToUserPage" v-if="beginIndex ===0">{{data.startTime}}</view>
				<view class="tips" v-else>
					<loading :loading="pageInfo.isLoading"></loading>
					加载更多...
				</view>
				<view class="msg-list" v-for="item in computedWordInfoList" :key="item.id" :id="'g'+item.id">
					<view v-if="item.sendId === userInfo.consultantId" class="msg my">
						<!-- <image :src="userInfo.consultantAvatar"></image>
						<view class="content" v-html="(item.wordText)"></view> -->
						<image :src="userInfo.consultantAvatar"></image>
						<view v-if="item.type == 'text' || !item.type" class="content" v-html="(item.wordText)"></view>
						<g-image v-else-if="item.type == 'image'"   :src="item.wordText" ></g-image>
						<g-video v-else-if="item.type == 'video'"   :src="item.wordText" ></g-video>
						<view class="content" v-else-if="item.type == 'voice'" >
							<g-audio :src="item.wordText"></g-audio>
						</view>
						<!-- <chat-loading :loading="item.loading"></chat-loading> -->
						<!-- 咨询师数据解析->v-html -->
					</view>
					<view v-else class="msg you">
						<image :src="(data.fromUser.userAvatar||data.fromUser.consultantAvatar) " @click="navigateToUserPage"></image>

						<!-- <image :src="(item.fromUser&&item.fromUser.userAvatar) || item.userA.userAvatar || item.userA.consultantAvatar " @click="navigateToUserPage"></image> -->
						<view v-if="item.type == 'text' || !item.type" class="content" v-html="(item.wordText)"></view>
						<g-image v-else-if="item.type == 'image'"   :src="item.wordText"></g-image>
						<g-video v-else-if="item.type == 'video'"   :src="item.wordText"></g-video>
						<view class="content" v-else-if="item.type == 'voice'">
							<g-audio :src="item.wordText"></g-audio>
						</view>
					</view>
					
				</view>
			</view>
			<view id="last-sign" style="height:30px;width: 1px;"></view>
		</scroll-view>
		<view class="bottom-bar" id="footer"  :style="{bottom:bottomHeight+'px'}">
			<view class="first-child">
				<view class="input-area">
					<textarea
					id="textarea"
					type="text"
					:show-confirm-bar="false"
					v-model="form.wordText" 
					cursor-spacing='20' 
					:auto-height="true" 
					:adjust-position="false" 
					@focus="focus"
					@blur="onBlur"
					@input="savePosition"
					@touchstart="savePos"
					@keyup="savePos" 
					@keyboardheightchange="keyboardChange"
					:confirm-hold="true"
					maxlength="250"/>
					<view class="icon iconfont icon-biaoqing-xue"
					style="z-index: 5;"
					@touchstart.prevent="changeEmojiVisible"
					></view>
				</view>
				<view class="icon iconfont icon-jiahao" 		
				@click="changeToolVisible"></view>
				<view @click="addRecord"><button  class="button">发送</button></view>
				
				<!-- <button :class="computedEndBtn" @click="emitEndResult">{{personal ? '私聊中':'结束咨询'}}</button> -->
			</view>
			<view class="emoji">
				<g-emoji 
				@insertEmoji="insertEmoji"
				:height="'350rpx'"
				:visible="subControler.visible"></g-emoji>
				<view class="tools"
				v-if="tools.visible">
					<view class="tool-item" @click="openPopOver('recoderVisible',true)">
						<view class="icon-container">
							<view class="icon iconfont icon-luyin"></view>
						</view>
						<view class="tool-item-title" >录音</view>
					</view>

					<view class="tool-item" @click="openPopOver('dialogVisible',true)" v-if="!personal">
						<view class="icon-container">
							<view class="icon iconfont icon-zhuanjie"></view>
						</view>
						<view class="tool-item-title">转接</view>
					</view>
					<view class="tool-item" @click="emitEndResult" v-if="!personal">
						<view class="icon-container">
							<view class="icon iconfont icon-end"></view>
						</view>
						<view class="tool-item-title" >结束咨询</view>
					</view>
					<view class="tool-item" @click="endPersonal" v-if="personal">
						<view class="icon-container">
							<view class="icon iconfont icon-end"></view>
						</view>
						<view class="tool-item-title" >结束私聊</view>
					</view>
					<view class="tool-item" @click="addSucide" v-if="!personal">
						<view class="icon-container">
							<view class="icon iconfont icon-yujing"></view>
						</view>
						<view class="tool-item-title">自杀预警</view>
					</view>
					<view class="tool-item" @click="openPopOver('userInfoVisible',true)">
						<view class="icon-container">
							<view class="icon iconfont icon-yonghuziliao"></view>
						</view>
						<view class="tool-item-title">用户信息</view>
					</view>
					<view class="tool-item" @click="openPopOver('remberVisible',true)" v-if="!personal">
						<view class="icon-container">
							<view class="icon iconfont icon-beiwanglu"></view>
						</view>
						<view class="tool-item-title">备忘录</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar-box"></view>

		<view class="dialog2" v-if="subControler.dialogVisible">
			<view class="box2">
				<view class="mask2" @click="openPopOver('dialogVisible',false)"></view>
				<view class="consultant-list" style="height:fit-content">		
					<view class="consultant-item" v-for="item in consultantList" :key="item.id">
						<view class="left">
							<image :src="item.consultantAvatar" style=";width:70rpx;height:70rpx;border-radius:50%" ></image>
							<view class="name">{{item.consultantName}}</view>
						</view>
						<view class="right">
							<button	class="button zj" @click="transfer(item)">转接</button>
							<button	class="button " @click="privateChat(item)">私聊</button>
						</view>
					</view>
					<view class="dialog-footer">
						<pager
						:total="transferPageInfo.total" 
						:currentPage="transferPageInfo.currentPage"
						:pageSize="transferPageInfo.pageSize"
						@pageChange="toggleConsultantListPage"
						@iconClick="backOrNextOfCon"
						/>
					</view>
				</view>
			</view>
		</view>
		<view class="dialog2" v-if="subControler.userInfoVisible">
			<view class="box2">
				<view class="mask2" @click="openPopOver('userInfoVisible',false)"></view>
				<view class="userInfo-list" style="width: 50%;height: auto;">
					<!-- <view class="userinfo-title" style="text-align: center;margin: 20rpx;">用户信息</view> -->
					<view class="userinfo-card">
						<view class="info-box">
							<view class="top divide">
								<image :src="data.fromUser.userAvatar || data.fromUser.consultantAvatar"></image>
							</view>
							<view class="real-name divide" v-if="data.fromUser.realName">{{data.fromUser.realName}}</view>
							<view class="info-name divide">
								<text >{{data.fromUser.userName || data.fromUser.consultantName}}</text> 
								<text class="icon iconfont" :class="data.fromUser.gender === '男'?'icon-nan':'icon-xingbienv'"></text>
							</view>
							<view class="manager divide">{{data.fromUser.type ? '普通用户':'咨询师'}}</view>
							<view class="beizhu">
								来访原因:{{personal ? '私聊' : '咨询'}}
							</view>
						</view>	
					</view>
				</view>
			</view>
		</view>
		<view class="dialog2" v-if="subControler.recoderVisible">
			<view class="box2" style="padding:0;">
				<view class="mask2" @click="openPopOver('recoderVisible',false)"></view>
				<view class="userInfo-list record-dialog" style="width: 80%;height: auto;padding:0;">
					<view class="userinfo-card" style="background-color: #fff;margin:0;border-radius: padding:0;10rpx;background-image: none;display:flex;jutstify-content:center;align-items: center;width:100%;height:100%;">
						<recordDialog style="width:100%;height:100%;padding:0;margin:0;"/>
					</view>
				</view>
				</view>
			</view>	
		</view>
		
</template>

<script setup>
	import topnav from './component/topnav.vue'
	import gVideo from '../../components/video/index.vue'
	import gImage from './component/gImage.vue'
	import gAudio from './component/gAudio.vue'
	import { onReady,onLoad,onShow,onUnload,onHide} from "@dcloudio/uni-app"
	import { computed, nextTick, onMounted, reactive,ref, toRefs, watch,provide, onBeforeUnmount } from "vue";
	import loading from './component/loading.vue'
	import request,{BASEURL} from '../../utils/request.js'
	import recordDialog from './component/recordDialog.vue'
	
	import {
		getTopBarHeight,
		timestampToTime,
		getTopBarHeightSync,
		entitiesToUtf16,
		utf16toEntities,
		validator,
		pattern,
		formatDate,
		showModal,
		} from '../../utils/index.js'
	import {useUserStore} from '@/store/index.js'
	import {storeToRefs} from 'pinia'
	import {updateConsultant,addChatInfo,addSucideHotline,suscribeApi} from '@/utils/api.js'
	import gEmoji from '../../components/emoji/gEmoji.vue'
	
	/**
	 * 参数说明: data为接受的这个chatRoom的整体信息
	 * 			subControler:底部栏的一些控制信息
	 * 			form:发送咨询请求接口需要的信息
	 */
	const personal = ref(false)
	const {namePattern} = pattern
	const bottomHeight = ref(0)
	const focusPos = ref(false)
	const computedBottomHeight = computed(()=>bottomHeight.value+'px')
	const footerHeight = ref(0)
	const footerInit = ref(0)
	const scrollTop = ref(0)
	const scrollViewId = ref('g0')
	const autoHeight = ref(false)
	const footerRef = ref(null)
	const wordInfoListLength = computed(()=>data.value.wordInfoList.length)
	const mainChatHeight = computed(()=>{
		//窗体的大小等于总-top-footer
		const page = uni.getSystemInfoSync()
		let fHeight = JSON.parse(JSON.stringify(footerHeight.value ))
		if(bottomHeight.value){
			fHeight = JSON.parse(JSON.stringify(footerInit.value))
		}
		const pageHeight = page.screenHeight
		const topBarHeight = getTopBarHeightSync()	
		return pageHeight - fHeight - topBarHeight - bottomHeight.value+'px'
	})
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const tools = reactive({
		visible:false,
	})
	const data = ref({
		id:null,
		fromUser:{},
		toUser:{},
		wordInfoList:[],
	})
	const pageInfo = reactive({
		pageSize:20,
		currentPage:1,
		triggered:false,
		isLoading:false,
		cPageSize:4,
		cCurrentPage:1
	})
	const hide = ref(false)
	const consultantHasManager = ref([])
	const consultantList = ref([])
	// const cBeginIndex = computed(()=>(pageInfo.cCurrentPage-1)*pageInfo.cPageSize)
	// const cCurrentList = computed(()=>{
	// 	const newArr = consultantList.value.filter(item=>item.id!==userInfo.value.id)
	// 	return newArr.slice(cBeginIndex.value,cBeginIndex.value+pageInfo.cPageSize)
	// })
	const beginIndex = computed(()=>{
		if( data.value.wordInfoList.length - pageInfo.currentPage*pageInfo.pageSize <= 0){
			return 0
		 }
		return 	Math.floor(data.value.wordInfoList.length - pageInfo.currentPage*pageInfo.pageSize)
	})
	const computedWordInfoList = computed(()=>{
		return data.value.wordInfoList.slice(beginIndex.value,data.value.wordInfoList.length)
	})
	function backOrNext(val){
		if(val>0){
			(pageInfo.currentPage < Math.ceil(dataList.value.length/pageInfo.pageSize)) && pageInfo.currentPage++
		}else{
			(pageInfo.currentPage > 1) && pageInfo.currentPage--
		}
	}
	function togglePage(value){
		pageInfo.currentPage = value
	}
	const subControler = reactive({
		visible:false,
		start:0,
		end:0,
		dialogVisible:false,
		userInfoVisible:false,
		remberVisible:false,
		recoderVisible:false,
		imageVisible:false
	})
	
	const form = ref(resetForm())
	function resetForm(){
		return{
			wordText:'',
			type:'text',
			fromUser:data.value.fromUser,
			toUser:data.value.toUser,
			wordTime:null,
			sendId:userInfo.value.consultantId,
		}
	}
	const sendBtnClass = computed(()=>{
		if(form.value.wordText){
			return 'btn'
		}
		return ''
	})
	const computedEndBtn = computed(()=>{
		return 'hideEndBtn'
	})
	
	onLoad(async(option)=>{
		const item = (option.item)
		const r = JSON.parse(decodeURIComponent(item))
		const {fromUser} = r
		personal.value = r.personal
		Object.assign(data.value,r)
		try{
			if(personal.value){
				const word =  uni.getStorageSync('personalList')
				const fromId = fromUser.consultantId || fromUser.userId
				const thisWordInfo = word.filter(item=>((item.userA.userId||item.userA.consultantId) === fromId)||(item.userB.userId||item.userB.consultantId)=== fromId)
				data.value.wordInfoList =  thisWordInfo[0].chatRecords || []
				const length = data.value.wordInfoList.length
				nextTick(()=>{
					scrollViewId.value = 'g'+data.value.wordInfoList[length-1]?.id
				})
			}else{
				const word = uni.getStorageSync('wordinfolist')
				const thisWordInfo = word.filter(item=>item.id === r.id)
				data.value.wordInfoList =  thisWordInfo[0].wordInfoList || []
				const length = data.value.wordInfoList.length
				nextTick(()=>{
					scrollViewId.value = 'g'+data.value.wordInfoList[length-1]?.id
				})
			}	
		}catch(e){
			data.value.wordInfoList = []
		}
	
		data.value.toUser = userInfo.value
		form.value = {...form.value,toUser:userInfo.value,fromUser:data.value.fromUser}
		uni.$on(`updateWordInfoList${r.id}`,async(res)=>{
			if(data.value.wordInfoList<=res){
				data.value.wordInfoList = res
				const noReadList = res.filter(item=>!item.hasRead )
				const noMySend = noReadList.filter(item=>(item.sendId!==userInfo.value.consultantId))
				if(noMySend.length>0 && !personal.value){
					const handleReadList = noMySend.map(item=>{
						item.hasRead = true
						return item
					})
					const r = await request({
						url:'/user/updateRecords',
						data:handleReadList,
						method:"POST",
					})
				}else if(noMySend.length>0 && personal.value){	
					const newHandleReadList = noMySend.map(item=>{
						item.hasRead = true
						item.userB = userInfo.value
						item.userA = data.value.userA
						// item.userA = fromUser
						return item
					})
					const r2 = await request({
						url:'/consultant/updateChatRecords',
						data:newHandleReadList,
					})
				
				}
				if(!hide.value){
					if(data.value.wordInfoList.length>0){
						scrollViewId.value = "g"+data.value.wordInfoList[data.value.wordInfoList.length-1]?.id
					}
				}
			}
		})
		uni.$on(`consultHasEnd${r.id}`,async(hasEnd)=>{
			const r2 = await updateConsultant({...userInfo.value,consultNum})
			userInfo.value = {...userInfo.value}
			uni.setStorageSync('userInfo',userInfo.value)
			userStore.changeConsultNums(userInfo.value.consultNum-1)
			uni.showToast({
				title:'对方已结束咨询',
				icon:'none'
			})
			setTimeout(()=>{
				uni.switchTab({
					url:'/pages/chatHall/chatHall'
				})
			},1000)
		})
		
	 
	})
	onShow(()=>{
		hide.value = false
	})
	onHide(()=>{
		hide.value = true
	})
	
	onUnload(()=>{
		uni.$off(`updateWordInfoList${data.value.id}`)
		uni.$off(`consultHasEnd${data.value.id}`)
		uni.$off(`consultHasEnd${data.value.id}`)
	})	
	// #region 高度
	function clickoutside(event) {
		const query = uni.createSelectorQuery()
		
		const footer =  uni.createSelectorQuery().select('#footer')
		
		footer.boundingClientRect(rect => {
			console.log(event,rect.left,rect.right)
			if (
			  event.clientX >= rect.left &&
			  event.clientX <= rect.right &&
			  event.clientY >= rect.top &&
			  event.clientY <= rect.bottom
			) {
				// 点击的区域在my-element元素内部，执行相应的操作
				// ...
				
			} else {
				// 点击的区域不在my-element元素内部，忽略该事件
				// subControler.visible = false
				// tools.visible = false
				console.log('clickoutside')
				getFooterHeight()
				savePos()
				return
			}
		}).exec();
		
	}
	function scrollIntoBottom(){
		scrollViewId.value = 'g1'
		nextTick(()=>{
			setTimeout(()=>{
				scrollViewId.value = 'g'+data.value.wordInfoList[data.value.wordInfoList.length-1].id
				
			},100)
		})
	}

	function getFooterHeight(){
		nextTick(()=>{
			const footer =  uni.createSelectorQuery().select('#footer')
			footer.boundingClientRect(data => {
				 const {height} = data
				 footerHeight.value = height
			}).exec();
		})

		// const footer =  uni.createSelectorQuery().select('#footer')
		// footer.boundingClientRect(data => {
		// 	 const {height} = data
		// 	 footerHeight.value = height
		// }).exec();
	}
	function keyboardChange(e){
	
		if(e.detail.height > 0){
			subControler.visible = false
			tools.visible = false
		}
		bottomHeight.value =  e.detail.height
		console.log('bottomHeight',bottomHeight.value)
	}
	function nextPage(){
		pageInfo.isLoading = true
		setTimeout(()=>{
			pageInfo.currentPage++
			pageInfo.isLoading = false
		}, 1000);
	}
	// #endregion 高度
	function navigateToUserPage(){
		const i = JSON.stringify(data.value)
		uni.navigateTo({
			url:`/pages/userPage/userPage?allData=${encodeURIComponent(i)}`
		})
	}
	// #region 聊天室main function
	async function emitEndResult(){
		if(!personal.value){
			const flag = await showModal(`结束咨询,确认结束"${data.value.fromUser.userName}"的咨询吗?`)
			if(flag){
				const t = new Date().getTime()
				const endTime = formatDate(t)
				// uni.$emit(`endConsult${data.value.id}`,endTime)
				const consultNum = userInfo.value.consultNum+1
				const r1 = await request({
					url:'/consultant/updateConsultation',
					data:{...data.value,endTime,hasEnd:false},
					method:"post"
				})
				if(r1.flag){	
					// const r2 = await updateConsultant({...userInfo.value,consultNum})
					userStore.changeConsultNums(userInfo.value.consultNum-1)
					userInfo.value = {...userInfo.value,consultNum}
					uni.setStorageSync('userInfo',userInfo.value)
					
					uni.showToast({
						icon:"none",
						title:'结束咨询'
					})
					setTimeout(()=>{
						uni.hideToast()
						uni.switchTab({
							url:'/pages/chatHall/chatHall'
						})
					},1000)
				}
			}
		}	
	}
	const endPersonal = async()=>{
		const flag = await showModal(`结束咨询,确认结束"${data.value.fromUser.userName||data.value.fromUser.consultantName}"的私聊吗?`)
		if(flag){
			const r = await request({
				url:'/user/deleteChatInfo',
				method:'post',
				data:{
					userAId:data.value.fromUser.userId||data.value.fromUser.consultantId,
					userBId:userInfo.value.consultantId
				}
			})
			uni.showToast({
				icon:"none",
				title:'结束私聊'
			})
			setTimeout(()=>{
				
				uni.switchTab({
					url:'/pages/chatHall/chatHall'
				})
			},1000)
		}
	}
	// entitiesToUtf16,
	// utf16toEntities,
	function chooseImage(){
		uni.chooseMedia({
			count:1,
			mediaType:'image',
			camera:'front',
			success:(res)=>{
				const {tempFiles} = res
				uni.uploadFile({
					filePath:tempFiles[0].tempFilePath,
					url: BASEURL+'/user/upload',
					name: 'file',
					formData: {
						'consultant': 'test'
					},
					success: async(r) => {
					  if(r.statusCode === 200){
						
						 addAudioRecord('image',r.data)
					  }
					},
					fail: () => {
					  console.log("失败...");
					}
				})
			}
		})
	}
	async function addRecord(){	
		setTimeout(async()=>{	
			focusPos.value = false
			const t = new Date().getTime()
			form.value.wordTime = formatDate(t)
			const {wordInfoList} = data.value
			form.value.isUserConsult = false
			let replaceWordText = form.value.wordText
			form.value.sendId = userInfo.value.consultantId
			form.value.fromUser = data.value.fromUser
			form.value.toUser = userInfo.value
			if(form.value.wordText && !data.value.endTime){
				let pattern = /\[.*?\]/g;
				let matchResult = form.value.wordText.match(pattern);
				if (matchResult != null) {
					matchResult.map(x => {
						let name = x.substr(0, x.length - 1).substr(1)
						let url =
							`<img src="https://howcode.online/emo/${name}.png" class="emo-image"/>`
						replaceWordText = replaceWordText.replace(x, url)
					})
				}
				replaceWordText = "<p>"+replaceWordText+"</p>"
				const URL = personal.value ? '/consultant/addChatRecord' : '/consultant/addConsultRecord'
				const r = await request({
					url:`${URL}`,
					method:'POST',
					data:{
						hasRead: 0,
						sendId: userInfo.value.consultantId,
						type: "text",
						userAId: form.value.fromUser.userId || form.value.fromUser.consultantId ,
						userBId: userInfo.value.consultantId,
						wordText: utf16toEntities((replaceWordText)),
						wordTime: form.value.wordTime,
						isUserConsult:false,
						fromUser:form.value.fromUser,
						toUser:userInfo.value
					}
				})
				if(r.flag){
					data.value.wordInfoList.push({...form.value,wordText:utf16toEntities((replaceWordText)),loading:true})
					uni.$emit(`updateWordInfoList${data.value.id}`,data.value.wordInfoList)
					form.value.wordText=''
				}
				scrollIntoBottom()
			}else if(data.endTime){
				uni.showToast({
					title:'当前咨询已结束'
				})
			}
		},100)
	}
	async function addAudioRecord(type,wordText){
		const t = new Date().getTime()
		form.value.wordTime = formatDate(t)
		const {wordInfoList} = data.value
		const URL = personal.value ? '/consultant/addChatRecord' : '/consultant/addConsultRecord'
		const r = await request({
			url:`${URL}`,
			method:'POST',
			data:{
				hasRead: 0,
				sendId: userInfo.value.consultantId,
				type,
				userAId: form.value.fromUser.userId || form.value.fromUser.consultantId ,
				userBId: userInfo.value.consultantId,
				wordText,
				wordTime: form.value.wordTime,
				isUserConsult:false,
				fromUser:form.value.fromUser,
				toUser:userInfo.value
			}
		})
		if(r.flag){
			data.value.wordInfoList.push({...form.value,wordText,type})
			uni.$emit(`updateWordInfoList${data.value.id}`,data.value.wordInfoList)
			form.value.wordText=''
		}
		scrollIntoBottom()
		subControler.recoderVisible = false
	}
	provide('addAudioRecord',addAudioRecord)
	// #endregion 聊天室main function
	// #region 表情包以及光标
	function changeEmojiVisible(event){
		subControler.visible = !subControler.visible
		bottomHeight.value = 0
		if(subControler.visible){
			tools.visible  = false
			nextTick(()=>{
				scrollIntoBottom()
			})
		}
		getFooterHeight()
	}
	function changeToolVisible(){
		tools.visible = !tools.visible
		bottomHeight.value = 0
		if(tools.visible){
			
			subControler.visible = false
			nextTick(()=>{
				scrollIntoBottom()
			})
		}
		getFooterHeight()
	}
	async function openPopOver(att,flag){
		subControler[att] = flag
		if(att=='remberVisible'){
			const userId = data.value.fromUser.userId
			uni.navigateTo({
				url:`/pages/memo/memo?userId=${userId}`
			})
		}
	}
	provide('openPopOver',openPopOver)
	function insertEmoji(data){
		const {start,end} = subControler
		const {title} = data
		if(form.value.wordText){
			form.value.wordText = form.value.wordText.slice(0,start)+title+form.value.wordText.slice(end)
		}else{
			form.value.wordText = form.value.wordText+title
		}
		subControler.start = subControler.start+4
		subControler.end = subControler.end+4
	}
	function focus(e){
		subControler.visible = false
		tools.visible = false
		// bottomHeight.value =  e.detail.height
		getFooterHeight()
		scrollIntoBottom()
		savePos()
	}
	function onBlur(e){
		focusPos.value = false
		form.value.wordText  = e.detail.value
		autoHeight.value = false
		// bottomHeight.value = 0	
		// bottomHeight.value = 0
		savePos()
	}
	function keyDown(e){
		uni.getSelectedTextRange({
			success:(res)=>{
				subControler.start = res.start
				subControler.end = res.end
			},
			fail: (e) => {
				
			}
		})
	}
	function savePosition(e){
		form.value.wordText = e.detail.value
		// console.log('input',e)
		uni.getSelectedTextRange({
			success:(res)=>{
				subControler.start = res.start
				subControler.end = res.end
			},
			fail: (e) => {
				// console.log('',e)
			}
		})
	}
	function savePos(e){	
		uni.getSelectedTextRange({
			success:(res)=>{
				subControler.start = res.start
				subControler.end = res.end
			},
			fail: (e) => {
				
			}
		})
	}
	// #region subcontroler
	function memoFocus(){
		bottomHeight.value = 0
		tfocusPos.value=true
		subControler.visible = false
		tools.visible = false
		bottomHeight.value =  e.detail.height
		getFooterHeight()
		nextTick(()=>{
			scrollIntoBottom()
		})
	}

	async function privateChat(item){
		const flag = await showModal(`确定私聊${item.consultantName}`,item)
		if(flag){
			const r = await addChatInfo({userAId:item.consultantId ,userBId:userInfo.value.consultantId})
			uni.showToast({
				title:'私聊聊天室已经建立',
				icon:"none"
			})
			setTimeout(()=>{
				uni.switchTab({
					url:"/pages/chatHall/chatHall"
				})
			},800)
		}
	}
	async function addSucide(){
		const flag = await showModal('确定当前用户具有自杀倾向?')
		const {fromUser} = data.value
		const templateData = {
			  "touser": userInfo.value.openid,
			  "template_id": "IK18Knq0P-rDharivgecSmnaSIFkDUYXNEksOWDOjL0",
			  "page": "pages/index/index",
			  "miniprogram_state":"formal",
			  "lang":"zh_CN",
			  "data": {
			      "thing1": {
			          "value": "紧急自杀热线上报"
			      },
			      "thing3": {
			          "value": "请尽快处理!"
			      },
			  }
		}
		if(flag && userInfo.value.hasManager){
			try{
				const t = new Date().getTime()
				const reportTime = formatDate(t)
				const r = await addSucideHotline({
					reportTime,user:fromUser,reporter:userInfo.value
				})
				if(r.flag){
					for (let item of consultantHasManager.value) {
						await suscribeApi(JSON.stringify({...templateData,touser:item.openid}))
					}
					uni.showToast({
						title:'上报成功'
					})
				}
			}catch(e){
				uni.showToast({
					title:'上报失败'
				})
			}
		
		}
	}
	function transfer(item){
		const {fromUser} = data.value
		suscribeApi()
		uni.showModal({
			content:`确认将"${fromUser.userName}"转接给${item.consultantName}?`,
			success:async (res) => {
				if(res.confirm){
					const t = new Date().getTime()
					const time = formatDate(t)
					const r2 = await request({
						url:'/consultant/updateConsultation',
						method:'POST',
						data:{
							id:data.value.id,
							fromUser:fromUser,
							feedback:'',
							toUser:item,
							wordInfoList:[],
							startTime:time,
							hasEnd:false,
							endTime:''
						},
					})
					if(r2.flag){
						userStore.changeConsultNums(userInfo.value.consultNum--)
						uni.showToast({
							title:"转接成功",
							icon:'none'
						})
						const r3 = await updateConsultant({...userInfo.value,status:0})
						userInfo.value = {...userInfo.value,status:0}
						uni.setStorageSync('userInfo',userInfo.value)
						setTimeout(()=>{
							uni.switchTab({
								url:'/pages/chatHall/chatHall'
							})
						},1000)
					}
				}
			}
		})
	}
	// #endregion subcontroler
	function backOrNextOfCon(val){
		if(val>0){
			(transferPageInfo.currentPage < transferPageInfo.total ) && (transferPageInfo.currentPage = transferPageInfo.currentPage+1);
		}else{
			(transferPageInfo.currentPage > 1) && (transferPageInfo.currentPage = transferPageInfo.currentPage-1);
		}		
	}
	const transferPageInfo = reactive({
		pageSize:7,
		currentPage:1,
		queryString:null,
		total:0
	})
	
	const toggleConsultantListPage = (val)=>{
		transferPageInfo.currentPage = val
	}
	watch(()=>transferPageInfo.currentPage,async()=>{
		await initTransfer()
	})
	const initTransfer = async()=>{
		const r = await request({url:'/consultant/getFreeConsultants',method:'POST',data:transferPageInfo})
		if(r){
			consultantList.value = r.rows
			transferPageInfo.total = r.total
		}
	}
	onMounted(async()=>{
		try{
			await initTransfer()
			const r = await request({url:'/consultant/getAllConsultants',method:'POST'})
			if(r){
				consultantHasManager.value = r.filter(item=>item.hasManager)
				// consultantList.value = r.filter(item=>item.status === 0)
			}
		}catch(e){
			
		}
	
		getFooterHeight()
	})
	onBeforeUnmount(()=>{
		
	})
	// #endregion 表情包
</script>

<style lang="scss" scoped>
	@import '../../uni.scss';
	@import './style/index.scss';
	@import './style/dialog2.scss';
	.mask{
		background-color: rgba(0, 0, 0, 0.4);
		position: fixed;
		width:100vw;
		height:100vh;
		top:0;
		left:0;
	}
	.page{
		display: flex;
		flex-direction: column;
		height:100vh;
		background-color: #ededed;
	}
	.chat-win{
		background-color: #ededed;
		height: v-bind(mainChatHeight);
	
		box-sizing: border-box;		

		.msg-list{
			height: auto !important; 
			padding: 20rpx;
			box-sizing: border-box;
			.msg{
				display: flex;
				.content{
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					background-color: #ffffff;
					height: inherit;
					border-radius: 10rpx;
					padding: 20rpx 25rpx;
					max-width: 50vw;
					word-break: break-all;
					min-width:30rpx;
					min-height:$uni-img-size-base;
					box-sizing: border-box;
				}
				.con{
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					background-color: #ffffff;
					height: inherit;
					border-radius: 10rpx;
					padding: 20rpx 25rpx;
					max-width: 50vw;
					word-break: break-all;
					min-width:30rpx;
					min-height:$uni-img-size-base;
					box-sizing: border-box;
				}
			}
			.my{
				flex-direction: row-reverse;
				.content{
					margin-right:25rpx ;
					background-color: $uni-chat-me-bg;
				
					&::after{
						content: '';
						display: inline-block;
						height: 0;
						width: 0;
						border: 25rpx solid #85d2f7;
						border-top: 25rpx solid transparent;
						border-right: 25rpx solid transparent;
						border-bottom: 25rpx solid transparent;
						position: absolute;
						right:-37rpx;
						top: 40rpx;
						z-index: 0;
						transform: translateY(-50%);
						border-radius: 20rpx;
						
					}
				}
			}
			.you{
				
				.content{
					margin-left:25rpx ;
					
					&::after{
						content: '';
						display: inline-block;
						height: 0;
						width: 0;
						border: 25rpx solid #ffffff;
						border-top: 25rpx solid transparent;
						border-left: 25rpx solid transparent;
						border-bottom: 25rpx solid transparent;
						position: absolute;
						left:-37rpx;
						top: 40rpx;
						transform: translateY(-50%);
						border-radius: 20rpx;
						z-index: 0;
					}
				}
			}
			.tips{
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.tips{
		display: flex;
		justify-content: center;
		align-items: center;
		color:#888888;
		font-size: 24rpx;
		margin-top: 20rpx;
	}
	.bottom-bar{
		width:100%;
		background-color: #f7f7f7;
		position: fixed;
		bottom: 0;
		display: flex;
		flex-direction: column;
		font-size: 28rpx;
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: border-box;
		box-shadow: 0 1rpx 14rpx 0 rgba(0, 0, 0, .1);	
		transition: none;
		
		.first-child{
			display: flex;
			align-items: center;
			width:100vw;
			box-sizing: border-box;
			flex:1;
			.input-area{
				position: relative;
				box-sizing: border-box;
				flex:1;
				width:100%;
				min-height: 60rpx;
				margin: auto 10rpx;
				padding: 20rpx auto;
				.icon-biaoqing-xue{
					font-size: 60rpx;
					// right: -50rpx;
					width:60rpx;
					position: absolute;
					right: 0;
					top: 10rpx;
					
				}
			}
		}
	}

	.emoji{
		transition: none;
		overflow: auto;
	}
	input,textarea{
		box-sizing: border-box;
		flex: 1;
		min-height:60rpx;
		border-radius: 20rpx;
		background-color: #ffffff;
		padding-right:60rpx;
		margin: 10rpx auto;
		box-shadow: 0 1rpx 10rpx 0 rgba(0, 0, 0, .1);
		border: 1rpx solid #f7f7f7;
		align-items: center;
		// line-height: 60rpx;
		text-indent: 10rpx;
		width: 100%;
		
	}
	
	.icon-jiahao{
		font-size: 60rpx;
		width:60rpx;
	}
	button{
		height: auto;
		margin: 10rpx;
		border-radius: 20rpx;
		background-color: skyblue;
		display: flex;
		justify-content: center;
		align-items: center;
		color:#ffffff;
		font-size:28rpx;
		width:120rpx;
		&::after{
			border: 0;
		}
	}
	.endBtn{
		 display:block; 
	 }
	.hideEndBtn{
		 display: none;
	}
	.btn{
		display: block;
	}
	
	image{
		width:$uni-img-size-base;
		height: $uni-img-size-base;
		border-radius: 50%;
	}
	
	:deep(.emo-image ){
		height: 30rpx !important;
		width: 30rpx !important;
		vertical-align: middle !important;
		display: inline-block !important;
	  }
	.tools{
		box-sizing: border-box;
		height:350rpx;
		display: flex;
		// justify-content: space-around;
		flex-wrap: wrap;
		.tool-item{
			display: flex;
			flex-direction: column;
			align-items: center;	
			margin-top: 20rpx;
			box-sizing: border-box;
			width:15%;
			.icon-container{
				display: flex;
				align-items: center;
				justify-content: center;	
				height: 60rpx;
				width:60rpx;
				padding: 20rpx;
				background-color:  #ffffff;
				border-radius: 100%;
				margin-bottom: 10rpx;
			}
			.icon{
				font-size: 32rpx;
				
			}
			.tool-item-title{
				color:  #909399;
			}
		}
	}
	.dialog-footer{
		display:flex;
		justify-content: center;
		align-items: center;
	}
	
	.uerinfo-item{
		padding: 30rpx 0;
		margin:0 30rpx;
		display: flex;
		justify-content: space-between;
		
	}
	.userInfo-list{
		z-index:10;
	}
	.rember-box{
		width:100%;
		.text-input{
			display:flex;
			width:100%;
			textarea{
				flex:1;
			}
			button{
				
			}
		}
	}
	.userinfo-card{
		background: #ffffff;
		
		padding: 20rpx;
		display:flex;
		flex-direction: column;
		align-items: center;
		border-radius: 20rpx;
		box-sizing: border-box;
		background-color: #8EC5FC;
		background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);
		// border-radius: 20rpx;
		.info-box{
			display: flex;flex-direction: column;
			align-items: center;
			padding:20rpx;
			color:#909399;
				.info-name{
					font-size: 37rpx;
					font-weight:bold;
					color:black;
				}
				.divide{
					margin:15rpx auto;
				}
			// .left{
			// 	image{
			// 		width: 80rpx;
			// 		height: 80rpx;
			// 		border-radius: 100%;
			// 	}
			// }
			// .right{
			// 	display: flex;
			// 	flex-direction: column;
			// 	justify-content: space-around;
			// 	margin-left: 20rpx;
			
			// 	.manager{
			// 		// margin:10rpx
			// 	}
			// }
		}
		.icon-nan{
			color:skyblue;
		}
		.icon-xingbienv{
			color:pink;
		}
		.beizhu{
			display: flex;
			flex-direction: column-reverse;
			height:100%;
		}
		
	}
	.divide{
		margin:25rpx auto;
	}
	.emoji{
		display: flex;
		
		justify-content: center;
		.tools{
			width:100%;
			margin: auto;
			display: flex;
			.tool-item{
				width:20%;
				
			}
		}
	}
</style>
