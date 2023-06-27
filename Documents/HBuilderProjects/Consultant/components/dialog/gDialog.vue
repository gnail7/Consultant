<template>
	<view class="page">
		<view class="box">
			<slot name="title"></slot>
			<slot name="content"></slot>
		</view>
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
	.page{
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1;
		position: absolute;
		top: 0;
		left:0;
		.box{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			border-radius: 50rpx;
			padding: 50rpx;
			height: 300rpx;
			width: 500rpx;
			background-color: #ffffff;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}
</style>