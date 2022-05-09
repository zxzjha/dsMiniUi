<template>
	<view class="page-borrow-form-com">
		<u--form :model="formData" ref="form">
			<u-form-item label="VIN" prop="vin" :labelWidth="120" borderBottom>
				<u--input v-model="formData.vin" disabled disabledColor="#ffffff" placeholder="请输入VIN" border="none"></u--input>
			</u-form-item>
			<u-form-item label="借车开始时间" prop="startTimeDate" :labelWidth="120" borderBottom>
				<view class="form-date-line">
					<view class="form-date-line-left" @click="openTimePicker('startTimeDate')">
						<u--input v-model="formData.startTimeDate" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
					<view class="form-date-line-right" @click="openTimePicker('startTimeHour')">
						<u--input v-model="formData.startTimeHour" disabled disabledColor="#ffffff" placeholder="选择时间" border="none"></u--input>
					</view>
				</view>
			</u-form-item>
			<u-form-item label="预计归还时间" prop="endTimeDate" :labelWidth="120" borderBottom>
				<view class="form-date-line">
					<view class="form-date-line-left" @click="openTimePicker('endTimeDate')">
						<u--input v-model="formData.endTimeDate" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
					</view>
					<view class="form-date-line-right" @click="openTimePicker('endTimeHour')">
						<u--input v-model="formData.endTimeHour" disabled disabledColor="#ffffff" placeholder="选择时间" border="none"></u--input>
					</view>
				</view>
			</u-form-item>
			<u-form-item label="联系电话" prop="phonum1" :labelWidth="120" borderBottom ref="item1">
				<u--input v-model="formData.phonum1" placeholder="请输入联系电话" border="none"></u--input>
			</u-form-item>
			<u-form-item label="备份联系方式" prop="phonum2" :labelWidth="120" borderBottom ref="item2">
				<u--input v-model="formData.phonum2" placeholder="请输入备份联系方式" border="none"></u--input>
			</u-form-item>
			<u-form-item label="借用目的" prop="purpose" :labelWidth="120" borderBottom>
				<u--textarea v-model="formData.purpose" :height="25" :autoHeight="true" placeholder="请输入借用目的" border="none"></u--textarea>
			</u-form-item>
			<u-form-item label="使用地点" prop="location" :labelWidth="120" borderBottom>
				<u--input v-model="formData.location" placeholder="请输入使用地点" border="none"></u--input>
			</u-form-item>
			<u-form-item label="供应商" prop="supplier" :labelWidth="120" borderBottom>
				<u--input v-model="formData.supplier" placeholder="请输入供应商" border="none"></u--input>
			</u-form-item>
		</u--form>
		
		<view class="btn-box">
			<u-button @click="onSubmit" :loading="isBtnLoading" :disabled="isBtnLoading" color="#423bb3" text="确定" shape="circle"></u-button>
		</view>
		
		<u-datetime-picker v-if="timePickerShow" :show="timePickerShow" :mode="calcMode(curTimePickerValName)"
			:minMinute="0"
			:maxMinute="0"
			:minHour="8"
			:maxHour="16"
			:value="calcMode(curTimePickerValName)==='date'?Number(new Date()):''"
			@confirm="conformTime"
			@cancel="datetimePickerClose"
			@close="datetimePickerClose"
		></u-datetime-picker>
	</view>
</template>

