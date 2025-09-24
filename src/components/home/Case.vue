<template>
  <div class="container-mode my-5">
    <div class="row">
      <!-- Левая часть -->
      <div class="col-lg-3 col-md-4 mb-4 d-flex flex-column justify-content-between">
        <div>
          <h2 class="fw-bold">Наши кейсы</h2>
          <p class="text-muted">Реальные кейсы — как мы выстраиваем коммуникации, повышаем доверие и расширяем горизонты бизнеса</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-light border rounded-circle" data-bs-target="#casesCarousel" data-bs-slide="prev">
            <i class="bi bi-arrow-left"></i>
          </button>
          <button class="btn btn-light border rounded-circle" data-bs-target="#casesCarousel" data-bs-slide="next">
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Правая часть: слайдер -->
      <div class="col-lg-9 col-md-8">
        <div id="casesCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <!-- Skeleton loading -->
            <template v-if="loading">
              <div class="carousel-item active">
                <div class="row">
                  <div class="col-md-4 mb-4" v-for="n in isMobile ? 1 : 3" :key="n">
                    <div class="skeleton-image rounded" style="height: 200px;"></div>
                    <div class="skeleton-text mt-2"></div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Контент после загрузки -->
            <template v-else>
              <!-- Для мобильных -->
              <template v-if="isMobile">
                <div class="carousel-item" v-for="(caseItem, index) in cases" :key="caseItem.id" :class="{ active: index === 0 }">
                  <div class="row">
                    <div class="col-12">
                      <img 
                        :src="getImageUrl(caseItem)" 
                        :alt="caseItem.title" 
                        @click="openModal(index)"
                        class="d-block w-100 rounded shadow cursor-pointer"
                        style="height: 200px; object-fit: cover;"
                        loading="lazy"
                      >
                      <p class="mt-2 fw-semibold">{{ caseItem.title }}</p>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Для десктопа -->
              <template v-else>
                <div class="carousel-item" v-for="(chunk, chunkIndex) in desktopChunks" :key="chunkIndex" :class="{ active: chunkIndex === 0 }">
                  <div class="row">
                    <div class="col-md-4 mb-4" v-for="caseItem in chunk" :key="caseItem.id">
                      <img 
                        :src="getImageUrl(caseItem)" 
                        :alt="caseItem.title" 
                        @click="openModal(getCaseIndex(caseItem))"
                        class="d-block w-100 rounded shadow cursor-pointer"
                        style="height: 200px; object-fit: cover;"
                        loading="lazy"
                      >
                      <p class="mt-2 fw-semibold">{{ caseItem.title }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно -->
    <div v-if="isModalOpen" class="minimal-modal-overlay" @click.self="closeModal">
      <div class="minimal-modal-container"
           @touchstart="handleTouchStart"
           @touchmove="handleTouchMove"
           @touchend="handleTouchEnd">
        <div class="minimal-modal-content">
          <div class="modal-header">
            <div class="case-counter">
              {{ currentIndex + 1 }}/{{ selectedCase?.images?.length || 0 }}
            </div>
            <button @click="closeModal" class="close-btn">×</button>
          </div>

          <div class="modal-image-wrapper"
               @touchstart="handleImageTouchStart"
               @touchmove="handleImageTouchMove"
               @touchend="handleImageTouchEnd">
            <img 
              v-if="selectedCase && selectedCase.images && selectedCase.images[currentIndex]"
              :src="getModalImageUrl(selectedCase.images[currentIndex])" 
              :alt="selectedCase.title" 
              class="modal-image"
            >
            <div v-else class="image-placeholder">
              Изображение не доступно
            </div>
            
            <!-- Свайп индикаторы -->
            <div v-if="isMobile && selectedCase?.images?.length > 1" class="swipe-indicators">
              <div class="swipe-hint" v-if="showSwipeHint">
                ← Свайп для навигации →
              </div>
            </div>
          </div>

          <div class="modal-info">
            <h3 class="modal-title">{{ selectedCase?.title }}</h3>
            <p class="modal-description">{{ selectedCase?.description }}</p>
          </div>

          <div class="modal-nav" v-if="selectedCase?.images?.length > 1">
            <button @click="prevCaseImage" class="nav-btn">◀</button>
            <div class="nav-dots">
              <div 
                v-for="(img, index) in selectedCase.images" 
                :key="index"
                :class="['nav-dot', { active: index === currentIndex }]"
                @click="goToImage(index)"
              ></div>
            </div>
            <button @click="nextCaseImage" class="nav-btn">▶</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-image {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-text {
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  font-style: italic;
}

.container-mode {
  padding-left: 80px;
  padding-right: 80px;
}

@media (max-width: 768px) {
  .container-mode {
    padding-left: 15px;
    padding-right: 15px;
  }
}

img {
  object-fit: cover;
}

.cursor-pointer {
  cursor: pointer;
}

.minimal-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.minimal-modal-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  touch-action: pan-y;
}

.minimal-modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f3f4;
}

