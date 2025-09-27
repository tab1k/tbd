<template>
  <section id="partners" class="partners-section py-5">
    <div class="container-mode">
      <div class="row">
        <!-- Левая колонка: заголовок -->
        <div class="col-12 col-md-4">
          <p class="partners-text mb-5">{{ $t('navigation.partners') }}</p>
        </div>

        <!-- Правая колонка: логотипы -->
        <div class="col-12 col-md-8">
          <!-- Скелетон при загрузке -->
          <div v-if="loading" class="partners-skeleton">
            <div class="skeleton-logo" v-for="n in 6" :key="n"></div>
          </div>

          <div v-else-if="!error && logos.length > 0" class="partners-wrapper">
            <div class="partners-row">
              <img 
                v-for="logo in logos" 
                :key="logo.id" 
                :src="getImageUrl(logo.image)" 
                :alt="getLogoTitle(logo)" 
                loading="lazy"
                class="partner-logo"
              />
            </div>
          </div>

          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else class="error">Нет доступных логотипов</div>
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
      
      // Если путь уже содержит полный URL, возвращаем как есть
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      // Убираем начальный слэш если он есть
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      return `${MEDIA_API_URL}${cleanPath}`;
    },

    // Метод для получения заголовка логотипа на текущем языке
    getLogoTitle(logo) {
      const currentLanguage = this.$i18n.locale;
      
      // Пытаемся получить заголовок на текущем языке
      if (currentLanguage === 'en' && logo.title_en) {
        return logo.title_en;
      }
      
      // Возвращаем русский заголовок или заглушку
      return logo.title_ru || logo.title || `Partner Logo ${logo.id}`;
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

/* Обертка для бегущей строки */
.partners-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
}

/* Строка с логотипами */
.partners-row {
  display: flex;
  animation: moveLeft 30s linear infinite;
  gap: 40px;
  padding: 15px 0;
  width: max-content;
}

/* Стиль для каждого логотипа */
.partner-logo {
  object-fit: contain;
  transition: all 0.3s ease;
  max-width: none;
  width: auto;
  height: 50px;
  flex-shrink: 0;
  opacity: 0.7;
  filter: grayscale(30%);
}

.partner-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.05);
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

/* Адаптивная верстка */
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
    gap: 30px;
  }

  .partner-logo {
    height: 40px;
  }
  
  .partners-row {
    animation-duration: 25s;
  }
}

/* Мобильная версия (до 768px) */
@media (max-width: 768px) {
  .container-mode {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .partners-text {
    text-align: center;
    margin-bottom: 20px !important;
    font-size: 14px;
  }

  .partners-row {
    gap: 25px;
  }

  .partner-logo {
    height: 35px;
  }
  
  .partners-row {
    animation-duration: 20s;
  }
}

/* Для мобильных устройств (до 576px) */
@media (max-width: 576px) {
  .partners-row {
    gap: 20px;
  }

  .partner-logo {
    height: 30px;
  }
  
  .partners-row {
    animation-duration: 15s;
  }
}

/* Очень маленькие экраны */
@media (max-width: 400px) {
  .partners-row {
    gap: 15px;
  }

  .partner-logo {
    height: 25px;
  }
  
  .partners-row {
    animation-duration: 12s;
  }
}

/* Стили для скелетона */
.partners-skeleton {
  display: flex;
  gap: 30px;
  justify-content: center;
  overflow: hidden;
}

.skeleton-logo {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  width: 120px;
  height: 50px;
  border-radius: 8px;
  flex-shrink: 0;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.error {
  text-align: center;
  font-size: 16px;
  color: #666;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* Пауза анимации при наведении */
.partners-wrapper:hover .partners-row {
  animation-play-state: paused;
}

/* Улучшенная доступность */
@media (prefers-reduced-motion: reduce) {
  .partners-row {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    gap: 20px;
  }
}

/* Для очень большого количества логотипов */
@media (min-width: 1200px) {
  .partners-row {
    animation-duration: 40s;
  }
}
</style>