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
            <div class="skeleton-logo" v-for="n in 6" :key="n"></div>
          </div>

          <div v-if="!loading && !error">
            <div class="partners-grid">
              <div class="partners-row">
                <img 
                  v-for="logo in logos" 
                  :key="logo.id" 
                  :src="getImageUrl(logo.image)" 
                  :alt="logo.title || 'partner logo'" 
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div v-else-if="error" class="error">{{ error }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config.js';

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
        this.error = null;
        
        console.log('Загружаем логотипы из:', `${API_URL}/logo/`);
        const response = await axios.get(`${API_URL}/logo/`);
        console.log('Полученные логотипы:', response.data);
        
        this.logos = response.data || [];
        
      } catch (error) {
        console.error('Ошибка при загрузке логотипов:', error);
        this.error = 'Не удалось загрузить логотипы';
        this.logos = [];
      } finally {
        this.loading = false;
      }
    },

    // Метод для генерации полного URL для изображения
    getImageUrl(imagePath) {
      if (!imagePath) return '/assets/img/placeholder.jpg';
      return `${MEDIA_API_URL}${imagePath}`;
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
  overflow: hidden;
  justify-content: center;
}

/* Строка с логотипами */
.partners-row {
  display: flex;
  white-space: nowrap;
  animation: moveLeft 15s linear infinite;
  gap: 30px;
}

/* Анимация движения логотипов влево */
@keyframes moveLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Общий стиль для логотипов */
.partners-row img {
  object-fit: contain;
  transition: all 0.3s ease;
  max-width: 100%;
  max-height: 45px;
}

.partners-row img:hover {
  filter: grayscale(0%);
  opacity: 1;
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

  .partners-row {
    gap: 25px;
  }

  .partners-row img {
    max-height: 40px;
  }
}

/* Мобильная версия (до 768px) */
@media (max-width: 768px) {
  .partners-row {
    gap: 20px;
  }

  .partners-row img {
    max-height: 30px;
  }
}

/* Для мобильных устройств (до 576px) */
@media (max-width: 576px) {
  .partners-row {
    gap: 15px;
  }

  .container-mode {
    padding-left: 20px;
    padding-right: 20px;
  }

  .partners-row img {
    max-height: 25px;
  }
}

/* Стили для скелетона */
.partners-skeleton {
  display: flex;
  flex-wrap: nowrap;
  gap: 30px;
  justify-content: center;
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

.error {
  text-align: center;
  font-size: 18px;
  color: red;
}
</style>