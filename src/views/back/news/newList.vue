<template>
  <div class="geye-100">
    <g-data-table
      ref="table"
      :api="method"
      :params="params"
      :columns="columns"
      :tableConfig="tableConfig"
    >
      <template slot="buttons">
        <g-button button-type="add" @click="addCode"></g-button>
      </template>
      <template slot="operator" slot-scope="{ row }">
        <g-button button-type="edit" @click="editUser(row)"></g-button>
        <el-divider direction="vertical"></el-divider>
        <g-button button-type="delete" @click="delUser([row.guid])"></g-button>
      </template>
    </g-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide } from "vue-property-decorator"
@Component({
  components: {}
})
export default class UserList extends Vue {
  get tableConfig() {
    return {
      props: {
        dateRange: true
      }
    }
  }
  get params() {
    return [this.fieldType]
  }
  private fieldType: any = {
    field: "type",
    value: "news",
    type: "String",
    operator: 1
  }
  private method = "getData"
  private user = 1
  private listData = []
  private treeData = []
  private nameValue = ""
  get columns() {
    return [
      {
        type: "selection"
      },
      {
        label: "标题",
        prop: "name",
        selection: {
          type: "input",
          value: "",
          operator: 7
        }
      },
      {
        label: "菜单栏目",
        prop: "menuId",
        formatter: (item: { menuId: any }) => {
          return this.getMenu(item.menuId)
        },
        selection: {
          type: "selectTree",
          option: this.treeData,
          value: "",
          operator: 8
        }
      },
      {
        label: "路径",
        prop: "pathId",
        trans: "resourcesType"
      },
      {
        label: "顺序",
        prop: "sequence"
      },
      {
        label: "操作",
        slotName: "operator",
        align: "center",
        width: 150
      }
    ]
  }
  public addCode() {
    this.$router.push("/newList/add")
  }

  public editUser(user: { id: string }) {
    this.$router.push("/newList/add?id=" + user.id)
  }

  public getMenu(id: any) {
    // this.$router.push('/newList/add?id=' + user.guid)
    return (this.listData.filter((item:{id:string, name:string}) => item.id === id)[0] as any).name
  }

  public reload() {
    (this.$refs.table as any).fetch()
  }
  public loadResource() {
    // this.treeLoading = true
    this.$api("queryMenu").then(res => {
      this.$api("dataOrder", { data: res.result.list, key: "sequence" }).then(
        data => {
          data.map((item: { id: any; label: any; name: any }) => {
            item.label = item.name
          })
          this.$api("ArrayToHierarchy", data).then(r => {
            this.treeData = r
          })
          this.listData = data
        }
      )
    })
  }
  public created() {
    this.loadResource()
  }
  public delUser(users: any) {
    this.$api("delData", {
      guid: users
    }).then((res): void => {
      if (res.code === "200") {
        this.$message.success("删除成功")
        this.reload()
      } else {
        this.$message.error(res.msg)
      }
    })
  }
}
</script>

<style scoped lang="scss"></style>
