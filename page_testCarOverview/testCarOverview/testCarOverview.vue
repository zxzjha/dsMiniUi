<template>
	<view class="page-test-car-overview">
		<view class="map-wrapper">
			<map class="map-item" id="map" :subkey="subkey" layer-style="2" :latitude="latitude"
				:longitude="longitude" :scale="8" :show-location="true" :enable-overlooking="true"
				@regionchange="debounceRegionchange" @updated="updated" @markertap="onMarkerTap"
			>
				<view class="car-arcbar-box" style="width:120rpx;height:120rpx;">
					<qiun-data-charts type="arcbar" :canvas2d="true" canvasId="circleDataColumn1"
					:disableScroll="true" :chartData="circleData" :opts="arcbaropts"
					@complete="totalItemShow=true" :loadingType="0"
					></qiun-data-charts>
					<view v-if="totalItemShow" class="total-item">共 {{total||'--'}} 辆</view>
					<view v-if="totalItemShow" class="change-marker-box">
						<text v-if="curMarkerType=='all'" class="custom-icon touch-icon-style" @click="showOnline('zaixixan')">&#xe668;</text>
						<text v-if="curMarkerType=='zaixixan'" class="custom-icon touch-icon-style" @click="showOffline('lixian')">&#xe648;</text>
						<text v-if="curMarkerType=='lixian'" class="custom-icon touch-icon-style" @click="showAll('all')">&#xe645;</text>
					</view>
				</view>
			</map>
		</view>
		
		<com-hoc-touchbox class="touch-box-wrapper" v-if="touchboxShow" ref="touchBox" :disable="isTouchDisable" 
			customStyle="padding-top:15rpx;margin: 0 10rpx;border-radius:10px 10px 0 0;"
			:initTop="initTop" minTop="100" maxTop="100" @get-end-detail="getEndDetail"
			@click.stop.prevent
		>
			<view class="touch-wrapper" @click.stop.prevent>
				<!-- <view class="time-pick-box">
					<view class="left-box">
						<view class="time-pick-item">
							<view class="label-item">开始时间</view>
							<view class="pick-item" @click="openTimePicker('starttime')">
								<u--input v-model="tDataParam.starttime" disabled disabledColor="transparent" placeholder="选择日期" border="none"></u--input>
							</view>
						</view>
						<view class="time-pick-item">
							<view class="label-item">结束时间</view>
							<view class="pick-item" @click="openTimePicker('endtime')">
								<u--input v-model="tDataParam.endtime" disabled disabledColor="transparent" placeholder="选择日期" border="none"></u--input>
							</view>
						</view>
					</view>
					<view class="right-box">
						<u-button type="primary" shape="circle" color="transparent" loadingMode="circle" :loading="isSearchBtnLoading" @click="onSearchChartData">
							<u-icon name="search" color="#6970e2" size="38"></u-icon>
						</u-button>
					</view>
				</view> -->
				
				<time-picker-com
					ref="overviewtimepicker"
					startKey="starttime"
					endKey="endtime"
					pickerMode="date"
					:initParam="tDataParam"
					:hasProject="false"
					@onConfirm="onSearch"
				></time-picker-com>
				
				<scroll-view :scroll-y="isScrollY" :style="{height:`${windowHeight-220}px`}">
					<overview-chart-com
						id="overview"
						ref="overviewchartcom"
						:chartNumArr="chartNumArr"
						:distanceChartData="distanceChartData"
						:drivetimeChartData="drivetimeChartData"
						:speedgreaterChartData="speedgreaterChartData"
					></overview-chart-com>
				</scroll-view>
				
				<u-datetime-picker v-if="timePickerShow" :show="timePickerShow" mode="date"
					:value="Number(new Date())"
					@confirm="conformTime"
					@cancel="datetimePickerClose"
					@close="datetimePickerClose"
					@click.stop.prevent
					@touchmove.stop.prevent
				></u-datetime-picker>
			</view>
		</com-hoc-touchbox>
	</view>
</template>

