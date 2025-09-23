<template>
  <section id="team" class="py-5">
    <div class="container-mode">
      <h2 class="mb-3">Команда</h2>
      <div class="row text-center g-2">
        <!-- Skeleton loading -->
        <div v-if="loading" class="col-md-3" v-for="n in 4" :key="`skeleton-${n}`">
          <div class="team-card">
            <div class="photo skeleton"></div>
            <div class="skeleton-text mt-3"></div>
            <div class="skeleton-text-short"></div>
          </div>
        </div>
        
        <!-- Actual content -->
        <div v-else class="col-md-3" v-for="member in team" :key="member.id">
          <div class="team-card">
            <div class="photo">
              <img 
                :src="getMemberPhotoUrl(member.photo)" 
                :alt="member.name"
                loading="lazy"
                @load="imageLoaded"
              >
            </div>
            <h5 class="mt-3">{{ member.name }}</h5>
            <p>{{ member.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config';

export default {
  name: 'Team',
  data() {
    return {
      team: [],
      loading: true,
      error: null
    };
  },
  async created() {
    await this.fetchTeamData();
  },
  methods: {
    async fetchTeamData() {
      try {
        // Используем Promise.all для параллельной загрузки
        const [teamResponse] = await Promise.all([
          axios.get(API_URL),
          // Предзагрузка критических ресурсов, если нужно
          this.preloadCriticalResources()
        ]);
        
        this.team = teamResponse.data.team;
        
        // Предзагрузка изображений
        this.preloadImages();
        
      } catch (error) {
        console.error('Error fetching team data:', error);
        this.error = 'Не удалось загрузить данные команды';
      } finally {
        this.loading = false;
      }
    },
    
    getMemberPhotoUrl(photo) {
      return photo ? `${MEDIA_API_URL}${photo}` : 'assets/img/default-avatar.png';
    },
    
    preloadCriticalResources() {
      // Предзагрузка дефолтного аватара
      return new Promise((resolve) => {
        if (typeof window !== 'undefined') {
          const img = new Image();
          img.src = 'assets/img/default-avatar.png';
          img.onload = resolve;
          img.onerror = resolve;
        } else {
          resolve();
        }
      });
    },
    
    preloadImages() {
      if (typeof window === 'undefined') return;
      
      this.team.forEach(member => {
        if (member.photo) {
          const img = new Image();
          img.src = this.getMemberPhotoUrl(member.photo);
        }
      });
    },
    
    imageLoaded(event) {
      // Можно добавить анимацию появления
      event.target.classList.add('loaded');
    }
  }
}
</script>

<style scoped>
.container-mode {
  padding-left: 80px;
  padding-right: 80px;
}

.team-card {
  padding: 0px;
}

.photo {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 12px;
  background-color: #f0f0f0;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo img.loaded {
  opacity: 1;
}

/* Skeleton loading styles */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

.skeleton-text {
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text-short {
  height: 16px;
  width: 70%;
  background: #f0f0f0;
  border-radius: 4px;
  margin: 0 auto;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .container-mode {
    padding-left: 20px;
    padding-right: 20px;
  }

  .row {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .col-md-3 {
    flex: 0 0 85%;
  }

  .col-md-3 + .col-md-3 {
    margin-left: 15px;
  }
}

/* Оптимизация для мобильных устройств */
@media (max-width: 480px) {
  .photo {
    aspect-ratio: 3/4; /* Более подходящее соотношение для мобильных */
  }
}
</style>