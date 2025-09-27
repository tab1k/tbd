<template>
  <section class="hero d-flex align-items-center">
    <div class="container-mode">
      <!-- Левая текстовая часть -->
      <div class="hero-text text-lg-start">
        <h1>
          {{ $t('hero.tagline1') }} <br />
          {{ $t('hero.tagline2') }}
        </h1>
        <p>
          {{ $t('hero.description') }}
        </p>
        <p>
          {{ $t('hero.regions') }}
        </p>
        <a href="#" class="btn-accent" @click.prevent="openPopup">
          {{ $t('navigation.consultation') }}
        </a>
      </div>

      <!-- ПРАВАЯ ЧАСТЬ -->
      <div class="hero-right">
        <!-- ВАЖНО: общий relative-контейнер для картинки и оверлеев -->
        <div 
          class="media-wrap"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <!-- Skeleton loader -->
          <div v-if="isLoading" class="loading-placeholder">
            <div class="skeleton-image"></div>
            <div class="loading-text">{{ $t('news.loading') }}</div>
          </div>
          
          <!-- Ошибка загрузки -->
          <div v-else-if="error" class="error-placeholder">
            <div class="error-message">{{ error }}</div>
            <button @click="loadNewsData" class="retry-btn">{{ $t('news.retry') }}</button>
          </div>
          
          <!-- Слайдер с новостями -->
          <div
            v-else
            v-for="(slide, index) in slides"
            :key="slide.id || index"
            class="slide"
            :class="{ active: currentSlide === index }"
          >
            <!-- Кликабельная обертка для всего слайда -->
            <a 
              v-if="slide.url && slide.url !== '#'" 
              :href="slide.url" 
              target="_blank" 
              class="slide-link"
              @click.stop
            >
              <img 
                :src="slide.image" 
                class="hero-photo" 
                :alt="slide.title || 'news image'" 
                @error="handleImageError"
                loading="lazy"
              />

              <!-- Overlay с заголовком новости -->
              <div class="news-overlay">
                <h3 class="news-title">{{ slide.title }}</h3>
                <p v-if="slide.description" class="news-description">{{ slide.description }}</p>
                <span v-if="slide.created_at" class="news-date">
                  {{ formatDate(slide.created_at) }}
                </span>
              </div>
            </a>

            <!-- Не кликабельная версия (если нет URL) -->
            <div v-else>
              <img 
                :src="slide.image" 
                class="hero-photo" 
                :alt="slide.title || 'news image'" 
                @error="handleImageError"
                loading="lazy"
              />

              <!-- Overlay с заголовком новости -->
              <div class="news-overlay">
                <h3 class="news-title">{{ slide.title }}</h3>
                <p v-if="slide.description" class="news-description">{{ slide.description }}</p>
                <span v-if="slide.created_at" class="news-date">
                  {{ formatDate(slide.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Точки навигации -->
        <div v-if="!isLoading && !error && slides.length > 0" class="dots">
          <span
            v-for="(slide, index) in slides"
            :key="slide.id || index"
            :class="{ active: currentSlide === index }"
            class="dot"
            @click="goToSlide(index)"
          ></span>
        </div>

        <!-- Стрелки навигации -->
        <div v-if="!isLoading && !error && slides.length > 1" class="nav-arrows">
          <button 
            class="nav-arrow nav-prev" 
            @click="prevSlide"
            :aria-label="$t('news.previous_slide')"
          >
            ‹
          </button>
          <button 
            class="nav-arrow nav-next" 
            @click="nextSlide"
            :aria-label="$t('news.next_slide')"
          >
            ›
          </button>
        </div>
      </div>
      <!-- /ПРАВАЯ ЧАСТЬ -->
    </div>

    <!-- стрелка вниз -->
    <div class="scroll-down d-lg-none mb-1">
      <span>↓</span>
    </div>

    <PopupContact :isOpen="showPopup" @close="closePopup" />
  </section>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref, onMounted, onUnmounted, computed } from "vue";
import PopupContact from "@/components/home/PopupContact.vue";
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config.js';

// Импортируем изображения как fallback
import img01 from '@/assets/img/01.jpg';

export default {
  name: "Hero",
  components: { PopupContact },
  setup() {
    const { t, locale } = useI18n();
    const showPopup = ref(false);
    const openPopup = () => (showPopup.value = true);
    const closePopup = () => (showPopup.value = false);

    const avatars = ref([
      "https://i.pravatar.cc/80?img=1",
      "https://i.pravatar.cc/80?img=2",
      "https://i.pravatar.cc/80?img=3",
      "https://i.pravatar.cc/80?img=4",
    ]);
    const metricLabel = ref("Total visitors per month");
    const rating = ref(4.8);
    const ratingOutOf = ref(5.0);

    const slides = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    const currentLanguage = ref(localStorage.getItem('preferred-language') || locale.value);
    
    // Fallback данные на случай ошибки загрузки
    const fallbackSlides = computed(() => [
      {
        image: img01,
        title: t('news.fallback_title1'),
        description: t('news.fallback_description1'),
        url: "#",
        testimonial: {
          name: t('news.fallback_reader1'),
          text: t('news.fallback_reaction1'),
          avatar: "https://i.pravatar.cc/100?img=8",
        },
      },
      {
        image: img01,
        title: t('news.fallback_title2'), 
        description: t('news.fallback_description2'),
        url: "#",
        testimonial: {
          name: t('news.fallback_reader2'),
          text: t('news.fallback_reaction2'),
          avatar: "https://i.pravatar.cc/100?img=9",
        },
      },
      {
        image: img01,
        title: t('news.fallback_title3'),
        description: t('news.fallback_description3'),
        url: "#",
        testimonial: {
          name: t('news.fallback_reader3'),
          text: t('news.fallback_reaction3'),
          avatar: "https://i.pravatar.cc/100?img=10",
        },
      },
    ]);
    
    const currentSlide = ref(0);
    let autoSlideInterval = null;

    // Обработчик события смены языка
    const handleLanguageUpdate = (event) => {
      const newLanguage = event.detail.language;
      if (newLanguage !== currentLanguage.value) {
        currentLanguage.value = newLanguage;
        reloadNewsData();
      }
    };

    // Загрузка данных из API
    const loadNewsData = async () => {
      try {
        isLoading.value = true;
        error.value = null;

        console.log('Загружаем данные из:', `${API_URL}/news`);
        console.log('Язык запроса:', currentLanguage.value);
        
        const response = await axios.get(`${API_URL}/news`, {
          params: {
            lang: currentLanguage.value
          }
        });

        console.log('Полученные данные:', response.data);

        // Обрабатываем разные форматы ответа
        let newsData = [];
        if (response.data && Array.isArray(response.data)) {
          newsData = response.data;
        } else if (response.data && response.data.results) {
          newsData = response.data.results;
        } else if (response.data && response.data.news) {
          newsData = response.data.news;
        }

        if (newsData && newsData.length > 0) {
          console.log('Найдено новостей:', newsData.length);

          // Преобразуем новости в формат слайдов
          slides.value = newsData.map((newsItem, index) => {
            const imageUrl = newsItem.image ? 
              (newsItem.image.startsWith('http') ? newsItem.image : `${MEDIA_API_URL}${newsItem.image}`) 
              : img01;
            
            console.log(`Новость ${index + 1}: ${newsItem.title}, URL: ${newsItem.url}`);

            return {
              id: newsItem.id,
              image: imageUrl,
              title: newsItem.title,
              description: newsItem.description,
              url: newsItem.url,
              created_at: newsItem.created_at,
              testimonial: {
                name: t('news.reader', { number: index + 1 }),
                text: t('news.reaction'),
                avatar: `https://i.pravatar.cc/100?img=${index + 8}`,
              },
            };
          });
        } else {
          console.log('Новости не найдены, используем fallback');
          slides.value = fallbackSlides.value;
        }
      } catch (err) {
        console.error('Ошибка загрузки новостей:', err);
        console.error('Детали ошибки:', err.response?.data || err.message);
        error.value = t('news.load_error');
        slides.value = fallbackSlides.value;
      } finally {
        isLoading.value = false;
      }
    };

    const reloadNewsData = () => {
      console.log('Reloading news data for language:', currentLanguage.value);
      loadNewsData();
    };

    // Обработка ошибок изображений
    const handleImageError = (event) => {
      console.error('Не удалось загрузить изображение:', event.target.src);
      event.target.src = img01;
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString(currentLanguage.value === 'en' ? 'en-US' : 'ru-RU');
      } catch (e) {
        return '';
      }
    };

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % slides.value.length;
    };

    const prevSlide = () => {
      currentSlide.value = currentSlide.value === 0 
        ? slides.value.length - 1 
        : currentSlide.value - 1;
    };

    const goToSlide = (index) => {
      currentSlide.value = index;
      restartAutoSlide();
    };

    const startAutoSlide = () => {
      if (slides.value.length > 1) {
        autoSlideInterval = setInterval(() => {
          nextSlide();
        }, 4000);
      }
    };

    const stopAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    };

    const restartAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    const handleKeydown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        restartAutoSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        restartAutoSlide();
      }
    };

    // Touch events для свайпа
    const touchStart = ref({ x: 0, y: 0 });
    const touchEnd = ref({ x: 0, y: 0 });
    const minSwipeDistance = 50;

    const handleTouchStart = (e) => {
      touchStart.value = {
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY
      };
    };

    const handleTouchEnd = (e) => {
      touchEnd.value = {
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY
      };
      handleSwipe();
    };

    const handleSwipe = () => {
      const distanceX = touchStart.value.x - touchEnd.value.x;
      const distanceY = touchStart.value.y - touchEnd.value.y;
      
      if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        restartAutoSlide();
      }
    };

    onMounted(() => {
      // Слушаем событие смены языка
      window.addEventListener('language-updated', handleLanguageUpdate);
      
      loadNewsData();
      document.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
      window.removeEventListener('language-updated', handleLanguageUpdate);
      stopAutoSlide();
      document.removeEventListener('keydown', handleKeydown);
    });

    return { 
      showPopup, 
      openPopup, 
      closePopup, 
      avatars, 
      metricLabel, 
      rating, 
      ratingOutOf, 
      slides, 
      currentSlide, 
      goToSlide,
      handleImageError,
      handleTouchStart,
      handleTouchEnd,
      nextSlide,
      prevSlide,
      isLoading,
      error,
      loadNewsData,
      formatDate
    };
  },
};
</script>



