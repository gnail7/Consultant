<template>
	<view class="drawer"  v-if="visible" style="z-index:10;">
		<view class="content-box">
			<view class="mask" @click="changeVisible"></view>
			<view class="content">
				<view class="icon iconfont icon-guanbi" @click="changeVisible"></view>
				<view style="position: absolute;right: 10rpx;top:5rpx;background: #fff;display: flex;justify-content: space-between;">
					<button class="button" style="background: #fff;color:red" @click="deleteArticle">删除</button>
					<button class="button" style="background: #fff;color:skyblue" @click="emitCancelOpen" v-if="item.hasOpen">取消公开</button>
				</view>
				
				<view class="header">
					<view class="author divide">{{item.postUser.userName}}</view>
					<view class="time divide">{{item.createTime}}</view>
					
				</view>
				<view class="main-article">
					<p>{{item.letterInfo}}</p>
				</view>
				<view class="comment-title" >回复:</view>
				<scroll-view 
				@scrolltolower="scrollToBottom"
				style="height:35%; border-top: 2rpx solid  #a6a9ad;flex:1;" 
				:scroll-y="true">
					<view class="comment">
						<view class="comment-item" v-for="(ele,index) in currentList" :key="index">
							<view class="left">
								<image :src="ele.postUser.consultantAvatar || ele.postUser.userAvatar" style="width: 60rpx;border-radius: 100%;height: 60rpx;"></image>
							</view>
							<view class="right">
								<view class="reply-username">
									{{ele.postUser.userName || ele.postUser.consultantName}}
									<text style="color: #909399;" v-if="(ele.postUser.consultantId &&(ele.postUser.consultantId === userInfo.consultantId))">(我)</text>
								</view>
								<view class="reply-info">
									{{ele.replyInfo}}
								</view>
								<view class="right-time" style="position: absolute;right: 10rpx;top: 10rpx;color:#909399;">{{ele.createTime.slice(0,-3)}}</view>
							</view>
						</view>
						<view v-if="currentList.length === item.letterReplyDtos.length" class="info">没有更多回复了~</view>
						<view v-else class="info"><loading :loading="pageInfo.isLoading"></loading>下拉加载更多</view>
					</view>
				</scroll-view>
				
				<view class="content-footer">
					<view class="button-group" v-if="userInfo.hasManager">
						<view class="btn-box">
							
							<button class="button reply" @click="toReply(item)">回复</button>
							<button class="button" @click="changeHasOpen" v-if="!item.hasOpen">公开</button>
							<button class="button" @click="addToGoodArticle(true)" v-else-if="item.hasOpen&&!item.hasGood">选为优质内容</button>
							<button class="button" @click="addToGoodArticle(false)" v-else>取消优质资格</button>
						</view>
					</view>
					<view class="button-group" v-else>
						<view class="btn-box">
							<button class="button reply" @click="toReply(item)">回复</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {onMounted, toRefs,reactive,ref,computed,nextTick, inject} from 'vue'
	import {showModal} from '../../../utils/index.js'
	import {useUserStore} from '../../../store/index.js'
	import {storeToRefs} from 'pinia'
	import loading from '../../chatRoom/component/chatLoading.vue'
	import request from '../../../utils/request.js'
	const props = defineProps({
		visible:{
			type:Boolean,
			default:false
		},
		item:Object,
		selectedId:Number
	})
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const emit = defineEmits(['changeDrawerVisible','successToOpen','addToGoodArticle','closeHasOpen','toReply','cancleOpen'])
	const {visible,item,selectedId} = toRefs(props)
	const pageInfo = reactive({
		pageSize:5,
		currentPage:1,
		isLoading:false
	})
	// const newArr = computed(()=>item.value.letterReplyDtos)
	const beginIndex = ref(0)
	function sortByAtt(a,b){
		return a.createTime - b.createTime
	}
	
	const currentList = computed(()=>{
		const newArr = item.value.letterReplyDtos
		let end = (beginIndex.value+pageInfo.pageSize-1)*pageInfo.currentPage
		if(end>=item.value.letterReplyDtos.length){
			end = item.value.letterReplyDtos.length
		}
		return newArr.slice(beginIndex.value,end)
	})
	function changeVisible(){
		emit('changeDrawerVisible')
	}
	function closeHasOpen(){
		emit('closeHasOpen',item.value)
	}
	async function emitCancelOpen(){
		const txt = '确认取消公开?'
		const flag = await showModal(txt)
		if(flag){	
			emit('cancleOpen',item.value)
		}
	}
	function scrollToBottom(){
		
		if(currentList.value.length < item.value.letterReplyDtos.length){
			pageInfo.isLoading = true
			setTimeout(()=>{
				pageInfo.currentPage++
				pageInfo.isLoading = false
			},1000)
			
		}
	}
	async function changeHasOpen(){
		const txt = '确认公开?'
		const flag = await showModal(txt)
		if(flag){	
			emit('successOpen',item.value)
		}
	}
	async function addToGoodArticle(flag){
		const txt1 = flag ? '确认将该信封选为答案之书?':'确认取消该信封答案之书的资格?'
		const f1 = await showModal(txt1)
		if(f1){
			emit('addToGoodArticle',{item:item.value,flag})
		}
	}
	function toReply(item){
		emit('toReply',item)
	}
	const init = inject('init')
	async function deleteArticle(){
		const confirm = await showModal('确认删除这篇文章吗?')
		if(confirm){
			const r = await request({
				url:'/consultant/deleteLetter',
				data:{letterId:item.value.letterId}
			})
			emit('changeDrawerVisible')
			uni.showToast({
				title:'删除成功',
				icon:'none'
			})
			init({id:selectedId.value})
		}
		
	}
	onMounted(()=>{
		
	})
