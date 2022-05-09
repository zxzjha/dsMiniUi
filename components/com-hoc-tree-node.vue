<template>
	<view class="com-hoc-tree-node">
		<view class="node-root">
			<view class="arrow-box" @click="onToggle" v-if="isFolder">
				<u-icon
					customStyle="margin-right:10rpx;"
					:name="isOpen? 'arrow-down': 'arrow-right'"
					color="#ccc"
					size="18"
				></u-icon>
			</view>
			<view class="node-check-box">
				<checkbox 
					value="cb" 
					:color="checkboxColor" 
					:checked="isChecked(treeData[propKeys.id])" 
					:data-id="treeData[propKeys.id]" 
					:data-pid="treeData[propKeys.parentId]"
					@click="checkChange"
				/>
			</view>
			<view class="label-box">{{treeData[`${propKeys.label}`]}}</view>
		</view>
		<view class="node-child" v-if="isFolder">
			<view v-if="isOpen">
				<view v-for="(item,index) in treeData[propKeys.children]" :key="index" :id="item[propKeys.id]">
					<com-hoc-tree-node
						:key="item[propKeys.id]"
						:treeData="item"
						:propKeys="propKeys"
						:defaultValue.sync="defaultValue"
						:checkboxColor="checkboxColor"
					></com-hoc-tree-node>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {isNotNil,deepClone,uniqArr,treeToList} from '@/lib/lib.js'
	
	export default{
		name:'com-hoc-tree-node',
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
						children:'children',
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
				isOpen:false, // 节点是否打开
			}
		},
		computed:{
			isFolder(e){ // 是否是节点，根据是否有children判断
				const list = this.treeData[this.propKeys.children] || []
				return list && list.length>0
			}
		},
		methods:{
			onToggle(){ // 打开或关闭节点
				if(this.isFolder) {
					this.isOpen =!this.isOpen
				}
			},
			checkChange(e){ // 点击checkbox
				if(this.isFolder) { // 打开节点
					this.isOpen = true
				}
				
				let checkedRes = []
				
				const rootId = e.currentTarget.dataset.id // 当前选中值
				const parentId = e.currentTarget.dataset.pid // 当前选中值的父id
				let childIds = [] // 所选值是否有children，有则需要遍历
				
				if(this.treeData[this.propKeys.children] && this.treeData[this.propKeys.children].length>0){
					childIds = this.treeData[this.propKeys.children].map(i=>i[this.propKeys.id])
				}
				
				const ids = [rootId,...childIds]
				
				const rootIndex = this.defaultValue.findIndex(i=>i==rootId)
				
				let arr = []
				
				if(isNotNil(rootIndex) && rootIndex>=0){ // 取消选中
					const idsArr = [...ids,parentId] // 加入父id
					this.defaultValue.forEach(i=>{
						const isInIds = idsArr.some(j=>j==i)
						if(!isInIds){
							arr.push(i)
						}
					})
					
					checkedRes = [...arr]
				}else{ // 选中
					arr = uniqArr([...this.defaultValue,...ids])
					
					checkedRes = [...arr]
				}
				
				this.$EventBus.$emit('updateCheckedArr', checkedRes)
			},
			isChecked(id){ // 当前项是否选中
				let childIds = []
				
				if(this.treeData[this.propKeys.children] && this.treeData[this.propKeys.children].length>0){
					childIds = this.treeData[this.propKeys.children].map(i=>i[this.propKeys.id])
				}
				
				// 当前值是否被选中在checekedarr中
				const isInCheckedarr = this.defaultValue.some(i=>i==id)
				
				// 子节点是否均被选中
				const isChildAllIn = childIds.length>0 && childIds.every(j=>this.defaultValue.some(k=>k==j))
				
				
				// 若其所有子节点都被选中，但他没有，则需要在checkedArr中推入值
				if(isChildAllIn && !isInCheckedarr){
					const arr = uniqArr([id,...this.defaultValue])
						
					const checkedRes = [...arr]
					
					this.$EventBus.$emit('updateCheckedArr', checkedRes)
				}
				
				return isInCheckedarr
			}
		}
	}
</script>

<style lang="scss" scoped>
	.com-hoc-tree-node{
		position: relative;
		left: 90rpx;
		.node-root{
			display: flex;
			align-items: center;
			margin-bottom: 10rpx;
			.label-box{
				margin-left: 10rpx;
			}
		}
		.node-child{
			
		}
	}
</style>