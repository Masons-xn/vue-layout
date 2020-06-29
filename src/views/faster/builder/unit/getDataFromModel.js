/**
 * Created by xining.lao on 7/24/2017.
 */
import modeView from "../page/modelPanel/modeSelect.vue"
import Vue from "vue"

const modelselect = fn => {
  const modelNode = document.getElementById("modelPanel"),
    modelPanel = new Vue(modeView)

  if (!modelNode) {
    const node = document.createElement("DIV")

    node.id = "modelPanel"
    document.body.appendChild(node)
  }
  modelPanel.selected = fn
  modelPanel.$mount("#modelPanel")
}

export default modelselect
