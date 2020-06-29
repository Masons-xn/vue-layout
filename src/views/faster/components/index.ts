const files = require.context("./", true, /.(vue|ts)$/).keys()
const pool: any = {}

for (const item of files) {
  if (item.indexOf("index") > -1 && item !== "./index.ts") {
    pool[item.split("/")[1]] = require(`${item}`).default
  }
}
export default pool
