<template>
	<view class="page-overview-chart-com">
		<view class="chart-wrapper">
			<view class="chart-item-box">
				<view class="chart-title">车辆驾驶里程总览<text class="unit-item">( Km )</text>
				</view>
				<view class="chart-content">
					<qiun-data-charts type="area" :canvas2d="true" canvasId="canvasColumn3" :ontouch="true"
						:disableScroll="true" :inScrollView="true" :chartData="distanceChartData" :opts="distanceopts"
					></qiun-data-charts>
				</view>
			</view>
			
			<view class="chart-item-box">
				<view class="chart-title">车辆驾驶时长总览<text class="unit-item">( h )</text>
				</view>
				<view class="chart-content">
					<qiun-data-charts type="column" :canvas2d="true" canvasId="canvasColumn2" :ontouch="true"
						:disableScroll="true" :inScrollView="true" :chartData="drivetimeChartData" :opts="columopts"
					></qiun-data-charts>
				</view>
			</view>
			
			<view class="chart-item-box">
				<view class="chart-title">不同速度的时长分布<text class="unit-item">( h )</text>
				</view>
				<view class="chart-content">
					<qiun-data-charts type="area" :canvas2d="true" canvasId="canvasColumn5" :ontouch="true"
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
		},
		data(){
			return {
				columopts:ChartOptsManager.getColumnOpts(),
				distanceopts:ChartOptsManager.getAreaOpts(),
				speedgreateropts:ChartOptsManager.getAreaOpts({showLegend:true}),
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.page-overview-chart-com{
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