<template>
	<view class="page">
		<view class="table-title head-title divide">
			<view>信件审核</view>
			<g-select 
			style="box-sizing: border-box;"
			@expandOption="expandOption"
			@selectedOption="selectedOption"
			:options="selectOption.options"
			:visible="selectOption.visible"/>
		</view>
		<view class="hint-info">
			<view class="icon iconfont icon-icon-test"></view>
			<view class="answer-book-sign">答案之书的标志</view>
		</view>
		<view class="table-box">
			<view class="table">
				<view class="row thead">
					<view class="th" v-for="(item,index) in columnHead" :key="index">
						{{item}}
					</view>
					<view style="width:280rpx"></view>
				</view>
				<view class="empty" v-if="dataList.length === 0">No Data</view>
				<view class="row td-row"  v-for="(item,index1) in currentList" :key="index1">
					<view class="td">
						<view  class="first-td"	:class="item.hasOpen ?'success':'failed'">
							<view v-if="item.hasGood" class="icon iconfont icon-icon-test"></view>
							{{item.hasOpen ? '已公开':'未公开'}}
						</view>
					</view>
					<view class="td username">
						{{item.postUser.userName}}
					</view>
					<view class="td">
						<view class="letter-type">
							{{item.letterType}}
						</view>
					</view>
					<view class="td">
						{{item.letterInfo}}
					</view>
					<view class="td">
						{{item.likeNum}}
					</view>
					<view class="td">
						{{item.createTime}}
					</view>
				</view>			
				<view class="fixed-right" style="width:280rpx;z-index: 0">
					<view class="th">操作</view>
					<view class="fixed-td td" v-for="item in currentList" :key="item.id">
						<view class="operate">
							<button class="button xq" @click="seeDetails(item)">详情</button>
							<button class="button reply" @click="toReply(item)" :class="replyStatus(item) ? 'has':''">{{replyStatus(item) ? '已回复':'未回复'}}</button>
						</view>
					</view>
				</view>
			</view>
			<loading :loading="isLoading" style="z-index: 10;"/>
		</view>
		<drawer 
		:visible="drawerOption.visible" 
		:item="drawerOption.item"
		:selectedId="getSelected.id"
		style="z-index:10"
		@toReply="toReply"
		@closeHasOpen="closeHasOpen"
		@successOpen="successOpen"
		@addToGoodArticle="addToGoodArticle"
		@cancleOpen="cancleOpen"
		@changeDrawerVisible="changeDrawerVisible"/>
		<reply
		:visible="replyOption.visible"
		:item="replyOption.item"
		@replyTo="replyTo"
		@replyInput="replyInput"
		@changeReplyVisible="changeReplyVisible"/>
		<view class="footer" >
			<pager
			:total="dataList.length"
			:currentPage="pageInfo.currentPage"
			:pageSize="pageInfo.pageSize"
			@pageChange="togglePage"
			@iconClick="backOrNext"
			/>
		</view>
	</view>
</template>

