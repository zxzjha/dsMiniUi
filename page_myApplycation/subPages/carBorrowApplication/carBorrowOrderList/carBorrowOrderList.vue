<template>
	<view class="page-car-borrow-order-list">
		<view class="status-radio-box">
			<u-radio-group v-model="ongoing" @change="groupChange" placement="row" iconPlacement="left">
				<view class="radio-wrapper">
					<u-radio
						v-for="item in radioList"
						:key="item.id"
						activeColor="#423bb3"
						shape="circle"
						:labelDisabled="false" 
						:name="item.value" 
						:label="item.label"
					></u-radio>
				</view>
			</u-radio-group>
		</view>
		
		<view class="scroll-box">
			<scroll-view class="scroll-view-box" :scroll-top="0" :lower-threshold="50" :scroll-y="true" @scrolltolower="debounceScrolltolower">
				<view v-for="(item, index) in tableData" :key="item.id" :id="item.id" class="card-item" :style="{background:orderStatusEnum[item.status]['bgColor']}" @click="toOrderDetailPage(item)">
					<view class="card-top-box">
						<text>VIN号：{{item.vehicle.vin}}</text>
						<text class="status-text">{{item.latestOrderSatus}}</text>
					</view>
					<view class="card-center-box">
						<view class="time-line-box">
							<text class="custom-icon" style="color:#fff;font-size: 56rpx !important;">&#xe61d;</text>
							<view class="time-box">
								<text>{{item.startTime.slice(0,10)}}</text>
								<text>{{item.startTime.slice(-8)}}</text>
							</view>
						</view>
						<text class="custom-icon" style="color:#fff;font-size: 120rpx !important;">&#xe8f9;</text>
						<view class="time-line-box">
							<text class="custom-icon" style="color:#fff;font-size: 56rpx !important;">&#xe61c;</text>
							<view class="time-box">
								<text>{{item.endTime.slice(0,10)}}</text>
								<text>{{item.endTime.slice(-8)}}</text>
							</view>
						</view>
					</view>
					<view class="card-buttom-box">
						<text>订单编号：{{item.orderNum}}</text>
						<u-icon name="more-circle" color="#cdcdcd" size="24"></u-icon>
					</view>
				</view>
				
				<view style="margin-top: 15rpx;"></view>
				<u-loadmore v-if="!(tableData.length==0 && loadStatus=='nomore')" :status="loadStatus" loading-text="努力加载中" loadmore-text="轻轻上拉" nomore-text="—· END ·—"/>
				<u-empty
					:show="tableData.length==0 && loadStatus=='nomore'"
					mode="data"
					textSize="18"
					width="320"
					height="320"
					marginTop="40%"
					icon="http://cdn.uviewui.com/uview/empty/data.png"
				>
				</u-empty>
			</scroll-view>
			
		</view>
	</view>
</template>

<script>
	import apiLib from '@/api/api.js'
	import {deepClone,debounce} from '@/lib/lib.js'
	import {orderStatusEnum,ongoingList} from '@/page_carBorrow/const.js'
	
	export default {
		name:'car-borrow-verify-list', // 借车申请订单列表
		data() {
			return {
				ongoing:'',
				tableData:[],
				pageSize:10,
				pageNum:0,
				total:0,
				loadStatus:'loadmore', // loadmore
				orderStatusEnum,
				radioList:ongoingList,
				debounceScrolltolower:debounce(this.scrolltolower)
			};
		},
		onLoad(){
			this.refreshData()
		},
		async onPullDownRefresh(){ // 下拉刷新
			this.refreshData()
			uni.stopPullDownRefresh()
		},
		methods:{
			scrolltolower(){ // 滚动到底部触发事件
				if(this.tableData.length < this.total){
					this.getDataList()
				}
			},
			async getDataList(){ // 获取我的借车申请订单
				if (this.loadStatus === 'loading') return
				const params = {
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					ongoing:this.ongoing
				}
				
				this.loadStatus = 'loading'
				
				const res = await apiLib.getBorrowOrderList(params)
				
				if(res.isOk){
					const data = res.data || {itemList:[],total:0}
					if(data.itemList && data.itemList.length>0){
						this.tableData.push(...data.itemList)
						this.total = data.total
						
						this.tableData.length<this.total && (this.pageNum+=1)
					}
				}
				this.loadStatus = this.tableData.length>=this.total?'nomore':'loadmore'
			},
			async refreshData(){ // 刷新数据
				this.tableData=[]
				this.total=0
				this.pageNum=0
				this.loadStatus='loadmore'
				await this.getDataList()
			},
			groupChange(e){
				this.ongoing = `${e}`
				this.refreshData()
			},
			toOrderDetailPage(item){ // 去查看申请订单详情
				const refreshData = this.refreshData
				uni.navigateTo({
					url:'/page_myApplycation/subPages/carBorrowApplication/carBorrowOrderDetail/carBorrowOrderDetail',
					events:{
						getFormData(data){ // 
							refreshData()
							console.log(data,'getFormData')
						}
					},
					success(res,self) {
						// 跳转成功后,向目标页面传送数据
						res.eventChannel.emit('pushInitData',{...item})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-car-borrow-order-list{
		height: 100vh;
		.status-radio-box{
			height: 90rpx;
			display: flex;
			align-items: center;
			padding: 0 40rpx;
			background: linear-gradient(145deg, #ebebf1, #e7e8f1);
			box-shadow: 20px 20px 60px #e9eaef, -20px -20px 60px #ffffff;
			.radio-wrapper{
				width: 100%;
				display: flex;
				justify-content: space-between;
			}
		}
		.scroll-box{
			.scroll-view-box{
				height: 86vh;
				.card-item{
					margin: 20rpx;
					padding: 20rpx;
					background: linear-gradient(45deg, #7F8FFF, rgba(81, 88, 244, 0.2));
					background: #7f8fff;
					border-radius: 20rpx 20rpx 0 0;
					color: #fff;
					.card-top-box{
						position: relative;
						color:#e8e8e8;
						.status-text{
							position: absolute;
							right: 0;
							font-size: 36rpx;
							font-weight: 500;
							color: #fff;
						}
					}
					.card-center-box{
						display: flex;
						justify-content: space-around;
						margin: 40rpx 0;
						.time-line-box{
							display: flex;
							flex-direction: column;
							align-items: center;
							.time-box{
								display: flex;
								flex-direction: column;
								align-items: center;
							}
						}
					}
					.card-buttom-box{
						display: flex;
						justify-content: space-between;
						color:#e8e8e8;
					}
				}
			}
		}
	}
	
</style>
