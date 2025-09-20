<template>
  <section id="about" class="about-section py-5">
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
          <div class="ratio ratio-16x9 rounded-2 shadow-sm about-video">
            <video :src="videoUrl" controls preload="auto" style="width: 100%; height: auto; border-radius: 5px;">
              Ваш браузер не поддерживает видео.
            </video>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config';
console.log(API_URL, MEDIA_API_URL); 

export default {
  data() {
    return {
      videoUrl: '',  // Здесь будет храниться путь к видео
    };
  },
  async created() {
    try {
      const response = await axios.get(API_URL);
      console.log('Response Data:', response.data);  // Проверка всех данных
      if (response.data.videos.length > 0) {
        this.videoUrl = MEDIA_API_URL + response.data.videos[0].video;
        console.log('Video URL:', this.videoUrl);  // Проверка правильности URL
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  }
};
</script>

<style scoped>
.about-section p {
  margin-bottom: 20px;
  color: #666F8E;
  line-height: 1.6;
}

/* Стиль для контейнера */
.container-mode {
  padding-left: 80px;
  padding-right: 80px;
}

@media (max-width: 768px) {
  .container-mode {
    padding-left: 30px;
    padding-right: 30px;
  }
}

/* Заголовок секции */
.section-title {
  font-family: "Gilroy", sans-serif;
  font-weight: 400;
  font-size: 32px;
  color: #1C2957;
}

/* Стили для кнопок */
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

/* Иконка телефона */
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

/* 🔹 Отступы на мобильных */
@media (max-width: 768px) {
  .about-video {
    margin-top: 20px;
  }

  .container-mode {
    padding-left: 16px;
    padding-right: 16px;
  }

  /* Настроим отступы для текста */
  .section-title {
    font-size: 1.8rem;
  }

  .about-section p {
    font-size: 1rem;
  }
}
</style>
