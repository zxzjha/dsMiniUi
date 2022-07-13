// 车辆监控，第三方接口

import { map_fetch,exFetch } from "../index.js"
import {uniqArr} from '@/lib/lib.js'

const BaseUrl = 'https://tw1-api.icv-cloud.com'

const VehicleBaseUrl = 'https://api-njdm-pv.saicmotor.com/adcdataplat/sys/vehicle-management'
const calcUrl = (params = {},type='GET',str) => { 
	const method = type.toUpperCase()
  const extra = method === 'PUT' ? (isNotNil(params.id) ? params.id : '') : ''
  return `${VehicleBaseUrl}/${str}/${extra}`
}

export const getHistoryData = async (params={})=>{ // 1.历史数据查询
 // {"carid":"111793499350765568",
 // "sp":10000,"endtime":"2021-09-24 00:00:00",
 // "begintime":"2021-09-22 00:00:00",
 // "iscl": 1,
 // "standards":[],
 // "fixedColumns":["traveltime","angle","speed","mileage","lat","lon","altitude"]}
 
	try{
		const res = await map_fetch(`${BaseUrl}/api/history/query`,params,'POST')
		res.isOk = true
		return res
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

export const getRealTimeDataByCode = async (params={terminalcode:''})=>{ // 2.实时数据接口 terminalcode:53810791089
	const {terminalcode} = params
	try{
		const res = await map_fetch(`${BaseUrl}/mapapi/api/getRealTimeData/${terminalcode}`,params,'GET')
		res.isOk = true
		return res
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

export const getRealTimeDataAll = async (params={}) => { // 3.获取所有实时数据接口
	// params:{isonline:1} 不是必填
	try{
		const res = await map_fetch(`${BaseUrl}/mapapi/api/getRealTimeData`,params,'GET')
		if(res.code==200){
			const onLineCars = res.data.filter(i=>i.isonline) // 过滤出在线车辆
			
			res.total = res.data.length
			res.onLineNum = onLineCars.length
			res.isOk = true
		}
		return res
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

export const getVedioInfo = async (params={})=>{ // 4.实时视频开启 params:{clientId:'',channelNo:''}
	try{
		const res = await map_fetch(`${BaseUrl}/extension/media/realtime/play`,params,'GET')
		res.isOk = true
		return res
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

export const getCarList = async (params={}) => { // 5.查询车辆list接口 
	// params:{pageNum:1,pageSize:100,isonline:1,isbind:1} -- (isonline:0：离线，1：在线),(isbind:0：未绑定，1：绑定)
	try{
		const res = await map_fetch(`${BaseUrl}/icv/viewcarinfo/list`,params,'GET')
		res.isOk = true
		return res
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

export const getHisdataslice = async (params={}) => { // 6.查询历史数据切片接口
	// params:{terminalcode:'',starttime:'2021-11-24 00:00:00',endtime:'2021-11-25 12:30:00'}
	// starttime,endtime 必填
	try{
		const res = await map_fetch(`${BaseUrl}/icv/hisdataslice/listslice`,params,'GET')
		res.isOk = true
		return res
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

export const getTDataDay = async (params={}) => { // 7.获取日统计接口
	// params:{terminalcode:'',starttime:'2021-11-24',endtime:'2021-11-25'}
	// starttime,endtime 必填
	try{
		const res = await map_fetch(`${BaseUrl}/icv/TDataDay/listDayStatistic`,params,'GET')
		res.isOk = true
		return res
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

/**
 *   ==========   以下接口主要是对接口进行运算，得到画图数据   ==========
 */

const calcSum = (data=[],key="",label="",isTime=false)=>{ // list:数据, key:字段名,返回结果：{2022-05-01:11,...}
	const res = {}
	const cateArr = []
	const list = data.filter(i=>i[key])
	list.forEach(j=>{
		cateArr.push(j.day)
		const val = isTime?(j[key]/3600):j[key]
		if(res[j.day]){
			res[j.day] = res[j.day] + val
		}else{
			res[j.day] = val
		}
	})
	const categories = uniqArr(cateArr)
	return {
		categories,
		series: [
			{
				name: label,
				color:"#6970e2",
				data: categories.map(i=>res[i].toFixed(2))
			}
		]
	}
}

const getSum = (arr=[])=>{ // 获取数据Sum
	const res = arr.reduce((total, value)=>{
		return Number(total) + Number(value)
	},0)
	console.log(res,'res--===')
	return res.toFixed(2)
}

export const getTDataDayRes = async(params={})=>{ // 将获取的日统计接口数据进行整合，得到画图直接能用的数据
	// params:{terminalcode:'',starttime:'2021-11-24',endtime:'2021-11-25'}
	// starttime,endtime 必填 
	
	// 根据项目筛选出车辆列表信息
	let vehicleMonitorIDOfProject = [] // 某项目下的所有车辆终端号
	if(params.project){
		const extraParams = {project:params.project||''}
		const vehicleRes = await exFetch(calcUrl(extraParams, 'GET', 'vehicle-info'), extraParams, 'GET')
		if(vehicleRes.code==200){
			const carListData = (vehicleRes.data || {itemList:[]}).itemList
			carListData.forEach(i=>{
				if(i.monitorID && i.monitorID.length>3){
					const monitorID = i.monitorID.slice(3,-1)
					vehicleMonitorIDOfProject.push(monitorID)
				}
			})
		}
	}
	
	try{
		const start = new Date().getTime()
		const res = await map_fetch(`${BaseUrl}/icv/TDataDay/listDayStatistic`,params,'GET')
		let chartData = {}
		if(res.code==200){
			// 过滤出有值的数据,并且支持根据项目筛选
			const list = (res.data||[]).filter(i=>{
				if(vehicleMonitorIDOfProject.length>0){
					const ind = vehicleMonitorIDOfProject.findIndex(m => m==i.terminalcode)
					return ind>=0 && !i.remark
				}else{
					return !i.remark
				}
			})
			
			const resData = {} // jieguo
			const cateArr = [] // 横坐标
			
			list.forEach((item)=>{
				cateArr.push(item.day)
				const distancce = item['sumdrivedistance'] || 0
				const drivetime = item['sumdrivetime']?(item['sumdrivetime']/3600): 0
				const speedgreater10 = item['speedgreater10time']?(item['speedgreater10time']/3600): 0
				const speedgreater80 = item['speedgreater80time']?(item['speedgreater80time']/3600): 0
				
				if(!resData[item.day]){
					resData[item.day] = {
						sumdrivedistance:0,
						sumdrivetime:0,
						speedgreater10time:0,
						speedgreater80time:0
					}
				}
				
				resData[item.day]['sumdrivedistance'] += distancce
				resData[item.day]['sumdrivetime'] += drivetime
				resData[item.day]['speedgreater10time'] += speedgreater10
				resData[item.day]['speedgreater80time'] += speedgreater80
			})
			
			const categories = uniqArr(cateArr)
			
			chartData={
				distancceObj:{ // 所有车辆驾驶总里程总览
					categories,
					series:[
						{
							name: '所有车辆驾驶总里程',
							color:"#6970e2",
							data: categories.map(i=>(resData[i]['sumdrivedistance']).toFixed(2))
							// data: categories.map(i=>(Math.round(resData[i]['sumdrivedistance']) * 100) / 100)
						}
					]
				},
				drivetimeObj:{ // 所有车辆驾驶总时长总览
					categories,
					series:[
						{
							name: '所有车辆驾驶总时长',
							color:"#6970e2",
							data: categories.map(i=>(resData[i]['sumdrivetime']).toFixed(2))
							// data: categories.map(i=>(Math.round(resData[i]['sumdrivetime']) * 100) / 100)
						}
					]
				},
				speedgreaterObj:{ // 所有车辆驾不同驶速度的时长分布统计
					categories,
					series:[
						{
							name: '速度大于等于10的总时长',
							color:"#6970e2",
							data: categories.map(i=>(resData[i]['speedgreater10time']).toFixed(2))
							// data: categories.map(i=>(Math.round(resData[i]['speedgreater10time']) * 100) / 100)
						},
						{
							name: '速度大于等于80的时长',
							color:"#9A60B4",
							data: categories.map(i=>(resData[i]['speedgreater80time']).toFixed(2))
							// data: categories.map(i=>(Math.round(resData[i]['speedgreater80time']) * 100) / 100)
						}
					]
				}
			}
		}
		const end = new Date().getTime()
		console.log('=================',(end-start)/1000,chartData)
		return {
			chartData,
			chartNumArr:[
				[
					{
						id:'distancceNum',
						label:'驾驶里程总计 (Km)',
						value:getSum(chartData.distancceObj.series[0].data) || '--'
					},
					{
						id:'drivetimeNum',
						label:'驾驶时长总计 (h)',
						value:getSum(chartData.drivetimeObj.series[0].data) || '--'
					},
				],
				[
					{
						id:'speedgreater10timeNum',
						label:'速度大于10的时长总计 (h)',
						value:getSum(chartData.speedgreaterObj.series[0].data) || '--'
					},
					{
						id:'speedgreater80timeNum',
						label:'速度大于80的时长总计 (h)',
						value:getSum(chartData.speedgreaterObj.series[1].data) || '--'
					},
				]
			],
			isOk:true
		}
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

