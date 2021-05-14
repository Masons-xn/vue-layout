<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2021-03-30 13:25:11
 * @LastEditTime: 2021-04-12 14:13:36
 * @LastEditors:  
-->
<template>
  <div class="geye-100">
    <g-data-table
      ref="table"
      :url="method"
      title="参数映射"
      :params="params"
      :columns="columns"
      :tableConfig="tableConfig"
    >
      <template slot="buttons">
        <!-- <g-button text="接口编写" @click="addCode"></g-button> -->
        <g-button text="接口编排" @click="addMapping"></g-button>
      </template>
      <template slot="operator" slot-scope="{ row }">
        <g-button type="text" text="编排" @click="Composea(row)"></g-button>
        <el-divider direction="vertical"></el-divider>
        <g-button button-type="edit" @click="editUser(row)"></g-button>
        <el-divider direction="vertical"></el-divider>
        <g-button button-type="delete" @click="delUser(row)"></g-button>
      </template>
    </g-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator'
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
  private method = '/bffBackForFront/query'
  private user = 1
  private listData = []
  private treeData = []
  private nameValue = ''
  dialogVisible = false
  get columns() {
    return [
      {
        label: '接口地址',
        prop: 'url',
        selection: true
      },
      {
        label: '描述',
        prop: 'des',
        selection: true
      },
      {
        label: '操作',
        slotName: 'operator',
        align: 'center',
        width: 150
      }
    ]
  }
  handleClose(done: () => void) {
    this.$confirm('确定要关闭？').then(() => {
      done()
    })
  }
  public addMapping() {
    this.$router.push('/bffservice')
  }
  public toggleDialog() {
    this.dialogVisible = !this.dialogVisible
  }
  public editUser(user: { id: string }) {
    this.$router.push('/bffservice?id=' + user.id)
  }
  public Composea(user: { id: string }) {
    this.$router.push('/bffservicea?id=' + user.id)
  }
  public reload() {
    ;(this.$refs.table as any).fetch()
  }
  public delUser(users: any) {
    console.log(users)
    this.$confirm(this.$t('确定删除此资源吗?').toString(), '提示', {
      type: 'warning'
    }).then(() => {
      this.$api('delBffBackForFront', {
        id: [users.id]
      }).then((res): void => {
        if (res.code === '200') {
          this.$message.success('删除成功')
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
