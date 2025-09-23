<template>
  <div class="admin-news">
    <div class="mb-3">
      <a class="link-back" href="/admin">Назад</a>
    </div>

    <div class="page-header">
      <h1>Новости</h1>
      <p>Управляйте новостями системы</p>
    </div>

    <!-- Фильтрация новостей -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по заголовку или описанию" 
        @input="filterNews" 
        class="search-input"
      />
      <!-- Плюсик для добавления новости -->
      <button class="add-news-btn" @click="openAddNewsModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с новостями -->
    <div class="table-responsive">
      <table class="news-table">
        <thead>
          <tr>
            <th>Заголовок</th>
            <th>Описание</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="news in filteredNews" :key="news.id">
            <td>{{ news.title }}</td>
            <td>{{ news.description }}</td>
            <td>{{ formatDate(news.created_at) }}</td>
            <td>
              <button @click="editNews(news)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteNews(news.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования новости -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Редактировать новость' : 'Добавить новость' }}</h2>

        <!-- Превью текущих изображений при редактировании -->
        <div v-if="isEditMode && newsForm.image" class="current-images-section">
          <p class="section-title">Текущее изображение:</p>
          <div class="current-image-item">
            <img :src="getImageUrl(newsForm.image)" alt="Текущее изображение" class="current-image" />
            <button type="button" @click="removeCurrentImage" class="remove-image-btn">×</button>
          </div>
        </div>

        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title">Заголовок:</label>
            <input type="text" v-model="newsForm.title" id="title" required />
          </div>
          <div class="form-group">
            <label for="description">Описание:</label>
            <textarea v-model="newsForm.description" id="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="image">Изображение:</label>
            <input type="file" ref="imageInput" @change="handleImageChange" id="image" accept="image/*" />
            <p>Поддерживаемые форматы: JPG, PNG, GIF</p>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">
              {{ isEditMode ? 'Сохранить изменения' : 'Добавить' }}
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config';

export default {
  name: 'AdminNews',
  data() {
    return {
      news: [],
      filteredNews: [],
      searchQuery: '',
      isModalOpen: false,  // Проверяем, что оно true для отображения модалки
      isEditMode: false,   // Режим редактирования
      newsForm: {
        id: null,
        title: '',
        description: '',
        image: null,
      },
      selectedImageFile: null,
    };
  },
  methods: {
    getImageUrl(imagePath) {
      return `${MEDIA_API_URL}${imagePath}`;
    },

    async fetchNews() {
      try {
        const response = await axios.get(`${MEDIA_API_URL}/admin-panel/news/`);
        this.news = response.data;
        this.filteredNews = this.news;
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      }
    },

    openAddNewsModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.newsForm = { id: null, title: '', description: '', image: null };
      this.selectedImageFile = null;
      this.$refs.imageInput.value = '';
    },

    closeModal() {
      this.isModalOpen = false;
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedImageFile = file;
      }
    },

    removeCurrentImage() {
      this.newsForm.image = null;
      this.selectedImageFile = null;
    },

    async submitForm() {
      const formData = new FormData();
      formData.append('title', this.newsForm.title);
      formData.append('description', this.newsForm.description);
      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
      }

      try {
        if (this.isEditMode) {
          await axios.put(`${MEDIA_API_URL}/admin-panel/news/${this.newsForm.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          await axios.post(`${MEDIA_API_URL}/admin-panel/news/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        this.fetchNews();
        this.closeModal();
      } catch (error) {
        console.error('Ошибка при отправке данных формы:', error);
      }
    },

    filterNews() {
      this.filteredNews = this.news.filter(news =>
        news.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        news.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    async deleteNews(id) {
      try {
        await axios.delete(`${MEDIA_API_URL}/admin-panel/news/${id}/`);
        this.fetchNews();
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
      }
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    },
  },
  created() {
    this.fetchNews();
  },
};
</script>

<style scoped>


.edit-btn {
  background-color: #000F42; /* Темно-синий для редактирования */
  color: white;
  border: none;
}

.edit-btn:hover {
  background-color: #003366; /* Более темный синий при наведении */
}

/* Кнопка удаления */
.delete-btn {
  background-color: #dc3545; /* Красный для удаления */
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #c82333; /* Более темный красный при наведении */
}

.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
}



.link-back {
  display: inline-flex;
  align-items: center;
  padding: 8px 8px 6px;
  padding-left: 28px;
  color: #262a31;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: .01em;
  text-transform: uppercase;
  background-color: #f5f7f8;
  border-radius: 8px;
  position: relative;
  line-height: 13px;
  text-decoration: none;
}

.link-back:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: url(assets/svg/arrow-left.svg) no-repeat center center;
  background-size: contain;
}

/* На десктопах кнопки рядом */
@media (min-width: 768px) {
  .action-btn {
    margin-right: 10px; /* Отступ справа для кнопок */
  }

  /* Для последней кнопки в ряду не добавляем отступ */
  .action-btn:last-child {
    margin-right: 0;
  }
}

/* На мобильных устройствах кнопки друг под другом */
@media (max-width: 767px) {
  .action-btn {
    margin-bottom: 10px; /* Отступ снизу для кнопок */
    width: 100%; /* Ширина кнопок на мобильных устройствах */
  }

  /* Убираем отступ снизу для последней кнопки */
  .action-btn:last-child {
    margin-bottom: 0;
  }
}

.admin-news {
  padding: 30px;
  font-family: 'Montserrat', sans-serif;
}

.page-header {
  text-align: left;
  margin-bottom: 1rem;
}

.page-header h1 {
  font-size: 30px;
  margin: 0;
  color: #000F42;
}

.page-header p {
  font-size: 15px;
  color: #555;
}

.filters {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.search-input {
  height: 40px;
  padding: 0 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  max-width: 400px;
  box-sizing: border-box;
}

.add-news-btn {
  margin-left: 10px;
  background-color: #000F42;
  color: #fff;
  border: none;
  font-size: 24px;
  width: 45px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-news-btn:hover {
  background-color: #003366;
}

.plus-icon {
  font-size: 24px;
  font-weight: bold;
}

.table-responsive {
  overflow-x: auto;
}

.news-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.news-table th, .news-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.news-table th {
  background-color: #f4f4f4;
}

.news-table th#first {
  background-color: #f4f4f4;
  border-top-left-radius: 15px;
}

.news-table th#last {
  background-color: #f4f4f4;
  border-top-right-radius: 15px;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* Тёмный фон */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.link-back {
  display: inline-flex;
  align-items: center;
  padding: 8px 8px 6px;
  padding-left: 28px;
  color: #262a31;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: .01em;
  text-transform: uppercase;
  background-color: #f5f7f8;
  border-radius: 8px;
  position: relative;
  line-height: 13px;
  text-decoration: none;
}

.link-back:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: url(assets/svg/arrow-left.svg) no-repeat center center;
  background-size: contain;
}


.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button[type="submit"] {
  background-color: #000F42;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
}

button[type="button"] {
  background-color: #6c757d;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
}
</style>
