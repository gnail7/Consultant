<template>
	<view class="main">
		<!-- 裁剪图片的插件 -->
		<ksp-cropper 
		mode="fixed" 
		:width="160" 
		:height="160" 
		:maxWidth="1024" 
		:maxHeight="1024" 
		:url="fileUrl" 
		@cancel="cancel" 
		@ok="onok"></ksp-cropper>
	</view>
</template>

<script setup>
	import {BASEURL} from '../../utils/request.js'
	import { onLoad,onShow,onUnload} from '@dcloudio/uni-app'
	import {onMounted, reactive, ref} from 'vue'
	import request from '../../utils/request'
	import {useUserStore} from '../../store/index.js'
	import {storeToRefs} from 'pinia'
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const fileUrl = ref('')
	const ctx = ref('')
	const canvas = reactive({
		w:0,
		h:0
	})
	async function updatePeronalInfo(){
		const r = await request({
			url:'/consultant/updateConsultant',
			method:'POST',
			data:userInfo.value
		})
		return r
	}
	function cancel(){
		uni.navigateBack()
	}
	function onok(ev){
		console.log('ev',ev.path)
		userInfo.value.consultantAvatar = ev.path
		uni.uploadFile({
			filePath:ev.path,
			url: BASEURL+'/user/upload',
			name: 'file',
			formData: {
				'consultant': 'test'
			},
			success: async(r) => {
			  if(r.statusCode === 200){
				  userInfo.value.consultantAvatar = r.data
				  uni.setStorageSync('userInfo',userInfo.value)
				  await updatePeronalInfo()
				  uni.navigateBack()
			  }
			},
			fail: () => {
			  console.log("失败...");
			}
		})
	}
	const mark = reactive({
		w:0,
		h:0,
		l:0,
		t:0
	})
	const system = ref({})
	onLoad((event)=>{
		fileUrl.value = event.fileUrl
	})
	onMounted(()=>{
		system.value = uni.getSystemInfoSync()
		
	})
</script>

<style lang="scss" scoped>
	.main{
		width:100vw;
		height:100vh;
		.canvas-box{
			position: relative;
			background-color: pink;
			#canvasId{
				background-color: aqua;
			}
			.mark{
				position: absolute;
				z-index: 20;
				background: yellow
			}
		}
	}
</style>