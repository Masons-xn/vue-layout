/**
 * Created by xining.lao on 6/16/2017.
 */
// import bus from "../core/eventbus"
import { Fast } from '../core/config'
import _ from 'lodash'
import bus from '@/views/faster/builder/core/eventbus'

let action: string
// let param
let id: string

export default {
  bind: {
    formInit(that: { formInit: (arg0: any) => void }) {
      return (arg: any) => {
        that.formInit(arg)
      }
    },
    formItemSetLabel(that: { formItemSetLabel: (arg0: any) => void }) {
      return function(arg: any) {
        that.formItemSetLabel(arg)
      }
    },
    formItemremoveLabel(that: { formItemremoveLabel: (arg0: any) => void }) {
      return function(arg: any) {
        that.formItemremoveLabel(arg)
      }
    },
    saveAndReload(that: { saveAndReload: (arg0: any) => void }) {
      return function(arg: any) {
        that.saveAndReload(arg)
      }
    },
    saveAndBack(that: { saveAndBack: (arg0: any) => void }) {
      return function(arg: any) {
        that.saveAndBack(arg)
      }
    }
  },
  method: {
    formItemSetLabel: function(unit: {
      unitPid: any
      unitID: any
      formLabel: any
      validateFail: any
      isrequire: any
      dataKey: any
      errMsg: any
    }) {
      if (unit.unitPid) {
        // @ts-ignore
        const parent = this.getThisParent(unit)
        if (parent && parent.unitName === 'RbForm') {
          const child = Fast.Mapping[parent.unitID].childCom || []
          child.map(function(item) {
            if (item.unitID === unit.unitID) {
              item.formLabel = unit.formLabel
              item.validateFail = unit.validateFail
              item.isrequire = unit.isrequire
              item.dataKey = unit.dataKey
              item.errMsg = unit.errMsg
            }
          })
          Fast.Mapping[parent.unitID].setGetChildProp(child)
        }
      }
    },
    formItemremoveLabel(unit) {
      if (unit.unitPid) {
        // @ts-ignore
        const parent = this.getThisParent(unit)
        if (parent && parent.unitName === 'RbForm') {
          const formitems = parent.$refs.form[0].$children
          formitems.map(
            (item: {
              label: any
              $el: { remove: () => void }
              $destroy: (arg0: boolean) => void
            }) => {
              if (item.label === unit.formLabel) {
                if (item && item.$el) {
                  item.$el.remove()
                }
                item.$destroy(true)
              }
            }
          )
        }
      }
    },
    commonSave(next?: any) {
      const datatemp = {
        id: ''
      }
      let form: any = {}
      _.forIn(Fast.Mapping, function(value, key) {
        if (key.indexOf('rbform') > -1) {
          form = Fast.Mapping[key]
        }
      })
      let verificationstate = true
      const requires: any[] = []
      form.childCom.map((item: { unitID: string | number }) => {
        const unit = Fast.Mapping[item.unitID]
        if (unit && unit.isrequire) {
          requires.push(unit)
          unit.$forceUpdate()
        }
      })
      requires.map(function(item) {
        if (item.validateFail === undefined || item.validateFail === true) {
          verificationstate = false
        }
      })
      if (!verificationstate) {
        return
      }
      function builddata(data: { [x: string]: any; id?: string }, key: string, value: any) {
        if (key.indexOf('.') > -1) {
          if (!data[key.split('.')[0]]) {
            data[key.split('.')[0]] = {}
          }
          builddata(data[key.split('.')[0]], key.split('.')[1], value)
        } else {
          data[key] = value
        }
        return data
      }
      form.childCom.map((item: { unitID: string | number }) => {
        const unit = Fast.Mapping[item.unitID]
        if (unit && unit.dataKey !== undefined) {
          builddata(datatemp, unit.dataKey, unit.value)
        }
      })
      datatemp.id = form.dataid
      let url = form.addUrl
      let msg = '新增完成'
      if (datatemp.id) {
        url = form.updateUrl
        msg = '更新完成'
      }
      // @ts-ignore
      this.$api(form.addUrl, datatemp).then(() => {
        // @ts-ignore
        this.$message({
          message: msg,
          type: 'success'
        })
        next()
      })
    },
    saveAndReload() {
      this.commonSave(() => {
        for (const unit in Fast.Mapping) {
          if (unit.indexOf('dialog') > -1) {
            bus.trigger('dialogColse', unit)
          }
          if (unit.indexOf('table') > -1) {
            try {
              Fast.Mapping[unit].$refs.table.fetch()
            } catch (e) {
              console.warn(e)
            }
          }
        }
      })
    },
    saveAndBack() {
      this.commonSave(() => {
        // @ts-ignore
        this.$router.go(-1)
      })
    },
    formInit(arg: { [x: string]: string }) {
      if (arg['action']) {
        action = arg['action']
      }
      if (action === 'search' || action === 'update') {
        this.formloaddetial(arg['param'])
      }
    },
    // formItemRemove(arg: { [x: string]: string }) {
    // },
    formloaddetial(arg: string) {
      let form: any
      const that = this
      function formsetvalue(unit: { value: any }, data: { [x: string]: any }, key: string) {
        if (key.indexOf('.') > -1) {
          formsetvalue(unit, data[key.split('.')[0]], key.split('.')[1])
        } else {
          unit.value = data[key]
        }
      }
      try {
        if (arg && JSON.parse(arg).id) {
          arg = JSON.parse(arg).id
        }
      } catch (e) {
        console.log(e)
      }
      _.forIn(Fast.Mapping, function(value, key) {
        if (key.indexOf('rbform') > -1) {
          form = Fast.Mapping[key]
        }
      })
      // @ts-ignore
      this.$axios.get(form.detialUrl, { data: [arg] }).then(function(resp: { data: { id: any } }) {
        // @ts-ignore
        const childUnits = that.getchildUnits(Fast, form)
        const currentdata = resp.data
        id = resp.data.id
        childUnits.map(function(item) {
          if (item && item.datakey) {
            if (action === 'search') {
              Fast.Mapping[item.unitID].disabled = true
            }
            formsetvalue(Fast.Mapping[item.unitID], currentdata, item.datakey)
          }
        })
      })
    }
  }
}
