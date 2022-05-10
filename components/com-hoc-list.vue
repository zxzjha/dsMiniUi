<template>
	<view class="com-hoc-list">
		<view class="scroll-box">
			<scroll-view class="scroll-view-box" :style="{height:scrollBoxHeight}" :scroll-top="0" :lower-threshold="10" :scroll-y="true" @scrolltolower="debounceScrolltolower">
				<slot name="content"></slot>
				
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
	import {debounce} from '@/lib/lib.js'
	
	export default {
		name:'com-hoc-list', // 通用组件 list
		props:{
			scrollBoxHeight:{
				default(){
					return '95vh'
				}
			},
			inquireName:{ // api 名称
				default(){
					return ''
				}
			},
			extraParams:{ // 请求数据需要传的额外的参数
				default(){
					return {}
				}
			},
			extraStyle:{
				default(){
					return {}
				}
			},
			tData:{ // 初始化数据（:tData.sync="tableData"）
				default(){
					return []
				}
			}
		},
		data() {
			return {
				tableData:this.tData,
				pageSize:10,
				pageNum:0,
				total:0,
				loadStatus:'loadmore', // loadmore
				
				debounceScrolltolower:debounce(this.scrolltolower)
			};
		},
		watch:{
			tableData:{
				handler(newValue){
					this.$emit('update:tData',this.tableData)
					
					this.$emit('getListData',{tableData:this.tableData,total:this.total})
				},
				deep:true
			}
		},
		mounted() {
			this.refreshData()
		},
		async onPullDownRefresh(){ // 下拉刷新
			await this.refreshData()
			uni.stopPullDownRefresh()
		},
		methods:{
			scrolltolower(){ // 滚动到底部触发事件
				if(this.tableData.length < this.total){
					this.getDataList()
				}
			},
			async getDataList(){ // 获取tableData
				if (this.loadStatus === 'loading') return
				
				const params = Object.assign({},{
					pageNum:this.pageNum,
					pageSize:this.pageSize,
				},{
					...this.extraParams
				})
				
				this.loadStatus = 'loading'
				
				const res = await apiLib[this.inquireName](params)
			/* 
			 * 公共组件对后台返回数据 res 有统一格式要求：
			    res = {
			   		isOk:true,
			   		data:{
							itemList:[],
							total:0,
						}
			  	}
			 */	
				
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
			refreshData(){ // 刷新数据
				console.log('refresh-------')
				this.tableData=[]
				this.total=0
				this.pageNum=0
				this.loadStatus='loadmore'
				this.getDataList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.com-hoc-list{
		.scroll-box{
			.scroll-view-box{
				// height: 86vh;
			}
		}
	}
</style>
