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
          <!-- Скелетон при загрузке -->
          <div v-if="loading" class="partners-skeleton">
            <div class="skeleton-logo" v-for="n in 5" :key="n"></div> <!-- 5 скелетонов -->
          </div>

          <div v-if="!loading && !error">
            <div class="partners-grid">
              <div class="partners-row">
                <img v-for="logo in logos" :key="logo.id" :src="getImageUrl(logo)" :alt="logo.title" />
              </div>
            </div>
          </div>

          <div v-else-if="loading" class="loading">Загрузка...</div>
          <div v-else class="error">{{ error }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config.js'; // Измените на правильный путь к конфигу

export default {
  name: "Partners",
  data() {
    return {
      logos: [],
      loading: true,
      error: null
    };
  },
  async created() {
    await this.fetchLogosData();
  },
  methods: {
    async fetchLogosData() {
      try {
        this.loading = true;
        const response = await axios.get(API_URL); // Ваш URL API
        this.logos = response.data.logo || [];
      } catch (error) {
        console.error('Ошибка при загрузке логотипов:', error);
        this.error = 'Не удалось загрузить логотипы';
        this.logos = [];
      } finally {
        this.loading = false;
      }
    },

    // Метод для генерации полного URL для изображения
    getImageUrl(logo) {
      const imagePath = logo.image;
      if (!imagePath) return '/assets/img/placeholder.jpg'; // Если изображения нет, используем заглушку
      return `${MEDIA_API_URL}${imagePath}`; // Составляем полный путь к изображению
    }
  }
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
  overflow: hidden; /* скрываем элементы, выходящие за пределы контейнера */
  justify-content: center;
}

/* Строка с логотипами */
.partners-row {
  display: flex;
  white-space: nowrap; /* все логотипы на одной строке */
  animation: moveLeft 15s linear infinite; /* движение влево */
  gap: 30px; /* расстояние между логотипами */
}

/* Анимация движения логотипов влево */
@keyframes moveLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%); /* двигаем на половину ширины контейнера */
  }
}

/* Общий стиль для логотипов */
.partners-row img {
  object-fit: contain;

  transition: all 0.3s ease;
  max-width: 100%;
  margin-right: 30px;
}

.partners-row img:hover {
  filter: grayscale(0%);
  opacity: 1;
}

/* Размеры логотипов */
.partners-row img {
  max-height: 45px;
}

@media (min-width: 768px) {
    .col-md-4 {
        flex: 0 0 auto;
        width: 15%;
    }
    .col-md-8 {
        flex: 0 0 auto;
        width: 85%;
    }
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

  .partners-row img {
    max-height: 40px;
    flex: 0 0 calc(33.333% - 25px);
    margin-bottom: 15px;
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
    display: flex;
  }

  .partners-row img {
    max-height: 30px;
    flex: 0 0 calc(50% - 20px);
    margin-bottom: 15px;
  }
}

/* Для мобильных устройств (до 576px) */
@media (max-width: 576px) {
  .partners-row {
    gap: 15px;
    justify-content: flex-start; /* выравнивание логотипов в одну линию */
    flex-wrap: nowrap; /* логотипы остаются в одном ряду */
    display: flex;
  }

  .container-mode {
    padding-left: 20px;
    padding-right: 20px;
  }

  .partners-row img {
    max-height: 25px;
    flex: 0 0 auto;
  }
}

/* Стили для скелетона */
.partners-skeleton {
  display: flex;
  flex-wrap: nowrap;
  gap: 30px;
}

.skeleton-logo {
  background-color: #ccc;
  width: 100px;
  height: 45px;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite ease-in-out;
}

@keyframes skeleton-loading {
  0% {
    background-color: #ccc;
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #ccc;
  }
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #666F8E;
}

.error {
  text-align: center;
  font-size: 18px;
  color: red;
}
</style>
