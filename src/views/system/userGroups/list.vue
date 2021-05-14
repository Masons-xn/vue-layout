<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-12-24 18:00:59
 * @LastEditTime: 2020-12-25 14:40:12
 * @LastEditors:  
-->
<template>
  <div class="geye-100">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose">
      <user-add :user="user" v-on:reload="reload" />
    </el-dialog>
    <el-dialog title="选取角色" :visible.sync="selectdialogVisible" :before-close="handleClose">
      <select-role :user="user" v-on:reload="reload" />
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
        <g-button text="分配角色" type="text" @click="selectRole(row)"></g-button>
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
import selectRole from './selectRole.vue'
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
  private method = 'queryGroups'
  private user = {}
  private listData = []
  private treeData = []
  private nameValue = ''
  dialogTitle = '新增用户'
  dialogVisible = false
  selectdialogVisible = false
  get columns() {
    return [
      {
        label: '用户组名称',
        prop: 'groupName',
        selection: 'true'
      },
      {
        label: '角色名称',
        prop: 'groupName',
        selection: 'true'
      },
      {
        label: '操作',
        slotName: 'operator',
        align: 'center',
        width: 250
      }
    ]
  }
  public addCode() {
    this.$router.push('/builder')
  }
  public addUser(user) {
    this.user = {}
    this.dialogVisible = true
    this.dialogTitle = '新增用户组'
  }
  public editUser(user) {
    this.user = user
    this.dialogVisible = true
    this.dialogTitle = '编辑用户组'
  }
  public selectRole(user) {
    this.user = user
    this.selectdialogVisible = true
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
    this.$confirm(this.$t('确定删除此用户组吗?').toString(), '提示', {
      type: 'warning'
    }).then(() => {
      this.$api('delUserGroup', {
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
