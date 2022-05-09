<template>
	<view class="com-hoc-dropdown-menu">
		<template v-if="!isAbleSearch">
			<view class="dropdown-title-box" @click="collapseMenu" :style="titleStyle">
				<view class="title-content" :style="{color:titleContent===title?titleColor.nochoseColor: titleColor.chosedColor}">{{titleContent}}</view>
				<view v-if="iconShow" :class="['arrow-item',isMenuOpen?'arrow-rotate':'']">
					<u-icon name="arrow-down-fill" :color="titleContent===title?titleColor.nochoseColor: titleColor.chosedColor"></u-icon>
				</view>
			</view>
		</template>
		
		<template v-if="isAbleSearch">
			<view class="title-input-box">
				<u--input ref="searchinput" v-if="isMenuOpen" v-model="searchText" :focus="true" clearable border="none" :placeholder="searchTitleContent"
					customStyle="box-sizing: border-box" @focus="onFocus" @blur="onBlur" @change="onTextChageDebounce"
				></u--input>
				<view class="text-line" v-else @click="collapseMenu" :style="titleStyle">
					<view :style="{color:searchTitleContent===title?titleColor.nochoseColor: titleColor.chosedColor}">{{searchTitleContent}}</view>
				</view>
			</view>
		</template>
		
		<view class="content-wrapper">
			<view :class="['item-list-box',isMenuOpen?'item-list-show':'item-list-hide']" :style="menuStyle">
				<u-loadmore v-if="isAbleSearch" :status="status" :nomoreText="nomoreText"/>
				<template v-for="(item,index) in dropdownList" :id="index">
						<view :key="index" :class="['item-line',item.isChosed?'chosed-item':'']" 
							:data-choseditem="item" @click.stop.prevent="onChose"
						>
							{{item[descKey]}}
						</view>
				</template> 
			</view>
		</view>
		<view class="btn-box"></view>
	</view>
</template>

<script>
	import {isNotNil,deepClone,debounce,transStringToArr,transArrToString} from '@/lib/lib.js'
	import apiLib from '@/api/api.js'
	
	export default{
		name:'com-hoc-dropdown-menu', // 下拉框菜单
		props:{
			title:{ // 不需要搜索下拉框时候的title
				type:String,
				default(){
					return '下拉选择'
				}
			},
			iconShow:{ // 下拉箭头icon
				type:Boolean,
				default(){
					return true
				}
			},
			listData:{ // 下拉框初始选项
				type:Array,
				default(){
					return []
				}
			},
			initValue:{ // 初始选中值
				default(){
					return [] // [1,2,3] or 1,2,3
				}
			},
			isAbleSearch:{ // 是否支持搜索下拉框
				type:Boolean,
				default(){
					return false
				}
			},
			labelKey:{ // label取值字段名,选中后显示的值
				default(){
					return 'label'
				}
			},
			valueKey:{// value取值字段名
				default(){
					return 'value'
				}
			},
			descKey:{ // 下拉列表没项显示的值
				default(){
					return 'label'
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
					return '--fontSize:24rpx; --backgroundColor: #fff;'
				}
			},
			menuStyle:{ // 下拉菜单样式
				default(){
					return '--height:330rpx;--maxHeight:330rpx;--backgroundColor: #fff;'
				}
			},
			titleColor:{ // 选中了值和未选中颜色不同
				default(){
					return {
						chosedColor:'#303133',
						nochoseColor:'#c0c4cc'
					}
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
				status:'nomore',// 下拉框数据加载 loadmore loading nomore
				nomoreText:'暂无数据', 
				titleContent:this.getChosedTitle(transStringToArr(this.initValue)), // 标题，默认值或选中值，有限选择选中值
				searchTitleContent:this.getChosedTitle(transStringToArr(this.initValue)),
				chosedArr:deepClone(transStringToArr(this.initValue)),// 选中值
				dropdownList:this.calcList(),// 下拉框list
				onTextChageDebounce:debounce(this.onTextChage)
			}
		},
		methods:{
			collapseMenu(){
				this.isMenuOpen = !this.isMenuOpen
				this.$nextTick(()=>{
					console.log(this.$refs.searchinput,'searchinput')
				})
			},
			onFocus(){
				this.isMenuOpen = true
				console.log('onFocus')
			},
			onBlur(){
				this.isMenuOpen = false
				console.log('onBlur')
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
					
					// initValue传的字符串，则emit字符串；initValue传的数组，则emit数组
					const pushData = typeof this.initValue =='object'?this.chosedArr:transArrToString(this.chosedArr)
					this.$emit('update:initValue',pushData)
					this.$emit('getChosedValues',this.chosedArr)
					
					this.isMenuOpen = false
				}
			},
			
			calcList(arr){ // 根据listData 和 initValue初始化下拉框选项
				const list = arr?deepClone(arr):deepClone(this.listData)
				const compare = arr?this.chosedArr:transStringToArr(this.initValue)
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
				arr.forEach(v=>{
					const item = this.listData.find(i=>i[this.valueKey]==v)
					item && res.push(item[this.labelKey])
				})
				const text = res.join(',')
				return isNotNil(text)?text:this.title
			},
			calcSearchTitleObj(){
				let res = []
				this.chosedArr.forEach(v=>{
					const item = this.chosedArr.find(i=>i[this.valueKey]==v)
					item && res.push(item[this.labelKey])
				})
				const text = res.join(',')
				return isNotNil(text)?text:this.title
			}
		}
	}
</script>

<style lang="scss" scoped>
	.com-hoc-dropdown-menu{
		position: relative;
		// font-size: 24rpx;
		.dropdown-title-box{
			display: flex;
			align-items: center;
			// padding: 15rpx;
			background-color: var(--backgroundColor);
			font-size: var(--fontSize);
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
				background-color: var(--backgroundColor);
				font-size: var(--fontSize);
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