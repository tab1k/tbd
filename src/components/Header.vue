<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light">
      <!-- Лого -->
      <a class="navbar-brand fw-bold" href="/">
        <img src="/logo.png" style="height: 45px;" alt="logo" />
      </a>

      <!-- Контейнер для кнопки и бургера (планшеты) -->
      <div class="d-flex align-items-center d-lg-none">
        <!-- Кнопка для планшетов -->
        <a href="#" @click.prevent="openPopup" class="btn-accent btn-sm me-2">ЗАКАЗАТЬ КОНСУЛЬТАЦИЮ</a>
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
          <li class="nav-item"><a href="#about" class="nav-link">О компании</a></li>
          <li class="nav-item"><a href="#team" class="nav-link">Команда</a></li>
          <li class="nav-item"><a href="#partners" class="nav-link">Партнёры и клиенты</a></li>
          <li class="nav-item"><a href="#services" class="nav-link">Услуги</a></li>
          <li class="nav-item"><a href="#contacts" class="nav-link">Контакты</a></li>
        </ul>
      </div>

      <!-- Dropdown с языками -->
      <div class="dropdown d-none d-lg-block language-dropdown">
        <button class="btn dropdown-toggle" style="color: #576182;" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          {{ currentLanguage }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="languageDropdown">
          <li><a class="dropdown-item" href="#" @click.prevent="setLanguage('RU')">Русский</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="setLanguage('KZ')">Қазақша</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="setLanguage('EN')">English</a></li>
        </ul>
      </div>

      <!-- Кнопка справа (десктоп) -->
      <div class="d-none d-lg-block">
        <a href="#" @click.prevent="openPopup" class="btn-accent">ЗАКАЗАТЬ КОНСУЛЬТАЦИЮ</a>
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
      showPopup: false
    }
  },
  methods: {
    setLanguage(lang) {
      this.currentLanguage = lang;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    openPopup() {
      this.showPopup = true;
    }
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
}
.btn-accent:hover {
  background: #001a6d;
}

/* 🔹 маленькая кнопка для планшетов */
.btn-accent.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  white-space: nowrap;
}

/* 🔹 языковой dropdown */
.language-dropdown .btn {
  background: transparent;
  border: none;
  color: #576182;
  font-weight: 400;
  font-size: 16px;
  text-decoration: none;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-dropdown .btn:hover {
  color: #000f42;
  text-decoration: none;
}

.language-dropdown .btn:focus {
  box-shadow: none;
  text-decoration: none;
}

.language-dropdown .btn::after {
  display: none;
}

.navbar-toggler {
  border: none;
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

  /* Кнопка в выпадающем меню для мобильных */
  .collapse .btn-accent {
    display: inline-block;
    margin: 16px auto;
    padding: 10px 24px;
    font-size: 15px;
  }

  li.nav-item {
    text-align: justify;
  }

  .collapse .navbar-nav::after {
    content: '';
    display: block;
    margin: 10px 0;
  }

  header .navbar {
    padding: 16px 24px;
  }
}

/* Скрываем кнопку планшетов на очень маленьких экранах */
@media (max-width: 576px) {
  .btn-accent.btn-sm {
    display: none !important;
  }
  
  /* Показываем кнопку в меню на мобильных */
  .collapse .btn-accent {
    display: inline-block !important;
  }
}

/* Показываем кнопку планшетов только на планшетах */
@media (min-width: 577px) and (max-width: 992px) {
  .btn-accent.btn-sm {
    display: inline-block !important;
  }
  
  /* Скрываем кнопку в меню на планшетах */
  .collapse .btn-accent {
    display: none !important;
  }
}
</style>