<template>
	<view class="container">
		<view class="card box-shadow">
			<text class="title">个人信息</text>
			<view class="box">
				<view class=" avator" style="width: 150rpx;height: 150rpx;margin:auto;">
					<image :src="userInfo.consultantAvatar" @click="chooseImage" style="width:100%;height:100%" mode="scaleToFill"/>
				</view>
				<view class="item">
					<view class="label">真实姓名</view>
					<view class="content">
						{{userInfo.realName}}
					</view>
				</view>
				<view class="item" v-for="ele in renderUserInfo" :key="ele.value" :class="computedClass(ele.label)" @click="toFansList">
					<view class="label">{{ele.label}}</view>
					<view class="content" v-if="ele.label!=='粉丝数量'">
						{{ele.value}}
					</view>
					<view class="content"  v-else >
						{{fansLength ? fansLength : 0 }}
						<view class="icon iconfont icon-xiangyoujiantou" style="z-index: 1;" ></view>
					</view>
				</view>				
			</view>
		</view>
		<view class="card">
			<view class="t-head">
				<text class="head-title" @click="changeBox(true)" :class="activeBox ? 'active':''">基本资料</text>
			</view>
			<view class="box">
				<!-- :placeholder="copyUserInfo.consultantName"  -->
				<g-input-item class="divide"
				required 
				labelWidth="200rpx" 
				att="consultantName"
				@inputEmit="inputEmit"
				style="z-index: 10;"
				v-model="form.consultantName">
					<template #label>咨询用名</template>
				</g-input-item>
				<view class="g-input-item divide">
					<view class="g-label">
						<view class="label">性别</view>
					</view>
					<view class="radio">
						<radio-group @change="onChange">
							<label v-for="item in sex" :key="sex.value">
								<radio :checked="item.checked" :value="item.gender">{{item.gender}}</radio>
							</label>
						</radio-group>
					</view>
				</view>
				<view class="buttonOperation divide">
					<button class="button" @click="saveEdit">保存</button>
					<!-- <button class="button danger" @click="closePersonal">关闭</button> -->
				</view>
			</view>
		</view>
		<view class="divide"></view>
	</view>
</template>

<script setup>
	import gInputItem from '../../components/input/gInputItem.vue'
	import {useCommonStore,useUserStore} from '../../store/index.js'
	import {storeToRefs} from 'pinia'
	import {BASEURL} from '../../utils/request.js'
	import {computed, onMounted, reactive, ref} from 'vue'
	import {validator,userInfoMap,showModal,showInfo} from '../../utils/index.js'
	import {getFansUser} from '@/utils/api.js'
	import request from '../../utils/request'
	const copyUserInfo = computed(()=>{
		return JSON.parse(JSON.stringify(userInfo.value))
	})
	const fansLength = ref(0)
	const commonStore = useCommonStore()
	const userStore = useUserStore()
	const {currentPage} = storeToRefs(commonStore)
	const {userInfo} = storeToRefs(userStore)
	const sex = [
		{
			gender:'男',
			checked:true,
			value:1,
		},
		{
			gender:'女',
			checked:false,
			value:0,
		}
	]
	function computedClass(label){
		if(label==='粉丝数量'){
			return 'fans'
		}
		return ''
	}
	const activeBox = ref(true)
	const form = ref(resetForm())
	function resetForm(){
		return {
			consultantName:userInfo.value.userName,
			gender:'男'
		}
	}
	//根据utils里面写好的map规定好要渲染的userInfo
	const renderUserInfo = computed(()=>{
		const keys = Object.keys(userInfo.value)
		const values = Object.values(userInfo.value)
		let newArr = []
		for (let i = 0; i< keys.length; i++) {
			if(userInfoMap.get(keys[i])){
				if(keys[i] === 'hasManager'){
					const m1 = ['咨询师','管理员']
					newArr.push({
						label:userInfoMap.get(keys[i]),
						value:m1[values[i]]
					})
				}else{
					newArr.push({
						label:userInfoMap.get(keys[i]),
						value:values[i]
					})
				}
				
			}
		}
		return newArr
	})
	function toFansList(){
		uni.navigateTo({
			url:"/pages/fansList/fansList"
		})
	}
	
	// #region正则表达式 
	const hint = reactive({
		phoneHint:{
			show:false,
			label:'手机号码11位'
		},
		usernameHint:{
			show:false,
			label:'不能为空喔'
		},
		emailHint:{
			show:false,
			label:'注意邮箱格式'
		}
	})
	const pattern = {
		phonePattern:/^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/,
		emailPattern:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
		namePattern:/\S/,
	}
	// #endregion 正则表达式
	//这个函数里面就返回store里面的初始数据
	
	function chooseImage(){
		uni.chooseMedia({
			count:1,
			mediaType:'image',
			camera:'front',
			success:(res)=>{
				
				// const {tempFiles} = res
				const fileUrl = res.tempFiles[0].tempFilePath
				console.log('fileUrl',fileUrl)
				uni.navigateTo({
					url:`/pages/avatarPreview/avatarPreview?fileUrl=${fileUrl}`
				})
				// userInfo.value.consultantAvatar = tempFiles[0].tempFilePath	
				// uni.uploadFile({
				// 	filePath:tempFiles[0].tempFilePath,
				// 	url: BASEURL+'/user/upload',
				// 	name: 'file',
				// 	formData: {
				// 		'consultant': 'test'
				// 	},
				// 	success: async(r) => {
				// 	  if(r.statusCode === 200){
				// 		  userInfo.value.consultantAvatar = r.data
				// 		  uni.setStorageSync('userInfo',userInfo.value)
				// 		  await updatePeronalInfo()
				// 	  }
				// 	},
				// 	fail: () => {
				// 	  console.log("失败...");
				// 	}
				// })

			}
		})
	}
	async function updatePeronalInfo(){
		const r = await request({
			url:'/consultant/updateConsultant',
			method:'POST',
			data:userInfo.value
		})
		return r
	}
	// #region 表单操作
	function onChange(e){
		form.value.gender = e.detail.value
	}
	async function saveEdit(){
		const cUserInfo = JSON.parse(JSON.stringify(userInfo.value))
		const v1 = await validator(form.value.consultantName,pattern.namePattern)
		// const v3 = await validator(form.value.consultantPhone,pattern.phonePattern)
		// hint.usernameHint.show = !v1
		if(form.value.consultantName == ''){
			form.value.consultantName = cUserInfo.consultantName
		}
		uni.showModal({
			confirmText:'确认保存',
			cancelText:'取消',
			content:'保存更改',
			success: async() => {
				const r = await request({url:'/consultant/updateConsultant',method:'POST',data:{...cUserInfo,...form.value}})
				if(r.flag){
					userInfo.value = {...cUserInfo,...form.value}
					uni.setStorageSync('userInfo',userInfo.value)	
				}
			}
		})
	}
	function closePersonal(){
		uni.showModal({
			confirmText:'确认关闭',
			cancelText:'取消',
			content:'关闭当前个人中心页面',
			success: async(res) => {
				console.log('res:',res)
				if(res.confirm){
					currentPage.value = {
						name:'home',
						meta:{
							label:'首页'
						}
					}
				}	
			}
		})
		
	}
	function inputEmit(obj){
		const {att,value} = obj
		form.value[att] = value
	}
	// #endregion
	onMounted(async()=>{
		const r = await getFansUser(userInfo.value)
		if(r){
			fansLength.value = r.length
		}
		
	})
