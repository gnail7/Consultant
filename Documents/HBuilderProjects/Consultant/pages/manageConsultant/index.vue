<template>
	<view class="page">
		<view class="table-title">咨询师管理</view>
		<view class="g-table">
			<view style="z-index: 9999;">
				<loading :loading="isLoading" />
			</view>
			<view class="g-table">
				<view class="table-box">
					<view class="table">
						<view class="row thead">
							<view class="th" v-for="(item,index) in columnHead" :key="index">{{item}}</view>
							<view style="width:280rpx"></view>
						</view>
						<view class="row td-row" v-for="(item,index1) in currentList" :key="index1">
							<view class="td" v-for="(ele,index2) in filterTd(item)" :key="index2" style="position: relative;">
								{{ele}}
							</view>
						</view>
						<view class="fixed-right" style="z-index: 1;width:280rpx">
							<view class="th">操作</view>
							<view class="fixed-td td" v-for="item in currentList" :key="item.id">
								<view class="operate">
									<g-switch :item="item" @switchStatus="managerChange(item)"/>
									<view>{{item.hasManager ? '管理员':'咨询师'}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
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
	</view>
</template>

<script setup>
	import {onMounted,ref,computed,reactive, isReactive} from 'vue'
	import {getAllConsultants,updateConsultant} from '../../utils/api.js'
	import pager from '../../components/pager/pager.vue'
	// import gTable from '../../components/table/gTable.vue'
	import gSwitch from '../../components/gSwitch/index.vue'
	import {useUserStore} from '../../store/index.js'
	import loading from '../../directives/loading.vue'
	import {showModal} from '../../utils/index.js'
	const userStore = useUserStore()
	const dataList = ref([])
	const isLoading = ref(true)
	//咨询师名字，咨询师联系电话，咨询师创建时间，咨询师状态，咨询师身份，咨询师粉丝
	const renderInfo = computed(()=>{
		const arr = dataList.value.map(item=>{
			const obj = {
				"姓名":item.realName,
				"咨询用名":item.consultantName,
				"咨询师联系电话":item.consultantPhone,
				"咨询师创建时间":item.createTime,
				"咨询师状态":userStore.statusMap.get(item.status),
				"咨询师粉丝数量":item.followedNum
			}
			return obj
		})
		return arr
	})
	function filterTd(item){
		const obj  = {
			realName:item.realName,
			consultantName:item.consultantName,
			consultantPhone:item.consultantPhone,
			createTime:item.createTime,
			status:userStore.statusMap.get(item.status),
			followedNum:item.followedNum
		}
		return obj
	}
	const columnHead = ['姓名',"咨询用名","咨询师联系电话","咨询师创建时间","咨询师状态","咨询师粉丝数量"]
	const fixedData = computed(()=>{
		const arr = dataList.value.map(item=>{
			const obj = ({
				hasManager:item.hasManager === 1 ? true : false,
				userInfo:item
			})
			return obj
		})
		return reactive(arr)
	})
	const pageInfo = reactive({
		pageSize:8,
		currentPage:1
	})
	const beginIndex = computed(()=>(pageInfo.currentPage-1)*pageInfo.pageSize)
	const currentList = computed(()=>dataList.value.slice(beginIndex.value,beginIndex.value+pageInfo.pageSize))
	// const currentList = computed(()=>renderInfo.value.slice(beginIndex.value,beginIndex.value+pageInfo.pageSize))
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
	async function managerChange(item){
		// item.userInfo.consultantName
		console.log('item',item)
		const name = item.consultantName
		const sf = !item.hasManager === 1 ? '管理员' : '咨询师'
		const flag = await showModal(`确认更改"${name}"身份为${sf}吗?`)
		if(flag){
			item.hasManager = !item.hasManager ? 1:0 
			const r = await updateConsultant({...item,hasManager:item.hasManager})
			if(r.flag){
				uni.showToast({
					title:'更改成功'
				})
			}
		}
	}
	onMounted(async()=>{
		//上报人(name,联系方式,),自杀倾向的人(名字,联系方式,) 上报时间
		//reportTime ,user.userPhone , reportTime , reporter.consultantName ,reporter.consultantPhone
		const r = await getAllConsultants()
		if(r && r.length){
			dataList.value = r
			isLoading.value = false
		}
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
	.operate{
		display: flex;
		margin:10rpx;
	}
	.button{
		border: none;
		padding:0rpx;
		background: #ffffff;
		color:#2990ec;
		font-size: 24rpx;
		&::after{
			border: none;
			padding:0rpx;
			margin:0rpx;;
		}
	}
	.footer{
		display: flex;justify-content: center;align-items: center;
		margin-top: 20rpx;;
	}
	.fixed-right{
		position: absolute;
		width:v-bind(operateWidth);
		right: 0;
		top: 0;
		z-index: 0;
		display: table-column-group;
		padding: 0;
		box-sizing: border-box;
		.th{
			height: 80rpx;
		}
	
	}
	// .fixed-td{
	// 	border-left: 5rpx solid $uni-border-grey;
	// 	background-color: #ffffff;
	// 	display:block;
	// 	height: 100rpx;
	// 	line-height: 100rpx;
	// 	z-index: 2;
	// 	width: 100%;
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: center;
	// 	box-sizing: border-box;
	// }
	.operate{
		display: flex;
		margin:10rpx;
		justify-content: center;
		align-items: center;
	}
</style>