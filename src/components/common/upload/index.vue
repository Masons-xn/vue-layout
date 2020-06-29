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
    :before-upload = 'beforeUpload'
    list-type="picture"
    :class="isQuill"
  >
    <el-button size="small" :id="id"  type="primary">点击上传</el-button>
  </el-upload>
</template>

<script lang="ts">
import { Vue, Component, Provide, Prop, Watch } from "vue-property-decorator"

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
  @Prop({ default: "" }) private edit: false
  @Prop({ default: "" }) private id: string
  @Prop({ default: "" }) private list: string
  @Prop({ default: false }) private multiple: boolean
  public handleRemove(arg: UploadData) {
    this.fileList = this.fileList.filter(
      (item: UploadData) => item.uid !== arg.uid
    )
  }
  get isQuill(){
    return this.id === 'quill'?" isQuill":''
  }
  public beforeUpload(){
    this.$emit('beforeUpload')
  }
  public uploadImgSuccess(arg) {
    this.fileList.push({
      url: `/api/upload/get?id=${arg.res.id}`,
      id: arg.res.id
    })
    this.$emit('success',`/api/upload/get?id=${arg.res.id}`)
  }
  public getList() {
    return this.fileList
  }
  created(): void {
    this.$bus.on('triggerUpload',(e)=>{
      console.log('222')
      if(this.id === 'quill'){
        (document.querySelector('#quill') as any).click()
      }
    })
  }
  @Watch("list", { immediate: true, deep: true })
  public onlistChange(val) {
    const path: object[] = []
    if (this.list.length > 0) {
      this.list.split(",").map((item, index) => {
        path.push({ url: `/api/upload/get?id=${item}`, id: item, uid: index })
        this.imageList.push(item)
      })
    }
    this.fileList = path
  }
  @Watch("fileList", { immediate: true, deep: true })
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
.isQuill{
  width: 0;
  height: 0;
  overflow: hidden;
  position: fixed;
}
</style>