<style scoped>
/* Состояния загрузки и ошибки */
.loading-placeholder, .error-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #f8f9fa;
  border-radius: 24px;
  text-align: center;
  padding: 40px 20px;
}

.skeleton-image {
  width: 100%;
  height: 300px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 16px;
  margin-bottom: 20px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.loading-text {
  color: #666;
  font-size: 16px;
  font-weight: 500;
}

.error-message {
  color: #dc3545;
  font-size: 16px;
  margin-bottom: 15px;
}

.retry-btn {
  background: #000f42;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #001a6d;
}

/* Overlay для заголовков новостей */
.news-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 40px 20px 20px;
  border-radius: 0 0 24px 24px;
}

.news-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.news-description {
  font-size: 14px;
  margin: 0 0 8px 0;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* Ограничение до 4 строк */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: calc(1.4em * 4); /* line-height * количество строк */
  
  /* Для современных браузеров */
  display: -moz-box;
  -moz-box-orient: vertical;
  -moz-line-clamp: 4;
}

.news-date {
  font-size: 12px;
  opacity: 0.7;
  font-weight: 500;
}

/* активный слайд */
.slide {
  display: none;
  position: relative;
  animation: fadeIn 0.5s ease-in-out;
}

.slide.active {
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* точки навигации */
.dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: #000f42;
}

