<template>
	<view class="page-test-car-overview">
		<view class="map-wrapper">
			<map class="map-item" id="map" :subkey="subkey" :layer-style="layerStyle" :latitude="latitude" :longitude="longitude" 
				:show-location="true" :enable-overlooking="true" @regionchange="debounceRegionchange" @updated="updated"
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
			<view @click.stop>
				test {{latitude}}-{{longitude}}
				
				<button @click="getDataList">car-list</button>
				<button @click="getMapInfo">getMapInfo</button>
				<button @click="resetLoc">复位</button>
				<button @click="layerStyle=1">layerStyle 1</button>
				<button @click="layerStyle=2">layerStyle 2</button>
				
				<scroll-view :scroll-y="isScrollY">
					
				</scroll-view>
			</view>
		</com-hoc-touchbox>
		
	</view>
</template>

<script>
	import apiLib from '@/api/api.js'
	import {debounce} from '@/lib/lib.js'
	
	export default {
		name:'test-car-overview',
		data(){
			return {
				isTouchDisable: false, // 是否禁用滑动
				windowHeight: null,
				title: '',
				isScrollY: false,
				latitude:'',
				longitude:'',
				touchboxShow:false,
				layerStyle:1,
				inquireParams:{
					pageNum:1,
					pageSize:10,
					// isonline:1,
					// isbind:1
				},
				debounceRegionchange:debounce(this.regionchange),
				subkey:'WAHBZ-KXAE3-A3M3Q-3SBAC-EVU4T-4VFJ6',
			}
		},
		onReady() {
			this.windowHeight = uni.getSystemInfoSync().windowHeight
			
			this.getCurLocation()
			
			this.mapCtx = wx.createMapContext('map')
		},
		methods:{
			async getDataList(){
				const res = await apiLib.getCarList(this.inquireParams)
				console.log(res,'getDataListgetDataListgetDataList')
			},
			resetLoc(e){ // 复位
				console.log(e,'returnLoc复位')
				this.mapCtx.moveToLocation()
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
			getMapRegion(){ // northeast, southwest
				this.mapCtx.getRegion({
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
			getCurLocation(){
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