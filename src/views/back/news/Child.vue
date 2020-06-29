<template>
  <div class="home">
    vue+ts项目vue-property-decorator用法
    <hr>
    <input type="text" v-model="inputValue" @input="valueChange($event.target.value)">
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Emit, Prop } from 'vue-property-decorator'

@Component({})
export default class Home extends Vue {
  private inputValue = ''
  private created() {
    this.inputValue = this.valueFromModel
  }
  @Model ('changeValueFromModel')  valueFromModel !: string
  aaa(a){
    console.log(a)
  }
  
  @Emit('changeValueFromModel')
  // 参数应该为输入框的值，所以上面传过来的值应该为value而不能是e
  valueChange(val: string){
    console.log(val)
  }
}
</script>