<script>
	import moment from 'moment'
	import apiLib from '@/api/api.js'
	import {debounce,deepClone} from '@/lib/lib.js'
	import {ChartOptsManager} from '@/lib/chartOpts/chartOpts.js'
	import {MapMannager} from './tool.js'
	import overviewChartCom from './components/overviewChartCom.vue'
	import timePickerCom from './components/timepickCom.vue'
	
	let MAP_CTX = null // 地图对象
	let Marker_List = [] // marker列表
	let Real_Time_Data_List = [] // 实时数据列表，所有车
	let curTimePickerName='' //starttime,endtime
	
	export default {
		name:'test-car-overview',
		components:{
			'overview-chart-com':overviewChartCom,
			'time-picker-com':timePickerCom
		},
		data(){
			return {
				initTop:550,
				isTouchDisable: false, // 是否禁用滑动
				windowHeight: null,
				isScrollY: true,
				latitude:'31.23037',
				longitude:'121.4737',
				touchboxShow:false, // 地图渲染完成后再显示滑动框
				totalItemShow:false, // 在线车辆进度图加载完成后再显示总车辆
				isSearchBtnLoading:false, // 搜素表格数据按钮loading
				timePickerShow:false, // 时间选择器
				total:201, // 车辆总数
				onLineNum:0, // 在线车辆数
				curMarkerType:'all', // 当前显示的是在线车辆还是离线还是全部车辆图标 'all','zaixixan','lixian'
				circleData:{}, // 在线车辆百分比
				chartNumArr:[], // 数据统计大数字c
				distanceChartData:{categories: [], series: [{data:[]}]}, //所有车辆驾驶总里程总览
				drivetimeChartData:{categories: [], series: [{data:[]}]}, //所有车辆驾驶总时长总览
				speedgreaterChartData:{categories: [], series: [{data:[]}]}, //所有车辆驾不同驶速度的时长分布统计
				tDataParam:{ // getTDataDayRes 请求的params
					starttime:moment().startOf('month').format('YYYY-MM-DD'),
					endtime:moment().endOf('month').format('YYYY-MM-DD')
				},
				debounceRegionchange:debounce(this.regionchange),
				columopts:ChartOptsManager.getColumnOpts(),
				distanceopts:ChartOptsManager.getAreaOpts(),
				speedgreateropts:ChartOptsManager.getAreaOpts({showLegend:true}),
				arcbaropts:ChartOptsManager.getArcbarOpts({titleVal:this.onLineNum,subtitleVal:'在线',radius:80}),
				subkey:'WAHBZ-KXAE3-A3M3Q-3SBAC-EVU4T-4VFJ6',
			}
		},
		created(){
			this.getTDataDayRes() // 获取图表数据
		},
		mounted(){
			this.windowHeight = uni.getSystemInfoSync().windowHeight
			this.initTop = this.windowHeight-100
		},
		async onReady() {
			this.getCurLocation()
			
			//创建并返回 map 上下文 mapContext 对象
			MAP_CTX = uni.createMapContext('map',this)
			
			await this.getRealTimeDataAll()
			
			MapMannager.initMap(MAP_CTX, true, Real_Time_Data_List)
			
			Marker_List = MapMannager.getMarkerList()
			
			// this.getTDataDayRes()
		},
		methods:{
			showOnline(type){ // 只展示在线车辆图标
				this.curMarkerType = type
				const list = Marker_List.filter(i=>i.infoItem.isonline)
				MapMannager.addMarkers(list,MAP_CTX,true)
			},
			showOffline(type){ // 只展示离线车辆图标
				this.curMarkerType = type
				const list = Marker_List.filter(i=>!i.infoItem.isonline)
				MapMannager.addMarkers(list,MAP_CTX,true)
			},
			showAll(type){ // 展示所有车辆图标
				this.curMarkerType = type
				MapMannager.addMarkers(Marker_List,MAP_CTX,true)
			},
			async getRealTimeDataAll(){ // 获取所有实时数据,并生产markers列表,并添加到地图
				const res = await apiLib.getRealTimeDataAll()
				if(res.isOk){
					this.total = res.total
					this.onLineNum = res.onLineNum
					const percent = this.onLineNum/this.total
					const cData = { series: [ { name: "在线", data: percent } ] }
					
					this.arcbaropts = ChartOptsManager.getArcbarOpts({titleVal:this.onLineNum,subtitleVal:'在线',radius:80})
					this.circleData = cData
					
					Real_Time_Data_List = deepClone(res.data)
				}
			},
			async getTDataDayRes(){ //获取日统计接口
				const res = await apiLib.getTDataDayRes(this.tDataParam)
				
				if(res.isOk){
					this.distanceChartData = res.chartData.distancceObj
					this.drivetimeChartData = res.chartData.drivetimeObj
					this.speedgreaterChartData = res.chartData.speedgreaterObj
					
					this.chartNumArr = res.chartNumArr
					console.log(this.chartNumArr,'overview----chartNumArr')
				}
			},
			async getHisdataslice(){ // 查询历史数据切片接口
				const params={
					starttime:'2022-05-01 12:00:00',
					endtime:'2022-05-10 12:00:00',
				}
				const res = await apiLib.getHisdataslice(params)
			},
			resetLoc(e){ // 地图复位
				console.log(e,'returnLoc复位')
				MAP_CTX.moveToLocation()
			},
			regionchange(e){ // 移动或缩放地图画布
				if((e.type || '').toLowerCase()==='end'){
					console.log(e,'regionchange')
					// e={
					// 	type: "end",
					// 	causedBy: "scale",
					// 	detail: {
					// 		causedBy: "scale"
					// 		centerLocation:{
					// 			latitude: 31.37543288573986
					// 			longitude: 121.26526543957095
					// 		},
					// 		region:{
					// 			northeast: {latitude: 31.383839540958938, longitude: 121.27137526512388}
					// 			southwest: {latitude: 31.36702547827418, longitude: 121.25915561401803}
					// 		},
					// 		rotate: 0
					// 		scale: 15.53
					// 		skew: 0
					// 		type: "end"
					// 	}
					// }
				}
			},
			openTimePicker(key){
				this.timePickerShow = true
				curTimePickerName = key
			},
			datetimePickerClose(){ // 关闭时间选择框
				this.timePickerShow = false
			},
			conformTime(e){ // 确定选择时间
				this.tDataParam[curTimePickerName] = moment(e.value).format('YYYY-MM-DD')
				this.datetimePickerClose()
				console.log(e,'------确定选择时间--------',this.tDataParam[curTimePickerName])
			},
			async onSearchChartData(){ // 根据时间段更新图表数据
				this.isSearchBtnLoading = true
				await this.getTDataDayRes()
				this.isSearchBtnLoading = false
				console.log('onSearchChartData')
			},
			async onSearch(timeObj){
				this.tDataParam = {
					...this.tDataParam,
					starttime:timeObj.starttime,
					endtime:timeObj.endtime,
					project:timeObj.project || ''
				}
				
				await this.getTDataDayRes()
				
				this.$refs.overviewtimepicker.stopLoading()
				
				console.log(timeObj,'timeObj',this.tDataParam)
			},
			updated(e){ // 在地图渲染更新完成时触发
				this.touchboxShow = true
				console.log(e,'updated')
			},
			tooltipFormater(item, category, index, opts){ // tooltip formate
				console.log(item, category, index, opts,'tooltipFormater')
				return ''
			},
			getMapRegion(){ // northeast, southwest
				MAP_CTX.getRegion({
					success(res) {
						// res = {
						// 	errMsg: "getMapRegion:ok"
						// 	northeast:{
						// 		latitude: 31.380901539961986
						// 		longitude: 121.27062988460807
						// 	},
						// 	southwest:{
						// 		latitude: 31.368738066379453
						// 		longitude: 121.26179011539193
						// 	}
						// }
						console.log(res,'this.map.getRegion-success')
					},
					fail(err) {
						console.log(err,'this.map.getRegion-err')
					}
				})
			},
			getCurLocation(){ // 获取当前经纬度
				uni.getLocation({
					type: 'gcj02',
					success: (res)=>{
						this.latitude = res.latitude
						this.longitude = res.longitude
						console.log(res,'getLocation')
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
					}
				});
			},
			getEndDetail({ // 上拉滑动框滑动结束时
				minTop,
				maxTop,
				curTop
			}) {
				if (curTop == maxTop) this.isScrollY = true
				else this.isScrollY = false
				console.log(minTop,maxTop,curTop,'----getEndDetail----')
			},
			onMarkerTap(e){ // 点击车辆图标
				const item = Marker_List.find(i=>i.id==e.markerId)
				item && this.toPerCarInfo(item)
				
				console.log(item,'=======itemitemitem=======')
			},
			toPerCarInfo(e){ // 去单车详情页
				uni.navigateTo({
					url: '/page_testCarOverview/testCarOverview/subPages/perCarInfo/perCarInfo',
					success(res,self) {
						// 跳转成功后,向目标页面传送数据
						res.eventChannel.emit('pushInitData',{terminalcode:e?.infoItem?.terminalcode||''})
					}
				});
			},
			onChangeTouchDisable() { // 控制touchbox是否可以滑动
				this.isTouchDisable = !this.isTouchDisable
				uni.showToast({
					title: this.isTouchDisable ? '已禁用滑动' : '已开启滑动',
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-test-car-overview{
		.map-wrapper{
			width: 100vw;
			height: 100vh;
			.map-item{
				position: relative;
				width: 100%;
				height: 100%;
				.car-arcbar-box{
					position: absolute;
					top:15rpx;
					right:15rpx;
					z-index:10;
					.total-item{
						font-size:18rpx;
						line-height:24rpx;
						text-align:center;
						color:#888;
					}
					.change-marker-box{
						display: flex;
						justify-content: center;
						align-items: center;
						width: 80rpx;
						height: 80rpx;
						margin-top: 20rpx;
						margin-left: 20rpx;
						.touch-icon-style{
							color:#6970e2;
							font-size: 48rpx;
						}
					}
				}
			}
		}
		.touch-box-wrapper{
			.touch-wrapper{
				margin-top:20rpx;
			}
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
							margin-bottom: 20rpx;;
						}
						.label-item{
							width: 145rpx;
							min-width: 145rpx;
							margin-right: 20rpx;
							letter-spacing: 2rpx;
						}
					}
				}
				.right-box{
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
</style>

<style lang="scss">
	.page-test-car-overview{
		.touch-box-wrapper{
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
	}
</style>