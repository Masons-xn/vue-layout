<template>
  <div class="parent">
    parent组件--{{title}}
    <hr>
    <Home v-model="title"></Home>
  </div>
</template>

<script lang='ts'>
import Home from './Child.vue'
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    Home
  }
})
export default class  extends Vue {
  private title = '父组件中的值'
}
</script>
