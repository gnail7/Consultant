<template>
	<view class="g-input-item">
		<view class="g-label" :style="{'width':labelWidth}">
			<text v-if="required" class="required">*</text>
			<slot name="label"></slot>
		</view>
		<view class="g-input" v-if="!radio">
			<!-- :placeholder="placeholder"  -->
			<input 
			:value="userInfo.consultantName" 
			:type="type" 
			@input="emitEvent"/>
	<!-- 		<view class="hint" name="hint">
				<slot name="hint"></slot>
			</view> -->
		</view>
		<slot name="diy"></slot>
	</view>
</template>

<script setup>
	import {useUserStore} from '@/store/index.js'
	import {storeToRefs} from 'pinia'
	import { onMounted , toRef } from "vue";
	const props = defineProps({
		required:{
			type:Boolean,
			default:false
		},
		labelWidth:{
			type:String,
			default:'auto'
		},
		placeholder:{
			type:String,
			default:'输入'
		},
		type:{
			type:String,
			default:'text'
		},
		radio:{
			type:Boolean,
			default:false
		}
	})
	const {required,labelWidth,placeholder,type,radio,modelValue,att} = props
	const emit = defineEmits(['inputEmit'])
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	function emitEvent(e){		
		// console.log('att',att,props.att)
		emit('inputEmit',{
			att:props.att,
			value:e.detail.value
		})
	}
	onMounted(()=>{
		
	})
</script>

<style lang="scss" scoped>
	.g-input-item{
		width: 100%;
		display: flex;
		height: 50rpx;
		font-size: 28rpx;
		align-items: center;
		box-sizing: border-box;
		.g-input{
			box-sizing: border-box;
			border-bottom: 5rpx solid $uni-bg-color-grey;
			margin-left: 20rpx;
			padding: 10rpx;
			width:100%;
			position: relative;
			.hint{
				position: absolute;
				bottom: -50rpx;
				color: red;
			}
		}
		.radio{
			border: none;
			box-sizing: border-box;
			margin-left: 20rpx;
			padding: 10rpx;
			width:500rpx;
		}
		.g-label{
			display: flex;
			justify-content: flex-end;
		
		}
	}
	
	.required{
		color:red;
	}
</style>