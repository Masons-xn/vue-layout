const ArrayToHierarchy = (list: any) => {
  const data = JSON.parse(JSON.stringify(list))
  const result:any = []
  if (!Array.isArray(data)) {
    return result
  }
  data.forEach(item => {
    delete item.children
  })
  const map = {}
  data.forEach(item => {
    map[item.id] = item
  })
  data.forEach(item => {
    const parent = map[item.pid]
    if (parent) {
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    } else {
      result.push(item)
    }
  })
  return result
}
function HierarchyToArray(tree) {
  let queen = []
  const out:any = []
  queen = queen.concat(tree)
  while (queen.length) {
    const first:any = queen.shift()
    if (first && first.children) {
      queen = queen.concat(first.children)
      delete first.children
    }
    out.push(first)
  }
  return out
}
const dataOrder = (arr) => {
  const data = JSON.parse(JSON.stringify(arr.data))
  // data.map(item => {
  //   item.sequence = Number(item[key])
  // })
  const key = arr.key
  data.sort((a, b) => {
    if (a[key] < b[key]) {
      return -1
    } else if (a[key] === b[key]) {
      return 0
    }
    return 1
  })
  return data
}
const JSON2FormData = data => {
  const form = new FormData()
  for (const k in data) {
    form.append(k, data[k])
  }
  return form
}
/*
 * data 格式id label children
 * */
const HierarchyGetChildren = ({ data, guid }) => {
  let queen = []
  const out:any = []
  queen = queen.concat(data)
  while (queen.length) {
    const first:any = queen.shift()
    if (first && first.children) {
      first.children.map(item => {
        item.parentId = first.parentId ? first.parentId : first.guid
      })
      queen = queen.concat(first.children)
      delete first.children
    }
    out.push(first)
  }
  return out.filter(item => item.parentId === guid).map(item => item.guid)
}
export {
  HierarchyGetChildren,
  ArrayToHierarchy,
  HierarchyToArray,
  JSON2FormData,
  dataOrder
}
