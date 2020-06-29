/**
 * Created by xining.lao on 6/9/2017.
 */
import PanelFn from "./builderpanel"
import core from "./analysis"
import pageEdit from "./pageEdit"
import PaneFn from "./builder"
import { Component, Vue } from "vue-property-decorator"

@Component({
  mixins: [core]
})
class Preview extends Vue {}
@Component({
  mixins: [PaneFn, core, PanelFn, pageEdit]
})
class DevBuilderMix extends Vue {}
export { Preview, DevBuilderMix }
