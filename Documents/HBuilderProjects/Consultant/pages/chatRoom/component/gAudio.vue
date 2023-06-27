<template>
	<view class="cricleplay"
	 @click="startAudio"
	status="stop">
		 <view class="small"></view>
		 <view class="middle" :class="data.play ? 'show2':''"></view>
		 <view class="large" :class="data.play ? 'show3':''"></view>
		 <view class="second">{{data.duration}}"</view>
	</view>
</template>


<script setup>
	import {toRefs,ref, reactive,computed, onMounted, nextTick, onUnmounted} from 'vue'
	import {onLoad} from '@dcloudio/uni-app'
	const props = defineProps({
		src:String
	})
	const {src} = toRefs(props)
	 
	const data = reactive({
		duration:'',
		innerAudioContext:null,
		play:false,
		src:""
	})
	const length = computed(()=>{
		let length=Math.round(data.duration/60*300)>=13?Math.round(data.duration/60*300):13
		if(length > 160) length = 160
		return `${length*2 }rpx;`
	})
	onMounted(()=>{
		const innerAudioContext = uni.createInnerAudioContext();
		innerAudioContext.autoplay = false;
		innerAudioContext.src = src.value
		data.innerAudioContext = innerAudioContext
		// data.innerAudioContext.onTimeUpdate(()=>{})
		
		innerAudioContext.onCanplay(() => {
			let intervalID = setInterval(() => {
			if (innerAudioContext.duration !== 0 && innerAudioContext.duration <= 60) {
				clearInterval(intervalID)
				data.duration = Math.ceil(innerAudioContext.duration)	
				
			  }
			}, 500);
		})
		innerAudioContext.onEnded(()=>{
			
		})
		innerAudioContext.onError((e)=>{
			
		})
	})
	onUnmounted(()=>{
		data.innerAudioContext.stop()
		data.innerAudioContext.offCanplay()
		data.innerAudioContext.offError()
	})
	function startAudio(){
		data.play = !data.play
		if(data.play){
			data.innerAudioContext.play(() => {
				
			});
			data.innerAudioContext.onEnded(()=>{
				
				data.play = false
			})
		}else{
			data.innerAudioContext.stop(() => {
				
			});
			data.innerAudioContext.onError((res) => {
				console.log(res.errMsg);
				console.log(res.errCode);
			});
		}
	
	    data.innerAudioContext.onError((res) => {
	        console.log(res.errMsg);
	        console.log(res.errCode);
	    });
	}
</script>

<style lang="scss" scoped>
	.voice-content{
		display: flex;
		justify-content: flex-start;
		width:auto;
	}
	.small{
	  width: 30rpx;
	  height: 30rpx;
	  border-style: solid;
	  border-top-color: transparent;
	  border-left-color: transparent;
	  border-bottom-color: transparent;
	  border-radius: 50%;
	  box-sizing: border-box;
	  vertical-align: middle;
	  display: inline-block;
	  color:#A2A2A2;
	}

	.middle{
	  width:40rpx;
	  height: 40rpx;
	  border-style: solid;
	  border-top-color: transparent;
	  border-left-color: transparent;
	  border-bottom-color: transparent;
	  border-radius: 50%;
	  box-sizing: border-box;
	  vertical-align: middle;
	  display: inline-block;
	  margin-left: -22rpx;
	  
	  opacity: 1;
	  color:#A2A2A2;
	}
	@keyframes show2 {
	  0% { opacity: 0;}
	  30% { opacity: 1;}
	  100% { opacity: 0;}
	}
	.cricleplay{
		 display: flex;
		 align-items: center;
		 width:auto;
	}
	.second{
		color:#A2A2A2;
		margin-left: 10rpx;
		margin-right: v-bind(length);
		display: flex;
		align-items: center;
	}
	.large{
	   width:50rpx;
	  height: 50rpx;
	  border-style: solid;
	  border-top-color: transparent ;
	  border-left-color: transparent;
	  border-bottom-color: transparent;
	  border-radius: 50%;
	  box-sizing: border-box;
	  vertical-align: middle;
	  display: inline-block;
	  margin-left: -32rpx;
	  // animation: show3 3s ease-in-out infinite;
	  opacity: 1;
	  color:#A2A2A2;
	}
	.show2{
		animation: show2 3s ease-in-out infinite;
	}
	.show3{
		animation: show3 3s ease-in-out infinite;
	}
	@keyframes show3 {
	  0% { opacity: 0;}
	  60% { opacity: 1;}
	  100% { opacity: 0;}
	}
</style>