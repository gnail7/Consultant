<template>
    <view class="loading" v-if="loading">
        <view class="circle"></view>
    </view>
</template>

<script setup>
	import {toRef, toRefs} from 'vue'
	const props = defineProps({
		loading:Boolean,
		bgColor:{
			type:String,
			default:'#ffffff'
		}
	})
	const {loading} = toRefs(props)
	const {bgColor} = props
</script>

<style>
.loading{
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: v-bind(bgColor);
    backdrop-filter:blur(2rpx);
    top: 0;
    left: 0;
	z-index: 12;
}
.circle{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width:70rpx;
    height:70rpx;
    border-radius: 50%;
    border: 10rpx solid #fff;
    border-top: 10rpx solid rgba(0 , 255, 255, 1);
    animation: animate .8s linear infinite;
}

@keyframes animate {
    0%{
        transform: translate(-50%,-50%) rotate(0deg);
    }
    100%{
        transform: translate(-50%,-50%) rotate(360deg);
    }
}
</style>