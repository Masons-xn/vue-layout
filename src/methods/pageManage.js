import { getAllJSDocTagsOfKind } from "typescript"

/**
 * Created by xining.lao on 7/7/2017.
 */
let id = ""
function pageToEdita(unit, base, argument) {
  base.routerTo(`/builder?path=${argument.path}`)
}

function addUser(unit, base, argument) {
  base.dialogOpen("rbdialog-C02RY")
  id = ""
}
function editUser(unit, base, argument) {
  id = argument.id
  base.dialogOpen("rbdialog-C02RY")
}
function rbformB3S3G(uint, base, that) {
  if (id !== "") {
    that.loadDetial(id)
  }
}
function rbdialogC02RY(uint, base, that) {
  if (id !== "") {
    that.title = "编辑用户"
  } else {
    that.title = "新增用户"
  }
}

function addUserGroup(unit, base, argument) {
  base.dialogOpen("rbdialog-WX8QJ")
  id = ""
}
function editUserGroup(unit, base, argument) {
  id = argument.id
  base.dialogOpen("rbdialog-WX8QJ")
}
function rbformcYBzX(uint, base, that) {
  if (id !== "") {
    that.loadDetial(id)
  }
}
function rbdialogWX8QJ(uint, base, that) {
  if (id !== "") {
    that.title = "编辑用户组"
  } else {
    that.title = "新增用户组"
  }
}

export { addUser, pageToEdita, editUser, rbformB3S3G, rbdialogC02RY, rbformcYBzX, rbdialogWX8QJ, editUserGroup, addUserGroup }
