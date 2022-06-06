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
		iconClass:'t-icon-64 t-icon-guiji', // 车辆总览
		title:'车辆总览',
		authCodeArr:['carinfomanage'],
		path:'/page_testCarOverview/testCarOverview/testCarOverview'
	},
	{
		iconClass:'t-icon-64 t-icon-fsux_tubiao_guijiditu', // 大禹行
		title:'大禹行',
		// authCodeArr:['carborrowmanage'],
		miniId:'wx6649cb85ca15d7b6',
		path:'',
		isToMini:true  // 是否是跳转到别的小程序
	}
]

export const defautList=[ // 如果本地获取不到list，这个备用
	{
		iconClass:'t-icon-64 t-icon-cheliangjieyongshenqing-01-copy-copy-copy-copy', // 大禹行
		title:'借车',
		// authCodeArr:['carborrowmanage'],
		path:'/page_carBorrow/borrowCar/borrowCar',
		// path:'',
	},
	{
		iconClass:'t-icon-64 t-icon-fsux_tubiao_guijiditu', // 大禹行
		title:'大禹行',
		// authCodeArr:['carborrowmanage'],
		miniId:'wx6649cb85ca15d7b6',
		path:'',
		isToMini:true  // 是否是跳转到别的小程序
	}
]

