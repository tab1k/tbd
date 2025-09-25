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
          {{ currentLanguage }}
        </button>
        
        <!-- Кнопка для планшетов -->
        <a href="#" @click.prevent="openPopup" class="btn-accent btn-sm me-2 d-none d-sm-inline-block">ЗАКАЗАТЬ КОНСУЛЬТАЦИЮ</a>
        
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
          <li class="nav-item"><a href="#about" class="nav-link" @click="closeMenu">О компании</a></li>
          <li class="nav-item"><a href="#team" class="nav-link" @click="closeMenu">Команда</a></li>
          <li class="nav-item"><a href="#partners" class="nav-link" @click="closeMenu">Партнёры и клиенты</a></li>
          <li class="nav-item"><a href="#services" class="nav-link" @click="closeMenu">Услуги</a></li>
          <li class="nav-item"><a href="#contacts" class="nav-link" @click="closeMenu">Контакты</a></li>
        </ul>
        
        <!-- Кнопка в меню для мобильных -->
        <div class="d-lg-none text-center mt-3">
          <a href="#" @click.prevent="openPopup" class="btn-accent">ЗАКАЗАТЬ КОНСУЛЬТАЦИЮ</a>
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
            {{ currentLanguage }}
            <i class="bi bi-chevron-down"></i>
          </button>
          
          <!-- Попап выбора языка -->
          <div 
            v-if="isLanguagePopupOpen" 
            class="language-popup"
            ref="languagePopup"
          >
            <button 
              class="language-option"
              :class="{ active: currentLanguage === 'RU' }"
              @click="setLanguage('RU')"
            >
              <span class="language-flag">🇷🇺</span>
              Русский
            </button>
            <button 
              class="language-option"
              :class="{ active: currentLanguage === 'KZ' }"
              @click="setLanguage('KZ')"
            >
              <span class="language-flag">🇰🇿</span>
              Қазақша
            </button>
            <button 
              class="language-option"
              :class="{ active: currentLanguage === 'EN' }"
              @click="setLanguage('EN')"
            >
              <span class="language-flag">🇺🇸</span>
              English
            </button>
          </div>
        </div>

        <!-- Кнопка справа -->
        <a href="#" @click.prevent="openPopup" class="btn-accent">ЗАКАЗАТЬ КОНСУЛЬТАЦИЮ</a>
      </div>

      <!-- Мобильный попап языка -->
      <div 
        v-if="isLanguageMobilePopupOpen" 
        class="language-mobile-popup-overlay"
        @click="closeLanguagePopup"
      >
        <div class="language-mobile-popup" @click.stop>
          <div class="language-popup-header">
            <h3>Выберите язык</h3>
            <button class="close-btn" @click="closeLanguagePopup">×</button>
          </div>
          <div class="language-options-mobile">
            <button 
              class="language-option-mobile"
              :class="{ active: currentLanguage === 'RU' }"
              @click="setLanguage('RU')"
            >
              <span class="language-flag">🇷🇺</span>
              <div>
                <div class="language-name">Русский</div>
                <div class="language-native">Russian</div>
              </div>
            </button>
            <button 
              class="language-option-mobile"
              :class="{ active: currentLanguage === 'KZ' }"
              @click="setLanguage('KZ')"
            >
              <span class="language-flag">🇰🇿</span>
              <div>
                <div class="language-name">Қазақша</div>
                <div class="language-native">Kazakh</div>
              </div>
            </button>
            <button 
              class="language-option-mobile"
              :class="{ active: currentLanguage === 'EN' }"
              @click="setLanguage('EN')"
            >
              <span class="language-flag">🇺🇸</span>
              <div>
                <div class="language-name">English</div>
                <div class="language-native">Английский</div>
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

export default {
  components: { PopupContact },
  name: "Header",
  data() {
    return {
      currentLanguage: 'RU',
      isMenuOpen: false,
      showPopup: false,
      isLanguagePopupOpen: false,
      isLanguageMobilePopupOpen: false
    }
  },
  methods: {
    setLanguage(lang) {
      this.currentLanguage = lang;
      this.closeLanguagePopup();
      // Здесь можно добавить логику смены языка в приложении
      console.log('Язык изменен на:', lang);
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
      if (window.innerWidth < 992) {
        // Мобильная версия
        this.isLanguageMobilePopupOpen = !this.isLanguageMobilePopupOpen;
        this.isLanguagePopupOpen = false;
      } else {
        // Десктоп версия
        this.isLanguagePopupOpen = !this.isLanguagePopupOpen;
        this.isLanguageMobilePopupOpen = false;
      }
    },
    
    closeLanguagePopup() {
      this.isLanguagePopupOpen = false;
      this.isLanguageMobilePopupOpen = false;
    },
    
    // Закрытие попапа при клике вне его области
    handleClickOutside(event) {
      const languageBtn = this.$refs.languageBtn;
      const languagePopup = this.$refs.languagePopup;
      
      if (languageBtn && languagePopup && 
          !languageBtn.contains(event.target) && 
          !languagePopup.contains(event.target)) {
        this.closeLanguagePopup();
      }
    }
  },
  
  mounted() {
    // Добавляем обработчик клика по документу для закрытия попапа
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    // Убираем обработчик при уничтожении компонента
    document.removeEventListener('click', this.handleClickOutside);
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
}

.language-mobile-popup {
  background: white;
  border-radius: 16px;
  padding: 0;
  width: 100%;
  max-width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  /* Центрирование */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.language-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
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
}

.language-option-mobile:hover {
  background: #f8f9fa;
}

.language-option-mobile.active {
  background: #f0f2f5;
  font-weight: 500;
}

.language-option-mobile .language-flag {
  font-size: 24px;
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
    max-width: 90%;
    margin: 0;
  }
}

@media (max-width: 576px) {
  .btn-accent.btn-sm {
    display: none !important;
  }
  
  .language-mobile-popup {
    max-width: 95%;
    max-height: 85vh;
  }
}

@media (min-width: 577px) and (max-width: 992px) {
  .btn-accent.btn-sm {
    display: inline-block !important;
  }
}

/* Дополнительные стили для лучшего отображения на очень маленьких экранах */
@media (max-width: 380px) {
  .language-mobile-popup {
    max-width: 98%;
    max-height: 90vh;
  }
  
  .language-popup-header {
    padding: 15px;
  }
  
  .language-option-mobile {
    padding: 12px;
  }
}
</style>