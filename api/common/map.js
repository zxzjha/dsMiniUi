// 车辆监控，第三方接口

import { map_fetch } from "../index.js"
import {uniqArr} from '@/lib/lib.js'

const BaseUrl = 'https://tw1-api.icv-cloud.com'

export const getHistoryData = async (params={})=>{ // 1.历史数据查询
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

export const getTDataDayRes = async(params={})=>{ // 将获取的日统计接口数据进行整合，得到画图直接能用的数据
	// params:{terminalcode:'',starttime:'2021-11-24',endtime:'2021-11-25'}
	// starttime,endtime 必填
	try{
		const res = await map_fetch(`${BaseUrl}/icv/TDataDay/listDayStatistic`,params,'GET')
		let chartData = {}
		if(res.code==200){
			// 过滤出有值的数据
			const list = (res.data||[]).filter(i=>!i.remark)
			
			// 过滤出里程有值的,统计一个月中每天的总里程
			const distanceObj = calcSum(list,'sumdrivedistance','行驶里程')
			
			// 过滤出时长有值的,统计一个月中每天的驾驶时长 sumdrivetime
			const sumdrivetimeObj = calcSum(list,'sumdrivetime','驾驶时长',true)
			
			// 过滤出时长有值的,统计一个月中每天的速度大于等于10的时长
			const speedgreater10timeObj = calcSum(list,'speedgreater10time','每天的速度大于等于10的时长',true)
			
			// 过滤出时长有值的,统计一个月中每天的速度大于等于80的时长
			const speedgreater80timeObj = calcSum(list,'speedgreater80time','每天的速度大于等于80的时长',true)
			// let res = {
			// 	categories: ["2016","2017","2018","2019","2020","2021"],
			// 	series: [
			// 		{
			// 			name: "目标值",
			// 			data: [35,36,31,33,13,34]
			// 		},
			// 		{
			// 			name: "完成量",
			// 			data: [18,27,21,24,6,28]
			// 		}
			// 	]
			// };
			chartData={
				distanceObj,
				sumdrivetimeObj,
				speedgreater10timeObj,
				speedgreater80timeObj
			}
		}
		
		return {
			chartData,
			isOk:true
		}
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

