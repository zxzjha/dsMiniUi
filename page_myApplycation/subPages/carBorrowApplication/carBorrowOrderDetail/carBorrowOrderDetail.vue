<template>
	<view class="page-car-borrow-order-detail">
		<view class="title-wrapper">
			<view class="title-line">
				<text>订单号 {{detailData.orderNum}}</text>
			</view>
			<view class="func-box" v-if="calcIsDisplay(['BOOKING_WAIT','BOOKING_APPROVED','PICKUP_READY','PICKUP_DELAY'])">
				<u-button text="取消预约" shape="circle" size="small" @click="onCancleOrder"></u-button>
			</view>
		</view>
		<view class="content-wrapper common-wrapper-style">
			<view class="title-line-ox">订单详情信息</view>
			<view class="content-line-wrapper">
				<view class="content-line" v-for="(item,index) in carBorrowOrderColumns" :key="index">
					<view class="lable-item">{{item.label}}: </view>
					<view class="content-item" :style="{color:item.prop==='latestOrderSatus'?orderStatusEnum[detailData.status]['bgColor']:'#929292'}">{{detailData[item.prop] || '--'}}</view>
				</view>
			</view>
		</view>
		<view class="orderstatus-wrapper common-wrapper-style">
			<view class="title-line-ox">订单流转</view>
			<view class="orderstatus-content">
				<u-steps current="4" direction="column">
					<u-steps-item v-for="(step,index) in detailData.stepsArr" :key="index" :title="step.statusDesc" :desc="`${step.desc || ''} (${step.createTime || ''})`">
						<text class="slot-icon" :style="{backgroundColor: index === (detailData.stepsArr.length-1)? orderStatusEnum[step.status]['bgColor']:'#909399'}" slot="icon">{{index+1}}</text>
					</u-steps-item>
				</u-steps>
			</view>
		</view>
		
		<u-modal :show="cancelFormShow" :showConfirmButton="false" labelPosition="left" title="取消预约" @confirm="confirmModal" @cancel="closeModal">
			<view class="order-modal-content" style="width: 100%;">
				<u--form :model="formData" ref="form" :borderBottom="false" :rules="rules">
					<u-form-item label="取消原因" prop="desc" labelWidth="auto" :borderBottom="false">
						<u--textarea v-model="formData.desc" :height="25" :autoHeight="true" placeholder="请输入取消原因" border="none"></u--textarea>
					</u-form-item>
				</u--form>
				
				<view class="btn-box">
					<view class="btn-item">
						<u-button text="取消" :disabled="isBtnLoading" shape="circle" @click="closeModal"></u-button>
					</view>
					<view class="btn-item">
						<u-button color="#423bb3" text="确定" shape="circle" :loading="isBtnLoading" @click="confirmModal"></u-button>
					</view>
				</view>
			</view>
		</u-modal>
		
	</view>
</template>