</script>

<style lang="scss" scoped>
	@import '../../../style/component.scss';
	.drawer{
		position: absolute;
		top: 0;
		left:0;
		height:100vh;
		width:100vw;
		z-index: 7;
		.content-box{
			height:100vh;
			width:100vw;
			position: relative;
			.mask{
				background: rgba(0, 0, 0, 0.2);
				width:30%;
				height:100%;
				position: absolute;
				left: 0%;
				
			}
			.content{
				width:90%;
				height:100%;
				box-sizing: border-box;
				position: absolute;
				right:0%;
				background: #ffffff;
				transition: all 0.8s ease-in-out;
				overflow-y: auto;
				padding:30rpx;
				.header{
					.author{
						
					}
					.time{
						font-size: 24rpx;
						color:#9a9a9a;
						border-bottom: 5rpx solid #ededed;
					}
				}
				.main-article{
					box-sizing: border-box;
					width:100%;
					height: 50%;
					padding:10rpx;
					overflow-y: auto;
					word-break: break-all;
				}
				.content-footer{
					position: fixed;
					right: 0rpx;
					
					// bottom: 40rpx;
					width:100%;
					.button-group{
						position: absolute;
						right: 10rpx;
						bottom: 10rpx;
						.btn-box{
							display: flex;
							.reply{
								background: #ffffff;
								color: black;
								border:1rpx solid #25c7b6;
								margin-right: 10rpx;
							}
						}
						
					}
				
				}
			}
			.active-content{
				right: 0;
			}
		}
	}
	.divide{
		margin: 20rpx auto;
	}
	.comment{
		width: 100%;
		font-size: 24rpx;
		margin-top: 40rpx;
		// .comment-title{
		// 	border-left: 10rpx solid #25c7b6;
		// 	font-size: 28rpx;
		// 	padding: 20rpx;
		// }
		.comment-title{
			
			font-size: 32rpx;
		}
		.comment-item{
			display: flex;
			margin: 10rpx;
			padding:15rpx 0rpx;
			flex-wrap: wrap;
			width:100%;
			word-break: break-all;
			position: relative;
			.left{
				font-size: 28rpx;
				// position: absolute;top: 10rpx;
				.reply-username{
					
				}
			}
			.right{
				margin-left: 10rpx;
				display: flex;
				flex-direction: column;
				flex:1;
				.reply-info{
					word-break: break-all;
					flex-wrap: wrap;
				}
			}
		}
	}
	.info{
	
		margin-top: 30rpx;
		color:#909399;
	}
</style>