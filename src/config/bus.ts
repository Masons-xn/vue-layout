
const install = (Vue:any) =>{
  const pool = new Vue()
  const pools: {[x:string]:Function} ={}
  Vue.prototype.$bus = {
    emit : (method: string, param?: any) => {
      pool.$emit(method, param)
    },
    on : (method: string, param?: any) => {
      pool.$on(method, param)
      pools[method] = param
    },
    off : (method: string, param?: any) => {
      pool.$off(method, param)
    }
  }
}
declare module "vue/types/vue" {
  interface Vue {
    $bus:{[x:string]:Function}
  }
}
const Bus =  { install }
export default Bus
