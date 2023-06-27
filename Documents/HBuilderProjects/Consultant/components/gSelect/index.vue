<template>
	<view class="g-select">
		<view class="selected"  
		:class="visible ? 'top':''"
		@click="expandOption">{{selected}}<view class="icon iconfont " :class="visible ? 'icon-xiangshangjiantou':'icon-xiangxiajiantou'"></view></view>
		<view class="select-option" 
		
		:class="visible ? 'active-select-option':''">
			<view 
			class="option-item" 
			v-for="item in options" 
			@click="selectedOption(item)"
			:key="item.value" 
			:class="item.selected ? 'active-option-item':''">
				{{item.label}}
			</view>
		</view>
	</view>
	<view class="mask" v-if="visible" @click="clickMask"></view>
</template>

<script setup>
	import {ref,reactive,toRefs, computed} from 'vue'
	const props = defineProps({
		visible:{
			type:Boolean,
			default:false
		},
		options:Array,
	})
	const {visible,options} = toRefs(props)
	const emit = defineEmits(['expandOption','selectedOption'])
	const selected = computed(()=>{
		const arr = options.value.filter(item=>item.selected)
		return arr[0].label
	})
	function expandOption(){
		emit('expandOption',!visible.value)
	}
	function selectedOption(item){
		emit('selectedOption',item)
	}
	function clickMask(){
		emit('expandOption',false)
	}
</script>

<style lang="scss" scoped>
	.mask{
		width:100vw;
		height: 100vh;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 4;
	}
	.g-select{
		position: relative;
		display: flex;
		align-items: center;
		transition: all 0.5s ease-in-out; 
		z-index: 5;
		box-sizing: border-box;
		.selected{
			box-sizing: border-box;
			width: 300rpx;
			height:70rpx;
			padding:20rpx;
			border:5rpx solid #ededed;
			border-radius: 10rpx;
			position: relative;
			display: flex;
			align-items: center;
			.icon{
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 10rpx;
			}
		}
		
		.select-option{
			box-sizing: border-box;
			position: absolute;
			width: 300rpx;
			top: 90rpx;
			padding:20rpx;
			border-radius: 10rpx;
			border:5rpx solid #ededed;
			display: none;
			z-index: 5;
			background-color: #ffffff;
			box-shadow: 0 1rpx 35rpx 0 rgba(0, 0, 0, .1);
			&::after{
				content: '';
				display: inline-block;
				height: 0;
				width: 0;
				border: 25rpx solid #ffffff;
				border-top: 25rpx solid transparent;
				border-right: 25rpx solid transparent;
				border-left: 25rpx solid transparent;
				position: absolute;
				left:50%;
				top: -40rpx;
				z-index: 0;
				transform: translateX(-50%);
				border-radius: 20rpx;
				
				
			}
			.option-item{
				padding: 20rpx 0rpx;
			}
		}
		.active-select-option{
			display: block;
			.active-option-item{
				
				color:$uni-btn-bg-color;
			}
			
		}
	}
	.top{
		z-index: 5;
	}
</style>