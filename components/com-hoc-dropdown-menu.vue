<template>
	<view class="com-hoc-dropdown-menu">
		<template v-if="!isAbleSearch">
			<view class="dropdown-title-box" @click="collapseMenu" :style="titleStyle">
				<view class="title-content">{{titleContent}}</view>
				<view :class="['arrow-item',isMenuOpen?'arrow-rotate':'']">
					<u-icon name="arrow-down-fill"></u-icon>
				</view>
			</view>
		</template>
		
		<template v-if="isAbleSearch">
			<view class="title-input-box">
				<u--input v-if="isMenuOpen" v-model="searchText" clearable border="none" :placeholder="searchTitleContent"
					customStyle="box-sizing: border-box" @focus="onFocus" @change="onTextChageDebounce"
				></u--input>
				<view class="text-line" v-else @click="collapseMenu" :style="{color:searchTitleContent=='请输入关键字'?'':''}">{{searchTitleContent}}</view>
			</view>
		</template>
		
		
		<view class="content-wrapper">
			<view :class="['item-list-box',isMenuOpen?'item-list-show':'item-list-hide']" :style="menuStyle">
				<u-loadmore v-if="isAbleSearch" :status="status" :nomoreText="nomoreText"/>
				<template v-for="(item,index) in dropdownList" :id="index">
						<view :key="index" :class="['item-line',item.isChosed?'chosed-item':'']" 
							:data-choseditem="item" @click.stop.prevent="onChose"
						>
							{{item[labelKey]}}
						</view>
				</template> 
			</view>
		</view>
		<view class="btn-box"></view>
	</view>
</template>

