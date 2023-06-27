<template>
	<image :src="src" mode="widthFix" @click="previewImage"></image>
</template>

<script setup>
	import {onMounted, toRefs} from 'vue'
	const props = defineProps({
		src:String
	})
	const {src} = toRefs(props)
	onMounted(()=>{
		
	})
	function previewImage(){
		uni.previewImage({
			urls: [src.value],
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
				success: function(data) {
					
				},
				fail: function(err) {
					console.log(err.errMsg);
				}
			}
		});
	}
</script>

<style lang="scss" scoped>
	image{
		width:300rpx;
		border-radius: 16rpx;
		margin-left: 25rpx;
		margin-right:25rpx;
	}
</style>