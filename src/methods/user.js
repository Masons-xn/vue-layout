// /**
//  * Created by xining.lao on 31/5/2017.
//  */
// // import md5 from 'md5'
// function userinfoInit(unit, base, argument) {
//   const router = unit("rbform-We7dy").router.query
//
//   if (router.action != "add") {
//     // unit('rbinput-msCpW').disabled= true
//     //  unit('rbinput-3YJf1').disabled= true
//     base.unitRemove(unit("rbdividertitle-6H0ct"))
//     base.unitRemove(unit("rbinput-msCpW"))
//     base.unitRemove(unit("rbinput-3YJf1"))
//     if (router.action == "search") {
//       base.unitRemove(unit("rbbutton-9kh13"))
//     }
//   } else {
//     const pwd = unit("rbinput-msCpW")
//
//     pwd.$watch("value", function(val) {
//       unit("rbinput-Atkrh").value = val
//     })
//   }
// }
// export { userinfoInit }
