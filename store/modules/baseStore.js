import {getStorageValue} from '@/lib/lib.js'
import {iconList} from '@/pages/tabs/tab-workbench/const.js'

const state = {
	token: getStorageValue('token',''),
	openid:getStorageValue('openid',''),
	userInfo: getStorageValue('userInfo',{}),
	
	authResourceLib: getStorageValue('authResourceLib',[]), // 用户能访问的资源列表
	authWorkbenchNavList: getStorageValue('authWorkbenchNavList',[]), // 用户在工作台能进的入口
	
	projectList:getStorageValue('projectList',[]), // 项目列表
	departmentList:getStorageValue('departmentList',[]), // 部门列表
	userList:getStorageValue('userList',[]), //用户列表
	departUserList: getStorageValue('departUserList',[]),// 用户部门列表
}

const getters = {
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
	},
	async departmentList(state){ // 部门列表
		return state.departmentList
	},
	async userList(state){ // 用户列表
		return state.userList
	},
	departUserList(state){
		return state.departUserList
	}
}

var actions = {
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
		
		context.commit('SET_AUTH_RESOURCE_LIB', authResourceLib)  // 存储资源总列表
		context.commit('SET_AUTH_WORKBENCH_NAV_LIST', navList)  // 存储工作台能访问的列表
		
	},
	updateProjectList(context, projectList){ // 项目列表
		context.commit('SET_PROJECT_LIST', projectList)  
	},
	updateDepartmentList(context, departmentList){ // 部门列表
		context.commit('SET_DEPARTMENT_LIST', departmentList) 
	},
	updateUserList(context, userList){ // 用户列表
		context.commit('SET_USER_LIST', userList)
	},
	updateDepartUserList(context, departUserList){ // 用户部门列表
		context.commit('SET_DEPART_USER_LIST', departUserList)
	}
}
	
var mutations = {
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
	SET_AUTH_WORKBENCH_NAV_LIST:(state, authWorkbenchNavList)=>{ // 用户在工作台能进的入口
		state.authWorkbenchNavList = authWorkbenchNavList
		uni.setStorageSync('authWorkbenchNavList', JSON.stringify(authWorkbenchNavList))
	},
	SET_PROJECT_LIST:(state, projectList)=>{ // 项目列表
		state.projectList = projectList
		uni.setStorageSync('projectList', JSON.stringify(projectList))
	},
	SET_DEPARTMENT_LIST:(state, departmentList)=>{ // 部门列表
		state.departmentList = departmentList
		uni.setStorageSync('departmentList', JSON.stringify(departmentList))
	},
	SET_USER_LIST:(state, userList)=>{ // 用户列表
		state.userList = userList
		uni.setStorageSync('userList', JSON.stringify(userList))
	},
	SET_DEPART_USER_LIST:(state, departUserList)=>{ // 用户部门列表
		state.departUserList = departUserList
		uni.setStorageSync('departUserList', JSON.stringify(departUserList))
	}
}
 
const store = {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}

export default store
