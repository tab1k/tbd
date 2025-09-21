<template>
  <section id="team" class="py-5">
    <div class="container-mode">
      <h2 class="mb-3">Команда</h2>
      <!-- g-2 уменьшает отступы между колонками -->
      <div class="row text-center g-2">
        <!-- Перебираем команду и отображаем карточки -->
        <div class="col-md-3" v-for="member in team" :key="member.id">
          <div class="team-card">
            <div class="photo">
              <img :src="getMemberPhotoUrl(member.photo)" alt="team-member">
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
      team: [],  // Массив для команды
    };
  },
  async created() {
    try {
      const response = await axios.get(API_URL);  // Ваш API для получения данных
      this.team = response.data.team;  // Сохраняем полученные данные о команде
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  },
  methods: {
    // Метод для формирования правильного URL изображения
    getMemberPhotoUrl(photo) {
      return photo ? `${MEDIA_API_URL}${photo}` : 'assets/img/default-avatar.png';
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
  padding: 0px; /* меньше внутренний отступ */
}

.photo {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 12px;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 768px) {
  .container-mode {
    padding-left: 20px;
    padding-right: 20px;
  }

  .row {
    display: flex;
    flex-wrap: nowrap; /* Убираем перенос строк */
    overflow-x: auto; /* Горизонтальная прокрутка */
    -webkit-overflow-scrolling: touch; /* Плавная прокрутка на iOS */
  }

  .col-md-3 {
    flex: 0 0 85%; /* 70% ширины для одной карточки */
  }

  /* Настройка для того, чтобы была видна еще часть следующей карточки */
  .col-md-3 + .col-md-3 {
    margin-left: 15px; /* Немного отступа для следующей карточки */
  }
}
</style>
