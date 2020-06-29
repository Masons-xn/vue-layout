<template>
  <div class="wrapper">
    <header class="header">
      <div class="logo-area"
           @click="$router.push('/')">
        BUilder
      </div>
      <div class="bar"
           flex="main:right">
        <div>
          <span @click="goBack()">
            <g-icon name="md-undo"
                    :size="24"></g-icon>
          </span>
        </div>
        <div>
          <span @click="structPanelShow()">
            <g-icon name="RectangleCopy58"
                    :size="24"
                    title="结构"></g-icon>
          </span>
        </div>
        <div class="dialogmanage">
          <span class="dialogManage"
                v-if="dialogs.length > 0"
                @click="dialogManageshow = !dialogManageshow">
            <g-icon name="RectangleCopy28"
                    :size="24"
                    style=""></g-icon>
          </span>
          <ul v-if="dialogManageshow">
            <li v-for="item of dialogs"
                @click="dialogOpen(item.unitID)"
                :key="item.unitID">
              {{ item.title }}
            </li>
          </ul>
        </div>
        <div>
          <span @click="clearPage('dev')">
            <g-icon name="clean"
                    :size="24"
                    title="清除"></g-icon>
          </span>
        </div>
        <div>
          <span @click="setModel('dev')">
            <g-icon name="kaifa1"
                    :size="24"
                    title="开发"></g-icon>
          </span>
        </div>
        <div>
          <span @click="setModel('pre')">
            <g-icon name="yulan"
                    :size="24"
                    title="预览"></g-icon>
          </span>
        </div>
        <div>
          <span @click="setPageInfo()">
            <g-icon name="md-save"
                    :size="24"
                    title="保存"></g-icon>
          </span>
        </div>
      </div>
    </header>
    <div class="main">
      <div class="sidebar">
        <div class="nav">
          <div v-for="item in menu"
               :key="item.name">
            <div class="nav-header">{{ item.name }}</div>
            <div class="nav-list">
              <div v-for="ch in item.children"
                   :key="ch.name">
                <div class="nav-item"
                     draggable="true"
                     @dragstart="unitDragstart(ch.name, item, $event)">
                  {{ ch.renderType }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rubbish"
             @dragover="unitdragmove"
             @drop="unitDrop">
          <g-icon name="shanchu"
                  size="40"
                  style="margin:0 auto;display: block"></g-icon>
        </div>
      </div>
      <div class="container">
        <div :class="mode === 'dev' ? 'designer-page developing-page' : 'designer-page'"
             @dragover="unitdragmove"
             @drop="unitDrop">
          <custom-page :config="sortconfig"> </custom-page>
        </div>
      </div>
    </div>
    <div class="drag_image"></div>
    <!--    <props-edit/>-->
    <drag-panel :class="editingPanelState">
      <div class="editing-panel">
        <div class="editing-panel-header">
          <div class="editing-close"
               @click="editingPanelClose()">
            <g-icon name="RectangleCopy22"
                    :size="24"></g-icon>
          </div>
          <div class="editing-name">{{ editConfig.unitName }} <span @click="copys()">拷贝</span></div>
        </div>
        <div class="editing-props"
             :style="panelmaxheight">
          <div v-for="item of editConfig.unitConfigString"
               :key="item.alias">
            <div class="editing-props-list">
              <div class="editing-props-name"
                   :title="item.alias">
                {{ item.alias }}
              </div>
              <div style="padding-right: 10px">：</div>
              <div class="editing-props-value"
                   :title="item.des">
                <input type="text"
                       :readonly="item.readonly"
                       v-model="item.value"
                       @focus="showValueBus(item)"
                       v-on:change="hideValueBus(item)" />
                <div class="editing-props-valueBus-flag"
                     v-if="item.valueBus.length > 0">
                  <g-icon name="also"
                          :size="16"></g-icon>
                </div>
                <div class="editing-props-valueBus"
                     v-show="item.busShow && item.valueBus.length > 0">
                  <div v-for="bus of item.valueBus"
                       :key="bus"
                       @click="selectFromValuebus(item, bus)">
                    {{ bus }}
                  </div>
                  <div @click="hideValueBus(item)">
                    关闭
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style=" height: 10px;margin-top: 10px;border-top: 1px solid #ccc;"></div>
          <div style="position: relative;"
               v-for="item of editConfig.unitConfigArray"
               :key="item.alias">
            <div class="editing-props-list">
              <div class="editing-props-nameandvalue"
                   :title="item.des">
                <span>{{ item.alias }}</span>：{{ item.value.length }}
              </div>
              <g-icon name="RectangleCopy20"
                      :size="24"
                      @press="editingItemAdd(item, $event)"></g-icon>
            </div>
            <div class="editing-props-list-all"
                 v-if="item.value.length">
              <div class="editing-value-list-item"
                   v-for="(items, index) of item.value"
                   :key="index"
                   @click="editingItemAddEdit(item, index, $event)">
                <div class="editing-value-list-item-index">{{ index + 1 }}</div>
                <div class="editing-value-list-item-detial">
                  {{ itemsprimary(items, item) }}
                </div>
                <g-icon name="Rectangle"
                        :size="24"
                        @press="editingItemAddRemove(item, index, $event)"></g-icon>
              </div>
            </div>
            <drag-panel class="editing-props-list-add"
                        v-if="item.edit.length">
              <g-icon name="Rectangle22"
                      :size="24"
                      @press="editingItemAddCancel"></g-icon>
              <div class="editing-props-list-add-items"
                   :key="items.id"
                   v-for="items of item.edit">
                <div v-if="!items.hide"
                     flex>
                  <div class="editing-props-name"
                       :title="item.alias">
                    {{ items.alias }}
                  </div>
                  <div style="padding-right: 10px">：</div>
                  <div class="editing-props-value"
                       :title="items.des">
                    <input type="text"
                           v-model="items.value"
                           v-on:change="hideValueBus(items, true)" />
                  </div>
                </div>
              </div>
              <div class="editing-props-list-add-buttons">
                <div @click="editingItemAddSubmit(item)"
                     style=" background: #3498DB;color: #fff"
                     class="editing-props-list-button">
                  <span>确定</span>
                </div>
              </div>
            </drag-panel>
          </div>
        </div>
      </div>
    </drag-panel>
    <input type=""
           name=""
           style="position:fixed;left:-1000px"
           id="copyUnitId"
           value="123" />
    <div class="savePageName"
         v-if="editPageName">
      <div class="savePageNames">页面名称</div>
      <div class="savePageInfo">
        <div class="page_info_save">
          <div class="page_info_save_label">页面名称:</div>
          <div class="page_info_save_value"><input v-model="pageName" /></div>
        </div>
        <div class="page_info_save">
          <div class="page_info_save_label">页面初始化方法:</div>
          <div class="page_info_save_value">
            <input v-model="initMethods" />
          </div>
        </div>
        <div class="page_info_save">
          <div class="page_info_save_label">引入文件地址:</div>
          <div class="page_info_save_value"><input v-model="files" /></div>
        </div>
        <div class="page_info_save">
          <div class="page_info_save_label">路由别称:</div>
          <div class="page_info_save_value"><input v-model="routerPath" /></div>
        </div>
      </div>
      <div class="button-group">
        <div class="rb-button"
             @click="submitCancle()">
          <span>取消</span>
        </div>
        <div class="rb-button"
             style=" background: #3498DB;color: #fff"
             @click="submit()">
          <span>确定</span>
        </div>
      </div>
    </div>
    <drag-panel :class="structPanelstate">
      <div style="position: absolute;right: 0;top: 0"
           @click="structPanelClose()">
        <g-icon name="RectangleCopy22"
                :size="24"></g-icon>
      </div>
      <tree :treeData="treeData" />
    </drag-panel>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide, Watch } from "vue-property-decorator"
