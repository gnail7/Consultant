<template>
	<view>
		<video 
			:src="src" 
			controls 
			id="videoId" 
			class="video-player"
			@play="play"
			@fullscreenchange="fullscreenchange">
		</video>
	</view>
</template>

<script setup>
	const props = defineProps({
		src:String
	})
	const {src} = props
	function play(index) {
		console.log("play")
		let videoContext = uni.createVideoContext('videoId')
		videoContext.requestFullScreen()
		console.log(videoContext.requestFullScreen())
	}
			
			//退出全屏时停止
	function fullscreenchange(e) {
		console.log('full')
		let videoContext = uni.createVideoContext('videoId')
		if (!e.detail.fullScreen) {
			videoContext.stop();
		}else{
			videoContext.play()
		}
	}
</script>


<style lang="scss" scoped>
	.video-player{
		padding: 10rpx;
		border-radius: 11px;
		overflow: hidden;
		width:300rpx;
		height:300rpx;
		margin-left: 25rpx;
	}
</style>