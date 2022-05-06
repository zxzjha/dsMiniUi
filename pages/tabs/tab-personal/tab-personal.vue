<template>
	<view class="page-tab-personal">
		<view class="top-box">
			<view class="top-bg-circle1"></view>
			<view class="top-bg-circle2"></view>
			<view class="avatar-box">
				<view class="header-box">
					<image class="header-img" src="../../../static/image/workbench/avater.png"></image>
				</view>
				<view class="info-box">
					<view class="name-box">{{userInfo.trueName || ''}}</view>
					<view class="email-box">{{userInfo.email || ''}}</view>
				</view>
			</view>
		</view>
		<view class="center-box">
			<view class="func-item" v-for="item in funcIconList" :key="item.id" @click="onGoto(item.path)">
				<view :class="item.iconClass"></view>
				<text class="func-icon-lable">{{item.title}}</text>
			</view>
		</view>
		<view class="tools-box">
			<view v-for="tool in toolIconList" class="tool-line" :key="tool.id" @click="onGoto(tool.path)">
				<view class="tool-line-left">
					<view :class="tool.iconClass"></view>
					<text class="tool-title">{{tool.title}}</text>
				</view>
				<u-icon name="arrow-right" color="#5a5a5a" size="18"></u-icon>
			</view>
		</view>
		<view @click="loginOut" class="login-out-box">
			<text class="custom-icon add-login-out-icon-style" style="margin-right: 10rpx;">&#xe632;</text> 退出登录
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import {funcIconList,toolIconList} from './const.js'
	
	export default {
		data() {
			return {
				funcIconList,
				toolIconList,
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.baseStore.userInfo,
			})
		},
		methods: {
			onGoto(path){
				console.log(path,'ongoto-personal')
				uni.navigateTo({
					url: path
				});
			},
			loginOut(){ // 退出
				this.$store.dispatch('baseStore/updateToken','')
				this.$store.dispatch('baseStore/updateUserInfo',{})
				this.$store.dispatch('baseStore/updateOpenid','')
				this.$store.dispatch('baseStore/updateAuthResourceLib',[])
				
				this.toLoginPage()
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
.page-tab-personal{
	.top-box{
		position: relative;
		width: 100vw;
		// height: 580rpx;
		height: 40vh;;
		overflow: hidden;
		background: linear-gradient(to right, #6190e86b, #a7bfe85c);
		.top-bg-circle1{
			width: 300rpx;
			height: 300rpx;
			position: absolute;
			left: -49px;
			bottom: -35px;
			border-radius: 50%;
			background-color: #fdfdfd54;
		}
		.top-bg-circle2{
			width: 600rpx;
			height: 600rpx;
			position: absolute;
			right: -125rpx;
			top: -121rpx;
			border-radius: 50%;
			background-color: #6190e852;
		}
		.avatar-box{
			position: absolute;
			// top: 200rpx;
			top: 14vh;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.header-box{
				width: 150rpx;
				height: 150rpx;
				border: 6rpx solid #fff;
				border-radius: 50%;
				overflow: hidden;
				.header-img{
					width: 150rpx;
					height: 150rpx;
				}
			}
			.info-box{
				padding-top: 18rpx;
				text-align: center;
				font-weight: 500;
				color: #fff;
				.name-box{
					font-size: 40rpx;
				}
				.email-box{
					
				}
			} 
		}
	}
	.center-box{
		display: flex;
		justify-content: space-between;
		margin: 25rpx 30rpx;
		// padding: 60rpx 30rpx;
		padding: 50rpx 30rpx;
		border-radius: 15rpx;
		box-shadow: 0rpx 10rpx 32rpx #c7d9f1;
		// box-shadow: 0px 20px 60px #c7d9f1, -20px -20px 60px #ffffff;
		.func-item{
			display: flex;
			align-items: center;
			.add-icon-margin{
				margin-right: 30rpx;
			}
			.func-icon-lable{
				font-size: 36rpx;
				color: #5a5a5a;
			}
		}
	}
	.tools-box{
		margin: 40rpx 30rpx 25rpx 30rpx;
		// padding: 60rpx 30rpx;
		padding: 50rpx 30rpx;
		border-radius: 15rpx;
		box-shadow: 0rpx 10rpx 32rpx #c7d9f1;
		// box-shadow: 0px 20px 60px #c7d9f1, -20px -20px 60px #ffffff;
		.tool-line{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.tool-line-left{
				display: flex;
				align-items: center;
				color: #5a5a5a;
				.tool-title{
					padding-left: 30rpx;
				}
			}
		}
	}
	.login-out-box{
		width: fit-content;
		padding: 30rpx;
		margin: 200rpx auto 0;
		text-align: center;
		font-size: 36rpx;
		color: #a5a;
		text-decoration: underline;
		.add-login-out-icon-style{
			font-size: 42rpx;
		}
	}
}
</style>
