<template>
	<view class="card">
		<view class="status-icon" @click="changeRecorderStatus">
			<view class="ready-status-icon">
				<view class="iconfont icon-luyin1" v-if="((recorderManager.status === -1) && !recorderManager.playing)" id="ready"></view>
				<view class="iconfont icon-zanting" v-else-if="((recorderManager.status === 0) && !recorderManager.playing)" id="stop"></view>
				<view class="iconfont icon-bofang" v-else-if="((recorderManager.status === 1) && !recorderManager.playing)" id="play"></view>
				<view class="playing" v-else>
					<view class="prompt-layer prompt-layer-1">
						<view class="prompt-loader">
							<view class="em" v-for="(item,index) in 15" :key="index"></view>
						</view>	
					</view>
				</view>
			</view>
		</view>
		<view class="button-group status-bar">
			<view class="ready-status " v-if="recorderManager.status ===  -1">开始</view>
			<view class="ing-status" v-else-if="recorderManager.status === 0">暂停</view>
			<view class="end-status" v-else>
				<button class="button button-des" @click="openPopOver('recoderVisible',false)">取消</button>
				<button class="button button-des" @click="sendAudioRecord">发送</button>
			</view>
		</view>
		
	</view>
</template>

<script setup>
	import {onMounted, ref, toRefs,inject, onUnmounted} from 'vue'
	import { onReady,onLoad,onShow,onUnload,onHide} from "@dcloudio/uni-app"
	import request,{BASEURL} from '../../../utils/request.js'
	const openPopOver = inject('openPopOver')
	const addAudioRecord = inject('addAudioRecord')
	const recorderManager = ref({
		manager:'',
		voicePath:'',
		// status来记录录音的状态 1:播放,0:stop,-1:ready
		status:-1,
		playing:false,
		innerAudioContext:{}
	})
	const innerAudioContext = ref({})
	const changeRecorderStatus = (e)=>{
		if(recorderManager.value.status!=1){
			recorderMapEvent(recorderManager.value.status)
			recorderManager.value.status++
		}else{
			recorderMapEvent(recorderManager.value.status)
		}
	}
	//
	const recorderMapEvent = (status)=>{
		switch(status){
			case 1:
			recorderPlay()
			break;
			case 0:
			recorderEnd()
			break;
			case -1:
			recorderStart()
			break;
		}
	}
	const recorderStart = ()=>{
		recorderManager.value.manager.start();
	}
	const recorderEnd = ()=>{
		recorderManager.value.manager.stop();
	}
	const recorderPlay = ()=>{
		recorderManager.value.playing = true
		innerAudioContext.value.play();	
		innerAudioContext.value.onPlay(()=>{
			console.log('play')
		})
	}
	const sendAudioRecord = async()=>{
		openPopOver('recoderVisible',false)
		uni.uploadFile({
			filePath:recorderManager.value.voicePath,
			url: BASEURL+'/user/upload',
			name: 'file',
			formData: {
				'consultant': 'test'
			},
			success: (r) => {
			  if(r.statusCode === 200){
				addAudioRecord('voice',r.data)
				openPopOver('recoderVisible',false)
			  }
			},
			fail: () => {
			  console.log("失败...");
			}
		})
	}
	onMounted(()=>{
		recorderManager.value.manager = uni.getRecorderManager();
		const audioContext =  uni.createInnerAudioContext();
		audioContext.autoplay = false
		// audioContext.value = uni.createInnerAudioContext();
		recorderManager.value.manager.onStop(function (res) {
			recorderManager.value.voicePath = res.tempFilePath;
			audioContext.src = recorderManager.value.voicePath;
			innerAudioContext.value = audioContext
		});
		audioContext.onEnded(()=>{
			recorderManager.value.playing = false
		})
		audioContext.onError((e)=>{
			console.log('e',e)
		})
		
	})
	
</script>

<style lang="scss" scoped>
	.card{
		width:100%;
		height:100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.status-bar{
		width:100%;
		margin-top:15rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.iconfont{
		font-size: 40rpx;
		font-weight: bold;
		background-color: greenyellow;
		color:#fff;
		padding:20rpx;
		border-radius: 100%;;
		margin:10rpx auto;
	}
	.end-status{
		display:flex;
		width: 100%;
		justify-content: space-between;
		.button{
			width:100%;
			background-color: #fff;
			border:none;
			&::after{
				content: '';
				border: none;
			}
		}
	}
		/* 语音音阶------------- */
		.prompt-loader {
			width: 96px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 6px;
		}
		.prompt-loader .em {
			display: block;
			background: #333333;
			width: 1px;
			height: 10%;
			margin-right: 2.5px;
			float: left;
		}
		.prompt-loader .em:last-child {
			margin-right: 0px;
		}
		.prompt-loader .em:nth-child(1) {
		 animation: load 2.5s 1.4s infinite linear;
		}
		.prompt-loader .em:nth-child(2) {
		 animation: load 2.5s 1.2s infinite linear;
		}
		.prompt-loader .em:nth-child(3) {
		 animation: load 2.5s 1s infinite linear;
		}
		.prompt-loader .em:nth-child(4) {
		 animation: load 2.5s 0.8s infinite linear;
		}
		.prompt-loader .em:nth-child(5) {
		 animation: load 2.5s 0.6s infinite linear;
		}
		.prompt-loader .em:nth-child(6) {
		 animation: load 2.5s 0.4s infinite linear;
		}
		.prompt-loader .em:nth-child(7) {
		 animation: load 2.5s 0.2s infinite linear;
		}
		.prompt-loader .em:nth-child(8) {
		 animation: load 2.5s 0s infinite linear;
		}
		.prompt-loader .em:nth-child(9) {
		 animation: load 2.5s 0.2s infinite linear;
		}
		.prompt-loader .em:nth-child(10) {
		 animation: load 2.5s 0.4s infinite linear;
		}
		.prompt-loader .em:nth-child(11) {
		 animation: load 2.5s 0.6s infinite linear;
		}
		.prompt-loader .em:nth-child(12) {
		 animation: load 2.5s 0.8s infinite linear;
		}
		.prompt-loader .em:nth-child(13) {
		 animation: load 2.5s 1s infinite linear;
		}
		.prompt-loader .em:nth-child(14) {
		 animation: load 2.5s 1.2s infinite linear;
		}
		.prompt-loader .em:nth-child(15) {
		 animation: load 2.5s 1.4s infinite linear;
		}
		@keyframes load {
			0% {
				height: 10%;
			}
			50% {
				height: 100%;
			}
			100% {
				height: 10%;
			}
		}
		/* 语音音阶-------------------- */
		.prompt-layer-2{
			top: -40px;
		}
		.prompt-layer-2 .text{
			color: rgba(0, 0, 0, 1);
			font-size: 12px;
		}
</style>