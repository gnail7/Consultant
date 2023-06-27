import {defineStore} from 'pinia'
import {ref} from 'vue'
import request from '../utils/request'

export const MAX_CONSULT_NUMS = 2
export const useUserStore = defineStore('useUserStore',()=>{
	const userInfo = ref({}) 
	const consultingNums = ref(0)
	function setUserData(data){
		userInfo.value = data
		uni.setStorageSync('userInfo',data)
	}
	//咨询师接到的咨询的数量,超过两个的话status为1
	const statusMap = new Map([
		[-1,'下线'],
		[0,'空闲'],
		[1,'咨询中']
	])
	async function updateStatus(){
		const r = await request({
			url:'/consultant/updateConsultant',
			method:'POST',
			data:{...userInfo.value}
		})
		if(r.flag){
			console.log('update status success')
		}
	}
	async function changeConsultNums(len){
		consultingNums.value = len
		if(len === MAX_CONSULT_NUMS){
			try{
				const r  = await request({
					url:'/consultant/updateConsultant',
					method:'POST',
					data:{...userInfo.value,status:1}
				})
				userInfo.value = {...userInfo.value,status:1}
				if(r.flag){
					uni.setStorageSync('userInfo',userInfo.value)
				}
			}catch(e){
				
			}
		
		}
	}
	//logout判断是不是下线,在线的话就不传
	async function logoutStatus(){
		
		const r = await request({
			url:'/consultant/updateConsultant',
			method:'POST',
			data:{...userInfo.value,status:-1}
		})
		uni.removeStorageSync('userInfo')
	}
	return{
		userInfo,setUserData,statusMap,changeConsultNums,logoutStatus,consultingNums
	}
})

export const useCommonStore = defineStore('commonStore',()=>{
	const showDrawer = ref(false)
	const currentPage = ref({
		name:'home',
		meta:{
			icon:'home',
			label:'主页',
			roles:[0,1]
		}
	})
	const crumbList = ref([
		{
			name:'home',
			meta:{
				icon:'home',
				label:'主页',
				roles:[0,1]
			}
		}
	])
	const routes = ref([
		{
			name:'home',
			meta:{
				label:'首页',
				icon:'home',
				roles:[0,1]
			},
		},
		{
			name:'personal',
			meta:{
				label:'个人中心',
				icon:'yonghuziliao',
				roles:[0,1]
			},
			
		},
		
		{
			name:'consult',
			meta:{
				label:'我的咨询',
				icon:'zixun',
				path:' / 咨询管理 / 我的咨询',
				roles:[0,1]
			},
		},
		{
			name:'activityManage',
			meta:{
				label:'动态管理',
				icon:'shebeiguanli',
				roles:[1]
			}
		},
	
		{
			name:'letterManage',
			meta:{
				label:'信箱管理',
				icon:'xinxiang-xiankuang',
				hidden:true,
				roles:[0,1]
			},
			children:[
				{
					name:'letter',
					meta:{
						label:'答案之书管理',
						icon:'youxiang',
						hidden:true,
						roles:[0,1],
						path:' / 信箱管理 / 答案之书管理',
					},
				},
				// {
				// 	name:'myReply',
				// 	meta:{
				// 		label:'我的回复',
				// 		icon:'xinxiang-xiankuang',
				// 		hidden:true,
				// 		roles:[0,1],
				// 		path:' / 信箱管理 / 我的回复',
				// 	},
				// }
			]
		},
	
		{
			name:'userManage',
			meta:{
				label:'用户管理',
				icon:'shebeiguanli',
				hidden:false,
				roles:[1]
			},
			children:[
				{
					name:'manageConsultant',
					meta:{
						label:'咨询师管理',
						icon:'zixunguwen',
						path:' / 用户管理 / 咨询师管理',
						roles:[1]
					}
				},
				{	name:'userList',
					meta:{
						label:'用户列表',
						icon:'yingyongguanliyuanguanli',
						path:' / 用户管理 / 用户列表',
						roles:[1]
					}
				},
				{
					name:'sucideHotlines',
					meta:{
						label:'自杀热线',
						icon:'kefurexianxianxing',
						path:' / 用户管理 / 自杀热线',
						roles:[1]
					},
				},
			]
		},
		,
		{
			name:'feedbackManage',
			meta:{
				label:'反馈列表',
				icon:'liuyan',
				hidden:true,
				roles:[1],
				path:' / 反馈列表 ',
			},
		}
	])
	return{
		showDrawer,currentPage,routes,crumbList
	}
})

