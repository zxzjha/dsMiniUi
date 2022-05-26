<template>
	<view class="page-test-car-overview">
		<view class="map-wrapper">
			<map class="map-item" id="map" :subkey="subkey" layer-style="2" :latitude="latitude"
				:longitude="longitude" :scale="8" :show-location="true" :enable-overlooking="true"
				@regionchange="debounceRegionchange" @updated="updated" @markertap="onMarkerTap"
			></map>
		</view>
		
		<com-hoc-touchbox
			v-if="touchboxShow"
		  ref="touchBox" 
			:disable="isTouchDisable" 
			@get-end-detail="getEndDetail"
			customStyle="border-radius:10px 10px 0 0;margin: 0 10rpx;"
			initTop="500" minTop="100" maxTop="50"
		>
			<view @click.stop.prevent>
				车辆总数：{{total}} ---- 在线数：{{onLineNum}}
				<view @click="getTDataDay">getTDataDay</view>
				<view @click="getHisdataslice">getHisdataslice</view>
				
				<view class="chart-box">
					<qiun-data-charts
						type="column"
						:opts="opts"
						:chartData="type2dData"
						:canvas2d="false"
						:ontouch="true"
						:disableScroll="true"
						:tooltipFormat="tooltipFormater"
						canvasId="canvasColumn"
						@click.stop.prevent
					></qiun-data-charts>
				</view>	
				
				<!-- <scroll-view :scroll-y="isScrollY">
					
				</scroll-view> -->
			</view>
		</com-hoc-touchbox>
		
	</view>
</template>

