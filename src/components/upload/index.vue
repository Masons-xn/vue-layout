<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2021-04-21 14:06:51
 * @LastEditTime: 2021-04-22 10:41:47
 * @LastEditors:  
-->
<!-- 作者 xn-->
<!-- 时间 2019/8/6-->

<template>
  <el-upload
    :disabled="disabled"
    action="/api/upload/image"
    :multiple="multiple"
    :file-list="fileList"
    :on-success="uploadImgSuccess"
    :on-remove="handleRemove"
    :before-upload="beforeUpload"
    list-type="fileList"
  >
    <el-button :id="id" type="primary" size="mini">点击上传</el-button>
  </el-upload>
</template>

<script lang="ts">
import { Vue, Component, Provide, Prop, Watch } from 'vue-property-decorator'

interface UploadData {
  uid?: string
  url?: string
  id?: string
}
@Component
export default class Page extends Vue {
  public fileList: object[] = []
  public imageList: string[] = []
  public disabled = false
  @Prop({ default: '' }) private edit: false
  @Prop({ default: '' }) private id: string
  @Prop({ default: '' }) private list: string
  @Prop({ default: false }) private multiple: boolean
  public handleRemove(arg: UploadData) {
    this.fileList = this.fileList.filter((item: UploadData) => item.uid !== arg.uid)
  }
  public beforeUpload() {
    this.$emit('beforeUpload')
  }
  public uploadImgSuccess(arg) {
    this.fileList.push({
      name: `${arg.res.filename}`,
      url: `/api/upload/get?id=${arg.res.id}`,
      id: arg.res.id
    })
    this.$emit('success', {
      name: `${arg.res.filename}`,
      url: `/api/upload/get?id=${arg.res.id}`,
      id: arg.res.id
    })
  }
  public getList() {
    return this.fileList
  }
  @Watch('list', { immediate: true, deep: true })
  public onlistChange(val) {
    const path: object[] = []
    if (val.length > 0) {
      val.map((item, index) => {
        path.push({ url: `/api/upload/get?id=${item}`, id: item, uid: index, name: item.name })
        this.imageList.push(item)
      })
    }
    this.fileList = path
  }
  @Watch('fileList', { immediate: true, deep: true })
  public onfileListChange(val) {
    this.imageList = []
    val.map((item, index) => {
      this.imageList.push(item.id)
    })
    this.disabled =
      (!this.multiple && this.imageList.length === 1) ||
      (!this.multiple && this.imageList.length === 1)
  }
}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  width: 100%;
  padding: 8px 8px;
}
.isQuill {
  width: 0;
  height: 0;
  overflow: hidden;
  position: fixed;
}
</style>
