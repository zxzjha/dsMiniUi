<template>
	<view class="com-car-item">
		<view class="title-line">
			<text class="title-text">{{itemId}}. {{initialData.vin || ''}}</text>
			<view class="tip-line-wrapper">
				<view class="tip-line">
					<view class="tip-item" v-for="i in 1" :key="i">
						<view class="tip-title">{{i===0?'可预约':'不可预约'}}</view>
						<view class="tip-color-item" :style="{backgroundColor:i===0?'#9ff6cc':'#e8e8e8'}"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="content-wrapper">
			<view class="func-line">
				<view class="select-mon-box">
					<view class="mon-select-icon-box" @click="onFrontMonth">
						<text class="custom-icon add-icon-style" :style="{color:curIndex==0?'#808080':'#00f5d4'}">&#xe600;</text>
					</view>
					<view class="month-text">{{monArr[curIndex]}}</view>
					<view class="mon-select-icon-box" @click="onBackMonth">
						<text class="custom-icon add-icon-style"style="color: #00f5d4;">&#xe626;</text>
					</view>
				</view>
				<view class="borrow-btn-box">
					<u-button color="#00f5d4" :customStyle="{padding:'0 30rpx'}" text="预约" shape="circle" size="small" @click="borrowCar"><text class="custom-icon" style="margin-right: 10rpx;">&#xe679;</text> 预约</u-button>
				</view>
			</view>
			<view class="time-table">
				<view class="hour-lable-box">
					<view class="hour-lable-item" v-for="item in 8" :key="item">{{`0${item+8}:00`.slice(-5)}}~{{`0${item+9}:00`.slice(-5)}}</view>
				</view>
				<view class="month-box" @touchstart="onTouchstart">
					<!-- <view class="date-line-box" :style="{gridTemplateColumns: `repeat(${calcMonLen(monArr[curIndex])},1.8em)`}">
						<text :class="['day-date',calcIsWeekday(`${monArr[curIndex]} ${d+1}日`)?'':'add-weekend-style']" v-for="d in calcMonLen(monArr[curIndex])" :key="d">{{d+1}}</text>
					</view> -->
					<view class="date-line-box" :style="{gridTemplateColumns: `repeat(${calcDateLableArr(monArr[curIndex]).len},1.8em)`}">
						<text :class="['day-date',calcIsWeekday(`${monArr[curIndex]} ${d}日`)?'':'add-weekend-style']" v-for="d in calcDateLableArr(monArr[curIndex]).dateArr" :key="d">{{d}}</text>
					</view>
					
					<view class="hour-box" :style="{gridTemplateColumns: `repeat(${calcMonLen(monArr[curIndex])},1.8em)`}">
						<view @click="onCheckHour(h)" :class="['hour-item',h.isChecked?('hour-checked-style'):(h.isAvailable?'green-bg':'grey-bg')]" v-for="(h,ind) in getMonthBlock(monArr[curIndex])" :key="ind"></view>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="checked-tip-box">
			{{showH && showH.length>0?`已选择：${showH[0]} ~ ${showH[1]}`:''}}
			<u-icon v-if="showH && showH.length>0" @click="onResetCheckedTime" name="close-circle-fill" color="#f55100"></u-icon>
		</view>	
		
		<view :class="['text-line',tipTextShow?'':'hide-tip-text']"> 向右滑可看到更多 >> </view>
	</view>
</template>

