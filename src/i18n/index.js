import { createI18n } from 'vue-i18n'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'

const i18n = createI18n({
  legacy: false, // для Composition API
  locale: 'ru', // язык по умолчанию
  fallbackLocale: 'ru', // резервный язык
  messages: {
    ru,
    en
  }
})

// Функция для смены языка
export function changeLanguage(lang) {
  i18n.global.locale.value = lang
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('preferred_language', lang)
  }
  document.cookie = `django_language=${lang}; path=/; max-age=${365*24*60*60}`
}

// Инициализация языка при загрузке
export function initI18n() {
  let savedLang = 'ru'
  
  if (typeof localStorage !== 'undefined') {
    savedLang = localStorage.getItem('preferred_language') || 'ru'
  }
  
  // Пробуем получить из куки
  const cookieLang = getCookie('django_language')
  if (cookieLang && ['ru', 'en'].includes(cookieLang)) {
    savedLang = cookieLang
  }
  
  if (['ru', 'en'].includes(savedLang)) {
    i18n.global.locale.value = savedLang
  }
}

// Вспомогательная функция для получения куки
function getCookie(name) {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// Инициализируем при импорте
initI18n()

export default i18n