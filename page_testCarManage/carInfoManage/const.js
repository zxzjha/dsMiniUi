export const carInfoColumns=[ // 车辆信息管理列表
	{
    prop:'isOpeningDesc',
    label: '是否开放借出',
  },
	{
    prop:'isPublicDesc',
    label: '借车权限',
  },

//   {
//     prop:'vin',
//     label: 'VIN',
//     fixed: 'left',
//     minWidth:'180px'
//   },
  {
    prop:'governingCode',
    label: '管理编码',
  },
//   {
//     prop:'vehicleProjectDesc',
//     label: '项目号',
//     minWidth:'160px'
//   },
  {
    prop:'ownerDesc',
    label: '车辆归属人',
  },
  {
    prop:'governingUserDesc',
    label: '被委托人',
  },
  {
    prop:'statusDesc',
    label: '车辆委托状态',
  },
	{
    prop:'monitorID',
    label: '监控设备编号',
  },
  {
    prop:'driverDirectionDesc',
    label:'驾驶座方向',
  },
  {
    prop:'color',
    label:'颜色'
  },
  {
    prop:'entrustedStartTime',
    label: '委托管理日期',
  },
  {
    prop:'entrustedEndTime',
    label: '委托管理结束日期',
  },
//   {
//     prop:'licenseNumber',
//     label:'牌照号码'
//   },
  {
    prop:'licenseStartTime',
    label:'牌照开始日期',
  },
  {
    prop:'licenseEndTime',
    label:'牌照结束日期',
  },
   {
    prop:'insuranceStartTime',
    label:'保险开始日期',
  },
   {
    prop:'insuranceEndTime',
    label:'保险结束日期',
  },
  {
    prop:'createUserDesc',
    label:'创建人'
  },
  {
    prop:'createTime',
    label:'创建时间',
  },
  {
    prop:'lastModifyUserDesc',
    label:'更新人'
  },
  {
    prop:'lastModifyTime',
    label:'更新时间',
  }
]

export const statusOptions = [ // 车辆委托状态
  {
    label: '委托ADC测试组管理',
    value:'ADC'
  },
  {
    label: '车辆归属人自行管理',
    value:'ENTRUSTED'
  },
  {
    label: '已归还公司车管',
    value:'DELETED'
  }
]

export const driverDirectionOptions = [ // 驾驶座方向
  {
    label: '左驾',
    value:'LEFT'
  },
  {
    label: '右驾',
    value:'RIGHT'
  }
]
