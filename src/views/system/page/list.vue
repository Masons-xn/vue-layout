<template>
  <div class="geye-100">
    <g-data-table ref="table"
                  :url="method"
                  :params="params"
                  :columns="columns"
                  :tableConfig="tableConfig">
      <template slot="buttons">
        <g-button button-type="add"
                  @click="addCode"></g-button>
      </template>
      <template slot="operator"
                slot-scope="{ row }">
        <g-button button-type="edit"
                  @click="editUser(row)"></g-button>
        <el-divider direction="vertical"></el-divider>
        <g-button button-type="delete"
                  @click="delUser([row.id])"></g-button>
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
    return []
  }
  private method = "/rbpage/query"
  private user = 1
  private listData = []
  private treeData = []
  private nameValue = ""
  get columns() {
    return [
      {
        label: "标题",
        prop: "name",
        selection: true
      },
      {
        label: "路由",
        prop: "path"
      },
      {
        label: "容器类型",
        prop: "containerType"
      },
      {
        label: "元素类型",
        prop: "elementType"
      },
      {
        label: "初始化方法",
        prop: "initMethods"
      },
      {
        label: "文件地址",
        prop: "files"
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
    this.$router.push("/builder")
  }

  public editUser(user: { path: string }) {
    this.$router.push("/builder?path=" + user.path)
  }

  public reload() {
    ;(this.$refs.table as any).fetch()
  }
  public delUser(users: any) {
    this.$confirm(this.$t("确定删除此资源吗?").toString(), "提示", {
      type: "warning"
    }).then(() => {
      this.$api("fasterDelPage", {
        data: users
      }).then((res): void => {
        if (res.code === "200") {
          this.$message.success("删除成功")
          this.reload()
        } else {
          this.$message.error(res.msg)
        }
      })
    })
  }
}
</script>

<style scoped lang="scss"></style>
