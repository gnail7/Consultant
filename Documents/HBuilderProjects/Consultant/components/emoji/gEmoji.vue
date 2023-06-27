<template>
	<view class="g-pop-up" v-if="visible" >
		<view class="content" >
			<view class="emoji-list">
				<view 
				v-for="item in expressions" 
				:key="item.icon" 
				class="item" 
				@tap="insertEmoji(item)">
					<image :src="item.icon"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	/**
	 * 调起表情包，监听键盘高度，获取高度，关闭键盘调起
	 */
	import {onLoad,onUnload,onReady} from '@dcloudio/uni-app'
	import {computed, onMounted, reactive, toRefs, watch} from 'vue'
	import {useEmojiStore} from '../../store/index.js'
	const emojiStore = useEmojiStore()
	const {expressions} = emojiStore
	const props = defineProps({
		visible:Boolean,
		bottomHeight:String
	})
	const emit = defineEmits(['insertEmoji'])
	const {visible,bottomHeight} = toRefs(props)
	const height = computed(()=>{
		return bottomHeight.value ? bottomHeight.value : 0
	})
	function insertEmoji(item){
		emit('insertEmoji',item)
	}
</script>

<style lang="scss" scoped>
	.g-poop-up{
		background-color: #eeeeee;
		height:300rpx;
		box-sizing: border-box;
		.content{
			width:100%;
			height: 100%;
		}
	}
	.emoji-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;	
		height: 100%;
		.item{
			margin: 20rpx;
		}
	}
</style>