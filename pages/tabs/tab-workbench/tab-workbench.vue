<template>
	<view class="page-tab-workbench">
		<view class="icon-line-block" v-for="(block,index) in list" :key="index">
			<view class="icon-item" v-for="item in block" :key="item.path" @click="onGoto(item.path)">
				<view :class="item.iconClass"></view>
				<view class="icon-title">{{item.title}}</view>
			</view>
		</view>
		
		<view>
			<com-hoc-dropdown-menu :isAbleSearch="true" axiosRequestApiName="searchUserListOx" 
				:listData.synnc="listData" labelKey="describeText" valueKey="id"
			></com-hoc-dropdown-menu>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import { arrChunk } from '@/lib/lib.js'
	import apiLib from '@/api/api.js'
	// import {iconList} from './const.js'
	
	export default {
		data() {
			return {
				listData:[],
				
				
				
				
				
				list:[],
				share:{
					title:'智驾数据服务平台',
					path:'/pages/index/index',
					imageUrl:'',
					desc:'',
					content:'',
					isOk:true
				}
			}
		},
		computed: {
			...mapState({
				authWorkbenchNavList: state => state.baseStore.authWorkbenchNavList,
			})
		},
		onReady() {
			this.list = arrChunk(this.authWorkbenchNavList,4)
			this.getProjectList()
		},
		methods: {
			async getProjectList(){
				const projectList = await apiLib.getVehicleProject()
				projectList && projectList.length>0 && this.$store.dispatch('baseStore/updateProjectList',projectList)
			},
			onGoto(path){
				console.log(path,'ongoto')
				uni.navigateTo({
				    url: path
				});
			}
		}
	}
</script>

<style lang="scss">
.page-tab-workbench{
	height: 100vh;
	padding: 40rpx 40rpx 20rpx;
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='460' height='760' preserveAspectRatio='none' viewBox='0 0 460 760'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1202%26quot%3b)' fill='none'%3e%3crect width='460' height='760' x='0' y='0' fill='url(%23SvgjsLinearGradient1203)'%3e%3c/rect%3e%3cpath d='M460 0L449.31 0L460 262.02z' fill='rgba(255%2c 255%2c 255%2c .1)'%3e%3c/path%3e%3cpath d='M449.31 0L460 262.02L460 498.90999999999997L337.93 0z' fill='rgba(255%2c 255%2c 255%2c .075)'%3e%3c/path%3e%3cpath d='M337.93 0L460 498.90999999999997L460 568.8499999999999L159.53 0z' fill='rgba(255%2c 255%2c 255%2c .05)'%3e%3c/path%3e%3cpath d='M159.52999999999997 0L460 568.8499999999999L460 597.7699999999999L109.35999999999997 0z' fill='rgba(255%2c 255%2c 255%2c .025)'%3e%3c/path%3e%3cpath d='M0 760L53.82 760L0 638.24z' fill='rgba(0%2c 0%2c 0%2c .1)'%3e%3c/path%3e%3cpath d='M0 638.24L53.82 760L232.44 760L0 470.33000000000004z' fill='rgba(0%2c 0%2c 0%2c .075)'%3e%3c/path%3e%3cpath d='M0 470.33L232.44 760L356.07 760L0 439.04999999999995z' fill='rgba(0%2c 0%2c 0%2c .05)'%3e%3c/path%3e%3cpath d='M0 439.04999999999995L356.07 760L380.76 760L0 243.24999999999994z' fill='rgba(0%2c 0%2c 0%2c .025)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1202'%3e%3crect width='460' height='760' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='-16.3%25' y1='9.87%25' x2='116.3%25' y2='90.13%25' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1203'%3e%3cstop stop-color='rgba(111%2c 146%2c 237%2c 0.17)' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(124%2c 173%2c 237%2c 0.14)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e");
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='460' height='760' preserveAspectRatio='none' viewBox='0 0 460 760'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1286%26quot%3b)' fill='none'%3e%3crect width='460' height='760' x='0' y='0' fill='url(%23SvgjsLinearGradient1287)'%3e%3c/rect%3e%3cpath d='M460 0L449.31 0L460 262.02z' fill='rgba(255%2c 255%2c 255%2c .1)'%3e%3c/path%3e%3cpath d='M449.31 0L460 262.02L460 498.90999999999997L337.93 0z' fill='rgba(255%2c 255%2c 255%2c .075)'%3e%3c/path%3e%3cpath d='M337.93 0L460 498.90999999999997L460 568.8499999999999L159.53 0z' fill='rgba(255%2c 255%2c 255%2c .05)'%3e%3c/path%3e%3cpath d='M159.52999999999997 0L460 568.8499999999999L460 597.7699999999999L109.35999999999997 0z' fill='rgba(255%2c 255%2c 255%2c .025)'%3e%3c/path%3e%3cpath d='M0 760L53.82 760L0 638.24z' fill='rgba(0%2c 0%2c 0%2c .1)'%3e%3c/path%3e%3cpath d='M0 638.24L53.82 760L232.44 760L0 470.33000000000004z' fill='rgba(0%2c 0%2c 0%2c .075)'%3e%3c/path%3e%3cpath d='M0 470.33L232.44 760L356.07 760L0 439.04999999999995z' fill='rgba(0%2c 0%2c 0%2c .05)'%3e%3c/path%3e%3cpath d='M0 439.04999999999995L356.07 760L380.76 760L0 243.24999999999994z' fill='rgba(0%2c 0%2c 0%2c .025)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1286'%3e%3crect width='460' height='760' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='-16.3%25' y1='9.87%25' x2='116.3%25' y2='90.13%25' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1287'%3e%3cstop stop-color='rgba(112%2c 111%2c 237%2c 0.11)' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(124%2c 173%2c 237%2c 0.14)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e");
	.icon-line-block{
		width: 100%;
		display:flex;
		.icon-item{
			width: 25%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.icon-title{
				padding-top: 5rpx;
				font-size: 28rpx;
				color: #5d5c5c;
			}
		}
	}
}
</style>
