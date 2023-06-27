<script setup>
	import {useUserStore} from './store/index.js'
	import {storeToRefs} from 'pinia'
	import {onLaunch,onShow,onHide,onLoad} from '@dcloudio/uni-app'
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	
	onLaunch(()=>{
		uni.hideTabBar()
		const u = uni.getStorageSync('userInfo')
		if(u){
			userInfo.value = u
		}else{
			uni.removeStorageSync('userInfo')
		}
		
	})
	onLoad(()=>{
		uni.showShareMenu({
			withShareTicket:true,
			menus:["shareAppMessage","shareTimeline"]
		})
	})
	function onShareAppMessage(res) {
	    if (res.from === 'button') {// 来自页面内分享按钮
	        console.log(res.target)
	    }
	    return {
	        title: '友屿咨询端', //分享的名称
	        path: '/pages/login/login',
	        mpId:'wx712d7eb0b873518e' //此处配置微信小程序的AppId
	    }
	}
	//分享到朋友圈
	function onShareTimeline(res) {
	    return {
	        title: '友屿咨询端',
	        type: 0,
	        summary: "",
	    }
	}

</script>

<style>
	@import '@/static/iconfont.css';

		scroll-view ::-webkit-scrollbar {  
		    display: none !important;  
		    width: 0 !important;  
		    height: 0 !important;  
		    -webkit-appearance: none;  
		    background: transparent;  
			
		}
		
		::-webkit-scrollbar{
			  display: none;
		}
	image{
		width:40rpx;
		height: 40rpx;
	}

</style>