</script>

<style lang="scss" scoped>
	@import '../../uni.scss';
	@import '../../style/component.scss';
	.container{
		box-sizing: border-box;
		font-size: 28rpx;
		width:98vw;
		margin-bottom: 30rpx;
		padding-bottom: 50rpx;
		height: 100%;
		.card{
			width:90%;
			padding: 30rpx;
			box-shadow: 0 1rpx 18rpx 0 rgba(0, 0, 0, .1);
			margin: 20rpx auto;
		}
		.box{
			display: flex;
			flex-direction: column;
			margin: 30rpx auto;
			width:100%;
			height: 100%;
			
			.item{
				width:100%;
				height: 100%;
				
				display: flex;
				position: relative;				
				justify-content: space-between;
				padding: 20rpx 0rpx;
				border-bottom: 5rpx solid $uni-border-grey;
			
				.content{
					display:flex;
					justify-content: center;
					align-items: center;
					.icon{
						color:$uni-bg-color-grey;
			
					}
				}
			}
		}
	}
	.fans{
		z-index: 1;
	}
	.avator{
		display: flex;
		justify-content: center;
		align-items: center;
		width:100%;
		height: 100%;
		height: 200rpx;
		width: 100%;
		
		position: relative;
		image{
			height: 200rpx;
			width: 200rpx;
			border-radius: 50%;
			position: absolute;
			left: 50%;
			right: 50%;
			transform: translate(-50%);
			z-index: 1;
		}
	}
	.title{
		display: block;
		border-bottom: 1rpx solid $uni-bg-color-grey;
	}
	.divide{
		margin:30rpx auto;
		width: 270px;
	}
	.t-head{
		.head-title{
			padding: 10rpx;
			font-size: 34rpx;
		}
		.active{
			border-bottom: 10rpx solid $uni-b-color;
		}
	}
	
	
	.g-input-item{
		width: 315px;
		display: flex;
		height: 50rpx;
		font-size: 28rpx;
		align-items: center;
		box-sizing: border-box;
		.radio{
			box-sizing: border-box;
			margin-left: 20rpx;
			padding: 10rpx;
			flex: 1;
			z-index: 1;
		}
		.g-label{
			display: flex;
			justify-content: flex-end;
			width: 185rpx;
		}
	}
	.change-box{
		margin: 30rpx auto;
	}
	
	.required{
		color:red;
	}
	.danger{
		background-color: #ff3333;
	}
	
	.buttonOperation{
		width:100%;
		position: relative;
		
		background-color: pink;
		.button{
			position: absolute;
			right: 70rpx;
			width: 200rpx;
			z-index: 1;
		}
	}

</style>