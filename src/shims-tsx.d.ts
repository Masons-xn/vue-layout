import Vue, { VNode } from "vue"
import { PropOptions } from 'vue'

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
  interface PropOptions {
    [x: string]: any
  }
}
