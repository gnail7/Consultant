<template>
	<view class="switch-container" :class="containerClass" @click="changeSwitch">
		<view class="switch-circle" :class="circleClass"></view>
	</view>
</template>

<script setup>
	import { computed,onMounted,toRefs,watch } from "vue"
	const props = defineProps({
		checked:Boolean,
		item:Object
	})
	const {item} = toRefs(props)
	const emit = defineEmits(['switchStatus'])
	const circleClass = computed(()=>item.value.hasManager ? 'switch-circle-check' :'')
	const containerClass = computed(()=>item.value.hasManager ? 'switch-container-check':'')
	function changeSwitch(){
		emit('switchStatus')
	}

	onMounted(()=>{
		
	})
</script>

<style lang="scss" scoped>
	.switch-container{
		background-color: #4c4d4f;
		width:100rpx;
		height: 50rpx;
		border-radius: 30rpx;
		position: relative;
	}
	
	.switch-circle{
		width:48rpx;
		height: 48rpx;
		border-radius: 100%;
		background-color: #ffffff;
		position: absolute;
		left: -2rpx;
	}
	.switch-circle-check{
		right:-5rpx;
		transform: translateX(100%)
	}
	
	.switch-container-check {
	  background-color: #00e1b4;
	}
</style>