<template>
	<view class="page">
		<view class="table-title head-title divide">
			<view>用户列表</view>
			<view class="search-inut">
				<input 
				v-model="keyWord"
				@input="input"
				class="input"
				style="margin: auto 20rpx;z-index: 10;"
				placeholder="电话号码搜索"/>
				<button class="button" @click="searchKeyWord" style="z-index: 6;">搜索</button>
			</view>
		</view>
		<view class="g-table">
			<view class="table-box">
				<view class="table">
					<view class="row thead">
						<view class="th" v-for="(item,index) in columnHead" :key="index">{{item}}</view>
						<view style="width:150rpx"></view>
					</view>
					<view class="row td-row" v-for="(item,index1) in dataList" :key="index1+'row'">
						<view class="td" v-for="(ele,index2) in filterTd(item)" :key="index2+'column'" style="position: relative;">
							<view v-if="index2 === 'userAvatar'" >
								<image :src="ele" style="width: 60rpx;height: 60rpx;border-radius: 100%;"></image>
							</view>
							<view class="td-item" v-else>
								{{ele ? ele :'该用户很懒什么都没留下'}}
								<!-- {{ele.length&&(ele.length > 20) ? ele.slice(0,20)+'...': ele}} -->
							</view>
						</view>
					</view>
					<view class="fixed-right" style="width:150rpx;box-sizing: border-box;">
						<view class="th">操作</view>
						<view class="fixed-td td" v-for="item in dataList" :key="'fixed'+item.id" style="box-sizing: border-box;">
							<button class="button-des" @click="seeActivity(item)">活跃度</button>
						</view>
					</view>
					<loading :loading="isLoading" style="z-index: 10;"/>
				</view>
			</view>
		</view>
		<drawer
		:visible="drawerOption.visible"
		@changeDrawerVisible="changeDrawerVisible">
			<view class="drawer-content">
				<view class="drawer-item" v-for="item in drawerOption.props" :key="item.prop">
					<view class="icon iconfont" :class="item.icon" style="font-size: 80rpx;"></view>
					<view class="drawer-info">
						<view class="info-title">{{item.label}} : </view>
						<view class="info-nums">{{drawerOption.item[item.prop] ? drawerOption.item[item.prop] : 0}}</view>
					</view>
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
	import {getUserLetterList, getUserList} from '../../utils/api.js'
	import loading from '../../directives/loading.vue'
	import pager from '../../components/pager/pager.vue'
	import gTable from '../../components/table/gTable.vue'
	import {useUserStore} from '../../store/index.js'
	import {storeToRefs} from 'pinia'
	import { onMounted,ref,reactive,computed,watch } from "vue"
	import request from '../../utils/request.js'
	import drawer from './component/drawer.vue'
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const dataList = ref([])
	const isLoading = ref(true)
	const pageInfo = reactive({
		pageSize:8,
		currentPage:1,
		queryString:userInfo.value.consultantPhone,
		total:0
	})
	const columnHead = ['头像','用户名','校名','年级','专业','学号','用户id','联系方式','个性签名']
	const renderList = ['userAvatar','userName','schoolName','gradeName','majorName','stuId','userId','userPhone','signature']
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
	function changeDrawerVisible(flag){	
		drawerOption.visible = flag
	}
	
	async function seeActivity(item){
		drawerOption.visible = true
		const r = await request({
			url:'/consultant/getUserActiveData',
			data:{
				userId:item.userId
			}
		})
		drawerOption.item = r
	}
	function filterTd(item){
		const obj  = {
			userAvatar:item.userAvatar,
			userName:item.userName,
			schoolName:item.schoolName,
			gradeName:item.gradeName,
			majorName:item.majorName,
			stuId:item.stuId,
			
			userId:item.userId,
			userPhone:item.userPhone,
			signature:item.signature
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
	async function getUserListApi(queryString = null){
		const r = await getUserList({pageSize:pageInfo.pageSize,currentPage:pageInfo.currentPage,queryString})
		if(r.total){
			pageInfo.total = r.total
			dataList.value = r.rows		
		}else{
			uni.showToast({
				title:'未查找到对应用户',
				icon:"none"
			})
		}
		isLoading.value = false
	}
	
	// #region search 
	const keyWord = ref('')
	async function searchKeyWord(){
		
		for (let i = 1; i <= pageInfo.total; i++) {
			
			const r = await getUserList({
				pageSize:pageInfo.pageSize,
				currentPage:i,queryString:keyWord.value,
			})
			if(r.total){
				pageInfo.total = r.total
				dataList.value = r.rows		
				return ;
			}else{
				uni.showToast({
					title:'未查找到对应用户',
					icon:"none"
				})
			}
			isLoading.value = false
		}
		
	}
	watch(keyWord,(newValue,oldValue)=>{
		if(!newValue){
			getUserListApi()
		}
	})
	watch(()=>pageInfo.currentPage,(newValue,oldValue)=>{
		getUserListApi()
	})

	// #endregion search 
	onMounted(()=>{
		getUserListApi()
		setTimeout(()=>{
			loading.value = false
		},1000)
	})
</script>

<style lang="scss" scoped>
	@import '../../components/table/table.scss';
	@import '../../style/component.scss';
	.page{
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding:0 20rpx;
		overflow: hidden;
	}
	.search-inut{
		display: flex;
		align-content: center;
		box-sizing: border-box;
		.button{
			padding:0 20rpx
		}
		.input{
			text-indent: 10rpx;
			padding-left:10rpx;
		}
	}
	.head-title{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.drawer-content{
		width:100%;
		height:100%;
		padding:20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		box-sizing: border-box;
		.drawer-item{
			display: flex;
			flex-direction: column;
			justify-content: center;
			.drawer-info{
				display: flex;
				align-items: center;
			}
		}
	}
	.table-title{
		font-size: 30rpx;
		padding: 20rpx;
		border-left: 10rpx solid #25c7b6;
		box-sizing: border-box;
		height:100rpx;
		
	}
	.footer{
		display: flex;justify-content: center;align-items: center;
		margin-top: 20rpx;;
	}
	// .td{
	// 	line-height: 80rpx;
	// 	box-sizing: border-box;
	// 	height: 100%;
	// 	box-sizing: border-box;
	// }
	// .td-item{
	// 	width: 100%;
	// 	height: 100%;
	// 	display: flex;justify-content: center;
	// 	align-items: center;
	// 	box-sizing: border-box;
	// }
	
	// .td-image{
	// 	position: absolute;
	// 	top: 50%;
	// 	transform: translateY(-50%);
	// }
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
	
		
</style>