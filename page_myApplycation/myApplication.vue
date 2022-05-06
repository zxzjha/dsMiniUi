<template>
	<view class="page-my-application">
		<view class="content-line" v-for="item in applicationList" :key="item.id" @click="onGoto(item.path)">
			<view class="content-line-left">
				{{item.title}}
			</view>
			<u-icon name="arrow-right" color="#5a5a5a" size="18"></u-icon>
		</view>
	</view>
</template>

<script>
	import {applicationList} from './const.js'
	
	export default {
		name:'my-application',
		data() {
			return {
				applicationList
			};
		},
		methods:{
			onGoto(path){
				console.log(path,'ongoto-my-application')
				uni.navigateTo({
					url: path
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-my-application{
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
