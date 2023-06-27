<template>
	<view class="page">
		<view class="table-title">动态列表管理</view>
		<view class="g-table">
			<view class="table-box">
				<view class="table">
					<view class="row thead">
						<view class="th" v-for="(item,index) in columnHead" :key="index">{{item}}</view>
						<view style="width:150rpx"></view>
					</view>
					<view class="row td-row" v-for="(item,index1) in activityList" :key="index1+'row'">
						<view class="td" v-for="(ele,index2) in filterTd(item)" :key="index2+'column'" style="position: relative;">
							<view class="td-item" v-if="index2 === 'wordText'"  style="width:200rpx;text-overflow: ellipsis; overflow:hidden;">{{ele}}</view>
							<view class="td-item" v-else>{{ele}}</view>
							<!-- <view class="td-item" >
								{{ele ? ele :'该用户很懒什么都没留下'}}
								
							</view> -->
						</view>
					</view>
					<view class="fixed-right" style="width:150rpx;box-sizing: border-box;">
						<view class="th">操作</view>
						<view class="fixed-td td" v-for="item in activityList" :key="'fixed'+item.id" style="box-sizing: border-box;">
							<button class="button-des" @click="seeActivity(item)">详情</button>
						</view>
					</view>
					<loading :loading="isLoading" style="z-index: 10;"/>
				</view>
			</view>
		</view>
		<drawer
		:tweetId="drawerOption.item.id"
		:visible="drawerOption.visible"
		@changeDrawerVisible="changeDrawerVisible">
			<view class="drawer-content">
				<button class="button hor-divide divide delete-btn button-des " @click="deleteTweet(drawerOption.item.id)">删除</button>
				<view class="header">
					<image class="avatar" :src="drawerOption.item.post_user?.userAvatar" mode="widthFix"></image>
					<text class="hor-divide">{{drawerOption.item.post_user?.userName || '微信用户'}}</text>
				</view>
				<view class="img-list divide" v-if="drawerOption.item.imglist">
					<gImage class="show-pic divide hor-divide" mode="widthFix" :src="item" v-for="item in drawerOption.item.imglist?.split(',')" :key="item"></gImage>
				</view>
				<view class="word-text hor-divide divide" style="  color:#575757;display:flex;flex-direction: column;"> 
					<view v-html="drawerOption.item.wordText"></view>
					<span class="hor-divide divide" style="font-size: 24rpx;">{{drawerOption.item.tweetTime}}</span>
				</view>
			
			</view>
		</drawer>
		<view class="footer" style="z-index: 7;">
			<pager
			:total="pageInfo.total+1"
			:currentPage="pageInfo.currentPage"
			:pageSize="pageInfo.pageSize"
			@pageChange="togglePage"
			@iconClick="backOrNext"
			/>
		</view>
	</view>
</template>

<script setup>
	import { onMounted, reactive ,ref} from "vue";
	import request from '@/utils/request.js'
	import loading from '../../directives/loading.vue'
	import pager from '../../components/pager/pager.vue'
	import drawer from './drawer/index.vue'
	import gImage from '../chatRoom/component/gImage.vue'
	import {showModal} from '@/utils/index.js'
	
	const activityList = ref([])
	const pageInfo = reactive({
		pageSize:10,
		currentPage:1,
		queryString:null,
		total:0,
	})
	const drawerOption = reactive({
		visible:false,
		item:{},
	})
	const isLoading = ref(true)
	const columnHead = ['用户','联系方式','发表内容','获赞数','评论数','发表时间']
	
	const init = async()=>{
		const r = await request({url:'/user/getTweetList',data:pageInfo})
		activityList.value = r.rows
		isLoading.value = false
		pageInfo.total = r.total
		
	}
	function filterTd(item){
		const obj  = {
			name:item.post_user?.userName,
			userPhone:item.post_user?.userPhone,
			wordText:item?.wordText,
			likeNum:item.likeNum,
			commentNum:item.commentNum,
			tweetTime:item.tweetTime,
		}
		return obj
	}
	async function togglePage(value){
		pageInfo.currentPage = value		 
		isLoading.value = true
		await init()
	}
	async function backOrNext(val){
		if(val>0){
			if(pageInfo.currentPage < Math.ceil(pageInfo.total/pageInfo.pageSize)){
				pageInfo.currentPage = pageInfo.currentPage +1
			}
		}else{
			if(pageInfo.currentPage > 1){
				pageInfo.currentPage = pageInfo.currentPage -1
			}
		}
		isLoading.value = true
		init()
	}
	const seeActivity = (item)=>{
		drawerOption.item = item
		drawerOption.visible = true
	}
	function changeDrawerVisible(flag){
		drawerOption.visible = flag
	}
	const deleteTweet = async(id)=>{
		const confirm = await showModal('确认删除这个动态吗?')
		switch(confirm){
			case true:
				const r = await request({url:'/tweet/deleteTweet',data:id})
				if(r){
					uni.showToast({
						title:'删除成功'
					})
					await init()
				}
				drawerOption.visible = false
				break;
			case false:
				break;
		}
	}
	
	onMounted(async()=>{
		await init()
	})
</script>

<style lang="scss" scoped>
	@import '../../components/table/table.scss';
	.page{
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		
	}
	.button{
		border-radius: 20rpx;
		border: none;
		background-color:#25c7b6;
		color:#ffffff;
		font-size: 28rpx;
		&::after{
			border:none;
		}
	}
	.avatar{
		width:80rpx;
		height:80rpx;
		overflow: hidden;
		border-radius: 100%;;
	}
	.g-table{
		margin: 20rpx auto;
		position: relative;
	}
	.table-title{
		font-size: 30rpx;
		padding: 20rpx;
		border-left: 10rpx solid #25c7b6;
	}
	.footer{
		display: flex;justify-content: center;align-items: center;
		margin-top: 20rpx;;
	}
	.button-des{
		border: none;
		padding:0rpx;
		background: #ffffff;
		color:#00e1b4;
		font-size: 24rpx;
		&::after{
			border: none;
			padding:0rpx;
			margin:0rpx;;
		}
	}
	
	image{
		object-fit: cover;
	}
	.success{
		color:black;
		
	}
	.failed{
		color:#F56C6C;
	}
	.drawer-content{
		padding:20rpx;
		padding-top: 50rpx;
		overflow: auto;
		.header{
			display:flex;
			align-items: flex-end;
			
		}
		.img-list{
			width:100%;
			display:flex;
			flex-wrap: wrap;
			image{
				width:300rpx;
				height:300rpx;
				border-radius:10rpx;
			}
		}
	}
	.hor-divide{
		margin-left:10rpx;
	}
	.divide{
		margin-top:10px;
	}
	.delete-btn{
		width:fit-content;
		position: absolute;
		top: 10rpx;
		right:10rpx;
		background-color:#fffbe5 ;
		color:red;
	}
</style>