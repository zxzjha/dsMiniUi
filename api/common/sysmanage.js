import { exFetch,exFetchWithoutToken } from "../index.js"
import {listToTree,deepClone, isNotNil} from '@/lib/lib.js'

const BaseUrl = 'https://api-njdm-pv.saicmotor.com/adcdataplat'

export const login = async (params={}) => { // 登录
	try{
		const res = await exFetchWithoutToken(`${BaseUrl}/sys/sys-management/login/`,params,'POST')
		res.isOk = true
		return res
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

export const getPublicKey = async (params={}) => { // 获取公钥
	try{
		const res = await exFetchWithoutToken(`${BaseUrl}/sys/sys-management/login/`,params,'GET')
		res.isOk = true
		return {
			isOk:true,
			...res.data
		}
	}catch(err){
		err.isOk=false
		console.log(err,'getPublicKey')
		return err
	}
}

export const checkLoginStatus = async (params={}) => { // 验证登录状态是否有效
	try{
		const res = await exFetch(`${BaseUrl}/sys/sys-management/checkLoginStatus/`,params,'GET')
		res.isOk = true
		return res
	}catch(err){
		err.isOk=false
		console.log(err,'checkLoginStatus')
		return err
	}
}

export const unbindWxAccount = async (params={}) => { // 账号解绑微信号
	try{
		const res = await exFetch(`${BaseUrl}/sys/sys-management/unbindWxAccount/`,params,'GET')
		res.isOk = true
		return res
	}catch(err){
		err.isOk=false
		console.log(err)
		return err
	}
}

export const searchUserListOx = async (params = {}) => { // 根据关键字搜索用户列表 params:{keyword:''}
  try {
    const res = await exFetch(`${BaseUrl}/sys/sys-management/searchUser/`, params, 'GET')
    if (res.code === 200) {
      res.data.itemList && res.data.itemList.forEach(item => { 
        item.describeText = `${item.trueName} ${item.email || ''}`
      })
    }
		res.isOk = true
    return res
  } catch (err) {
    return {isOk:false}
  }
}

export const getUserList = async(params = {},type)=>{ // 获取用户列表
  try {
    const res = await exFetch(`${BaseUrl}/sys/sys-management/getUserList/`, params, 'GET')
		const {data={}} = res
		const list = data.itemList || []
		const userList = list && list.map(item=>{
			return {
				...item,
				isActiveDesc:isNotNil(item.isActive)?(item.isActive?'启用':'禁用'):'',
				acount:item.acount,
				name:item.trueName,
				departmentId:item.department.id,
				departmentName:item.department.name,
				isUser:true
			}
		})
    return userList
  } catch (err) {
    return []
  }
}

export const getDepartmentList = async(params = {},type='tree')=>{ // 获取部门列表type:tree--树状列表,list--列表
  try {
    const res = await exFetch(`${BaseUrl}/sys/sys-management/getDepartmentList/`, params, 'GET')
		const {data={}} = res
		const departList = data.itemList || []
		departList && departList.forEach(item=>{
			item.pid = item.id==item.parent?0:item.parent 
		})
		
		let tree = []
		if(type=='tree'){
			const list = deepClone(departList)
			tree = listToTree(list,'id','pid')
		}
    return type=='tree'?tree:departList
  }catch(err){
    return []
  }
}




