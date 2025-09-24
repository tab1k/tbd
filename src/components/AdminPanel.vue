<template>
  <div class="container">
    <div class="admin-panel">
      <div class="dashboard-header">
        <h1>Добро пожаловать!</h1>
        <p>Управляйте контентом и настройками легко и быстро!</p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card" @click="goToRequests">
          <div class="card-content">
            <h2>Отклики</h2>
            <p>{{ stats.requests }}</p>
          </div>
        </div>
        <div class="stat-card" @click="goToCases">
          <div class="card-content">
            <h2>Кейсы</h2>
            <p>{{ stats.cases }}</p>
          </div>
        </div>
        <div class="stat-card" @click="goToTeams">
          <div class="card-content">
            <h2>Команда</h2>
            <p>{{ stats.team_members }}</p>
          </div>
        </div>
        <div class="stat-card" @click="goToVideos">
          <div class="card-content">
            <h2>Видео</h2>
            <p>{{ stats.videos }}</p>
          </div>
        </div>

        <div class="stat-card" @click="goToLogo">
          <div class="card-content">
            <h2>Логотипы</h2>
            <p>{{ stats.logos }}</p>
          </div>
        </div>

        <div class="stat-card" @click="goToNews">
          <div class="card-content">
            <h2>Новости</h2>
            <p>{{ stats.news }}</p>
          </div>
        </div>

        <!-- Длинный блок откликов -->
        <div class="long-stat-card" @click="goToRequests">
          <div class="card-content">
            <h2>Отклики</h2>
            <p>{{ stats.requests }}</p>
          </div>
        </div>
      </div>

      <!-- Баннер -->
      <div class="promo-banner">
        <div class="banner-content">
          <div class="text-content">
            <h2>Подпишитесь на наc!</h2>
            <p>Будьте в курсе последних обновлений и новостей.</p>
          </div>
          <div class="logo-container">
            <img src="assets/img/banner.png" alt="Logo" class="banner-logo" />
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export const MEDIA_API_URL = 'http://192.168.0.14:8000';

export default {
  name: 'AdminPanel',
  data() {
    return {
      stats: {
        requests: 0,
        videos: 0,
        team_members: 0,
        cases: 0,
        news: 0,
        logos: 0
      }
    };
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    async fetchStats() {
      try {
        const response = await fetch(`${MEDIA_API_URL}/admin-panel/`);
        const data = await response.json();
        this.stats = data;
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      }
    },
    goToUsers() {
      this.$router.push({ name: 'AdminUsers' });
    },
    goToCases() {
      this.$router.push({ name: 'AdminCases' });
    },
    goToTeams() {
      this.$router.push({ name: 'AdminTeams' });
    },
    goToVideos() {
      this.$router.push({ name: 'AdminVideos' });
    },
    goToRequests() {
      this.$router.push({ name: 'AdminRequests' });
    },
    goToNews() {
      this.$router.push({ name: 'AdminNews' });
    },
    goToLogo() {
      this.$router.push({ name: 'AdminLogo' });
    },
  },
};
</script>

<style scoped>
.admin-panel {
  padding: 30px;
  background-color: #fff; /* Белый фон */
  font-family: 'Montserrat', sans-serif;
  color: #000F42; /* Темно-синий цвет */
}

.dashboard-header {
  text-align: left;
  margin-bottom: 40px;
  animation: fadeIn 1s ease-out;
}

.dashboard-header h1 {
  font-size: 48px;
  margin: 0;
  color: #000F42;
  font-weight: 600;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.dashboard-header p {
  font-size: 20px;
  color: #555; /* Слегка серый для текста */
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid #eee;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.card-content {
  text-align: center;
}

.card-content h2 {
  font-size: 30px;
  margin: 0;
  font-weight: 600;
  color: #000F42;
}

.card-content p {
  font-size: 50px;
  font-weight: 700;
  color: #00bcd4; /* Неоновый синий акцент */
}

.long-stat-card {
  grid-column: span 2; /* Этот блок будет занимать два столбца */
  background-color: #ffffff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid #eee;
}

.long-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.promo-banner {
  background: linear-gradient(135deg, #000F42, #003366); /* Градиентный фон */
  color: #fff;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  margin-top: 40px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.promo-banner h2 {
  text-align: left;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 10px;
}

.promo-banner p {
  text-align: left;
  font-size: 20px;
  margin-bottom: 20px;
}

.promo-banner .banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.promo-banner .text-content {
  flex: 1;
}

.promo-banner .logo-container {
  margin-left: 20px;
}

.promo-banner .banner-logo {
  width: 100px; /* Размер логотипа */
  height: auto;
}

.promo-banner button {
  background-color: #00bcd4;
  color: #fff;
  padding: 15px 30px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.promo-banner button:hover {
  background-color: #0097a7;
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 32px;
  }

  .dashboard-header p {
    font-size: 18px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-card h2 {
    font-size: 24px;
  }

  .stat-card p {
    font-size: 40px;
  }

  .long-stat-card {
    grid-column: span 1; /* На мобильных устройствах блок будет занимать только один столбец */
  }

  .promo-banner {
    padding: 20px;
  }

  .promo-banner h2 {
    font-size: 28px;
  }

  .promo-banner p {
    font-size: 16px;
  }

  .promo-banner .banner-content {
    flex-direction: column;
    text-align: center;
  }

  .promo-banner .logo-container {
    margin-left: 0;
    margin-top: 20px;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
