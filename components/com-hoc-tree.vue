<template>
	<view class="com-hoc-tree">
		<view v-for="(item,index) in treeData" :key="index" :id="item[propKeys.id]">
			<com-hoc-tree-node
				:key="item[propKeys.id]"
				:treeData="item"
				:propKeys="propKeys"
				:defaultValue.sync="checkedArr"
				:checkboxColor="checkboxColor"
			></com-hoc-tree-node>
		</view>
	</view>
</template>

<script>
	import {isNotNil,deepClone,uniqArr,treeToList} from '@/lib/lib.js'
	
	export default{
		name:'com-hoc-tree',
		props:{ // 使用 com-hoc-tree 时需要传递的 props 说明
			treeData:{ // 树组件数据
				default(){
					return {}
				}
			},
			propKeys:{ // 字段名
				default(){
					return {
						id:'id',
						parentId:'pid',
						label:'label',
						children:'children'
					}
				}
			},
			defaultValue:{ // 默认选中值
				default(){
					return []
				}
			},
			checkboxColor:{ /// checkbox 颜色
				default(){
					return '#423bb3'
				}
			}
		},
		data(){
			return {
				checkedArr:deepClone(this.defaultValue)
			}
		},
		mounted() {
			this.$EventBus.$on('updateCheckedArr',(arr)=>{
				this.getValues(arr)
			})
		},
		methods:{
			getValues(arr){
				this.checkedArr = [...arr]
				
				this.$emit('update:defaultValue',this.checkedArr)
				
				this.$emit('getValues',this.checkedArr)
			}
		},
		beforeDestroy() {
			this.$EventBus.$off('updateCheckedArr')
		}
	}
</script>

<style lang="scss" scoped>
	
</style>