<script setup>
	import { onMounted ,ref,reactive,computed, watch,provide} from "vue";
	import {getUserLetterList,getGoodLetters,getAllConsultants, replayLetter,updateLetter} from '../../utils/api.js'
	import pager from '../../components/pager/pager.vue'
	// import gTable from '../../components/table/gTable.vue'
	import {useUserStore} from '../../store/index.js'
	import {validator,pattern, formatDate} from '../../utils/index.js'
	import loading from '../../directives/loading.vue'
	import drawer from './component/drawer.vue'
	import {storeToRefs} from 'pinia'
	import gSelect from '../../components/gSelect/index.vue'
	import reply from './component/reply.vue'
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const dataList = ref([])
	const isLoading = ref(true)

	// #region 	分页
	const pageInfo = reactive({
		pageSize:7,
		currentPage:1,
		sortArr:['createTime','likeNum'],
		sorted:'createTime'
	})
	const beginIndex = computed(()=>(pageInfo.currentPage-1)*pageInfo.pageSize)
	const currentList = computed(()=>dataList.value.slice(beginIndex.value,beginIndex.value+pageInfo.pageSize))
	function togglePage(value){
		pageInfo.currentPage = value
	}
	function backOrNext(val){
		if(val>0){
			(pageInfo.currentPage < Math.ceil(dataList.value.length/pageInfo.pageSize)) && pageInfo.currentPage++
		}else{
			(pageInfo.currentPage > 1) && pageInfo.currentPage--
		}
	}
	// #endregion 	分页
	
	// #region 表格渲染以及详情回复等
	const columnHead = [
		'审核状态','发表人','信封类别','内容','点赞','发表时间'
	]
	const propsList = ['hasOpen','createTime','letterType','userName','letterInfo',"likeNum"]
	function filterTd(item){
		const obj  = {
			hasOpen:item.hasOpen ? '已公开':'未公开',
			createTime:item.createTime,
			letterType:item.letterType,
			userName:item.postUser.userName,
			letterInfo:item.letterInfo,
			likeNum:item.likeNum
		}
		return obj
	}
	function seeDetails(item){
		drawerOption.item = item
		drawerOption.visible = true
	}
	// #endregion 表格渲染以及详情回复等
	
	// #region顶部栏
	const drawerOption = reactive({
		item:{},
		visible:false
	})
	const selectOption = reactive({
		visible:false,
		options:[
			{
				label:'已公开(含优质)',
				id:1,
				selected:true
			},
			{
				label:'优质',
				id:2,
				selected:false
			},
			{
				label:'未公开',
				id:3,
				selected:false
			},
		],
	})
	const replyOption = reactive({
		visible:false,
		item:{}
	})
	const getSelected = computed(()=>{
		
		const arr = selectOption.options.filter(item=>item.selected)
		
		return arr[0]
	})
	function changeDrawerVisible(){
		
		drawerOption.visible = false
	}
	function expandOption(flag){
		selectOption.visible = flag
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
	async function successOpen(ele){
		
		const r = await updateLetter({...ele,hasOpen:true})
		if(r){
			ele.hasOpen = true
			uni.showToast({
				title:'成功公开',
				icon:"none"
			})
		}
			
		const a = selectOption.options.find(item=>item.selected)
		await init(a)
		drawerOption.visible = false
	}
	async function cancleOpen(ele){
		const r = await updateLetter({...ele,hasOpen:false})
		ele.hasOpen = false
		uni.showToast({
			title:'取消公开',
			icon:"none"
		})
		const a = selectOption.options.find(item=>item.selected)
		await init(a)
		drawerOption.visible = false
	}
	
	function replyStatus(item){
		const me = userInfo.value.consultantId
		const flag = item.letterReplyDtos.find(ele=>ele.postUser.consultantId)
		if(flag){
			return true
		}
		return false
	}
	function toReply(item){
		
		replyOption.item = item
		replyOption.visible = true
	}
	function changeReplyVisible(flag){
		replyOption.visible = flag
	}
	function replyInput(info){
		replyOption.item.replyInfo = info
	}
	async function replyTo(){
		const required = pattern.namePattern
		const t  = new Date().getTime()
		const time = formatDate(t)
		const flag = await validator(replyOption.item.replyInfo,required)
		const {postUser,replyInfo,createTime,letterId} = replyOption.item
		if(flag){
			const r = await replayLetter({postUser:userInfo.value,replyInfo,createTime:time,letterId})
			if(r.flag){
				replyOption.visible = false
				replyOption.item.letterReplyDtos.unshift({replyInfo,postUser:userInfo.value,createTime:time})
				replyOption.item = {}
				uni.showToast({
					title:'回复成功'
				})
			}
			
		}
	}
	async function addToGoodArticle(obj){
		
		const {item,flag} = obj
		item.hasGood = flag
		console.log({...item,hasGood:flag,id:BigInt(item.id)})
		const r = await updateLetter({...item,hasGood:flag})
	}
	async function closeHasOpen(ele){
		const r = await updateLetter({...ele,hasOpen:false})
		if(r){
			ele.hasOpen = false
			uni.showToast({
				title:'cancel'
			})
		}
	}
	// #endregion顶部栏
	
	// #region 数据请求
	async function init(selected){
		const id = selected?.id
		switch(id){
			case 1:
				const r1 = await getUserLetterList({})
				if(Object.prototype.toString.call(r1) === '[object Array]'){
					isLoading.value = false
					dataList.value = r1.filter(item=>item.hasOpen)
					dataList.value.sort((a,b)=>b.id-a.id)
					isLoading.value = false
				}
			break;
			case 2:
				const r2 = await getGoodLetters()
				if(Object.prototype.toString.call(r2) === '[object Array]'){
					dataList.value = r2
					isLoading.value = false
					dataList.value.sort((a,b)=>b.id-a.id)
					console.log(dataList.value)
				}
			break;
			case 3:
				const r3 = await getUserLetterList({})
				if(Object.prototype.toString.call(r3) === '[object Array]'){
					isLoading.value = false
					dataList.value = r3.filter(ele=>!ele.hasOpen)
					dataList.value.sort((a,b)=>b.id-a.id)
					isLoading.value = false
				}
			break;
			default:
			const r4 = await getUserLetterList({})
			if(Object.prototype.toString.call(r1) === '[object Array]'){
				isLoading.value = false
				dataList.value = r1.filter(item=>item.hasOpen)
				dataList.value.sort((a,b)=>b.id-a.id)
				isLoading.value = false
			}
			break;
		}

	}
	provide('init',init)
	watch(getSelected,(newValue,oldValue)=>{
		isLoading.value = true
		init(newValue)
		dataList.value.sort((a,b)=>{return b.id-a.id})
	})
	onMounted(async()=>{
		await init(getSelected.value)
		dataList.value.sort((a,b)=>b.id-a.id)
		setTimeout(()=>{
			loading.value = false
		},1000)
	})
		// #endregion 数据请求
</script>

<style lang="scss" scoped>
	@import '../../components/table/table.scss';
	@import '../../style/component.scss';
	.page{
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
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
		border-left: 10rpx solid #25c7b6;
		box-sizing: border-box;
	}

	.content{
		box-sizing: border-box;
	}
	.button{
		padding:0rpx 20rpx;
		margin:10rpx;
	}
	.xq{
		background-color: #ffffff;
		border:5rpx solid #ededed;
		color:black;
	}
	.footer{
		display: flex;justify-content: center;align-items: center;
		margin-top: 20rpx;;
		z-index:6;
	}
	.first-td{
		display: flex;
	}
	
	//hasopen
	.success{
		color:limegreen
	}
	.failed{
		color: red;
	}

	.empty{
		width:98vw;
		height:400rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		// border: 4rpx solid #ededed;
		
	}
	.over-hidden{
		overflow: hidden;
	}
	
	.letter-type{
		box-sizing: border-box;
		background-color: #f0f5ff;
		border-radius: 20rpx;
		height: 70rpx;
		color: #25c7b6;
		border: 1rpx solid #25c7b6;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.hint-info{
		display: flex;
		align-items: center;
		font-size: 28rpx;
		.answer-book-sign{
			color:#909399;
		}
	}
	.has{
		background: #00e1b4;
	}
	.icon-icon-test{
		color:none;
		background-color: none;
	}

</style>