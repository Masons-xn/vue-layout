import { Component, Vue } from "vue-property-decorator"
import _ from "lodash"

/**
 * Created by xining.lao on 6/15/2017.
 */
import { Fast } from "./config"
function showValueBus(item: any) {
  // @ts-ignore
  this.editConfig.unitConfigString.map((items: { busShow: boolean }) => {
    if (item === items) {
      items.busShow = true
    } else {
      items.busShow = false
    }
  })
}
function hideValueBus(
  item: { busShow: boolean; dataType: string; value: string },
  state: any
) {
  item.busShow = false
  if (!state) {
    if (item.dataType === "boolean") {
      item.value = eval(item.value) ? "true" : "false"
    }
    // @ts-ignore
    this.setProps(item)
  }
}
function selectFromValuebus(item: { value: any }, value: any) {
  item.value = value
  // @ts-ignore
  this.hideValueBus(item)
}

function editingItemAddHeightLight(e: { className: any }) {
  const heightlight = document.getElementsByClassName("heightlight")

  if (heightlight.length > 0) {
    _.forIn(heightlight, function (value) {
      if (typeof value === "object") {
        value.className = value.className.replace("heightlight", "")
      }
    })
  }
  if (e) {
    e.className = e.className + " heightlight"
  }
}
function editingItemAddEdit(
  item: {
    [x: string]: any
    value: { [x: string]: any }
    edit: any[]
    props: any
  },
  index: string | number,
  e: { target: { className: string; parentNode: { className: any } } }
) {
  // @ts-ignore
  this.editConfig.unitConfigArray.map((items: { edit: never[] }) => {
    items.edit = []
  })

  item.edit = _.cloneDeep(item.props).concat({
    key: "id",
    hide: true
  })
  item["index"] = index
  _.forIn(item.value[index], function (value, key) {
    item.edit.map(function (items) {
      if (items.key === key) {
        items.value = value
      }
    })
  })
  let target

  if (e.target.className && e.target.className === "editing-value-list-item") {
    target = e.target
  } else if (e.target && e.target.parentNode && e.target.parentNode.className) {
    target = e.target.parentNode
  }
  if (target) {
    editingItemAddHeightLight(target)
  }
  // @ts-ignore
  this.editingItemToggle(item, index)
}

function editingItemAddRemove(
  item: { value: _.List<unknown>; listState: boolean, key: string },
  index: number,
  e: { stopPropagation: () => void }
) {
  const del = {}
  item.value = _.remove(item.value, (items: any, itemsindex) => {
    // if (index === itemsindex) {
    //   if (items.id) {
    //     Fast.needDel.push(
    //       {
    //         id: items.id,
    //         dataPath: item.key,
    //       }
    //     )
    //   }
    // }
    return index !== itemsindex
  })
  item.listState = false
  // @ts-ignore
  this.setProps(item)
  e.stopPropagation()
}

function editingItemAddCancel(item: { edit: never[] }) {
  item.edit = []
}

function editingItemAddSubmit(item: {
  edit: any[]
  index: number
  value: {}[]
}) {
  const editadta = {}
  item.edit.map(items => {
    editadta[items.key] = items.value
  })
  if (item.index > -1) {
    item.value[item.index] = editadta
  } else {
    item.value.push(editadta)
  }
  const temp = _.cloneDeep(item.value)
  item.edit = []
  item.value = []
  item.value = temp
  // @ts-ignore
  this.setProps(item)
}

function editingItemToggle(
  item: { listState: boolean; index: any; edit: never[] },
  index: number
) {
  item.listState = !item.listState
  if (index > -1) {
    item.index = index
  } else {
    item.edit = []
  }
}

function editingItemAdd(
  item: { listState: boolean; index: number; edit: any; props: any },
  e: { pageX?: any; pageY?: any; className?: any }
) {
  // @ts-ignore
  this.editConfig.unitConfigArray.map(
    (items: { index: any; edit: never[] }, index: any) => {
      items.index = index
      items.edit = []
    }
  )
  item.listState = false
  item.index = -1
  item.edit = _.cloneDeep(item.props)
  // @ts-ignore
  this.panel2Position = {}
  // @ts-ignore
  this.panel2Position.x = e.pageX
  // @ts-ignore
  this.panel2Position.y = e.pageY
  // @ts-ignore
  editingItemAddHeightLight(e)
}

function itemsprimary(items: { [x: string]: string }, item: { props: any[] }) {
  let key = ""

  item.props.map(function (list) {
    if (list.primary) {
      key = list.key
    }
  })
  return key + ":" + items[key]
}

function sidbarshow(name: { icon: any; name: any }) {
  if (name) {
    // @ts-ignore
    this.containerstate = true
    // @ts-ignore
    this.containerscontent = name.icon
    // @ts-ignore
    this.menu.map((item: { name: any; class: string }) => {
      if (item.name === name.name) {
        item.class = "edit"
      } else {
        item.class = ""
      }
    })
  } else {
    // @ts-ignore
    this.containerstate = false
    // @ts-ignore
    this.menu.map((item: { class: string }) => {
      item.class = ""
    })
  }
}

function editingPanelClose() {
  // @ts-ignore
  this.editingState = false
}

@Component({})
export default class PanelFn extends Vue {
  showValueBus = showValueBus
  hideValueBus = hideValueBus
  selectFromValuebus = selectFromValuebus
  editingItemAddEdit = editingItemAddEdit
  editingItemAddRemove = editingItemAddRemove
  editingItemAddCancel = editingItemAddCancel
  editingItemAddSubmit = editingItemAddSubmit
  editingItemToggle = editingItemToggle
  editingItemAdd = editingItemAdd
  itemsprimary = itemsprimary
  sidbarshow = sidbarshow
  editingPanelClose = editingPanelClose
}
