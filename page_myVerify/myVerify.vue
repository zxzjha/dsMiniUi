<template>
	<view class="page-my-verify">
		<view class="content-line" v-for="item in verifyList" :key="item.id" @click="onGoto(item.path)">
			<view class="content-line-left">
				{{item.title}}
			</view>
			<u-icon name="arrow-right" color="#5a5a5a" size="18"></u-icon>
		</view>
	</view>
</template>

<script>
	import {verifyList} from './const.js'
	
	export default {
		name:'page-my-verify',
		data() {
			return {
				verifyList
			};
		},
		methods:{
			onGoto(path){
				console.log(path,'ongoto-page-my-verify')
				uni.navigateTo({
					url: path
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-my-verify{
	padding: 30rpx;
	.content-line{
		display: flex;
		justify-content: space-between;
		padding: 30rpx 10rpx;
		border-bottom: 2rpx solid #ececec;
		color: #5a5a5a;
	}
}
</style>
