import { exFetch } from "../index.js"
import {orderStatusEnum} from '@/page_carBorrow/const.js'
import {isNotNil} from '@/lib/lib.js'

const exceptionTemp = {errMessage:'请求出错了，请稍后再试！', hasErrMessage:true}
const BaseUrl = 'https://api-njdm-pv.saicmotor.com/adcdataplat/sys/vehicle-management'

const calcUrl = (params = {},type='GET',str) => { 
	const method = type.toUpperCase()
  const extra = method === 'PUT' ? (isNotNil(params.id) ? params.id : '') : ''
  return `${BaseUrl}/${str}/${extra}`
}

// -------------   借车   -------------

export const getVinOrderList = async (params = {},type='GET') => { // 获取VIN列表（其中包含每辆车当月绑定的所有订单）(pageSize,pageNum)
  try {
    const res = await exFetch(calcUrl(params,type,'vehicle-borrow/current'), params, type)
    res.isOk=true
		return res
  }catch(err){
    return {isOk:false}
  }
}

export const getOrderListByParam = async (params = {},type='GET') => { // 根据vin，year，month 来查询该车辆某月的所有订单
  try {
    const res = await exFetch(calcUrl(params,type,'vehicle-borrow/filter'), params, type)
    res.isOk=true
		return {
			isOk: true,
			itemList:(res.data || {itemList:[]}).itemList,
			total:(res.data || {total:0}).total
		}
  }catch(err){
    return {isOk:false}
  }
}

export const createBorrowOrder = async (params = {},type='POST',errException={ ...exceptionTemp }) => { // 预约用车，创建借车订单
  try {
    const res = await exFetch(calcUrl(params, type, 'vehicle-borrow/create'), params, type,errException)
    res.isOk=true
		return res
  }catch(err){
    return {isOk:false}
  }
}

export const getBorrowOrderList = async (params = {},type='GET') => { // 获取我的借车订单列表
  try {
    const res = await exFetch(calcUrl(params, type, 'vehicle-borrow/my-borrow'), params, type)
    if (res.code === 200) { 
      res.data.itemList && res.data.itemList.forEach(item => { 
        item.latestOrderSatus = item.orderProcesses && item.orderProcesses[0] && item.orderProcesses[0].status?`${orderStatusEnum[item.orderProcesses[0].status]['desc']}`:'--'
        item.status = item.orderProcesses && item.orderProcesses[0] && item.orderProcesses[0].status?item.orderProcesses[0].status:''
        item.vin = item.vehicle && item.vehicle.vin? item.vehicle.vin:''
        item.trueName = item.borrower && item.borrower.trueName? item.borrower.trueName:''
			})
    }
		res.isOk = true
    return res
  }catch(err){
    return {isOk:false}
  }
}

export const getVerifyOrderList = async (params = {},type='GET') => { // 获取我的审核订单列表
  try {
    const res = await exFetch(calcUrl(params, type, 'vehicle-borrow/my-audit'), params, type)
		if (res.code === 200) {
      res.data.itemList && res.data.itemList.forEach(item => { 
        item.latestOrderSatus = item.orderProcesses && item.orderProcesses[0] && item.orderProcesses[0].status?`${orderStatusEnum[item.orderProcesses[0].status]['desc']}`:'--'
        item.status = item.orderProcesses && item.orderProcesses[0] && item.orderProcesses[0].status?item.orderProcesses[0].status:''
        item.vin = item.vehicle && item.vehicle.vin? item.vehicle.vin:''
        item.trueName = item.borrower && item.borrower.trueName? item.borrower.trueName:''
			})
    }
		res.isOk = true
    return res
  }catch(err){
    return {}
  }
}

export const editOrderStatus = async (params = {},type='POST',errException={ ...exceptionTemp }) => { // 更改订单状态
  try {
    const res = await exFetch(calcUrl(params, type, 'vehicle-borrow/operate'), params, type, errException)
    res.isOk = true
    return res
  }catch(err){
    return {
      isOk:false
    }
  }
}

// -------------   车辆信息管理   -------------

export const getVehicleProject = async (params = {},type='get') => { // 获取项目列表
  try {
    const res = await exFetch(calcUrl(params,type,'vehicle-project'), params, type)
    return res?.data?.itemList || []
  } catch (err) {
    return []
  }
}

export const getVehicleInfoList = async (params = {}, type = 'GET') => { // 获取车辆信息列表(get)
  try {
		const res = await exFetch(calcUrl(params, type, 'vehicle-info'), params, type)
		
		if (res.code === 200) {
      res.data && res.data.itemList && res.data.itemList.forEach(item => { 
        item.ownerId = item.owner.id
        item.ownerDesc = item.owner.trueName || '--'
        item.governingUserId = item.governingUser.id
        item.governingUserDesc = item.governingUser.trueName || '--'
        item.createUserDesc = item.createUser.trueName || '--'
        item.lastModifyUserDesc = item.lastModifyUser.trueName || '--'
				item.isPublicDesc = isNotNil(item.isPublic)?(item.isPublic?'公开':'非公开'):'--'
			})
    }
		res.isOk = true
    return res
  } catch (err) {
    return {
      isOk:false
    }
  }
}

export const updateVehicleInfoList = async (params = {}, type = 'GET', isExFetch = false,errException={ ...exceptionTemp }) => { // 新增/编辑车辆信息(post)
  const url = calcUrl(params, type, 'vehicle-info')
  try {
    const res = await exFetch(url, params, type,errException)
		res.isOk = true
    return res
  } catch (err) {
    return {isOk:false}
  }
}