export class ChartOptsManager{ // 图表的opts配置
	static getColumnOpts(){ // 柱状图设置
		const opts={
			// color: ["#39B54A","#FBBD08","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
			padding: [15,35,0,30],
			dataLabel:false, // 是否展示数据点上方的数据文案
			enableScroll:true, // 开启图表可拖拽滚动
			xAxis:{
				disabled:false, // true:不绘制X轴
				axisLine:false, // 绘制坐标轴轴线
				calibration:false, // 坐标轴刻度线
				disableGrid: true, // true:不绘制纵向网格(即默认绘制网格)
				rotateLabel:false, //【旋转】数据点（刻度点）文字
				rotateAngle:45, // 开启上面旋转功能后，文字旋转的角度，取值范围(-90至90)
				labelCount:3, //数据点文字（刻度点）单屏幕限制显示的数量
				itemCount:12, // 单屏数据密度即图表可视区域内显示的X轴数据点数量，仅在启用enableScroll时有效
				// axisLineColor:'rgba(255,255,255,0)' // 横坐标轴透明
				axisLineColor:'#e2e2e2' ,// 横坐标轴透明
			},
			yAxis:{
				disabled: false,
				disableGrid: true, // 不绘制横向向网格(即默认绘制网格)
				splitNumber:3,
				gridColor:'#e2e2e2',
				data:[{
					disabled:false, // 不绘制Y轴（刻度和轴线都不绘制）
					axisLine:false ,// 纵坐标轴透明
					calibration: false, // 刻度线是否显示
					axisLineColor:'#e2e2e2'
				}]
			},
			legend:{
				show:false // 关闭图例
			},
			extra:{
				column:{
					width:10,
					categoryGap:5,// 每个category点位（X轴点）柱子组之间的间距
					activeBgColor: "#333",
					activeBgOpacity: 0.08,
					meterBorder: 0,
					meterFillColor: "#fff",
					barBorderCircle:false, // 启用分组柱状图半圆边框
					barBorderRadius: [20,20,20,20], // 自定义4个圆角半径[左上,右上,右下,左下]（请关闭上面barBorderCircle）
					linearType:'linearType', // 渐变类型 (custom:自定义颜色，linearType：渐变)
					linearOpacity:0.2, // 透明渐变的透明度（值范围0到1，值越小越透明）
					customColor:['#6970e2'], // 自定义渐变颜色，数组类型对应series的数组长度以匹配不同series颜色的不同配色方案，例如["#FA7D8D", "#EB88E2"]
				},
			}
		}
		return opts
	}
	
	static getAreaOpts(params){ // 区域图配置
		const {showLegend=false} = {...params}
		
		const opts={
			// color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
			padding: [15,35,0,30],
			fontSize: 13,
			fontColor: "#666666",
			dataLabel: false,
			dataPointShape: false,
			dataPointShapeType: "solid",
			touchMoveLimit: 60,
			enableScroll: true,
			enableMarkLine: false, // 是否启用标记线功能，注意：不启用将无法显示标记线，也可做为隐藏图表区域内的标记线的开关。启用后请在上面【标记线配置】菜单内修改配置
			legend: {
				show: showLegend,
				// position: "bottom",
				// float: "center",
				// padding: 5,
				// margin: 5,
				// backgroundColor: "rgba(0,0,0,0)",
				// borderColor: "rgba(0,0,0,0)",
				// borderWidth: 0,
				// fontSize: 13,
				// fontColor: "#666666",
				// lineHeight: 11,
				// hiddenColor: "#CECECE",
				// itemGap: 10
			},
			xAxis: {
				disableGrid: true,
				disabled: false,
				axisLine: true,
				axisLineColor: "#e2e2e2",
				calibration: false,
				fontColor: "#666666",
				fontSize: 13,
				rotateLabel: false,
				rotateAngle: 45,
				labelCount: 3, // 横坐标显示刻度值的个数
				itemCount: 31,
				boundaryGap: "center",
				splitNumber: 3, // X轴网格数量，纵向网格数量(竖着的)
				gridColor: "#e2e2e2",
				gridType: "solid",
				dashLength: 4,
				gridEval: 1,
				scrollShow: false,
				scrollAlign: "left",
				scrollColor: "#A6A6A6",
				scrollBackgroundColor: "#EFEBEF",
				format: ""
			},
			yAxis: {
				gridType: "dash",
				dashLength: 2,
				disabled: false,
				disableGrid: true, // 不绘制横向向网格(即默认绘制网格)
				splitNumber: 5,
				gridColor: "#e2e2e2",
				padding: 10,
				showTitle: false,
				data: [
					{
						type: "value",
						position: "left",
						disabled: false,
						axisLine: false, // 坐标轴轴线是否显示（数据还能显示）
						axisLineColor: "#e2e2e2",
						calibration: false,
						fontColor: "#666666",
						fontSize: 13,
						textAlign: "right",
						title: "",
						titleFontSize: 13,
						titleOffsetY: 0,
						titleOffsetX: 0,
						titleFontColor: "#666666",
						// min: null,
						// max: null,
						// tofix: null,
						// unit: "",
						// format: ""
					}
				]
			},
			extra: {
				area: {
					type: "curve",
					opacity: 0.4,
					addLine: true,
					width: 2,
					gradient: true
				},
				tooltip: {
					showBox: true,
					showArrow: true,
					showCategory: false,
					borderWidth: 0,
					borderRadius: 0,
					borderColor: "#000000",
					borderOpacity: 0.7,
					bgColor: "#000000",
					bgOpacity: 0.7,
					gridType: "solid",
					dashLength: 4,
					gridColor: "#e2e2e2",
					fontColor: "#FFFFFF",
					splitLine: true,
					horizentalLine: false,
					xAxisLabel: false,
					yAxisLabel: false,
					labelBgColor: "#FFFFFF",
					labelBgOpacity: 0.7,
					labelFontColor: "#666666"
				}
			}
		}
		return opts
	}
	
	static getArcbarOpts(params){ // 进度条配置
		const {titleVal='',subtitleVal='',radius=null} = {...params}
		const opts={
			timing: "easeOut",
			duration: 1000,
			rotate: false,
			rotateLock: false,
			color: undefined,
			padding: undefined,
			fontSize: 13,
			fontColor: "#666666",
			dataLabel: true,
			dataPointShape: true,
			dataPointShapeType: "solid",
			touchMoveLimit: 60,
			enableScroll: false,
			enableMarkLine: false,
			title: {
				name: titleVal, // 值会动态变化
				fontSize: 16,
				color: "#6392d6",
				offsetX: 0,
				offsetY: 0
			},
			subtitle: {
				name: subtitleVal, // 值会动态变化
				fontSize: 8,
				color: "#909090",
				offsetX: 0,
				offsetY: 0
			},
			extra: {
				arcbar: {
					type: "circle",
					width: 6,
					backgroundColor: "#E9E9E9",
					startAngle: 1.5,
					endAngle: 0.25,
					gap: 2,
					direction: "cw",
					lineCap: "round",
					radius: radius, //圆弧进度图自定义半径（最大半径）（无特殊需求无需填写）
					centerX: 0,
					centerY: 0,
					linearType: "custom",
					customColor: [
						"#d9daf1",
						"#fff"
					]
				}
			}
		}
		return opts
	}
}