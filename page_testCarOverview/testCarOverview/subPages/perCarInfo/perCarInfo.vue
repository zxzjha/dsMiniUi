<template>
	<view class="page-per-car-info">
		<view class="tab-box">
			<view :class="['tab-item',item.id==curPageId?'active-item':'']" v-for="item in pageList" :key="item.id" :id="item.id" @click="onChangeTab(item.id)"
			>
				{{item.name}}
			</view>
		</view>
		<view class="content-wrapper">
			<scroll-view :scroll-y="true" :style="{height:`${windowHeight-100}px`}">
				<template v-if="curPageId==1">
					<car-map-com :terminalcode="terminalcode"></car-map-com>
				</template>
				<template v-if="curPageId==2">
					<chart-data-com
						ref="chartcom"
						:initParam="tDataParam"
						:chartNumArr="chartNumArr"
						:distanceChartData="distanceChartData"
						:drivetimeChartData="drivetimeChartData"
						:speedgreaterChartData="speedgreaterChartData"
						@refreshChart="refreshChart"
					></chart-data-com>
				</template>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import apiLib from '@/api/api.js'
	import chartDataCom from './components/chartDataCom.vue'
	import carMapCom from './components/carMapCom.vue'
	
	export default{
		name:'per-car-info', // 单车详情
		components:{
			'chart-data-com':chartDataCom,
			'car-map-com':carMapCom
		},
		data(){
			return {
				terminalcode:'', // 53810826487
				curPageId:1,
				windowHeight:600,
				pageList:[{id:1,name:'历史轨迹'},{id:2,name:'数据概览'}],
				chartNumArr:[], // 数据统计大数字
				distanceChartData:{categories: [], series: [{data:[]}]}, //所有车辆驾驶总里程总览
				drivetimeChartData:{categories: [], series: [{data:[]}]}, //所有车辆驾驶总时长总览
				speedgreaterChartData:{categories: [], series: [{data:[]}]}, //所有车辆驾不同驶速度的时长分布统计
				tDataParam:{ // getTDataDayRes 请求的params
					starttime:moment().startOf('month').format('YYYY-MM-DD'),
					endtime:moment().endOf('month').format('YYYY-MM-DD')
				}
			}
		},
		created(){
			this.windowHeight = uni.getSystemInfoSync().windowHeight
			console.log(uni.getSystemInfoSync(),'-----uni.getSystemInfoSync()----')
		},
		onLoad(option) {
		  // #ifdef APP-NVUE
		  const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
		  // #endif
		  // #ifndef APP-NVUE
		  const eventChannel = this.getOpenerEventChannel();
		  // #endif
			
		  // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
		  eventChannel.on('pushInitData',async (data)=>{
				this.terminalcode = data.terminalcode
				this.tDataParam.terminalcode = data.terminalcode
				
				await this.getTDataDayRes()
			})
			
		},
		methods:{
			onChangeTab(id){
				this.curPageId = id
			},
			async getTDataDayRes(){ //获取日统计接口
				const res = await apiLib.getTDataDayRes(this.tDataParam)
				console.log(res,'ggggggggggggg',this.tDataParam)
				if(res.isOk){
					this.distanceChartData = res.chartData.distancceObj
					this.drivetimeChartData = res.chartData.drivetimeObj
					this.speedgreaterChartData = res.chartData.speedgreaterObj
					
					this.chartNumArr = res.chartNumArr
				}
			},
			async refreshChart(data){
				this.tDataParam={
					...this.tDataParam,
					starttime:data.starttime,
					endtime:data.endtime
				}
				
				await this.getTDataDayRes()
				
				this.$refs.chartcom.stopLoadinng()
				console.log(data,'refreshChart')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-per-car-info{
		.tab-box{
			position: sticky;
			top: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 34rpx;
			.tab-item{
				margin:0 40rpx;
				transition: all 0.3s ease-in;
			}
			.active-item{
				color: #6970e2;
				font-size: 40rpx;
				font-weight: bold;
			}
		}
		.content-wrapper{
		}
	}
</style>

<style lang="scss">
	.page-per-car-info{
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