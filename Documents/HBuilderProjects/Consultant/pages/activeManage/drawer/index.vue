<template>
	<view class="container" :class="visible ? 'visible':'hidden'">
		<view class="box">
			<view class="mask" @click="closeDrawer"></view>
			<view class="drawer">
				<slot></slot>
				<view class="comment divide" style="position: relative;" v-if="visible">
					<loading 
					:bgColor="'#fffbe5'"
					:loading="isLoading" style="z-index: 12;"></loading>
					<view
					v-for="item in replyList.replyDtoList"
					:key="item.id"
					class="comment-item normal-size" >
						<view class="parent-comment">
							<view class="left-zone ">
								<image :src="item.replyUser?.userAvatar ||'../../../static/image/logo.jpg' "  mode="widthFix" style="width:60rpx;height:60rpx;"></image>
								<view class="block  small-size">
									<text>{{item.replyUser?.userName || '微信用户'}}</text>
									<text class="de-text">{{item.replyTime}}</text>
								</view>
							</view>
							<view class="comment-content">
								<view>{{item.textInfo}}</view>
							</view>
							<view v-if="item.subReplyDtoList" class="comment-content">
								<view v-for="ele in item.subReplyDtoList" class="sub-reply-item" :key="ele.id">
									<view class="sub-reply-head">
										<text class="regualr-text">{{ele.postUser.userName}}:</text>
										<text style="margin: 0 20rpx;">回复:/</text>
										<text class="regualr-text">{{ele.toUser.userName}}</text>
									</view>
									<view class="divide">{{ele.textInfo}}</view>
									<view class="divide regualr-text">{{ele.createTime}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="border" style="height: 1rpx;width:90%;margin: auto;background-color: aquamarine;"></view>
			</view>
			
		</view>
	</view>
</template>

<script setup>
	import {toRefs, watch,ref, onMounted} from 'vue'
	import request from '../../../utils/request.js'
	import loading from '@/directives/loading.vue'
	const props = defineProps({
		visible:{
			type:Boolean,
			default:false
		},
		tweetId:{
			type:String,
			default:''
		}
	})
	const isLoading = ref(true)
	const replyList = ref([])
	const emit = defineEmits(['changeDrawerVisible'])
	function closeDrawer(){
		emit('changeDrawerVisible',false)
	}
	const {visible,tweetId} = toRefs(props)
	const init = async()=>{
		try{
			const r = await request({url:'/tweet/findTweetById',data:{tweetId:tweetId.value}})
			replyList.value = r
			isLoading.value = false
		}catch(e){
			isLoading.value = false
		}
		
	}
	watch(visible,async()=>{
		if(visible.value&&tweetId.value){
			await init()
		}else{
			isLoading.value = true
		}
		
	},{immediate:true})
	
</script>

<style lang="scss" scoped>
	.container{
		width:100vw;
		height:100vh;
		position: fixed;
		top:0;
		z-index: 10;
		transition: all 0.2s ease-in-out;
	
		.box{
			position: relative;
			width:100vw;
			z-index: 10;
			height:100vh;
			.drawer{
				width:90vw;
				height: 100%;
				// background: #ffffff;
				background:#fffbe5;
				position: absolute;
				right: 0rpx;
				z-index: 10;
				box-shadow: 0 1rpx 14rpx 0 rgba(0, 0, 0, .1);
				overflow: auto;
				padding-bottom: 60rpx !important;
			}
			.mask{
				width:100vw;
				height:100vh;
				position: absolute;
				left:0;
				top:0;
				z-index: 10;
			}
		}
		
	}
	.visible{
		right: 0;
	}
	.divide{
		margin:10rpx 0;
	}
	.hidden{
		right: -100%;
	}
	.left-zone{
		display:flex;
		align-items: flex-end;
		.block{
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			margin-left: 10rpx;
		}
		
	}
	.comment-item{
		margin-bottom: 25rpx;;
		margin-left: 20rpx;;
	}
	.comment-content{
		margin-left: 70rpx;
		margin-top: 10rpx;;
	}
	.normal-size{
		font-size: 25rpx;;
	}
	.small-size{
		font-size: 22rpx;
		
	}
	.de-text{
		color: #a6a9ad
	}
	.sub-reply-item{
		background-color: #f7f7f7;
		padding:10rpx;
		margin-bottom: 20rpx;
	}
	.regualr-text{
		color:#b1b1b1
;
	}
</style>