<template>
  <div class="container-mode my-5">
    <div class="row">
      <!-- Левая часть -->
      <div class="col-lg-3 col-md-4 mb-4 d-flex flex-column justify-content-between">
        <div>
          <h2 class="fw-bold">Наши кейсы</h2>
          <p class="text-muted"> Реальные кейсы — как мы выстраиваем коммуникации, повышаем доверие и расширяем горизонты бизнеса </p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-light border rounded-circle" data-bs-target="#casesCarousel" data-bs-slide="prev"> <i class="bi bi-arrow-left"></i> </button>
          <button class="btn btn-light border rounded-circle" data-bs-target="#casesCarousel" data-bs-slide="next"> <i class="bi bi-arrow-right"></i> </button>
        </div>
      </div>
      <!-- Правая часть: слайдер -->
      <div class="col-lg-9 col-md-8">
        <div id="casesCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <!-- Для мобильных - по 1 карточке -->
            <template v-if="isMobile">
              <div class="carousel-item" v-for="(caseItem, index) in cases" :key="caseItem.id" :class="{ active: index === 0 }">
                <div class="row">
                  <div class="col-12">
                    <img 
                      :src="MEDIA_API_URL + caseItem.image" 
                      class="d-block w-100 rounded shadow cursor-pointer" 
                      :alt="caseItem.title" 
                      @click="openModal(index)"
                      style="height: 200px; object-fit: cover;"
                    >
                    <p class="mt-2 fw-semibold">{{ caseItem.title }}</p>
                  </div>
                </div>
              </div>
            </template>
            
            <!-- Для десктопа - по 3 карточки -->
            <template v-else>
              <div class="carousel-item" v-for="(chunk, chunkIndex) in desktopChunks" :key="chunkIndex" :class="{ active: chunkIndex === 0 }">
                <div class="row">
                  <div class="col-md-4 mb-4" v-for="caseItem in chunk" :key="caseItem.id">
                    <img 
                      :src="MEDIA_API_URL + caseItem.image" 
                      class="d-block w-100 rounded shadow cursor-pointer" 
                      :alt="caseItem.title" 
                      @click="openModal(getCaseIndex(caseItem))"
                      style="height: 200px; object-fit: cover;"
                    >
                    <p class="mt-2 fw-semibold">{{ caseItem.title }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Минималистичный попап -->
    <div v-if="isModalOpen" class="minimal-modal-overlay" @click.self="closeModal">
      <div class="minimal-modal-container">
        <!-- Контент попапа -->
        <div class="minimal-modal-content">
          <!-- Заголовок и закрытие -->
          <div class="modal-header">
            <div class="case-counter">
              {{ currentIndex + 1 }}/{{ cases.length }}
            </div>
            <button @click="closeModal" class="close-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <!-- Изображение -->
          <div class="modal-image-wrapper">
            <img v-if="selectedCase?.image" :src="MEDIA_API_URL + selectedCase.image" :alt="selectedCase?.title" class="modal-image">
          </div>
          
          <!-- Информация -->
          <div class="modal-info">
            <h3 class="modal-title">{{ selectedCase?.title }}</h3>
            <p class="modal-description">{{ selectedCase?.description }}</p>
          </div>
          
          <!-- Навигация -->
          <div class="modal-nav">
            <button @click="prevCase" class="nav-btn" :disabled="cases.length <= 1">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <div class="nav-dots">
              <div v-for="(_, index) in cases" :key="index" 
                   :class="['nav-dot', { active: index === currentIndex }]" 
                   @click="goToCase(index)"></div>
            </div>
            
            <button @click="nextCase" class="nav-btn" :disabled="cases.length <= 1">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  
  /* Минималистичный попап */
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
  }
  
  .minimal-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  /* Шапка */
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
  
  /* Изображение */
  .modal-image-wrapper {
    background: #fafafa;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    max-height: 300px;
  }
  
  .modal-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  /* Информация */
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
  
  /* Навигация */
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
  
  /* Адаптивность */
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
  
  /* Стили для карусели */
  .carousel-item {
    transition: transform 0.6s ease-in-out;
  }
  
  .carousel-item .row {
    margin: 0 -10px;
  }
  
  .carousel-item .col-md-4 {
    padding: 0 10px;
  }
  
  /* Предотвращение скролла */
  body.modal-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
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
        isMobile: window.innerWidth < 768
      };
    },
    computed: {
      // Группируем кейсы по 3 для десктопа
      desktopChunks() {
        const chunks = [];
        for (let i = 0; i < this.cases.length; i += 3) {
          chunks.push(this.cases.slice(i, i + 3));
        }
        return chunks;
      }
    },
    async created() {
      try {
        const response = await axios.get(API_URL);
        this.cases = response.data.cases;
      } catch (error) {
        console.error('Error fetching cases data:', error);
      }
    },
    methods: {
      // Получаем индекс кейса в общем массиве
      getCaseIndex(caseItem) {
        return this.cases.findIndex(item => item.id === caseItem.id);
      },
      
      openModal(index) {
        this.currentIndex = index;
        this.selectedCase = this.cases[this.currentIndex];
        this.isModalOpen = true;
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
      }, 
      closeModal() { 
        this.isModalOpen = false; 
        document.body.style.overflow = 'auto';
        document.body.classList.remove('modal-open');
      }, 
      nextCase() { 
        if (this.cases.length > 0) { 
          this.currentIndex = (this.currentIndex + 1) % this.cases.length; 
          this.selectedCase = this.cases[this.currentIndex]; 
        } 
      }, 
      prevCase() { 
        if (this.cases.length > 0) { 
          this.currentIndex = (this.currentIndex - 1 + this.cases.length) % this.cases.length; 
          this.selectedCase = this.cases[this.currentIndex]; 
        } 
      }, 
      goToCase(index) { 
        this.currentIndex = index; 
        this.selectedCase = this.cases[this.currentIndex]; 
      },
      
      // Проверяем мобильное устройство
      checkMobile() {
        this.isMobile = window.innerWidth < 768;
      }
    },
    mounted() { 
      document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape' && this.isModalOpen) { 
          this.closeModal(); 
        } 
      }); 
      
      // Обновляем при изменении размера окна
      window.addEventListener('resize', this.checkMobile);
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.checkMobile);
    }
  }
</script>