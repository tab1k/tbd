<template>
  <section class="hero d-flex align-items-center">
    <div
      class="container-mode d-flex flex-column flex-lg-row align-items-center justify-content-between position-relative"
    >
      <!-- Левая часть: текст -->
      <div class="hero-text text-center text-lg-start">
        <h1 class="mb-3">
          Поможем создать <span>правильные</span> тренды
          <span>для вашего бизнеса</span>
        </h1>
        <a href="#" class="btn-accent" @click.prevent="openPopup">
          ЗАКАЗАТЬ КОНСУЛЬТАЦИЮ
        </a>
      </div>

      <!-- Правая часть: картинка -->
      <div class="hero-image mt-4 mt-lg-0">
        <img src="assets/img/hero_right.png" alt="Hero" />
      </div>
    </div>

    <!-- 🔽 стрелка вниз (только на мобилке) -->
    <div class="scroll-down d-lg-none">
      <span style="color: white; font-size: 20px;">↓</span>
    </div>

    <PopupContact :isOpen="showPopup" @close="closePopup" />
  </section>
</template>

<script>
import { ref } from "vue";
import PopupContact from "@/components/home/PopupContact.vue";

export default {
  name: "Hero",
  components: { PopupContact },
  setup() {
    const showPopup = ref(false);

    const openPopup = () => {
      showPopup.value = true;
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    return { showPopup, openPopup, closePopup };
  },
};
</script>

<style scoped>
.hero {
  min-height: 80vh;
  background: #ebecf0;
  position: relative;
  overflow: hidden;
}

/* Контейнер */
.container-mode {
  width: 100%;
  padding-left: 80px;
  padding-right: 80px;
}

@media (max-width: 768px) {
  .container-mode {
    padding-left: 30px;
    padding-right: 30px;
  }
}

/* Кнопка */
.btn-accent {
  background: #000f42;
  color: #fff;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 400;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  display: inline-block;
}

.btn-accent:hover {
  background: #001a6d;
}

/* Hero — десктоп */
@media (min-width: 992px) {
  .hero-text h1 {
    font-size: 50px;
    font-weight: 700;
    line-height: 1.3;
    color: #000f42;
  }

  .hero-text h1 span {
    color: #757d99;
    font-weight: 700;
  }
}

/* Hero — планшет и мобилка */
@media (max-width: 992px) {
  .hero {
    background: linear-gradient(180deg, #ebecf0 0%, #f5f6fa 100%);
  }

  .hero-text h1 {
    font-size: 2.4rem;
    font-weight: 700;
    color: #000f42;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    line-height: 1.35;
  }

  .hero-text h1 span {
    color: #757d99; /* ✅ сохранил разницу в цвете */
  }

  .btn-accent {
    background: #000f42;
    box-shadow: 0 4px 12px rgba(0, 15, 66, 0.3);
  }

  .btn-accent:hover {
    background: #001a6d;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 15, 66, 0.35);
  }

  .hero-image {
    opacity: 0.1;
  }
}

/* Hero — маленькие экраны */
@media (max-width: 576px) {
  .hero {
    padding: 40px 16px;
  }

  .hero-text h1 {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
  }

  .btn-accent {
    padding: 12px 24px;
    font-size: 0.9rem;
  }

  .hero-image {
    top: 0;
    right: -60px;
    opacity: 0.12;
  }

  .hero-image img {
    max-width: 400px;
  }
}

/* Стрелка вниз — одна версия */
.scroll-down {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #000f42;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
  animation: bounce 1.5s infinite, glow 2s infinite alternate;
  cursor: pointer;
  z-index: 5;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translate(-50%, 0);
  }
  40% {
    transform: translate(-50%, 8px);
  }
  60% {
    transform: translate(-50%, 4px);
  }
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(0, 15, 66, 0.4);
  }
  100% {
    box-shadow: 0 0 15px rgba(0, 15, 66, 0.8);
  }
}

</style>
