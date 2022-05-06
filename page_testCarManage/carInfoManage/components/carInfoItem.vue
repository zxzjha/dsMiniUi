<template>
	<view :class="['page-car-info-item',isOpen?'collape-open':'collape-close']">
		<view :class="['title--box',initialData.isOpening?'blue-theme-title':'grey-theme-title']">
			<view class="item-left"></view>
			<view class="item-center">
				<view class="item-center-title">{{itemId}}. {{initialData.vin || ''}}</view>
				<view class="item-center-content">
					<view class="item">{{initialData.vehicleProjectDesc}}</view>
					<view class="item" v-if="initialData.licenseNumber&&initialData.licenseNumber!=='无'">{{initialData.licenseNumber}}</view>
				</view>
			</view>
			<view class="item-right" @click="changeCollapse">
				<u-icon name="list" color="#fff" size="28"></u-icon>
			</view>
		</view>
		<view :class="['content-box',initialData.isOpening?'blue-theme-content':'grey-theme-content']">
			<view class="content-line" v-for="(item,ind) in carInfoColumns" :id="ind" :key="ind">
				<view class="content-lable-item">{{item.label}}：</view>
				<view class="content-value-item">{{initialData[item.prop]}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {arrChunk} from '@/lib/lib.js'
	import {carInfoColumns} from '../const.js'
	
	export default{
		name:'car-info-item',
		props:{
			initialData:{
				default(){
					return {}
				}
			},
			itemId:{
				default(){
					return 1
				}
			}
		},
		data(){
			return {
				isOpen:false,
				carInfoColumns
			}
		},
		methods:{
			changeCollapse(){
				this.isOpen = !this.isOpen
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-car-info-item{
		margin: 30rpx 0;
		overflow: hidden;
		.title--box{
			display: flex;
			align-items: center;
			min-height: 100rpx;
			box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
			transition: border-radius 0.6s ease-out;
			.item-left{
				margin-left: 25rpx;
				margin-right: 25rpx;
				width: 55rpx;
				height: 55rpx;
				border-radius: 50%;
				background-color: #fff;
				box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
				transition: background-color 0.6s ease-out;
			}
			.item-center{
				flex: 1;
				padding: 20rpx 0;
				.item-center-title{
					color: #fff;
					font-size: 32rpx;
					font-weight: bold;
				}
				.item-center-content{
					display: flex;
					padding: 12rpx 0 0 30rpx;
					font-size: 20rpx;
					color: #797979;
					.item{
						margin-right: 20rpx;
						padding: 4rpx 20rpx;
						border-radius: 30rpx;
						background-color: #e4e4e4;
					}
				}
			}
			.item-right{
				margin-left: 20rpx;
				margin-right: 36rpx;
			}
		}
		.content-box{
			font-size: 24rpx;
			transition: all 0.6s ease-out;
			overflow: auto;
			.content-line{
				display: flex;
				margin-bottom: 10rpx;
				.content-lable-item{
					min-width: 220rpx;
				}
			}
		}
	}
	.collape-open{
		.title--box{
			background-color: #93a1ff;
			border-radius: 36rpx 36rpx 0 0;
		}
		.content-box{
			height: 330rpx;
			max-height: 330rpx;
			margin:0 0;
			padding: 20rpx 30rpx;
			border-radius: 0 0 36rpx 36rpx;
		}
		.blue-theme-title{
			background-color: #93a1ff;
			.item-left{
				background-color: #746cef;
			}
		}
		.grey-theme-title{
			background-color: #a7a7a7;
		}
		.blue-theme-content{
			color: #6770b3;
			background-color: #ccd3ff;
		}
		.grey-theme-content{
			color: #676767;
			background-color: #e4e4e4;
		}
	}
	.collape-close{
		.title--box{
			border-radius: 72rpx;
			background-color: #7F8FFF;
		}
		.content-box{
			height: 0;
			max-height: 0;
			margin: 0 60rpx;
		}
		.blue-theme-title{
			background-color: #7F8FFF;
		}
		.grey-theme-title{
			background-color: #909090;
		}
	}
</style>