export const usePatternStore = defineStore('patternStore',()=>{
		const phonePattern = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/
		const emailPattern = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
		const requiredPattern = /\S/
		return{
			phonePattern,emailPattern,requiredPattern
		}
})

export const useEmojiStore = defineStore('emojiStore',()=>{
	const expressions = ([{
        "title": "[闭嘴]",
        "icon": "https://howcode.online/emo/闭嘴.png"
      },
      {
        "title": "[尬笑]",
        "icon": "https://howcode.online/emo/尬笑.png"
      },
      {
        "title": "[害怕]",
        "icon": "https://howcode.online/emo/害怕.png"
      },
      {
        "title": "[奸笑]",
        "icon": "https://howcode.online/emo/奸笑.png"
      },
      {
        "title": "[静音]",
        "icon": "https://howcode.online/emo/静音.png"
      },
      {
        "title": "[开心]",
        "icon": "https://howcode.online/emo/开心.png"
      },
      {
        "title": "[口罩]",
        "icon": "https://howcode.online/emo/口罩.png"
      },
      {
        "title": "[哭]",
        "icon": "https://howcode.online/emo/哭.png"
      },
      {
        "title": "[酷]",
        "icon": "https://howcode.online/emo/酷.png"
      },
      {
        "title": "[流汗]",
        "icon": "https://howcode.online/emo/流汗.png"
      },
      {
        "title": "[懵B]",
        "icon": "https://howcode.online/emo/懵B.png"
      },
      {
        "title": "[迷茫]",
        "icon": "https://howcode.online/emo/迷茫.png"
      },
      {
        "title": "[面无表情]",
        "icon": "https://howcode.online/emo/面无表情.png"
      },
      {
        "title": "[魔鬼]",
        "icon": "https://howcode.online/emo/魔鬼.png"
      },
      {
        "title": "[难过]",
        "icon": "https://howcode.online/emo/难过.png"
      },
      {
        "title": "[呕吐]",
        "icon": "https://howcode.online/emo/呕吐.png"
      },
      {
        "title": "[疲惫]",
        "icon": "https://howcode.online/emo/疲惫.png"
      },
      {
        "title": "[亲吻]",
        "icon": "https://howcode.online/emo/亲吻.png"
      },
      {
        "title": "[热恋]",
        "icon": "https://howcode.online/emo/热恋.png"
      },
      {
        "title": "[生病]",
        "icon": "https://howcode.online/emo/生病.png"
      },
      {
        "title": "[生气]",
        "icon": "https://howcode.online/emo/生气.png"
      },
      {
        "title": "[受伤]",
        "icon": "https://howcode.online/emo/受伤.png"
      },
      {
        "title": "[睡觉]",
        "icon": "https://howcode.online/emo/睡觉.png"
      },
      {
        "title": "[思考]",
        "icon": "https://howcode.online/emo/思考.png"
      },
      {
        "title": "[天使]",
        "icon": "https://howcode.online/emo/天使.png"
      },
      {
        "title": "[头晕]",
        "icon": "https://howcode.online/emo/头晕.png"
      },
      {
        "title": "[吐舌]",
        "icon": "https://howcode.online/emo/吐舌.png"
      },
      {
        "title": "[笑哭]",
        "icon": "https://howcode.online/emo/笑哭.png"
      },
      {
        "title": "[斜眼]",
        "icon": "https://howcode.online/emo/斜眼.png"
      },
      {
        "title": "[眼红]",
        "icon": "https://howcode.online/emo/眼红.png"
      },
      {
        "title": "[眨眼]",
        "icon": "https://howcode.online/emo/眨眼.png"
      },
      {
        "title": "[震惊]",
        "icon": "https://howcode.online/emo/震惊.png"
      },
      {
        "title": "[中毒]",
        "icon": "https://howcode.online/emo/中毒.png"
      }
    ])
	return {
		expressions
	}
})

export const useAppStore = defineStore('useAppStore',()=>{
	const AppId = ('wx712d7eb0b873518e')
	const AppSecret = ('6b09ce828fbf579ca99babefc37c0d71')
	return{
		AppId,AppSecret
	}
})