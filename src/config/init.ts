import Vue from "vue"
import ElementUI from "element-ui"
import "flex.css"
import "element-ui/lib/theme-chalk/index.css"
import "../assets/iconfont/iconfont.css"
import { Api } from "../utils/api"
import Diff from "../utils/difference"
import Trans from "../utils/trans"
import Bus from './bus'
import "../components/index"
import "./axios"
import addRouters from "../router/addRouters"
import { Verification } from "../views/faster/builder/directives/verification"
import socket from './scoket'
// socket('mes', 'iii')
Vue.config.productionTip = true
Vue.use(Api)
Vue.use(Diff)
Vue.use(Bus)
Vue.use(Trans)
Vue.use(ElementUI)
Vue.use(Verification)
addRouters()
