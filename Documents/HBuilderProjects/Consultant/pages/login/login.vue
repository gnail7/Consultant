<template>
	<view class="container">
		<view class="box">
			<view class="logo">
				<image class="divide" src="../../static/image/logo.jpg" mode="widthFix"></image>
			</view>
			<view class="buttonOperation">
				<button class="button register" open-type="getPhoneNumber" @getphonenumber="registerDialog">登录</button>
			</view>
		</view>
		<g-dialog v-show="show">
			<template #content>
				<view class="divide">需要获取您的微信信息</view>
				<button class="button weixin" @click="weixinLogin">获取微信信息</button>
			</template>
		</g-dialog>
		<view class="n-dialog" v-if="realNameBox.visible">
			<view class="n-box">
				<view>请输入您的真实姓名:</view>
				<view class="n-form">
					<input type="text" v-model="realNameBox.realName"/>
					<button class="button" @click="realNameLogin()">确认</button>
				</view>
			</view>
		</view>
		<view>{{userInfo.value}}</view>
		<view class="agreement">
			<checkbox-group class="agreement-group" @change="changeAgree">
				<checkbox value="true"></checkbox>
				<view class="description">我已阅读并知情<navigator>《同意书》</navigator></view>
			</checkbox-group>
		</view>
		<view class="dialog" v-if="secretVisible">
			<view class="layout">
			<view class="dialog-box">
				<view class="divide">请输入邀请码</view>
				<view class="right-dialog-box">
					<input class="input" placeholder="邀请码" v-model="modelKey"/>
					<view class="button" @click="confirmCert">
						<view class="icon iconfont icon-xiangyoujiantou" style="background-color: 9360f5;"></view>
					</view>
				</view>
			</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {useAppStore,useUserStore,useCommonStore} from '@/store/index.js'
	import {storeToRefs} from 'pinia'
	import request from '../../utils/request.js'
	import {showInfo,timestampToTime,map,formatDate} from '../../utils/index.js'
	import {onLoad} from '@dcloudio/uni-app'
	import {reactive, ref} from 'vue'
	import gDialog from '../../components/dialog/gDialog.vue'
	const appStore = useAppStore()
	const userStore = useUserStore()
	const commonStore = useCommonStore()
	const {currentPage} = storeToRefs(commonStore)
	const {userInfo,setUserData} = storeToRefs(userStore)
	const {AppId,AppSecret} = appStore
	const form = ref({
		phoneNumber:''
	})
	const secretKey = 'wKn5=xj^xL7+'	
	const modelKey = ref('')
	const secretVisible = ref(true)
	const realNameBox = reactive({
		visible:false,
		realName:''
	})
	const phoneNumber = ref('')
	const show = ref(false)
	const agree = ref(false)
	function confirmCert(){
		if(modelKey.value === secretKey){
			secretVisible.value = false
			uni.showToast({
				title:'邀请码正确',
				icon:'none'
			})
		}else{
			uni.showToast({
				title:'邀请码错误',
				icon:'error'
			})
		}
	}
	async function registerDialog(e){
		
		if (e.detail.errMsg == "getPhoneNumber:fail:user deny" ||e.detail.errMsg =="getPhoneNumber:fail user deny") { //用户决绝授权
		    
		}else{
			if(agree.value){
				const {code} = e.detail
				const res = await getPhoneNumber(code)
				const {phoneNumber} = res
				
				form.value = {phoneNumber}
				show.value = true
			}else{
				await showInfo('请勾选并阅读底部协议')
			}
			
		}
	}
	async function getPhoneNumber(code){
		const res = await request({
			url:'/consultant/getPhoneNumber',
			method:'POST',
			data:{code}
		})
		return res
	}
	function getUserInfo(){
		return new Promise((resolve,reject)=>{
			uni.getUserProfile({
				desc:'实现登录功能,统计区分用户信息',
				success: (userInfo) => {
					userInfo.value = userInfo
					resolve(userInfo)
				},
				fail: () => {
					resolve(false)
				}
			})
		})
	}
	function getLoginCode(){
		return new Promise((resolve,reject)=>{
			uni.login({
				success: (res) => {
					const {code} = res
					resolve(code)
				},
				fail: () => {
					reject(0)
				}
			})
		})
	}
	async function weixinLogin(){	
		const user = await getUserInfo()
		const code = await getLoginCode()
		const t = (new Date()).getTime()
		const consultantId = "consultant_"+form.value.phoneNumber
		const createTime = formatDate(t)
		if(user){
			show.value = false
			const res = await request({
				url:'/consultant/getOpenId',
				method:'POST',
				data:{code},
			})
			const {gender,nickName,avatarUrl} = user.userInfo
			const {phoneNumber} = form.value
			const {openId} = res
			
			form.value = {
				consultantName:nickName,
				consultantPhone:phoneNumber,
				consultantAvatar:avatarUrl,
				gender:map.get(gender),createTime,consultantId,
				followedNum:0,
				consultNum:0,
				phoneNumber,
				openid:openId
			}
			const response = await request({
					url:'/login/consultant',
					method:'POST',
					data:{
						consultantPhone:phoneNumber
					}
			})
			if(!response){
				
				realNameBox.visible = true
			}else{
				userInfo.value = response		
				uni.setStorageSync('userInfo',userInfo.value)
				uni.switchTab({
					url:`/pages/index/index?first=${false}`
				})
			}
		}
	}
	async function realNameLogin(){
		const realName = realNameBox.realName
		const {phoneNumber} = form.value
		if(realName !== ''){
			const r = await request({
				url:'/register/consultant',
				method:'POST',
				data:{...form.value,hasManager:0,realName}
			})
			const rLogin = await request({
				url:'/login/consultant',
				method:'POST',
				data:{
					consultantPhone:phoneNumber
				}
			})
			userInfo.value = rLogin
			uni.setStorageSync('userInfo',rLogin)
			uni.switchTab({
				url:'/pages/index/index'
			})
		}else{
			uni.showToast({
				title:'请填写您的真实姓名'
			})
		}
		
	}
	function changeAgree(e){
		agree.value = e.detail.value[0]
	}
	function getAurization(){
		
	}
	onLoad(()=>{
	})
