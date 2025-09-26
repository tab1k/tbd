<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light">
      <!-- Лого -->
      <a class="navbar-brand fw-bold" href="/">
        <img src="/logo.png" style="height: 45px;" alt="logo" />
      </a>

      <!-- Контейнер для кнопки и бургера (мобильные) -->
      <div class="d-flex align-items-center d-lg-none">
        <!-- Кнопка языка для мобильных -->
        <button 
          class="language-mobile-btn me-2"
          @click="toggleLanguagePopup"
        >
          {{ currentLanguageCode }}
        </button>
        
        <!-- Кнопка для планшетов -->
        <a href="#" @click.prevent="openPopup" class="btn-accent btn-sm me-2 d-none d-sm-inline-block">
          {{ $t('navigation.consultation') }}
        </a>
        
        <!-- Бургер -->
        <button
          class="navbar-toggler"
          type="button"
          @click="toggleMenu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- Центрированное меню -->
      <div :class="['collapse', 'navbar-collapse', 'justify-content-center', 'flex-grow-1', { show: isMenuOpen }]" id="navmenu">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item"><a href="#about" class="nav-link" @click="closeMenu">{{ $t('navigation.about') }}</a></li>
          <li class="nav-item"><a href="#team" class="nav-link" @click="closeMenu">{{ $t('navigation.team') }}</a></li>
          <li class="nav-item"><a href="#partners" class="nav-link" @click="closeMenu">{{ $t('navigation.partners') }}</a></li>
          <li class="nav-item"><a href="#services" class="nav-link" @click="closeMenu">{{ $t('navigation.services') }}</a></li>
          <li class="nav-item"><a href="#contacts" class="nav-link" @click="closeMenu">{{ $t('navigation.contacts') }}</a></li>
        </ul>
        
        <!-- Кнопка в меню для мобильных -->
        <div class="d-lg-none text-center mt-3">
          <a href="#" @click.prevent="openPopup" class="btn-accent">{{ $t('navigation.consultation') }}</a>
        </div>
      </div>

      <!-- Правая часть (десктоп) -->
      <div class="d-none d-lg-flex align-items-center">
        <!-- Dropdown с языками -->
        <div class="dropdown language-dropdown me-3">
          <button 
            class="btn dropdown-toggle language-desktop-btn" 
            type="button" 
            @click="toggleLanguagePopup"
            ref="languageBtn"
          >
            {{ currentLanguageCode }}
          </button>
          
          <!-- Попап выбора языка -->
          <div 
            v-if="isLanguagePopupOpen" 
            class="language-popup"
            ref="languagePopup"
          >
            <button 
              class="language-option"
              :class="{ active: currentLanguage === 'ru' }"
              @click="setLanguage('ru')"
            >
              <span class="language-flag">🇷🇺</span>
              Русский
            </button>
            <button 
              class="language-option"
              :class="{ active: currentLanguage === 'en' }"
              @click="setLanguage('en')"
            >
              <span class="language-flag">🇺🇸</span>
              English
            </button>
          </div>
        </div>

        <!-- Кнопка справа -->
        <a href="#" @click.prevent="openPopup" class="btn-accent">{{ $t('navigation.consultation') }}</a>
      </div>

      <!-- Мобильный попап языка -->
      <div 
        v-if="isLanguageMobilePopupOpen" 
        class="language-mobile-popup-overlay"
        @click="closeLanguagePopup"
        :class="{ 'no-scroll': isLanguageMobilePopupOpen }"
      >
        <div class="language-mobile-popup" @click.stop>
          <div class="language-popup-header">
            <h3>{{ $t('country.select') }}</h3>
            <button class="close-btn" @click="closeLanguagePopup">×</button>
          </div>
          <div class="language-options-mobile">
            <button 
              class="language-option-mobile"
              :class="{ active: currentLanguage === 'ru' }"
              @click="setLanguage('ru')"
            >
              <span class="language-flag">🇷🇺</span>
              <div>
                <div class="language-name">Русский</div>
                <div class="language-native">Russian</div>
              </div>
            </button>
            <button 
              class="language-option-mobile"
              :class="{ active: currentLanguage === 'en' }"
              @click="setLanguage('en')"
            >
              <span class="language-flag">🇺🇸</span>
              <div>
                <div class="language-name">Английский</div>
                <div class="language-native">English</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <PopupContact :isOpen="showPopup" @close="showPopup = false" />
    </nav>
  </header>
