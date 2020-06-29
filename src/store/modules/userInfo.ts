const LoginInfo = {
  state: {
    lastActiveTime: window.localStorage.getItem("lastActiveTime") || ""
  },
  mutations: {
    setTime(state: { lastActiveTime: any }, time: any) {
      state.lastActiveTime = time
    }
  },
  actions: {
    lastActiveTime({ commit }: any, time: any) {
      commit("setTime", time)
    }
  },
  getters: {}
}
export default LoginInfo
