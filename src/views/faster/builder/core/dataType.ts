export interface DataOfUnit {
  containerID: any
  unitPid: string
  unitID: string
  notSave: boolean
  unitName: string
  config: any
  renderType: string
}
export interface DataOfFast {
  Mapping: any
  Config: any
  Index: number
  store: any
  axios: any
  route: any
  needDel: any
  evetns: any
  mode: string
  environment: string
  delayUnit: any
  routerInfo: any
  routerMatch: any
  Vuebus: any
  unitToDelay: Function
  unitToActive: Function
  init: Function
}
