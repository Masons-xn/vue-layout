<template>
  <ul>
    <li v-for="item in nodeData" v-show="item.visible" :class="[item.children && item.children.length > 0 ? '' : 'leaf']">
      <div class="node" draggable="true" @dragstart="nodeMove(item)" @dragover="nodeDragMove($event)" @drop="nodeDrop(item, $event)" @dragend="eDragend($event)">
        <i v-if="item.children && item.children.length > 0" @click.stop="handleNodeExpand(item)" :class="[item.open ? 'tree-open' : 'tree-close', 'icon']"> </i>
        <span
          @click="handleNode(item)"
          :class="{
            'node-selected': (item.checked && !options.showCheckbox) || item.searched
          }"
        >
          {{ transFormtoch(item.unitName) }}
        </span>
      </div>
      <tree-node v-if="item.children && item.children.length > 0 && item.open" :options="options" @handleCheckedChange="handleCheckedChange" :tree-data="item.children"> </tree-node>
    </li>
  </ul>
</template>
<script lang="ts">
import { Component, Vue, Provide, Prop, Watch } from "vue-property-decorator"
import bus from "../../core/eventbus"
import Switch from "./Switch"
import rebornUI from "../../../components"
@Component({})
export default class TreeNode extends Vue {
  @Prop({ default: () => [] }) private treeData: any[]
  @Prop({ default: () => [] }) private options: object[]
  private nodeData: any[] = []
  private created() {
    this.nodeData = (this.treeData || []).slice(0)
  }

  @Watch("treeData", {})
  private onTreeDataChange(data) {
    this.nodeData = (data || []).slice(0)
  }
  private transFormtoch(name) {
    const unitname = name.toLowerCase()

    return new rebornUI[unitname]().renderType
  }
  private walkCheckBox(node) {
    if (node.nodeSelectNotAll) {
      node.checked = !node.checked
      this.handleCheckedChange(node)
    }
  }
  private handleNodeExpand(node) {
    if (node.open === undefined || node.open === "") {
      node.open = true
    } else {
      node.open = !node.open
    }
  }
  private handleCheckedChange(node) {
    this.$emit("handleCheckedChange", node)
  }
  private handleNode(node) {
    bus.trigger("node-click", node)
    this.$emit("node-click", node)
  }
  private nodeMove(node) {
    Switch.setFnode(node)
  }
  private nodeDragMove(event) {
    event.preventDefault()
  }
  private nodeDrop(node, event) {
    Switch.setTnode(node)
    bus.trigger("node-switch", Switch.setTnode(node))
    event.stopPropagation()
  }
  private notMove(event) {
    event.stopPropagation()
  }
  private eDragend(event) {
    event.stopPropagation()
  }
}
</script>
<style scoped lang="scss">
li:hover {
  cursor: pointer;
}

.icon {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
}

.halo-tree {
  font-size: 14px;
  min-height: 20px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

.node-selected {
  background-color: #ddd;
}

.halo-tree li {
  margin: 0;
  padding: 5px 5px 5px 0;
  position: relative;
  list-style: none;
}

.halo-tree li > span,
.halo-tree li > i,
.halo-tree li > a {
  line-height: 20px;
  vertical-align: middle;
}

.halo-tree .node:hover {
  background: rgba(0, 0, 0, 0.035);
}

.halo-tree li:after,
.halo-tree li:before {
  content: "";
  left: -8px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.halo-tree li:before {
  border-left: 1px dashed #999;
  bottom: 50px;
  height: 100%;
  top: -8px;
  width: 1px;
}

.halo-tree li:after {
  border-top: 1px dashed #999;
  height: 20px;
  top: 17px;
  width: 12px;
}

.halo-tree li span {
  display: inline-block;
  padding: 3px 3px;
  text-decoration: none;
  border-radius: 3px;
}

.halo-tree li:last-child::before {
  height: 26px;
}

.halo-tree > ul {
  padding-left: 0;
}

.halo-tree ul ul {
  padding-left: 15px;
  padding-top: 10px;
}

.halo-tree li.leaf {
  padding-left: 19px;
}

.halo-tree li.leaf:after {
  content: "";
  left: -8px;
  position: absolute;
  right: auto;
  border-width: 1px;
  border-top: 1px dashed #999;
  height: 20px;
  top: 17px;
  width: 24px;
}

.check {
  display: inline-block;
  position: relative;
  top: 4px;
}

.halo-tree .icon {
  margin-right: 0;
}

.tree-close {
  width: 14px;
  height: 14px;
  background-image: url("./Open.png");
}

.tree-open {
  width: 14px;
  height: 14px;
  background-image: url("./Close.png");
}
</style>
