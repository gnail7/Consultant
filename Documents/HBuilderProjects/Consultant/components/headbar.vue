<template>
	<view class="container">
		<view class="mask" @click="maskClick"></view>
		<view class="left">
			<view  class="icon iconfont icon-navlist"  @click="changeDrawer"></view>
			<view class="crumb-list">
				<view class="crumb">
					<text>首页</text>
					<text class="description" v-if="currentPage.meta.path">{{currentPage.meta.path}}</text>
				</view>
			</view>
		</view>
		<view class="g-right" >
			<status class="status" :statusShow="statusShow"/>
			<view class="right" v-if="currentPage.name === 'home'" @click="changeHidden" >
				<image class="image" :src="userInfo.consultantAvatar" mode="scaleToFill"></image>
				<view class="icon iconfont " 
				:class="hidden ? 'icon-xiangxiajiantou':'icon-xiangshangjiantou'"
				 style="position:absolute;right:-50rpx;bottom:0rpx;width:20rpx;"></view>
			</view>
		</view>
	
		<view class="sub-menu" id="personal"  v-if="hidden" >
			<view class="text" @click="navigateTo">个人中心</view>
			<view class="text" @click="logout">退出登录</view>
		</view>
	</view>
	
</template>

<script setup>
	import {useCommonStore,useUserStore} from '../store/index.js'
	import {storeToRefs} from 'pinia'
	import {ref,onMounted, reactive, nextTick} from 'vue'
	import status from './status/status.vue'
	const commonStore = useCommonStore()
	const userStore = useUserStore()
	const {showDrawer,currentPage,crumbList} = storeToRefs(commonStore)
	const {userInfo} = storeToRefs(userStore)
	const drawer = ref(null)
	const hidden = ref(false)
	const statusShow = ref(false)
	const headData = reactive({
		personal:{
			name:'personal',
			meta:{
				label:'个人中心',
				icon:'home'
			},
			noShow:true
		},
	})
	function changeDrawer(){
		showDrawer.value = !showDrawer.value
	}
	function navigateTo(){
		hidden.value = !hidden.value
		currentPage.value = headData.personal
		const flag = crumbList.value.find(ele=>ele.name === headData.personal.name)
		if(!flag){
			crumbList.value.push(headData.personal)
		}
	}
	function changeHidden(){
		hidden.value = !hidden.value
		if(hidden.value){
		uni.$emit('statusHidden')
		}
	}
	function maskClick(){
		hidden.value = false
		uni.$emit('statusHidden')
	}
	async function logout(){
		await userStore.logoutStatus()
		uni.showToast({
			title:'退出登录',
			icon:'none'
		})
		uni.reLaunch({
			url:'/pages/login/login'
		})
	}
	onMounted(()=>{
		uni.$on('hidden',()=>{
			hidden.value = false
		})
	})
</script>

<style lang="scss" scoped>
@import '../style/component.scss';
@import '../uni.scss';
.container{
	width:100%;
	height:100rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	position: relative;
	border-bottom: 1rpx solid $uni-bg-color-grey;
	padding: 0rpx auto;
	
	.left{
		display: flex;
		align-items: center;
		margin-top: 0rpx ;
	}
	.right{
		display: flex;
		margin-right: 30rpx;
		height: 80rpx;
		width:80rpx;
		box-sizing: border-box;
		transition: all 0.2s ease-in-out;
		position: relative;
		z-index: 1;
		.image{
			height: 100%;
			width:100%;
			background: cover no-repeat center;
			object-fit: cover;
			border-radius: 50%;
		}

	}
	
}
.mask{
		position: fixed;
		top: 0;
		left:0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
	}
.g-right{
	display: flex;
	align-items: center;
	.status{
		margin-right: 10rpx;
	}
}
.sub-menu{
	position: absolute;
	right: 10rpx;
	background-color: #ffffff;
	bottom: -197rpx;
	border-radius: 10rpx;
	box-shadow: 0 1rpx 14rpx 0 rgba(0, 0, 0, .1);
	z-index: 99999;
	.text{
		display: block;
		font-size: 28rpx;
		padding: 30rpx;
		z-index: 99999;
		&:hover{
			color:$uni-text-hover-color;
		}
	}
}
.hidden{
	overflow: hidden;
}
.show{
	height: 300rpx;
	overflow: auto;
}
.crumb-list{
	margin-left: 10rpx;
	color: #9a9a9a;
	.crumb{
		display: flex;
		align-items: center;
		font-size: 24rpx;
		.description{
			
		}
	}
}
.icon-navlist{
	color:$uni-b-color;
	transform: scale(1.8);
	z-index: 1;
}
.icon{
	margin: 15rpx 20rpx;
}

</style>