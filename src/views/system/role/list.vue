<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-12-24 18:00:59
 * @LastEditTime: 2020-12-26 13:20:11
 * @LastEditors:  
-->
<template>
  <div class="geye-100">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose">
      <user-add ref="addUser" :user="user" v-on:reload="reload" />
    </el-dialog>
    <el-dialog
      title="授权"
      width="90%"
      height="90%"
      :visible.sync="selectdialogVisible"
      :before-close="handleClose"
    >
      <select-role :user="user" v-on:reload="reload" ref="power" />
    </el-dialog>
    <g-data-table
      ref="table"
      :url="method"
      :params="params"
      :columns="columns"
      :tableConfig="tableConfig"
    >
      <template slot="buttons">
        <g-button button-type="add" @click="addUser"></g-button>
      </template>
      <template slot="operator" slot-scope="{ row }">
        <g-button text="授权" type="text" @click="selectRole(row)"></g-button>
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
import UserAdd from './userAdd.vue'
import selectRole from './power.vue'
@Component({
  components: { UserAdd, selectRole }
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
  private method = 'queryRole'
  private user = {}
  private listData = []
  private treeData = []
  private nameValue = ''
  dialogTitle = '新增角色'
  dialogVisible = false
  selectdialogVisible = false
  get columns() {
    return [
      {
        label: '角色名称',
        prop: 'name',
        selection: 'true'
      },
      {
        label: '操作',
        slotName: 'operator',
        align: 'center',
        width: 150
      }
    ]
  }
  public addCode() {
    this.$router.push('/builder')
  }
  public addUser(user) {
    this.user = {}
    this.dialogVisible = true
    this.dialogTitle = '新增角色'
  }
  public editUser(user) {
    this.user = user
    this.dialogVisible = true
    this.dialogTitle = '编辑角色'
  }
  public selectRole(user) {
    this.user = user
    this.selectdialogVisible = true
    // ;(this.$refs['power'] as any).pageLoad()
  }
  public reload() {
    this.dialogVisible = false
    this.selectdialogVisible = false
    this.user = {}
    ;(this.$refs.table as any).fetch()
  }
  handleClose(done: () => void) {
    this.$confirm('确定要关闭？').then(() => {
      done()
    })
  }
  public delUser(users: any) {
    this.$confirm(this.$t('确定删除此角色吗?').toString(), '提示', {
      type: 'warning'
    }).then(() => {
      this.$api('delRole', {
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
