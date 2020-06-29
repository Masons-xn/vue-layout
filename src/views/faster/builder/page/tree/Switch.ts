/**
 * Created by xining.lao on 7/18/2017.
 */
import _ from "lodash"
interface Node {
  unitID: any
  unitIndex: any
  containerID: any
  unitPid: any
}

let nodeF: {
    unitID: undefined
    containerID: undefined
    unitIndex: undefined
    unitPid:undefined
  } = {
    unitID: undefined,
    unitIndex: undefined,
    containerID: undefined,
    unitPid:undefined
  },
  nodeT: {
    unitID: undefined
    containerID: undefined
    unitIndex: undefined
    unitPid:undefined
  } = {
    unitIndex: undefined,
    unitPid: undefined,
    containerID: undefined,
    unitID:undefined
  }

function doswitch() {
  if (nodeF.unitPid !== nodeT.unitPid || nodeF.unitID === nodeT.unitID || nodeF.containerID !== nodeT.containerID) {
    return false
  }
  const Index = _.cloneDeep(nodeF).unitIndex
  let containerID

  nodeF.unitIndex = _.cloneDeep(nodeT).unitIndex
  nodeT.unitIndex = Index
  if (nodeF.containerID) {
    containerID = _.cloneDeep(nodeF).containerID
    nodeF.containerID = _.cloneDeep(nodeT).containerID
    nodeT.containerID = containerID
  }
  return {
    F: {
      unitID: nodeF.unitID,
      unitIndex: nodeF.unitIndex,
      containerID: nodeF.containerID
    },
    T: {
      unitID: nodeT.unitID,
      unitIndex: nodeT.unitIndex,
      containerID: nodeT.containerID
    },
    P: {
      unitID: nodeF.unitPid
    }
  }
}
const Switch = {
  setFnode: (node: Node) => {
    nodeF = node
  },
  setTnode: (node: Node) => {
    nodeT = node
    return doswitch()
  }
}

export default Switch
