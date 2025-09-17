<template>
  <section class="partners-section py-5">
    <div class="container-mode">
      <div class="row">
        <!-- Левая колонка: заголовок -->
        <div class="col-12 col-md-4">
          <p class="partners-text mb-5">Наши партнёры и клиенты</p>
        </div>

        <!-- Правая колонка: логотипы -->
        <div class="col-12 col-md-8">
          <div class="partners-grid">
            <!-- Первая строка: 3 логотипа -->
            <div class="partners-row small-logos mb-5">
              <img src="assets/img/samruk.png" alt="Samruk" />
              <img src="assets/img/kmg.png" alt="KMG" />
              <img src="assets/img/aspen.png" alt="Aspentech" />
            </div>

            <!-- Вторая строка: 4 логотипа -->
            <div class="partners-row large-logos mb-5">
              <img src="assets/img/aix.png" alt="AIX" />
              <img src="assets/img/erg.png" alt="ERG" />
              <img src="assets/img/katko.png" alt="Katko" />
              <img src="assets/img/shell.png" alt="Shell" />
            </div>

            <!-- Третья строка: 3 логотипа -->
            <div class="partners-row small-logos mb-5">
              <img src="assets/img/qazaq.png" alt="Qazaq" />
              <img src="assets/img/mondelez.png" alt="Mondelez" />
              <img src="assets/img/km.png" alt="KM" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Partners",
};
</script>

<style scoped>
.partners-text {
  font-size: 16px;
  line-height: 1.6;
  color: #666F8E;
}

/* Контейнер для строк */
.partners-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Строки с логотипами */
.partners-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Общий стиль для логотипов */
.partners-row img {
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.8;
  transition: all 0.3s ease;
  max-width: 100%;
}

.partners-row img:hover {
  filter: grayscale(0%);
  opacity: 1;
}

/* Размеры логотипов */
.small-logos img {
  max-height: 45px;
}

.large-logos img {
  max-height: 60px;
}

/* Мобильная версия */
@media (max-width: 768px) {
  .partners-grid {
    gap: 15px;
  }

  .partners-row {
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .small-logos img {
    max-height: 30px;
  }

  .large-logos img {
    max-height: 50px;
  }
}
</style>
