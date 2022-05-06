<template>
	<view class="page-borrow-car">
		<view class="top-line">
			<view class="search-input-box">
				<u--input v-model="extraParams.vin" clearable shape="circle" placeholder="请输入vin号"
					prefixIcon="search" prefixIconStyle="font-size: 22px;color: #909399"
					customStyle="box-sizing: border-box;height:68rpx;line-height:68rpx;border-radius: 100rpx 0 0 100rpx;"
				></u--input>
				<view class="search-btn" @click="debounceOnSearch">搜索</view>
			</view>
			<u-icon name="file-text-fill" size="40" color="#00f5d4" customStyle="box-sizing: border-box;height:68rpx;line-height:68rpx;margin-left:20rpx;" @click="toMyOrderList"></u-icon>
		</view>
		<scroll-view class="scroll-view-box" :scroll-top="0" :lower-threshold="50" :scroll-y="true" @scrolltolower="debounceScrolltolower">
			<view v-for="(item,index) in tableData" :id="item.id" :key="item.id">
				<com-caritem :initialData="item" :itemId="index+1" :key="item.id"></com-caritem>
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
</template>

<script>
	import apiLib from '@/api/api.js'
	import {debounce} from '@/lib/lib.js'
	
	export default {
		name:'borrow-car', // 借车
		data() {
			return {
				tableData:[],
				pageSize:10,
				pageNum:0,
				total:0,
				extraParams:{vin:''},
				loadStatus:'loadmore', // loadmore
				debounceScrolltolower:debounce(this.scrolltolower),
				debounceOnSearch:debounce(this.onSearch)
			}
		},
		onLoad(){
			this.getDataList()
			
		},
		async onPullDownRefresh(){ // 下拉刷新
			this.refreshData()
			uni.stopPullDownRefresh()
		},
		methods: {
			onSearch(){ // 根据vin搜索
				this.refreshData()
			},
			scrolltolower(){ // 滚动到底部触发事件
				if(this.tableData.length < this.total){
					this.getDataList()
				}
			},
			toMyOrderList(){
				console.log('toMyOrderList')
				uni.navigateTo({
					url: '/page_myApplycation/subPages/carBorrowApplication/carBorrowOrderList/carBorrowOrderList'
				});
			},
			async getDataList(){ // 获取 tableData
				if (this.loadStatus === 'loading') return
				
				const params = {
					pageSize:this.pageSize,
					pageNum:this.pageNum,
					...this.extraParams
				}
				
				this.loadStatus = 'loading'
				
				const res = await apiLib.getVinOrderList(params)
				console.log(res,'borrowcar')
				if(res.isOk){
					const data = res.data || {itemList:[],total:0}
					
					if(data.itemList && data.itemList.length>0){
						this.tableData.push(...data.itemList)
						this.total = data.total
						
						this.tableData.length<this.total && (this.pageNum+=1)
						
						console.log(this.tableData,'this.tableData')
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
			toOrderList(){ // 去我的订单页
				uni.navigateTo({
					url: '/page_myApplycation/subPages/carBorrowApplication/carBorrowOrderList/carBorrowOrderList'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-borrow-car{
		padding: 10rpx;
		.top-line{
			position: relative;
			display: flex;
			align-items: center;
			padding-bottom: 20rpx;
			.search-input-box{
				display: flex;
				align-items: center;
				flex: 1;
				.search-btn{
					box-sizing: border-box;
					right: 0;
					width: 122rpx;
					height: 68rpx;
					line-height: 68rpx;
					border-radius: 0 100rpx 100rpx 0;
					background: #ccccce; ///#ccccce  #dadbde
					text-align: center;
					letter-spacing: 6rpx;
					color: #fff;
					z-index: 10;
					&:active{
						background-color: #e7e7ea; 
					}
				}
			}
		}
		.scroll-view-box{
			height: 97vh;
			.car-item-box{
				// padding: 10rpx 5rpx;
			}
		}
	}
</style>
