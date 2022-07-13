<template>
	<view class="page-overview-chart-com">
		<view class="chart-num-box">
			<view class="chart-num-line" v-for="(block,index) in chartNumArr" :key="index" :id="index">
				<view class="chart-num-item" v-for="item in block" :key="item.id" :id="item.id">
					<view class="chart-num-item-value">{{item.value}}</view>
					<view class="chart-num-item-title">{{item.label}}</view>
				</view>
			</view>
		</view>
		<view class="chart-wrapper">
			<view class="chart-item-box">
				<view class="chart-title">车辆驾驶里程总览<text class="unit-item">( Km )</text>
				</view>
				<view class="chart-content">
					<qiun-data-charts type="area" :canvas2d="true" :canvasId="canvasIdArr[0]" :ontouch="true"
						:disableScroll="true" :inScrollView="true" :chartData="distanceChartData" :opts="distanceopts"
					></qiun-data-charts>
				</view>
			</view>
			
			<view class="chart-item-box">
				<view class="chart-title">车辆驾驶时长总览<text class="unit-item">( h )</text>
				</view>
				<view class="chart-content">
					<qiun-data-charts type="column" :canvas2d="true" :canvasId="canvasIdArr[1]" :ontouch="true"
						:disableScroll="true" :inScrollView="true" :chartData="drivetimeChartData" :opts="columopts"
					></qiun-data-charts>
				</view>
			</view>
			
			<view class="chart-item-box">
				<view class="chart-title">不同速度的时长分布<text class="unit-item">( h )</text>
				</view>
				<view class="chart-content">
					<qiun-data-charts type="area" :canvas2d="true" :canvasId="canvasIdArr[2]" :ontouch="true"
						:disableScroll="true" :inScrollView="true" :chartData="speedgreaterChartData" :opts="speedgreateropts"
					></qiun-data-charts>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {ChartOptsManager} from '@/lib/chartOpts/chartOpts.js'
	
	export default{
		name:'page-overview-chart-com',
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
			canvasIdArr:{
				default(){
					return ['overviewchart1','overviewchart2','overviewchart3']
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
			console.log(this.chartNumArr,'chartNumArr----overviewChartCom')
			return {
				chartNumData:this.initChartNumArr(),
				columopts:ChartOptsManager.getColumnOpts(),
				distanceopts:ChartOptsManager.getAreaOpts(),
				speedgreateropts:ChartOptsManager.getAreaOpts({showLegend:true}),
			}
		},
		methods:{
			initChartNumArr(){
				if(this.chartNumArr.length<=0){
					const arr = [
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
					return arr
				}else{
					return this.chartNumArr
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-overview-chart-com{
		.chart-num-box{
			padding: 20rpx 0;
			margin: 10rpx 38rpx 34rpx;
			border-radius: 14rpx;
			box-shadow: 0 0 19rpx #ccc;
			.chart-num-line{
				display: flex;
				justify-content: space-around;
				align-items: center;
				&:nth-child(1){
					margin-bottom: 20rpx;
				}
				.chart-num-item{
					display: flex;
					flex-direction: column;
					align-items: center;
					.chart-num-item-value{
						font-size: 40rpx;
						font-weight: bold;
					}
					.chart-num-item-title{
						font-size: 24rpx;
						color: #888;
					}
				}
			}
		}
		.chart-wrapper{
			padding: 20rpx 0;
			.chart-item-box{
				.chart-title{
					padding-left: 45rpx;
					padding-bottom: 20rpx;
					margin-bottom: 20rpx;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 40rpx;
					font-weight: bold;
					color: #333;
					.unit-item{
						padding-left: 20rpx;
						font-size: 32rpx;
					}
				}
				.chart-content{
					min-height:200rpx;
					margin-bottom: 60rpx;
				}
			}
		}
	}
</style>