.case-counter {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #333;
  background: #f5f5f5;
}

.modal-image-wrapper {
  background: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  max-height: 300px;
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.modal-image.swiping {
  transition: none;
}

.modal-info {
  padding: 20px;
  flex-grow: 1;
  overflow-y: auto;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
}

.modal-description {
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  margin: 0;
}

.modal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #f1f3f4;
  background: #fafafa;
}

.nav-btn {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover:not(:disabled) {
  border-color: #ccc;
  background: #f8f9fa;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-dots {
  display: flex;
  gap: 6px;
  align-items: center;
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-dot.active {
  background: #666;
  transform: scale(1.2);
}

.nav-dot:hover {
  background: #999;
}

/* Свайп индикаторы */
.swipe-indicators {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.swipe-hint {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* Анимации для свайпа */
.swipe-left {
  animation: swipeLeft 0.3s ease;
}

.swipe-right {
  animation: swipeRight 0.3s ease;
}

@keyframes swipeLeft {
  0% { transform: translateX(0); }
  50% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}

@keyframes swipeRight {
  0% { transform: translateX(0); }
  50% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}

@media (max-width: 640px) {
  .minimal-modal-overlay {
    padding: 10px;
  }
  
  .minimal-modal-container {
    max-width: 100%;
    max-height: 95vh;
  }
  
  .modal-image-wrapper {
    padding: 15px;
    min-height: 150px;
    max-height: 250px;
  }
  
  .modal-info {
    padding: 15px;
  }
  
  .modal-title {
    font-size: 16px;
  }
  
  .modal-description {
    font-size: 13px;
  }
  
  .modal-nav {
    padding: 12px 15px;
  }
  
  .nav-btn {
    padding: 6px;
  }
  
  .swipe-hint {
    font-size: 11px;
    padding: 6px 12px;
  }
}

@media (max-width: 380px) {
  .modal-image-wrapper {
    min-height: 120px;
    max-height: 200px;
  }
  
  .modal-header {
    padding: 12px 15px;
  }
  
  .modal-info {
    padding: 12px 15px;
  }
}
</style>

<script>
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config.js';

export default {
  name: 'Case',
  data() {
    return {
      cases: [],
      MEDIA_API_URL,
      selectedCase: null,
      currentIndex: 0,
      isModalOpen: false,
      isMobile: window.innerWidth < 768,
      loading: true,
      error: null,
      
      // Свайп переменные
      touchStartX: 0,
      touchStartY: 0,
      touchEndX: 0,
      touchEndY: 0,
      isSwiping: false,
      swipeDistance: 0,
      showSwipeHint: true
    };
  },
  computed: {
    desktopChunks() {
      if (!this.cases.length) return [];
      
      const chunks = [];
      for (let i = 0; i < this.cases.length; i += 3) {
        chunks.push(this.cases.slice(i, i + 3));
      }
      return chunks;
    }
  },
  async created() {
    await this.fetchCasesData();
    window.addEventListener('resize', this.checkMobile);
  },
  methods: {
    async fetchCasesData() {
      try {
        this.loading = true;
        const response = await axios.get(`${API_URL}/cases/`);
        this.cases = response.data || [];
      } catch (error) {
        console.error('Error fetching cases data:', error);
        this.error = 'Не удалось загрузить данные кейсов';
        this.cases = [];
      } finally {
        this.loading = false;
      }
    },

    getImageUrl(caseItem) {
      if (caseItem.images && caseItem.images.length > 0) {
        return `${MEDIA_API_URL}${caseItem.images[0].image}`;
      }
      return '/assets/img/placeholder.jpg';
    },

    getModalImageUrl(imageObj) {
      if (!imageObj?.image) return '/assets/img/placeholder.jpg';
      return `${MEDIA_API_URL}${imageObj.image}`;
    },

    getCaseIndex(caseItem) {
      return this.cases.findIndex(item => item.id === caseItem.id);
    },

    openModal(index) {
      this.currentIndex = 0;
      this.selectedCase = this.cases[index];
      this.isModalOpen = true;
      this.showSwipeHint = true;
      
      // Скрываем подсказку через 3 секунды
      setTimeout(() => {
        this.showSwipeHint = false;
      }, 3000);
      
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    },

    closeModal() {
      this.isModalOpen = false;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    },

    nextCaseImage() {
      if (this.selectedCase?.images?.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.selectedCase.images.length;
        this.animateSwipe('left');
      }
    },

    prevCaseImage() {
      if (this.selectedCase?.images?.length > 0) {
        this.currentIndex = (this.currentIndex - 1 + this.selectedCase.images.length) % this.selectedCase.images.length;
        this.animateSwipe('right');
      }
    },

    goToImage(index) {
      if (this.selectedCase?.images?.length > index) {
        this.currentIndex = index;
      }
    },

    animateSwipe(direction) {
      const image = document.querySelector('.modal-image');
      if (image) {
        image.classList.add(direction === 'left' ? 'swipe-left' : 'swipe-right');
        setTimeout(() => {
          image.classList.remove('swipe-left', 'swipe-right');
        }, 300);
      }
    },

    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },

    // Методы для свайпа
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.isSwiping = false;
    },

    handleTouchMove(e) {
      if (!this.isModalOpen) return;
      
      this.touchEndX = e.touches[0].clientX;
      this.touchEndY = e.touches[0].clientY;
      
      const diffX = this.touchStartX - this.touchEndX;
      const diffY = this.touchStartY - this.touchEndY;
      
      // Проверяем, что это горизонтальный свайп (а не вертикальный скролл)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        this.isSwiping = true;
        e.preventDefault();
      }
    },

    handleTouchEnd() {
      if (!this.isSwiping || !this.isModalOpen) return;
      
      const diffX = this.touchStartX - this.touchEndX;
      const minSwipeDistance = 50; // Минимальное расстояние свайпа
      
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          // Свайп влево - следующее изображение
          this.nextCaseImage();
        } else {
          // Свайп вправо - предыдущее изображение
          this.prevCaseImage();
        }
      }
      
      this.isSwiping = false;
    },

    // Методы для свайпа по изображению
    handleImageTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.isSwiping = false;
    },

    handleImageTouchMove(e) {
      if (!this.isModalOpen || this.selectedCase?.images?.length <= 1) return;
      
      this.touchEndX = e.touches[0].clientX;
      this.touchEndY = e.touches[0].clientY;
      
      const diffX = this.touchStartX - this.touchEndX;
      const diffY = this.touchStartY - this.touchEndY;
      
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        this.isSwiping = true;
        e.preventDefault();
      }
    },

    handleImageTouchEnd() {
      if (!this.isSwiping || !this.isModalOpen || this.selectedCase?.images?.length <= 1) return;
      
      const diffX = this.touchStartX - this.touchEndX;
      const minSwipeDistance = 30;
      
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          this.nextCaseImage();
        } else {
          this.prevCaseImage();
        }
      }
      
      this.isSwiping = false;
      this.showSwipeHint = false; // Скрываем подсказку после первого свайпа
    }
  },
  mounted() {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && this.isModalOpen) {
        this.closeModal();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    this._handleEscape = handleEscape;
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this._handleEscape);
    window.removeEventListener('resize', this.checkMobile);
  }
}
</script>