<template>
	<view class="pages">
		<view class="head">备忘录:</view>
		<textarea 
		v-model="memoSetting.memoText"
		class="textarea"
		placeholder="内容"
		:show-confirm-bar="false"
		cursor-spacing='20' 
		:adjust-position="true" 
		maxlength="-1"	
		type="text"/>
		<view class="footer-box">
			<button class="button" @click="saveMemo">保存</button>
		</view>
	</view>
</template>

<script setup>
	import { onLoad,onShow,onUnload} from "@dcloudio/uni-app"
	import {useUserStore} from '../../store/index.js'
	import request from '../../utils/request.js'
	import {formatDate} from '../../utils/index.js'
	import {storeToRefs} from 'pinia'
	import { reactive,ref } from "vue";
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const memoSetting = ref({
		memoText:'',
		userId:''
	})
	
	async function saveMemo(){
		const  t = new Date().getTime()
		const currentModifyTime = formatDate(t)
		if(memoSetting.value.memoText){
			const r = await request({
				url:'/consultant/updateMemo',
				data:{
					...memoSetting.value,
					currentModifyTime
				}
			})
			
			if(r){
				uni.showToast({
					title:'备忘录更新成功',
					icon:'success'
				})
			}
		}else{
			uni.showToast({
				title:'不能为空',
				icon:'none'
			})
		}
	}
	onLoad(async(option)=>{
		try{
			memoSetting.value.userId = option.userId
			const r = await request({
				url:'/consultant/findMemoById',
				data:{
					userId:memoSetting.value.userId,
				}
			})
			memoSetting.value  = r
		}catch(e){
			
		}
		
	})
</script>

<style lang="scss" scoped>
	@import '../../style/component.scss';
	.pages{
		width:100vw;
		height:100vh;
	}
	.head{
		width:100%;
		display:flex;
		justify-content: center;
		align-items: center;
		margin: auto;
		font-size: 40rpx;
		font-weight: bold;
		margin:20rpx auto;
	}
	.footer-box{
		position: absolute;
		bottom: 10rpx;
		right:10rpx;
	}
	textarea{
		box-sizing: border-box;
		flex: 1;
		height:70%;
		border-radius: 20rpx;
		background-color: #ffffff;
		padding-right:60rpx;
		margin: 10rpx auto;
		// box-shadow: 0 1rpx 10rpx 0 rgba(0, 0, 0, .1);
		border: 1rpx solid #f7f7f7;
		align-items: center;
		// line-height: 60rpx;
		text-indent: 10rpx;
		width: 80%;
		padding:10rpx;
		border: none;
		// box-shadow: 0;
	}
</style>
