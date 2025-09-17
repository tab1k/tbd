<template>
  <section class="hero d-flex align-items-center">
    <div class="container-mode d-flex flex-column flex-lg-row align-items-center justify-content-between position-relative">
      <!-- Левая часть: текст -->
      <div class="hero-text text-center text-lg-start">
        <h1 class="mb-3">
          Поможем создать <span>правильные</span> тренды <span>для вашего бизнеса</span>
        </h1>
        <a href="#" class="btn-accent">ЗАКАЗАТЬ КОНСУЛЬТАЦИЮ</a>
      </div>

      <!-- Правая часть: картинка -->
      <div class="hero-image mt-4 mt-lg-0">
        <img src="assets/img/hero_right.png" alt="Hero" />
      </div>
    </div>

    <!-- 🔽 стрелка вниз (только на мобилке) -->
    <div class="scroll-down d-lg-none">
      <span>↓</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 80vh;
  background: #EBECF0;
  position: relative;
  overflow: hidden;
}

/* Контейнер растягиваем по высоте секции, чтобы колонки могли занимать 100% высоты */
.hero .container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* На десктопе — ставим row и растягиваем колонки по высоте */
@media (min-width: 992px) {
  .hero .container {
    flex-direction: row;
    align-items: stretch; /* ключ: колонки растягиваются по высоте hero */
  }
}

.hero-text .btn-accent {
  margin-top: 40px;
  display: inline-block;
}

/* Десктоп: пропорции и поведение */
@media (min-width: 992px) {
  .hero-text {
    flex: 0 0 60%;
    max-width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;   /* вертикальное центрирование текста */
    align-items: flex-start;   /* важно — чтобы дети не растягивались на всю ширину */
    padding-right: 30px;
    z-index: 2;
  }

  /* Гарантируем, что кнопка не растягивается (резервный вариант) */
  .hero-text .btn-accent {
    align-self: flex-start;
    width: auto;
  }

  .hero-image {
    flex: 0 0 40%;
    max-width: 40%;
    display: flex;
    align-items: stretch;    /* img сможет занять 100% по высоте */
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  /* img будет занимать всю высоту колонки (высота = высота hero) */
  .hero-image img {
    height: 100%;
    width: auto;
    object-fit: cover; /* заполняет по высоте, возможно частичное обрезание по ширине */
    display: block;
  }

  .hero-text h1 {
    font-size: 50px;
    font-weight: 700;
    line-height: 1.3;
    color: #000F42;
    position: relative;
    z-index: 2;
    width: 100%;
  }

  .hero-text h1 span {
    color: #757D99;
    font-weight: 700;
  }

  .btn-accent {
    background: #000F42;
    color: #fff;
    padding: 14px 32px;
    border-radius: 50px;
    font-weight: 400;
    font-size: 16px;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
  }
  .btn-accent:hover {
    background: #001a6d;
  }
}

/* Мобильная и планшетная логика — оставляем прежнюю (картинка абсолютная и полупрозрачная) */
@media (max-width: 992px) {
  .hero {
    padding: 60px 20px;
    text-align: center;
  }

  .hero-text h1 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
  }

  .hero-image {
    position: absolute;
    right: -40px;
    top: 20px;
    opacity: 0.15;
    z-index: 0;
    flex: 0 0 auto;
    max-width: none;
    align-items: center;
  }

  .hero-image img {
    max-width: 500px;
    width: auto;
    height: auto;
    object-fit: contain;
  }
}

/* 🔹 телефоны */
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
    flex: 0 0 auto;
    max-width: none;
  }

  .hero-image img {
    max-width: 400px;
  }
}

/* стрелка вниз */
.scroll-down {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  color: #000F42;
  animation: bounce 1.5s infinite;
  cursor: pointer;
  z-index: 5;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translate(-50%, 0); }
  40% { transform: translate(-50%, 8px); }
  60% { transform: translate(-50%, 4px); }
}
</style>
