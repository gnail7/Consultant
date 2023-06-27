<template>
	<view class="page">
		<view class="table-title">反馈管理</view>
		<view class="g-table">
			<loading :loading="isLoading" style="z-index: 20x;"/>
			<view class="g-table">
				<view class="table-box">
					<view class="table">
						<view class="row thead">
							<view class="th" v-for="(item,index) in columnHead" :key="index">{{item}}</view>
							<view style="width:150rpx"></view>
						</view>
						<view class="row" v-for="(item,index1) in dataList" :key="index1">
							<view class="td" v-for="(ele,index2) in filterTd(item)" :key="index2" style="position: relative;">
								<view  class="td-item td-image" v-if="index2 === 'userAvatar'" >
									<image :src="ele" style="width: 60rpx;height: 60rpx;border-radius: 100%;"></image>
								</view>
								<view class="td-item" v-else>
									{{ele.length&&(ele.length > 20) ? ele.slice(0,20)+'...': ele}}
								</view>
							</view>
						</view>
						<view class="fixed-right" style="width:150rpx;background: pink;box-sizing: border-box;height:100rpx">
							<view class="th">操作</view>
							<view class="fixed-td td" v-for="item in dataList" :key="item.id" style="box-sizing: border-box;">
								<button class="button" @click="seeDetail(item)">详情</button>
							</view>
						</view>
						<loading :loading="isLoading" style="z-index: 10;"/>
					</view>
				</view>
			</view>
		</view>
		<drawer
		v-if="drawerOption.visible"
		:visible="drawerOption.visible"
		@changeDrawerVisible="changeDrawerVisible">
			<view class="content"  >
				<view class="icon iconfont icon-guanbi" @click="changeDrawerVisible(false)"></view>
				<view class="header divide">
					<view class="author divide">{{drawerOption.item.user.userName ? drawerOption.item.user.userName : ''}}</view>
					<view class="time divide">{{drawerOption.item.feedbackTime ? drawerOption.item.feedbackTime : ''}}</view>
				</view>
				<view class="main-article">
					<p>反馈内容:{{drawerOption.item.feedbackInfo ? drawerOption.item.feedbackInfo : ''}}</p>
				</view>
			</view>
		</drawer>
		<view class="footer" style="z-index:6">
			<pager
			:total="pageInfo.total"
			:currentPage="pageInfo.currentPage"
			:pageSize="pageInfo.pageSize"
			@pageChange="togglePage"
			@iconClick="backOrNext"
			/>
		</view>
	</view>
</template>

<script setup>
	import {computed, onMounted, reactive, ref, watch} from 'vue'
	import {getSucideHotlines} from '../../utils/api.js'
	import drawer from '../userList/component/drawer.vue'
	import loading from '../../directives/loading.vue'
	import pager from '../../components/pager/pager.vue'
	import request from '../../utils/request.js'
	const dataList = ref([])
	const pageInfo = reactive({
		pageSize:5,
		currentPage:1,
		total:0
	})
	const drawerOption = reactive({
		visible:false,
		item:{},
		props:[
			{
				prop:'postNum',
				icon:'icon-fatie',
				label:'发帖次数'
			},
			{
				prop:'replyNum',
				icon:'icon-huifu',
				label:'回复次数'
			},
			{
				prop:'letterNum',
				icon:'icon-xinfengxinjianyouxiangxianhuaxinfeng',
				label:'信封次数'
			},
			{
				prop:'roomNum',
				icon:'icon-cha',
				label:'茶话会次数'
			},
			{
				prop:'consultNum',
				icon:'icon-zixun-tousu',
				label:'咨询次数'
			},
		]
	})
	const columnHead = ['头像','反馈人id','反馈人','反馈内容','反馈时间']
	const props = ['userAvatar','userId','userName','feedbackInfo','feedbackTime']
	const isLoading = ref(true)
	function filterTd(item){
		const obj = {
			userAvatar:item.user.userAvatar,
			userId:item.user.userId,
			userName:item.user.userName,
			feedbackInfo:item.feedbackInfo,
			feedbackTime:item.feedbackTime
		}
		return obj
	}
	function togglePage(value){
		pageInfo.currentPage = value
	}
	function backOrNext(val){
		if(val>0){
			if(pageInfo.currentPage < Math.ceil(pageInfo.total/pageInfo.pageSize)){
				pageInfo.currentPage = pageInfo.currentPage +1
			}
		}else{
			if(pageInfo.currentPage > 1){
				pageInfo.currentPage = pageInfo.currentPage -1
			}
		}
	}
	function changeDrawerVisible(flag){
		drawerOption.visible = flag
	}
	function seeDetail(item){
		drawerOption.item = item
		drawerOption.visible = true
	}
	async function getFeedbackListApi(queryString = null){
		const r = await request({
			url:'/consultant/getFeedbackList',
			data:{...pageInfo,queryString}
		})
		pageInfo.total = r.total
		dataList.value = r.rows
		isLoading.value = false
	}
	watch(()=>pageInfo.currentPage,(newValue,oldValue)=>{
		isLoading.value = true
		getFeedbackListApi()
	})
	onMounted(async()=>{
		await getFeedbackListApi()
		setTimeout(()=>{
			loading.value = false
		},1000)
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
		position: fixed;
		bottom: 100rpx;
		left: 50%;
		transform: translate(-50%);
	}
	.td{
		line-height: 80rpx;
		box-sizing: border-box;
		height: 100%;
	
	}
	.td-item{
		width: 100%;
		height: 100%;
		display: flex;justify-content: center;
		align-items: center;
	}
	.td-image{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
	.divide{
		margin:20rpx auto;
	}
	.content{
		width:100%;
		height:100%;
		box-sizing: border-box;
		position: absolute;
		right:0%;
		background: #ffffff;
		transition: all 0.8s ease-in-out;
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
			max-height:75%;
			padding:10rpx;
			overflow-y: auto;
			word-break: break-all;
		}
		.content-footer{
			position: absolute;
			bottom: 40rpx;
			width:100%;
			.button-group{
				display: flex;
				.button{
					position: absolute;
					right: 60rpx;
					bottom: 10rpx;
				}
			}
		
		}
	}
	.button{
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
</style>
