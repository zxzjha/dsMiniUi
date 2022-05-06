import { map_fetch } from "../index.js"

const BaseUrl = 'https://tw1-api.icv-cloud.com'

export const getCarList = async (params={}) => { // 登录
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