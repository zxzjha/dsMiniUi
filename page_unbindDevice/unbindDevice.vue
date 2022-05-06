<template>
	<view class="page-unbind-device">
		<u-icon name="error-circle-fill" color="#F20909" size="60"></u-icon>
		<view class="info-title">
			账号解绑后将放弃以下权益
		</view>
		<view class="info-box">
			<text>1. 解绑后将清除账号中所有的信息和数据</text>
			<text class="info-line2">2. 解绑后将取消该微信号和本平台账户之间的关联</text>
		</view>
		<view class="radio-box">
			<u-checkbox-group v-model="hasAgree">
				<u-checkbox label="已阅读并同意上述内容" :name="true" activeColor="#423bb3" shape="circle"></u-checkbox>
			</u-checkbox-group>
		</view>
		<view class="btn-box">
			<u-button @click="onSubmit" :loading="isBtnLoading" :disabled="isDIsabled" color="#423bb3" text="解绑账号" shape="circle"></u-button>
		</view>
	</view>
</template>

<script>
	import apiLib from '@/api/api.js'
	
	export default {
		name:'unbind-device',
		data() {
			return {
				hasAgree:[],
				isBtnLoading:false,
			};
		},
		computed: {
      isDIsabled(){
        if(this.hasAgree.length===0){
					return true
				}else{
					return this.isBtnLoading
				}
      }
    },
		methods:{
			async onSubmit(){
				this.isBtnLoading = true
				const res = await apiLib.unbindWxAccount()
				console.log(res,'unbindWxAccount')
				if(res.isOk){
					uni.$u.toast('解绑成功！')
					this.$store.dispatch('baseStore/updateToken','')
					this.$store.dispatch('baseStore/updateUserInfo',{})
					this.$store.dispatch('baseStore/updateOpenid','')
					this.$store.dispatch('baseStore/updateAuthResourceLib',[])
					
					this.toLoginPage()
				}
				this.isBtnLoading = false
			},
			toLoginPage(){ // 跳转去登录页
				uni.redirectTo({
					url: '/pages/login/login'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.page-unbind-device{
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 100rpx;
	background: #f5f6f9;
	.info-title{
		margin: 100rpx 0 20rpx;
	}   
	.info-box{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin: 50rpx 40rpx 100rpx;
		padding: 40rpx 30rpx;
		border-radius: 12rpx;
		background: #fff;
		color: #585858;
		.info-line2{
			margin-top: 40rpx;
		}
	}
	.radio-box{
		margin: 0 0 60rpx 0;
	}
	.btn-box{
		width: 61vw;
		margin: 40rpx 50rpx;
	}
}
</style>
