import { exFetch,exFetchWithoutToken } from "../index.js"

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
		console.log(err)
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





