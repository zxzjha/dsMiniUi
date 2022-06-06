<template>
	<view class="page-car-map-com">
		<view class="top-box">
			<time-picker-com
				ref="timepicker"
				startKey="begintime"
				endKey="endtime"
				pickerMode="datetime"
				:initParam="queryParam"
				:hasProject="false"
				@onConfirm="onSearch"
			></time-picker-com>
			<view class="title-box">此轨迹里程(Km)：
				<template>
					<text v-if="isLoading">
						加载中...
					</text>
					<text v-else>
						{{isNotNil(sumMileage)?sumMileage:'--'}}
					</text>
				</template>
			</view>
		</view>
		
		<view class="map-box">
			<map class="map-item" id="maymap" :subkey="subkey" layer-style="2" :polyline="test" :latitude="latitude"
				:longitude="longitude" :scale="13" :show-location="true" :enable-overlooking="true"
				@updated="updated"
			>
				<view class="play-box" v-if="playBoxShow">
					<view v-if="!startMove" @click="handleStartMove">
						<u-icon name="play-circle-fill" color="#6970e2" size="40"></u-icon>
					</view>
					<view v-else @click="handleStopMove">
						<u-icon name="pause-circle-fill" color="#6970e2" size="40"></u-icon>
					</view>
				</view>
			</map>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import apiLib from '@/api/api.js'
	import {isNotNil} from '@/lib/lib.js'
	import timePickerCom from '../../../components/timepickCom.vue'
	
	let MAP_CTX = null // 地图对象
	let marker = {
		width: 30,
		height: 30,
		iconPath: "/static/mapImg/movecar.png", // movecar
		id: 1,
		joinCluster: false,
		latitude: 30.490456,
		longitude: 114.503701
	}
	
	export default{
		name:'car-map-com',
		components:{
			'time-picker-com':timePickerCom
		},
		props:{
			terminalcode:{
				default(){
					return '53810826487'
				}
			}
		},
		computed:{
			test(){
				return this.polyline.slice(0)
			}
		},
		data(){
			return {
				latitude:'31.23037',
				longitude:'121.4737',
				sumMileage:'',
				polyline:[],
				nextPointIndex:1,
				startMove:false, // 开始移动
				playBoxShow:false,
				isLoading:false,
				durationTime:600, // 600毫秒后下个点移动
				queryParam:{ // getHistoryData 请求参数
					iscl:1, // 是否优化轨迹，1：优化，0不优化（不填默认0）
					sp:300,
					terminalcode:this.terminalcode,
					begintime:moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
					endtime:moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
					fixedColumns:["traveltime","angle","speed","mileage","lat","lon","altitude"],
				},
				isNotNil,
				subkey:'WAHBZ-KXAE3-A3M3Q-3SBAC-EVU4T-4VFJ6',
			}
		},
		async mounted() {
			MAP_CTX = uni.createMapContext('maymap',this)
			
			this.queryParam = {
				...this.queryParam,
				terminalcode:this.terminalcode
			}
			await this.getHistoryData()
			console.log(this.terminalcode,'----mounted---',this.queryParam)
		},
		methods:{
			async onSearch(timeObj){
				this.startMove=false
				this.queryParam = {
					...this.queryParam,
					begintime:timeObj.begintime,
					endtime:timeObj.endtime
				}
				
				await this.getHistoryData()
				this.$refs.timepicker.stopLoading()
			},
			async getHistoryData(){
				this.isLoading = true
				
				const res = await apiLib.getHistoryData(this.queryParam)
				console.log(res,'++++++++getHistoryData=+++++++++',this.queryParam)
				if(res.code==200){
					this.sumMileage = isNotNil(res.sumMileage)?(res.sumMileage==0?0:res.sumMileage.toFixed(2)):''
					const pointsList = []
					for(let i=0;i<res.data.length;i++){
						
						pointsList.push({
							latitude: res.data[i].lat,
							longitude: res.data[i].lon
						})
					}
					
					if(pointsList.length>0){
						// 地图复位到轨迹点起始位置
						this.resetLoc({ 
							longitude:pointsList[0].longitude,
							latitude:pointsList[0].latitude
						})
						
						const markerlist = [ // marker
							{
								...marker,
								latitude: pointsList[0].latitude,
								longitude: pointsList[0].longitude
							}
						]
						this.addMarkers(markerlist)
					}
					
					this.polyline=[ // 轨迹数据
						{
							points:pointsList,
							color:'#6970e2',
							borderColor:'#5257b4', // #3d418a
							width: 10,
							arrowLine: true,
							borderWidth: 2 //线的边框宽度，还有很多参数，请看文档 translateMarker
						}
					]
					
					//默认播放全程使用30秒，计算相连两点动画时长
					// this.durationTime = Math.ceil(10000 / this.polyline[0].points.length)	
					this.isLoading = false
					
					// console.log(this.polyline,'this.polyline')
				}
			},
			updated(e){ // 在地图渲染更新完成时触发
				this.playBoxShow = true
				console.log(e,'updated')
			},
			resetLoc(data){ // 地图复位
				console.log(data,'resetLocresetLoc')
				MAP_CTX.moveToLocation(data)
			},
			addMarkers(markerlist){ // 在地图上添加marker图标
				MAP_CTX.addMarkers({ // 添加车辆图标
					markers:markerlist,
					clear: true,
					complete(res) {
						console.log('addMarkers111111111', res)
					}
				})
			},
			handleStartMove() {
				this.startMove = true
				this.movePoint()
				console.log(this.startMove,'startMove---handleStartMove')
			},
			//停止移动
			handleStopMove() {
				this.startMove = false
				console.log(this.startMove,'startMove---handleStopMove')
			},
			movePoint(){
				MAP_CTX.translateMarker({
					duration: this.durationTime,
					markerId: 1,
					autoRotate:true,
					destination: {
						latitude: this.polyline[0].points[this.nextPointIndex].latitude,
						longitude: this.polyline[0].points[this.nextPointIndex].longitude
					},
					animationEnd: res => {
						console.log(res,'-----endddd------')
						//播放结束，继续移动到下一个点，最后一个点时结束移动
						if (this.nextPointIndex < this.polyline[0].points.length - 1) {
							this.nextPointIndex++
							if (this.startMove) {
								this.resetLoc({
									longitude:this.polyline[0].points[this.nextPointIndex].longitude,
									latitude:this.polyline[0].points[this.nextPointIndex].latitude
								})
								this.movePoint()
							}
						} else {
							this.nextPointIndex = 1
							this.startMove = false
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-car-map-com{
		.top-box{
			.title-box{
				padding: 0 40rpx 20rpx;
				font-size: 34rpx;
				font-weight: bold;
			}
		}
		.map-box{
			width: 100vw;
			height: 65vh;
			.map-item{
				position: relative;
				width: 100%;
				height: 100%;
				.play-box{
					position: absolute;
					top: 15rpx;
					right: 25rpx;
				}
			}
		}
	}
</style>