<template>
	<view class="g-pager">
		<view class="icon iconfont icon-fanhuijiantou" @click="clickHintIcon(-1)"></view>
		<view class="pages">
			<view
			v-for="item in computedPage" 
			:key="item" 
			class="item" 
			:class="item == copy ? 'active':''"
			@click="togglePage(item)">{{item ? item : 0}}</view>
		</view>
		<view class="icon iconfont icon-xiangyoujiantou" @click="clickHintIcon(1)"></view>
	</view>
</template>

<script setup>
	import {ref,toRefs,computed, reactive, onMounted,watch, nextTick} from 'vue'
	const props = defineProps({
		total:{
			type:Number
		},
		pageSize:{
			type:Number,
			default:5
		},
		currentPage:{
			type:Number,
			default:1
		}
	})
	const copy = ref(props.currentPage)
	//range:1表示，pager只显示currentPage的左右各自一页
	const pagerSetting = {
		range:1,
	}
	const emit = defineEmits(['pageChange','iconClick'])
	const {total,pageSize,currentPage} = toRefs(props)
	const pages = computed(()=>Math.ceil(total.value/pageSize.value))
	const computedPage = computed(()=>{
		  const start = Math.max(1, currentPage.value - 2)
		  const end = Math.min(pages.value, start + 4)
		  return Array(end - start + 1).fill().map((_, idx) => start + idx)
	})
	const showPages = computed(()=>{
		const length = pages.value;
		const arr = Array.from({ length }, (_, i) => i);
		return arr
	})
	function clickHintIcon(val){
		emit('iconClick',val)
		nextTick(()=>{
			if(val>0){
				if(copy.value>=total.value){
					return;
				}
				copy.value += val 
			}else{
				if(copy.value == 1){
					return;
				}
				copy.value +=val 
			}
			
		})
	}
	function togglePage(item){
		emit('pageChange',item)
		nextTick(()=>{
			copy.value = item
		})
	}
	//3页3页的展示,start有位置就取，没位置=>右边多取一个，如果右边没有位置=》就不变
	const renderPages = computed(()=>{
		const c = currentPage.value
		const {range} = pagerSetting
		let startPos = c-range;
		(startPos < 1)&&(startPos =1)
		let endPos = c+range;
		(endPos >pages.value)&&(endPos = pages.value)
		return pages.value.slice(startPos,endPos)
	})
	onMounted(()=>{
	
	})
</script>

<style lang="scss" scoped>
	@import '../../uni.scss';
	@import '../../style/component.scss';
	.g-pager{
		display: flex;
		font-size: 30rpx;
		align-items: center;
		z-index: 2;
		.pages{
			display: flex;
			.item{
				margin:0rpx 20rpx;
				padding: 10rpx;
				z-index: 2;
			}
		}
	}
	.icon{
		font-size: 30rpx;
		padding: 10rpx;
		z-index: 2;
	}
	.active{
		color:$uni-background-color;
	}
</style>