</template>

<script>
import PopupContact from '@/components/home/PopupContact.vue';
import { changeLanguage } from '@/i18n';

export default {
  components: { PopupContact },
  name: "Header",
  data() {
    return {
      isMenuOpen: false,
      showPopup: false,
      isLanguagePopupOpen: false,
      isLanguageMobilePopupOpen: false
    }
  },
  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },
    currentLanguageCode() {
      return this.currentLanguage.toUpperCase();
    }
  },
  methods: {
    setLanguage(lang) {
      changeLanguage(lang);
      this.closeLanguagePopup();
      
      // Эмитируем событие для родительского компонента
      this.$emit('language-changed', lang);
      
      // Можно также обновить данные с бэкенда
      this.reloadData();
    },
    
    async reloadData() {
      try {
        // Здесь можно перезагружать данные с бэкенда
        // Например: 
        // await this.$store.dispatch('loadTeamData');
        // await this.$store.dispatch('loadCasesData');
        console.log('Язык изменен на:', this.currentLanguage);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    },
    
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      this.closeLanguagePopup();
    },
    
    closeMenu() {
      this.isMenuOpen = false;
    },
    
    openPopup() {
      this.showPopup = true;
      this.closeLanguagePopup();
    },
    
    toggleLanguagePopup() {
      const isMobile = this.isMobileDevice();
      
      if (isMobile) {
        this.isLanguageMobilePopupOpen = !this.isLanguageMobilePopupOpen;
        this.isLanguagePopupOpen = false;
        
        if (this.isLanguageMobilePopupOpen) {
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
        } else {
          this.restoreScroll();
        }
      } else {
        this.isLanguagePopupOpen = !this.isLanguagePopupOpen;
        this.isLanguageMobilePopupOpen = false;
      }
    },
    
    isMobileDevice() {
      return window.innerWidth < 992 || 
             window.matchMedia('(max-width: 991px)').matches ||
             window.innerHeight < 500 ||
             'ontouchstart' in window;
    },
    
    closeLanguagePopup() {
      this.isLanguagePopupOpen = false;
      this.isLanguageMobilePopupOpen = false;
      this.restoreScroll();
    },
    
    restoreScroll() {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    },
    
    handleClickOutside(event) {
      const languageBtn = this.$refs.languageBtn;
      const languagePopup = this.$refs.languagePopup;
      
      if (languageBtn && languagePopup && 
          !languageBtn.contains(event.target) && 
          !languagePopup.contains(event.target)) {
        this.closeLanguagePopup();
      }
    },
    
    handleResize() {
      if (window.innerWidth >= 992 && this.isLanguageMobilePopupOpen) {
        this.closeLanguagePopup();
      }
      if (window.innerWidth < 992 && this.isLanguagePopupOpen) {
        this.closeLanguagePopup();
      }
    },
    
    handleEscapeKey(event) {
      if (event.key === 'Escape') {
        this.closeLanguagePopup();
        this.closeMenu();
      }
    }
  },
  
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keydown', this.handleEscapeKey);
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleEscapeKey);
    this.restoreScroll();
  }
};
</script>



<style scoped>
header {
  background: #fff;
  border-bottom: 1px solid #eee;
}

/* 🔹 увеличенные отступы у navbar */
header .navbar {
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 12px;
  padding-bottom: 12px;
}

/* 🔹 пункты меню */
.navbar-nav .nav-link {
  margin: 0 12px;
  color: #576182;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.2px;
  transition: color 0.3s ease;
  cursor: pointer;
}
.navbar-nav .nav-link:hover {
  color: #000f42;
}

/* 🔹 кнопка справа */
.btn-accent {
  background: #000F42;
  color: #fff;
  padding: 12px 30px;
  border-radius: 60px;
  font-weight: 400;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
  border: none;
  cursor: pointer;
}
.btn-accent:hover {
  background: #001a6d;
  color: #fff;
}

/* 🔹 маленькая кнопка для планшетов */
.btn-accent.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  white-space: nowrap;
}