<script>
	import apiLib from '@/api/api.js'
	import {debounce,deepClone} from '@/lib/lib.js'
	import {MapMannager} from './tool.js'
	
	let MAP_CTX = null // 地图对象
	let Marker_List = [] // marker列表
	let Real_Time_Data_List = [] // 实时数据列表，所有车
	
	
	export default {
		name:'test-car-overview',
		data(){
			return {
				isTouchDisable: false, // 是否禁用滑动
				// windowHeight: null,
				title: '',
				isScrollY: false,
				latitude:'31.23037',
				longitude:'121.4737',
				touchboxShow:false,
				// layerStyle:2,
				inquireParams:{
					// pageNum:1,
					// pageSize:10,
					// isonline:1,
					// isbind:1
				},
				total:201, // 车辆总数
				onLineNum:0, // 在线车辆数
				DATA:{
					distanceObj: {categories: [], series: [{data:[]}]},
					speedgreater10timeObj: {categories: [], series: [{data:[]}]},
					speedgreater80timeObj: {categories: [], series: [{data:[]}]},
					sumdrivetimeObj: {categories: [], series: [{data:[]}]}
				},
				type2dData:{},
				debounceRegionchange:debounce(this.regionchange),
				opts:{
					// color: ["#39B54A","#FBBD08","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				  padding: [25,25,0,25],
				  dataLabel:false, // 是否展示数据点上方的数据文案
					enableScroll:true, // 开启图表可拖拽滚动
				  xAxis:{
						disabled:false, // true:不绘制X轴
						axisLine:false, // 绘制坐标轴轴线
						calibration:false, // 坐标轴刻度线
				    disableGrid: true, // true:不绘制纵向网格(即默认绘制网格)
						rotateLabel:true, //【旋转】数据点（刻度点）文字
						rotateAngle:70, // 开启上面旋转功能后，文字旋转的角度，取值范围(-90至90)
						itemCount:10, // 单屏数据密度即图表可视区域内显示的X轴数据点数量，仅在启用enableScroll时有效
				    // axisLineColor:'rgba(255,255,255,0)' // 横坐标轴透明
				    axisLineColor:'#ccc' // 横坐标轴透明
				  },
				  yAxis:{
				    disabled: false,
				    disableGrid: true,
				    data:[{
				      disabled:false, // 不绘制Y轴（刻度和轴线都不绘制）
				      axisLine:false ,// 纵坐标轴透明
							calibration: false, // 刻度线是否显示
				    }]
				  },
				  extra:{
						column:{
							width:10,
							categoryGap:5,// 每个category点位（X轴点）柱子组之间的间距
							activeBgColor: "#333",
							activeBgOpacity: 0.08,
							meterBorder: 0,
							meterFillColor: "#904777",
							barBorderCircle:false, // 启用分组柱状图半圆边框
							barBorderRadius: [10,10,10,10], // 自定义4个圆角半径[左上,右上,右下,左下]（请关闭上面barBorderCircle）
							linearType:'custom', // 渐变类型 (custom:自定义颜色)
							linearOpacity:0.4, // 透明渐变的透明度（值范围0到1，值越小越透明）
							customColor:['#6970e2'], // 自定义渐变颜色，数组类型对应series的数组长度以匹配不同series颜色的不同配色方案，例如["#FA7D8D", "#EB88E2"]
						},
					}
				},
				subkey:'WAHBZ-KXAE3-A3M3Q-3SBAC-EVU4T-4VFJ6',
			}
		},
		async onReady() {
			// this.windowHeight = uni.getSystemInfoSync().windowHeight
			
			this.getCurLocation()
			
			//创建并返回 map 上下文 mapContext 对象
			MAP_CTX = uni.createMapContext('map',this)
			
			// 方式1:
			// this.initMap()
			
			// 方式2:
			await this.getRealTimeDataAll()
			MapMannager.initMap(MAP_CTX, true, Real_Time_Data_List)
			Marker_List = MapMannager.getMarkerList()
			
			// this.getDataList()
			this.getTDataDay()
		},
		methods:{
			async initMap(){ // 1.请求所有实时数据列表 2.定义聚合 3.在地图上添加markers和点聚合
				await this.getRealTimeDataAll()
				this.addCluster()
				this.addMarkers()
			},
			addMarkers(){ // 2.生成markers 3.在地图上添加markers
				let list = []
				Real_Time_Data_List.forEach((item,index)=>{
					list.push({
						id:index+1,
						width: 30,
						height: 30,
						joinCluster: true, // 指定了该参数才会参与聚合
						iconPath:item.isonline?'/static/mapImg/carColor.png':'/static/mapImg/carGrey.png',
						latitude:item.lat,
						longitude:item.lon,
						label: {
							color: '#bbb',
							fontSize: 10,
							borderWidth: 0,
							borderRadius: 3,
							borderColor: '#000000',
							bgColor: '#ebeef11f',
							padding: 1,
							textAlign: 'center',
						},
						infoItem:{ // 改标记对应的车的信息
							...item
						}
					})
				})
				
				Marker_List = deepClone(list)
				
				MAP_CTX.addMarkers({ // 添加车辆图标
					markers:Marker_List,
					clear: false,
					complete(res) {
						console.log('addMarkers111111111', res)
					}
				})
			},
			addCluster(){ // 3.在地图上添加点聚合
				// 仅调用初始化，才会触发 on.("markerClusterCreate", (e) => {})
				MAP_CTX.initMarkerCluster({
					enableDefaultStyle: false,
					zoomOnClick: true,
					gridSize: 30,
					complete(res) {
						console.log('initMarkerCluster', res)
					}
				});
	
				MAP_CTX.on("markerClusterCreate", (e) => { // enableDefaultStyle 为 true 时不会触发该事件
					console.log("markerClusterCreate", e);
					const clusters = e.clusters
					
					const clusterMarkers = clusters.map(cluster => {
						const {center,clusterId,markerIds} = cluster
						
						return {
							...center,
							width: 0,
							height: 0,
							clusterId, // 必须
							iconPath:'/static/mapImg/cluster.png',
							label: {
								content: markerIds.length,
								fontSize: 14,
								width: 45,
								height: 45,
								borderWidth: 4,
								color:'#888',
								borderColor: '#6970e2',
								bgColor: '#fff',
								borderRadius: 28,
								textAlign: 'center',
								anchorX: 0,
								anchorY: -18,
							}
						}
					})
					
					MAP_CTX.addMarkers({
						markers:clusterMarkers, // 添加聚合图标
						clear: false,
						complete(res) {
							console.log('clusterCreate addClusterMarkers', res,clusterMarkers,'======clusterMarkers===')
						}
					})
				});
				
				MAP_CTX.on('markerClusterClick', res => {
					console.log('markerClusterClick', res)
				})
			},
			async getRealTimeDataAll(){ // 获取所有实时数据,并生产markers列表,并添加到地图
				const res = await apiLib.getRealTimeDataAll()
				if(res.isOk){
					this.total = res.total
					this.onLineNum = res.onLineNum
					Real_Time_Data_List = deepClone(res.data)
				}
				// accstate: null
				// altitude: 66
				// angle: 217
				// d: null
				// dbtime: "2021-12-24T15:32:43.33"
				// gnsscount: null
				// isdriving: null
				// isonline: false
				// isposition: true
				// lat: 30.489986
				// lon: 114.50309
				// mileage: 2.2
				// positiontime: "2021-12-24T15:32:42"
				// speed: 0
				// terminalcode: "53810829755"
				// traveltime: "2021-12-24T15:32:42"
			},
			async getTDataDay(){ //获取日统计接口
				const params={
					starttime:'2022-04-30',
					endtime:'2022-05-30'
				}
				const res = await apiLib.getTDataDayRes(params)
				
				if(res.isOk){
					this.DATA = res.chartData
					
					this.type2dData = {
						...this.DATA.distanceObj,
						categories:this.DATA.distanceObj.categories.map(i=>i.slice(5))
					}
				}
				console.log(res,'===getTDataDay===获取日统计接口getTDataDayRes')
				
				// autodrivingdistance: 0
				// autodrivingtime: 0
				// carid: "128842061468581888"
				// carno: "3810816791"
				// createBy: "admin"
				// createTime: "2022-05-01 01:00:06"
				// day: "2022-04-30"
				// delFlag: "0"
				// ecusaveragespeed: 0
				// ecusaveragespeedhavezero: 0
				// ecusmaxspeed: 0
				// ecusumdrivedistance: 0
				// endlat: 40.168266
				// endlon: 117.153198
				// endtime: null
				// gpsaveragespeed: 38.18
				// gpsaveragespeedhavezero: 7.92
				// gpsmaxspeed: 116.5
				// id: "191747782086148096"
				// manualdrivingdistance: 0
				// manualdrivingtime: 0
				// oil: 0
				// params: {UserCarPermission: "", TenantPermission: ""}
				// remark: ""
				// speedgreater10time: 7602
				// speedgreater80time: 135
				// startime: null
				// startlat: 40.144205
				// startlon: 117.090541
				// sumdrivedistance: 96
				// sumdrivetime: 43997
				// terminalcode: "53810816791"
				// updateBy: ""
				// updateTime: null
			},
			async getHisdataslice(){ // 查询历史数据切片接口
				const params={
					starttime:'2022-05-01 12:00:00',
					endtime:'2022-05-10 12:00:00',
				}
				const res = await apiLib.getHisdataslice(params)
				console.log(res,'===getHisdataslice===查询历史数据切片接口')
				// createBy: null
				// createTime: "2022-05-01 12:06:56"
				// endtime: "2022-05-01 12:06:53"
				// id: "191915597078380544"
				// params: {UserCarPermission: "", TenantPermission: ""}
				// remark: null
				// starttime: "2022-05-01 12:01:30"
				// sumMileage: 0.09999999999999432
				// sumTime: "323"
				// terminalcode: "53810827241"
				// updateBy: null
				// updateTime: null
			},
			async getDataList(){ // 获取车辆列表
				const res = await apiLib.getCarList(this.inquireParams)
				console.log(res,'=====getDataList=====')
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
			getEndDetail({
				minTop,
				maxTop,
				curTop
			}) {
				if (curTop == maxTop) this.isScrollY = true
				else this.isScrollY = false
			},
			onMarkerTap(e){
				const item = Marker_List.find(i=>i.id==e.markerId)
				console.log(e,'------onMarkerTap------',item)
			},
			onChangeTouchDisable() {
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
				width: 100%;
				height: 100%;
			}
		}
	}
</style>