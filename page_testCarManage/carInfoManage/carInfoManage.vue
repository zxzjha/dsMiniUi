<template>
	<view class="page-car-info-manage">
		<view class="top-line">
			<view class="search-box">
				<view class="dropdown-box">
					<com-hoc-dropdown-menu :listData="projectList" :initValue.sync="chosedProject" title="请选择项目" labelKey="project" 
						valueKey="project" @getChosedValues="getChosedValues"
					></com-hoc-dropdown-menu>
				</view>
				<view class="input-box">
					<u--input v-model="extraParams.project" clearable border="none" placeholder="请输入内容"
						customStyle="box-sizing: border-box"
					></u--input>
				</view>
				<view class="search-btn" @click="debounceOnSearch">搜索</view>
			</view>
		</view>
		<view class="content-wrapper">
			<com-hoc-list ref="listcom" :tData.sync="tableData" :extraParams="extraParams" inquireName="getVehicleInfoList" scrollBoxHeight="90vh">
				<template v-slot:content>
					<view class="list-wrapper">
						<view v-for="(item,index) in tableData" :id="item.id" :key="item.id">
							<car-info-item :initialData="item" :itemId="index+1" :key="item.id"></car-info-item>
						</view>
					</view>
				</template>
			</com-hoc-list>
		</view>
		<view class="footer-box">
			<movable-area class="move-area-box">
				<movable-view class="move-view-box" direction="all" :x="moveObj.x" :y="moveObj.y" @change="onMove">
					<view class="add-btn" @click="onAdd">+</view>
				</movable-view>
			</movable-area>
		</view>
		
		<u-modal :show="isModalShow" :showConfirmButton="false" :closeOnClickOverlay="true"
			title="添加车辆" @close="onModalClose"
		>
			<view class="car-info-modal-wrapper">
				<car-info-edit-com :initialData="curFormData"></car-info-edit-com>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {debounce} from '@/lib/lib.js'
	import carInfoItem from './components/carInfoItem.vue'
	import carInfoEditCom from './components/carInfoEditCom.vue'
	
	export default {
		name:'car-info-manage', // 车辆信息管理
		components:{
			'car-info-item':carInfoItem,
			'car-info-edit-com':carInfoEditCom
		},
		computed: {
			...mapState({
				projectList: state => state.baseStore.projectList,
			})
		},
		data(){
			return {
				tableData:[],
				chosedProject:[], // 所选择的项目
				isModalShow:false,// 车辆信息表单弹窗
				curFormData:{}, // 当前表单初始数据
				extraParams:{
					searchText:'', // 搜索内容
					project:'' // 项目
				},
				moveObj:{
					x:0,
					y:216
				},
				debounceOnSearch:debounce(this.onSearch)
			}
		},
		methods:{
			onSearch(){ // 根据项目等搜索
				this.$refs.listcom.refreshData()
			},
			getChosedValues(chosedArr){
				this.extraParams.searchText = chosedArr.join(',')
			},
			onAdd(){ // 打开弹窗，添加车辆
				this.curFormData = {}
				this.isModalShow = true
				console.log('onAdd')
			},
			closeFormModal(){
				this.isModalShow = false
			},
			onModalClose(){ // 点击遮罩
				this.isModalShow = false
			},
			onMove(e){
				this.moveObj.x = e.detail.x
				this.moveObj.y = e.detail.y
			},
			calcProjectList(){
				const res = this.projectList.map(i=>({
					label:i.project,
					value:i.project
				}))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-car-info-manage{
		.top-line{
			.search-box{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 40rpx;
				border: 1rpx solid #b9b9b9;
				color: #525252;
				border-radius: 40rpx;
				height: 70rpx;
				line-height: 70rpx;
				margin: 10rpx 20rpx;
				.dropdown-box{
					max-width: 240rpx;
				}
				.input-box{
					padding-left: 10rpx;
				}
				.search-btn{
					width: 85rpx;
					min-width: 85rpx;
					padding: 0 10rpx;
					letter-spacing: 8rpx;
					text-align: center;
					&:active{
						text-shadow: 0 0 13rpx #746cef;
					}
				}
			}
		}
		.content-wrapper{
			padding: 10rpx 20rpx;
		}
		.footer-box{
			position: fixed;
			bottom: 100rpx;
			right: 0;
			width: 100rpx;
			height: 500rpx;
			transform: translateX(30px);
			.move-area-box{
				width: 100%;
				height: 100%;
				.move-view-box{
					width: 200rpx;
					.add-btn{
						width: 90rpx;
						height: 90rpx;
						line-height: 90rpx;
						border-radius: 50%;
						text-align: center;
						font-size: 40rpx;
						font-weight: bold;
						color: #4c4c4c;
						background: linear-gradient(0deg, #bfd036 0%, #affe74 100%);
						box-shadow: 0 0.7em 1.5em -0.5em #4ed036be;
						transition: 0.6s;
						&:active{
							transform: scale(0.8);
							box-shadow: 7px 5px 56px -10px #051b01be;
						}
					}
				}
			} 
		}
	}
</style>