/* 🔹 ЯЗЫКОВОЙ ПЕРЕКЛЮЧАТЕЛЬ ДЛЯ ДЕСКТОПА */
.language-desktop-btn {
  background: transparent;
  border: 1px solid #e0e0e0;
  color: #576182;
  font-weight: 400;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.language-desktop-btn:hover {
  border-color: #000f42;
  color: #000f42;
}

.language-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 8px;
  min-width: 140px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.language-option {
  width: 100%;
  background: none;
  border: none;
  padding: 10px 12px;
  text-align: left;
  border-radius: 6px;
  font-size: 14px;
  color: #576182;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.language-option:hover {
  background: #f8f9fa;
  color: #000f42;
}

.language-option.active {
  background: #f0f2f5;
  color: #000f42;
  font-weight: 500;
}

.language-flag {
  font-size: 16px;
}

/* 🔹 ЯЗЫКОВОЙ ПЕРЕКЛЮЧАТЕЛЬ ДЛЯ МОБИЛЬНЫХ */
.language-mobile-btn {
  background: transparent;
  border: 1px solid #e0e0e0;
  color: #576182;
  font-weight: 400;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 6px;
  min-width: 50px;
  cursor: pointer;
}

/* ИСПРАВЛЕННОЕ ПОЗИЦИОНИРОВАНИЕ ПОПАПА */
.language-mobile-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.language-mobile-popup-overlay.no-scroll {
  overflow: hidden;
}

.language-mobile-popup {
  background: white;
  border-radius: 16px;
  padding: 0;
  width: 100%;
  max-width: min(320px, 90vw);
  max-height: min(400px, 80vh);
  overflow-y: auto;
  position: relative;
  margin: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.language-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-radius: 16px 16px 0 0;
}

.language-popup-header h3 {
  margin: 0;
  font-size: 18px;
  color: #000f42;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #576182;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #000f42;
}

.language-options-mobile {
  padding: 8px;
}

.language-option-mobile {
  width: 100%;
  background: none;
  border: none;
  padding: 16px;
  text-align: left;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  margin-bottom: 4px;
}

.language-option-mobile:hover {
  background: #f8f9fa;
}

.language-option-mobile.active {
  background: #f0f2f5;
  font-weight: 500;
}

.language-option-mobile:last-child {
  margin-bottom: 0;
}

.language-option-mobile .language-flag {
  font-size: 24px;
  flex-shrink: 0;
}

.language-name {
  font-size: 16px;
  color: #000f42;
  font-weight: 500;
}

.language-native {
  font-size: 14px;
  color: #576182;
  margin-top: 2px;
}

.navbar-toggler {
  border: none;
  cursor: pointer;
}

/* 🔹 адаптив */
@media (max-width: 992px) {
  .navbar-nav {
    text-align: center;
  }

  .navbar-nav .nav-link {
    margin: 8px 0;
    font-size: 15px;
  }

  li.nav-item {
    text-align: center;
  }

  header .navbar {
    padding: 16px 24px;
  }
  
  /* Адаптивность мобильного попапа */
  .language-mobile-popup {
    max-width: 95vw;
  }
}

@media (max-width: 576px) {
  .btn-accent.btn-sm {
    display: none !important;
  }
  
  .language-mobile-popup-overlay {
    padding: 15px;
    align-items: flex-start;
    padding-top: 10vh;
  }
  
  .language-mobile-popup {
    max-width: 95vw;
    max-height: 75vh;
  }
  
  .language-popup-header {
    padding: 15px;
  }
  
  .language-option-mobile {
    padding: 12px;
  }
}

@media (min-width: 577px) and (max-width: 992px) {
  .btn-accent.btn-sm {
    display: inline-block !important;
  }
}

/* Дополнительные стили для лучшего отображения на очень маленьких экранах */
@media (max-width: 380px) {
  .language-mobile-popup-overlay {
    padding: 10px;
    padding-top: 5vh;
  }
  
  .language-mobile-popup {
    max-width: 98vw;
    max-height: 85vh;
  }
  
  .language-popup-header {
    padding: 12px;
  }
  
  .language-popup-header h3 {
    font-size: 16px;
  }
  
  .language-option-mobile {
    padding: 10px;
  }
  
  .language-name {
    font-size: 15px;
  }
  
  .language-native {
    font-size: 13px;
  }
}

/* Предотвращение скролла тела страницы когда открыт мобильный попап */
body.no-scroll {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
  height: 100% !important;
}

/* Улучшение скролла внутри попапа */
.language-mobile-popup::-webkit-scrollbar {
  width: 4px;
}

.language-mobile-popup::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.language-mobile-popup::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.language-mobile-popup::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>