<template>
  <section class="hero d-flex align-items-center">
    <div class="container-mode mb-5">
      <div class="hero-text text-lg-start">
        <h1>
          Создаём тренды. <br />
          Управляем смыслами
        </h1>
        <p>
          <b>Turan Business Development — коммуникационное агентство,</b>
          объединяющее опыт в стратегических коммуникациях, GR, PR и управлении
          репутацией. Мы создаём устойчивые смыслы, формируем доверие и
          выстраиваем диалог между бизнесом, государством и обществом.
        </p>
        <p>
          Мы представлены в <b>Казахстане, Узбекистане, Азербайджане и США</b>,
          работаем по всему региону
          <b>Центральной Азии, Кавказа, Ближнего Востока и Европы.</b>
        </p>
        <a href="#" class="btn-accent" @click.prevent="openPopup">
          ЗАКАЗАТЬ КОНСУЛЬТАЦИЮ
        </a>
      </div>
    </div>

    <!-- стрелка вниз -->
    <div class="scroll-down d-lg-none mb-1">
      <span>↓</span>
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
    const openPopup = () => (showPopup.value = true);
    const closePopup = () => (showPopup.value = false);
    return { showPopup, openPopup, closePopup };
  },
};
</script>

<style scoped>
.hero {
  min-height: 80vh;
  background: #ebecf0 url("@/assets/img/hero_right.png") no-repeat right bottom;
  background-size: auto 100%; /* Всегда на всю высоту */
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.hero-text {
  max-width: 800px;
}

.hero-text p {
  max-width: 740px;
}

/* Контейнер */
.container-mode {
  width: 100%;
  padding-left: 80px;
  padding-right: 80px;
}

/* Заголовок */
.hero-text h1 {
  font-size: 72px;
  font-weight: 700;
  line-height: 1.2;
  color: #000f42;
  margin-bottom: 20px;
}

/* Тексты */
.hero-text p {
  font-size: 14px;
  color: #576182;
  line-height: 1.5;
  margin-bottom: 16px;
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
  display: inline-block;
}

.btn-accent:hover {
  background: #001a6d;
}

/* Стрелка вниз */
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
  font-size: 20px;
  animation: bounce 1.5s infinite, glow 2s infinite alternate;
  cursor: pointer;
  z-index: 5;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
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

/* Большие десктопы (1200px+) */
@media (min-width: 1200px) {
  .hero {
    background-position: right bottom;
    background-size: auto 100%;
  }
}

/* Средние десктопы (992px - 1200px) */
@media (max-width: 1200px) {
  .hero {
    background-position: 50% bottom;
    background-size: auto 100%;
  }
  
  .hero-text h1 {
    font-size: 60px;
  }
  
  .container-mode {
    padding-left: 60px;
    padding-right: 60px;
  }
}

/* Планшеты (768px - 992px) */
@media (max-width: 992px) {
  .hero {
    background-position: -130% bottom;
    background-size: auto 100%;
  }
  
  .hero-text h1 {
    font-size: 48px;
  }
  
  .hero-text p {
    font-size: 13px;
  }
  
  .container-mode {
    padding-left: 40px;
    padding-right: 40px;
  }
}

/* Большие мобилки (576px - 768px) */
@media (max-width: 768px) {
  .hero {
    background-position: 235% bottom;
    background-size: auto 100%;
    min-height: 60vh;
  }
  
  .hero-text h1 {
    font-size: 36px;
  }
  
  .hero-text p {
    font-size: 14px;
  }
  
  .container-mode {
    padding-left: 30px;
    padding-right: 30px;
  }
}

/* Мобилки (480px - 576px) */
@media (max-width: 576px) {
  .hero {
    background-position: -150% bottom;
    background-size: auto 100%;
    padding: 30px 60px 50px 16px;
  }
  
  .hero-text h1 {
    font-size: 32px;
  }
  
  .hero-text p {
    font-size: 12px;
  }
  
  .container-mode {
    padding-left: 0px;
    padding-right: 0px;
  }
  
  .btn-accent {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
}

/* Очень маленькие экраны (< 480px) */
@media (max-width: 480px) {
  .hero {
    background-position: -350% bottom;
    background-size: auto 100%;
    min-height: 50vh;
  }
  
  .hero-text h1 {
    font-size: 28px;
  }
  
  .hero-text p {
    font-size: 11px;
  }
}


/* Очень маленькие экраны (< 480px) */
@media (max-width: 375px) {
  .hero {
    background-position: -110% bottom;
    background-size: auto 100%;
    min-height: 50vh;
  }
  
  .hero-text h1 {
    font-size: 28px;
  }
  
  .hero-text p {
    font-size: 11px;
  }
}

</style>