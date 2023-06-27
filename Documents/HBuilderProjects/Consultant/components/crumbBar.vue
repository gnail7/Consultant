<template>
	 <view class="crumb-bar">
	        <view class="tag" 
	        v-for="item in crumbList" 
	        :class="item.name === currentPage.name ? 'active':''"
	        :key="item.name"
	        @click="toPage(item)"
	        >
	            {{ item.meta.label }}
	            <view v-if="item.name!=='home'" class="icon iconfont icon-guanbi"  @click="closeTag(item)"></view>
	        </view>
	    </view>
</template>

<script setup>
	import {useCommonStore} from '../store/index.js'
	import {storeToRefs} from 'pinia'
	const commonStore = useCommonStore()
	const {crumbList,currentPage} = storeToRefs(commonStore)
	
	
	function closeTag(item){
		//找到数组中和item的下标
		const index = crumbList.value.findIndex(ele=>ele.name === item.name)
		console.log(index)
		crumbList.value.splice(index,1)
		console.log(crumbList.value)
	}
	
	function toPage(item){
		currentPage.value = item
		uni.$emit('hidden')
		uni.$emit('statusHidden')
	}
</script>

<style lang="scss" scoped>
.crumb-bar{
	width:100%;
	background-color: #ffffff;
	box-shadow: 0 1rpx 14rpx 0 rgba(0, 0, 0, .1);
	display: flex;
	align-items: center;
	box-sizing: border-box;
	padding: 10rpx 30rpx;
	flex-wrap: wrap;
}
 .tag{
		padding: 0rpx 10rpx;
		height: 80%;
        padding: 5rpx;
		font-size: 25rpx;
        color: #494f62;
        border: 1rpx solid #d7dcea;
        border-radius: 5rpx;
        margin-right: 5rpx;
        background-color: #ffffff;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 5rpx ;
		   
    }
	.icon-guanbi{
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20rpx;
		margin-left: 10rpx;
	}
	
.active{
    background: #e6eefa;
    color: #2171cc;
	background-color: #00e1b4;
	   color: #ffffff;
	   border: 1rpx solid #25c7b6;
}
</style>