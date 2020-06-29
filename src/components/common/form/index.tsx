import { Vue, Component, Prop } from "vue-property-decorator"
import { Form, Row } from "element-ui"
import _ from "lodash"

const rowSpan = 12
const INPUT_DEFAULT = {
  autocomplete: "new-password"
}

@Component
export default class GForm extends Vue {
  @Prop() public rules: any
  @Prop() public row: any
  @Prop() public model: any
  public getTpye(str: string) {
    if (!str) {
      return ["text", "text"]
    }
    return str.split(",")
  }
  public verify(fn: (state: boolean) => {}) {
    ;(this.$refs.form as Form).validate(valid => {
      fn(valid)
    })
  }
  get props() {
    return {
      rules: this.rules,
      model: this.model,
      "label-width": "80px",
      "label-position": "left",
      ref: "form"
    }
  }
  get events() {
    return Object.assign(this.$listeners)
  }
  public renderSelect(row, index) {
    const data = {
      props: row,
      on: row.events
    }

    return (
      <el-col span={rowSpan} class={"form_item"}>
        <el-form-item {...data} class={index % 2 === 1 ? "geye-ml-10" : "geye-mr-10"}>
          <el-select v-model={this.model[row.prop]} {...data}>
            {(row.options || []).map(v => {
              v.key = v.value
              const op = {
                props: v
              }
              return <el-option {...op} />
            })}
          </el-select>
        </el-form-item>
      </el-col>
    )
  }
  public renderSelectTree(row: { checkStrictly: boolean; events: any; prop: string | number }, index: number) {
    row.checkStrictly = false
    const data = {
        props: row,
        on: row.events
      },
      valueChange = (rows: { prop: string | number; val: any }) => {
        this.model[rows.prop] = rows.val
      }

    return (
      <el-col span={rowSpan} class={"form_item"}>
        <el-form-item {...data} class={index % 2 === 1 ? "geye-ml-10" : "geye-mr-10"}>
          <g-select-tree on-valueChange={valueChange} {...data} v-model={this.model[row.prop]} />
        </el-form-item>
      </el-col>
    )
  }

  public renderInput(row: { type: string; events: any; prop: string | number; placeholder: any }, index: number) {
    const input = _.cloneDeep(row)

    input.type = this.getTpye(row.type)[1]
    const data = {
      props: Object.assign(input, INPUT_DEFAULT),
      on: row.events
    }

    return (
      <el-col span={rowSpan} class={"form_item"}>
        <el-form-item {...data} class={index % 2 === 1 ? "geye-ml-10" : "geye-mr-10"}>
          <el-input {...data} v-model={this.model[row.prop]} placeholder={row.placeholder} size="small" />
        </el-form-item>
      </el-col>
    )
  }
  protected render() {
    const data = {
      props: this.props
    }

    return (
      <el-form ref="form" {...data}>
        <el-row>
          {this.row.map((row: any, index: number) => {
            if (this.getTpye(row.type)[0] === "select") {
              return this.renderSelect(row, index)
            } else if (this.getTpye(row.type)[0] === "text") {
              return this.renderInput(row, index)
            } else if (this.getTpye(row.type)[0] === "selectTree") {
              return this.renderSelectTree(row, index)
            }
          })}
        </el-row>
      </el-form>
    )
  }
}
