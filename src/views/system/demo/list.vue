<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-12-24 18:00:59
 * @LastEditTime: 2020-12-28 17:44:02
 * @LastEditors:  
-->
<template>
  <div class="geye-100">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose">
      <user-add ref="addUser" :user="user" v-on:reload="reload" />
    </el-dialog>
    <g-data-table
      ref="table"
      :url="method"
      :params="params"
      :columns="columns"
      :tableConfig="tableConfig"
    >
      <template slot="buttons">
        <g-button text="增加一级数据" @click="editUser(row)"></g-button>
        <g-button text="增加二级数据" @click="editUser(row)"></g-button>
        <g-button text="增加三级数据" @click="editUser(row)"></g-button>
        <g-button button-type="add" @click="addUser"></g-button>
      </template>
      <template slot="operator" slot-scope="{ row }">
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
// system/dictionary/dictionary
/// sys/dictionary
@Component({
  components: { UserAdd }
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
  private method = 'queryUsers'
  private user = {}
  private listData = []
  private treeData = []
  private nameValue = ''
  dialogTitle = '新增用户'
  dialogVisible = false
  get columns() {
    return [
      {
        label: '用wwww户名',
        prop: 'username',
        selection: true
      },
      {
        label: '所属用户aaaaa组',
        prop: 'userGroup.groupName'
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

  public reload() {
    this.dialogVisible = false
    this.user = {}
    ;(this.$refs.table as any).fetch()
  }
  handleClose(done: () => void) {
    this.$confirm('确定要关闭？').then(() => {
      done()
    })
  }
  public delUser(users: any) {
    this.$confirm(this.$t('确定删除此资源吗?').toString(), '提示', {
      type: 'warning'
    }).then(() => {
      this.$api('delUser', {
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
