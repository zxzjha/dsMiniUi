export class MapMannager{
	static initMap(MAP_CTX,isJoinCluster=false,data=[]){
		MapMannager.calcMarkerList(isJoinCluster,data) // 1.生成 this.Marker_List
		
		isJoinCluster && MapMannager.addCluster(MAP_CTX) // 2.添加点聚合
		
		MapMannager.addMarkers(this.Marker_List,MAP_CTX)  // 3.添加marker图标
	}
	
	static addCluster(MAP_CTX){ // 在地图上添加点聚合
	
		// 仅调用初始化，才会触发 on.("markerClusterCreate", (e) => {})
		
		MAP_CTX.initMarkerCluster({
			enableDefaultStyle: false,
			zoomOnClick: true,
			gridSize: 40,
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
						content: markerIds.length+'',
						fontSize: 12,
						width: 45,
						height: 45,
						borderWidth: 4,
						borderColor: '#6970e2',
						bgColor: '#fff',
						borderRadius: 28,
						textAlign: 'center',
						// anchorX: 0,
						// anchorY: -18,
					}
				}
			})

			MAP_CTX.addMarkers({
				markers:clusterMarkers, // 添加聚合图标
				clear: false,
				complete(res) {
					console.log('clusterCreate addClusterMarkers', res,clusterMarkers,'====clusterMarkers99999====')
				}
			})
		});
		
		MAP_CTX.on('markerClusterClick', res => {
			console.log('markerClusterClick', res)
		})
	}
	
	static addMarkers(Marker_List,MAP_CTX,isClear=false){ // 在地图上添加marker图标
		MAP_CTX.addMarkers({ // 添加车辆图标
			markers:Marker_List,
			clear: isClear,
			complete(res) {
				console.log('addMarkers111111111', res)
			}
		})
	}
	
	static calcMarkerList(isJoinCluster,Real_Time_Data_List){ // 计算生成markerList
		let list = []
		Real_Time_Data_List.forEach((item,index)=>{
			list.push({
				id:index+1,
				width: 30,
				height: 30,
				joinCluster: isJoinCluster, // 指定了该参数才会参与聚合
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
		
		this.Marker_List = [...list]
		return [...list]
	}
	
	static getMarkerList(){
		return this.Marker_List
	}
}