import Tree from "./tree/tree.vue"
import DragPanel from "./dragPanel/dragPanel.vue"
import devmix from "../mixin/mixin"
import Drag from "../mixin/drag"
import { DevBuilderMix } from "../core/bt"
import { Fast } from "../core/config"
import baseData from "../core/builderdata"
import FastHeader from "./header/header.vue"
import CustomPage from "./custompage.vue"
import rebornUI from "../../components"
import DeVDrag from "../mixin/builder-dev-mixin"
import _ from "lodash"
import init from "@/config/ready"
@Component({
  mixins: [devmix, Drag, DeVDrag, DevBuilderMix],
  components: {
    Tree,
    FastHeader,
    DragPanel,
    CustomPage
  }
})
export default class Builder extends Vue {
  [x: string]: any
  private menu: any[] = [
    {
      name: "布局容器",
      children: []
    },
    {
      name: "元素",
      children: []
    }
  ]
  private baseData: any = baseData
  private unitID = ""
  private config: any = []
  private pageStructure: any
  private unitType: any
  private editingState = false
  private mode = "pro"
  private structShow = false
  private dialogManageshow = false
  private editConfig: any = {
    unitConfigString: [],
    unitConfigArray: [],
    unitName: ""
  }
  get dialogs() {
    const dialogs: any[] = []
    const config = _.cloneDeep(this.config)
    Fast.delayUnit.concat(config).map((item: { unitID: string; config: { title: string } | undefined; title: string | undefined }) => {
      if (item.unitID.indexOf("rbdialog") > -1) {
        if (item.config && item.config.title) {
          item.title = item.config.title
        } else {
          item.title = "窗口"
        }
        dialogs.push(item)
      }
    })
    return dialogs
  }
  public created() {
    this.loading = true
    init(this, () => void {})
    if (this.$route.query.path) {
      this["loadData"](this["$route"].query.path)
    }
    this.EventsOn("dev")
    const that = this
    that.mode = "dev"
    _.forIn(rebornUI, (value, key) => {
      if (key.indexOf("rb") > -1) {
        if (new value().renderType && new value().renderType.length > 0) {
          value.renderType = new value().renderType
          if (new value().unitType === "layout") {
            that.menu[0].children.push(value)
          } else if (new value().unitType === "container") {
            that.menu[0].children.push(value)
          } else if (new value().unitType === "element") {
            that.menu[1].children.push(value)
          }
        }
      }
    })
    Fast.mode = "dev"
    Fast.environment = "builder"
  }
  @Watch("mode", { deep: true })
  public onModeChange() {
    this.modeChange()
  }
}
</script>
<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1b1b1b;
  height: 56px;
  width: 100%;
  z-index: 2000;

  .logo-area {
    width: 150px;
    height: 56px;
    display: flex;
    align-items: center;
    text-transform: Uppercase;
    font-size: 24px;
    font-weight: 500;
    color: #fff;
    justify-content: center;
  }
  .bar {
    color: #fff;

    span {
      margin: 0 5px;
    }
  }
}
.wrapper {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .main {
    flex: auto;
    display: flex;
    width: 100%;

    .container {
      flex: auto;
      overflow-y: auto;
    }
  }
}
.drag_image {
  left: 300px;
  position: fixed;
  z-index: -100;
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
@import "../scss/builder.scss";
.dialogmanage {
  position: relative;
  z-index: 2002;
  ul {
    display: block;
    position: absolute;
    width: 100px;
    line-height: 40px;
    text-align: center;
    top: 30px;
    height: 200px;
    left: 0;
    background: #cccccc;
    li {
      width: 100%;
    }
  }
}
</style>
