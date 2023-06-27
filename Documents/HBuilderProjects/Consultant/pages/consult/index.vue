<template>
	<view class="page">
		<view class="table-title head-title divide">
			<view>咨询管理</view>
			<g-select 
			style="box-sizing: border-box;"
			@expandOption="expandOption"
			@selectedOption="selectedOption"
			:options="selectOption.options"
			:visible="selectOption.visible"/>
		</view>
		<view class="table-box">
			<view class="table">
				<view class="row thead">
					<view class="th" v-for="(item,index) in columnHead" :key="index">{{item}}</view>
					<view style="width:280rpx" ></view>
				</view>
				<view class="empty" v-if="dataList.length === 0">No Data</view>
				<view class=" td-row row " v-for="(item,index1) in currentList" :key="index1"  style="height: 55px !important;">
					<view  class="td">
						<image :src="item.fromUser.userAvatar ?item.fromUser.userAvatar : 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'" style="width: 60rpx;height: 60rpx;border-radius: 100%;" ></image>
					</view>
					<view class="td username">
						{{item.fromUser.userName}}
					</view>
					<view class="td">
						<view :class="(computedStatus(item)).statusClass" >
							{{(computedStatus(item)).label}}
						</view>	
					</view>
					<view class="td">
						{{item.fromUser.userPhone}}
					</view>
					<view class="td">
						{{item.feedback ? item.feedback : '暂无反馈'}}
					</view>
				</view>
				<view class="fixed-right" style="width:280rpx;" >
					<view class="th">操作</view>			
					<view class="fixed-td td" v-for="item in currentList" :key="item.id" style="height: 55px;;box-sizing: border-box">
						<view class="operate">
							<button class="button g-button" @click="addPersonalChat(item)" v-if="item.hasEnd">私聊</button>
							<button class="button g-button divide" v-if="!item.hasEnd && !item.endTime" @click="toChatRoom(item)">进入</button>
							<button class="button g-button divide transfer-btn" v-if="!item.hasEnd && !item.endTime" @click="showTransfer(item)">转接</button>
							<button class="button g-button divide end-btn" v-if="!item.hasEnd && !item.endTime" @click="emitEndResult(item)">结束</button>
							<button class="button" v-if="!item.hasEnd && item.endTime" :disabled="true">等待反馈</button>
						</view>
					</view>
				</view>
				<loading :loading="isLoading" style="z-index: 10;"/>
			</view>
		</view>
		<view class="footer" style="z-index:6">
			<pager
			:total="dataList.length" 
			:currentPage="pageInfo.currentPage"
			:pageSize="pageInfo.pageSize"
			@pageChange="togglePage"
			@iconClick="backOrNext"
			/>
		</view>
		<view class="dialog2" v-show="transferDialog.visible">
			<view class="box2">
				<view class="mask2" @click="closeList"></view>
				<view class="consultant-list">		
					<view class="consultant-item" v-for="item in consultantList" :key="item.id">
						<view class="left">
							<image :src="item.consultantAvatar" style="width:60rpx;height:60rpx"></image>
							<view class="name">{{item.consultantName}}</view>
						</view>
						<view class="right">
							<button	class="btn zj" @click="transfer(item)">转接</button>
							<button	class="btn sl" @click="addPersonalChat(item)">私聊</button>
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
	</view>
</template>

