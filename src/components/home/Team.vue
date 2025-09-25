<template>
  <section id="team">
    <div class="container-mode mt-5">
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
            <div class="photo-container">
              <div class="photo-wrapper">
                <div class="photo-front">
                  <img 
                    :src="getMemberPhotoUrl(member.photo)" 
                    :alt="member.name"
                    loading="lazy"
                    @error="handleImageError"
                  >
                </div>
                <div class="photo-back">
                  <p class="description">{{ member.description || 'Описание отсутствует' }}</p>
                </div>
              </div>
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
        const response = await axios.get(`${API_URL}/team/`);
        
        this.team = response.data;
        
      } catch (error) {
        console.error('Error fetching team data:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    getMemberPhotoUrl(photo) {
      if (!photo) {
        console.log('No photo provided, using default');
        return 'assets/img/default-avatar.png';
      }
      
      const fullUrl = `${MEDIA_API_URL}${photo}`;
      console.log('Building photo URL:', { photo, MEDIA_API_URL, fullUrl });
      return fullUrl;
    },
    
    handleImageError(event) {
      console.error('Image load error:', {
        src: event.target.src,
        alt: event.target.alt
      });
      
      // Fallback image
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7QotC10YHRgtC+0LLRi9C5PC90ZXh0Pjwvc3ZnPg==';
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

.photo-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  perspective: 1000px;
}

.photo-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.team-card:hover .photo-wrapper {
  transform: rotateY(180deg);
}

.photo-front, .photo-back {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
}

.photo-front {
  background-color: #f0f0f0;
}

.photo-front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.3s ease;
}

.photo-back {
  background: linear-gradient(135deg, #667eea 0%, #000f42 100%);
  color: white;
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.photo-back .description {
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  text-align: left;
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
  
  /* Для мобильных устройств - замена hover на click */
  .photo-wrapper.flipped {
    transform: rotateY(180deg);
  }
}

/* Оптимизация для мобильных устройств */
@media (max-width: 480px) {
  .photo-container {
    aspect-ratio: 1;
  }
  
  .photo-back .description {
    font-size: 15px;
    
  }
}
</style>