<script>
	import moment from 'moment'
	import apiLib from '@/api/api.js'
	import {carBorrowOrderColumns} from './const.js'
	import {orderStatusEnum} from '@/page_carBorrow/const.js'
	
	export default {
		name:'car-borrow-order-detail', // 借车申请订单详情
		data() {
			return {
				detailData:{}, // 订单详情数据
				formData:{desc:''},
				cancelFormShow:false,
				isBtnLoading:false,
				eventChannel:null,
				carBorrowOrderColumns,
				orderStatusEnum,
				rules:{
					'desc': {
						type: 'string',
						required: true,
						message: '请输入取消原因',
						trigger: ['blur', 'change']
					}
				}
			};
		},
		onLoad() {
			// #ifdef APP-NVUE
			this.eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			this.eventChannel = this.getOpenerEventChannel();
			// #endif
			
			// 监听pushInitData事件，获取上一页面通过eventChannel传送到当前页面的数据
			this.eventChannel && this.eventChannel.on && this.eventChannel.on('pushInitData', (data)=> {
				this.detailData = {...data}
				const arr = []
				const len = this.detailData.orderProcesses && this.detailData.orderProcesses.length
				if(len>0){
					for(let i=len-1;i>=0;i--){
						arr.push(this.detailData.orderProcesses[i])
					}
				}
				this.detailData.stepsArr = [...arr]
				
				console.log(this.detailData,'pushInitData',data)
			})
		},
		methods:{
			onCancleOrder(){ // 取消预约
				this.cancelFormShow = true
			},
			confirmModal(){ // 确认弹窗
				this.$refs.form.validate().then(async valid=>{
					if(valid){
						const params = {
							id:this.detailData.id,
							status:'BOOKING_CANCEL',
							desc:this.formData.desc || ''
						}
						
						this.isBtnLoading = true
						
						const res = await apiLib.editOrderStatus(params,'POST',{errMessage:'取消预约出错了，请稍后再试！', hasErrMessage:true})
						console.log(res,'BOOKING_CANCEL')
						if(res.isOk){
							this.detailData.status = 'BOOKING_CANCEL'
							this.detailData.latestOrderSatus=orderStatusEnum['BOOKING_CANCEL']['desc']
						  this.detailData.stepsArr.push({
								status:'BOOKING_CANCEL',
								statusDesc:orderStatusEnum['BOOKING_CANCEL']['detail'],
								desc:this.formData.desc || '',
								createTime:moment().format('YYYY-MM-DD HH:mm:ss')
							})
							
							this.PassData(this.formData)
							this.cancelFormShow = false
						}
						
						this.isBtnLoading = false
					}
				}).catch(err=>{
					// uni.$u.toast('表单校验失败')
					console.log(err,'2323')
				})
			},
			closeModal(){ // 关闭弹窗
				this.cancelFormShow = false
			},
			PassData(data){ // 向上级页面传送数据
				this.eventChannel.emit('getFormData', {...data});
			},
			calcIsDisplay(allowTypeArr=[]){ // 判断当前按钮是否显示
				return allowTypeArr.some(type=>this.detailData.status && this.detailData.status===type)
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-car-borrow-order-detail{
	padding-bottom: 20rpx;
	.order-modal-content{
		.btn-box{
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;
			.btn-item{
				width: 50%;
				&:nth-child(1){
					margin-right: 20rpx;
				}
			}
		}
	}
	.form-date-line{
		display: flex;
	}
	.title-wrapper{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60rpx;
		line-height: 60rpx;
		padding: 20rpx;
		margin-bottom: 30rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: #7F8FFF;
		.func-box{
			width: 150rpx;
		}
	}
	.common-wrapper-style{
		padding: 0 40rpx;
		.title-line-ox{
			display:flex;
			align-items: center;
			font-size: 32rpx;
			font-weight: 500;
			color: #7F8FFF;
			&::before{
				content: '';
				display: block;
				width: 10rpx;
				align-self: normal;
				margin-right: 30rpx;
				background-color: #7F8FFF;
			}
		}
	}
	.content-wrapper{
		.content-line-wrapper{
			box-sizing: border-box;
			width: 100%;
			padding: 20rpx 30rpx;
			overflow: hidden;
			.content-line{
				display: flex;
				margin-bottom: 20rpx;
				font-size: 28rpx;
				word-break: break-all;
				.lable-item{
					margin-right: 20rpx;
					word-break: keep-all;
					color: #4a4a4a;    
				}
				.content-item{
					color: #929292;
				}
			}
		}
	}
	.orderstatus-wrapper{
		.orderstatus-content{
			padding: 20rpx 30rpx;
			.slot-icon{
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				font-size: 24rpx;
				line-height: 32rpx;
				text-align: center;
				color: #fff;
			}
			.add-icon-color-grey{
				background-color: #afafaf;
			}
			.add-icon-color-blue{
				background-color: #3C9CFF;
			}
		}
	}
}
</style>
