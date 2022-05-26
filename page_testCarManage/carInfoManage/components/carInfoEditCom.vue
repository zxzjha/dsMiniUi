<template>
	<view class="page-carinfo-edit-com">
		<view class="carinfo-form-wrapper">
			<u--form :model="formData" ref="form">
				<u-form-item label="VIN" prop="vin" :labelWidth="130" borderBottom>
					<u--input v-model="formData.vin" placeholder="请输入VIN" border="none" 
						:disabled="Object.keys(initialData).length>=1" disabledColor="#e2e2e2"
					></u--input>
				</u-form-item>
				<u-form-item label="管理编码" prop="governingCode" :labelWidth="130" borderBottom>
					<u--input v-model="formData.governingCode" placeholder="请输入管理编码" border="none"></u--input>
				</u-form-item>
				<u-form-item label="项目号" prop="vehicleProject" :labelWidth="130" borderBottom>
					<com-hoc-dropdown-menu 
						:listData="projectList" 
						:initValue.sync="formData.vehicleProject" 
						title="请选择项目号" 
						labelKey="project" 
						valueKey="id" 
						descKey="project" 
						:iconShow="false"
						titleStyle="--fontSize:28rpx;--backgroundColor: #fff;"
					></com-hoc-dropdown-menu>
				</u-form-item>
				<u-form-item label="车辆归属人" prop="ownerId" :labelWidth="130" borderBottom>
					<com-hoc-dropdown-menu
					  :isAbleSearch="true"
						:listData="[{id:formData.ownerId||'',trueName:formData.ownerDesc||'',describeText:formData.ownerDesc||''}]"
						:initValue.sync="formData.ownerId" 
						title="请输入搜索关键字" 
						axiosRequestApiName="searchUserListOx" 
						valueKey="id" 
						labelKey="trueName" 
						descKey="describeText"
						titleStyle="--fontSize:28rpx;--backgroundColor: #fff;"
					></com-hoc-dropdown-menu>
				</u-form-item>
				<u-form-item label="被委托人" prop="governingUserId" :labelWidth="130" borderBottom>
					<com-hoc-dropdown-menu 
						:isAbleSearch="true" 
						:listData="[{id:formData.governingUserId||'',trueName:formData.governingUserDesc||'',describeText:formData.governingUserDesc||''}]"
						:initValue.sync="formData.governingUserId" 
						title="请输入搜索关键字"
						axiosRequestApiName="searchUserListOx"
						valueKey="id" 
						labelKey="trueName" 
						descKey="describeText"
						titleStyle="--fontSize:28rpx;--backgroundColor: #fff;"
					></com-hoc-dropdown-menu>
				</u-form-item>
				<u-form-item label="车辆委托状态" prop="status" :labelWidth="130" borderBottom>
					<com-hoc-dropdown-menu 
						:listData="statusOptions" 
						:initValue.sync="formData.status"
						title="请选择车辆委托状态"
						labelKey="label" 
						valueKey="value" 
						descKey="label" 
						:iconShow="false"
						titleStyle="--fontSize:28rpx;--backgroundColor: #fff;"
					></com-hoc-dropdown-menu>
				</u-form-item>
				<u-form-item label="驾驶座方向" prop="driverDirection" :labelWidth="130" borderBottom>
					<com-hoc-dropdown-menu 
						:listData="driverDirectionOptions" 
						:initValue.sync="formData.driverDirection"
						title="请选择驾驶座方向"
						labelKey="label" 
						valueKey="value" 
						descKey="label" 
						:iconShow="false"
						titleStyle="--fontSize:28rpx;--backgroundColor: #fff;"
					></com-hoc-dropdown-menu>
				</u-form-item>
				<u-form-item label="颜色" prop="color" :labelWidth="130" borderBottom>
					<u--input v-model="formData.color" placeholder="请输入颜色" border="none"></u--input>
				</u-form-item>
				<u-form-item label="监控设备号" prop="monitorID" :labelWidth="130" borderBottom>
					<u--input v-model="formData.monitorID" placeholder="请输入监控设备号" border="none"></u--input>
				</u-form-item>
				<u-form-item label="牌照号码" prop="licenseNumber" :labelWidth="130" borderBottom>
					<u--input v-model="formData.licenseNumber" placeholder="请输入牌照号码" border="none"></u--input>
				</u-form-item>
				<u-form-item label="委托管理日期" prop="entrustedStartTime" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('entrustedStartTime')">
						<u--input v-model="formData.entrustedStartTime" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="委托管理结束日期" prop="entrustedEndTime" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('entrustedEndTime')">
						<u--input v-model="formData.entrustedEndTime" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="保险开始日期" prop="insuranceStartTime" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('insuranceStartTime')">
						<u--input v-model="formData.insuranceStartTime" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="保险结束日期" prop="insuranceEndTime" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('insuranceEndTime')">
						<u--input v-model="formData.insuranceEndTime" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="牌照开始日期" prop="licenseStartTime" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('licenseStartTime')">
						<u--input v-model="formData.licenseStartTime" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
				<u-form-item label="牌照结束日期" prop="licenseEndTime" :labelWidth="130" borderBottom>
					<view class="form-date-line-left" @click="openTimePicker('licenseEndTime')">
						<u--input v-model="formData.licenseEndTime" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
				</u-form-item>
			</u--form>
		</view>
		
		<view class="btn-box">
			<u-button @click="onCancel" color="#ccc" text="取消" shape="circle" customStyle="margin:10rpx 20rpx;"></u-button>
			<u-button @click="onSubmit" :loading="isBtnLoading" :disabled="isBtnLoading" color="#423bb3" text="确定" shape="circle" customStyle="margin:10rpx 20rpx;"></u-button>
		</view>
		
		<u-datetime-picker v-if="timePickerShow" :show="timePickerShow" mode="datetime"
			:value="Number(new Date())"
			@confirm="conformTime"
			@cancel="datetimePickerClose"
			@close="datetimePickerClose"
		></u-datetime-picker>
	</view>
