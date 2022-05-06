import {getStorageValue} from '@/lib/lib.js'
import {iconList} from '@/pages/tabs/tab-workbench/const.js'

export default {
	namespaced: true,
	state: {
		token: getStorageValue('token',''),
		openid:getStorageValue('openid',''),
		userInfo: getStorageValue('userInfo',{}),
		
		authResourceLib: getStorageValue('authResourceLib',[]), // 用户能访问的资源列表
		authWorkbenchNavList: getStorageValue('authWorkbenchNavList',[]), // 用户在工作台能进的入口
		projectList:getStorageValue('projectList',[])// 项目列表
	},
	getters: {
		token(state){
			return state.token
		},
		openid(state){
			return state.openid
		},
		userInfo(state){
			return state.userInfo
		},
		authResourceLib(state){// 用户能访问的资源列表
			return state.authResourceLib
		},
		authWorkbenchNavList(state){// 用户在工作台能进的入口
			return state.authWorkbenchNavList
		},
		projectList(state){ // 项目列表
			return state.projectList
		}
	},
	actions: {
		updateToken(context, token) {
			context.commit('SET_TOKEN', token)
		},
		updateOpenid(context, openid) {
			context.commit('SET_OPENID', openid)
		},
		updateUserInfo(context, userInfo) {
			context.commit('SET_USER_INFO', userInfo)
		},
		updateAuthResourceLib(context, authResourceLib){ // 获取用户能访问的所有资源列表，并计算工作台能访问的入口列表，存起来
			const pageCodeList = authResourceLib.filter(block=>block.type==='PAGE').map(item=>item.code)
			const navList = iconList.filter(j=>{ // 计算工作台能访问的入口列表 navList
				let isAuthed = ''
				if(!j.authCodeArr){
					isAuthed=true
				}else{
					isAuthed = j.authCodeArr.some(code=>pageCodeList.includes(code))
				}
				return isAuthed
			})
			
			console.log(navList,'updateAuthResourceLib---navList')
			context.commit('SET_AUTH_RESOURCE_LIB', authResourceLib)  // 存储资源总列表
			context.commit('SET_AUTH_WORKBENCH_NAV_LIST', navList)  // 存储工作台能访问的列表
			
		},
		updateProjectList(context, projectList){
			context.commit('SET_PROJECT_LIST', projectList)  // 项目列表
		}
	},
	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
			uni.setStorageSync('token', token)
		},
		SET_OPENID:(state, openid)=>{
			state.openid = openid
			uni.setStorageSync('openid', openid)
		},
		SET_USER_INFO: (state, userInfo) => {
			state.userInfo = userInfo
			uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		},
		SET_AUTH_RESOURCE_LIB:(state, authResourceLib)=>{
			state.authResourceLib = authResourceLib
			uni.setStorageSync('authResourceLib', JSON.stringify(authResourceLib))
		},
		SET_AUTH_WORKBENCH_NAV_LIST:(state, authWorkbenchNavList)=>{
			state.authWorkbenchNavList = authWorkbenchNavList
			uni.setStorageSync('authWorkbenchNavList', JSON.stringify(authWorkbenchNavList))
		},
		SET_PROJECT_LIST:(state, projectList)=>{
			state.projectList = projectList
			uni.setStorageSync('projectList', JSON.stringify(projectList))
		}
	} 
}