<script setup>
	import {computed, onMounted, reactive, ref,watch} from 'vue'
	import {onLoad,onUnload,onShow} from '@dcloudio/uni-app'
	import {addChatInfo,updateConsultant} from '@/utils/api.js'
	// import gTable from '../../components/table/gTable.vue'
	import pager from '@/components/pager/pager.vue'
	import loading from '../../components/loading/index.vue'
	import request from '../../utils/request.js'
	import {useUserStore} from '../../store/index.js'
	import {storeToRefs} from 'pinia'
	import gSelect from '../../components/gSelect/index.vue'
	import {showModal,formatDate} from '../../utils/index.js'
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const pageInfo = reactive({
		pageSize:7,
		currentPage:1
	})
	const isLoading = ref(true)
	const dataList = ref([])
	const transferDialog = reactive({
		visible:false
	})
	function backOrNext(val){
		if(val>0){
			(pageInfo.currentPage < Math.ceil(dataList.value.length/pageInfo.pageSize)) && pageInfo.currentPage++
		}else{
			(pageInfo.currentPage > 1) && pageInfo.currentPage--
		}
	}
	function backOrNextOfCon(val){
		if(val>0){
			(transferPageInfo.currentPage < transferPageInfo.total ) && (transferPageInfo.currentPage = transferPageInfo.currentPage+1);
		}else{
			(transferPageInfo.currentPage > 1) && (transferPageInfo.currentPage = transferPageInfo.currentPage-1);
		}		
	}
	function computedStatus(item){
		let obj = {
			statusClass:'consulting',
			label:'咨询中'
		}
		if(item.hasEnd ){
			obj = {
				statusClass:'end-consult',
				label:'结束'
			}
		}else if(!item.hasEnd && item.endTime){
			obj = {
				statusClass:'wait-feedback',
				label:'对方填写反馈后结束'
			}
		}
		return obj
	}
	function togglePage(value){
		pageInfo.currentPage = value
	}
	// #region transferdialog的分页
	const consultantList = ref([])
	const transferPageInfo = reactive({
		pageSize:7,
		currentPage:1,
		queryString:'',
		total:0
	})

	const toggleConsultantListPage = (val)=>{
		transferPageInfo.currentPage = val
	}
	watch(()=>transferPageInfo.currentPage,async()=>{
		await initTransfer()
	})
	
	function closeList(){
		transferDialog.visible = false
	}
	
	// #endregion transferdialog的分页
	const beginIndex = computed(()=>(pageInfo.currentPage-1)*pageInfo.pageSize)
	const currentList = computed(()=>{
		return dataList.value.slice(beginIndex.value,beginIndex.value+pageInfo.pageSize)
	})
	const columnHead = ['头像','用户名','咨询状态','联系方式','反馈']
	const propsList = ['userAvatar','userName','endTime']
	function filterTd(item){
		const obj = {
			userAvatar:item.fromUser.userAvatar,
			userName:item.fromUser.userName,
			endTime:item.fromUser.endTime,
			userPhone:item.fromUser.userPhone,
			feedback:item.feedback
		}
		return obj
	}
	const currentConsult = ref({})
	// #region select
	const getSelected = computed(()=>{
		const arr = selectOption.options.filter(item=>item.selected)
		return arr[0]
	})
	const selectOption = reactive({
		visible:false,
		options:[
			{
				label:'咨询中',
				id:1,
				selected:true
			},
			{
				label:'已结束',
				id:2,
				selected:false
			},
			
		],
	})
	function showTransfer(item){
		transferDialog.visible = true
		currentConsult.value = item
	}
	function expandOption(flag){
		selectOption.visible = flag
	}
	function transfer(item){
		const  t = new Date().getTime()
		const time = formatDate(t)
		uni.showModal({
			content:`确认将"${currentConsult.value.fromUser.userName}"转接给${item.consultantName}?`,
			success:async (res) => {
				if(res.confirm){
					const r2 = await request({url:'/consultant/updateConsultation',method:'post',
					data:{
						...currentConsult.value,
						wordInfoList:[],
						toUser:item,
						startTime:time
						},
					})
					if(r2.flag){
						userStore.changeConsultNums(userInfo.value.consultNum--)
						uni.setStorageSync('userInfo',userInfo.value)
						uni.showToast({
							title:"转接成功",
							icon:'none'
						})
						const r3 = await updateConsultant({...userInfo.value,status:0})
						userInfo.value = {...userInfo.value,status:0}
						uni.setStorageSync('userInfo',userInfo.value)
						transferDialog.visible = false
					}
				}
			}
		})
	}
	function toChatRoom(item){
		if(!item.endTime){
			const i = JSON.stringify({...item,personal:false})
			uni.switchTab({
				url:`/pages/chatHall/chatHall`
			})
		}
		
	}
	
	
	async function addPersonalChat(item){
		const flag  = await showModal(`确认与"${item.consultantName || item.fromUser.userName}"私聊`)
		if(flag){
			const r = await addChatInfo({userAId:item.consultantId || item.fromUser.userId,userBId:userInfo.value.consultantId})
			if(r){
				setTimeout(()=>{
					uni.switchTab({
						url:'/pages/chatHall/chatHall'
					})
				},1000)
			}
		}
	}
	function showModal2(data){
		return new Promise((resolve,reject)=>{
			uni.showModal({
				content:`结束咨询,确认结束${data.fromUser.userName}的咨询吗?`,
				success: (res) => {
					if(res.confirm){
						resolve(true)
					}
					resolve(false)
				}
			})
		})
	}
	async function emitEndResult(item){
		const flag = await showModal2(item)
		if(flag){
			const t = new Date().getTime()
			const endTime = formatDate(t)
			const consultNum = userInfo.value.consultNum+1
			const r1 = await request({
				url:'/consultant/updateConsultation',
				data:{...item,endTime,hasEnd:false},
				method:"post"
			})
			if(r1.flag){		
				const r2 = await updateConsultant({...userInfo.value,consultNum})
				userInfo.value = {...userInfo.value}
				uni.setStorageSync('userInfo',userInfo.value)
				userStore.changeConsultNums(userInfo.value.consultNum--)
				uni.showToast({
					icon:"none",
					title:'结束咨询'
				})
			}
		}
	}
	function selectedOption(item){
		selectOption.options = selectOption.options.map(ele=>{
			if(ele.id === item.id) ele.selected = true;
			else{
				ele.selected = false
			}
			selectOption.visible = false
			return ele
		})
	}
	watch(getSelected,(newValue,oldValue)=>{
		isLoading.value = true
		init(newValue)
	})
	async function init(selected){
		const {id} = selected
		switch(id){
			case 2:
			uni.$off('getWordInfoList')
			const r = await request({
				url:'/consultant/getConsultDoneList',
				method:'POST',
				data:{...userInfo.value}
			})
			dataList.value = r
			isLoading.value = false
			break;
			case 1:
			uni.$on('getWordInfoList',(res)=>{
				dataList.value = res
				isLoading.value = false
			})
			break;
		}
		
	}
	// #endregion
	const initTransfer = async()=>{
		const r = await request({url:'/consultant/getFreeConsultants',method:'POST',data:transferPageInfo})
		if(r){
			consultantList.value = r.rows
			transferPageInfo.total = r.total
		}
	}
	onMounted(async()=>{
		await init(getSelected.value)	
		await initTransfer()
		setTimeout(()=>{
			if(!isLoading.value ){
				isLoading.value = false
			}
			
		},1000)
	})
