import store from '@/store/index.js'  //引入vuex
import {isNotNil} from '@/lib/lib.js'

export class Request {
	constructor(extraConfig={},hasToken=true) {  // hasToken:true // 请求是否带token，默认 true
	  this.defaultConfig = { // 默认配置
			timeout:6000,
			dataType:'json',
			// header:{
			// 	saicid:100441,
			// 	apikey:'7SSmMcZNJb7TRYFbWSKZQUTJnC8nI6eC',
			// 	openid:store.state.baseStore.openid,
			// 	"Content-Type": "application/x-www-form-urlencoded",
			// }
		}
		
		this.hasToken = hasToken
		
		this.config = { // merge 后的配置
			...this.defaultConfig,
			...extraConfig
		}
		
		this.fetch = this.sendRequest.bind(this)
		this.exFetch = this.exSendRequest.bind(this)
	}
	
	sendRequest(url='',params={},method="GET"){ // 全局错误处理只做到res.statusCode级别
		const header_config = {
			...this.config.header
		}
		this.hasToken && (header_config.token = store.state.baseStore.token)
		
		return new Promise((resolve,reject)=>{
			uni.request({
				url: url, 
				method:method.toUpperCase(),
				data: params,
				header: header_config,
				success: (res) => {
					console.log(res,'sendRequest---success')
					if(`${res.statusCode}`.startsWith('2')){
						resolve(res.data)
					}else{
						const {data} = res || {data:{}}
						this.actWithErr(res.statusCode,data)
						
						reject(res.data)
					}
				},
				fail:(err)=>{
					reject(err.response || err)
				}
			})
		})
	}
	
	exSendRequest(url='',params={},method="GET",errException={errMessage:'请求出错了，请稍后再试！',hasErrMessage:true}){
		// 全局错误处理做到res.data.code级别
		const header_config = {
			...this.config.header
		}
		this.hasToken && (header_config.token = store.state.baseStore.token)
		
		return new Promise((resolve,reject)=>{
			uni.request({
				url: url, 
				method:method.toUpperCase(),
				data: params,
				header: header_config,
				success: (res) => {
					console.log(res,'exSendRequest---success')
					
					if(`${res.statusCode}`.startsWith('2')){
						const {code,data} = res.data || {data:{}}
						if(code===200){
							resolve(res.data)
						}else{
							const dMessage = (data.data || {}).message
							const text = dMessage || data.message || errException.errMessage
							errException.hasErrMessage && isNotNil(text) && uni.$u.toast(text)
							
							reject(res.data)
						}
					}else{
						console.log(res,'else----ooo')
						const {data} = res || {data:{}}
						this.actWithErr(res.statusCode,data)
						
						reject(res.data)
					}
				},
				fail:(err)=>{
					console.log(err,'exSendRequest---error')
					// const {data} = err.response.data || {data:{}}
					uni.$u.toast(err.errMsg || '请求出错了，请稍后再试！')
					
					reject(err.response || err)
				}
			})
		})
	}
	
	actWithErr(statusCode,data){ // 做出相应错误处理
		const dMessage = (data.data || {}).message
		const text = dMessage || data.message
		
		switch(statusCode){
			case 401:
			case 403: 
				store.dispatch('baseStore/updateToken','')
				store.dispatch('baseStore/updateOpenid','')
				store.dispatch('baseStore/updateUserInfo',{})
				
				const pages = getCurrentPages() /// 页面栈
				const curPage = pages[pages.length-1] // 当前页
				curPage && curPage.route!=='pages/login/login' && uni.redirectTo({
					url: '/pages/login/login'
				})
				
				uni.$u.toast(text || '您还未登录或登录状态失效，请您登录！')
				
				break;
			case 400:
			case 404:
			case 500:
				
				uni.$u.toast(text || '请求出错了，请稍后再试！')
				break;
			default:
				uni.$u.toast(text || '请求出错了，请稍后再试！')
				break;
		}
	}
}

const COM_HEADER = {
	header: {
		saicid:100441,
		apikey:'7SSmMcZNJb7TRYFbWSKZQUTJnC8nI6eC',
		openid:store.state.baseStore.openid,
		"Content-Type": "application/x-www-form-urlencoded",
	}
}

/**------------  1. status===200的接口不做细化处理  ------------*/
// ---- 请求带token ----
	export const fetch = new Request({...COM_HEADER},true).fetch

// ---- 请求不带token ----
	export const fetchWithoutToken = new Request({...COM_HEADER}, false).fetch


/**------------  2. status===200的接口做细化处理  ------------*/
// ---- 请求带token ----
	export const exFetch = new Request({...COM_HEADER},true).exFetch

// ---- 请求不带token ----
	export const exFetchWithoutToken = new Request({...COM_HEADER}, false).exFetch
	
 // ============================= 地 图 相 关 接 口 =================================
 
const MAP_HEADER = {
	header: {
		AccessKey: '2AA4D5D4FE1D533EB9A998CDC8B19999',
		AccessSecret: 'CDAAAFCB8FEF5662A7FAA9B52DDAE83C'
	}
}	

/**------------  1. status===200的接口不做细化处理  ------------*/
// ---- 请求不带token ----
	export const map_fetch = new Request({...MAP_HEADER},false).exFetch