<script>
	import {deepClone,debounce} from '@/lib/lib.js'
	import apiLib from '@/api/api.js'
	
	export default{
		name:'com-hoc-dropdown-menu', // 下拉框菜单
		props:{
			title:{
				type:String,
				default(){
					return '下拉选择'
				}
			},
			initValue:{ // 初始选中值
				type:Array,
				default(){
					return [] // [1,2,3]
				}
			},
			isAbleSearch:{ // 是否支持搜索下拉框
				type:Boolean,
				default(){
					return false
				}
			},
			labelKey:{ // label取值字段名
				default(){
					return 'label'
				}
			},
			valueKey:{// value取值字段名
				default(){
					return 'value'
				}
			},
			listData:{ // 下拉框初始选项
				require:true,
				type:Array,
				default(){
					return [
						{
							label:'',
							value:''
						}
					]
				}
			},
			isMultiple:{ // 是否多选
				type:Boolean,
				default(){
					return false
				}
			},
			titleStyle:{ //标题样式
				default(){
					return '--backgroundColor: #fff;'
				}
			},
			menuStyle:{ // 下拉菜单样式
				default(){
					return '--height:330rpx;--maxHeight:330rpx;--backgroundColor: #fff;'
				}
			},
			axiosRequestApiName:{ // 请求api名称
				type:String
			},
			axiosParamKeyName:{ // 请求所传字段名
				type:String,
				default(){
					return 'keyword'
				}
			}
		},
		data(){
			return {
				searchText:'', // 搜索内容
				isMenuOpen:false, // 控制菜单的开关
				total:0,
				status:'loadmore',// 下拉框数据加载 loadmore loading nomore
				nomoreText:'暂无数据', 
				titleContent:this.getChosedTitle(this.initValue), // 标题，默认值或选中值，有限选择选中值
				searchTitleContent:'请输入关键字',
				chosedArr:deepClone(this.initValue),// 选中值
				dropdownList:this.calcList(),// 下拉框list
				onTextChageDebounce:debounce(this.onTextChage)
			}
		},
		methods:{
			collapseMenu(){
				this.isMenuOpen = !this.isMenuOpen
			},
			onFocus(){
				this.isMenuOpen = true
				console.log('onFocus')
			},
			async onTextChage(){
				const params = {}
				params[`${this.axiosParamKeyName}`] = this.searchText
				console.log(params,'params')
				this.status = 'loading'
				const res = await apiLib[this.axiosRequestApiName](params)
				if(res.isOk){
					const list = res?.data?.itemList || []
					this.total = res?.data?.total
					this.dropdownList = this.calcList(list)
				}
				
				const len = this.dropdownList.length
				this.status = len>0?(len>=this.total?'nomore':'loadmore'):('nomore')
				this.nomoreText = len>0?'全部加载完成':'暂无数据'
				
				// this.status = this.dropdownList.length>=this.total?'nomore':'loadmore'
				
				console.log(res,'onTextChage',this.dropdownList,this.isMenuOpen)
			},
			onChose(e){ // 选中或取消选中
				if(e){
					const {choseditem} = e.currentTarget.dataset
					
					if(this.isMultiple){ // 多选
						const ind = this.dropdownList.findIndex(i=>i[this.valueKey]===choseditem[this.valueKey])
						
						this.$set(this.dropdownList,ind,{
							...this.dropdownList[ind],
							isChosed:!this.dropdownList[ind].isChosed
						})
						
						
					}else{// 单选
						this.dropdownList.forEach(i=>{
							if(i[this.valueKey]===choseditem[this.valueKey]){
								i.isChosed = !i.isChosed
							}else{
								i.isChosed = false
							}
						})
					}
					
					this.chosedArr = this.dropdownList.filter(j=>j.isChosed).map(k=>k[this.valueKey])
					this.titleContent = this.getChosedTitle(this.chosedArr)
					
					if(this.isAbleSearch){ // 支持下拉框搜索时，需要另外计算title
						this.searchTitleContent = this.calcSearchTitleObj()
						this.searchText = ''
					}
					
					this.$emit('update:initValue',this.chosedArr)
					this.$emit('getChosedValues',this.chosedArr)
					
					this.isMenuOpen = false
				}
			},
			
			calcList(arr){ // 根据listData 和 initValue初始化下拉框选项
				const list = arr?deepClone(arr):deepClone(this.listData)
				const compare = arr?this.chosedArr:this.initValue
				const res = list.map(i=>{
					return {
						...i,
						isChosed:compare.includes(i[this.valueKey])
					}
				})
				return res
			},
			getChosedTitle(arr=[]){// arr:选中项的value，根据选中值得到label组成的title
				let res = []
				this.listData.forEach(i=>{
					if(arr.includes(i[this.valueKey])){
						res.push(i[this.labelKey])
					}
				})
				console.log(res,'getChosedTitle')
				return res.length>0?(res.join(',')): this.title
			},
			calcSearchTitleObj(){
				let res = []
				this.dropdownList.forEach(i=>{
					if(this.chosedArr.includes(i[this.valueKey])){
						res.push(i[this.labelKey])
					}
				})
				return res.join(',')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.com-hoc-dropdown-menu{
		position: relative;
		font-size: 24rpx;
		.dropdown-title-box{
			display: flex;
			align-items: center;
			// padding: 15rpx;
			background-color: var(--backgroundColor);
			.title-content{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.arrow-item{
				margin-left: 15rpx;
				transition: transform 0.6s ease-in-out;
			}
			.arrow-rotate{
				transform: rotate(180deg);
			}
		}
		.title-input-box{
			.text-line{
				color: #303133;
				// font-size: 30rpx;
			}
		}
		.content-wrapper{
			width: 100%;
			min-width: 300rpx;
			position: absolute;
			top: 72rpx;
			z-index: 20;
			border-radius: 10rpx;
			box-shadow: 0 0 16rpx #ddd;
			.item-list-box{
				box-sizing: border-box;
				overflow: auto;
				color: #333;
				background-color: var(--backgroundColor);
				border-radius: 10rpx;
				transition: height 0.6s ease-in-out;
				.item-line{
					padding: 15rpx;
				}
				.chosed-item{
					color: #394bd0;
					font-weight: bold;
				}
			}
			.item-list-show{
				// height: var(--height);
				max-height: var(--maxHeight);
			}
			.item-list-hide{
				height: 0;
			}
		}
	}
</style>