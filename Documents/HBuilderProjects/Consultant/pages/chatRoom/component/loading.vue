<template>
	<view class="circle" v-if="loading"></view>
</template>

<script setup>
	import {toRef, toRefs} from 'vue'
	const props = defineProps({
		loading:Boolean
	})
	const {loading} = toRefs(props)
</script>

<style lang="scss">
.loading{
    width: 100%;
    height: 100%;
    z-index: 999999999;
    position: absolute;
    background-color: #909399;
    backdrop-filter:blur(2rpx);
    top: 0;
    left: 0;
}
.circle{
   /* position: absolute;
    top: 50%;
    left: 50%; */
    transform: translate(-50%,-50%);
    width:24rpx;
    height:24rpx;
    border-radius: 50%;
    border: 10rpx solid $uni-border-grey;
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