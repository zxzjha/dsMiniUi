export const iconList = [ // 没设authCodeArr则表示不需要权限
	{
		iconClass:'t-icon-64 t-icon-cheliangjieyongshenqing-01-copy-copy-copy-copy', // 借车表单
		title:'借车',
		// authCodeArr:['carborrowmanage'],
		path:'/page_carBorrow/borrowCar/borrowCar',
		// path:'',
	},
	{
		iconClass:'t-icon-64 t-icon-car', // 车辆管理
		title:'车辆管理',
		authCodeArr:['carinfomanage'],
		path:'/page_testCarManage/carInfoManage/carInfoManage',
	},
	{
		iconClass:'t-icon-64 t-icon-guiji', // 测试车总览
		title:'测试车总览',
		authCodeArr:['carinfomanage'],
		path:'/page_testCarOverview/testCarOverview/testCarOverview'
	}
]

export const defautList=[ // 如果本地获取不到list，这个备用
	{
		iconClass:'t-icon-64 t-icon-cheliangjieyongshenqing-01-copy-copy-copy-copy', // 借车表单
		title:'借车',
		// authCodeArr:['carborrowmanage'],
		path:'/page_carBorrow/borrowCar/borrowCar',
		// path:'',
	},
]