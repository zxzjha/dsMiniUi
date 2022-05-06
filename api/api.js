// 将项目所有接口api注入

const context = require.context('./common', false, /\.js$/)

const apiLib = {}

context.keys().forEach(key => {
	//通过 context(key)导出文件内容
	const apis = context(key)
	
	Object.assign(apiLib,apis)
})

export default apiLib