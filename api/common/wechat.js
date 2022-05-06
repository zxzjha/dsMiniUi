export const wxLogin = async ()=>{ // 微信登录
	try{
		const res = await wechatLogin()
		res.isOk = true
		return res
	}catch(err){
		console.log(err,'wxLogin')
		return {
			isOk:false,
			...err
		}
	}
}

var wechatLogin = ()=>{ // 微信登录 获取js-code
	return new Promise((resolve,reject)=>{
		wx.login({
			success(res) {
				console.log(res,'wx.login-----')
				if(res.code){
					resolve({js_code:res.code})
				}else{
					reject(res)
				}
			},
			fail(err) {
				console.log(err,'wechatlogin-error')
				reject(err)
			}
		})
	})
}