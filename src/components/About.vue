<template>
  <section class="about-section py-5">
    <div class="container-mode">
      <div class="row align-items-center">
        
        <div class="col-md-6 mb-4 mb-md-0">
          <h2 class="section-title mb-5">О компании</h2>
          <p>
            Turan Business Development – это синергия инноваций,
            опыта и креативности.
          </p>
          <p>
            Под руководством Жанар Бекбассовой наша команда
            создает проекты, которые задают тренды и меняют индустрию.
          </p>
          <p>
            Мы работаем на международном уровне, превращая каждое событие в
            незабываемую историю, а каждую PR-кампанию – в мощный голос вашего
            бренда на мировой арене.
          </p>

          <!-- Кнопки -->
          <div class="btn-group mt-3">
            <a href="#" class="btn-outline-accent">ПОСМОТРЕТЬ НАШИ КЕЙСЫ</a>
            <a href="tel:+77010000000" class="btn-icon">
              <img src="assets/svg/phone-call.svg" style="color: #1C2957;" alt="Позвонить" />
            </a>
          </div>
        </div>

        <!-- Видео -->
        <div class="col-md-6">
          <div class="ratio ratio-16x9 rounded-4 shadow-sm about-video">
            <iframe
              style="border-radius: 10px;"
              src="https://www.youtube.com/embed/hFqmLtHGaWw?start=471"
              title="О компании"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section p {
  margin-bottom: 20px;
  color: #666F8E;
  line-height: 1.6;
}

.section-title {
  font-family: "Gilroy", sans-serif;
  font-weight: 400;
  font-size: 32px;
  color: #1C2957;
}

.btn-group {
  display: flex;
  gap: 12px; /* расстояние между кнопками */
  flex-wrap: wrap;
}

.btn-outline-accent {
  display: inline-block;
  border: 1px solid #1C2957;
  color: #1C2957;
  padding: 12px 28px;
  border-radius: 50px;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-outline-accent:hover {
  background: #1C2957;
  color: #fff;
}

.btn-group {
  display: flex;
  gap: 12px; /* расстояние между кнопками */
  flex-wrap: wrap;
}

.btn-outline-accent {
  display: inline-block;
  border: 1px solid #1C2957;
  color: #1C2957;
  padding: 12px 28px;
  border-radius: 50px;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-outline-accent:hover {
  background: #1C2957;
  color: #fff;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 1px solid #1C2957;
  border-radius: 50%;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-icon img {
  width: 22px;
  height: 22px;
}

.btn-icon:hover {
  background: #1C2957;
}

.btn-icon:hover img {
  filter: brightness(0) invert(1); /* чтобы иконка стала белой на hover */
}


.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 1px solid #1C2957;
  border-radius: 50%;
  color: #1C2957;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-icon:hover {
  background: #1C2957;
  color: #fff;
}

/* 🔹 Отступ на мобильных */
@media (max-width: 768px) {
  .about-video {
    margin-top: 20px;
  }
}
</style>
