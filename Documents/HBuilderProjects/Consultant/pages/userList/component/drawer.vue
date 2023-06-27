<template>
	<view class="container" :class="visible ? 'visible':'hidden'">
		<view class="box">
			<view class="mask" @click="closeDrawer"></view>
			<view class="drawer">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {toRefs} from 'vue'
	const props = defineProps({
		visible:{
			type:Boolean,
			default:false
		}
	})
	const emit = defineEmits(['changeDrawerVisible'])
	function closeDrawer(){
		console.log('mask')
		emit('changeDrawerVisible',false)
	}
	const {visible} = toRefs(props)
</script>

<style lang="scss" scoped>
	.container{
		width:100vw;
		height:100vh;
		position: fixed;
		top:0;
		z-index: 10;
		transition: all 0.2s ease-in-out;
	
		.box{
			position: relative;
			width:100vw;
			z-index: 10;
			height:100vh;
			.drawer{
				width:60vw;
				height: 100%;
				background: #ffffff;
				position: absolute;
				right: 0rpx;
				z-index: 10;
				box-shadow: 0 1rpx 14rpx 0 rgba(0, 0, 0, .1);
			}
			.mask{
				width:100vw;
				height:100vh;
				position: absolute;
				left:0;
				top:0;
				z-index: 10;
			}
		}
		
	}
	.visible{
		right: 0;
	}
	.hidden{
		right: -100%;
	}
</style>