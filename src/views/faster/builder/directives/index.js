import { Verification } from "./verification"
const directives = {}

directives.install = function(vue) {
  Verification.install(vue)
}

export default directives
