<template>
	<view class="page-chart-data-com">
		<time-picker-com
			ref="timepicker"
			startKey="starttime"
			endKey="endtime"
			pickerMode="date"
			:initParam="tDataParam"
			:hasProject="false"
			@onConfirm="onSearch"
		></time-picker-com>
		<overview-chart-com
			id="overview"
			ref="overviewchartcom"
			:chartNumArr="chartNumArr"
			:canvasIdArr="['carinfochart1','carinfochart2','carinfochart3']"
			:distanceChartData="distanceChartData"
			:drivetimeChartData="drivetimeChartData"
			:speedgreaterChartData="speedgreaterChartData"
		></overview-chart-com>
	</view>
</template>

<script>
	import overviewChartCom from '@/page_testCarOverview/testCarOverview/components/overviewChartCom.vue'
	import timePickerCom from '../../../components/timepickCom.vue'
	
	export default{
		name:'page-chart-data-com', // 数据概览
		components:{
			'overview-chart-com':overviewChartCom,
			'time-picker-com':timePickerCom
		},
		props:{
			distanceChartData:{ //所有车辆驾驶总里程总览
				default(){
					return {categories: [], series: [{data:[]}]}
				}
			},
			drivetimeChartData:{ //所有车辆驾驶总时长总览
				default(){
					return {categories: [], series: [{data:[]}]}
				}
			},
			speedgreaterChartData:{ //所有车辆驾不同驶速度的时长分布统计
				default(){
					return {categories: [], series: [{data:[]}]}
				}
			},
			initParam:{ // 请求参数
				default(){
					return {}
				}
			},
			chartNumArr:{
				default(){
					return [
						[   
							{
								id:'distancceNum',
								label:'驾驶里程总计 (Km)',
								value:'--'
							},
							{
								id:'drivetimeNum',
								label:'驾驶时长总计 (h)',
								value:'--'
							},
						],
						[
							{
								id:'speedgreater10timeNum',
								label:'速度大于10的时长总计 (h)',
								value:'--'
							},
							{
								id:'speedgreater80timeNum',
								label:'速度大于80的时长总计 (h)',
								value:'--'
							}
						]
					]
				}
			}
		},
		data(){
			return {
				tDataParam:{...this.initParam}
				// tDataParam:{ // getTDataDayRes 请求的params
				// 	starttime:moment().startOf('month').format('YYYY-MM-DD'),
				// 	endtime:moment().endOf('month').format('YYYY-MM-DD')
				// },
			}
		},
		methods:{
			onSearch(timeObj){
				this.tDataParam = {
					...this.tDataParam,
					starttime:timeObj.starttime,
					endtime:timeObj.endtime
				}
				
				this.$emit('refreshChart',this.tDataParam)
				console.log(timeObj,'timeObj',this.tDataParam)
			},
			stopLoadinng(){
				this.$refs.timepicker.stopLoading()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-chart-data-com{
		
	}
</style>