</script>

<style lang="scss" scoped>
	@import '../../style/component.scss';
	@import '../../components/table/table.scss';
	.top{
		margin-bottom: 20rpx;
	}
	.page{
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		
	}
	
	.table{
		width:100%;
	}
	.head-title{
		display: flex;
		width:100%;
		justify-content: space-between;
		box-sizing: border-box;
		align-items: center;
	}

	.table-title{
		font-size: 30rpx;
		padding: 20rpx;
		border-left: 10rpx solid $uni-btn-bg-color;
	}
	.empty{
		width:98vw;
		height:400rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		// border: 4rpx solid #ededed;
		
	}

	.username{
		color: #25c7b6;
	}
	.g-table{
		margin: 20rpx auto;
		position: relative;
		width: 100%;
		.table-box{
			width: 100%;
			.table{
				width: 100%;
			}
		}
	}
	.table-title{
		font-size: 30rpx;

		border-left: 10rpx solid #25c7b6;
	}
	// .footer{
	// 	position: fixed;
	// 	bottom: 100rpx;
	// 	left: 50%;
	// 	transform: translate(-50%);
	// }
	.footer{
		display: flex;justify-content: center;align-items: center;
		margin-top: 20rpx;;
	}
	.td{
		box-sizing: border-box;
		line-height: 80rpx;
		position: relative;
		.td-item{
			width: 100%;
			height:100%;
		}
		image{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
	}
	.divide{
		margin: 20rpx;
	}
	
	.dialog2{
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		left:0;
		
		.box2{
			width:100%;
			height: 100%;;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			.mask2{
				width: 100vw;
				height: 100vh;
				background-color: rgba(0, 0, 0, 0.5);
				position: absolute;
				top: 0;
				left:0;
				z-index: 10;
			}
			.consultant-list{	
				border-radius: 50rpx;
				overflow: auto;
				width:95%;
				height: fit-content;
				background-color: #ffffff;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				z-index: 11;
				position: relative;
				
			}
		}
	}
	.dialog-footer{
		// position: absolute;
		// bottom: 20rpx;
		// left: 50%;
		// transform: translate(-50%);
		display:flex;
		justify-content: center;
		align-items: center;
	}
	.consultant-item{
		display: flex;
		height:150rpx;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-bottom: 2rpx solid $uni-border-grey;
		box-sizing: border-box;
		.left{
			display: flex;
			width:100%;
			flex:1.5;
			.name{
				display: flex;
				margin-left:20rpx;
				align-items: center;
				width:100%;
			}
			image{
				width:90rpx;
				height: 90rpx;
				border-radius: 100%;
			}
		}
		.right{
			display: flex;
			height:100%;
			align-items: center;
			flex:1;
			width:100%;
			.btn{
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				width:auto;
				box-sizing: border-box;
				padding: 10rpx 20rpx;
				font-size: 28rpx;
				&::after{
					border: none;
				}
			}
			.zj{
				background-color: #ffffff;
				box-sizing: border-box;
				color:#25c7b6;
				align-items: center;
				&::after{
					border: 10rpx solid $uni-border-grey;
				}
			}
			.sl{
				background-color: #25c7b6;
				box-sizing: border-box;
				color:#ffffff;
				align-items: center;
				&::after{
					border: 10rpx solid $uni-border-grey;
				}
			}
		}
	}

	.g-button{
		border: none;
		padding:0rpx;
		background: #ffffff;
		color:#25c7b6;
		font-size: 24rpx;
		&::after{
			border: none;
			padding:0rpx;
			margin:0rpx;;
		}
	}
	.end-btn{
		color:#F56C6C;
	}
	.transfer-btn{
		color: #ebb563;
	}
	// .operate{
	// 	display: flex;
	// 	justify-content: center;
	// 	align-items: center;
	// 	box-sizing: border-box;
	// }
	
	//# status
	.consulting{
		color:#67C23A;
	}
	.wait-feedback{
		color:#E6A23C;
	}
	.end-consult{
		color:#F56C6C;
	}
</style>