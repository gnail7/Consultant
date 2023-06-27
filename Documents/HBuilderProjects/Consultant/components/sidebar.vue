<template>
	<view class="container">
		<view class="sidebar">
			<item :data='sideBarList'/>
		</view>
		<view class="mask" @click="closeDrawer"></view>
	</view>
	
</template>

<script setup>
	import {useCommonStore,useUserStore} from '../store/index.js'
	import {storeToRefs} from 'pinia'
	import {ref,onMounted,watch, nextTick} from 'vue'
	import item from './item.vue'
	const commonStore = useCommonStore()
	const {showDrawer,routes} = storeToRefs(commonStore)
	const userStore = useUserStore()
	const {userInfo} = storeToRefs(userStore)
	const sideBarList = ref([])
	sideBarList.value = filterRoutes(routes.value)
	function filterRoutes(r){
		const role = userInfo.value.hasManager
		const ans = r.filter(item=>{
			if(item.meta.roles.includes(role)&&!item.noShow){
				if(item.children){
					item.children = filterRoutes(item.children)
				}
				return true
			}
		})
		return ans
	}
	function closeDrawer(e){
		showDrawer.value = false
	}
	watch(()=>userInfo.value.hasManager,(newValue,oldValue)=>{
		sideBarList.value = Object.assign([],filterRoutes(routes.value))
		sideBarList.value = filterRoutes(routes.value)
	},{immediate:true})
	onMounted(()=>{

	})
</script>

<style lang="scss">
.container{
	width: 100%;
	height: 100%;
	display: flex;
	box-sizing: border-box;
	.sidebar{
		width: 100%;
		height: auto;
		flex: 1;
		// background-color: #ffffff;
		background-color: #ffffff;
		padding: 50rpx 0rpx;
		box-sizing: border-box;
		color: black;
		box-shadow: 0 1rpx 18rpx 0 rgba(0, 0, 0, .1);
	}
	.mask{
		width: 100%;
		height: 100%;
		flex: 1;
	}
}

</style>