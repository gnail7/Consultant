<template>
	<view class="component">
		<text style="margin-right: 10rpx;">工作状态:{{statusMap.get(status)}}</text>
		<view class="status" 
			:class="classMap.get(status)"
			@click="toggleShow">
		</view>
		<view class="icon iconfont" 
		:class=" show ? 'icon-xiangxiajiantou':'icon-xiangshangjiantou'"
		style="vertical-align: bottom;">
		</view>
		<view class="list" v-if="show">
			<view class="item" v-for="(item,index) in statusMap.values()" :key="item" @click="changeStatus(index)">{{item}}</view>
		</view>
	</view>
</template>

<script setup>
	
	import {computed, onMounted, ref, toRefs} from 'vue'
	import {useUserStore,MAX_CONSULT_NUMS} from '@/store/index.js'
	import request from '../../utils/request.js'
	import {storeToRefs} from 'pinia'
	const userStore = useUserStore()
	const {userInfo,consultingNums} = storeToRefs(userStore)
	const {statusMap} = userStore
	const status = computed(()=>JSON.parse(JSON.stringify(userInfo.value.status)))
	//管理咨询师的状态
	const classMap = new Map([
		[-1,'unonline'],
		[0,'empty'],
		[1,'busy']
	])
	// const status = ref(-1)
	const show = ref(false)
	async function changeStatus(index){
		const keys = [...statusMap.keys()]
		console.log('max',MAX_CONSULT_NUMS)
		if((keys[index])*1 === 0  && consultingNums.value === MAX_CONSULT_NUMS){
			uni.showToast({
				title:'专心与眼前',
				icon:'error'
			})
		}else{
			userInfo.value.status = keys[index]
			const r = await request({url:'/consultant/updateConsultant',method:'POST',data:userInfo.value})
			uni.setStorageSync('userInfo',userInfo.value)
			show.value = false
		}
	
	}
	function toggleShow(){
		show.value = !show.value
		if(show.value){
			uni.$emit('hidden')
		}
	}
	onMounted(()=>{
		uni.$on('statusHidden',()=>{
			show.value = false
		})
	})
</script>

<style lang="scss" scoped>
	@import '../../uni.scss';
	.component{
		display: flex;
		align-items: center;
		position: relative;
		font-size: 28rpx;
		z-index: 9;
		background: #ffffff
	}
	.status{
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background-color: $uni-btn-bg-color;
	}
	.list{
		position: absolute;
		bottom: -260rpx;
		right: 0rpx;
		border-radius: 10rpx;
		box-shadow: 0 1rpx 14rpx 0 rgba(0, 0, 0, .1);
		
		font-size: 28rpx;
		z-index: 4;
		background: #ffffff;
		.item{
			padding:20rpx;		
			z-index: 4;
		}
	}
	.iconfont{
		vertical-align: bottom;
		bottom: -10rpx;
		position: relative;
	}
	
	//status样式
	.unonline{
		background-color: $uni-bg-color-grey;
	}
	.empty{
		background-color: $uni-btn-bg-color;
	}
	.busy{
		background-color: #f1c384;
	}
</style>