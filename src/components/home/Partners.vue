<template>
  <section id="partners" class="partners-section py-5">
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
.container-mode {
  padding-left: 80px;
  padding-right: 80px;
}

.partners-text {
  font-size: 16px;
  line-height: 1.6;
  color: #666F8E;
  text-align: start;
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

/* Планшеты (768px - 992px) */
@media (min-width: 768px) and (max-width: 992px) {
  .container-mode {
    padding-left: 40px;
    padding-right: 40px;
  }

  .partners-text {
    font-size: 15px;
    text-align: center;
    margin-bottom: 30px !important;
  }

  .partners-grid {
    gap: 25px;
  }

  .partners-row {
    justify-content: center;
    gap: 25px;
    flex-wrap: wrap;
  }

  .small-logos img {
    max-height: 40px;
    flex: 0 0 calc(33.333% - 25px);
    margin-bottom: 15px;
  }

  .large-logos img {
    max-height: 50px;
    flex: 0 0 calc(50% - 25px);
    margin-bottom: 20px;
  }

  /* Специфичные настройки для строк */
  .partners-row.small-logos {
    justify-content: space-around;
  }

  .partners-row.large-logos {
    justify-content: center;
  }

  .partners-row.large-logos img {
    max-width: 45%;
    margin: 0 10px 20px 10px;
  }
}

/* Мобильная версия (до 768px) */
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
    flex: 0 0 calc(50% - 20px);
    margin-bottom: 15px;
  }

  .large-logos img {
    max-height: 40px;
    flex: 0 0 calc(50% - 20px);
    margin-bottom: 15px;
  }

  .container-mode {
    padding-left: 20px;
    padding-right: 20px;
  }

  .partners-text {
    text-align: center;
    font-size: 14px;
    margin-bottom: 25px !important;
  }
}

/* Очень маленькие экраны (< 576px) */
@media (max-width: 576px) {
  .small-logos img {
    max-height: 25px;
    flex: 0 0 calc(50% - 15px);
  }

  .large-logos img {
    max-height: 35px;
    flex: 0 0 calc(50% - 15px);
  }

  .partners-row {
    gap: 15px;
  }

  .container-mode {
    padding-left: 15px;
    padding-right: 15px;
  }
}

/* Большие планшеты в альбомной ориентации (992px - 1200px) */
@media (min-width: 992px) and (max-width: 1200px) {
  .small-logos img {
    max-height: 40px;
  }

  .large-logos img {
    max-height: 55px;
  }

  .container-mode {
    padding-left: 60px;
    padding-right: 60px;
  }
}
</style>