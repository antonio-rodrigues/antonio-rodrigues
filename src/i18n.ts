import { createI18n } from 'vue-i18n'
import pt from './locales/pt.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'pt',
  fallbackLocale: 'en',
  messages: {
    pt,
    en
  }
})

export default i18n
