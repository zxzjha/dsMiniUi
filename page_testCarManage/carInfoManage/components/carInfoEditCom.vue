<template>
	<view class="page-carinfo-edit-com">
		<view class="carinfo-form-wrapper">
			<u--form :model="formData" ref="form">
				<u-form-item label="VIN" prop="vin" :labelWidth="130" borderBottom>
					<u--input v-model="formData.vin" placeholder="请输入VIN" border="none"></u--input>
				</u-form-item>
				<u-form-item label="管理编码" prop="governingCode" :labelWidth="130" borderBottom>
					<u--input v-model="formData.governingCode" placeholder="请输入管理编码" border="none"></u--input>
				</u-form-item>
				<u-form-item label="项目号" prop="vin" :labelWidth="130" borderBottom>
					<u--input v-model="formData.vin" placeholder="请输入VIN" border="none"></u--input>
				</u-form-item>
				<u-form-item label="车辆归属人" prop="vin" :labelWidth="130" borderBottom>
					<u--input v-model="formData.vin" placeholder="请输入VIN" border="none"></u--input>
				</u-form-item>
				<u-form-item label="被委托人" prop="vin" :labelWidth="130" borderBottom>
					<u--input v-model="formData.vin" placeholder="请输入VIN" border="none"></u--input>
				</u-form-item>
				<u-form-item label="车辆委托状态" prop="vin" :labelWidth="130" borderBottom>
					<u--input v-model="formData.vin" disabled disabledColor="#ffffff" placeholder="请输入VIN" border="none"></u--input>
				</u-form-item>
				<u-form-item label="驾驶座方向" prop="vin" :labelWidth="130" borderBottom>
					<u--input v-model="formData.vin" disabled disabledColor="#ffffff" placeholder="请输入VIN" border="none"></u--input>
				</u-form-item>
				<u-form-item label="颜色" prop="vin" :labelWidth="130" borderBottom>
					<u--input v-model="formData.vin" disabled disabledColor="#ffffff" placeholder="请输入VIN" border="none"></u--input>
				</u-form-item>
				<u-form-item label="监控设备号" prop="vin" :labelWidth="130" borderBottom>
					<u--input v-model="formData.vin" disabled disabledColor="#ffffff" placeholder="请输入VIN" border="none"></u--input>
				</u-form-item>
				<u-form-item label="拍照号码" prop="vin" :labelWidth="130" borderBottom>
					<u--input v-model="formData.vin" disabled disabledColor="#ffffff" placeholder="请输入VIN" border="none"></u--input>
				</u-form-item>
				<u-form-item label="委托管理日期" prop="vin" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('endTimeDate')">
						<u--input v-model="formData.endTimeDate" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="委托管理结束日期" prop="vin" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('endTimeDate')">
						<u--input v-model="formData.endTimeDate" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="保险开始日期" prop="vin" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('endTimeDate')">
						<u--input v-model="formData.endTimeDate" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="保险结束日期" prop="vin" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('endTimeDate')">
						<u--input v-model="formData.endTimeDate" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="牌照开始日期" prop="vin" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('endTimeDate')">
						<u--input v-model="formData.endTimeDate" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="牌照结束日期" prop="vin" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('endTimeDate')">
						<u--input v-model="formData.endTimeDate" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
			</u--form>
		</view>
		
		
		<view class="btn-box">
			<u-button @click="onCancel" color="#ccc" text="取消" shape="circle" customStyle="margin:10rpx 20rpx;"></u-button>
			<u-button @click="onSubmit" :loading="isBtnLoading" :disabled="isBtnLoading" color="#423bb3" text="确定" shape="circle" customStyle="margin:10rpx 20rpx;"></u-button>
		</view>
	</view>
</template>

<script>
	import {deepClone} from '@/lib/lib.js'
	import {statusOptions,driverDirectionOptions} from '../const.js'
	
	export default{
		name:'carinfo-edit-com', // 车辆信息新增和编辑表单
		props:{
			initialData:{ // 表单初始数据
				default(){
					return {}
				}
			}
		},
		data(){
			return {
				formData:this.initData(),
				isBtnLoading:false,
				statusOptions,
				driverDirectionOptions
			}
		},
		methods:{
			initData(){
				return deepClone(this.initialData)
			},
			onSubmit(){},
		}
	}
</script>

<style lang="scss" scoped>
	.page-carinfo-edit-com{
		height: 70vh;
		overflow: hidden;
		.carinfo-form-wrapper{
			position: relative; 
			height: 85%; 
			overflow: auto;
		}
		.btn-box{
			margin-top: 27rpx;
			display: flex;
		}
	}
</style>