<script>
	import moment from 'moment'
	import apiLib from '@/api/api.js'
	import {isNotNil, deepClone} from '@/lib/lib.js'
	
	export default {
		name:'com-car-item',
		props:{
			itemId:{ // caritem-id
				default(){
					return 1
				}
			},
			initialData:{
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				curIndex:0, // 当前展示月份的index
				monArr:[moment().format('YYYY年 MM月')], // 展示的月份，默认首项是当月,如 ['2022年 02月']
				hourArr:[],// 所有小时块
				checkedHour:[], // 所选时间
				tipTextShow:true, // '向右滑可看到更多 >>'提示是否展示
			}
		},
		mounted(){
			this.initData()
		},
		computed: {
      showH: function () {
        const newValue = this.checkedHour || []
        const arr = newValue.length>0?(newValue.length<2?([...newValue[0]]):([newValue[0][0],newValue[1][1]])):([])
        const res = arr.map(i=>moment(i).format('YYYY-MM-DD HH:mm:ss'))
				return res
      }
    },
		methods: {
			initData(){ // 初始化carItem数据
        const list = this.initialData.orderList || []
        
        if(Object.keys(this.initialData).length>0){
          this.generateHours(moment().format('YYYY年 MM月'),list)
        }
      },
			calcWhetherOrderd(h,orderTimes){ // 判断当前小时块是否可预约 （1.预约时间段是否与订单已约时间重合，2.预约时间大于当前时间）
        const isOrderd = orderTimes.some(t=>t && t[0] && t[1] && h[0]>=t[0] && h[1]<=t[1]) // true:不可预约
        const isNotExpire = h[0]>moment().valueOf()// true:时间有效
        return !isOrderd && isNotExpire
      },
			generateHours(date,orderList){// 根据该月的orderList生成一个月的hour并push到hourArr中 (date:'2022年 03月')
        const monLen = this.calcMonLen(date)
        const ongoingStatus = ['BOOKING_WAIT','BOOKING_APPROVED','PICKUP_READY','PICKUP_DELAY','PICKUP_DONE','RETURN_TIMEOUT'] // 订单进行中状态值
        const isOngoing = (i)=> ongoingStatus.some(s => i.orderProcesses && i.orderProcesses[0] && i.orderProcesses[0].status===s) // 把进行中的订单筛选出来
        const orderTimes = [];

        orderList.forEach(i=>{
          if(isOngoing(i)){
            if(!!i.startTime && !!i.endTime){
              orderTimes.push([moment(i.startTime,'YYYY-MM-DD HH:mm').valueOf(),moment(i.endTime,'YYYY-MM-DD HH:mm').valueOf()])
            }
          }
        })

        const val = (i)=>i%8>0?i%8:8
        
        for(let d=1;d<=monLen;d++){
          for(let i=1;i<=8;i++){
            const timeL = moment(`${date} ${d}日 ${(val(i))+7}:00`,'YYYY-MM-DD HH:mm').valueOf()
            const timeR = moment(`${date} ${d}日 ${(val(i))+8}:00`,'YYYY-MM-DD HH:mm').valueOf()
            this.hourArr.push({
              time:[timeL,timeR],
              isAvailable:this.calcWhetherOrderd([timeL,timeR],orderTimes),
              isChecked:false
            })
          }
        }
      },
			getMonthBlock(date){ // 从hourArr中抓取某月的数据  (date:'2022年 03月')
        if(this.hourArr.length>0){
          const startTime = moment(`${date} 1日 08:00`,'YYYY-MM-DD HH:mm').valueOf()
          const monLen = this.calcMonLen(date)
          const startIndex = this.hourArr.findIndex(h=>h.time[0]===startTime)
          const endIndex = startIndex+(monLen*8)
					// const data = deepClone(this.hourArr.slice(startIndex,endIndex));
					// data.forEach(i=>{
					// 	// 判断小时块所属日期是否是今天之前的日期
					// 	i.isBeforeToday = moment(i.time[0]).startOf('day').valueOf() < moment().startOf('day').valueOf()
					// })
					
					const data = this.hourArr.slice(startIndex,endIndex).filter(i=>{
						// 判断小时块所属日期是否是今天之前的日期
						const isBeforeToday = moment(i.time[0]).startOf('day').valueOf() < moment().startOf('day').valueOf()
						return !isBeforeToday
					})
          return data
        } 
      },
			async getOneMonList(nextMont){ // 根据车辆vin,year,month查询一个月的所有订单数据
        const year = nextMont.slice(0,4)
        const month = nextMont.slice(-3,-1)
        const res = await apiLib.getOrderListByParam({vin:this.initialData.vin, year, month})
				
				if(res.isOk){
					this.generateHours(nextMont,res.itemList)
					this.monArr.push(nextMont)
					this.curIndex+=1
					console.log(this.monArr,'this.monArr',this.curIndex)
				}
      },
			onFrontMonth(){ // 查询上一个月
				if(this.curIndex==0) return
				this.curIndex -= 1
			}, 
			onBackMonth(){ // 查询下一个月，下一个月没有，则要获取数据
				const monthArrLen = this.monArr.length
				if(this.curIndex < (monthArrLen-1)){
					this.curIndex += 1
				}else{
					const base = this.monArr[monthArrLen-1]
	        const nextMont = moment(moment(base,'YYYY-MM').add(1,'M').valueOf()).format('YYYY年 MM月')
					this.getOneMonList(nextMont)
				}
			},
			onCheckHour(h){ // 选择借车时间 checkAble:true-可选
        if(h.isAvailable && !h.isChecked){
          const len = this.checkedHour.length
          if(len==0){
            this.checkedHour = [[...h.time]]
            const index = this.hourArr.findIndex(i=>i.time[0]===h.time[0])
            
            this.hourArr[index].isChecked = true
          }else{ // 第二个时间中间都是绿的，则都改为已选，若有灰的，则将最后一个绿的变黄
            const indexArr = [...this.checkedHour].map(t=>{
              return this.hourArr.findIndex(i=>i.time[0]===t[0])
            })
            const hIndex = this.hourArr.findIndex(i=>i.time[0]===h.time[0])
            let endIndex = 0
            if(hIndex>indexArr[indexArr.length-1]){ // 往右选
              for(let j=indexArr[indexArr.length-1];j<=hIndex;j++){
                if(this.hourArr[j].isAvailable==false){
                  endIndex = j-1
                  break
                }else{
                  endIndex = j
                  this.hourArr[j].isChecked = true
                }
                
                const t1 = [...this.checkedHour[0]]
                const t2 = [...this.hourArr[endIndex].time]
                this.checkedHour = [[...t1],[...t2]]
              }
            }else if(hIndex<indexArr[0]){ // 往左选
              for(let k=indexArr[0];k>=hIndex;k--){
                if(this.hourArr[k].isAvailable==false){
                  endIndex = k+1
                  break
                }else{
                  endIndex = k
                  this.hourArr[k].isChecked = true
                }

                const t1 = [...this.hourArr[endIndex].time]
                const t2 = [...this.checkedHour[this.checkedHour.length-1]]
                this.checkedHour = [[...t1],[...t2]]
              }
            }
          }
        }
      },
			borrowCar(){
				const borrowFormData = {
					checkedTime:deepClone(this.showH || []),
					vin:this.initialData.vin || '',
					id:this.initialData.id || ''
				}
				const closeBorrowFormModal = this.closeBorrowFormModal
				uni.navigateTo({
					url:'/page_carBorrow/borrowCar/borrowFormCom/borrowFormCom',
					events:{
						getFormData(data){
							console.log(data,'getFormData-caritem')
							closeBorrowFormModal({...data.data})
						}
					},
					success(res,self) {
						// 跳转成功后,向目标页面传送数据
						res.eventChannel.emit('pushInitData',{borrowFormData})
					}
				})
			},
			onResetCheckedTime(){ // 重置选择，清空checkedHour
        const startIndex = this.hourArr.findIndex(i=>i.time[0]===this.checkedHour[0][0])
        const endIndex = this.checkedHour.length>1?(this.hourArr.findIndex(i=>i.time[0]===this.checkedHour[1][0])):startIndex
        for(let j=startIndex;j<=endIndex;j++){
          this.hourArr[j].isChecked = false
        }

        this.checkedHour=[]
      },
			onTouchstart(){ // 监听滑动事件
			  if(this.tipTextShow){
					this.tipTextShow = false
				}
			},
			closeBorrowFormModal(formData={}){ // 预约成功后，将被预约的小时快置灰
        if(formData.startTime && formData.endTime){
          const checkedTime = [moment(formData.startTime,'YYYY-MM-DD HH:mm:ss').valueOf(),moment(formData.endTime,'YYYY-MM-DD HH:mm:ss').valueOf()]
          this.hourArr.forEach(i=>{
            if(i.time[0]>=checkedTime[0] && i.time[1]<=checkedTime[1]){
              i.isAvailable = false
              i.isChecked = false
            }
          })
        }
        this.checkedHour=[]
      },
			calcMonLen(date){ // 获取该月的天数，date:'2022年 02月'
        return moment(date,'YYYY-MM').daysInMonth()
      },
			calcIsWeekday(date){ // date:'2022年 02月 d日' （返回结果是true: 是工作日）
        const dayOfWeek = moment(date,'YYYY-MM-D').format('E')
        return dayOfWeek<6 
      },
			calcDateLableArr(date){ //date:'2022年 02月', 计算日期栏数据（1，2，3，。。。。30）
				const monLen = this.calcMonLen(date)
				const dateArr = [...new Array(monLen).keys()].map(i=>i+1);
				const filterArr = dateArr.filter(d=>moment(`${date} ${d}日`,'YYYY-MM-DD').startOf('day').valueOf() >= moment().startOf('day').valueOf())
				return {
					len:filterArr.length,
					dateArr:[...filterArr] // 例如：[28,29,30]
				}
			}
		}
	}
