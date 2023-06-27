<template>
	<view class="page">
		<view class="table-title">自杀热线管理</view>
		<view class="g-table">
			
			<!-- <g-table :dataList="currentList">
			</g-table> -->
			<view class="g-table">
				<view class="table-box">
					<view class="table">
						<view class="row thead">
							<view class="th" v-for="(item,index) in columnHead" :key="index">{{item}}</view>
							<view style="width:150rpx"></view>
						</view>
						<view class="row td-row" v-for="(item,index1) in currentList" :key="index1+'row'">
							<view class="td" v-for="(ele,index2) in filterTd(item)" :key="index2+'column'" style="position: relative;">
								<!-- <view v-if="index2 === 'userAvatar'" >
									<image :src="ele" style="width: 60rpx;height: 60rpx;border-radius: 100%;"></image>
								</view> -->
								<view class="td-item" >
									{{ele.length&&(ele.length > 20) ? ele.slice(0,20)+'...': ele}}
								</view>
							</view>
						</view>
						<view class="fixed-right" style="width:150rpx;box-sizing: border-box;">
							<view class="th">操作</view>
							<view class="fixed-td td" v-for="item in currentList" :key="'fixed'+item.id" style="box-sizing: border-box;">
								<button class="button-des" @click="handleSucide(item)" :class="item.hasAddressed ? '' :'failed'">{{item.hasAddressed ? '已处理' : '待处理'}}</button>
							</view>
						</view>
						<loading :loading="isLoading" style="z-index: 10;"/>
					</view>
				</view>
			</view>
		</view>
		<view class="footer" style="z-index:6">
			<pager
			:total="sucideHotlinesList.length"
			:currentPage="pageInfo.currentPage"
			:pageSize="pageInfo.pageSize"
			@pageChange="togglePage"
			@iconClick="backOrNext"
			/>
		</view>
	</view>
</template>

<script setup>
	import {computed, onMounted, reactive, ref} from 'vue'
	import {getSucideHotlines} from '../../utils/api.js'
	import loading from '../../directives/loading.vue'
	import pager from '../../components/pager/pager.vue'
	import {showModal} from '../../utils/index.js'
import request from '../../utils/request.js'
	const sucideHotlinesList = ref([])
	const renderInfo = computed(()=>{
		const arr = sucideHotlinesList.value.map(item=>{
			const obj = {
				"上报时间":item.reportTime,
				"上报对象":item.user.userName,
				"上报对象联系方式":item.user.userPhone,
				"上报人":item.reporter.consultantName,
				"上报人联系方式":item.reporter.consultantPhone,
			}
			return obj
		})
		return arr
	})
	const columnHead = ['上报时间','上报对象','上报对象联系方式','上报人','上报人联系方式']
	const pageInfo = reactive({
		pageSize:8,
		currentPage:1
	})
	const isLoading = ref(true)
	const beginIndex = computed(()=>(pageInfo.currentPage-1)*pageInfo.pageSize)
	const currentList = computed(()=>sucideHotlinesList.value.slice(beginIndex.value,beginIndex.value+pageInfo.pageSize))
	function togglePage(value){
		pageInfo.currentPage = value
	}
	function backOrNext(val){
		if(val>0){
			(pageInfo.currentPage < Math.ceil(sucideHotlinesList.value.length/pageInfo.pageSize)) && pageInfo.currentPage++
		}else{
			(pageInfo.currentPage > 1) && pageInfo.currentPage--
		}
	}
	function filterTd(item){
		
		const obj  = {
			"reportTime":item.reportTime,
			"userName":item.user.userName,
			"userPhone":item.user.userPhone,
			"consultantName":item.reporter.consultantName,
			"consultantPhone":item.reporter.consultantPhone,
		}
		return obj
	}
	async function handleSucide(item){
		if(item.hasAddressed){
			uni.showToast({
				title:'已处理',
				icon:'none'
			})
		}else{
			const flag = await showModal('已对该情况进行处理?')
			if(flag){
				const r = await request({
					url:'/consultant/updateSuicideHotline',
					data:{...item,hasAddressed:true}
				})
				item.hasAddressed = true
			}
		}
	}
	onMounted(async()=>{
		//上报人(name,联系方式,),自杀倾向的人(名字,联系方式,) 上报时间
		//reportTime ,user.userPhone , reportTime , reporter.consultantName ,reporter.consultantPhone
		const r = await getSucideHotlines()
		if(r && r.length){
			sucideHotlinesList.value = r
			isLoading.value = false
			console.log(renderInfo.value)
		}
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
	
	.success{
		color:black;
		
	}
	.failed{
		color:#F56C6C;
	}
</style>