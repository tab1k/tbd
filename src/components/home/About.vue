<template>
  <section id="about" class="about-section py-5">
    <div class="container-mode">
      <div class="row align-items-center">

        <!-- Видео -->
        <div class="col-md-6 order-1 order-md-2">
          <div class="ratio ratio-16x9 rounded-2 shadow-sm about-video position-relative">
            <!-- Постер -->
            <img 
              v-show="!isVideoPlaying"
              :src="posterImage" 
              class="video-poster cursor-pointer w-100 h-100" 
              alt="Video poster"
              @click="playVideo"
              style="object-fit: cover; border-radius: 5px;"
            >
            
            <!-- Видео -->
            <video 
              v-show="isVideoPlaying"
              ref="videoPlayer"
              :src="videoUrl" 
              controls 
              preload="metadata"
              :poster="posterImage"
              @play="onVideoPlay"
              @pause="onVideoPause"
              @ended="onVideoEnd"
              style="width: 100%; height: auto; border-radius: 5px;"
              loading="lazy"
            >
              Ваш браузер не поддерживает видео.
            </video>
            
            <!-- Кнопка play -->
            <div v-if="!isVideoPlaying" class="position-absolute top-50 start-50 translate-middle">
              <button @click="playVideo" class="btn btn-primary rounded-circle">
                <i class="bi bi-play-fill fs-4"></i>
              </button>
            </div>

            <!-- Лоадер -->
            <div v-if="isVideoLoading" class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
              <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Загрузка...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Текст -->
        <div class="col-md-6 mb-4 mb-md-0 order-2 order-md-1">
          <h2 class="section-title mt-4">О нас</h2>
          <p>Мы — команда экспертов с более чем 18-летним опытом в стратегических коммуникациях, управлении репутацией и построении устойчивых связей между бизнесом и обществом.</p>
          <p>
            Turan Business Development основано как платформа, объединяющая лучшие практики и региональный контекст для создания сильных, прозрачных и результативных коммуникаций.
          </p>
          <p>
            Наше отличие:
          </p>
          <p>— Глубокая экспертиза в чувствительных и регулируемых отраслях <br>
            — Стратегический подход в каждой детали <br>
            — Понимание политико-экономических реалий стран СНГ, Ближнего Востока и Европы
          </p>

          <p>
            Мы не просто сопровождаем — мы встраиваемся в ваши цели, чтобы масштабировать их через смысл, диалог и доверие.
          </p>

          <!-- Кнопки -->
          <div class="btn-group mt-3">
            <a href="#" class="btn-outline-accent">ПОСМОТРЕТЬ НАШИ КЕЙСЫ</a>
            <a href="tel:+77010000000" class="btn-icon">
              <img src="@/assets/svg/phone-call.svg" style="color: #1C2957;" alt="Позвонить" />
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config';
import defaultPoster from '@/assets/img/asia.jpg'; // Правильный импорт изображения

export default {
  name: 'AboutSection',
  data() {
    return {
      videoUrl: '',
      posterUrl: '',
      isVideoPlaying: false,
      isVideoLoading: false,
      videoLoaded: false
    };
  },
  computed: {
    posterImage() {
      // Если есть постер из API - используем его, иначе дефолтный
      return this.posterUrl ? MEDIA_API_URL + this.posterUrl : defaultPoster;
    }
  },
  async created() {
    try {
      const response = await axios.get(API_URL);
      console.log('Response Data:', response.data);
      
      if (response.data.videos && response.data.videos.length > 0) {
        const videoData = response.data.videos[0];
        this.videoUrl = MEDIA_API_URL + videoData.video;
        
        // Если есть постер в ответе API
        if (videoData.poster) {
          this.posterUrl = videoData.poster;
        }
        
        console.log('Video URL:', this.videoUrl);
        console.log('Poster URL:', this.posterUrl);
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  },
  mounted() {
    this.setupLazyLoading();
  },
  
  methods: {
    setupLazyLoading() {
      const videoElement = this.$refs.videoPlayer;
      
      if (videoElement && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.videoLoaded) {
              this.preloadVideo();
              observer.disconnect();
            }
          });
        }, {
          rootMargin: '200px',
          threshold: 0.1
        });
        
        observer.observe(videoElement);
      } else {
        this.preloadVideo();
      }
    },
    
    preloadVideo() {
      const video = this.$refs.videoPlayer;
      if (video) {
        video.preload = 'auto';
        this.videoLoaded = true;
      }
    },
    
    async playVideo() {
      const video = this.$refs.videoPlayer;
      
      if (video) {
        this.isVideoLoading = true;
        
        try {
          await video.play();
        } catch (error) {
          console.error('Error playing video:', error);
          this.isVideoLoading = false;
        }
      }
    },
    
    onVideoPlay() {
      this.isVideoPlaying = true;
      this.isVideoLoading = false;
    },
    
    onVideoPause() {
      this.isVideoPlaying = false;
    },
    
    onVideoEnd() {
      this.isVideoPlaying = false;
    }
  },
  
  beforeUnmount() {
    if (this.$refs.videoPlayer) {
      this.$refs.videoPlayer.pause();
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

.section-title {
  font-family: "Gilroy", sans-serif;
  font-weight: 400;
  font-size: 32px;
  color: #1C2957;
}

.position-absolute.top-50.start-50.translate-middle {
    text-align: center;

}

.translate-middle {
    transform: translate(-50%, -10%) !important;
}

.btn-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
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
  white-space: nowrap;
}

.btn-outline-accent:hover {
  background: #1C2957;
  color: #fff;
  text-decoration: none;
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
  flex-shrink: 0;
}

.btn-icon img {
  width: 22px;
  height: 22px;
  transition: filter 0.3s ease;
}

.btn-icon:hover {
  background: #1C2957;
  text-decoration: none;
}

.btn-icon:hover img {
  filter: brightness(0) invert(1);
}

.about-video {
  position: relative;
  overflow: hidden;
  background: #000;
  border-radius: 5px;
}

.video-poster {
  transition: opacity 0.3s ease;
  cursor: pointer;
}

/* Адаптивность */
@media (max-width: 768px) {
  .about-video {
    margin-top: 20px;
  }

  .container-mode {
    padding-left: 16px;
    padding-right: 16px;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .about-section p {
    font-size: 1rem;
  }

  .btn-group {
    justify-content: left;
  }
  
  .btn-outline-accent {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>