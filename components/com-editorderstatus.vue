<template>
	<view class="com-edit-order-status">
		<u--form :model="formData" :rules="rules" ref="form" :borderBottom="false">
			<template v-if="formType==='verify'">
				<u-form-item label="是否审核通过" prop="status" labelWidth="auto" :borderBottom="false">
					<u-radio-group v-model="formData.status" placement="row">
						<u-radio label="通过" name="BOOKING_APPROVED"></u-radio>
						<u-radio label="不通过" name="BOOKING_REJECT"></u-radio>
					</u-radio-group>
				</u-form-item>
			</template>
			
			<template v-if="formType==='orderdelay'">
				<u-form-item label="借车开始时间" prop="" labelWidth="auto" :borderBottom="false">
					<text>{{initialData.startTime || '--'}}</text>
				</u-form-item>
				<u-form-item label="借车结束时间" prop="" labelWidth="auto" :borderBottom="false">
					<text>{{initialData.endTime || '--'}}</text>
				</u-form-item>
				<u-form-item label="提车时间延至" prop="delayTimeDate" labelWidth="auto" :borderBottom="false">
					<view class="form-date-line">
						<view class="form-date-line-left" @click="openTimePicker('delayTimeDate')">
							<u--input v-model="formData.delayTimeDate" disabled disabledColor="#ffffff" placeholder="选择日期" border="none"></u--input>
						</view>
						<view class="form-date-line-right" @click="openTimePicker('delayTimeHour')">
							<u--input v-model="formData.delayTimeHour" disabled disabledColor="#ffffff" placeholder="选择时间" border="none"></u--input>
						</view>
					</view>
				</u-form-item>
				</u-form-item>
			</template>
			
			<u-form-item label="备注" prop="desc" labelWidth="auto" :borderBottom="false">
				<u--textarea v-model="formData.desc" :height="25" :autoHeight="true" placeholder="请输入备注" border="none"></u--textarea>
			</u-form-item>
			
			<u-datetime-picker v-if="timePickerShow" :show="timePickerShow" :mode="calcMode(curTimePickerValName)"
				:minMinute="0"
				:maxMinute="0"
				:minHour="8"
				:maxHour="16"
				:value="calcMode(curTimePickerValName)==='date'?Number(new Date()):''"
				@confirm="datetimePickerConform"
				@cancel="datetimePickerClose"
				@close="datetimePickerClose"
			></u-datetime-picker>
		</u--form>
		
		<view class="btn-box">
			<view class="btn-item">
				<u-button text="取消" :disabled="isBtnLoading" shape="circle" @click="onCancel"></u-button>
			</view>
			<view class="btn-item">
				<u-button color="#423bb3" text="确定" shape="circle" :loading="isBtnLoading" @click="onSure"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import apiLib from '@/api/api.js'
	import {isNil} from '@/lib/lib.js'
	
	export default {
		name:'com-edit-order-status', // 修改订单状态表单
		props:{
			initialData:{
				default(){
					return {}
				}
			},
			formType:{ 
				default(){
					return ''
				}
			}
		},
		data(){
			return {
				formData:{status:'',delayTimeDate:''},
				timePickerShow:false,
				isBtnLoading:false,
				curTimePickerValName:'',
				rules:{
					'status': {
						required: true,
						message: '请选择是否审核通过',
						trigger: ['blur', 'change']
					},
					'delayTimeDate':[
						{
							required: true,
							message: '请选择提车时延',
							trigger: ['blur', 'change']
						}
					],
				},
				subTypeObj:{
					'verify':this.onVerifySub, // BOOKING_REJECT, BOOKING_APPROVED,
					'getcar':this.onGetCarSub, // PICKUP_DONE
					'returncar':this.onReturnCarSub, // RETURN_DONE
					'orderdelay':this.onDelaySub, // PICKUP_DELAY
				}
			}
		},
		methods:{
			onSure(){
				this.subTypeObj[this.formType]()
			},
			async onSubmit(subInfo){ // 提交表单
				this.isBtnLoading = true
				
				const res = await apiLib.editOrderStatus(subInfo.params,'POST',{errMessage:subInfo.errMessage, hasErrMessage:true})
				
				if(res.isOk){
					// this.$emit('getSubRes',subInfo.params.status || '')
					this.$emit('getSubRes',subInfo.params)
					this.formData = {status:'',delayTimeDate:''}
				}
				
				this.isBtnLoading = false
			},
			openTimePicker(valName){ // 打开时间选择器
				this.curTimePickerValName = valName
				this.timePickerShow = true
			},
			datetimePickerConform(e){ // 确认选择时间
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
			onVerifySub(){ // 审核预约
				this.$refs.form.validate().then(async valid=>{
					if(valid){
						const params = {
							id:this.initialData.id,
							status:this.formData.status || '',
							desc:this.formData.desc || '',
						}
						
						this.onSubmit({
							params,
							successMessage:'预约审核成功！',
							errMessage:'预约审核出错了，请稍后再试！'
						})
						
						
					}
				}).catch(err=>{
					// uni.$u.toast('表单校验失败')
					console.log(err,'2323')
				})
			},
			onGetCarSub(){ // 成功提车
				this.$refs.form.validate().then(async valid=>{
					if(valid){
						const params = {
							id:this.initialData.id,
							status:'PICKUP_DONE',
							desc:this.formData.desc || '',
						}
						
						this.onSubmit({
							params,
							successMessage:'提车成功！',
							errMessage:'提车出错了，请稍后再试！'
						})
					}
				}).catch(err=>{
					// uni.$u.toast('表单校验失败')
					console.log(err,'2323')
				})
			},
			onReturnCarSub(){ // 还车
				this.$refs.form.validate().then(async valid=>{
					if(valid){
						const params = {
							id:this.initialData.id,
							status:'RETURN_DONE',
							desc:this.formData.desc || '',
						}
						
						this.onSubmit({
							params,
							successMessage:'还车成功！',
							errMessage:'还车出错了，请稍后再试！'
						})
					}
				}).catch(err=>{
					// uni.$u.toast('表单校验失败')
					console.log(err,'2323')
				})
			},
			onDelaySub(){ // 延迟提车
				this.$refs.form.validate().then(async valid=>{
					if(valid){
						if(isNil(this.formData.delayTimeDate) || isNil(this.formData.delayTimeHour)){
							uni.$u.toast('请选择提车延迟时间！')
							return
						}
						const params = {
							id:this.initialData.id,
							status:'PICKUP_DELAY',
							desc:this.formData.desc || '',
							delayTime:`${this.formData.delayTimeDate} ${this.formData.delayTimeHour}`
						}
						
						const start = moment(this.initialData.startTime).valueOf()
						const end = moment(this.initialData.endTime).valueOf()
						const delay = moment(params.delayTime).valueOf()
						const isBetween = (delay > start) && (delay < end)
						if(!isBetween){ // 所选时间要在借车时间范围内
							uni.$u.toast('所选时间要在借车时间范围内！')
							return
						}
						
						this.onSubmit({
							params,
							successMessage:'延时提车成功！',
							errMessage:'延时提车出错了，请稍后再试！'
						})
					}
				}).catch(err=>{
					// uni.$u.toast('表单校验失败')
					console.log(err,'2323')
				})
			},
			onCancel(){
				this.$emit('closeModal')
				this.formData = {status:'',delayTimeDate:''}
			},
			calcMode(valName){
				return ['delayTimeDate'].includes(valName)?'date':'time'
			},
		}
	}
</script>

<style lang="scss" scoped>
	.com-edit-order-status{
		.form-date-line{
			display: flex;
		}
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
</style>