</script>

<style lang="scss" scoped>	
.com-car-item{
	padding-bottom: 15rpx;
	margin: 25rpx 0;
	border-radius: 20rpx;
	box-shadow: 0px 3px 11px 1px #d9dcd8;
	background: #fff;
	.title-line{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 20rpx;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #46de52;
		font-size: 28rpx;
		color: #fff;
		.title-text{
			font-size: 36rpx;
		}
		.tip-line-wrapper{
			.tip-line{
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				.tip-item{
					display: flex;
					align-items: center;
					margin-left: 20rpx;
					font-size: 24rpx;
					.tip-color-item{
						width: 40rpx;
						height: 20rpx;
						margin-left: 10rpx;
						border-radius: 15rpx;
					}
				}
			}
		}
	}
	.content-wrapper{
		padding: 20rpx;
		.func-line{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 60rpx;
			margin-bottom: 28rpx;
			.select-mon-box{
				display: flex;
				align-items: center;
				.mon-select-icon-box{
					padding: 0 10rpx;
					.add-icon-style{
						font-size: 36rpx;
					}
				}
				.month-text{
					padding-bottom: 6rpx;
					font-size: 32rpx;
					color: #6b6b6b;
				}
			}
			.borrow-btn-box{
				
			}
		}
		.time-table{
			display: flex;
			font-size: 24rpx;
			.hour-lable-box{
				margin-top: 2em;
				margin-right: 20rpx;
				display: grid;
				grid-template-rows: repeat(8,0.8em);
				grid-auto-flow: column;
				grid-gap: 0.7em 0.9em;
				color: #a0a0a0;
				.hour-lable-item{
					padding: 0 14rpx;
					height: 1.2em;
					line-height: 1.2em;
					border-radius: 1em;
					background: #46de52;
					color: #fff;    
				}
			}
			.month-box{
				position: relative;
				width: 100%;
				padding-bottom: 1em;
				overflow: scroll;
				font-size: 24rpx;
				.date-line-box{
					display: grid;
					grid-template-rows: repeat(1,1em);
					grid-gap: 0.6em 0.9em;
					margin-bottom:1em;
					.day-date{
						color: #8a8a8a;
						text-align: center;
					}
					.add-weekend-style{
						color:#d2d4d1;
					}
				}
				.hour-box{
					display: grid;
					grid-template-rows: repeat(8, 0.8em);
					grid-auto-flow: column;
					grid-gap: 0.7em 0.9em;
					.hour-item{
						transform: translateY(0.15em);
						border-radius:0.5em;
						background-color: #e8e8e8; //   6ef3b3c7  e8e8e8
					}
					.hour-checked-style{ // 选中时的样式
						background-color: #d1ff00;
						transform: scale(1.15)
					}
					.green-bg{ // 可预约状态
						background-color: #6ef3b3c7;
					} 
					.grey-bg{ // 不可预约状态
						background-color: #e8e8e8;
					}
				}
			}
		}
	}
	.checked-tip-box{
		display: flex;
		font-size: 24rpx;
		justify-content: space-between;
		padding: 0 20rpx 10rpx;
		color: #585858;
	}
	.text-line{
		text-align: center;
		font-size: 20rpx;
		color: #ababab;
	}
	.hide-tip-text{
		transition: all ease-in-out 0.5s;
		opacity: 0;
	}
}
</style>