/* Стрелки навигации */
.nav-arrows {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 -20px;
  pointer-events: none;
  z-index: 3;
}

.nav-arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #000f42;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  opacity: 0.8;
}

.nav-arrow:hover {
  background: #fff;
  opacity: 1;
  transform: scale(1.1);
}

.nav-prev {
  margin-left: -20px;
}

.nav-next {
  margin-right: -20px;
}

/* базовые стили */
.hero {
  min-height: 80vh;
  background: #ebecf0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 30px 20px;
  
  /* Добавляем фоновое изображение справа */
  background-image: url('@/assets/img/hero_right.png');
  background-position: right center;
  background-repeat: no-repeat;
  background-size: contain; /* или cover, в зависимости от нужного эффекта */
}

.hero-text { max-width: 800px; }

.container-mode { 
  width: 100%; 
  padding-left: 80px; 
  padding-right: 80px; 
  display: flex; 
  align-items: flex-start; 
  gap: 40px; 
}

.hero-text h1 {
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 700;
  line-height: 1.2;
  color: #000f42;
  margin-bottom: 20px;
}

.hero-text p {
  font-size: clamp(14px, 2vw, 16px);
  color: #576182;
  line-height: 1.6;
  margin-bottom: 16px;
  max-width: 72ch;
  word-break: break-word;
  hyphens: auto;
}

