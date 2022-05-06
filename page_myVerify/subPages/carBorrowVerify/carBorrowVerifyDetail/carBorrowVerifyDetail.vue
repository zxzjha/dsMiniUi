<template>
	<view class="page-car-borrow-verify-detail">
		<view class="title-wrapper">
			<view class="title-line">
				<text>订单号 {{detailData.orderNum}}</text>
			</view>
			<view class="func-wrapper">
				<view class="func-box" v-if="calcIsDisplay(['BOOKING_WAIT'])">
					<u-button text="预约审核" shape="circle" size="small" @click="onEditOrderStatus('verify','预约审核')"></u-button>
				</view>
				<view class="func-box" v-if="calcIsDisplay(['PICKUP_READY'])">
					<u-button text="延时提车" shape="circle" size="small" @click="onEditOrderStatus('orderdelay','延时提车')"></u-button>
				</view>
				<view class="func-box" v-if="calcIsDisplay(['PICKUP_READY','PICKUP_DELAY'])">
					<u-button text="成功提车" shape="circle" size="small" @click="onEditOrderStatus('getcar','成功提车')"></u-button>
				</view>
				<view class="func-box" v-if="calcIsDisplay(['PICKUP_DONE','RETURN_TIMEOUT'])">
					<u-button text="还车" shape="circle" size="small" @click="onEditOrderStatus('returncar','还车')"></u-button>
				</view>
			</view>
		</view>
		<view class="content-wrapper common-wrapper-style">
			<view class="title-line-ox">订单详情信息</view>
			<view class="content-line-wrapper">
				<view class="content-line" v-for="(item,index) in carVerifyOrderColumns" :key="index">
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
		
		<u-modal :show="formModalShow" :showConfirmButton="false" labelPosition="left" :title="modalTitle" @confirm="confirmModal" @cancel="closeModal">
			<com-editorderstatus style="width:100%;" :formType="formType" :initialData="curFormData" @closeModal="closeModal" @getSubRes="getSubRes"></com-editorderstatus>
		</u-modal>
	</view>
</template>

<script>
	import moment from 'moment'
	import apiLib from '@/api/api.js'
	import {carVerifyOrderColumns} from './const.js'
	import {orderStatusEnum} from '@/page_carBorrow/const.js'
	
	export default {
		name:'car-borrow-order-detail', // 借车申请订单详情
		data() {
			return {
				detailData:{}, // 订单详情数据
				curFormData:{},
				formData:{desc:''},
				formModalShow:false, // 表单弹窗
				formType: '', // 表单类型
				modalTitle: '', // 表单标题
				isBtnLoading:false,
				eventChannel:null,
				carVerifyOrderColumns,
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
			onEditOrderStatus(formType,title){ // 更改订单状态
				this.formType = formType
				this.modalTitle = title
				this.curFormData = {...this.detailData}
				this.formModalShow = true
			},
			getSubRes(params){ // 表单提交成功
				const newStatus = params.status || ''
				this.detailData.status = newStatus
				this.detailData.latestOrderSatus=orderStatusEnum[newStatus]['desc']
				this.detailData.stepsArr.push({
					status:newStatus,
					statusDesc:orderStatusEnum[newStatus]['detail'],
					desc:params.desc || '',
					createTime:moment().format('YYYY-MM-DD HH:mm:ss')
				})
				
				this.PassData({})
				this.closeModal()
			},
			closeModal(){ // 关闭弹窗
				this.formModalShow = false
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
.page-car-borrow-verify-detail{
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
		padding: 20rpx;
		margin-bottom: 30rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: #7F8FFF;
		.title-line{
			margin-bottom: 10rpx;
		}
		.func-wrapper{
			display: flex;
			justify-content: flex-end;
			.func-box{
				width: 150rpx;
				margin-left: 20rpx;
			}
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
