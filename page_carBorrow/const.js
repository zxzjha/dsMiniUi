export const ongoingList = [
	{
		id:'a1',
		label:'进行中',
		value:'true'
	},
	{
		id:'b1',
		label:'已完成',
		value:'false'
	},
	{
		id:'c1',
		label:'全部',
		value:''
	}
]

export const orderStatusEnum = { // 订单状态
  'BOOKING_WAIT': {
    desc: '预约待审核',
    detail: '预约待审核（订单进行中）',
    colorType: 'primary',
		bgColor:'#7f8fff',
    color:'#409EFF'
  },
  'BOOKING_REJECT': {
    desc: '预约被驳回',
    detail: '预约被驳回（订单完成）',
    colorType:'danger',
		bgColor:'#909399',
    color:'#F56C6C'
  },
  'BOOKING_APPROVED': {
    desc: '预约审核通过',
    detail: '预约审核通过（订单进行中）',
    colorType:'primary',
		bgColor:'#7f8fff',
    color:'#409EFF'
  },
  'BOOKING_CANCEL': {
    desc: '预约取消',
    detail: '预约取消（订单完成）',
    colorType:'info',
		bgColor:'#909399',
    color:'#909399'
  },
  'PICKUP_READY': {  // '待提车（还在4小时期限内，订单进行中）（预约时间到了还未提车）'
    desc: '待提车',
    detail: '待提车（订单进行中）',
    colorType:'primary',
		bgColor:'#7f8fff',
    color:'#409EFF'
  },
  'PICKUP_DELAY': {
    desc: '延时提车',
    detail: '延时提车（订单进行中）',
    colorType:'primary',
		bgColor:'#7f8fff',
    color:'#409EFF'
  },
	'PICKUP_TIMEOUT': { //'超时未提车（用车时间开始4，小时内未提车用车起始时间开始，4小时后，未进行任何操作，订单自动取消，订单完成）'
    desc: '超时未提车',
    detail: '超时未提车（用车时间开始4小时后，未进行任何操作，故订单自动关闭，订单完成）',
    colorType:'info',
		bgColor:'#909399',
    color:'#909399'
  },
  'PICKUP_DONE': {
    desc: '提车成功',
    detail: '提车成功（订单提车成功，订单进行中）',
    colorType:'primary',
		bgColor:'#7f8fff',
    color:'#409EFF'
  },
  'RETURN_TIMEOUT': {
    desc: '超时未还',
    detail: '超时未还（订单进行中）',
    colorType:'warning',
		bgColor:'#F56C6C',
    color:'#E6A23C'
  },
  'RETURN_DONE':{
    desc: '还车成功',
    detail: '还车成功（订单完成）',
    colorType:'success',
		bgColor:'#67C23A',
    color:'#67C23A'
  }
}

