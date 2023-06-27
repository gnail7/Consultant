<template>
	<view 
	v-for="item in data" 
	:key="item.name" 
	@click="togglePage(item)"
	class="nav-item">
		<view v-if="item.children===undefined " class="title" :class="currentPage.name === item.name ? 'active':''">
			<view class="icon iconfont" :class="'icon-'+item.meta.icon"></view>
			<view class="label">{{item.meta.label}}</view>
		</view>
		<view v-else class="sub-menu">
			<view class="title" @click="changeSubMenu(item)">
				<view class="icon iconfont" :class="'icon-'+item.meta.icon"></view>
				<view class="between">
					<view class="label">{{item.meta.label}}</view>
					<view style="margin-left: 15rpx;" class="icon iconfont" :class="item.meta.hidden ? 'icon-xiangshangjiantou':'icon-xiangxiajiantou'"></view>	
				</view>
			</view>
			<view class="collapse-item" v-if="!item.meta.hidden">
				<item :data="item.children"></item>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, onMounted,ref,toRefs } from 'vue';
	import {useCommonStore} from '@/store/index.js'
	import {storeToRefs} from 'pinia'
	const commonStore = useCommonStore()
	const {currentPage,routes,crumbList} = storeToRefs(commonStore)
	const props = defineProps(['data'])
	import item from './item.vue'
	const {data } = toRefs(props)
	function onChange(e){
		activeNames.value = e.detail
	}
	function togglePage(item){
		if(!item.children){
			currentPage.value = item
			const flag = crumbList.value.find(ele=>ele.name === item.name)
			if(!flag){
				crumbList.value.push(item)
			}
		}
	}
	function changeSubMenu(item){
		//如果是二级菜单: item.meta.path
		item.meta.hidden = !item.meta.hidden
		if(!item.meta.sub){
			routes.value = routes.value.map(ele=>{
				if(ele.name !== item.name){
					ele.meta.hidden = true
				}
				return ele
			})
		}
	}
	onMounted(()=>{
		
	})
</script>

<style lang="scss" scoped>
@import '../uni.scss';
@import '@/static/iconfont.css';

.nav{
	width:100%;
	height: 100%;
	font-size: $uni-font-size-base;
	box-sizing: border-box;
	color: black;
	background-color: #ffffff;
	
	font-weight: normal;
}
	.nav-item{
		width:100%;
		font-size: $uni-font-size-base;
		box-sizing: border-box;

		.title{
			box-sizing: border-box;
			height: 100rpx;
			width: 100%;
			display: flex;
			align-items: center;
			padding: 20rpx;
			position: relative;
		}	
	}
.active{
	// background-color: #0e537a;
	// background-color: #ffffff;
	color:#00e1b4 ;
	opacity: 1;
}
.label{
	margin-left: 10rpx;
}
.sub-menu{
	transition: all 0.2s ease-in-out; 
	
	
	.title{
		// padding: 20rpx;
		display: flex;
		.between{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
	.collapse-item{
		box-sizing: border-box;
		width: 100%;
		padding: 0rpx 15rpx;
		display: block;
		transition: all 0.2s ease-in-out;
		border-left: 10rpx solid #00e1b4;
		// background: #0e537a;
		// background-color: #fff7c1;
	}
}
.hidden{
	height: 80rpx;
	overflow: hidden;
}
.expand{
	height: 420rpx;
	overflow: auto;
}

image{
	width:40rpx;
	height: 40rpx;
}
</style>