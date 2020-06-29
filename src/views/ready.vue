<template lang="html">
  <div
    class="system-ready"
    v-loading="loading"
    element-loading-text="系统准备中"
  >
    <component :is="currentView"></component>
    <p v-show="isReady">
      系统准备失败
      <a @click="ready">重试</a>
    </p>
  </div>
</template>

<script>
import Index from "./Index.vue"
import init from "@/config/ready"
export default {
  created() {
    this.ready()
  },
  data() {
    return {
      loading: true,
      isReady: false,
      currentView: ""
    }
  },
  methods: {
    ready() {
      this.loading = true
      this.isReady = false
      init(this, this.callback)
    },
    callback(result) {
      this.loading = false
      if (result === "error") {
        this.isReady = true
      } else {
        // this.isReady = true
        this.currentView = Index
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.system-ready {
  height: 100%;
}
p {
  color: #666;
  font-size: 14px;
  text-align: center;
  margin-top: 40%;
  a {
    margin-left: 10px;
  }
}
</style>
