<template>
  <section id="team">
    <div class="container-mode mt-5">
      <h2 class="mb-3">{{ $t('navigation.team') }}</h2>
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
                  <p class="description">{{ member.description || $t('team.no_description') }}</p>
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
      error: null,
      currentLanguage: 'ru'
    };
  },
  async created() {
    this.currentLanguage = localStorage.getItem('preferred-language') || this.$i18n.locale;
    window.addEventListener('language-updated', this.handleLanguageUpdate);
    await this.fetchTeamData();
  },
  methods: {
    async fetchTeamData() {
      try {        
        this.loading = true;
        const response = await axios.get(`${API_URL}/team/`, {
          params: {
            lang: this.currentLanguage
          }
        });
        
        console.log('=== TEAM DATA DEBUG ===');
        console.log('Language:', this.currentLanguage);
        console.log('Full response:', response.data);
        
        // Обрабатываем разные форматы ответа
        if (response.data && response.data.teams) {
          this.team = response.data.teams;
        } else if (Array.isArray(response.data)) {
          this.team = response.data;
        } else {
          this.team = [];
          console.warn('Unexpected response format:', response.data);
        }
        
        console.log('Team data after processing:', this.team);
        
        this.error = null;
        
      } catch (error) {
        console.error('Error fetching team data:', error);
        this.error = this.$t('team.load_error');
        this.team = [];
      } finally {
        this.loading = false;
      }
    },

    handleLanguageUpdate(event) {
      const newLanguage = event.detail.language;
      if (newLanguage !== this.currentLanguage) {
        this.currentLanguage = newLanguage;
        this.reloadTeamData();
      }
    },

    async reloadTeamData() {
      console.log('Reloading team data for language:', this.currentLanguage);
      await this.fetchTeamData();
    },
    
    getMemberPhotoUrl(photo) {
      if (!photo) {
        return '/assets/img/default-avatar.png';
      }
      
      if (photo.startsWith('http')) {
        return photo;
      }
      
      if (photo.startsWith('/')) {
        photo = photo.substring(1);
      }
      
      return `${MEDIA_API_URL}${photo}`;
    },
    
    handleImageError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7QotC10YHRgtC+0LLRi9C5PC90ZXh0Pjwvc3ZnPg==';
    }
  },
  beforeUnmount() {
    window.removeEventListener('language-updated', this.handleLanguageUpdate);
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