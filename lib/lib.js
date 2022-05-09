export const isNil = val => val === '' || val ===undefined || val === null

export const isNotNil= val => val !=='' && val !==undefined && val !==null

export const isBooleanTrue = val => isNotNil(val) && val

export const getType = val => Object.prototype.toString.call(val).slice(8, -1)

export const uniqArr = (array = []) => {
  // 给数组去重并返回去重后的数组
  const data = new Set(array)
  return [...data]
}

export const transStringToArr = (val) => { // 字符串转成数组
	if(isNotNil(val)){
		if(typeof val == 'object'){
			return val || []
		}else if(typeof val == 'number'){
			
			return [].concat(val)
		}else{
			return val.split(',')
		}
	}else{
		return []
	}
}
			
export const transArrToString = (val) => { // 数组转成字符串
	if(isNotNil(val)){
		if(typeof val == 'object'){
			return val.join(',')
		}else{
			return val || ''
		}
	}else{
		return ''
	}
}

//arrChunk作用：将array以size为截取步长，截取得到新的二维数组
export const arrChunk = (array=[], size=3) => {
  //array为空，或维度为0时，返回空数组
  size = Math.max(size, 0);
  const length = (array||[]).length
  if (length < 1 || size < 1) return [];
  //定义新的空数组result，index为array的index值，resIndex为新数组的index值
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));
  //以size为截取步长，截取后放到新数组中
  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  return result;
}

// 防抖
export const debounce = (func, time=500, ctx) => {
  let timer
  return (...params) => {
    if(timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(ctx, params)
    }, time)
  }
}

// 节流
export const throttle = (fn, cycle) => {
	console.log('throttle--ppppp')
  let start = Date.now()
  let now
  let timer
  return (...params) => {
    now = Date.now()
    clearTimeout(timer)
    if (now - start >= cycle) {
      fn.apply(this, params)
      start = now
    } else {
      timer = setTimeout(() => {
        fn.apply(this, params)
      }, cycle)
    }
  }
}

// 深拷贝
export const deepClone = (data) => {
  const dataType = getType(data)
  let res = dataType === 'Array' ? [] : {}
  if (dataType === 'Array' || dataType === 'Object') {
    for (let key in data) {
      res[key] = deepClone(data[key])
    }
  } else {
    return data
  }
  return res
}

export const getStorageValue = (key,defaultValue)=>{
	try{
		const isObject = typeof defaultValue === 'object'
		const res = isObject?(JSON.parse(uni.getStorageSync(key))):(uni.getStorageSync(key))
		const data = isNotNil(res)?res:defaultValue
		return data
	}catch(e){
		return defaultValue
	}
}

/**
 *  列表转为树
 * 列表结构转为树结构,然后把根节点提取出来
 */
export const listToTree = (list=[],idName='id',pidName='pid')=> {
  let info = list.reduce((map, node) => {
    map[node[idName]]=node
    return map
  }, {})
  let res = list.filter(node => {
    if (info[node[pidName]]) {
      isNil(info[node[pidName]].children) && (info[node[pidName]].children = [])
      info[node[pidName]].children.push(node)
    }
    return !node[pidName]
  })
  return res
}

// 树转为列表
export const treeToList = (tree, result = []) => {
  tree.forEach(node => {
    result.push(node)
    node.children && treeToList(node.children, result)
  })
  const res = result.map(i=>{
    delete i.children
    return i
  })
  return res
}