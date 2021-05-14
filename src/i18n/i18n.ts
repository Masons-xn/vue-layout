/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-07-30 16:08:30
 * @LastEditTime: 2021-03-30 14:58:31
 * @LastEditors:
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
function loadLocaleMessages() {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i),
    message: any = {}

  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)

    if (matched && matched.length > 1) {
      const locale = matched[1]

      message[locale] = locales(key)
    }
  })
  return message
}

const messages = loadLocaleMessages()

Vue.prototype.$languages = Object.keys(messages).map(langlage => ({
  label: messages[langlage]._name,
  value: langlage
}))
export default new VueI18n({
  locale: 'zh-chs',
  fallbackLocale: 'zh-chs',
  messages
})