</script>

<style lang="scss" scoped>
@import '../../style/component.scss';
@import '../../uni.scss';
.container{
	width:100vw;
	height: 100vh;
	margin: 0;
	padding: 0;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #f4f4f4;
	font-size:28rpx;
}
.box{
	height: 65%;
	width: 95%;
	border-radius: 10rpx;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-shadow: 0 1rpx 14rpx 0 rgba(0, 0, 0, .1);
	background-color: #ffffff;
}
.logo{
	height: 600rpx;
}
.buttonOperation{
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	.button{
		width:80%;
		background-color: #1a00b1;
		padding:15rpx;
		border-radius: 60rpx;
		margin: 20rpx auto;
	}
	.register{
		background-color: #864700;
	}
}
.weixin{
		background-color: $uni-weixing-color;
}
.divide{
	margin: 30rpx auto;
}
.logo{
	display: flex;
	justify-content: center;
	align-items: center;
	image{
		width:300rpx;
		height: 300rpx;
		border-radius: 50%;
	}
}
.agreement{
	width:80%;
	font-size: 28rpx;
	position: absolute;
	left: 50%;
	bottom: 10%;
	transform: translate(-50%);
	color: $uni-bg-color-grey;
	display: flex;
	justify-content: center;
	align-items: center;
}
.agreement-group{
	display: flex;
	.description{
		display: flex;
	}
	navigator{
		color:$uni-btn-bg-color;
	}
}
.n-dialog{
	width:100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.3);
	position: absolute;
	left: 0;
	top: 0;
	z-index: 10;
	display: flex;
	justify-content: center;
	align-items: center;
	.n-box{
		background-color: #ffffff;
		padding: 40rpx;
		border-radius: 20rpx;
		box-shadow: 0 1rpx 14rpx 0 rgba(0, 0, 0, .1);
		.n-form{
			display: flex;
			.button{
				margin-left: 10rpx;
			}
		}
		input{
			border-bottom: 1rpx solid rgba(0, 0, 0, .1);
			padding:10rpx;
		}
	}
}
.dialog{
	width:100vw;
	height:100vh;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 10;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #fff;
	color:#3f4554;
	.layout{
		position: absolute;
		left: 50%;
		top: 20%;
		transform: translate(-50%,-50%);
	}
	.dialog-box{
	
		display: flex;
		flex-direction: column;
		.right-dialog-box{
			display: flex;
			.button{
				display: flex;
				justify-content: center;
				align-items: center;
				padding:15rpx;
				margin-left: 10rpx;;
			}
			.input{
				text-indent: 10rpx;;
				padding:10rpx;
				&:hover{
					border: 1px solid #00ccb8;
				}
			}
		}
	}
}
</style>
