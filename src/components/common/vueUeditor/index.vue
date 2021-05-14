<template>
  <div v-loading="loading" class="geye-p-8 height100">
    <quill-editor
      v-model="value"
      ref="QuillEditor"
      class="vue-quill-editor"
      @change="ValueChange(value)"
      :options="editorOption"
    >
    </quill-editor>
    <g-upload
      :list="pathId"
      ref="upload"
      id="quill"
      v-on:success="uploadSuccess"
      multiple="multiple"
      v-on:beforeUpload="beforeUpload"
    ></g-upload>
  </div>
</template>
<script lang="ts">
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['link', 'image', 'video'],
  ['clean']
]
// @focus="onEditorFocus($event)"
// @blur="onEditorBlur($event)"
// @change="onEditorChange($event)">
import { Vue, Component, Prop, Model, Emit } from 'vue-property-decorator'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
import * as Quill from 'quill'
@Component({
  components: {
    quillEditor
  }
})
export default class Index extends Vue {
  pathId: any = []
  @Model('change', { type: String, default: '123' }) public content: string
  // @Prop({default:''}) model: string
  // content= ``
  value = ''
  loading = false
  editorOption = {
    modules: {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: value => {
            if (value) {
              this.$bus.emit('triggerUpload', 'aaa')
            }
          },
          clean: val => {
            this.content = ''
          }
        }
      }
    },
    placeholder: '请输入正文'
  }
  beforeUpload() {
    this.loading = true
  }
  @Emit('change')
  ValueChange() {}
  created(): void {
    this.value = this.content
  }
  uploadSuccess(res) {
    let quill = (this.$refs.QuillEditor as any).quill
    if (res) {
      let length = quill.getSelection().index
      quill.insertEmbed(length, 'image', res)
      quill.setSelection(length + 1)
      this.loading = false
    } else {
      this.loading = false
    }
  }
  //   onEditorReady (editor) {
  //     console.log(editor)
  //   }
  // // 富文本编辑器 失去焦点事件
  //   onEditorBlur (editor) {
  //     console.log(editor)
  //   }
  // // 富文本编辑器 获得焦点事件
  //   onEditorFocus (editor) {
  //     console.log(editor)
  //   }
  // // 富文本编辑器 内容改变事件
  //   onEditorChange (editor) {
  //     console.log(editor)
  //   }
}
</script>
<style lang="scss">
.height100 {
  height: 100%;
}
.vue-quill-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .ql-toolbar {
    flex: 0;
  }
  .ql-container {
    flex: auto;
    height: auto;
    overflow: auto;
  }
}
</style>