</template>

<script>
	import moment from 'moment'
	import apiLib from '@/api/api.js'
	import {mapState} from 'vuex'
	import {deepClone,isNotNil} from '@/lib/lib.js'
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
		computed: {
			...mapState({
				projectList: state => state.baseStore.projectList,
			})
		},
		data(){
			return {
				formData:this.initData(), // 表单数据
				isBtnLoading:false,
				curTimePickerValName:'', // 当前选择时间字段
				timePickerShow:false,
				statusOptions,
				driverDirectionOptions,
				rules:{  // 校验规则
					'vin':[
						{
							required: true,
							message: '请输入VIN',
							trigger: ['blur', 'change']
						}
					],
					'governingCode':[
						{
							required: true,
							message: '请输入管理编码',
							trigger: ['blur', 'change']
						}
					],
					'vehicleProject':[
						{
							required: true,
							message: '请选择项目号',
							// trigger: ['blur', 'change']
						}
					],
					'ownerId':[
						{
							required: true,
							message: '请选择车辆归属人',
							// trigger: ['blur', 'change']
						}
					],
					'governingUserId':[
						{
							required: true,
							message: '请选择被委托人',
							// trigger: ['blur', 'change']
						}
					],
					'status':[
						{
							required: true,
							message: '请选择车辆委托状态',
							// trigger: ['blur', 'change']
						}
					],
					'driverDirection':[
						{
							required: true,
							message: '请选择驾驶座方向',
							trigger: ['blur', 'change']
						}
					],
					'color':[
						{
							required: true,
							message: '请输入颜色',
							trigger: ['blur', 'change']
						}
					],
					'monitorID':[
						{
							required: true,
							message: '请输入监控设备号',
							trigger: ['blur', 'change']
						}
					],
					'licenseNumber':[
						{
							required: true,
							message: '请输入牌照号码',
							trigger: ['blur', 'change']
						}
					],
					'entrustedStartTime':[
						{
							required: true,
							message: '请选择日期',
							trigger: ['blur', 'change']
						}
					],
					'entrustedEndTime':[
						{
							required: true,
							message: '请选择日期',
							trigger: ['blur', 'change']
						}
					],
					'insuranceStartTime':[
						{
							required: true,
							message: '请选择日期',
							trigger: ['blur', 'change']
						}
					],
					'insuranceEndTime':[
						{
							required: true,
							message: '请选择日期',
							trigger: ['blur', 'change']
						}
					],
					'insuranceEndTime':[
						{
							required: true,
							message: '请选择日期',
							trigger: ['blur', 'change']
						}
					],
					'licenseStartTime':[
						{
							required: true,
							message: '请选择日期',
							trigger: ['blur', 'change']
						}
					],
					'licenseEndTime':[
						{
							required: true,
							message: '请选择日期',
							trigger: ['blur', 'change']
						}
					]
				},
			}
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$nextTick(()=>{
				this.$refs.form.setRules(this.rules)
			})
		},
		methods:{
			initData(){
				const hasInitialData = this.initialData && Object.keys(this.initialData).length>0
				if(hasInitialData){
					return deepClone(this.initialData)
				}else{
					return {
						vin:'',
						governingCode:'',
						vehicleProject:'',
						ownerId:'',
						governingUserId:'',
						status:'',
						driverDirection:'',
						color:'',
						monitorID:'',
						licenseNumber:'',
						entrustedStartTime:'',
						entrustedEndTime:'',
						insuranceStartTime:'',
						insuranceEndTime:'',
						licenseStartTime:'',
						licenseEndTime:''
					}
				}
			},
			onSubmit(){
				this.$refs.form.validate().then(async valid=>{
					if(valid){
						this.isBtnLoading = true
						
						const isModify = this.initialData && Object.keys(this.initialData).length>0
						const text = isModify?'编辑':'添加'
						
						const params = {
							...this.formData,
							owner:this.formData.ownerId || '',
							governingUser:this.formData.governingUserId || '',
							authorizedUser:this.formData.authorizedUser || [],
							isPublic:isNotNil(this.formData.isPublic)?this.formData.isPublic:true
						}
						
						if(isModify){
							params.createUser = this.formData.createUser && this.formData.createUser.id?this.formData.createUser.id:''
							params.lastModifyUser = this.formData.lastModifyUser && this.formData.lastModifyUser.id?this.formData.lastModifyUser.id:''
						}
						
						const res = await apiLib.updateVehicleInfoList(params,'POST',{errMessage:`车辆${text}失败，请稍后再试！`, hasErrMessage:true})
						
						if(res.isOk){ // 表单提交成功，主页面刷新数据
							// uni.$u.toast(`车辆${text}成功!`)
							this.$emit('refreshCarinfoList')
							this.$emit('closeFormModal')
						}else{
							// uni.$u.toast(`车辆${text}失败!`)
						}
						
						this.isBtnLoading = false
					}
				}).catch(err=>{
					// uni.$u.toast('表单校验失败')
					console.log(err,'borrowcar表单校验失败')
				})
			},
			onCancel(){
				this.$emit('closeFormModal')
			},
			openTimePicker(valName){ // 打开时间选择器
				this.curTimePickerValName = valName
				this.timePickerShow = true
			},
			conformTime(e){ // 确认选择时间
			// yyyy-MM-dd'T'HH:mm:ss.SSSSSSz   YYYY-MM-DD HH:mm:ss
				this.formData[this.curTimePickerValName] = moment(e.value).format("YYYY-MM-DD HH:mm:ss")
				this.datetimePickerClose()
			},
			datetimePickerClose(){ // 关闭时间选择器
				this.timePickerShow = false
			},
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