<template>
	<view class="reply-dialog" v-if="visible" >
		<view class="mask" @click="clickMask">
			
		</view>
		<view class="container">
			<view class="reply-box">
				<view>To:{{item.postUser.userName}}</view>
				<textarea 
				@input="inputEmit"
				placeholder="回复..." 
				class="divide" 
				maxlength="250"
				style="height: 70%;width: 100%;border: 5rpx solid #ededed;padding: 20rpx;box-sizing: border-box;"></textarea>
				<view class="footer">
					<button class="button" @click="replyTo">回复</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {showModal} from '../../../utils/index.js'
	import { toRefs } from 'vue'
	import {replayLetter} from '../../../utils/api.js'
	const props = defineProps({
		item:Object,
		visible:{
			type:Boolean,
			default:false
		}
	})
	const emit = defineEmits(['changeReplyVisible','replyInput','replyTo'])
	const {item,visible} = toRefs(props)
	
	function clickMask(){
		console.log('clickMask')
		emit('changeReplyVisible',false)
	}
	function inputEmit(e){
		emit('replyInput',e.detail.value)
	}
	async function replyTo(){
		console.log('item',item.value)
		const flag = await showModal(`确认回复"${item.value.postUser.userName}"写的信封?`)
		if(flag){
			emit('replyTo',item)
		}
	}
	
</script>

<style lang="scss" scoped>
	@import '../../../style/component.scss';
	.reply-dialog{
		width:100vw;
		height: 100vh;
		position: absolute;
		right: 0;
		box-sizing: border-box;
		top: 0;
		z-index: 10;
		.container{
			display: flex;
			width:100%;
			height: 100%;
			justify-content: center;
			align-items: center;
			box-sizing: border-box;
		}
	}
	.mask{
		width:100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.2);
		position: absolute;
		z-index: 6;
		box-sizing: border-box;
	}
	.reply-box{
		width:80%;
		height: 50%;
		background: #ffffff;
		border-radius: 10rpx;
		box-sizing: border-box;
		padding:20rpx;
		z-index: 7;
	}
</style>