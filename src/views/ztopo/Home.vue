<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2021-01-08 11:25:43
 * @LastEditTime: 2021-02-22 08:59:14
 * @LastEditors:  
-->
<template>
  <div class="home" id="Home" ref="home">
    <Performance></Performance>
  </div>
</template>

<script lang="ts">
import Performance from '@/components/performance.vue'
import { Component, Vue } from 'vue-property-decorator'
// import init from './force/index'
import init from './init'
import resizeEvent from 'element-resize-event'
@Component({
  components: { Performance }
})
export default class Home extends Vue {
  mounted() {
    const topoData = {
      id: 999,
      display: 'circle',
      isCenter: true,
      name: 'sadf@sdfw',
      children: [
        {
          id: '2-3a0d-8d4c-8055-444',
          name: '133',
          index: 1,
          display: 'h',
          spaceing: 30,
          width: 80,
          height: 80,
          radius: 100,
          level: 0,
          pid: '999'
        },
        {
          id: '2-3a0d-8d4c-8055-02ba77075103',
          name: '11',
          index: 1,
          display: 'h',
          spaceing: 30,
          width: 60,
          height: 60,
          radius: 100,
          level: 0,
          pid: '999'
        },
        {
          id: 'a9030ad0-3a0d-8d4c-8055-02ba77075103',
          name: '峉辤0',
          index: 1,
          display: 'h',
          spaceing: 30,
          width: 60,
          height: 60,
          radius: 100,
          level: 0,
          children: [
            {
              id: 'a7f6f949-5adf-8c88-b4d7-6cdcf72abbe8',
              name: '侞铒1',
              index: 1,
              display: 'h',
              spaceing: 30,
              width: 60,
              height: 60,
              radius: 100,
              level: 1,
              pid: 'a9030ad0-3a0d-8d4c-8055-02ba77075103'
              // children: [
              //   {
              //     id: '8477ef96-9f8c-ac2c-b130-85543c2b74b2',
              //     name: '僁侐2',
              //     index: 1,
              //     display: 'h',
              //     spaceing: 30,
              //     width: 60,
              //     height: 60,
              //     radius: 100,
              //     level: 2,
              //     pid: 'a7f6f949-5adf-8c88-b4d7-6cdcf72abbe8'
              //   },
              //   {
              //     id: 'b914c63b-ee07-91f1-b61f-361b7075fddf',
              //     name: '泗鉀2',
              //     index: 1,
              //     display: 'h',
              //     spaceing: 30,
              //     width: 60,
              //     height: 60,
              //     radius: 100,
              //     level: 2,
              //     pid: 'a7f6f949-5adf-8c88-b4d7-6cdcf72abbe8'
              //   },
              //   {
              //     id: '8b5b6dcf-b8b4-b2ed-8927-9eeca757b3fb',
              //     name: '笳苖2',
              //     index: 1,
              //     display: 'h',
              //     spaceing: 30,
              //     width: 60,
              //     height: 60,
              //     radius: 100,
              //     level: 2,
              //     pid: 'a7f6f949-5adf-8c88-b4d7-6cdcf72abbe8'
              //   },
              //   {
              //     id: 'befa5a35-8713-b30e-b408-941697690a03',
              //     name: '疿懒2',
              //     index: 1,
              //     display: 'h',
              //     spaceing: 30,
              //     width: 60,
              //     height: 60,
              //     radius: 100,
              //     level: 2,
              //     pid: 'a7f6f949-5adf-8c88-b4d7-6cdcf72abbe8'
              //   }
              // ]
            },
            {
              id: '9d0ce00b-aebb-ade3-a57b-ec9b0219c34f',
              name: '11144',
              index: 1,
              display: 'h',
              spaceing: 30,
              width: 60,
              height: 60,
              radius: 100,
              level: 1,
              pid: 'a9030ad0-3a0d-8d4c-8055-02ba77075103',
              children: [
                {
                  id: '84e59bfd-d1c0-9cbf-be4f-52c9e06fdbda',
                  name: '61',
                  index: 1,
                  display: 'h',
                  spaceing: 30,
                  width: 60,
                  height: 60,
                  radius: 100,
                  level: 2,
                  pid: '9d0ce00b-aebb-ade3-a57b-ec9b0219c34f'
                },
                {
                  id: 'b77a9bb7-64c1-943e-9291-ac9dc698c352',
                  name: '62',
                  index: 1,
                  display: 'h',
                  spaceing: 30,
                  width: 60,
                  height: 60,
                  radius: 100,
                  level: 2,
                  pid: '9d0ce00b-aebb-ade3-a57b-ec9b0219c34f'
                },
                {
                  id: '989f85e8-ca6a-8a7e-ab08-2f7ad20a63dc',
                  name: '63',
                  index: 1,
                  display: 'h',
                  spaceing: 30,
                  width: 60,
                  height: 60,
                  radius: 100,
                  level: 2,
                  pid: '9d0ce00b-aebb-ade3-a57b-ec9b0219c34f'
                }
              ]
            },
            {
              id: '9d0ce001b-aebb-ade3-a57b-ec9b0219c34f',
              name: 'as',
              index: 1,
              display: 'h',
              spaceing: 30,
              width: 60,
              height: 60,
              radius: 100,
              level: 1,
              pid: 'a9030ad0-3a0d-8d4c-8055-02ba77075103'
            },
            {
              id: '9d0c001b-aebb-ade3-a57b-ec9b0219c34f',
              name: 'asd',
              index: 1,
              display: 'h',
              spaceing: 30,
              width: 60,
              height: 60,
              radius: 100,
              level: 1,
              pid: 'a9030ad0-3a0d-8d4c-8055-02ba77075103'
            },
            {
              id: 'b33ef416-0ba7-95a4-af6b-24894dee9454',
              name: 'dasw',
              index: 1,
              display: 'v',
              spaceing: 30,
              width: 60,
              height: 60,
              radius: 100,
              level: 1,
              pid: 'a9030ad0-3a0d-8d4c-8055-02ba77075103',
              children: [
                {
                  id: 'b451cdb6-b5b9-91ae-9049-46d289b49839',
                  name: 'ccc1',
                  index: 1,
                  display: 'h',
                  spaceing: 30,
                  width: 60,
                  height: 60,
                  radius: 100,
                  level: 2,
                  pid: 'b33ef416-0ba7-95a4-af6b-24894dee9454'
                },
                {
                  id: 'b93cfbbd-8014-af36-b5a3-f8ad4b312168',
                  name: 'ccc2',
                  index: 1,
                  display: 'h',
                  spaceing: 30,
                  width: 60,
                  height: 60,
                  radius: 100,
                  level: 2,
                  pid: 'b33ef416-0ba7-95a4-af6b-24894dee9454'
                }
              ]
            }
          ]
        }
      ]
    }
    init(topoData, document.querySelector('#Home'))
  }
}
</script>
<style scoped>
.home {
  height: 100%;
  width: 100%;
}
</style>
