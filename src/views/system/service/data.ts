import { getServiceAll } from '../../../utils/api/common/service'

const transData = () => {
  getServiceAll().then(res => {
    postMessage(res, "*")
  })
}
transData()
