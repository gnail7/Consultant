<template>
		<view class="icon iconfont icon-jiazai loading-box" v-if="loading"></view>
</template>

<script setup>
	import {toRef, toRefs} from 'vue'
	const props = defineProps({
		loading:Boolean
	})
	const {loading} = toRefs(props)
</script>

<style>	 
	 .loading-box {
		padding: 20rpx;
		background-size: 100% 100%;
		animation: loading 2s linear infinite;
		box-sizing: border-box;
	 }
	 .icon-jiazai{
		 font-size: 40rpx;
		
	 }
		  
	 @keyframes loading {
		 0% {
			 transform: rotate(0);
		 }

		 100% {
			 transform: rotate(1turn);
		 }
	 }

</style>