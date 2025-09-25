<template>
  <div class="admin-page"> <!-- Изменил класс -->
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
        placeholder="Поиск по заголовку, описанию или URL" 
        @input="filterNews" 
        class="search-input"
      />
      <!-- Плюсик для добавления новости -->
      <button class="add-btn" @click="openAddNewsModal"> <!-- Изменил класс -->
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с новостями -->
    <div class="table-responsive">
      <table class="data-table"> <!-- Изменил класс -->
        <thead>
          <tr>
            <th id="first">Заголовок</th> <!-- Добавил id для скругления -->
            <th>Описание</th>
            <th>URL</th>
            <th>Дата</th>
            <th id="last">Действия</th> <!-- Добавил id для скругления -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="news in filteredNews" :key="news.id">
            <td>{{ news.title }}</td>
            <td>{{ news.description }}</td>
            <td>
              <a :href="news.url" target="_blank" class="url-link" v-if="news.url">
                {{ truncateUrl(news.url) }}
              </a>
              <span v-else class="no-url">—</span>
            </td>
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
            <label for="url">URL ссылка:</label>
            <input type="url" v-model="newsForm.url" id="url" placeholder="https://example.com" />
            <small>Необязательное поле</small>
          </div>
          <div class="form-group">
            <label for="image">Изображение:</label>
            <input type="file" ref="imageInput" @change="handleImageChange" id="image" accept="image/*" />
            <p class="file-hint">Поддерживаемые форматы: JPG, PNG, GIF</p> <!-- Добавил класс -->
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
import '@/assets/css/common-admin.css';
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config';

export default {
  name: 'AdminNews',
  data() {
    return {
      news: [],
      filteredNews: [],
      searchQuery: '',
      isModalOpen: false,
      isEditMode: false,
      newsForm: {
        id: null,
        title: '',
        description: '',
        url: '',
        image: null,
      },
      selectedImageFile: null,
    };
  },
  methods: {
    async fetchNews() {
      try {
        const response = await axios.get(`${MEDIA_API_URL}/admin-panel/news/`);
        this.news = response.data.results || response.data;
        this.filteredNews = this.news;
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      }
    },

    filterNews() {
      if (!this.searchQuery) {
        this.filteredNews = this.news;
        return;
      }
      
      const query = this.searchQuery.toLowerCase();
      this.filteredNews = this.news.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.url && item.url.toLowerCase().includes(query))
      );
    },

    openAddNewsModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.newsForm = { 
        id: null, 
        title: '', 
        description: '', 
        url: '', 
        image: null 
      };
      this.selectedImageFile = null;
      
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
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

    truncateUrl(url) {
      if (url.length > 40) {
        return url.substring(0, 40) + '...';
      }
      return url;
    },

    async submitForm() {
      const formData = new FormData();
      formData.append('title', this.newsForm.title);
      formData.append('description', this.newsForm.description);
      formData.append('url', this.newsForm.url || '');
      
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
        console.error('Детали ошибки:', error.response?.data);
      }
    },

    async deleteNews(id) {
      if (confirm('Вы уверены, что хотите удалить эту новость?')) {
        try {
          await axios.delete(`${MEDIA_API_URL}/admin-panel/news/${id}/`);
          this.fetchNews();
        } catch (error) {
          console.error('Ошибка при удалении новости:', error);
        }
      }
    },

    getImageUrl(imagePath) {
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return `${MEDIA_API_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    },

    editNews(news) {
      this.isModalOpen = true;
      this.isEditMode = true;
      
      this.newsForm = {
        id: news.id,
        title: news.title,
        description: news.description,
        url: news.url || '',
        image: news.image
      };
      
      this.selectedImageFile = null;
      
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },
  },
  created() {
    this.fetchNews();
  },
};
</script>

<style scoped>

</style>
