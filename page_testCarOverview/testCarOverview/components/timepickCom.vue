<template>
	<view class="page-time-pick-com">
		<view class="time-pick-box">
			<view class="left-box">
				<view class="time-pick-item project-box" v-if="hasProject">
					<view class="label-item">所属项目</view>
					<com-hoc-dropdown-menu :listData="projectList" :initValue.sync="chosedProject" title="All" labelKey="project" 
						titleStyle="--fontSize:28rpx; --backgroundColor: transparent;"
						:titleColor="{chosedColor:'#303133',nochoseColor:'#303133'}"
						valueKey="project" descKey="project" @getChosedValues="getChosedValues"
					></com-hoc-dropdown-menu>
				</view>
				<view class="time-pick-item">
					<view class="label-item">开始时间</view>
					<view class="pick-item" @click="openTimePicker(startKey)">
						<u--input v-model="formData[startKey]" disabled disabledColor="transparent" placeholder="选择日期" border="none"></u--input>
					</view>
				</view>
				<view class="time-pick-item">
					<view class="label-item">结束时间</view>
					<view class="pick-item" @click="openTimePicker(endKey)">
						<u--input v-model="formData[endKey]" disabled disabledColor="transparent" placeholder="选择日期" border="none"></u--input>
					</view>
				</view>
			</view>
			<view class="right-box">
				<u-button type="primary" shape="circle" color="transparent" loadingMode="circle" :loading="isSearchBtnLoading" @click="onSearch">
					<u-icon name="search" color="#6970e2" size="38"></u-icon>
				</u-button>
			</view>
		</view>
		
		<u-datetime-picker v-if="timePickerShow" :show="timePickerShow" :mode="pickerMode"
			:value="Number(new Date())"
			@confirm="confirmTime"
			@cancel="datetimePickerClose"
			@close="datetimePickerClose"
			@click.stop.prevent
			@touchmove.stop.prevent
		></u-datetime-picker>
	</view>
</template>

<script>
	import moment from 'moment'
	import {mapState} from 'vuex'
	
	let curTimePickerName = ''
	const platObj = {
		'date':'YYYY-MM-DD',
		'datetime':'YYYY-MM-DD HH:mm:ss'
	}
	
	export default{
		name:'time-pick-com', // 时间选择组件
		props:{
			startKey:{ // 开始时间字段名
				default(){
					return 'starttime'
				}
			},
			endKey:{ // 结束时间字段名
				default(){
					return 'endtime'
				}
			},
			pickerMode:{ // 时间选择器类型 date datetime
				default(){
					return 'date'
				}
			},
			initParam:{ // 请求参数
				default(){
					return {}
				}
			},
			hasProject:{ // 是否开放项目选择
				default(){
					return false
				}
			},
		},
		computed: {
			...mapState({
				projectList: state => state.baseStore.projectList
			})
		},
		data(){
			return {
				formData:{...this.initParam},
				isSearchBtnLoading:false, // 搜素表格数据按钮loading
				timePickerShow:false, // 时间选择器
				chosedProject:[], // 所选择的项目
			}
		},
		methods:{
			openTimePicker(key){
				this.timePickerShow = true
				curTimePickerName = key
			},
			datetimePickerClose(){ // 关闭时间选择框
				this.timePickerShow = false
			},
			confirmTime(e){ // 确定选择时间
				const plat = platObj[this.pickerMode]
				this.formData[curTimePickerName] = moment(e.value).format(plat)
				
				this.datetimePickerClose()
				console.log(e,'------确定选择时间--------',this.formData[curTimePickerName])
			},
			onSearch(){ // 确认选择
				this.isSearchBtnLoading=true
				this.$emit('onConfirm',this.formData)
				console.log(this.formData,'this.formDatathis.formDatathis.formData')
			},
			stopLoading(){
				this.isSearchBtnLoading=false
			},
			getChosedValues(chosedArr){  // 得到所选项目
				this.formData.project = chosedArr.join(',')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-time-pick-com{
		.time-pick-box{
			display: flex;
			padding: 20rpx 40rpx;
			margin: 20rpx 30rpx 40rpx 30rpx;
			border-radius: 20rpx;
			background: linear-gradient(45deg, #c1c3f5, #a7beec);
			box-shadow: 0px 3px 11px 1px #d9dcd8;
			.left-box{
				flex: 1;
				.time-pick-item{
					display: flex;
					&:nth-child(1){
						margin-bottom: 20rpx;
					}
					.label-item{
						width: 145rpx;
						min-width: 145rpx;
						margin-right: 20rpx;
						letter-spacing: 2rpx;
					}
				}
				.project-box{
					margin-bottom: 8rpx !important;
				}
			}
			.right-box{
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>

<style lang="scss">
	.page-time-pick-com{
		.time-pick-box{
			.right-box{
				.u-button{
					&:before{
						background-color: transparent !important;
						border-color: transparent !important;
					}
				}
			}
		}
	}
</style>