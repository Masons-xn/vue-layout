import { Vue, Component, Prop, Provide } from "vue-property-decorator"
import resizeEvent from "element-resize-event"
import _ from "lodash"
const DEFAULT_PROPS = {
  size: "small",
  stripe: true,
  border: true
}

let DEFAULT_EVENTS = {
  // default events
}
const DEFAULT_COL_PROPS = {
  showOverflowTooltip: true
}

@Component
export default class BaseTable extends Vue {
  @Prop({
    default() {
      return []
    }
  })
  public columns: any
  @Prop() public hasPagination: boolean | undefined
  get props() {
    return Object.assign({}, DEFAULT_PROPS, this.$attrs)
  }
  get events() {
    return Object.assign({}, DEFAULT_EVENTS, this.$listeners)
  }
  private tableHeight = 0
  public getSlotName(column: { type: string; slotName: any }) {
    return column.type === "expand" ? "expand" : column.slotName
  }
  public getScopedSlots(instance: this | undefined, name: string | number) {
    if (instance === undefined) {
      return null
    }
    if (instance.$scopedSlots[name]) {
      return instance.$scopedSlots[name]
    }
    // @ts-ignore
    return this.getScopedSlots(instance.$parent, name)
  }
  public renderColumn(column: { hasOwnProperty?: any; type?: string; slotName?: any }) {
    const data = {
      props: Object.assign({}, DEFAULT_COL_PROPS, column),
      scopedSlots: undefined
    }

    if (Object.prototype.hasOwnProperty.call(column, "sortable")) {
      DEFAULT_EVENTS = {
        "sort-change": (column: any, prop: any, order: any) => {
          console.log(column)
        }
      }
    }
    // @ts-ignore
    const slotName = this.getSlotName(column)

    if (slotName) {
      const slotRender = this.getScopedSlots(this, slotName)

      if (slotRender) {
        const scopedSlots = {
          default(scope: { $index: any; row: any }) {
            return slotRender({
              index: scope.$index,
              row: scope.row
            })
          }
        }
        // @ts-ignore
        data.scopedSlots = scopedSlots
      }
    }

    return <el-table-column {...data} />
  }
  public boxHeight() {
    if (((this.$el.parentNode as any).parentElement as any).parentElement) {
      return ((this.$el.parentNode as any).parentElement as any).offsetHeight
    }
    return 0
  }
  public getOther() {
    let height = 108

    if (!this.hasPagination) {
      height -= 40
    }
    const selection = (this.$el.parentNode as any).querySelector(".selection_area")
    if (((this.$el.parentNode as any).parentElement as any).parentElement.className.indexOf("page") > -1) {
      height = height + 16
    }
    if (selection) {
      height = height + selection.clientHeight + 1
    } else {
      height -= 50
    }
    return height
  }
  public registResizeEvent() {
    const tableContainer = ((this.$el.parentNode as any).parentElement as any).parentElement
    resizeEvent(tableContainer, () => {
      if (this.boxHeight() > 0 && this.boxHeight() - this.getOther() !== this.tableHeight) {
        this.resizeTableHeight()
      }
    })
    this.resizeTableHeight()
  }
  public resizeTableHeight() {
    this.tableHeight = this.boxHeight() - this.getOther()
  }
  protected render() {
    const data = {
      on: this.events,
      props: this.props
    }

    if (this.props && this.props.height) {
      if (this.props.height === "auto") {
        const props = _.cloneDeep(this.props)

        delete props.height
        data.props = props
      }
    } else {
      data.props = Object.assign({ height: this.tableHeight }, this.props)
    }
    return (
      <el-table ref="table" {...data}>
        {this.columns.map((column: any) => {
          return this.renderColumn(column)
        })}
      </el-table>
    )
  }
  private mounted() {
    if (!(this.props && this.props.height)) {
      this.$nextTick(() => {
        this.registResizeEvent()
      })
    }
  }
}
