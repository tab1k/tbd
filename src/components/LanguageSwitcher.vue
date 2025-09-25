<template>
  <div class="language-switcher">
    <button 
      v-for="lang in availableLocales" 
      :key="lang"
      @click="changeLanguage(lang)"
      :class="{ active: currentLocale === lang }"
      class="lang-btn"
    >
      {{ getLanguageName(lang) }}
    </button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale, availableLocales } = useI18n();
    
    const changeLanguage = (newLocale) => {
      locale.value = newLocale;
      // Сохраняем выбор в localStorage
      localStorage.setItem('preferred-language', newLocale);
    };
    
    const getLanguageName = (langCode) => {
      const names = {
        ru: 'РУ',
        en: 'EN', 
        kz: 'KZ'
      };
      return names[langCode] || langCode;
    };
    
    return {
      currentLocale: locale,
      availableLocales,
      changeLanguage,
      getLanguageName
    };
  },
  mounted() {
    // Восстанавливаем язык из localStorage
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && this.availableLocales.includes(savedLang)) {
      this.changeLanguage(savedLang);
    }
  }
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 10px;
}

.lang-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.lang-btn:hover {
  background: #f5f5f5;
}

.lang-btn.active {
  background: #000F42;
  color: white;
  border-color: #000F42;
}
</style><template>
  <div class="language-switcher">
    <button 
      v-for="lang in availableLocales" 
      :key="lang"
      @click="changeLanguage(lang)"
      :class="{ active: currentLocale === lang }"
      class="lang-btn"
    >
      {{ getLanguageName(lang) }}
    </button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale, availableLocales } = useI18n();
    
    const changeLanguage = (newLocale) => {
      locale.value = newLocale;
      // Сохраняем выбор в localStorage
      localStorage.setItem('preferred-language', newLocale);
    };
    
    const getLanguageName = (langCode) => {
      const names = {
        ru: 'РУ',
        en: 'EN', 
        kz: 'KZ'
      };
      return names[langCode] || langCode;
    };
    
    return {
      currentLocale: locale,
      availableLocales,
      changeLanguage,
      getLanguageName
    };
  },
  mounted() {
    // Восстанавливаем язык из localStorage
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && this.availableLocales.includes(savedLang)) {
      this.changeLanguage(savedLang);
    }
  }
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 10px;
}

.lang-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.lang-btn:hover {
  background: #f5f5f5;
}

.lang-btn.active {
  background: #000F42;
  color: white;
  border-color: #000F42;
}
</style>