<script>
	import moment from 'moment'
	import apiLib from '@/api/api.js'
	import {deepClone,isNil} from '@/lib/lib.js'
	
	export default {
		name:'borrow-form-com',
		data() {
			return {
				formData:{vin:'',startTimeDate:'',startTimeHour:'',endTimeDate:'',endTimeHour:'',phonum1:'', phonum2:'', purpose:'', location:'', supplier:''},
				timePickerShow:false,
				curTimePickerValName:'', // 当前选择时间字段
				isBtnLoading:false,
				rules:{ // 校验规则
					'startTimeDate':[
						{
							required: true,
							message: '请选择借车开始时间',
							trigger: ['blur', 'change']
						}
					],
					'endTimeDate':{
						required: true,
						message: '请选择预计归还时间',
						trigger: ['blur', 'change']
					},
					'phonum1':[
						{
							required: true,
							message: '请输入联系电话',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								console.log(value,uni.$u.test.mobile(value))
								return uni.$u.test.mobile(value)
							},
							message: '手机号码不正确',
							trigger: ['change','blur'],
						}
					], 
					'phonum2':[
						{
							required: false,
							message: '请输入备份联系方式',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change','blur'],
						}
					], 
					'purpose':{
						required: true,
						message: '请输入借用目的',
						trigger: ['blur', 'change']
					}, 
					'location':{
						required: true,
						message: '请输入使用地点',
						trigger: ['blur', 'change']
					}, 
					'supplier':{
						required: false,
						message: '请输入供应商',
						trigger: ['blur', 'change']
					}
				},
				eventChannel:null,
			}
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
				const {id,vin,checkedTime} = data.borrowFormData
				const start = checkedTime[0]?[checkedTime[0].slice(0,10),checkedTime[0].slice(-8)]:[]
				const end = checkedTime[1]?[checkedTime[1].slice(0,10),checkedTime[1].slice(-8)]:[]
				
				this.formData = {
					id,
					vin,
					vehicle:id,
					startTimeDate:start[0] || '',
					startTimeHour:start[1] || '',
					endTimeDate:end[0] || '',
					endTimeHour:end[1] || '',
					phonum1:'', 
					phonum2:'', 
					purpose:'', 
					location:'', 
					supplier:''
				}
				console.log(this.formData,'pushInitData')
			})
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则			this.$nextTick(()=>{
				this.$refs.form.setRules(this.rules)
			})
		},
		methods: {
			onSubmit(){
				this.$refs.form.validate().then(async valid=>{
					if(valid){
						if(isNil(this.formData.startTimeDate) || isNil(this.formData.startTimeHour)){
							uni.$u.toast('请选择借车开始时间！')
							return
						}
						if(isNil(this.formData.endTimeDate) || isNil(this.formData.endTimeHour)){
							uni.$u.toast('请选择预计归还时间！')
							return
						}
						
						const params = {
							...this.formData,
							startTime:`${this.formData.startTimeDate} ${this.formData.startTimeHour}`,
							endTime:`${this.formData.endTimeDate} ${this.formData.endTimeHour}`
						}
						
						if(this.isExpire(params.startTime) || this.isExpire(params.endTime)){
							uni.$u.toast('所选时间需晚于当前时间，请重新选择！')
							return
						}
						
						if(moment(params.endTime).valueOf() <= moment(params.startTime).valueOf()){
							uni.$u.toast('预计归还时间应当晚于借车开始时间，请重新选择！')
							return
						}
						
						this.isBtnLoading = true
						
						const res = await apiLib.createBorrowOrder(params,'POST',{errMessage:'预约出错了，请稍后再试！', hasErrMessage:true})
						console.log(res,'createBorrowOrder')
						if(res.isOk){ // 表单提交成功，返回借车主页并向其传递数据
							uni.$u.toast('预约成功!')
							this.PassData({...params})
							this.toOrderListPage()
							// uni.navigateBack({
							// 	delta:1
							// })
						}else{
							uni.$u.toast('预约失败!')
						}
						
						this.isBtnLoading = false
					}
				}).catch(err=>{
					// uni.$u.toast('表单校验失败')
					console.log(err,'borrowcar表单校验失败')
				})
			},
			toOrderListPage(){ // 关闭当前页，去我的借车列表页
				uni.redirectTo({
					url: '/page_myApplycation/subPages/carBorrowApplication/carBorrowOrderList/carBorrowOrderList'
				})
			},
			openTimePicker(valName){ // 打开时间选择器
				this.curTimePickerValName = valName
				this.timePickerShow = true
			},
			conformTime(e){ // 确认选择时间
				if(e.mode==='date'){
					this.formData[this.curTimePickerValName] = moment(e.value).format('YYYY-MM-DD')
				}else{
					const time = e.value?[e.value.split(':')[0],'00','00'].join(':'):''
					this.formData[this.curTimePickerValName] = time
				}
				
				this.datetimePickerClose()
			},
			datetimePickerClose(){ // 关闭时间选择器
				this.timePickerShow = false
			},
			calcMode(valName){
				return ['startTimeDate','endTimeDate'].includes(valName)?'date':'time'
			},
			PassData(data){ // 向上级页面传送数据
				this.eventChannel.emit('getFormData', {data: deepClone(data)});
			},
			isExpire(t){ // 判断时间是否过期
				return moment(t).valueOf() <= moment().valueOf()
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-borrow-form-com{
	padding: 10rpx 25rpx;
	.form-date-line{
		display: flex;
	}
	.btn-box{
		margin-top: 200rpx;
	}
}
</style>

<style lang="scss">
.page-borrow-form-com{
	.u-form{
		.u-form-item{
			.u-form-item__body{
				// align-items: baseline;
				.u-form-item__body__right{
					.u-textarea{
						padding-left: 0;
					}
				}
			}
		}
	}
}
</style>