.btn-accent {
  background: #000f42;
  color: #fff;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 400;
  font-size: clamp(14px, 1.6vw, 16px);
  text-decoration: none;
  transition: all .3s ease;
  display: inline-block;
}

.btn-accent:hover { 
  background: #001a6d; 
}

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
  0%,20%,50%,80%,100% { transform: translate(-50%,0);} 
  40% { transform: translate(-50%,8px);} 
  60% { transform: translate(-50%,4px);} 
}

@keyframes glow { 
  0% { box-shadow: 0 0 5px rgba(0,15,66,.4);} 
  100% { box-shadow: 0 0 15px rgba(0,15,66,.8);} 
}

/* правая часть */
.hero-right {
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.media-wrap {
  position: relative;
  width: min(560px, 100%);
  border-radius: 24px;
  touch-action: pan-y;
  user-select: none;
}

.hero-photo {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 24px;
  min-height: 400px;
  object-fit: cover;
  background-color: #f0f0f0;
}

/* всплывающий отзыв */
.testimonial {
  position: absolute;
  top: 16px; 
  left: -32px;
  display: inline-flex; 
  align-items: center; 
  gap: 10px;
  background: #fff; 
  border-radius: 999px;
  padding: 6px 16px 6px 6px;
  box-shadow: 0 12px 30px rgba(0,0,0,.12);
  z-index: 2;
}

.t-avatar { 
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  object-fit: cover; 
}

.t-text { 
  line-height: 1.1; 
}

.t-name { 
  display: block; 
  font-size: 12px; 
  font-weight: 700; 
  color: #1f2348; 
}

.t-msg { 
  font-size: 12px; 
  margin: 0; 
  color: #4a5272; 
}

.avatar-stack { 
  list-style: none; 
  padding: 0; 
  margin: 0 0 10px 0; 
  display: flex; 
  align-items: center; 
}

.stack-item { 
  width: 36px; 
  height: 36px; 
  border-radius: 50%; 
  overflow: hidden; 
  border: 2px solid #fff; 
  margin-left: -8px; 
  box-shadow: 0 4px 10px rgba(0,0,0,.08); 
}

.stack-item:first-child { 
  margin-left: 0; 
}

.stack-item img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  display: block; 
}

.stack-item.more > div { 
  width: 100%; 
  height: 100%; 
  border-radius: 50%; 
  background: #0d0f21; 
  color: #fff; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: 700; 
  font-size: 12px; 
}

.metric { 
  margin: 6px 0 10px; 
  color: #5a6286; 
  font-size: 14px; 
}

.score { 
  margin: 0; 
  font-weight: 700; 
  color: #1f2348; 
  display: flex; 
  align-items: center; 
  gap: 6px; 
}

.star { 
  color: #ffb400; 
  font-size: 16px; 
}

.value { 
  font-size: 22px; 
}

.out-of { 
  opacity: .7; 
}

/* адаптивность */
@media (max-width: 1296px) {
  .container-mode {
    flex-direction: column; 
    gap: 24px; 
    padding: 0;
  }
  .hero {
    background-size: 50% auto; /* Уменьшаем размер изображения на планшетах */
    background-position: right bottom;
  }
  .hero-right { 
    align-self: stretch; 
  }
  .media-wrap { 
    width: 100%; 
  }
}

/* Для мобильных устройств - адаптация текста */
@media (max-width: 768px) {

  .nav-arrows {
    padding: 0 -15px;
  }
  
  .nav-arrow {
    width: 35px;
    height: 35px;
    font-size: 20px;
  }
  
  .nav-prev {
    margin-left: -15px;
  }
  
  .nav-next {
    margin-right: -15px;
  }
  
  .news-description {
    -webkit-line-clamp: 3;
    -moz-line-clamp: 3;
    max-height: calc(1.4em * 3);
    font-size: 13px;
  }
}

@media (max-width: 576px) {
  .testimonial { 
    left: 8px; 
    top: 8px; 
  }
  
  .nav-arrows {
    display: none;
  }
  
  .dot {
    width: 12px;
    height: 12px;
  }
  
  .news-overlay {
    padding: 30px 15px 15px;
  }
  
  .news-title {
    font-size: 16px;
  }
  
  .news-description {
    -webkit-line-clamp: 2;
    -moz-line-clamp: 2;
    max-height: calc(1.4em * 2);
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .news-description {
    -webkit-line-clamp: 2;
    -moz-line-clamp: 2;
    max-height: calc(1.4em * 2);
    font-size: 11px;
  }
}
</style>