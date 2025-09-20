<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light">
      <!-- Лого -->
      <a class="navbar-brand fw-bold" href="/">
        <img src="/logo.png" style="height: 45px;" alt="logo" />
      </a>

      <!-- Бургер -->
      <button
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

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

      <!-- Кнопка справа -->
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
      isMenuOpen: false, // Состояние для открытия/закрытия меню
      showPopup: false   // 👈 состояние для попапа
    }
  },
  methods: {
    setLanguage(lang) {
      this.currentLanguage = lang;
      // Здесь можно добавить логику для смены языка приложения
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    openPopup() {         // 👈 метод для открытия попапа
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
}
.btn-accent:hover {
  background: #001a6d;
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

.language-dropdown .fa-angle-down {
  font-size: 14px;
  transition: transform 0.3s ease;
}

.language-dropdown .btn[aria-expanded="true"] .fa-angle-down {
  transform: rotate(180deg);
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

  .btn-accent {
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
</style>
