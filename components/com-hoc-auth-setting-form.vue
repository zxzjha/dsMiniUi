<template>
	<view class="com-hoc-auth-setting-form">
		<view class="form-wrapper">
			<view class="auth-form-wrapper">
				<u--form :model="formData" ref="form" labelPosition="top">
					<u-form-item label="是否公开" prop="isPublic" labelWidth="200" borderBottom>
						<u-switch v-model="formData.isPublic" activeColor="#423bb3"></u-switch>
					</u-form-item>
					<u-form-item v-if="!formData.isPublic" label="请选择给予权限的用户" prop="status" labelWidth="200" borderBottom>
						<view class="com-box" style="height: 40vh;overflow: auto;transform: translateX(-90rpx);">
							<com-hoc-tree
								:treeData="departUserList"
								:propKeys="{ children: 'children', id: 'id', parentId:'departmentId',label: 'name' }"
								:defaultValue.sync="formData.authorizedUser"
								@getValues="getValues"
							></com-hoc-tree>
						</view>
					</u-form-item>
				</u--form>
			</view>
		</view>
		
		<view class="btn-box">
			<u-button @click="onCancel" color="#ccc" text="取消" shape="circle" customStyle="margin:10rpx 20rpx;"></u-button>
			<u-button @click="onSubmit" :loading="isBtnLoading" :disabled="isBtnLoading" color="#423bb3" text="确定" shape="circle" customStyle="margin:10rpx 20rpx;"></u-button>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {deepClone,treeToList} from '@/lib/lib.js'
	
	export default{
		name:'com-hoc-auth-setting-form', // 通用权限配置表单
		props:{
			initialData:{
				default(){
					return {authorizedUser:[],isPublic:true}
				}
			}
		},
		computed:{
			...mapState({
				departUserList: state => state.baseStore.departUserList
			})
		},
		async mounted() {
			console.log('mounted---com-hoc-auth-setting-form')
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.form.setRules(this.rules)
		},
		data(){
			return {
				formData:deepClone(this.initialData),
				isBtnLoading:false,
				rules:{  // 校验规则
					'isPublic':[
						{
							required: true,
							message: '请选择是否公开',
						}
					]
				}
			}
		},
		methods:{
			onSubmit(){
				this.$refs.form.validate().then(async valid=>{
					if(valid){
						if(!this.formData.isPublic && this.formData.authorizedUser.length<=0){
							uni.$u.toast('请先选择要基于权限的用户')
							return
						}
						
						const params = {
							...this.formData,
							authorizedUser:this.formData.authorizedUser.filter(i=>typeof i == 'number')
						}
						
						console.log(this.formData,'=======params=====')
						
						this.isBtnLoading = true
						this.$emit('onSubmit',params)
						
						// 父组件需要关闭loading
					}
				}).catch(err=>{
					// uni.$u.toast('表单校验失败')
					console.log(err,'borrowcar表单校验失败')
				})
			},
			endLoading(){
				this.isBtnLoading = false
			},
			onCancel(){
				this.$emit('closeModal')
			},
			getValues(vals){
				console.log(vals,'auth')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.com-hoc-auth-setting-form{
		// height: 70vh;
		max-height: 70vh;
		width: 100%;
		overflow: hidden;
		.form-wrapper{
			height: 85%;
			display: flex;
			justify-content: center;
			overflow: hidden;
		}
		.btn-box{
			display: flex;
			margin-top: 44rpx;
		}
	}
</style>